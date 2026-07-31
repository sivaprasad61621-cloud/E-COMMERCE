import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import supabase from '../config/supabase.js';
import { similaritySearch } from '../services/aiService.js';
import rateLimit from 'express-rate-limit';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { memorySessions, memoryMessages } from '../services/memoryStore.js';
import { mockProducts } from '../controllers/products.js';
import SearchEngine from '../services/searchService.js';

const router = express.Router();

// Define express rate limiter for the chat routing
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // limit each IP to 50 requests per window
  message: {
    status: 'error',
    message: 'Too many messages sent. Please wait a moment and try again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/chat/status
router.get('/status', async (req, res) => {
  res.json({
    status: 'online',
    message: 'Velora AI Chat engine running smoothly',
    mode: process.env.OPENAI_API_KEY ? 'live' : 'mock/offline'
  });
});

// POST /api/chat/message
router.post('/message', chatLimiter, async (req, res) => {
  const { message, sessionToken, namespace, customerId } = req.body;
  if (!message || !sessionToken) {
    return res.status(400).json({ error: 'message and sessionToken are required' });
  }

  const targetNamespace = namespace || 'general';
  let sessionId = null;
  let useInMemory = false;

  // 1. Resolve Session in PostgreSQL
  try {
    if (supabase) {
      let { data: session, error } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_token', sessionToken)
        .maybeSingle();

      if (error) throw error;

      if (!session) {
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            session_token: sessionToken,
            customer_id: customerId || null,
            user_agent: req.headers['user-agent'] || null,
            ip_address: req.ip || null
          })
          .select()
          .single();

        if (createError) throw createError;
        sessionId = newSession.id;
      } else {
        sessionId = session.id;
      }
    } else {
      useInMemory = true;
    }
  } catch (error) {
    console.warn('[Chat Router] Database session error, using in-memory store fallback:', error.message);
    useInMemory = true;
  }

  if (useInMemory) {
    let session = memorySessions.find(s => s.session_token === sessionToken);
    if (!session) {
      session = {
        id: 'mem-sess-' + Date.now(),
        session_token: sessionToken,
        customer_id: customerId || null,
        user_agent: req.headers['user-agent'] || null,
        ip_address: req.ip || null,
        created_at: new Date().toISOString()
      };
      memorySessions.push(session);
    }
    sessionId = session.id;
  }

  // 2. Perform similarity search in Vector Store (Pinecone or Local Fallback)
  let contextDocs = [];
  try {
    contextDocs = await similaritySearch(message, targetNamespace, 3);
  } catch (error) {
    console.error('[Chat Router] Vector search error:', error.message);
  }

  // 2b. Live product catalog search matching
  let matchedProducts = [];
  try {
    let allProds = [...mockProducts];
    if (supabase) {
      const { data } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        const existingSkus = new Set(data.map(p => p.sku));
        mockProducts.forEach(mP => {
          if (!existingSkus.has(mP.sku)) {
            data.push(mP);
          }
        });
        allProds = data;
      }
    }

    // Filter message to avoid false positive product search matches on policy/FAQ questions
    const policyAndStopWords = new Set([
      'ship', 'shipping', 'delivery', 'deliver', 'dispatch', 'return', 'returns', 'refund', 'refunds',
      'exchange', 'cancellation', 'cancellations', 'cancel', 'payment', 'payments', 'pay', 'cod', 'card',
      'track', 'tracking', 'order', 'orders', 'status', 'support', 'contact', 'help', 'website', 'store',
      'do', 'does', 'did', 'you', 'your', 'we', 'us', 'i', 'me', 'my', 'he', 'she', 'they', 'it', 'have',
      'has', 'had', 'offer', 'offers', 'offered', 'sell', 'sells', 'buy', 'buys', 'shop', 'ask', 'tell',
      'show', 'give', 'please', 'want', 'like', 'need', 'about', 'any', 'some', 'what', 'when', 'where',
      'how', 'who', 'why', 'which'
    ]);

    const filteredQuery = message
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 0 && !policyAndStopWords.has(w))
      .join(' ');

    if (filteredQuery.trim().length > 0) {
      const searchRes = SearchEngine.search(allProds, { q: filteredQuery, limit: 5 });
      if (searchRes && searchRes.hits && searchRes.hits.length > 0) {
        matchedProducts = searchRes.hits;
      }
    }
  } catch (searchErr) {
    console.warn('[Chat Router] Catalog product search failed:', searchErr.message);
  }

  // Build product context snippets for RAG
  let productContextText = '';
  if (matchedProducts.length > 0) {
    productContextText = matchedProducts.map(p => {
      const discPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
      const formattedPrice = `₹${Math.round(discPrice).toLocaleString('en-IN')}`;
      const originalPrice = `₹${p.price.toLocaleString('en-IN')}`;
      const stockStatus = p.stock > 0 ? `In Stock (allocation pool: ${p.stock})` : 'Out of Stock';
      return `[Product Archive Source: ${p.name}]
Name: ${p.name}
SKU: ${p.sku}
Original Price: ${originalPrice}
Discount: ${p.discount}%
Effective Price: ${formattedPrice}
Stock Status: ${stockStatus}
Description: ${p.description || 'No description available'}
Product Link: [View Product Details](/product/${p.id})`;
    }).join('\n\n');
  }

  // Build the text context from matches
  let contextText = contextDocs.length > 0
    ? contextDocs.map(doc => `[Source: ${doc.title}] ${doc.text}`).join('\n\n')
    : 'No relevant documentation found.';

  if (productContextText) {
    contextText = `${productContextText}\n\n${contextText}`;
  }

  // 3. Retrieve conversation history
  let historyMessages = [];
  if (supabase && sessionId && !useInMemory) {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('sender, message')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (data) {
        historyMessages = data;
      }
    } catch (err) {
      console.error('[Chat Router] History retrieval failed:', err.message);
    }
  } else {
    // Read from memory fallback
    historyMessages = memoryMessages
      .filter(m => m.session_id === sessionId)
      .slice(-10);
  }

  // 4. Invoke LLM or Fallback to Simulated RAG response
  let answer = '';
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const model = new ChatOpenAI({
        openAIApiKey: openaiKey,
        configuration: {
          baseURL: process.env.OPENAI_BASE_URL || undefined,
        },
        modelName: 'gpt-4o-mini',
        temperature: 0.3
      });

      const systemPrompt = `You are the Velora AI Shopping Concierge, representing Velora E-Commerce. 
Your tone must reflect our design ethos: classic, publication-grade, intellectual, yet concise and helpful. 

Answer the customer's queries using ONLY the context provided below. If the context does not contain the answer, state politely that you don't have that information on hand and offer to connect them to support (support@velora.com).

When the customer is asking about a product or item from the catalog, make sure to:
1. Provide correct, exact details (pricing, stock, features) from the [Product Archive Source] context.
2. ALWAYS provide the product link exactly as given in the context (in markdown format, e.g., [View Product Details](/product/product-id)).

---
RELEVANT KNOWLEDGE CONTEXT:
${contextText}
---`;

      const chatMessages = [new SystemMessage(systemPrompt)];
      
      historyMessages.forEach(msg => {
        if (msg.sender === 'user') {
          chatMessages.push(new HumanMessage(msg.message));
        } else {
          chatMessages.push(new AIMessage(msg.message));
        }
      });

      chatMessages.push(new HumanMessage(message));

      const response = await model.invoke(chatMessages);
      answer = response.content;
    } catch (err) {
      console.error('[Chat Router] LLM invocation failure:', err.message);
      answer = `I apologize, but I am experiencing temporary connectivity difficulties. Here is what I retrieved from our archives:\n\n${contextText}`;
    }
  } else {
    // Offline / Mock response mode simulating RAG responses
    console.log('[Chat Router] Running in mock/offline mode.');
    const msgLower = message.toLowerCase();
    // Determine if this is a high-confidence policy query
    const isPolicyQuery = contextDocs.length > 0 && 
      contextDocs[0].score >= 0.5 && 
      (msgLower.includes('return') || msgLower.includes('refund') || msgLower.includes('exchange') ||
       msgLower.includes('ship') || msgLower.includes('deliver') || msgLower.includes('dispatch') ||
       msgLower.includes('cancel') || msgLower.includes('pay') || msgLower.includes('cod') ||
       msgLower.includes('card') || msgLower.includes('track') || msgLower.includes('order status') ||
       msgLower.includes('damage') || msgLower.includes('defect') || msgLower.includes('broken'));

    // Prioritize catalog product details if search engine found matching items, unless this is a policy question
    if (matchedProducts.length > 0 && !isPolicyQuery) {
      if (matchedProducts.length === 1) {
        const p = matchedProducts[0];
        const discPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        const formattedPrice = `₹${Math.round(discPrice).toLocaleString('en-IN')}`;
        const originalPrice = p.discount > 0 ? `~~₹${p.price.toLocaleString('en-IN')}~~ ` : '';
        const discountBadge = p.discount > 0 ? ` (${p.discount}% OFF)` : '';
        const stockStatus = p.stock > 0 
          ? `Available (Allocation Pool: ${p.stock} units remaining)` 
          : `Out of Stock / Depleted`;
        
        answer = `Welcome to the Velora Concierge.

Here is the ledger information for the requested item:

**${p.name}**
- **Price:** ${originalPrice}${formattedPrice}${discountBadge}
- **Status:** ${stockStatus}
- **SKU:** \`${p.sku}\`
- **Description:** ${p.description || 'No additional details available.'}

You can inspect the product gallery, check specifications, or complete checkout here:
👉 **[View Product Details](/product/${p.id})**`;
      } else {
        const prodList = matchedProducts.map(p => {
          const discPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
          const formattedPrice = `₹${Math.round(discPrice).toLocaleString('en-IN')}`;
          const originalPrice = p.discount > 0 ? `~~₹${p.price.toLocaleString('en-IN')}~~ ` : '';
          const discountBadge = p.discount > 0 ? ` (${p.discount}% OFF)` : '';
          const stockInfo = p.stock > 0 ? `In Stock` : `Out of Stock`;
          return `• **${p.name}** — ${originalPrice}${formattedPrice}${discountBadge} | *${stockInfo}*\n  ${p.description ? p.description.substring(0, 120) + '...' : ''}\n  👉 **[View Item Details](/product/${p.id})**`;
        }).join('\n\n');

        answer = `Welcome to the Velora Concierge.

I located the following matching items in our catalog:

${prodList}

Feel free to ask for details on any specific item, or view them using the links provided above!`;
      }
    } else if (contextDocs.length > 0 && contextDocs[0].score >= 0.5) {
      const topDoc = contextDocs[0];
      answer = `Welcome to the Velora Concierge.\n\nRegarding your query, here is what I located in our "${topDoc.title}" archives:\n\n${topDoc.text}\n\nIs there anything else I can assist you with today?`;
    } else {
      // Smart Fallback Intent Matcher for standard e-commerce & website queries
      if (msgLower.includes('return') || msgLower.includes('refund') || msgLower.includes('exchange')) {
        answer = `Welcome to the Velora Concierge.\n\nWe offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can return the item within 7 days of delivery for a full refund. Items must be in original, unused condition with all tags and packaging intact.`;
      } else if (msgLower.includes('ship') || msgLower.includes('deliver') || msgLower.includes('dispatch') || msgLower.includes('days')) {
        answer = `Welcome to the Velora Concierge.\n\nStandard delivery takes 3–5 business days across India (Free shipping on orders over ₹999). Express delivery (1–2 business days) is also available at checkout. Track your shipment anytime under "Track Order" with your Order ID.`;
      } else if (msgLower.includes('cancel')) {
        answer = `Welcome to the Velora Concierge.\n\nOrders can be cancelled within 24 hours of placement provided they have not yet been packed or shipped. You can cancel directly from your Profile > Orders tab or by emailing support@velora.in.`;
      } else if (msgLower.includes('pay') || msgLower.includes('cod') || msgLower.includes('upi') || msgLower.includes('card')) {
        answer = `Welcome to the Velora Concierge.\n\nWe accept Visa, Mastercard, UPI, Net Banking, Cash on Delivery (COD), and all major digital wallets. All payment transactions are 100% secure and encrypted.`;
      } else if (msgLower.includes('track') || msgLower.includes('order status')) {
        answer = `Welcome to the Velora Concierge.\n\nYou can track your order status in real time by visiting the "Track Order" page in the top navigation bar and entering your Order ID (e.g., ORD-0921).`;
      } else if (msgLower.includes('damage') || msgLower.includes('defect') || msgLower.includes('broken')) {
        answer = `Welcome to the Velora Concierge.\n\nIf you received a damaged or defective product, please take photos of the item and contact us within 48 hours of delivery at support@velora.in. We will arrange an immediate replacement or full refund.`;
      } else if (msgLower.includes('website') || msgLower.includes('feature') || msgLower.includes('site') || msgLower.includes('about') || msgLower.includes('category') || msgLower.includes('what do you sell') || msgLower.includes('what items')) {
        answer = `Welcome to Velora — Simple. Smart. Shopping.\n\nOur store offers 6 curated departments:\n1. 💻 **Electronics**: Laptops (MacBook Air M2), Phones (iPhone 15 Pro), Audio (Sony WH-1000XM5, AirPods Pro), Smartwatches, PS5, Cameras.\n2. 👗 **Fashion & Apparel**: Cashmere sweaters, Jackets (Patagonia), Midi dresses, Sneakers (Nike AF1), Leather wallets & Luggage.\n3. 🏡 **Home & Kitchen**: Designer lamps, Pour-over coffee makers, Dutch ovens, Sheesham wood beds, Leather sofas, Water purifiers.\n4. 💄 **Beauty & Health**: Antioxidant serums, Ceramides moisturizers, Australian clay masks, Hair bonding oils, Organic Essential oils.\n5. 🏋️ **Sports & Outdoors**: Resistance bands, Adjustable dumbbells, Backpacking tents, Hydro Flasks, Yoga mats, Cricket & Volleyball gear.\n6. 📚 **Books & Stationery**: Bestselling novels (Atomic Habits, Sapiens), Vintage leather journals, Fountain pens, Art pencils.\n\n**Website Features**: Instant Search, Live Order Tracking, Wishlist, Multi-payment Checkout (UPI, Card, COD), and 24/7 AI Concierge Assistance.`;
      } else {
        answer = `Thank you for contacting the Velora Concierge. I searched our website archives and product catalog but could not locate specific details for your query.\n\nYou can browse our catalog categories in the top navigation bar or contact our team at support@velora.in for personalized assistance!`;
      }
    }
  }

  // 5. Store conversation log
  const productSources = matchedProducts.map(p => ({ title: p.name, score: 1.0 }));
  const combinedSources = [...productSources, ...contextDocs.map(d => ({ title: d.title, score: d.score }))];

  const userMsgLog = {
    id: 'mem-msg-' + Date.now() + '-1',
    session_id: sessionId,
    sender: 'user',
    message: message,
    created_at: new Date().toISOString()
  };
  const assistantMsgLog = {
    id: 'mem-msg-' + Date.now() + '-2',
    session_id: sessionId,
    sender: 'assistant',
    message: answer,
    sources: combinedSources,
    created_at: new Date().toISOString()
  };

  // Log inside in-memory buffers
  memoryMessages.push(userMsgLog, assistantMsgLog);

  if (supabase && sessionId && !useInMemory) {
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'user',
        message: message
      });

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'assistant',
        message: answer,
        sources: combinedSources
      });
    } catch (err) {
      console.error('[Chat Router] Saving messages history failed:', err.message);
    }
  }

  // Return the result
  res.json({
    message: answer,
    sources: combinedSources
  });
});

