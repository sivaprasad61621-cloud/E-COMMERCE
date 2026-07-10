import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const initialCategories = [
  // Electronics Group
  { name: 'Electronics', slug: 'electronics', description: 'Premium electronic devices and accessories' },
  { name: 'Electronics - Laptops', slug: 'electronics-laptops', description: 'High-performance portable computing' },
  { name: 'Electronics - Smartphones', slug: 'electronics-smartphones', description: 'Next-generation cellular devices' },
  { name: 'Electronics - Earbuds & Audio', slug: 'electronics-audio', description: 'Premium portable audio equipment' },

  // Fashion & Apparel Group
  { name: 'Fashion & Apparel', slug: 'fashion-apparel', description: 'Curated apparel and lifestyle wear' },
  { name: 'Fashion & Apparel - Men', slug: 'fashion-apparel-men', description: 'Curated menswear and tailoring' },
  { name: 'Fashion & Apparel - Women', slug: 'fashion-apparel-women', description: 'Premium womenswear and dresses' },
  { name: 'Fashion & Apparel - Children', slug: 'fashion-apparel-children', description: 'Comfortable and organic kids clothing' },

  // Home & Kitchen Group
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Vintage decor and kitchen essentials' },
  { name: 'Home & Kitchen - Kitchenware', slug: 'home-kitchen-kitchenware', description: 'Artisanal coffee and kitchenware' },
  { name: 'Home & Kitchen - Lighting', slug: 'home-kitchen-lighting', description: 'Vintage desk lamps and lighting' },
  { name: 'Home & Kitchen - Tableware', slug: 'home-kitchen-tableware', description: 'Linen tablecloths and tableware' },

  // Beauty & Health Group
  { name: 'Beauty & Health', slug: 'beauty-health', description: 'Skincare, wellness, and personal care' },
  { name: 'Beauty & Health - Skincare', slug: 'beauty-health-skincare', description: 'Natural and organic skincare products' },
  { name: 'Beauty & Health - Haircare', slug: 'beauty-health-haircare', description: 'Premium hair care and styling' },
  { name: 'Beauty & Health - Wellness', slug: 'beauty-health-wellness', description: 'Supplements, aromatherapy, and wellness' },

  // Sports & Outdoors Group
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for active living and outdoor adventures' },
  { name: 'Sports & Outdoors - Fitness', slug: 'sports-outdoors-fitness', description: 'Home gym and workout equipment' },
  { name: 'Sports & Outdoors - Camping', slug: 'sports-outdoors-camping', description: 'Camping and trekking essentials' },
  { name: 'Sports & Outdoors - Yoga', slug: 'sports-outdoors-yoga', description: 'Yoga mats, blocks, and accessories' },

  // Books & Stationery Group
  { name: 'Books & Stationery', slug: 'books-stationery', description: 'Books, journals, and fine writing tools' },
  { name: 'Books & Stationery - Fiction', slug: 'books-stationery-fiction', description: 'Bestselling novels and fiction collections' },
  { name: 'Books & Stationery - Journals', slug: 'books-stationery-journals', description: 'Premium leather journals and notebooks' },
  { name: 'Books & Stationery - Pens', slug: 'books-stationery-pens', description: 'Fountain pens and fine stationery' },
];

