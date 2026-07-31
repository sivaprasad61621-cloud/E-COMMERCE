// Shared in-memory data store for local/offline fallbacks
export const memoryDocuments = [
  {
    id: 'doc-faq-website-overview-00',
    title: 'Velora Website & Store Features Overview',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora E-Commerce Platform & Website Features:
- Platform Ethos: Vintage editorial design aesthetic combined with fast modern shopping experience.
- Navigation & Discovery: Top Bar with Live Clock, Search Bar with real-time auto-suggestions, Category Drawer (Electronics, Fashion & Apparel, Home & Kitchen, Beauty & Health, Sports & Outdoors, Books & Stationery), Best Sellers, New Arrivals, Today's Deals, and Offers.
- Customer Features: User Profile, Saved Addresses, Order History, Real-time Order Tracking by Order ID (e.g. ORD-0921), Wishlist, Shopping Cart Drawer, and 24/7 AI Concierge Chatbot.
- Admin Features: Dashboard analytics, Product Catalog Manager, Order Lifecycle Controls, Inventory Management, Customer Management, Knowledge Base Archive Ingestion.`
  },
  {
    id: 'doc-faq-returns-01',
    title: 'Return and Refund Policy',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Return & Refund Policy:
- We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can return the item within 7 days of delivery for a full refund.
- Items must be in original, unused condition with all tags and packaging intact.
- Refunds are processed to your original payment method within 3–5 business days after inspection.
- For damaged, defective, or incorrect products, please contact us within 48 hours of delivery at support@velora.in with photographs for an immediate replacement or full refund.`
  },
  {
    id: 'doc-faq-shipping-02',
    title: 'Shipping and Delivery Policy',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Shipping & Delivery Policy:
- Standard Delivery: Takes 3–5 business days across India. Free shipping on orders over ₹999.
- Express Delivery: Available at checkout for 1–2 business day delivery.
- Tracking: Track your shipment anytime on the "Track Order" page using your Order ID (e.g., ORD-0921).`
  },
  {
    id: 'doc-faq-cancellation-03',
    title: 'Order Cancellation Policy',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Order Cancellation Policy:
- Orders can be cancelled within 24 hours of placement provided they have not yet been packed or shipped.
- You can cancel directly from your Profile > Orders tab or by reaching out to support@velora.in.`
  },
  {
    id: 'doc-faq-payments-04',
    title: 'Payment Methods & Security',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Payment Methods:
- We accept Visa, Mastercard, UPI, Net Banking, Cash on Delivery (COD), and major digital wallets.
- All payments are 100% encrypted and secured with bank-grade SSL encryption.`
  },
  {
    id: 'doc-faq-catalog-05',
    title: 'Velora Product Catalog & Inventory List',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Store Product Catalog & Items List:
1. Electronics:
   - Apple MacBook Air M2 (₹99,900) - M2 chip, 13.6" Liquid Retina display, 256GB SSD.
   - Apple iPhone 15 Pro (₹1,34,900) - Titanium design, A17 Pro chip, 48MP main camera.
   - Sony WH-1000XM5 Headphones (₹29,990) - Active noise cancelling, 30h battery.
   - Apple AirPods Pro 2nd Gen (₹24,900) - H2 chip, Adaptive Audio, MagSafe case.
   - Apple Watch Series 9 (₹41,900) - Double tap gesture, S9 SiP chip, ECG tracker.
   - Sonos Era 100 Speaker (₹29,900) - Smart acoustics, AirPlay 2, Trueplay tuning.
   - Dell UltraSharp 27" 4K Monitor (₹58,900) - IPS Black, 98% DCI-P3 color.
   - Fujifilm X-T5 Mirrorless Camera (₹1,69,990) - 40.2MP X-Trans sensor, 6.2K video.
   - Sony PlayStation 5 Console (₹54,990) - Ultra-speed SSD, 4K ray tracing gaming.
   - Samsung T7 Shield 2TB Portable SSD (₹16,500) - Rugged IP65 1050MB/s storage.

2. Fashion & Apparel:
   - Patagonia Better Sweater Fleece (₹12,500) - 100% recycled fleece jacket.
   - Everlane Cashmere Crewneck (₹11,900) - Grade-A cashmere knit sweater.
   - Reformation Juliette Midi Dress (₹19,800) - Slim fitting sweetheart dress.
   - Polo Ralph Lauren Oxford Shirt (₹9,900) - Classic cotton oxford button-down.
   - Nike Air Force 1 '07 (₹7,495) - Classic leather retro low top sneakers.
   - Fjallraven Kanken Backpack (₹6,999) - Waterproof Vinylon Scandinavian pack.
   - Bellroy Hide & Seek Bifold Wallet (₹6,999) - Premium RFID leather wallet.
   - Away The Bigger Carry-On Luggage (₹22,900) - Polycarbonate hard shell spinner.
   - Lululemon Align Yoga Pant (₹8,900) - Buttery-soft weightless Nulu fabric.
   - Ray-Ban Wayfarer Classic (₹9,900) - Iconic acetate frame UV sunglasses.

3. Home & Kitchen:
   - Anglepoise Type 75 Desk Lamp (₹19,900) - Spring mechanism adjustable shade.
   - Flos Arco Floor Lamp (₹1,49,000) - Carrara marble base stainless steel arc lamp.
   - Hario V60 Ceramic Dripper (₹1,999) - Signature pour-over coffee dripper.
   - Baratza Encore Coffee Grinder (₹14,500) - Conical burr, 40 grind settings.
   - Le Creuset Enameled Dutch Oven (₹28,900) - 5.5-Qt round cast iron dutch oven.
   - Furi Hand-Glazed Dinner Plates Set (₹3,999) - 4-piece ceramic dinner set.
   - Herman Miller Eames Lounge Chair (₹2,39,000) - Molded plywood leather lounge chair.
   - Article Sven Tan Leather Sofa (₹1,49,000) - Mid-century modern aniline leather sofa.
   - Flo Solid Sheesham Wood Queen Bed (₹34,900) - Sheesham wood bed frame.
   - Atomberg Renesa Smart BLDC Fan (₹3,899) - Energy-saving 28W ceiling fan.
   - Kent Grand Plus RO Water Purifier (₹16,900) - RO+UV+UF 9L storage purifier.
   - Prestige Marvel Glass 3 Burner Stove (₹4,999) - Toughened glass top gas stove.

4. Beauty & Health:
   - SkinCeuticals C E Ferulic Serum (₹14,900) - Vitamin C antioxidant serum.
   - CeraVe Moisturising Cream (₹1,250) - 3 essential ceramides + hyaluronic acid.
   - Sand & Sky Pink Clay Mask (₹3,490) - Australian pink clay pore refiner.
   - Olaplex No. 7 Bonding Oil (₹2,950) - Concentrated heat protection styling oil.
   - Vitruvi Stone Essential Oil Diffuser (₹11,900) - Ceramic stone ultrasonic diffuser.
   - Supergoop! Unseen Sunscreen SPF 40 (₹3,800) - Weightless invisible primer.

5. Sports & Outdoors:
   - Rogue Monster Bands Set (₹6,900) - Heavy-duty natural latex resistance bands.
   - Bowflex SelectTech 552 Dumbbells (₹34,900) - 5 to 52.5 lbs adjustable pair.
   - Hydro Flask 32 oz Wide Mouth (₹3,990) - Vacuum insulated stainless steel bottle.
   - Manduka PRO Yoga Mat 6mm (₹9,900) - Professional dense cushioning mat.
   - Kookaburra Kahuna Cricket Bat (₹9,500) - English Willow cricket bat.
   - Mikasa V200W Official Volleyball (₹5,400) - FIVB official game volleyball.
   - Spalding TF-1000 Legacy Basketball (₹4,900) - ZK composite leather ball.

6. Books & Stationery:
   - The Midnight Library by Matt Haig (₹499) - Bestselling fiction novel.
   - Atomic Habits by James Clear (₹449) - Tiny habits self-improvement guide.
   - Sapiens: A Brief History of Humankind (₹599) - Yuval Noah Harari bestseller.
   - Vintage Leather Journal with Clasp (₹1,299) - Antique deckle edge leather journal.
   - Leuchtturm1917 A5 Dotted Notebook (₹1,899) - Acid-free bullet journal notebook.
   - Lamy Safari Fountain Pen (₹2,200) - Triangular grip ergonomic pen.`
  },
  {
    id: 'doc-faq-support-06',
    title: 'Customer Support & Contact Info',
    vector_namespace: 'general',
    status: 'indexed',
    text: `Velora Customer Support Contact:
- Email: support@velora.in (or support@velora.com)
- Helpline: 1800-VELORA (24/7 Toll-Free Support)
- Address: Velora E-Commerce HQ, Corporate Towers, India.`
  }
];

export const memorySessions = [];
export const memoryMessages = [];
export const documentTextCache = new Map();

// Pre-fill text cache for memory documents
memoryDocuments.forEach(doc => {
  documentTextCache.set(doc.id, doc.text);
});

console.log('[Memory Store] In-Memory Fallback Store initialized with default Knowledge Base policy archives.');