// GET /api/chat/admin/sessions - List all chat sessions
router.get('/admin/sessions', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    let dbSessions = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select(`
            id,
            session_token,
            user_agent,
            ip_address,
            created_at,
            customer:customers(first_name, last_name, email)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          dbSessions = data;
        }
      } catch (dbErr) {
        console.warn('[Chat Router] DB sessions fetch failed. Using memory store.');
      }
    }

    // Combine with memorySessions
    const combined = [...memorySessions];
    dbSessions.forEach(dbS => {
      if (!combined.some(mS => mS.id === dbS.id)) {
        combined.unshift(dbS);
      }
    });

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/admin/sessions/:sessionId - List all messages in a session
router.get('/admin/sessions/:sessionId', requireAuth, requireRole(['admin']), async (req, res) => {
  const { sessionId } = req.params;
  try {
    let dbMessages = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          dbMessages = data;
        }
      } catch (dbErr) {
        console.warn('[Chat Router] DB messages fetch failed. Using memory store.');
      }
    }

    // Combine with memoryMessages
    const combined = memoryMessages.filter(m => m.session_id === sessionId);
    dbMessages.forEach(dbM => {
      if (!combined.some(mM => mM.id === dbM.id)) {
        combined.push(dbM);
      }
    });

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/admin/analytics - Retrieve aggregated stats
router.get('/admin/analytics', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    let totalSessions = memorySessions.length;
    let totalMessages = memoryMessages.length;
    let hitRate = 0;

    const assistantMessages = memoryMessages.filter(m => m.sender === 'assistant');
    if (assistantMessages.length > 0) {
      const hits = assistantMessages.filter(m => m.sources && m.sources.length > 0).length;
      hitRate = parseFloat(((hits / assistantMessages.length) * 100).toFixed(1));
    }

    if (supabase) {
      try {
        const { count: dbTotalSessions } = await supabase
          .from('chat_sessions')
          .select('*', { count: 'exact', head: true });

        const { data: dbMessages } = await supabase
          .from('chat_messages')
          .select('sender, sources');

        if (dbTotalSessions) totalSessions += dbTotalSessions;
        if (dbMessages) {
          totalMessages += dbMessages.length;
          const dbAssistant = dbMessages.filter(m => m.sender === 'assistant');
          if (dbAssistant.length > 0) {
            const dbHits = dbAssistant.filter(m => m.sources && m.sources.length > 0).length;
            hitRate = parseFloat((((hits + dbHits) / (assistantMessages.length + dbAssistant.length)) * 100).toFixed(1));
          }
        }
      } catch (dbErr) {
        console.warn('[Chat Router] DB analytics query failed. Using memory store stats.');
      }
    }

    let avgMessages = 0;
    if (totalMessages > 0 && totalSessions > 0) {
      avgMessages = parseFloat((totalMessages / totalSessions).toFixed(1));
    }

    res.json({
      totalSessions,
      hitRate,
      averageMessages: avgMessages,
      escalations: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
