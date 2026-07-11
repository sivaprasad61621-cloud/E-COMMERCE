import supabase from '../config/supabase.js';
import { mockCategories } from './categories.js';

// Shared mock database state for products
export let mockProducts = [
  // --- Electronics (10 products) ---
  { id: 'm-el-1', name: 'Apple MacBook Air M2', description: 'Incredibly thin design, Apple M2 chip, 13.6-inch Liquid Retina display, 8GB Unified Memory, 256GB SSD, silent fanless operation.', category_id: 'cat-1', price: 99900, discount: 0, sku: 'EL-LAP-001', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600'] },
  { id: 'm-el-2', name: 'Apple iPhone 15 Pro', description: 'Aerospace-grade titanium design, A17 Pro chip, customizable Action button, 48MP main camera with advanced portraits, USB-C support.', category_id: 'cat-1', price: 134900, discount: 10, sku: 'EL-MOB-011', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1695048133142-1a20484429be?q=80&w=600'] },
  { id: 'm-el-3', name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading active noise cancelling with 8 microphones, Auto NC Optimiser, crystal clear hands-free calling, 30 hours of battery.', category_id: 'cat-1', price: 29990, discount: 15, sku: 'EL-HDP-021', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'] },
  { id: 'm-el-4', name: 'Apple AirPods Pro (2nd Gen)', description: 'H2 chip, double the Active Noise Cancellation of original, Adaptive Audio, Conversation Awareness, MagSafe charging case (USB-C).', category_id: 'cat-1', price: 24900, discount: 0, sku: 'EL-EAR-031', stock: 25, status: 'active', images: ['https://images.unsplash.com/photo-1606741965509-717c10e79538?q=80&w=600'] },
  { id: 'm-el-5', name: 'Apple Watch Series 9', description: 'S9 SiP chip, double tap gesture control, brighter Always-On Retina display, blood oxygen and ECG tracker, carbon neutral band options.', category_id: 'cat-1', price: 41900, discount: 0, sku: 'EL-WTC-041', stock: 18, status: 'active', images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600'] },
  { id: 'm-el-6', name: 'Sonos Era 100 Speaker', description: 'Compact premium smart speaker, rich acoustics, Bluetooth and WiFi line-in streaming, Apple AirPlay 2, Trueplay room tuning.', category_id: 'cat-1', price: 29900, discount: 0, sku: 'EL-SPK-051', stock: 14, status: 'active', images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600'] },
  { id: 'm-el-7', name: 'Dell UltraSharp U2723QE Monitor', description: '27-inch 4K USB-C Hub Monitor, IPS Black technology for 2000:1 contrast, 98% DCI-P3 color, daisy chain support, comfortview plus.', category_id: 'cat-1', price: 58900, discount: 10, sku: 'EL-MON-061', stock: 10, status: 'active', images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600'] },
  { id: 'm-el-8', name: 'Fujifilm X-T5 Mirrorless Camera', description: 'Retro dials design, 40.2MP X-Trans CMOS 5 HR sensor, 5-axis in-body image stabilization, classic Fujifilm film simulations, 6.2K video.', category_id: 'cat-1', price: 169990, discount: 0, sku: 'EL-CAM-071', stock: 6, status: 'active', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600'] },
  { id: 'm-el-9', name: 'Sony PlayStation 5 Console', description: 'Ultra-high speed SSD, ray tracing graphics, dualsense haptic feedback wireless controller, 3D audio tech, 4K gaming.', category_id: 'cat-1', price: 54990, discount: 0, sku: 'EL-GAM-081', stock: 8, status: 'active', images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600'] },
  { id: 'm-el-10', name: 'Samsung T7 Shield Portable SSD 2TB', description: 'Rugged external SSD, USB 3.2 Gen 2, reads up to 1050 MB/s, IP65 water and dust resistant, elastomer drop-resistant casing.', category_id: 'cat-1', price: 16500, discount: 0, sku: 'EL-ACC-091', stock: 30, status: 'active', images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=600'] },

  // --- Fashion & Apparel (10 products) ---
  { id: 'm-fa-1', name: 'Patagonia Better Sweater Fleece', description: 'Warm 100% recycled polyester fleece jacket, sweater-knit aesthetic exterior, brushed interior, dyed with low-impact process.', category_id: 'cat-2', price: 12500, discount: 0, sku: 'FA-OUT-001', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600'] },
  { id: 'm-fa-2', name: 'Everlane Cashmere Crewneck', description: 'Grade-A cashmere knit sweater, standard crewneck collar, ribbed cuffs and hem, incredibly soft and pills less over time.', category_id: 'cat-2', price: 11900, discount: 10, sku: 'FA-KNT-011', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600'] },
  { id: 'm-fa-3', name: 'Reformation Juliette Midi Dress', description: 'Slim fitting midi dress, sweetheart neckline, high thigh slit, adjustable tie shoulder straps, lightweight georgette fabric.', category_id: 'cat-2', price: 19800, discount: 15, sku: 'FA-DRS-021', stock: 8, status: 'active', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'] },
  { id: 'm-fa-4', name: 'Polo Ralph Lauren Oxford', description: 'Classic fit long-sleeved sport shirt, breathable cotton oxford, button-down collar, signature embroidered pony logo.', category_id: 'cat-2', price: 9900, discount: 0, sku: 'FA-SHR-031', stock: 22, status: 'active', images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600'] },
  { id: 'm-fa-5', name: "Nike Air Force 1 '07", description: 'Classic leather basketball sneaker, foam midsole with encapsulated Air cushioning, clean retro low top styling.', category_id: 'cat-2', price: 7495, discount: 0, sku: 'FA-SHG-041', stock: 18, status: 'active', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600'] },
  { id: 'm-fa-6', name: 'Fjallraven Kanken Backpack', description: 'Classic Scandinavian school pack, Vinylon F durable waterproof fabric, top handles, reflective logo, removable seat cushion pad.', category_id: 'cat-2', price: 6999, sku: 'FA-BAG-051', stock: 24, status: 'active', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'] },
  { id: 'm-fa-7', name: 'Bellroy Hide & Seek Bifold', description: 'Slim leather bifold wallet, 4 quick access slots, hidden currency section, RFID protection, premium eco-tanned leather.', category_id: 'cat-2', price: 6999, discount: 0, sku: 'FA-WLT-061', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1627124156297-9d42b28d94e1?q=80&w=600'] },
  { id: 'm-fa-8', name: 'Away The Bigger Carry-On', description: 'Hard shell spinner luggage, durable polycarbonate shell, ejectable USB battery charger, 360-degree wheels, interior compression.', category_id: 'cat-2', price: 22900, discount: 10, sku: 'FA-LUG-071', stock: 7, status: 'active', images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600'] },
  { id: 'm-fa-9', name: 'Lululemon Align Yoga Pant', description: 'Buttery-soft Nulu fabric yoga leggings, weightless naked sensation, high-rise flat waistband, hidden key pocket.', category_id: 'cat-2', price: 8900, discount: 0, sku: 'FA-ACT-081', stock: 16, status: 'active', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=600'] },
  { id: 'm-fa-10', name: 'Ray-Ban Wayfarer Classic', description: 'Iconic acetate frame sunglasses, G-15 green crystal lenses, 100% UV protection, classic silver rivet accents.', category_id: 'cat-2', price: 9900, discount: 0, sku: 'FA-ACC-091', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600'] },

  // --- Home & Kitchen (10 products) ---
  { id: 'm-hk-1', name: 'Anglepoise Type 75 Desk Lamp', description: 'Iconic constant-tension spring mechanism lamp, adjustable shade and arms, matte paint finish with aluminum fittings.', category_id: 'cat-3', price: 19900, discount: 0, sku: 'HK-LMP-001', stock: 14, status: 'active', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600'] },
  { id: 'm-hk-2', name: 'Flos Arco Floor Lamp', description: 'Luxury floor lamp, solid white Carrara marble base rectangular block, satin-finish stainless steel adjustable arc arm.', category_id: 'cat-3', price: 149000, discount: 0, sku: 'HK-LMP-011', stock: 5, status: 'active', images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=600'] },
  { id: 'm-hk-3', name: 'Hario V60 Ceramic Dripper', description: 'Signature pour-over coffee dripper, spiral rib grooves, large single exit hole, heat-retaining ceramic body.', category_id: 'cat-3', price: 1999, discount: 0, sku: 'HK-COF-021', stock: 25, status: 'active', images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600'] },
  { id: 'm-hk-4', name: 'Baratza Encore Coffee Grinder', description: 'Conical burr coffee grinder, 40 grind settings, DC motor keeps beans cool, pulse button front, commercial grade.', category_id: 'cat-3', price: 14500, discount: 10, sku: 'HK-ACC-031', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600'] },
  { id: 'm-hk-5', name: 'Le Creuset Enameled Dutch Oven', description: '5.5-Qt round cast iron dutch oven, durable vitreous enamel coating, secure lid fit, iconic signature colors.', category_id: 'cat-3', price: 28900, discount: 0, sku: 'HK-CW-041', stock: 8, status: 'active', images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600'] },
  { id: 'm-hk-6', name: 'Furi Hand-Glazed Dinner Plates Set', description: 'Set of 4 hand-glazed stoneware plates, organic uneven rims, earth-toned matte borders, dishwasher and microwave safe.', category_id: 'cat-3', price: 3999, discount: 0, sku: 'HK-DW-051', stock: 16, status: 'active', images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600'] },
  { id: 'm-hk-7', name: 'Fog Linen Work Linen Tablecloth', description: '100% natural Lithuanian flax linen, woven border seams, softens with every wash, natural light tan color.', category_id: 'cat-3', price: 8900, discount: 15, sku: 'HK-TAB-061', stock: 10, status: 'active', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600'] },
  { id: 'm-hk-8', name: 'Herman Miller Eames Lounge Chair', description: 'Iconic lounge chair and ottoman, molded plywood shells, premium leather upholstery, die-cast aluminum base.', category_id: 'cat-3', price: 239000, discount: 0, sku: 'HK-FUR-071', stock: 3, status: 'active', images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600'] },
  { id: 'm-hk-9', name: 'Coyuchi Organic Cotton Throw Pillow', description: 'Organic cotton knit cushion cover, down feather insert included, textured seed stitch pattern.', category_id: 'cat-3', price: 4900, discount: 0, sku: 'HK-DEC-081', stock: 22, status: 'active', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600'] },
  { id: 'm-hk-10', name: 'Yamazaki Tosca Storage Basket', description: 'Steel wire storage bin, white powder coat, solid ash wood carry handles, Japanese design.', category_id: 'cat-3', price: 2990, discount: 0, sku: 'HK-ORG-091', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600'] },
  { id: 'm-hk-11', name: 'Article Sven Tan Leather Sofa', description: 'Mid-century modern tan leather sofa, full-grain aniline dyed leather, tufted bench seat, bolster pillows.', category_id: 'cat-3', price: 149000, discount: 0, sku: 'HK-SOF-002', stock: 5, status: 'active', images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600'] },
  { id: 'm-hk-12', name: 'Flo Solid Sheesham Wood Queen Bed', description: 'Premium Sheesham wood queen-size bed frame, natural grain finish, slatted support system, minimalist headboard.', category_id: 'cat-3', price: 34900, discount: 0, sku: 'HK-BED-003', stock: 8, status: 'active', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600'] },
  { id: 'm-hk-13', name: 'Atomberg Renesa Smart BLDC Fan', description: 'Energy-saving brushless DC motor ceiling fan, remote control, LED speed indicator, consumes 28W only.', category_id: 'cat-3', price: 3899, discount: 0, sku: 'HK-FAN-003', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1513506003901-1e6a35082571?q=80&w=600'] },
  { id: 'm-hk-14', name: 'Kent Grand Plus RO Water Purifier', description: 'RO+UV+UF water purification with TDS controller, patented mineral RO technology, 9-liter storage tank.', category_id: 'cat-3', price: 16900, discount: 0, sku: 'HK-PUR-001', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=600'] },
  { id: 'm-hk-15', name: 'Prestige Marvel Glass 3 Burner Stove', description: '3-burner gas table, shatterproof black toughened glass top, high efficiency brass burners.', category_id: 'cat-3', price: 4999, discount: 0, sku: 'HK-STV-001', stock: 18, status: 'active', images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600'] },

  // --- Beauty & Health (10 products) ---
  { id: 'm-bh-1', name: 'SkinCeuticals C E Ferulic Serum', description: 'Patented daytime Vitamin C antioxidant serum, 15% pure L-ascorbic acid, 1% alpha-tocopherol, 0.5% ferulic acid.', category_id: 'cat-4', price: 14900, discount: 0, sku: 'BH-SRM-001', stock: 30, status: 'active', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600'] },
  { id: 'm-bh-2', name: 'CeraVe Moisturising Cream', description: 'Rich face and body cream, 3 essential ceramides, hyaluronic acid, MVE technology for 24-hour continuous hydration.', category_id: 'cat-4', price: 1250, discount: 0, sku: 'BH-MST-011', stock: 45, status: 'active', images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600'] },
  { id: 'm-bh-3', name: 'Sand & Sky Pink Clay Mask', description: '4-in-1 pore tightening mask, Australian pink clay, kelp and witch hazel, brightens and refines skin texture.', category_id: 'cat-4', price: 3490, discount: 10, sku: 'BH-MSK-021', stock: 18, status: 'active', images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600'] },
  { id: 'm-bh-4', name: 'Olaplex No. 7 Bonding Oil', description: 'Highly concentrated lightweight styling oil, repairs damaged hair bonds, heat protection up to 450°F, adds shine.', category_id: 'cat-4', price: 2950, discount: 0, sku: 'BH-HAR-031', stock: 24, status: 'active', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=600'] },
  { id: 'm-bh-5', name: 'Olaplex No. 4 Bond Shampoo', description: 'Bond maintenance daily shampoo, highly moisturizing, repairs split ends, color-safe, sulfate-free.', category_id: 'cat-4', price: 2950, discount: 0, sku: 'BH-SHM-041', stock: 28, status: 'active', images: ['https://images.unsplash.com/photo-1585751119414-ef2636f8aede?q=80&w=600'] },
  { id: 'm-bh-6', name: 'Vitruvi Stone Essential Oil Diffuser', description: 'Premium ceramic stone cover ultrasonic diffuser, 100ml water capacity, runs up to 8 hours, dual timer settings.', category_id: 'cat-4', price: 11900, discount: 15, sku: 'BH-DIF-051', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600'] },
  { id: 'm-bh-7', name: 'Plant Therapy Organic Lavender Oil', description: '100% pure USDA organic lavender essential oil, steam distilled, calms mind and promotes deep sleep.', category_id: 'cat-4', price: 1290, discount: 0, sku: 'BH-OIL-061', stock: 40, status: 'active', images: ['https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600'] },
  { id: 'm-bh-8', name: 'Supergoop! Unseen Sunscreen SPF 40', description: '100% invisible weightless sunscreen, oil-free formula, acts as makeup primer, velvet finish.', category_id: 'cat-4', price: 3800, discount: 0, sku: 'BH-SUN-071', stock: 35, status: 'active', images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600'] },
  { id: 'm-bh-9', name: 'Dr. Bronner\'s Pure-Castile Liquid Soap', description: 'Organic 18-in-1 castile soap, lavender oil, organic coconut/olive base, biodegradable.', category_id: 'cat-4', price: 1890, discount: 0, sku: 'BH-SOP-081', stock: 25, status: 'active', images: ['https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=600'] },
  { id: 'm-bh-10', name: 'Sports Research Vitamin D3 5000 IU', description: 'High potency Vitamin D3 coconut MCT oil softgels, supports bone density and immune function.', category_id: 'cat-4', price: 1490, discount: 10, sku: 'BH-VIT-091', stock: 50, status: 'active', images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600'] },

  // --- Sports & Outdoors (10 products) ---
  { id: 'm-so-1', name: 'Rogue Monster Bands Set', description: 'Heavy-duty natural latex pull-up bands, progressive resistance levels color-coded, ultimate durability.', category_id: 'cat-5', price: 6900, discount: 0, sku: 'SO-BND-001', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600'] },
  { id: 'm-so-2', name: 'Bowflex SelectTech 552 Dumbbells', description: 'Adjustable dumbbell pair, dials adjustment from 5 to 52.5 lbs, compact space-saving home gym.', category_id: 'cat-5', price: 34900, discount: 10, sku: 'SO-WGT-011', stock: 8, status: 'active', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'] },
  { id: 'm-so-3', name: 'Crossrope Get Lean Speed Rope Set', description: 'Weighted jump rope system, 1/4 lb and 1/2 lb interchangeable cables, fast clip handle design.', category_id: 'cat-5', price: 9900, discount: 0, sku: 'SO-ROP-021', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=600'] },
  { id: 'm-so-4', name: 'REI Co-op Half Dome SL 2+ Tent', description: '2-person backpacking tent, lightweight hubbed aluminum poles, dual vestibules, mesh ventilation panels.', category_id: 'cat-5', price: 28900, discount: 0, sku: 'SO-TNT-031', stock: 10, status: 'active', images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600'] },
  { id: 'm-so-5', name: 'Hydro Flask 32 oz Wide Mouth', description: 'TempShield double-wall vacuum insulation, 18/8 pro-grade stainless steel, flex cap handle loop, powder finish.', category_id: 'cat-5', price: 3990, discount: 0, sku: 'SO-BTL-041', stock: 35, status: 'active', images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600'] },
  { id: 'm-so-6', name: 'Manduka PRO Yoga Mat 6mm', description: 'Professional dense cushioning yoga mat, closed-cell hygienic surface, slip-resistant grip texture.', category_id: 'cat-5', price: 9900, discount: 15, sku: 'SO-MAT-051', stock: 18, status: 'active', images: ['https://images.unsplash.com/photo-1601925228008-0f4b1ebc9c39?q=80&w=600'] },
  { id: 'm-so-7', name: 'REI Co-op Trailmade 20 Sleeping Bag', description: 'Mummy sleeping bag, synthetic polyester fill, relaxed fit, zip draft tube, certified to 20°F.', category_id: 'cat-5', price: 11900, discount: 0, sku: 'SO-BAG-061', stock: 14, status: 'active', images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'] },
  { id: 'm-so-8', name: 'Jetboil Flash Cooking System', description: 'All-in-one personal cooking system, integrated 1-liter cup with heat indicator, boils in 100 seconds.', category_id: 'cat-5', price: 11900, discount: 0, sku: 'SO-STV-071', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600'] },
  { id: 'm-so-9', name: 'Osprey Atmos AG 65 Backpack', description: 'Anti-Gravity suspension trampoline mesh back panel, fit-on-the-fly harness, raincover included.', category_id: 'cat-5', price: 23900, discount: 0, sku: 'SO-HIK-081', stock: 9, status: 'active', images: ['https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=600'] },
  { id: 'm-so-10', name: 'Garmin Instinct 2 Solar Outdoor Watch', description: 'Rugged GPS watch, solar charging power glass, built-in 3-axis compass, trackback routing.', category_id: 'cat-5', price: 39900, discount: 10, sku: 'SO-GPS-091', stock: 11, status: 'active', images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600'] },
  { id: 'm-so-11', name: 'Kookaburra Kahuna Cricket Bat', description: 'Premium English Willow cricket bat, large edge profile, sweet spot positioned for dynamic drive play.', category_id: 'cat-5', price: 9500, discount: 0, sku: 'SO-CRK-001', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1535137836757-ef95d4957e8f?q=80&w=600'] },
  { id: 'm-so-12', name: 'Mikasa V200W Official Volleyball', description: 'FIVB official game ball, 18 panel aerodynamic design, double-dimple microfiber surface, sweat resistance.', category_id: 'cat-5', price: 5400, discount: 0, sku: 'SO-VLB-001', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600'] },
  { id: 'm-so-13', name: 'Spalding TF-1000 Legacy Basketball', description: 'ZK composite leather cover, moisture management, deep channel design, indoor play official size.', category_id: 'cat-5', price: 4900, discount: 0, sku: 'SO-BSK-001', stock: 14, status: 'active', images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600'] },

  // --- Books & Stationery (10 products) ---
  { id: 'm-bs-1', name: 'The Midnight Library by Matt Haig', description: 'Bestselling novel following a woman who finds a library between life and death containing infinite books of paths.', category_id: 'cat-6', price: 499, discount: 0, sku: 'BS-FIC-001', stock: 45, status: 'active', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600'] },
  { id: 'm-bs-2', name: 'Atomic Habits by James Clear', description: 'The definitive guide to building tiny daily habits, breaking bad ones, and gaining 1% improvement daily.', category_id: 'cat-6', price: 449, discount: 10, sku: 'BS-HLP-011', stock: 60, status: 'active', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600'] },
  { id: 'm-bs-3', name: 'Sapiens: A Brief History of Humankind', description: 'Yuval Noah Harari\'s sweeping narrative of human evolution from foragers to rulers of Earth.', category_id: 'cat-6', price: 599, discount: 0, sku: 'BS-HIS-021', stock: 35, status: 'active', images: ['https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600'] },
  { id: 'm-bs-4', name: 'Vintage Leather Journal with Clasp', description: 'Handcrafted full-grain leather bound notebook, antique deckle edge paper, metal bronze lock clasp.', category_id: 'cat-6', price: 1299, discount: 15, sku: 'BS-JRN-031', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600'] },
  { id: 'm-bs-5', name: 'Leuchtturm1917 A5 Dotted Notebook', description: 'Premium bullet journal notebook, 80g acid-free dotted paper, page numbers, index tables, double bookmarks.', category_id: 'cat-6', price: 1899, discount: 0, sku: 'BS-NTB-041', stock: 30, status: 'active', images: ['https://images.unsplash.com/photo-1455541504462-57ebb2a9cec1?q=80&w=600'] },
  { id: 'm-bs-6', name: 'Lamy Safari Fountain Pen', description: 'Ergonomic triangular grip, durable ABS plastic body, steel medium nib, ink level windows.', category_id: 'cat-6', price: 2200, discount: 0, sku: 'BS-PEN-051', stock: 24, status: 'active', images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600'] },
  { id: 'm-bs-7', name: 'Speedball Calligraphy Starter Kit', description: 'Complete set, pen holder, 6 assorted calligraphy nibs, 1 bottle black ink, practice pad.', category_id: 'cat-6', price: 1499, discount: 0, sku: 'BS-CAL-061', stock: 15, status: 'active', images: ['https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=600'] },
  { id: 'm-bs-8', name: 'Prismacolor Premier Colored Pencils', description: 'Set of 72 professional coloring pencils, soft cores for blending, rich pigments.', category_id: 'cat-6', price: 4900, discount: 0, sku: 'BS-ART-071', stock: 20, status: 'active', images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'] },
  { id: 'm-bs-9', name: 'Steve Jobs by Walter Isaacson', description: 'The exclusive biography of the Apple co-founder based on forty interviews over two years.', category_id: 'cat-6', price: 699, discount: 10, sku: 'BS-BIO-081', stock: 30, status: 'active', images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600'] },
  { id: 'm-bs-10', name: 'Galen Leather Desk Pad Large', description: 'Premium thick crazy horse leather desk writing pad mat, hand-stitched, smooth texture.', category_id: 'cat-6', price: 6900, discount: 0, sku: 'BS-ORG-091', stock: 12, status: 'active', images: ['https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600'] }
];


export const getProducts = async (req, res) => {
  const { category_id, status, search, page = 1, limit = 10 } = req.query;

  if (!supabase) {
    // Mock Mode with filtering
    let results = [...mockProducts];

    if (category_id) {
      const parentCat = mockCategories.find(c => c.id === category_id);
      if (parentCat) {
        const prefix = `${parentCat.name} - `;
        const subCatIds = mockCategories
          .filter(c => c.name.startsWith(prefix))
          .map(c => c.id);
        const allIds = [category_id, ...subCatIds];
        results = results.filter(p => allIds.includes(p.category_id));
      } else {
        results = results.filter(p => p.category_id === category_id);
      }
    }
    if (status) {
      results = results.filter(p => p.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Attach category details to mock items
    const populated = results.map(p => {
      const category = mockCategories.find(c => c.id === p.category_id);
      return {
        ...p,
        category: category ? { id: category.id, name: category.name } : null
      };
    });

    // Pagination
    const startIdx = (parseInt(page) - 1) * parseInt(limit);
    const endIdx = startIdx + parseInt(limit);
    const paginatedData = populated.slice(startIdx, endIdx);

    return res.json({
      data: paginatedData,
      pagination: {
        total: populated.length,
        page: parseInt(page),
        pages: Math.ceil(populated.length / parseInt(limit))
      }
    });
  }

  try {
    // Online Supabase Mode
    let query = supabase
      .from('products')
      .select('*, category:categories(id, name)', { count: 'exact' });

    if (category_id) {
      // Find category first to check if it is a parent
      const { data: parentCat } = await supabase
        .from('categories')
        .select('*')
        .eq('id', category_id)
        .single();
      
      if (parentCat) {
        // Find all subcategories (e.g. starting with "ParentName - ")
        const prefix = `${parentCat.name} - `;
        const { data: subCats } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `${prefix}%`);
        
        if (subCats && subCats.length > 0) {
          const ids = [category_id, ...subCats.map(c => c.id)];
          query = query.in('category_id', ids);
        } else {
          query = query.eq('category_id', category_id);
        }
      } else {
        query = query.eq('category_id', category_id);
      }
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    // Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      data,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    // Mock Mode
    const product = mockProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const category = mockCategories.find(c => c.id === product.category_id);
    return res.json({
      ...product,
      category: category ? { id: category.id, name: category.name } : null
    });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name)')
      .eq('id', id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error('Error fetching product details:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, category_id, price, discount, sku, stock, status, images } = req.body;

  if (!name || !sku || price === undefined) {
    return res.status(400).json({ error: 'Name, SKU, and Price are required.' });
  }

  if (!supabase) {
    // Mock Mode
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      description,
      category_id,
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      sku,
      stock: parseInt(stock || 0),
      status: status || 'draft',
      images: images || [],
      created_at: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    
    const category = mockCategories.find(c => c.id === category_id);
    return res.status(201).json({
      ...newProduct,
      category: category ? { id: category.id, name: category.name } : null
    });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name, 
        description, 
        category_id, 
        price: parseFloat(price), 
        discount: parseFloat(discount || 0), 
        sku, 
        stock: parseInt(stock || 0), 
        status: status || 'draft', 
        images: images || [] 
      }])
      .select('*, category:categories(id, name)')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category_id, price, discount, sku, stock, status, images } = req.body;

  if (!supabase) {
    // Mock Mode
    const prodIdx = mockProducts.findIndex(p => p.id === id);
    if (prodIdx === -1) return res.status(404).json({ error: 'Product not found.' });

    mockProducts[prodIdx] = {
      ...mockProducts[prodIdx],
      name: name !== undefined ? name : mockProducts[prodIdx].name,
      description: description !== undefined ? description : mockProducts[prodIdx].description,
      category_id: category_id !== undefined ? category_id : mockProducts[prodIdx].category_id,
      price: price !== undefined ? parseFloat(price) : mockProducts[prodIdx].price,
      discount: discount !== undefined ? parseFloat(discount) : mockProducts[prodIdx].discount,
      sku: sku !== undefined ? sku : mockProducts[prodIdx].sku,
      stock: stock !== undefined ? parseInt(stock) : mockProducts[prodIdx].stock,
      status: status !== undefined ? status : mockProducts[prodIdx].status,
      images: images !== undefined ? images : mockProducts[prodIdx].images,
      updated_at: new Date().toISOString()
    };

    const category = mockCategories.find(c => c.id === mockProducts[prodIdx].category_id);
    return res.json({
      ...mockProducts[prodIdx],
      category: category ? { id: category.id, name: category.name } : null
    });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name, 
        description, 
        category_id, 
        price: price !== undefined ? parseFloat(price) : undefined, 
        discount: discount !== undefined ? parseFloat(discount) : undefined, 
        sku, 
        stock: stock !== undefined ? parseInt(stock) : undefined, 
        status, 
        images
      })
      .eq('id', id)
      .select('*, category:categories(id, name)')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    // Mock Mode
    const prodIdx = mockProducts.findIndex(p => p.id === id);
    if (prodIdx === -1) return res.status(404).json({ error: 'Product not found.' });

    mockProducts = mockProducts.filter(p => p.id !== id);
    return res.json({ message: 'Product deleted successfully.' });
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