const mockProducts = [
  // --- Category Group: Bags (6 products) ---
  {
    name: 'Classic Leather Bag',
    description: 'Equestrian-inspired saddle bag crafted in natural tan leather with thin custom stitching and custom brass buckles.',
    price: 4999,
    discount: 50,
    sku: 'BG-SAD-001',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600'],
    categoryName: 'Bags'
  },
  {
    name: 'Minimalist Canvas Backpack',
    description: 'Durable, double-stitched canvas backpack featuring padded laptop slot, heritage brown leather zipper pulls, and dual side slots.',
    price: 3799,
    discount: 15,
    sku: 'BG-BKP-021',
    stock: 15,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'],
    categoryName: 'Bags - Backpacks'
  },
  {
    name: 'Heritage Travel Backpack',
    description: 'Adventure-grade travel backpack with water-resistant wax coating, compression straps, and hidden valuables pouch.',
    price: 5499,
    discount: 10,
    sku: 'BG-BKP-022',
    stock: 10,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600'],
    categoryName: 'Bags - Backpacks'
  },
  {
    name: 'Travel Leather Duffle',
    description: 'Spacious weekender duffle bag crafted in full-grain dark brown leather with solid metal zippers, matching luggage tags, and detachable shoulder strap.',
    price: 14999,
    discount: 30,
    sku: 'BG-DUF-022',
    stock: 8,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600'],
    categoryName: 'Bags - Duffles & Totes'
  },
  {
    name: 'Suede Shoulder Tote',
    description: 'Elegant slouchy suede leather tote featuring gold magnetic clasp, double handle straps, and micro-fiber interior lining.',
    price: 5899,
    discount: 12,
    sku: 'BG-TOT-023',
    stock: 14,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600'],
    categoryName: 'Bags - Duffles & Totes'
  },
  {
    name: 'Leather Card Wallet',
    description: 'Slim bi-fold card holder crafted in vegetable-tanned leather, containing 6 dedicated slots and RFID shielding technology.',
    price: 1999,
    discount: 10,
    sku: 'BG-WLT-024',
    stock: 25,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1627124156297-9d42b28d94e1?q=80&w=600'],
    categoryName: 'Bags - Wallets & Holders'
  },

  // --- Category Group: Electronics (6 products) ---
  {
    name: 'Premium Slate Laptop',
    description: 'Unbelievably sleek slate-grey laptop with 14-inch retina display, ultra-quiet fan profiles, and custom aluminum enclosure.',
    price: 84999,
    discount: 10,
    sku: 'EL-LAP-001',
    stock: 8,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=600'],
    categoryName: 'Electronics - Laptops'
  },
  {
    name: 'Classic Style Smartphone',
    description: 'High-contrast mobile telephone featuring a minimal tactile frame, premium night sight cameras, and clean interface.',
    price: 49999,
    discount: 15,
    sku: 'EL-MOB-001',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600'],
    categoryName: 'Electronics - Smartphones'
  },
  {
    name: 'Wireless Headphones',
    description: 'Studio-quality wireless over-ear headphones with custom brass accents, padded headband, and active noise control.',
    price: 3499,
    discount: 49,
    sku: 'EL-HDP-002',
    stock: 18,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'],
    categoryName: 'Electronics - Earbuds & Audio'
  },
  {
    name: 'Vintage Turntable',
    description: 'Three-speed belt-driven record player enclosed in a walnut wood casing, featuring built-in stereo speakers and Bluetooth pairing.',
    price: 12999,
    discount: 15,
    sku: 'EL-TRN-007',
    stock: 6,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600'],
    categoryName: 'Electronics - Earbuds & Audio'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Premium mechanical layout keyboard with tactile brown switches, backlighting, solid aluminum frame, and round vintage typewriter-style keycaps.',
    price: 6999,
    discount: 20,
    sku: 'EL-KEY-009',
    stock: 11,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600'],
    categoryName: 'Electronics'
  },
  {
    name: 'Vintage Film Camera',
    description: 'Fully mechanical 35mm rangefinder style film camera featuring manual focal alignment, cold-shoe mount, and high-aperture custom lens.',
    price: 18999,
    discount: 25,
    sku: 'EL-CAM-010',
    stock: 4,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600'],
    categoryName: 'Electronics'
  },

  // --- Category Group: Fashion (6 products) ---
  {
    name: 'Vintage Trench Coat',
    description: 'Double-breasted timeless trench coat tailored in high-density cotton gabardine, featuring back storm shield and vintage print flannel interior.',
    price: 8999,
    discount: 15,
    sku: 'FA-MEN-011',
    stock: 7,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600'],
    categoryName: 'Fashion - Men'
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Rugged vintage-wash denim trucker jacket featuring double chest pockets, custom metal rivets, and warm corduroy collar detail.',
    price: 4999,
    discount: 20,
    sku: 'FA-MEN-012',
    stock: 16,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600'],
    categoryName: 'Fashion - Men'
  },
  {
    name: 'Cashmere Knit Sweater',
    description: 'Luxuriously soft crewneck sweater knit from 100% grade-A cashmere, featuring ribbed cuffs, hem, and collar.',
    price: 6499,
    discount: 12,
    sku: 'FA-WMN-013',
    stock: 9,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600'],
    categoryName: 'Fashion - Women'
  },
  {
    name: 'Linen Summer Dress',
    description: 'A-line lightweight dress woven in Belgian linen, featuring delicate mother-of-pearl buttons, double side pockets, and adjustable waist tie.',
    price: 3999,
    discount: 10,
    sku: 'FA-WMN-014',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'],
    categoryName: 'Fashion - Women'
  },
  {
    name: "Kid's Denim Dungarees",
    description: "Comfortable and durable organic denim overalls for active children, featuring side button closures and adjustable suspender buckles.",
    price: 2999,
    discount: 10,
    sku: 'FA-CHD-015',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600'],
    categoryName: 'Fashion - Children'
  },
  {
    name: "Toddler's Knit Cardigan",
    description: "Soft, hypoallergenic organic cotton knit cardigan featuring wooden loop buttons and comfortable rib knit collar.",
    price: 2499,
    discount: 15,
    sku: 'FA-CHD-016',
    stock: 15,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600'],
    categoryName: 'Fashion - Children'
  },

  // --- Category Group: Home & Kitchen (6 products) ---
  {
    name: 'Industrial Desk Lamp',
    description: 'Heavy iron base mechanical arm desk lamp featuring vintage Edison lightbulb, brass hardware joints, and tactile woven cord.',
    price: 2499,
    discount: 20,
    sku: 'HK-LMP-016',
    stock: 14,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600'],
    categoryName: 'Home & Kitchen - Lighting'
  },
  {
    name: 'Ceramic Coffee Dripper',
    description: 'Minimalist matte-white ceramic pour-over cone coffee dripper designed to maintain water temperature for rich filter coffee extraction.',
    price: 1899,
    discount: 15,
    sku: 'HK-DRP-017',
    stock: 20,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=600'],
    categoryName: 'Home & Kitchen - Kitchenware'
  },
  {
    name: 'French Press Coffee Maker',
    description: 'Premium heat-resistant borosilicate glass carafe press featuring double mesh stainless steel plunger filter and matte copper frame wrap.',
    price: 2999,
    discount: 25,
    sku: 'HK-FRP-018',
    stock: 10,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600'],
    categoryName: 'Home & Kitchen - Kitchenware'
  },
  {
    name: 'Aromatic Soy Candle Set',
    description: 'Set of three hand-poured soy wax candles infused with natural essential oils (Sandlewood, Lavender, and Bergamot) in dark amber glass jars.',
    price: 1499,
    discount: 10,
    sku: 'HK-CNL-019',
    stock: 30,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600'],
    categoryName: 'Home & Kitchen'
  },
  {
    name: 'Handwoven Linen Tablecloth',
    description: 'Natural oatmeal color linen tablecloth woven by hand, featuring refined fringe borders and standard table proportions.',
    price: 3299,
    discount: 18,
    sku: 'HK-TAB-020',
    stock: 14,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600'],
    categoryName: 'Home & Kitchen - Tableware'
  },
  {
    name: 'Porcelain Dinnerware Set',
    description: 'Set of 4 hand-glazed porcelain plates featuring dynamic uneven rings and neutral earth-toned matte borders.',
    price: 4999,
    discount: 15,
    sku: 'HK-DIN-021',
    stock: 8,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600'],
    categoryName: 'Home & Kitchen - Tableware'
  },

  // --- Category Group: Shoes (6 products) ---
  {
    name: 'Casual Sneakers',
    description: 'Minimalist low-top casual sneakers crafted in organic beige canvas and flexible gum soles.',
    price: 2999,
    discount: 50,
    sku: 'SH-SNK-004',
    stock: 22,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600'],
    categoryName: 'Shoes - Sneakers'
  },
  {
    name: 'Classic Canvas Low-Tops',
    description: 'Heritage-inspired simple canvas shoes featuring vulcanized rubber toe box, flat white laces, and padded inner soles.',
    price: 3299,
    discount: 10,
    sku: 'SH-CAN-028',
    stock: 18,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600'],
    categoryName: 'Shoes - Sneakers'
  },
  {
    name: 'Classic Chelsea Boots',
    description: 'Sleek slip-on ankle boots crafted in premium black leather, featuring durable elasticated side gussets and pull tabs.',
    price: 9999,
    discount: 25,
    sku: 'SH-CHB-026',
    stock: 6,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600'],
    categoryName: 'Shoes - Boots'
  },
  {
    name: 'Suede Desert Boots',
    description: 'Traditional lace-up desert boots crafted in soft beige suede with crepe rubber soles and tonal eyelet stitching.',
    price: 8499,
    discount: 15,
    sku: 'SH-DSB-027',
    stock: 12,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600'],
    categoryName: 'Shoes - Boots'
  },
  {
    name: 'Vintage Leather Brogues',
    description: 'Heritage wingtip brogues hand-crafted in burnished tan calf leather, featuring classic punch hole detailing and Goodyear-welted leather soles.',
    price: 7499,
    discount: 20,
    sku: 'SH-BRG-025',
    stock: 8,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600'],
    categoryName: 'Shoes - Brogues & Oxfords'
  },
  {
    name: 'Leather Dress Oxfords',
    description: 'Sophisticated dress shoes crafted in high-shine black leather with custom stitched cap-toe and stacked heel.',
    price: 8999,
    discount: 12,
    sku: 'SH-OXF-029',
    stock: 10,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600'],
    categoryName: 'Shoes - Brogues & Oxfords'
  },

  // --- Category Group: Jewellery (6 products) ---
  {
    name: 'Chronograph Watch',
    description: 'Sophisticated chronograph analog watch with white dial face, brown leather strap, and dual sub-dials.',
    price: 4299,
    discount: 49,
    sku: 'JW-WTC-003',
    stock: 10,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600'],
    categoryName: 'Jewellery - Watches'
  },
  {
    name: 'Analog Watch',
    description: 'Elegant minimalistic dial dress watch with premium quartz movement and brown leather wristband.',
    price: 2499,
    discount: 48,
    sku: 'JW-WTC-005',
    stock: 6,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600'],
    categoryName: 'Jewellery - Watches'
  },
  {
    name: 'Gold Signet Ring',
    description: 'Bold solid 18k gold-plated signet ring featuring a flat top surface, brushed satin borders, and matching hallmarks.',
    price: 5999,
    discount: 15,
    sku: 'JW-RNG-029',
    stock: 14,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600'],
    categoryName: 'Jewellery - Rings & Chains'
  },
  {
    name: 'Silver Chain Necklace',
    description: 'Classic sterling silver curb link chain necklace with polished lobster claw clasp mechanism.',
    price: 3499,
    discount: 10,
    sku: 'JW-CHN-030',
    stock: 16,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'],
    categoryName: 'Jewellery - Rings & Chains'
  },
  {
    name: 'Minimalist Gold Hoops',
    description: 'Classic lightweight gold hoop earrings featuring polished finishes and secure latch-back closures.',
    price: 2799,
    discount: 8,
    sku: 'JW-ERP-031',
    stock: 22,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600'],
    categoryName: 'Jewellery'
  },
  {
    name: 'Pearl Accent Bracelet',
    description: 'Elegant bracelet woven with organic freshwater pearls and gold-plated toggle clasp closures.',
    price: 3899,
    discount: 12,
    sku: 'JW-BRC-032',
    stock: 15,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600'],
    categoryName: 'Jewellery'
  }
];

async function seed() {
  console.log('Seeding categories and products into Supabase...');

  try {
    // 1. Seed Categories
    for (const cat of initialCategories) {
      // Check if category already exists
      const { data: existingCat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', cat.slug)
        .maybeSingle();

      if (!existingCat) {
        console.log(`Creating category: ${cat.name}`);
        const { error: insErr } = await supabase.from('categories').insert(cat);
        if (insErr) {
          console.error(`Error inserting category ${cat.name}:`, insErr.message);
        }
      }
    }

    // Fetch all categories to map IDs
    const { data: dbCategories } = await supabase
      .from('categories')
      .select('*');

    const categoryMap = {};
    dbCategories.forEach(c => {
      categoryMap[c.name] = c.id;
    });

    // 2. Clear old products to avoid duplicates during developer testing if needed, or simply insert
    // Let's first clean existing products
    const { error: clearErr } = await supabase
      .from('products')
      .delete()
      .neq('sku', 'DO_NOT_DELETE_SOMETHING_ELSE'); // delete all
      
    if (clearErr) {
      console.warn("Could not clean old products:", clearErr.message);
    } else {
      console.log("Cleaned old products successfully.");
    }

    // 3. Insert new products
    const productsToInsert = mockProducts.map(p => {
      const categoryId = categoryMap[p.categoryName];
      if (!categoryId) {
        throw new Error(`Category ${p.categoryName} ID not found in database!`);
      }
      return {
        name: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        sku: p.sku,
        stock: p.stock,
        status: p.status,
        images: p.images,
        category_id: categoryId
      };
    });

    const { data: inserted, error: prodErr } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (prodErr) {
      throw prodErr;
    }

    console.log(`Successfully seeded ${inserted.length} products!`);
    console.log(JSON.stringify(inserted, null, 2));

  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seed();
