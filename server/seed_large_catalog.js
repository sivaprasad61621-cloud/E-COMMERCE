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

// Define themes with products for each category
const dataCatalog = {
  'electronics': [
    // 1. Premium Laptops (10)
    {
      items: [
        { name: 'Apple MacBook Air M2', price: 99900, sku: 'EL-LAP-001', desc: 'Incredibly thin design, Apple M2 chip, 13.6-inch Liquid Retina display, 8GB Unified Memory, 256GB SSD, silent fanless operation.' },
        { name: 'Apple MacBook Pro M3', price: 169900, sku: 'EL-LAP-002', desc: 'Powerful Apple M3 chip, 14.2-inch Liquid Retina XDR display, up to 22 hours of battery life, 16GB Unified Memory, 512GB SSD.' },
        { name: 'Dell XPS 15 9530', price: 184990, sku: 'EL-LAP-003', desc: 'Intel Core i7-13700H, 15.6-inch FHD+ InfinityEdge display, 16GB DDR5 RAM, 512GB SSD, Intel Arc A370M graphics, CNC aluminum chassis.' },
        { name: 'HP Spectre x360 14', price: 149990, sku: 'EL-LAP-004', desc: 'Convertible 2-in-1 laptop, 14-inch OLED touchscreen, Intel Core Ultra 7 processor, 16GB LPDDR5X RAM, 1TB SSD, tilt pen included.' },
        { name: 'Lenovo ThinkPad X1 Carbon Gen 11', price: 198900, sku: 'EL-LAP-005', desc: 'Legendary business ultrabook, carbon fiber weave lid, 14-inch WUXGA display, Intel Core i7 vPro, 32GB LPDDR5 RAM, 1TB SSD, military grade durable.' },
        { name: 'ASUS Zenbook 14 OLED', price: 92990, sku: 'EL-LAP-006', desc: 'Thin and light laptop, 14-inch 3K OLED 120Hz display, Intel Core Ultra 5, 16GB LPDDR5X RAM, 1TB SSD, premium ponder blue finish.' },
        { name: 'Razer Blade 16', price: 289990, sku: 'EL-LAP-007', desc: 'Ultimate gaming laptop, Intel Core i9-14900HX, 16-inch QHD+ 240Hz OLED display, NVIDIA GeForce RTX 4070, 32GB RAM, 1TB SSD.' },
        { name: 'Lenovo Yoga 9i Gen 8', price: 154990, sku: 'EL-LAP-008', desc: '2-in-1 convertible laptop, 14-inch 4K OLED touchscreen, Intel Core i7-1360P, 16GB RAM, 1TB SSD, Bowers & Wilkins rotating soundbar.' },
        { name: 'Microsoft Surface Laptop Studio 2', price: 239990, sku: 'EL-LAP-009', desc: 'Dynamic 14.4-inch PixelSense Flow touchscreen, Intel Core i7-13700H, NVIDIA RTX 4050, 16GB RAM, 512GB SSD, matching pen support.' },
        { name: 'Samsung Galaxy Book4 Ultra', price: 219990, sku: 'EL-LAP-010', desc: '16-inch Dynamic AMOLED 2X touchscreen, Intel Core Ultra 9, NVIDIA RTX 4070, 32GB RAM, 1TB SSD, seamless Galaxy ecosystem integration.' }
      ],
      img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600'
    },
    // 2. Flagship Smartphones (10)
    {
      items: [
        { name: 'Apple iPhone 15 Pro', price: 134900, sku: 'EL-MOB-011', desc: 'Aerospace-grade titanium design, A17 Pro chip, customizable Action button, 48MP main camera with advanced portraits, USB-C support.' },
        { name: 'Samsung Galaxy S24 Ultra', price: 129999, sku: 'EL-MOB-012', desc: 'Titanium frame, built-in S Pen, Snapdragon 8 Gen 3, 200MP main camera, 100x Space Zoom, Galaxy AI translation and photo editing.' },
        { name: 'Google Pixel 8 Pro', price: 106999, sku: 'EL-MOB-013', desc: 'Google Tensor G3 chip, 6.7-inch Super Actua display, pro-level triple camera, Magic Eraser, Best Take, Real Tone, 7 years of updates.' },
        { name: 'OnePlus 12 5G', price: 64999, sku: 'EL-MOB-014', desc: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera, 100W SUPERVOOC charging, 5400mAh battery, 2K 120Hz ProXDR display, flowy emerald back.' },
        { name: 'Xiaomi 14 Ultra', price: 99999, sku: 'EL-MOB-015', desc: 'Leica Quad Camera System, 1-inch sensor, Snapdragon 8 Gen 3, WQHD+ AMOLED display, 90W HyperCharge, premium vegan leather back.' },
        { name: 'Sony Xperia 1 VI', price: 114900, sku: 'EL-MOB-016', desc: 'Pro photographer smartphone, true optical zoom lens (85-170mm), Exmor T mobile sensor, 6.5-inch OLED display, high-resolution audio jack.' },
        { name: 'Apple iPhone 15 Plus', price: 89900, sku: 'EL-MOB-017', desc: '6.7-inch durable color-infused glass design, Dynamic Island, A16 Bionic chip, 48MP main camera, all-day battery life, Type-C port.' },
        { name: 'Samsung Galaxy Z Fold5', price: 154999, sku: 'EL-MOB-018', desc: 'Folding smartphone, 7.6-inch main QXGA+ AMOLED screen, Snapdragon 8 Gen 2, triple rear camera, Flex Mode folding engineering.' },
        { name: 'Motorola Edge 50 Ultra', price: 59999, sku: 'EL-MOB-019', desc: 'Pantone-validated displays and cameras, real wood back finish, Snapdragon 8s Gen 3, 64MP telephoto camera, 125W TurboPower charging.' },
        { name: 'Nothing Phone (2)', price: 44999, sku: 'EL-MOB-020', desc: 'Unique Glyph interface back lights, Nothing OS 2.0, Snapdragon 8+ Gen 1, dual 50MP rear cameras, LTPO OLED display.' }
      ],
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600'
    },
    // 3. Over-Ear Headphones (10)
    {
      items: [
        { name: 'Sony WH-1000XM5 Headphones', price: 29990, sku: 'EL-HDP-021', desc: 'Industry-leading active noise cancelling with 8 microphones, Auto NC Optimiser, crystal clear hands-free calling, 30 hours of battery.' },
        { name: 'Bose QuietComfort Ultra Headphones', price: 35900, sku: 'EL-HDP-022', desc: 'Breakthrough spatial audio, CustomTune acoustic calibration, world-class noise cancellation, ultra-soft protein leather ear cushions.' },
        { name: 'Sennheiser Momentum 4 Wireless', price: 29990, sku: 'EL-HDP-023', desc: 'Audiophile-inspired 42mm transducer system, exceptional 60-hour battery life, Adaptive Active Noise Cancellation, smart control app.' },
        { name: 'Apple AirPods Max', price: 59900, sku: 'EL-HDP-024', desc: 'Apple-designed dynamic driver, Active Noise Cancellation, Transparency mode, personalized spatial audio, knit mesh canopy headband.' },
        { name: 'Bowers & Wilkins Px7 S2e', price: 38900, sku: 'EL-HDP-025', desc: 'High-performance 40mm custom drive units, 24-bit high-resolution digital audio streaming, memory foam ear cups with fine leather.' },
        { name: 'Audio-Technica ATH-M50xBT2', price: 18500, sku: 'EL-HDP-026', desc: 'Wireless studio monitor headphones, proprietary 45mm large-aperture drivers, 50 hours of battery, low latency mode for gaming.' },
        { name: 'Beats Studio Pro', price: 29900, sku: 'EL-HDP-027', desc: 'Custom acoustic platform, personalized spatial audio, dynamic head tracking, active noise cancelling, USB-C lossless audio input.' },
        { name: 'Sony WH-CH720N', price: 9990, sku: 'EL-HDP-028', desc: 'Lightweight wireless noise-cancelling headphones, V1 processor, up to 35 hours of battery, multi-point connection, DSEE sound engine.' },
        { name: 'JBL Tour One M2', price: 19990, sku: 'EL-HDP-029', desc: 'True Adaptive Noise Cancelling, Hi-Res certified JBL Pro Sound, 4-mic superior calls, up to 50 hours playtime, smart ambient sound.' },
        { name: 'Shure AONIC 50 Gen 2', price: 34990, sku: 'EL-HDP-030', desc: 'Premium studio-quality wireless headphones, adjustable active noise cancelling, spatial audio mode, customizable EQ presets via ShurePlus.' }
      ],
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'
    },
    // 4. Wireless Earbuds (10)
    {
      items: [
        { name: 'Apple AirPods Pro (2nd Gen)', price: 24900, sku: 'EL-EAR-031', desc: 'H2 chip, double the Active Noise Cancellation of original, Adaptive Audio, Conversation Awareness, MagSafe charging case (USB-C).' },
        { name: 'Sony WF-1000XM5 Earbuds', price: 23990, sku: 'EL-EAR-032', desc: 'The best noise cancelling earbuds, Dynamic Driver X for rich sound, AI-based noise reduction for calls, sleek glossy finish.' },
        { name: 'Bose QC Ultra Earbuds', price: 25900, sku: 'EL-EAR-033', desc: 'World-class active noise cancelling, Immersive Audio spatial sound, cozy custom fit with stability bands, touch control swipe.' },
        { name: 'Sennheiser Momentum TW 4', price: 22990, sku: 'EL-EAR-034', desc: 'TrueResponse transducer system, Lossless audio support, Auracast-ready LE audio, Adaptive ANC, up to 30h battery with charging case.' },
        { name: 'Samsung Galaxy Buds2 Pro', price: 14999, sku: 'EL-EAR-035', desc: '24-bit Hi-Fi audio, Intelligent 360 Audio, enhanced Active Noise Cancelling, comfortable ergonomic vent design, IPX7 water resistance.' },
        { name: 'Jabra Elite 10 Earbuds', price: 19999, sku: 'EL-EAR-036', desc: 'Comfortable semi-open fit, Dolby Atmos spatial sound with head tracking, Jabra Advanced ANC, 6-microphone call technology.' },
        { name: 'Beats Fit Pro', price: 16900, sku: 'EL-EAR-037', desc: 'Secure-fit wingtips, Apple H1 chip, active noise cancelling, spatial audio, compatible with Apple and Android via Beats app.' },
        { name: 'Anker Soundcore Liberty 4 NC', price: 7999, sku: 'EL-EAR-038', desc: 'Reduce noise by up to 98.5%, Adaptive ANC 2.0, 11mm custom drivers, Hi-Res wireless audio, up to 50 hours total battery.' },
        { name: 'Sony LinkBuds S', price: 13990, sku: 'EL-EAR-039', desc: 'Ultra-small and lightweight design, high-quality noise cancelling, high-resolution audio wireless, natural ambient sound mode.' },
        { name: 'Nothing Ear (2)', price: 9999, sku: 'EL-EAR-040', desc: 'Hi-Res Audio certified, custom 11.6mm driver, personalized active noise cancellation, clear voice technology, iconic transparent casing.' }
      ],
      img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600'
    },
    // 5. Smartwatches (10)
    {
      items: [
        { name: 'Apple Watch Series 9', price: 41900, sku: 'EL-WTC-041', desc: 'S9 SiP chip, double tap gesture control, brighter Always-On Retina display, blood oxygen and ECG tracker, carbon neutral band options.' },
        { name: 'Samsung Galaxy Watch 6', price: 29999, sku: 'EL-WTC-042', desc: 'Sleek aluminum frame, personalized heart rate zones, advanced sleep coaching, BIA body composition sensor, larger AMOLED screen.' },
        { name: 'Garmin Fenix 7 Pro Sapphire Solar', price: 93990, sku: 'EL-WTC-043', desc: 'Ultimate multisport GPS watch, scratch-resistant sapphire solar charging lens, built-in LED flashlight, preloaded TopoActive maps.' },
        { name: 'Fitbit Charge 6 Tracker', price: 14999, sku: 'EL-WTC-044', desc: 'Advanced fitness and health tracker, built-in GPS, Google Maps and Wallet integration, heart rate tracking on exercise machines.' },
        { name: 'Apple Watch Ultra 2', price: 89900, sku: 'EL-WTC-045', desc: 'Most rugged Apple Watch, 49mm titanium case, dual-frequency GPS, up to 72 hours in Low Power Mode, custom customizable Action button.' },
        { name: 'Google Pixel Watch 2', price: 39900, sku: 'EL-WTC-046', desc: 'Stress detection sensor, accurate Fitbit heart rate sensor, safety check features, polished aluminum case, Google Assistant integration.' },
        { name: 'Garmin Venu 3 Smartwatch', price: 44990, sku: 'EL-WTC-047', desc: 'Bright AMOLED touchscreen, wheelchair mode, customized fitness coaching, body battery energy monitoring, call and text from wrist.' },
        { name: 'Amazfit GTR 4', price: 16999, sku: 'EL-WTC-048', desc: 'Dual-band circular-polarized GPS antenna, 150+ sports modes, 14-day battery life, offline music storage, retro classic round look.' },
        { name: 'Withings ScanWatch 2', price: 34990, sku: 'EL-WTC-049', desc: 'Hybrid smartwatch, medical-grade ECG, body temperature tracking, blood oxygen levels, up to 30 days battery life, classic watch hand face.' },
        { name: 'COROS Pace 3 Sport Watch', price: 24990, sku: 'EL-WTC-050', desc: 'Super lightweight GPS watch, dual-frequency tracking, 17 days standard use, touch display, advanced training analysis software.' }
      ],
      img: 'https://images.unsplash.com/photo-1510832198440-a52376950479?q=80&w=600'
    },
    // 6. Audio Speakers (10)
    {
      items: [
        { name: 'Sonos Era 100 Speaker', price: 29900, sku: 'EL-SPK-051', desc: 'Compact premium smart speaker, rich acoustics, Bluetooth and WiFi line-in streaming, Apple AirPlay 2, Trueplay room tuning.' },
        { name: 'Apple HomePod (2nd Gen)', price: 32900, sku: 'EL-SPK-052', desc: 'High-excursion woofer, beamforming array of five tweeters, room sensing, spatial audio, Siri voice assistant built-in, smart home hub.' },
        { name: 'JBL Flip 6 Speaker', price: 11999, sku: 'EL-SPK-053', desc: 'Portable waterproof speaker, two-way speaker system, IP67 dustproof and waterproof, PartyBoost link, 12 hours of playtime.' },
        { name: 'Ultimate Ears Megaboom 3', price: 16999, sku: 'EL-SPK-054', desc: 'Loud 360-degree sound, deep thundering bass, IP67 waterproof and floatable, one-touch Magic Button for playlists, durable fabric wrap.' },
        { name: 'Sony SRS-XB100 Wireless Speaker', price: 4990, sku: 'EL-SPK-055', desc: 'Super compact portable speaker, extra bass booster, IP67 dust and water protection, multi-way strap, up to 16 hours of battery.' },
        { name: 'Bose SoundLink Flex', price: 15900, sku: 'EL-SPK-056', desc: 'Outdoor portable speaker, PositionIQ technology automatically optimizes sound orientation, waterproof, powder-coated steel grille.' },
        { name: 'Sonos Move 2 Speaker', price: 44900, sku: 'EL-SPK-057', desc: 'Premium portable outdoor speaker, stereo sound, up to 24 hours playback, durable weather-resistant drop-resistant construction.' },
        { name: 'Marshall Acton III Bluetooth', price: 28999, sku: 'EL-SPK-058', desc: 'Home speaker with vintage retro design, classic Marshall script logo, dynamic loudness adjustment, analog control knobs for bass/treble.' },
        { name: 'Audio-Technica AT-LP60X Turntable', price: 16500, sku: 'EL-SPK-059', desc: 'Fully automatic belt-drive turntable, two speeds (33-1/3 and 45 RPM), anti-resonance die-cast aluminum platter, built-in switchable phono preamp.' },
        { name: 'Marshall Woburn III Speaker', price: 59999, sku: 'EL-SPK-060', desc: 'Most powerful Marshall home speaker, wide three-way acoustic system, HDMI input for TV connection, premium vintage textured cabinet.' }
      ],
      img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600'
    },
    // 7. Monitors (10)
    {
      items: [
        { name: 'Dell UltraSharp U2723QE Monitor', price: 58900, sku: 'EL-MON-061', desc: '27-inch 4K USB-C Hub Monitor, IPS Black technology for 2000:1 contrast, 98% DCI-P3 color, daisy chain support, comfortview plus.' },
        { name: 'LG UltraFine 32UN880-B Ergo', price: 48500, sku: 'EL-MON-062', desc: '32-inch 4K UHD IPS display, ergonomic desk C-clamp arm, HDR10 support, AMD FreeSync, USB-C one-cable clean desk connectivity.' },
        { name: 'ASUS ProArt PA279CV Monitor', price: 36900, sku: 'EL-MON-063', desc: '27-inch 4K UHD display, Calman verified factory pre-calibrated color accuracy Delta E < 2, 100% sRGB, USB-C power delivery.' },
        { name: 'Samsung Odyssey Neo G9', price: 165000, sku: 'EL-MON-064', desc: '49-inch curved dual QHD display, mini-LED backlights, 240Hz refresh rate, 1ms response time, quantum HDR 2000, futuristic design.' },
        { name: 'BenQ PD2700U Designer Monitor', price: 31900, sku: 'EL-MON-065', desc: '27-inch 4K IPS monitor, AQCOLOR technology for accurate sRGB/Rec. 709, CAD/CAM and Animation display mode presets, DualView function.' },
        { name: 'LG C3 42-inch OLED TV/Monitor', price: 89990, sku: 'EL-MON-066', desc: '42-inch self-lit OLED pixels, perfect black levels, a9 AI Processor Gen6, 120Hz refresh, G-Sync and FreeSync gaming certifications.' },
        { name: 'Samsung M8 Smart Monitor', price: 42900, sku: 'EL-MON-067', desc: '32-inch 4K UHD monitor, smart TV platform apps built-in, slim fit webcam included, smart IoT hub, sleek minimalist pastel frame.' },
        { name: 'MSI Optix MAG274QRF-QD', price: 29990, sku: 'EL-MON-068', desc: '27-inch WQHD gaming monitor, Rapid IPS panel, quantum dot color technology, 165Hz refresh rate, G-Sync compatible.' },
        { name: 'Gigabyte M27Q Gaming Monitor', price: 24900, sku: 'EL-MON-069', desc: '27-inch QHD IPS display, 170Hz refresh, built-in KVM switch to control two systems with one set of keyboard/mouse.' },
        { name: 'Dell Gaming S2721DGF', price: 27900, sku: 'EL-MON-070', desc: '27-inch QHD fast IPS gaming monitor, 165Hz refresh rate, 1ms response time, NVIDIA G-Sync and AMD FreeSync Premium Pro.' }
      ],
      img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600'
    },
    // 8. Cameras (10)
    {
      items: [
        { name: 'Fujifilm X-T5 Mirrorless Camera', price: 169990, sku: 'EL-CAM-071', desc: 'Retro dials design, 40.2MP X-Trans CMOS 5 HR sensor, 5-axis in-body image stabilization, classic Fujifilm film simulations, 6.2K video.' },
        { name: 'Sony Alpha 7 IV Camera', price: 219990, sku: 'EL-CAM-072', desc: 'Pro hybrid mirrorless camera, 33MP full-frame Exmor R sensor, BIONZ XR image processor, real-time autofocus tracking, 4K 60p video.' },
        { name: 'Canon EOS R6 Mark II Camera', price: 229990, sku: 'EL-CAM-073', desc: '24.2MP full-frame CMOS, dual pixel CMOS AF II, up to 40 fps electronic shutter, 4K 60p oversampled from 6K, robust weather sealing.' },
        { name: 'Nikon Z6 II Mirrorless Camera', price: 154990, sku: 'EL-CAM-074', desc: '24.5MP full-frame sensor, dual EXPEED 6 image processors, dual memory card slots, 14 fps continuous shooting, UHD 4K video.' },
        { name: 'Panasonic Lumix S5 II Camera', price: 184990, sku: 'EL-CAM-075', desc: '24.2MP full-frame sensor, phase hybrid autofocus, active IS stabilization, unlimited 4K recording, real-time LUT loading.' },
        { name: 'Ricoh GR IIIx Digital Camera', price: 92900, sku: 'EL-CAM-076', desc: 'Pocket sized street photographer camera, 24.2MP APS-C sensor, fixed 40mm equivalent F2.8 lens, shake reduction, custom image styles.' },
        { name: 'GoPro Hero 12 Black Camera', price: 37900, sku: 'EL-CAM-077', desc: 'Rugged action camera, 5.3K video, HyperSmooth 6.0 video stabilization, vertical capture support, dual LCD screens, waterproof to 33ft.' },
        { name: 'DJI Osmo Pocket 3 Gimbal', price: 54900, sku: 'EL-CAM-078', desc: 'Handheld 3-axis gimbal camera, 1-inch CMOS sensor, rotatable 2-inch touchscreen, active track 6.0, fast charging battery.' },
        { name: 'Sony ZV-E10 Vlog Camera', price: 61990, sku: 'EL-CAM-079', desc: '24.2MP APS-C sensor vlogging camera, directional 3-capsule mic with wind screen, product showcase autofocus setting, interchangeable lens.' },
        { name: 'Instax Mini Evo Hybrid Camera', price: 18999, sku: 'EL-CAM-080', desc: 'Hybrid analog-digital instant camera, 10 lens effects and 10 film effects, print directly from smartphone via Bluetooth app link.' }
      ],
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600'
    },
    // 9. Gaming Consoles (10)
    {
      items: [
        { name: 'Sony PlayStation 5 Console', price: 54990, sku: 'EL-GAM-081', desc: 'Ultra-high speed SSD, ray tracing graphics, dualsense haptic feedback wireless controller, 3D audio tech, 4K gaming.' },
        { name: 'Xbox Series X Console', price: 54990, sku: 'EL-GAM-082', desc: 'Most powerful Xbox ever, 12 teraflops processing power, true 4K gaming, up to 120 FPS, quick resume feature for seamless switching.' },
        { name: 'Nintendo Switch OLED Model', price: 32900, sku: 'EL-GAM-083', desc: '7-inch vibrant OLED screen, wide adjustable stand, wired LAN port dock, 64GB internal storage, detachable Joy-Con controllers.' },
        { name: 'Valve Steam Deck OLED 512GB', price: 58900, sku: 'EL-GAM-084', desc: 'Handheld gaming PC, 7.4-inch HDR OLED display, custom AMD APU, built-in trackpads, console-grade analog control thumbsticks.' },
        { name: 'ASUS ROG Ally Handheld', price: 64990, sku: 'EL-GAM-085', desc: 'Windows 11 gaming handheld, AMD Ryzen Z1 Extreme processor, 7-inch 120Hz FHD display, 16GB LPDDR5 RAM, ROG intelligent cooling.' },
        { name: 'Sony DualSense Edge Controller', price: 18990, sku: 'EL-GAM-086', desc: 'Ultra-customizable PS5 pro controller, swappable stick modules, mapped back paddles, adjustable trigger travel locks.' },
        { name: 'Xbox Elite Wireless Controller Series 2', price: 15990, sku: 'EL-GAM-087', desc: 'Professional wireless controller, adjustable-tension thumbsticks, wrap-around rubberized grip, shorter hair trigger locks.' },
        { name: 'Razer DeathAdder V3 Pro Mouse', price: 13990, sku: 'EL-GAM-088', desc: 'Ultra-lightweight gaming mouse (63g), Razer Focus Pro 30K optical sensor, optical mouse switches gen 3, 90 hours wireless battery.' },
        { name: 'SteelSeries Apex Pro Keyboard', price: 19990, sku: 'EL-GAM-089', desc: 'Mechanical keyboard, OmniPoint adjustable actuation switches, smart OLED display, aircraft grade aluminum alloy frame.' },
        { name: 'Logitech G Pro X 2 Lightspeed', price: 22990, sku: 'EL-GAM-090', desc: 'Wireless pro headset, 50mm Graphene drivers, premium comfortable leatherette ear pads, clear blue voice mic tech.' }
      ],
      img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600'
    },
    // 10. Storage (10)
    {
      items: [
        { name: 'Samsung T7 Shield Portable SSD 2TB', price: 16500, sku: 'EL-ACC-091', desc: 'Rugged external SSD, USB 3.2 Gen 2, reads up to 1050 MB/s, IP65 water and dust resistant, elastomer drop-resistant casing.' },
        { name: 'SanDisk Extreme Portable SSD 1TB', price: 9500, sku: 'EL-ACC-092', desc: 'External SSD, read speeds up to 1050MB/s, IP55 rating, handy carabiner loop, durable silicone shell.' },
        { name: 'WD Black SN850X NVMe SSD 2TB', price: 17900, sku: 'EL-ACC-093', desc: 'Internal gaming SSD, PCIe Gen4, speeds up to 7300 MB/s, built-in heatsink model for desktop and PS5 compatibility.' },
        { name: 'Logitech MX Master 3S Mouse', price: 9495, sku: 'EL-ACC-094', desc: 'Ergonomic office mouse, 8000 DPI track-on-glass sensor, quiet click switches, MagSpeed electromagnetic scroll wheel.' },
        { name: 'Apple Magic Keyboard with Touch ID', price: 14500, sku: 'EL-ACC-095', desc: 'Sleek wireless keyboard, built-in rechargeable battery, scissor mechanism, secure Touch ID login for Apple silicon Mac.' },
        { name: 'Keychron K2 Mechanical Keyboard', price: 7999, sku: 'EL-ACC-096', desc: 'Compact 75% layout, wireless/wired connection, Gateron G Pro mechanical switches, RGB backlit, aluminum frame panel.' },
        { name: 'Seagate Backup Plus Hub 8TB', price: 15900, sku: 'EL-ACC-097', desc: 'External desktop hard drive, built-in 2-port USB 3.0 hub to charge devices, cross-compatible with Mac and Windows.' },
        { name: 'Anker PowerExpand 7-in-1 Hub', price: 3499, sku: 'EL-ACC-098', desc: 'USB-C adapter hub, HDMI 4K, Power Delivery charging port, SD and MicroSD card slots, dual USB 3.0 data transfer.' },
        { name: 'Elgato Stream Deck MK.2', price: 14990, sku: 'EL-ACC-099', desc: 'Studio controller console, 15 customizable LCD keys, drag-and-drop actions, customizable faceplates, USB-C connection.' },
        { name: 'Corsair K70 RGB PRO Keyboard', price: 16990, sku: 'EL-ACC-100', desc: 'Full-size mechanical gaming keyboard, Cherry MX Speed switches, AXON hyper-processing technology, durable double-shot keycaps.' }
      ],
      img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600'
    }
  ],
  'fashion-apparel': [
    // 1. Men's Outerwear (10)
    {
      items: [
        { name: 'Patagonia Better Sweater Fleece', price: 12500, sku: 'FA-OUT-001', desc: 'Warm 100% recycled polyester fleece jacket, sweater-knit aesthetic exterior, brushed interior, dyed with low-impact process.' },
        { name: 'Arc\'teryx Atom LT Hoody', price: 26900, sku: 'FA-OUT-002', desc: 'Lightweight versatile synthetic insulated jacket, Coreloft compact fill, water-resistant Tyono shell, breathable side panels.' },
        { name: 'Barbour Beaufort Wax Jacket', price: 39900, sku: 'FA-OUT-003', desc: 'Classic waxed cotton jacket, signature corduroy collar, heavy duty two-way zip, storm fly front, tartan cotton interior lining.' },
        { name: 'The North Face 1996 Retro Nuptse', price: 24900, sku: 'FA-OUT-004', desc: 'Boxy retro puffer jacket, water-repellent ripstop fabric, 700-fill goose down insulation, packable hood folds into collar.' },
        { name: 'Levi\'s Denim Sherpa Jacket', price: 7999, sku: 'FA-OUT-005', desc: 'Iconic jean trucker jacket, warm sherpa fleece lining in body and collar, quilted sleeve linings, snap-button closure.' },
        { name: 'Alpha Industries MA-1 Flight Jacket', price: 16500, sku: 'FA-OUT-006', desc: 'Classic military bomber jacket, reversible orange nylon lining, water-resistant flight nylon outer, utility pocket on sleeve.' },
        { name: 'Columbia Steens Mountain Fleece', price: 3499, sku: 'FA-OUT-007', desc: 'Cozy MTR filament fleece jacket, zippered hand pockets, drawstring adjustable hem, durable outdoor layering piece.' },
        { name: 'Schott NYC 530 Leather Jacket', price: 79900, sku: 'FA-OUT-008', desc: 'Hand-cut lightweight waxy cowhide leather jacket, plaid cotton lining, zippered chest pocket, antique brass hardware.' },
        { name: 'Canada Goose Expedition Parka', price: 125000, sku: 'FA-OUT-009', desc: 'Extreme weather parka, durable Arctic Tech shell, 625-fill power white duck down, coyote fur trim hood, multi utility pockets.' },
        { name: 'Carhartt WIP Detroit Jacket', price: 18500, sku: 'FA-OUT-010', desc: 'Rugged organic cotton canvas jacket, warm blanket striped body lining, corduroy collar, zipped chest pocket, triple-stitched seams.' }
      ],
      img: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600'
    },
    // 2. Women's Knitwear (10)
    {
      items: [
        { name: 'Everlane Cashmere Crewneck', price: 11900, sku: 'FA-KNT-011', desc: 'Grade-A cashmere knit sweater, standard crewneck collar, ribbed cuffs and hem, incredibly soft and pills less over time.' },
        { name: 'Naadam Essential Cashmere Sweater', price: 9500, sku: 'FA-KNT-012', desc: '100% Mongolian cashmere crewneck, sustainably sourced, lightweight breathable knit, flattering classic silhouette.' },
        { name: 'Patagonia Synchilla Fleece Jacket', price: 11500, sku: 'FA-KNT-013', desc: 'Double-sided fleece pullover, signature nylon snap-button placket, chest pocket, spandex bound collar and sleeve edges.' },
        { name: 'Reformation Cashmere Cardigan', price: 18900, sku: 'FA-KNT-014', desc: 'V-neck knit cardigan button front, blend of recycled cashmere and fine wool, relaxed fit ribbed details, tortoise buttons.' },
        { name: 'Free People Easy Street Tunic', price: 9800, sku: 'FA-KNT-015', desc: 'Oversized tunic length knit sweater, mock-neck collar, side slits, drop-shoulder seams, cozy textured ribbed knit.' },
        { name: 'Barefoot Dreams CozyChic Cardigan', price: 12500, sku: 'FA-KNT-016', desc: 'Super fluffy microfiber knit cardigan, open front cascade collar, patch pockets, feels like a warm cozy blanket.' },
        { name: 'L.L. Bean Classic Cotton Sweater', price: 6990, sku: 'FA-KNT-017', desc: 'Textured cable-knit pullover, 100% long-staple cotton yarn, traditional crewneck, holds shape wash after wash.' },
        { name: 'Jenni Kayne Everyday Sweater', price: 22900, sku: 'FA-KNT-018', desc: 'Premium lightweight wool-cashmere blend knit, relaxed fit, ribbed hems, modern understated California look.' },
        { name: 'Uniqlo Extra Fine Merino Crew', price: 2990, sku: 'FA-KNT-019', desc: '100% extra fine merino wool, machine washable, anti-pilling, thin lightweight knit perfect for office layering.' },
        { name: 'J.Crew Cable-Knit Crewneck', price: 8900, sku: 'FA-KNT-020', desc: 'Classic cable pattern sweater, soft wool-cotton blend, ribbed trims, available in versatile warm neutral colors.' }
      ],
      img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600'
    },
    // 3. Women's Dresses (10)
    {
      items: [
        { name: 'Reformation Juliette Midi Dress', price: 19800, sku: 'FA-DRS-021', desc: 'Slim fitting midi dress, sweetheart neckline, high thigh slit, adjustable tie shoulder straps, lightweight georgette fabric.' },
        { name: 'Ganni Floral Georgette Dress', price: 22500, sku: 'FA-DRS-022', desc: 'Printed wrap dress, recycled polyester georgette, ruffle edges, V-neckline, long balloon sleeves with elastic cuffs.' },
        { name: 'Farm Rio Tropical Maxi Dress', price: 18900, sku: 'FA-DRS-023', desc: 'Vibrant tropical print maxi dress, adjustable thin straps, tiered skirt, smocked back panel, lightweight organic cotton fabric.' },
        { name: 'Realisation Par The Alexandra Dress', price: 16500, sku: 'FA-DRS-024', desc: 'Mini wrap dress, 100% silk crepe, long sleeves, ruffled neckline and hem, wrap tie waist for custom adjustment.' },
        { name: 'Staud Wells Poplin Dress', price: 24500, sku: 'FA-DRS-025', desc: 'A-line midi dress, structured corset-style bodice, square neckline, voluminous pleated skirt, soft cotton poplin.' },
        { name: 'Zara Poplin Midi Dress', price: 3990, sku: 'FA-DRS-026', desc: 'Tiered skirt midi dress, sleeveless square neck, smocked bodice front, lightweight cotton blend fabric.' },
        { name: 'Anthropologie Somerset Maxi Dress', price: 14800, sku: 'FA-DRS-027', desc: 'Best-selling tiered maxi dress, smocked elastic waist, flutter cap sleeves, double side pockets, lightweight cotton.' },
        { name: 'Madewell Linen Halter Dress', price: 9800, sku: 'FA-DRS-028', desc: 'Halter tie neck midi dress, 100% Belgian flax linen, side slit details, open back panel, perfect hot weather resort wear.' },
        { name: 'Free People Oasis Midi Dress', price: 11500, sku: 'FA-DRS-029', desc: 'Bohemian style dress, embroidery details on bodice, balloon sleeves, layered raw hem skirt, elastic smocked cuffs.' },
        { name: 'Lulus Satin Slip Dress', price: 5400, sku: 'FA-DRS-030', desc: 'Elegant cowl neck midi slip dress, glossy satin fabric, adjustable cross back straps, bias-cut drapes beautifully.' }
      ],
      img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'
    },
    // 4. Men's Shirts (10)
    {
      items: [
        { name: 'Polo Ralph Lauren Oxford', price: 9900, sku: 'FA-SHR-031', desc: 'Classic fit long-sleeved sport shirt, breathable cotton oxford, button-down collar, signature embroidered pony logo.' },
        { name: 'Gitman Vintage Flannel Shirt', price: 18500, sku: 'FA-SHR-032', desc: 'Heavyweight brushed cotton flannel, classic check pattern, button-down collar, curved hem, made in the USA.' },
        { name: 'Uniqlo Supima Cotton Tee', price: 990, sku: 'FA-SHR-033', desc: '100% premium long-staple Supima cotton, smooth texture, clean silhouette, durable collar binding, perfect base tee.' },
        { name: 'Patagonia Responsibili-Tee', price: 3490, sku: 'FA-SHR-034', desc: 'Eco-friendly screenprint tee, 100% recycled polyester/cotton blend, Fair Trade certified sewn, classic logo on back.' },
        { name: 'Carhartt K87 Pocket Tee', price: 2290, sku: 'FA-SHR-035', desc: 'Workwear pocket t-shirt, thick heavyweight cotton knit, left chest pocket with sewn-on logo patch, loose fit comfort.' },
        { name: 'Filson Alaskan Guide Shirt', price: 11500, sku: 'FA-SHR-036', desc: 'Rugged cotton flannel guide shirt, tight wind-resistant weave, double-needle stitched seams, expanding chest pockets.' },
        { name: 'Brooks Brothers Button-Down', price: 10900, sku: 'FA-SHR-037', desc: 'Original non-iron cotton dress shirt, button-down collar, signature 6-Free pleat cuffs, durable Supima cotton.' },
        { name: 'Taylor Stitch Jack Shirt', price: 9800, sku: 'FA-SHR-038', desc: 'Tailored casual shirt, custom organic cotton waffle weave texture, lock-stitched buttons, single chest pocket.' },
        { name: 'Fred Perry Laurel Wreath Polo', price: 7900, sku: 'FA-SHR-039', desc: 'Cotton pique polo shirt, twin tipped ribbed collar and cuffs, signature laurel wreath logo embroidery, regular fit.' },
        { name: 'Lacoste Classic L1212 Polo', price: 6900, sku: 'FA-SHR-040', desc: 'Original cotton petit pique polo, ribbed collar, two-button placket, signature green crocodile logo patch.' }
      ],
      img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600'
    },
    // 5. Shoes & Sneakers (10)
    {
      items: [
        { name: 'Nike Air Force 1 \'07', price: 7495, sku: 'FA-SHG-041', desc: 'Classic leather basketball sneaker, foam midsole with encapsulated Air cushioning, clean retro low top styling.' },
        { name: 'Adidas Samba Classic', price: 8999, sku: 'FA-SHG-042', desc: 'Heritage indoor soccer sneaker, soft full-grain leather upper, T-toe suede overlay, signature gum rubber outsole.' },
        { name: 'New Balance 990v6 Sneakers', price: 19999, sku: 'FA-SHG-043', desc: 'Premium lifestyle running shoe, FuelCell foam midsole, ENCAP cushioning, suede/mesh overlays, made in the USA.' },
        { name: 'Birkenstock Boston Clogs', price: 12900, sku: 'FA-SHG-044', desc: 'Suede leather slip-on clog, anatomically shaped cork-latex footbed, adjustable metal buckle strap, EVA outer sole.' },
        { name: 'Dr. Martens 1460 Smooth Boots', price: 14900, sku: 'FA-SHG-045', desc: 'Iconic 8-eyelet combat boots, smooth durable leather, signature yellow welt stitching, AirWair air-cushioned bouncing sole.' },
        { name: 'Clarks Originals Desert Boots', price: 11999, sku: 'FA-SHG-046', desc: 'Classic chukka boot design, premium English suede upper, two-eyelet lace closure, signature natural crepe rubber sole.' },
        { name: 'Converse Chuck 70 High Top', price: 5999, sku: 'FA-SHG-047', desc: 'Premium heavy canvas high-top, vintage license plate branding, OrthoLite cushioned footbed, glossy egret rubber sidewall.' },
        { name: 'Salomon XT-6 Trail Shoe', price: 17999, sku: 'FA-SHG-048', desc: 'Outdoor trail running sneaker, Agile Chassis system, Quicklace toggle draw system, durable Contagrip lugged rubber sole.' },
        { name: 'Vans Old Skool Canvas', price: 4499, sku: 'FA-SHG-049', desc: 'Classic canvas skate shoe, signature leather side stripe, padded collars, durable waffle pattern vulcanized rubber sole.' },
        { name: 'Veja Campo Leather Sneakers', price: 13500, sku: 'FA-SHG-050', desc: 'Sustainable leather sneakers, logo V made of wild rubber and rice waste, organic cotton lining, Amazonian wild rubber sole.' }
      ],
      img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600'
    },
    // 6. Backpacks (10)
    {
      items: [
        { name: 'Fjallraven Kanken Backpack', price: 6999, sku: 'FA-BAG-051', desc: 'Classic Scandinavian school pack, Vinylon F durable waterproof fabric, top handles, reflective logo, removable seat cushion pad.' },
        { name: 'Herschel Heritage Backpack', price: 4999, sku: 'FA-BAG-052', desc: 'Classic functional daypack, signature striped fabric lining, internal laptop sleeve, zippered front pocket with key clip.' },
        { name: 'Patagonia Black Hole MLC 45L', price: 18900, sku: 'FA-BAG-053', desc: 'Maximum legal carry-on travel bag, tough TPU-laminated recycled polyester ripstop, converts from backpack to duffle.' },
        { name: 'Bellroy Classic Backpack Plus', price: 14500, sku: 'FA-BAG-054', desc: 'Minimalist smart commuter pack, dual compartment storage, vertical side pockets, lumbar support back padding, water-resistant woven fabric.' },
        { name: 'Filson Original Briefcase', price: 34900, sku: 'FA-BAG-055', desc: 'Heavy duty work briefcase, 22-oz rugged cotton twill, bridle leather handles and strap, solid brass zipper, weather-resistant.' },
        { name: 'Peak Design Everyday Backpack', price: 23900, sku: 'FA-BAG-056', desc: 'Award-winning camera/everyday backpack, MagLatch top closure, customizable FlexFold internal dividers, weather-proof zip access.' },
        { name: 'Timbuk2 Classic Messenger Bag', price: 8900, sku: 'FA-BAG-057', desc: 'Iconic cycle messenger bag, waterproof TPU interior lining, cam buckle shoulder strap, corner wing fold closure weather guards.' },
        { name: 'Osprey Farpoint 40 Travel Pack', price: 14900, sku: 'FA-BAG-058', desc: 'Travel backpack, stowaway mesh harness and hipbelt, large panel zip access, compression straps, padded laptop pocket.' },
        { name: 'Chrome Industries Citizen Messenger', price: 12500, sku: 'FA-BAG-059', desc: 'Professional grade messenger bag, quick-release seatbelt buckle strap with bottle opener, military grade 1050D nylon.' },
        { name: 'Nomatic Travel Bag 30L', price: 22900, sku: 'FA-BAG-060', desc: 'Smart organization travel bag, shoe compartment, RFID safe pocket, cord pass-through slots, converts to briefcase.' }
      ],
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'
    },
    // 7. Wallets (10)
    {
      items: [
        { name: 'Bellroy Hide & Seek Bifold', price: 6999, sku: 'FA-WLT-061', desc: 'Slim leather bifold wallet, 4 quick access slots, hidden currency section, RFID protection, premium eco-tanned leather.' },
        { name: 'Secrid Slimwallet Card Protector', price: 6500, sku: 'FA-WLT-062', desc: 'Aluminium card protector shell wrapped in fine leather, side trigger lever slides cards out sequentially, RFID shield.' },
        { name: 'Saddleback Leather Bifold', price: 5900, sku: 'FA-WLT-063', desc: 'Heavy full-grain boot leather bifold, stitched with marine-grade thread, pigskin lining, 100-year warranty craftsmanship.' },
        { name: 'Ridge Wallet Matte Aluminium', price: 9500, sku: 'FA-WLT-064', desc: 'Minimalist metal front pocket wallet, holds up to 12 cards, integrated cash strap, RFID-blocking aerospace aluminum.' },
        { name: 'Tanner Goods Utility Bifold', price: 9800, sku: 'FA-WLT-065', desc: 'Classic leather wallet, 3.5oz vegetable-tanned tooling leather, raw cut edges, hand-assembled, ages beautifully.' },
        { name: 'Coach Leather Card Case', price: 4900, sku: 'FA-WLT-066', desc: 'Minimal card holder, crossgrain refined calf leather, 6 card slots, central cash compartment, subtle embossed logo.' },
        { name: 'Fossil Derrick Leather Bifold', price: 2999, sku: 'FA-WLT-067', desc: 'Traditional leather wallet, flip-out ID window, multiple credit card slots, sliding card pocket, contrast stitching.' },
        { name: 'Montblanc Meisterstuck Wallet', price: 26500, sku: 'FA-WLT-068', desc: 'Luxury leather wallet, European full-grain cowhide, deep shine finish, Montblanc emblem jacquard lining, palladium star ring.' },
        { name: 'Herschel Roy Canvas Wallet', price: 1999, sku: 'FA-WLT-069', desc: 'Casual canvas bifold, signature striped fabric liner, multiple card slots, screen printed classic Herschel label.' },
        { name: 'Carhartt Leather Passcase Wallet', price: 2499, sku: 'FA-WLT-070', desc: 'Rugged leather work wallet, removable passcase utility sleeve, antique metal logo emblem, heavy-duty stitching.' }
      ],
      img: 'https://images.unsplash.com/photo-1627124156297-9d42b28d94e1?q=80&w=600'
    },
    // 8. Luggage (10)
    {
      items: [
        { name: 'Away The Bigger Carry-On', price: 22900, sku: 'FA-LUG-071', desc: 'Hard shell spinner luggage, durable polycarbonate shell, ejectable USB battery charger, 360-degree wheels, interior compression.' },
        { name: 'Travelpro Platinum Elite Spinner', price: 28900, sku: 'FA-LUG-072', desc: 'Premium softside luggage, high-density nylon fabric, Duraguard stain-resistant coating, precisionglide magnetic wheel tracking.' },
        { name: 'Rimowa Essential Cabin Polycarbonate', price: 68900, sku: 'FA-LUG-073', desc: 'Luxury lightweight cabin luggage, gloss polycarbonate ribbed shell, TSA-approved locks, flex divider internal system.' },
        { name: 'Samsonite Freeform Spinner', price: 14500, sku: 'FA-LUG-074', desc: 'Modern hardside spinner, lightweight polypropylene shell, double wheels, expandable packing capacity, built-in ID tag.' },
        { name: 'Patagonia Black Hole Duffle 55L', price: 13900, sku: 'FA-LUG-075', desc: 'Weather-resistant duffle bag, heavy duty TPU ripstop fabric, removable padded shoulder backpack straps, reinforced grab handles.' },
        { name: 'Filson Medium Twill Duffle', price: 39500, sku: 'FA-LUG-076', desc: 'Artisanal travel duffle, 22-oz industrial cotton twill, storm-flap closure over zipper, vegetable-tanned bridle leather trims.' },
        { name: 'Herschel Novel Duffle Bag', price: 6999, sku: 'FA-LUG-077', desc: 'Weekend travel bag, signature shoe compartment side sleeve, padded mesh shoulder strap, classic canvas handles.' },
        { name: 'Nomatic Travel Bag 40L', price: 24900, sku: 'FA-LUG-078', desc: 'Ultimate travel backpack-duffle hybrid, laundry pocket, water-resistant zippers, tech pocket, dedicated tablet sleeve.' },
        { name: 'Yeti Crossroads Duffle 60L', price: 18900, sku: 'FA-LUG-079', desc: 'Adventure grade duffle, TuffSkin 840D nylon, structured foam walls prevent collapse, modular internal divider straps.' },
        { name: 'Delsey Helium Aero Hardside', price: 11990, sku: 'FA-LUG-080', desc: 'High-gloss polycarbonate spinner, large front compartment with laptop sleeve (cabin model), expandable zip, double glider wheels.' }
      ],
      img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600'
    },
    // 9. Activewear (10)
    {
      items: [
        { name: 'Lululemon Align Yoga Pant', price: 8900, sku: 'FA-ACT-081', desc: 'Buttery-soft Nulu fabric yoga leggings, weightless naked sensation, high-rise flat waistband, hidden key pocket.' },
        { name: 'Outdoor Voices CloudKnit Tee', price: 4500, sku: 'FA-ACT-082', desc: 'Unbelievably soft lightweight active tee, polyester-spandex performance blend, moisture-wicking and quick drying.' },
        { name: 'Nike Pro Compression Shorts', price: 2495, sku: 'FA-ACT-083', desc: 'Tight compression undershorts, Dri-FIT sweat wicking fabric, elastic wide waistband, flat seams reduce chafing.' },
        { name: 'Under Armour Tech 2.0 Tee', price: 1699, sku: 'FA-ACT-084', desc: 'Loose fit athletic shirt, UA Tech fabric has a soft natural feel, anti-odor technology, streamlined curved hem.' },
        { name: 'Gymshark Vital Seamless Leggings', price: 4900, sku: 'FA-ACT-085', desc: 'Seamless high-waisted gym tights, sweat-wicking knit, jacquard shading contours body shape, ribbed waistband supports.' },
        { name: 'Patagonia Baggies Shorts 5"', price: 4990, sku: 'FA-ACT-086', desc: 'Classic quick-dry active shorts, NetPlus recycled nylon faille, mesh pocket bags, elastic waistband with internal drawcord.' },
        { name: 'Alo Yoga Warrior Mat Bag', price: 5400, sku: 'FA-ACT-087', desc: 'Sleek studio gym bag, water-repellent performance fabric, adjustable shoulder strap, side pockets for phone/cards.' },
        { name: 'Rhone Commuter Pant', price: 11900, sku: 'FA-ACT-088', desc: 'Premium office/active hybrid pants, Flex-knit fabric with 4-way stretch, media pocket, secure zip back pocket.' },
        { name: 'Vuori Performance Jogger', price: 8900, sku: 'FA-ACT-089', desc: 'Slim fit performance joggers, DreamKnit premium stretch fleece, cropped leg, elastic drawcord waist.' },
        { name: 'Tracksmith Van Cortlandt Singlet', price: 5800, sku: 'FA-ACT-090', desc: 'Premium running singlet, lightweight breathable mesh, classic sash design print, gold pins included for racing bib.' }
      ],
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600'
    },
    // 10. Accessories (10)
    {
      items: [
        { name: 'Ray-Ban Wayfarer Classic', price: 9900, sku: 'FA-ACC-091', desc: 'Iconic acetate frame sunglasses, G-15 green crystal lenses, 100% UV protection, classic silver rivet accents.' },
        { name: 'Oakley Holbrook Sunglasses', price: 11900, sku: 'FA-ACC-092', desc: 'Sport lifestyle sunglasses, O Matter stress-resistant lightweight frame, Prizm lenses enhance color/contrast.' },
        { name: 'Persol 714 Folding Sunglasses', price: 23900, sku: 'FA-ACC-093', desc: 'Handcrafted folding acetate sunglasses, Meflecto flexible stem system, signature arrow hinges, crystal lenses.' },
        { name: 'Tom Ford Snowdon Sunglasses', price: 29900, sku: 'FA-ACC-094', desc: 'Luxury thick-frame acetate sunglasses, metal T temple details, vintage rectangular frame, made in Italy.' },
        { name: 'Carhartt Acrylic Watch Hat Beanie', price: 1690, sku: 'FA-ACC-095', desc: 'Classic ribbed watch hat, stretchable rib-knit acrylic yarn, fold-up cuff with sewn-on Carhartt patch.' },
        { name: 'Patagonia Fitz Roy Trout Cap', price: 2990, sku: 'FA-ACC-096', desc: '6-panel trucker hat, organic cotton canvas front, recycled polyester mesh back, adjustable snapback closure.' },
        { name: 'Buff CoolNet UV+ Neck Gaiter', price: 1499, sku: 'FA-ACC-097', desc: 'Seamless multifunctional neckwear, UPF 50+ sun protection, cooling tech fabric, recycled polyester microfiber.' },
        { name: 'Ridge KeyCase Organizer', price: 6500, sku: 'FA-ACC-098', desc: 'Minimalist key organizer, patent-pending tension plate holds 2-6 keys, matte black aerospace grade aluminum.' },
        { name: 'Smartwool Everyday Crew Socks', price: 1999, sku: 'FA-ACC-099', desc: 'Comfortable crew socks, premium Merino wool blend, light cushioning, elastic arch support brace, flat knit toe seam.' },
        { name: 'Seiko 5 Sports Automatic Watch', price: 22500, sku: 'FA-ACC-100', desc: 'Mechanical automatic watch, 24 jewels calibre movement, day/date display, stainless steel case and link bracelet, lumibrite hands.' }
      ],
      img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600'
    }
  ],
  'home-kitchen': [
    // 1. Desk & Table Lamps (10)
    {
      items: [
        { name: 'Anglepoise Type 75 Desk Lamp', price: 19900, sku: 'HK-LMP-001', desc: 'Iconic constant-tension spring mechanism lamp, adjustable shade and arms, matte paint finish with aluminum fittings.' },
        { name: 'Artemide Tolomeo Tavolo Lamp', price: 29500, sku: 'HK-LMP-002', desc: 'Fully cantilevered polished aluminum arm table lamp, tilt adjustable diffuser, joints and tension control knobs.' },
        { name: 'Philips Hue Signe Smart Lamp', price: 18990, sku: 'HK-LMP-003', desc: 'Slim minimalist LED table lamp, millions of colors, syncs with music/movies, Hue app and smart assistant control.' },
        { name: 'Kaiser Idell Kaiser Lux Desk Lamp', price: 49900, sku: 'HK-LMP-004', desc: 'Original Bauhaus design desk lamp, asymmetric swiveling dome shade, chrome-plated steel ball joints, vintage editorial look.' },
        { name: 'Louis Poulsen Panthella Portable', price: 16500, sku: 'HK-LMP-005', desc: 'Battery-powered portable lamp, hemisphere acrylic dome diffuser, glare-free soft downward ambient light glow.' },
        { name: 'Menu Carrie LED Portable Lamp', price: 11500, sku: 'HK-LMP-006', desc: 'Decorative brass handle portable light, opal glass sphere diffuser, USB rechargeable, three step dimmer control.' },
        { name: 'Gubi Cobra Table Lamp', price: 34500, sku: 'HK-LMP-007', desc: 'Retro classic task light, tubular flexible brass neck, swiveling oval steel shade resembling a cobra head.' },
        { name: 'Hay PC Portable Lamp', price: 7990, sku: 'HK-LMP-008', desc: 'Molded plastic portable light, scratch-resistant matte finish, integrated LED light source, rechargeable USB base.' },
        { name: 'Flos Bellhop Portable LED', price: 19900, sku: 'HK-LMP-009', desc: 'Modern mushroom-like rechargeable lamp, colored polycarbonate dome body, 24 hours battery life, micro-USB port.' },
        { name: 'Muuto Control Table Lamp', price: 14500, sku: 'HK-LMP-010', desc: 'Playful minimalist light socket plate, industrial metal tray base, analog rotary control dimmer dial knob.' }
      ],
      img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600'
    },
    // 2. Floor & Pendant Lights (10)
    {
      items: [
        { name: 'Flos Arco Floor Lamp', price: 149000, sku: 'HK-LMP-011', desc: 'Luxury floor lamp, solid white Carrara marble base rectangular block, satin-finish stainless steel adjustable arc arm.' },
        { name: 'AJ Floor Lamp (Louis Poulsen)', price: 68900, sku: 'HK-LMP-012', desc: 'Designed by Arne Jacobsen, tilted cylinder shade, zinc base with opening for cable, matte wet-painted steel.' },
        { name: 'Vitra Akari 10A Floor Lamp', price: 29500, sku: 'HK-LMP-013', desc: 'Isamu Noguchi classic paper lamp, handmade washi paper shade, bamboo ribs, wire frame structure tripod legs.' },
        { name: 'Hay Nelson Bubble Pendant', price: 24500, sku: 'HK-LMP-014', desc: 'Classic saucer shape bubble lamp, steel wire frame coated in plastic polymer spray, soft ambient diffused glow.' },
        { name: 'Muuto Ambit Pendant Light', price: 18900, sku: 'HK-LMP-015', desc: 'Spun aluminum pendant shade, hand-painted interior white for maximal reflection, matching rubber cord wire.' },
        { name: 'Tom Dixon Beat Fat Pendant', price: 38900, sku: 'HK-LMP-016', desc: 'Hand-beaten brass pendant lamp, black patinated exterior, warm golden hand-hammered inner reflecting surface.' },
        { name: 'Menu Hashira Pendant Lamp', price: 19500, sku: 'HK-LMP-017', desc: 'Cylindrical fabric pendant, linen shade wrapped over steel frame panel, floating look, warm home lighting.' },
        { name: 'Gubi Multi-Lite Floor Lamp', price: 54900, sku: 'HK-LMP-018', desc: 'Rotatable half-spheres shades, direct light upwards/downwards/asymmetrically, chrome metal ring frame.' },
        { name: 'Foscarini Caboche Pendant', price: 92500, sku: 'HK-LMP-019', desc: 'Stunning modern pendant lamp, concentric rows of transparent polymethylmethacrylate spheres, frosted glass inner diffuser.' },
        { name: 'Serge Mouille 3-Arm Ceiling Lamp', price: 125000, sku: 'HK-LMP-020', desc: 'Classic mid-century ceiling light, 3 rotating steel arms, swivel joints, aluminum shades with white painted interiors.' }
      ],
      img: 'https://images.unsplash.com/photo-1513506003901-1e6a35b51432?q=80&w=600'
    },
    // 3. Coffee Makers (10)
    {
      items: [
        { name: 'Hario V60 Ceramic Dripper', price: 1999, sku: 'HK-COF-021', desc: 'Signature pour-over coffee dripper, spiral rib grooves, large single exit hole, heat-retaining ceramic body.' },
        { name: 'Chemex 8-Cup Classic Maker', price: 4999, sku: 'HK-COF-022', desc: 'Hourglass non-porous borosilicate glass coffee maker, polished wood collar with leather tie string wrap.' },
        { name: 'Bialetti Moka Express 6-Cup', price: 3499, sku: 'HK-COF-023', desc: 'Original stovetop espresso maker, octagonal aluminum design, safety valve, cool-touch handle and knob.' },
        { name: 'Aeropress Clear Coffee Maker', price: 3999, sku: 'HK-COF-024', desc: 'Patented rapid immersion brewing system, crystal clear tritan plastic cylinder, chamber plunger filter cap.' },
        { name: 'French Press Bodum Chambord', price: 2999, sku: 'HK-COF-025', desc: 'Classic French press coffee maker, heat-resistant borosilicate glass, chrome-plated steel frame casing, 3-part steel filter.' },
        { name: 'Fellow Stagg EKG Kettle', price: 16900, sku: 'HK-COF-026', desc: 'Electric gooseneck kettle, precision pour spout, temperature hold dial control, sleek matte black finish, base display.' },
        { name: 'Breville Barista Express Machine', price: 68900, sku: 'HK-COF-027', desc: 'All-in-one home espresso machine, integrated conical burr grinder, dose control, 15 bar Italian pump pressure, steam wand.' },
        { name: 'DeLonghi Dedica Maestro', price: 24900, sku: 'HK-COF-028', desc: 'Compact pump espresso machine, metal body panels, flow stop, milk frothing wand, fits small counter spaces.' },
        { name: 'Rancilio Silvia Espresso Machine', price: 79900, sku: 'HK-COF-029', desc: 'Professional grade home espresso machine, marine grade brass boiler, 3-way solenoid valve, commercial filter holder.' },
        { name: 'Gaggia Classic Pro Espresso', price: 49900, sku: 'HK-COF-030', desc: 'Commercial style chrome brass group head portafilter, traditional milk frother, rocker switch interface control.' }
      ],
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600'
    },
    // 4. Coffee Accessories (10)
    {
      items: [
        { name: 'Baratza Encore Coffee Grinder', price: 14500, sku: 'HK-ACC-031', desc: 'Conical burr coffee grinder, 40 grind settings, DC motor keeps beans cool, pulse button front, commercial grade.' },
        { name: 'Fellow Ode Gen 2 Grinder', price: 34500, sku: 'HK-ACC-032', desc: 'Precision home brew grinder, 64mm professional flat burrs, anti-static technology, auto-stop sensor.' },
        { name: 'Hario Skerton Pro Manual Grinder', price: 3990, sku: 'HK-ACC-033', desc: 'Hand coffee grinder, ceramic burr core, adjustable grind click, heat-proof glass jar container, sturdy handle.' },
        { name: 'Comandante C40 MK4 Nitro Blade', price: 29500, sku: 'HK-ACC-034', desc: 'Ultimate hand coffee grinder, high-alloy nitrogen steel burr, clicks adjustment, real wood veneer wrap.' },
        { name: 'Acaia Pearl Brewing Scale', price: 16900, sku: 'HK-ACC-035', desc: 'Professional smart coffee brewing scale, real-time flow rate indicator, Bluetooth app integration, touch controls.' },
        { name: 'Timemore Black Mirror Basic Scale', price: 4999, sku: 'HK-ACC-036', desc: 'Sleek digital drip scale, invisible LED screen displays when on, USB rechargeable battery, auto timer.' },
        { name: 'Fellow Tally Pro Scale', price: 18900, sku: 'HK-ACC-037', desc: 'Assist mode scale for perfect pour-overs, OLED screen display, fast response load sensor, premium metal plate.' },
        { name: 'Hario Drip Scale & Timer', price: 3499, sku: 'HK-ACC-038', desc: 'Classic digital coffee scale, measures weight and extraction time simultaneously, simple push button design.' },
        { name: 'Oxo Brew Conical Burr Grinder', price: 9999, sku: 'HK-ACC-039', desc: 'Conical burr grinder, integrated scale measures dosage by weight, 38 grind settings, UV-blocking bean hopper.' },
        { name: 'Capresso Infinity Burr Grinder', price: 8900, sku: 'HK-ACC-040', desc: 'Commercial grade steel conical burrs, safety lock mechanism, slow grinding speed preserves aroma oils.' }
      ],
      img: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=600'
    },
    // 5. Cookware (10)
    {
      items: [
        { name: 'Le Creuset Enameled Dutch Oven', price: 28900, sku: 'HK-CW-041', desc: '5.5-Qt round cast iron dutch oven, durable vitreous enamel coating, secure lid fit, iconic signature colors.' },
        { name: 'Lodge Cast Iron Skillet 12"', price: 2999, sku: 'HK-CW-042', desc: 'Pre-seasoned cast iron pan, dual pour spouts, loop helper handle, retains heat exceptionally well, made in USA.' },
        { name: 'Wusthof Classic 8" Chef Knife', price: 14500, sku: 'HK-CW-043', desc: 'Precision forged high-carbon steel chef knife, triple riveted full tang handle, hand polished edge sharpness.' },
        { name: 'Shun Classic 8" Kiritsuke Knife', price: 18900, sku: 'HK-CW-044', desc: 'Artisanal Japanese chef knife, VG-MAX steel cutting core wrapped in 68 layers of Damascus steel, D-shaped ebony handle.' },
        { name: 'All-Clad d5 Stainless Fry Pan 10"', price: 13900, sku: 'HK-CW-045', desc: 'Patented 5-ply bonded construction, stainless steel exterior, aluminum core, warp-resistant, helper handle.' },
        { name: 'Staub Cocotte 5.5-Qt Round', price: 26900, sku: 'HK-CW-046', desc: 'Enameled cast iron cocotte, matte black enameled interior, flat self-basting spike lid, nickel steel knob.' },
        { name: 'Global G-2 Chef Knife 8"', price: 9800, sku: 'HK-CW-047', desc: 'Unique hollow stainless steel handle filled with sand for balance, CROMOVA 18 steel blade, razor sharp edge.' },
        { name: 'Victorinox Fibrox Chef Knife 8"', price: 3499, sku: 'HK-CW-048', desc: 'Lightweight professional chef knife, high-carbon stainless steel blade, non-slip textured Fibrox handle.' },
        { name: 'Caraway Ceramic Cookware Set', price: 39500, sku: 'HK-CW-049', desc: 'Non-toxic ceramic nonstick set (12-piece), aluminum core, stainless steel handles, canvas organizers and lid holder.' },
        { name: 'Lodge Enameled Dutch Oven 6-Qt', price: 8900, sku: 'HK-CW-050', desc: 'Double enameled cast iron pot, porcelain enamel finish, self-basting lid, stainless steel loop knob.' }
      ],
      img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600'
    },
    // 6. Dinnerware (10)
    {
      items: [
        { name: 'Furi Hand-Glazed Dinner Plates Set', price: 3999, sku: 'HK-DW-051', desc: 'Set of 4 hand-glazed stoneware plates, organic uneven rims, earth-toned matte borders, dishwasher and microwave safe.' },
        { name: 'Royal Doulton 16-Piece Dinnerware Set', price: 12500, sku: 'HK-DW-052', desc: 'Classic white porcelain set, 4 dinner plates, 4 salad plates, 4 cereal bowls, 4 mugs, subtle ribbed line textures.' },
        { name: 'Wedgwood Gio Mug Set of 4', price: 5900, sku: 'HK-DW-053', desc: 'Intaglio textured bone china mugs, white geometric relief pattern, dishwasher safe, elegant breakfast table addition.' },
        { name: 'Noritake Colorwave Coupe Dinnerware', price: 14800, sku: 'HK-DW-054', desc: 'Set of 4 setting coupes, matte finish exterior, glossy white interior glaze, premium chip-resistant stoneware.' },
        { name: 'Corelle Vitrelle 18-Piece Set', price: 6990, sku: 'HK-DW-055', desc: 'Triple-layer strong Vitrelle glass plates and bowls, space-saving stackable, break and chip resistant.' },
        { name: 'Villeroy & Boch Manufacture Rock', price: 18900, sku: 'HK-DW-056', desc: 'Matte slate-look porcelain plate set, textured surface, premium quality, modern dark gray styling.' },
        { name: 'Denby Imperial Blue Mug Set', price: 6500, sku: 'HK-DW-057', desc: 'Stoneware mugs handcraft in England, vibrant cobalt blue glaze inside white glaze, extremely durable.' },
        { name: 'Lenox Butterfly Meadow Set', price: 11500, sku: 'HK-DW-058', desc: 'Bone china dinnerware, classic botanical butterfly floral print, scalloped rims, dishwasher safe.' },
        { name: 'Mikasa Delray Bone China Set', price: 13900, sku: 'HK-DW-059', desc: '40-piece bone china set (service for 8), clean white translucent body, classic round shape, chip resistant.' },
        { name: 'Williams Sonoma Brasserie Set', price: 9800, sku: 'HK-DW-060', desc: 'French bistro style dinnerware, white porcelain with thin blue ring borders, commercial grade durability.' }
      ],
      img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600'
    },
    // 7. Tablecloths (10)
    {
      items: [
        { name: 'Fog Linen Work Linen Tablecloth', price: 8900, sku: 'HK-TAB-061', desc: '100% natural Lithuanian flax linen, woven border seams, softens with every wash, natural light tan color.' },
        { name: 'Coyuchi Organic Cotton Tablecloth', price: 7500, sku: 'HK-TAB-062', desc: 'Organic cotton, woven waffle texture border, lightweight, dyed with non-toxic botanical colors.' },
        { name: 'Cultiver Flax Linen Tablecloth', price: 11900, sku: 'HK-TAB-063', desc: 'Premium French linen, pre-washed for softness, elegant drape, available in charcoal and oatmeal.' },
        { name: 'Williams Sonoma Jacquard Table Runner', price: 3490, sku: 'HK-TAB-064', desc: 'Woven cotton-linen blend runner, classic damask floral print pattern, heavy hemmed borders.' },
        { name: 'Solino Home Linen Napkins Set', price: 2290, sku: 'HK-TAB-065', desc: 'Set of 4 pure flax linen dinner napkins, mitered corners, classic hemstitch details.' },
        { name: 'West Elm Organic Cotton Napkins', price: 1990, sku: 'HK-TAB-066', desc: 'Set of 4 soft cotton napkins, geometric textured print, machine washable, modern styling.' },
        { name: 'Target Threshold Kitchen Towels Pack', price: 990, sku: 'HK-TAB-067', desc: 'Pack of 4 waffle weave absorbent kitchen towels, organic cotton loop hangers, lint-free.' },
        { name: 'DII Cotton Kitchen Towels Set', price: 1290, sku: 'HK-TAB-068', desc: 'Set of 5 striped cotton dishtowels, heavy duty weave, multi-purpose cleaning and drying.' },
        { name: 'Fecido Classic Kitchen Towels Set', price: 1590, sku: 'HK-TAB-069', desc: 'Pack of 3 heavy-grade European cotton kitchen tea towels, grid texture, highly absorbent.' },
        { name: 'Maison d\'Hermine Tablecloth', price: 4500, sku: 'HK-TAB-070', desc: '100% cotton print tablecloth, watercolor floral motifs, hand finished double hems.' }
      ],
      img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600'
    },
    // 8. Furniture (10)
    {
      items: [
        { name: 'Herman Miller Eames Lounge Chair', price: 239000, sku: 'HK-FUR-071', desc: 'Iconic lounge chair and ottoman, molded plywood shells, premium leather upholstery, die-cast aluminum base.' },
        { name: 'Vitra Standard Chair', price: 38900, sku: 'HK-FUR-072', desc: 'Designed by Jean Prouve, sheet steel back legs distribute weight, oak veneer seat and back panel.' },
        { name: 'Fritz Hansen Series 7 Chair', price: 32500, sku: 'HK-FUR-073', desc: 'Designed by Arne Jacobsen, pressure-molded sliced veneer panel seat, stackable steel tube legs.' },
        { name: 'Knoll Womb Chair & Ottoman', price: 185000, sku: 'HK-FUR-074', desc: 'Eero Saarinen classic, fiberglass shell wrapped in foam and premium wool fabric, steel rod frame legs.' },
        { name: 'Hay About A Chair AAC 22', price: 19800, sku: 'HK-FUR-075', desc: 'Ergonomic molded plastic shell armchair, curved solid oak wooden legs base, minimalist Scandinavian.' },
        { name: 'Muuto Visu Wood Base Chair', price: 21500, sku: 'HK-FUR-076', desc: 'Form-pressed oak veneer shell, matching solid wood legs, understated sleek profile.' },
        { name: 'Carl Hansen CH24 Wishbone Chair', price: 44900, sku: 'HK-FUR-077', desc: 'Handcrafted dining chair, steam-bent solid wood backrest, hand-woven paper cord seat (120 meters cord).' },
        { name: 'Article Sven Velvet Armchair', price: 54900, sku: 'HK-FUR-078', desc: 'Mid-century style armchair, high-density foam seat with tufting, soft velvet upholstery, tapered wood legs.' },
        { name: 'West Elm Slope Leather Chair', price: 22900, sku: 'HK-FUR-079', desc: 'Industrial dining chair, curved seat wrapped in top-grain aniline leather, powder-coated steel legs.' },
        { name: 'IKEA Poang Armchair', price: 8900, sku: 'HK-FUR-080', desc: 'Layer-glued bent birch frame, high back supports neck, soft removable fabric cushion padding.' }
      ],
      img: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600'
    },
    // 9. Cushions (10)
    {
      items: [
        { name: 'Coyuchi Organic Cotton Throw Pillow', price: 4900, sku: 'HK-DEC-081', desc: 'Organic cotton knit cushion cover, down feather insert included, textured seed stitch pattern.' },
        { name: 'West Elm Velvet Cushion Cover', price: 1990, sku: 'HK-DEC-082', desc: 'Lush cotton-viscose velvet cushion casing, invisible side zip closure, available in jewel tones.' },
        { name: 'CB2 Linen Throw Pillow', price: 3490, sku: 'HK-DEC-083', desc: 'Pure linen textured throw pillow, contrast piping trim edges, polyfill insert included.' },
        { name: 'Schoolhouse Cotton Cushion Cover', price: 4500, sku: 'HK-DEC-084', desc: 'Heavy-grade cotton canvas cushion cover, screen printed plaid checks pattern, metal zipper.' },
        { name: 'Pottery Barn Faux Fur Throw Pillow', price: 3990, sku: 'HK-DEC-085', desc: 'Incredibly plush acrylic faux fur cushion, polyester backing, down blend insert.' },
        { name: 'Pendleton Wool Cushion Cover', price: 7900, sku: 'HK-DEC-086', desc: 'Woven wool cushion casing, classic Native American geometric pattern jacquard, zippered.' },
        { name: 'IKEA Sanela Velvet Cushion Cover', price: 990, sku: 'HK-DEC-087', desc: 'Thick cotton velvet cover, soft to touch, hidden zip, machine washable.' },
        { name: 'Restoration Hardware Linen Pillow', price: 8900, sku: 'HK-DEC-088', desc: 'Heavy Belgian linen cushion cover, natural feather down insert, hand-finished seams.' },
        { name: 'Serena & Lily Cable Knit Pillow', price: 6500, sku: 'HK-DEC-089', desc: 'Cotton-wool blend cable knit pillow cover, wood button envelope back closure.' },
        { name: 'Target Opalhouse Fringe Cushion', price: 1890, sku: 'HK-DEC-090', desc: 'Textured canvas throw pillow, colorful tassel fringe borders, polyester insert.' }
      ],
      img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600'
    },
    // 10. Organizers (10)
    {
      items: [
        { name: 'Yamazaki Tosca Storage Basket', price: 2990, sku: 'HK-ORG-091', desc: 'Steel wire storage bin, white powder coat, solid ash wood carry handles, Japanese design.' },
        { name: 'Open Spaces Entryway Shoe Rack', price: 9900, sku: 'HK-ORG-092', desc: 'Three-tier steel storage rack, rounded corner panels, durable powder coat finish, holds 9 pairs.' },
        { name: 'Muuto Restore Felt Basket', price: 6900, sku: 'HK-ORG-093', desc: 'Storage bin made of fibers from recycled plastic bottles, soft felt appearance, cutout handle slots.' },
        { name: 'Hay Color Crate Medium', price: 990, sku: 'HK-ORG-094', desc: 'Collapsible perforated plastic crate, stackable storage solution, recycled post-industrial plastic.' },
        { name: 'iDesign Plastic Storage Bins Pack', price: 2490, sku: 'HK-ORG-095', desc: 'Pack of 4 clear BPA-free plastic bins, integrated handles, ideal for fridge and pantry organization.' },
        { name: 'Target Brightroom Metal Basket', price: 1290, sku: 'HK-ORG-096', desc: 'Wire storage grid basket, satin black finish, natural bamboo wooden rim band.' },
        { name: 'Container Store Elfa Drawer System', price: 14500, sku: 'HK-ORG-097', desc: 'Wire basket drawer system, epoxy-bonded steel frame, 4 slide-out wire drawers, smooth rollers.' },
        { name: 'West Elm Lacquer Trays Set', price: 4900, sku: 'HK-ORG-098', desc: 'Set of 2 nesting lacquer serving/desk trays, high gloss finish, cutout handles.' },
        { name: 'Yamazaki Tower Dish Drying Rack', price: 4500, sku: 'HK-ORG-099', desc: 'Sleek steel dish drainer, self-draining water spout tray, adjustable cutlery holder basket.' },
        { name: 'IKEA Skadis Pegboard Pack', price: 2990, sku: 'HK-ORG-100', desc: 'Wood fiber pegboard sheet, wall mounting rails, customize with Skadis containers and hooks.' }
      ],
      img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600'
    },
    // 11. Sofas & Loveseats (10)
    {
      items: [
        { name: 'West Elm Haven Velvet Sofa', price: 89000, sku: 'HK-SOF-001', desc: 'Deep-seated 3-seater sofa, premium performance velvet upholstery, down-filled cushions, solid wood legs.' },
        { name: 'Article Sven Tan Leather Sofa', price: 149000, sku: 'HK-SOF-002', desc: 'Mid-century modern tan leather sofa, full-grain aniline dyed leather, tufted bench seat, bolster pillows.' },
        { name: 'IKEA Landskrona Loveseat', price: 45000, sku: 'HK-SOF-003', desc: 'Compact 2-seater loveseat, durable Tufted coated fabric, metal steel legs, supportive pocket spring cushions.' },
        { name: 'Floyd The Sectional Sofa', price: 189000, sku: 'HK-SOF-004', desc: 'Modular configuration sectional sofa, stain-resistant blend fabric, dense foam cushions, powder-coated steel brackets.' },
        { name: 'Burrow Nomad Fabric Sofa', price: 79000, sku: 'HK-SOF-005', desc: 'Tight-weave scratch-resistant fabric sofa, built-in USB charger port, reversible back cushions, solid oak wood frame.' },
        { name: 'Castlery Jonathan Chesterfield Sofa', price: 110000, sku: 'HK-SOF-006', desc: 'Traditional Chesterfield deep button-tufted sofa, roll arms design, solid wood turned legs, gray linen weave.' },
        { name: 'Joybird Briar Sleep Sofa', price: 125000, sku: 'HK-SOF-007', desc: 'Convertible sleeper sofa bed, pull-out memory foam mattress, high-density foam cushions, tapered oak wood feet.' },
        { name: 'Pottery Barn Pearce Sectional', price: 219000, sku: 'HK-SOF-008', desc: 'L-shaped roll-arm down-blend cushion sectional sofa, heavy-duty performance canvas fabric, kiln-dried hardwood frame.' },
        { name: 'Article Nord Velvet Daybed', price: 69000, sku: 'HK-SOF-009', desc: 'Minimalist daybed sofa, tufted velvet cushion, single bolster, solid oak legs, perfect for reading nooks.' },
        { name: 'IKEA Vimle 3-Seat Sofa with Chaise', price: 59000, sku: 'HK-SOF-010', desc: 'Family-friendly modular sofa with chaise, removable washable cotton cover, under-chaise storage compartment.' }
      ],
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600'
    },
    // 12. Beds & Mattresses (10)
    {
      items: [
        { name: 'Sleepyhead Original Orthopedic Mattress', price: 14900, sku: 'HK-BED-001', desc: '3-zone orthopedic memory foam mattress, high-density base foam, breathable top cover, pressure relief.' },
        { name: 'The Sleep Company SmartGRID Mattress', price: 24900, sku: 'HK-BED-002', desc: 'Patented SmartGRID technology mattress, motion isolation, breathable cooling channels, luxury medium firm support.' },
        { name: 'Flo Solid Sheesham Wood Queen Bed', price: 34900, sku: 'HK-BED-003', desc: 'Premium Sheesham wood queen-size bed frame, natural grain finish, slatted support system, minimalist headboard.' },
        { name: 'Wakefit Taurus Engineered Wood Bed', price: 12900, sku: 'HK-BED-004', desc: 'Queen-size bed with spacious hydraulic under-bed storage, premium walnut wood-grain finish.' },
        { name: 'Emma Original Memory Foam Mattress', price: 18900, sku: 'HK-BED-005', desc: 'German engineered 3-layer foam mattress, climate regulating top cover, adaptive body contouring.' },
        { name: 'Sleepwell Cocoon Dual Comfort Mattress', price: 9900, sku: 'HK-BED-006', desc: 'Dual-sided reversible mattress, firm support on one side, soft cushioning on the other, breathable fabric.' },
        { name: 'Urban Ladder Solid Wood Storage Bed', price: 42900, sku: 'HK-BED-007', desc: 'King-size solid teak wood bed frame, four drawers under-bed storage, tufted headboard backing.' },
        { name: 'Duroflex LiveIn Memory Foam Mattress', price: 11900, sku: 'HK-BED-008', desc: 'DIY roll-pack mattress in a box, contouring memory foam, anti-microbial fabric cover, supportive base.' },
        { name: 'Kurl-On Kurlo-Bond Coir Mattress', price: 8900, sku: 'HK-BED-009', desc: 'Natural rubberised coir mattress, high-density bonded foam core, therapeutic spine support, quilted cover.' },
        { name: 'Pepperfry Solid Wood Poster Canopy Bed', price: 54900, sku: 'HK-BED-010', desc: 'Traditional king-size four-poster canopy bed frame, solid mahogany wood, elegant turned spindles.' }
      ],
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600'
    },
    // 13. Ceiling Fans (10)
    {
      items: [
        { name: 'Orient Electric Apex-FX Ceiling Fan', price: 1899, sku: 'HK-FAN-001', desc: 'High-speed ceiling fan, copper motor, 1200mm sweeps, rust-free powder coated aluminum blades.' },
        { name: 'Havells Ambrose Decorative Ceiling Fan', price: 2999, sku: 'HK-FAN-002', desc: 'Premium decorative fan, metallic paint finish, high air delivery, silent operation double ball bearings.' },
        { name: 'Atomberg Renesa Smart BLDC Fan', price: 3899, sku: 'HK-FAN-003', desc: 'Energy-saving brushless DC motor ceiling fan, remote control, LED speed indicator, consumes 28W only.' },
        { name: 'Crompton Hill Briz Ceiling Fan', price: 1699, sku: 'HK-FAN-004', desc: 'Reliable high-speed utility fan, 100% copper winding, double ball bearing, 1200mm blade sweeps.' },
        { name: 'Orient Electric Wendy Decorative Fan', price: 3499, sku: 'HK-FAN-005', desc: 'Stylish color combination ceiling fan, wide blades for high air thrust, silent durable motor.' },
        { name: 'Havells Efficiencia Neo BLDC Fan', price: 3699, sku: 'HK-FAN-006', desc: 'Super-efficient BLDC fan, 5-star energy saving rating, runs three times longer on inverter backup.' },
        { name: 'Luminous Dhoom High Speed Fan', price: 1799, sku: 'HK-FAN-007', desc: 'Classic white utility fan, high speed 380 RPM, copper motor, wide blade angle design.' },
        { name: 'Atomberg Efficio BLDC Ceiling Fan', price: 3299, sku: 'HK-FAN-008', desc: 'BLDC motor fan with remote control, sleep mode timer speed regulation, saves up to ₹1500 yearly.' },
        { name: 'Usha Swift High Speed Ceiling Fan', price: 1850, sku: 'HK-FAN-009', desc: 'High speed fan, pressure die cast motor casing, gloss powder coat paint, 100% copper windings.' },
        { name: 'Crompton Energion Silent Pro BLDC', price: 4999, sku: 'HK-FAN-010', desc: 'Silent BLDC ceiling fan, activBLDC tech, smart remote regulation, aerodynamically designed blades.' }
      ],
      img: 'https://images.unsplash.com/photo-1618944913488-8292c2df9e8e?q=80&w=600'
    },
    // 14. Water Purifiers (10)
    {
      items: [
        { name: 'Kent Grand Plus RO Water Purifier', price: 16900, sku: 'HK-PUR-001', desc: 'RO+UV+UF water purification with TDS controller, patented mineral RO technology, 9-liter storage tank.' },
        { name: 'Aquaguard Ritz Active Copper Purifier', price: 18900, sku: 'HK-PUR-002', desc: 'RO+UV+MTDS purification, active copper tech infusion, premium e-boiling, stainless steel tank.' },
        { name: 'Pureit Copper+ Mineral RO Purifier', price: 19990, sku: 'HK-PUR-003', desc: '7-stage purification, copper charge technology, dual water dispensing choice, mineral cartridge.' },
        { name: 'AO Smith Z9 Green RO Purifier', price: 22900, sku: 'HK-PUR-004', desc: 'Hot water dispensing RO purifier, 8-stage purification, mineralizer tech, green energy saving.' },
        { name: 'Havells Max Alkaline RO Purifier', price: 14900, sku: 'HK-PUR-005', desc: 'Alkaline mineral RO+UV water purifier, raises pH level of water, transparent tank.' },
        { name: 'Kent Ultra Storage UV Purifier', price: 8900, sku: 'HK-PUR-006', desc: 'Double purification UV+UF, 8-liter storage tank, high power 11W UV lamp, computer controlled.' },
        { name: 'Aquaguard Marvel RO+UV Purifier', price: 13900, sku: 'HK-PUR-007', desc: 'RO+UV+Taste Adjuster MTDS purifier, active copper technology, wall mount compact design.' },
        { name: 'Pureit Vital Max RO+UV Purifier', price: 11900, sku: 'HK-PUR-008', desc: 'RO+UV filtration, FiltraPower technology removes heavy metals, 7-liter storage, water saving.' },
        { name: 'AO Smith X8 Green RO Purifier', price: 17900, sku: 'HK-PUR-009', desc: 'RO+SCMT protection, Green RO recovery technology saves 2x water, mineralizer cartridge.' },
        { name: 'V-Guard Zenora RO+UV+MB Purifier', price: 9900, sku: 'HK-PUR-010', desc: '7-stage RO UV purification, mineral balancer, smart LED indicators, food-grade storage tank.' }
      ],
      img: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=600'
    },
    // 15. Gas Stoves & Cooktops (10)
    {
      items: [
        { name: 'Prestige Marvel Glass 3 Burner Stove', price: 4999, sku: 'HK-STV-001', desc: '3-burner gas table, shatterproof black toughened glass top, high efficiency brass burners.' },
        { name: 'Elica Vetro Glass Top 4 Burner Stove', price: 6900, sku: 'HK-STV-002', desc: '4-burner manual gas stove, premium glass cooktop finish, euro-coated grid pan supports.' },
        { name: 'Pigeon by Stovekraft Favourite 2 Burner', price: 1999, sku: 'HK-STV-003', desc: '2-burner gas stove, stainless steel body, brass burners, unique user-friendly knobs.' },
        { name: 'Prestige Royale Plus Glass 4 Burner', price: 9500, sku: 'HK-STV-004', desc: '4-burner gas cooktop, Schott glass top, Sabaf Italian gas valves, spill-proof designs.' },
        { name: 'Glen Glass Cooktop 3 High Burners', price: 5400, sku: 'HK-STV-005', desc: '3-burner gas stove, aluminum alloy burners, toughened glass top, rich black body finish.' },
        { name: 'Elica Vetro 3 Burner Auto Ignition', price: 5900, sku: 'HK-STV-006', desc: 'Auto-ignition 3-burner gas stove, battery free spark, toughened black glass top.' },
        { name: 'Pigeon Aster Glass 3 Burner Stove', price: 2999, sku: 'HK-STV-007', desc: '3-burner cooktop, powder-coated body, strong tubular legs, spill tray steel plates.' },
        { name: 'Sunflame GT Pride 2 Burner Gas Stove', price: 2600, sku: 'HK-STV-008', desc: '2-burner gas table, extra spacious toughened glass cooktop, brass burners.' },
        { name: 'Glen Gourmet 4 Burner Glass Cooktop', price: 8900, sku: 'HK-STV-009', desc: '4-burner gas stove, heavy-duty pan support, multi-spark auto-ignition, high-end knobs.' },
        { name: 'Butterfly Smart Glass 3 Burner Stove', price: 3499, sku: 'HK-STV-010', desc: '3-burner cooktop, flame retardant front knobs, designer glass plate, easy cleaning spill trays.' }
      ],
      img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600'
    }
  ],
  'beauty-health': [
    // 1. Serums (10)
    {
      items: [
        { name: 'SkinCeuticals C E Ferulic Serum', price: 14900, sku: 'BH-SRM-001', desc: 'Patented daytime Vitamin C antioxidant serum, 15% pure L-ascorbic acid, 1% alpha-tocopherol, 0.5% ferulic acid.' },
        { name: 'Sunday Riley Good Genes Glycolic', price: 9500, sku: 'BH-SRM-002', desc: 'Deeply exfoliating glycolic acid treatment, plumps fine lines, brightens skin tone, instantly reveals radiant skin.' },
        { name: 'The Ordinary Niacinamide 10%', price: 750, sku: 'BH-SRM-003', desc: 'Water-based serum with niacinamide (Vitamin B3) and zinc PCA, regulates sebum production, reduces skin blemishes.' },
        { name: 'Paula\'s Choice 2% BHA Exfoliant', price: 3400, sku: 'BH-SRM-004', desc: 'Salicylic acid liquid exfoliant, unclogs pores, smooths wrinkles, evens out skin tone, non-abrasive formula.' },
        { name: 'Glow Recipe Watermelon Niacinamide', price: 2990, sku: 'BH-SRM-005', desc: 'Dew Drops highlighting serum, niacinamide infused, hydrates and visibly reduces hyperpigmentation for a dewy glow.' },
        { name: 'Drunk Elephant C-Firma Fresh', price: 6800, sku: 'BH-SRM-006', desc: '15% Vitamin C day serum, l-ascorbic acid powder mixed fresh before first use, firms and brightens skin texture.' },
        { name: 'Paula\'s Choice 10% Azelaic Acid', price: 3900, sku: 'BH-SRM-007', desc: 'Booster multi-tasking cream, azelaic and salicylic acid blend, reduces brown spots and redness from past breakouts.' },
        { name: 'The Ordinary Hyaluronic Acid 2%', price: 850, sku: 'BH-SRM-008', desc: 'Hydrating serum, low/medium/high molecular weight hyaluronic acid molecules, B5 vitamin for deep hydration plumping.' },
        { name: 'Caudalie Vinoperfect Radiance', price: 5400, sku: 'BH-SRM-009', desc: 'Oil-free brightening serum, patented Viniferine derived from grape sap (62x more effective than Vitamin C), reduces dark spots.' },
        { name: 'La Roche-Posay Hyalu B5 Serum', price: 2990, sku: 'BH-SRM-010', desc: 'Anti-aging skin repair serum, pure hyaluronic acid, vitamin B5, madecassoside, locks in moisture and repairs barrier.' }
      ],
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600'
    },
    // 2. Moisturizers (10)
    {
      items: [
        { name: 'CeraVe Moisturising Cream', price: 1250, sku: 'BH-MST-011', desc: 'Rich face and body cream, 3 essential ceramides, hyaluronic acid, MVE technology for 24-hour continuous hydration.' },
        { name: 'Kiehl\'s Ultra Facial Cream', price: 3400, sku: 'BH-MST-012', desc: '24-hour daily face moisturizer, glacial glycoprotein, olive-derived squalane, lightweight and non-greasy.' },
        { name: 'La Mer Crème de la Mer', price: 26500, sku: 'BH-MST-013', desc: 'Ultra-rich luxury moisturizing cream, Miracle Broth cell-renewing elixir, lime tea extract, heals dry skin.' },
        { name: 'Weleda Skin Food Original', price: 1850, sku: 'BH-MST-014', desc: 'Intensively hydrating thick skin cream, pansy, calendula and chamomile extracts, organic sunflower oil base.' },
        { name: 'First Aid Beauty Ultra Repair Cream', price: 2900, sku: 'BH-MST-015', desc: 'Intense hydration fast-absorbing cream, colloidal oatmeal, shea butter, squalane, safe for sensitive eczema skin.' },
        { name: 'Clinique Moisture Surge 100H', price: 2950, sku: 'BH-MST-016', desc: 'Oil-free gel-cream moisturizer, aloe bio-ferment, hyaluronic acid, auto-replenishing technology hydrates 100 hours.' },
        { name: 'Neutrogena Hydro Boost Water Gel', price: 1150, sku: 'BH-MST-017', desc: 'Lightweight oil-free moisturizer, hyaluronic acid instantly absorbs like a gel but hydrates like a cream.' },
        { name: 'Tatcha The Water Cream', price: 5900, sku: 'BH-MST-018', desc: 'Oil-free anti-aging moisturizer, Japanese wild rose, leopard lily, Hadasei-3 superfood ferment complex.' },
        { name: 'Dr. Jart+ Ceramidin Cream', price: 3900, sku: 'BH-MST-019', desc: 'Deep moisture barrier cream, 5-Cera Complex ceramides, prevents water loss, strengthens dry irritated skin.' },
        { name: 'Youth to the People Superfood', price: 4400, sku: 'BH-MST-020', desc: 'Air-whip moisture cream, kale, spinach, green tea antioxidant extracts, hyaluronic acid, lightweight hydration.' }
      ],
      img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600'
    },
    // 3. Face Masks (10)
    {
      items: [
        { name: 'Sand & Sky Pink Clay Mask', price: 3490, sku: 'BH-MSK-021', desc: '4-in-1 pore tightening mask, Australian pink clay, kelp and witch hazel, brightens and refines skin texture.' },
        { name: 'Aztec Secret Healing Clay', price: 1150, sku: 'BH-MSK-022', desc: '100% natural calcium bentonite clay powder, deep pore cleansing facial mask, mix with apple cider vinegar.' },
        { name: 'Laneige Water Sleeping Mask', price: 2200, sku: 'BH-MSK-023', desc: 'Overnight hydrating gel mask, Probiotic-Derived Complex, squalane, locks in hydration while you sleep.' },
        { name: 'Summer Fridays Jet Lag Mask', price: 4200, sku: 'BH-MSK-024', desc: 'Nourishing cream mask, niacinamide, glycerin, hyaluronic acid, antioxidants, can be used as overnight cream.' },
        { name: 'Origins Clear Improvement Mask', price: 2900, sku: 'BH-MSK-025', desc: 'Active charcoal mask, white China clay, extracts environmental toxins and unclogs pores, clears skin.' },
        { name: 'Drunk Elephant Babyfacial', price: 6900, sku: 'BH-MSK-026', desc: 'AHA/BHA facial peel, 25% AHA (glycolic/tartaric/lactic) and 2% BHA, resurfaces skin, smooths texture.' },
        { name: 'The Ordinary Peeling Solution', price: 950, sku: 'BH-MSK-027', desc: 'AHA 30% + BHA 2% exfoliating peeling solution, 10-minute facial, Tazmanian Pepperberry reduces irritation.' },
        { name: 'Fresh Umbrian Clay Purifying Mask', price: 4900, sku: 'BH-MSK-028', desc: 'Mineral-rich clay treatment, purifies skin, minimizes pores, can be used as deep daily face cleanser.' },
        { name: 'Kiehl\'s Rare Earth Clay Mask', price: 2900, sku: 'BH-MSK-029', desc: 'Deep pore cleansing masque, formulated with Amazonian White Clay, removes dirt, toxins, and excess oils.' },
        { name: 'Glamglow Supermud Clearing Mask', price: 5400, sku: 'BH-MSK-030', desc: 'Clarifying charcoal mud mask, six exfoliating acids (AHA/BHA), active-x charcoal, clears skin imperfections.' }
      ],
      img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600'
    },
    // 4. Hair Oils (10)
    {
      items: [
        { name: 'Olaplex No. 7 Bonding Oil', price: 2950, sku: 'BH-HAR-031', desc: 'Highly concentrated lightweight styling oil, repairs damaged hair bonds, heat protection up to 450°F, adds shine.' },
        { name: 'Moroccanoil Treatment Original', price: 3800, sku: 'BH-HAR-032', desc: 'Argan oil infused hair treatment, detangles, speeds up blow-drying time, boosts shine, conditions split ends.' },
        { name: 'Kérastase Elixir Ultime Hair Oil', price: 4500, sku: 'BH-HAR-033', desc: 'Luxury beautifying hair oil, camellia and argan oil blend, long-lasting anti-frizz control, thermal protection.' },
        { name: 'Briogeo Don\'t Despair Oil', price: 2900, sku: 'BH-HAR-034', desc: 'Strengthening treatment oil, rosehip oil and macadamia derivatives, seals hair cuticles, repairs split ends.' },
        { name: 'Gisou Honey Infused Hair Oil', price: 3900, sku: 'BH-HAR-035', desc: 'Premium hair oil, enriched with Mirsalehi honey, maintains natural moisture balance, rebuilds and repairs.' },
        { name: 'Verb Ghost Oil', price: 1850, sku: 'BH-HAR-036', desc: 'Vanishing daily restorative oil, moringa oil blend, smooths frizz, locks in moisture without weighing down thin hair.' },
        { name: 'L\'Anza Keratin Healing Oil', price: 3400, sku: 'BH-HAR-037', desc: 'Volumizing treatment oil, Phyto IV Complex, adds deep moisture, heals damaged keratin structure, UV protection.' },
        { name: 'The Ordinary Multi-Peptide Hair Density', price: 1990, sku: 'BH-HAR-038', desc: 'Concentrated serum for hair density, Redensyl, Procapil, and Capixyl peptide complexes, promotes thicker growth.' },
        { name: 'Virtue Labs Healing Oil', price: 3600, sku: 'BH-HAR-039', desc: 'Nutrient-rich hair oil, Alpha Keratin 60ku clinical protein, repairs dry strands, adds brilliant shine.' },
        { name: 'OUAI Hair Oil & Styling Heat Protectant', price: 2800, sku: 'BH-HAR-040', desc: 'Multitasking oil, ama oil and borage seed oil blend, locks in hair color, seals split ends, high shine.' }
      ],
      img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=600'
    },
    // 5. Shampoos (10)
    {
      items: [
        { name: 'Olaplex No. 4 Bond Shampoo', price: 2950, sku: 'BH-SHM-041', desc: 'Bond maintenance daily shampoo, highly moisturizing, repairs split ends, color-safe, sulfate-free.' },
        { name: 'Pureology Hydrate Shampoo', price: 3100, sku: 'BH-SHM-042', desc: 'Deeply hydrating shampoo for color-treated hair, jojoba, green tea, sage extracts, signature aromatherapy scent.' },
        { name: 'Briogeo Charcoal Scalp Revival', price: 3400, sku: 'BH-SHM-043', desc: 'Micro-exfoliating scalp shampoo, binchotan charcoal, tea tree and peppermint oils, removes buildup.' },
        { name: 'Redken All Soft Shampoo', price: 2100, sku: 'BH-SHM-044', desc: 'Softness shampoo, formulated with argan oil, RCT Protein Complex, intensely moisturizes dry brittle hair.' },
        { name: 'OUAI Detox Clarifying Shampoo', price: 2800, sku: 'BH-SHM-045', desc: 'Apple cider vinegar clarifying shampoo, deeply cleanses product buildup, oil, hard water minerals, keratin-infused.' },
        { name: 'Moroccanoil Hydrating Shampoo', price: 2200, sku: 'BH-SHM-046', desc: 'Moisturizing daily cleanser, argan oil, vitamins A and E, red algae extract, balances hair hydration.' },
        { name: 'SheaMoisture Coconut & Hibiscus', price: 1150, sku: 'BH-SHM-047', desc: 'Curl and shine shampoo, organic shea butter, coconut oil, silk protein, tames thick curly frizz.' },
        { name: 'Living Proof Perfect Hair Day', price: 2900, sku: 'BH-SHM-048', desc: 'Revolutionary daily shampoo, patented healthy hair molecule (OFPMA), keeps hair cleaner longer, builds volume.' },
        { name: 'Biolage Color Last Shampoo', price: 1850, sku: 'BH-SHM-049', desc: 'Color preserving shampoo, low pH formula, orchid extract, gently cleanses to prevent color fading.' },
        { name: 'Aveeno Apple Cider Vinegar Shampoo', price: 990, sku: 'BH-SHM-050', desc: 'Scalp soothing shampoo, oat base, apple cider vinegar clarifies and adds high gloss shine to dull hair.' }
      ],
      img: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?q=80&w=600'
    },
    // 6. Diffusers (10)
    {
      items: [
        { name: 'Vitruvi Stone Essential Oil Diffuser', price: 11900, sku: 'BH-DIF-051', desc: 'Premium ceramic stone cover ultrasonic diffuser, 100ml water capacity, runs up to 8 hours, dual timer settings.' },
        { name: 'MUJI Ultrasonic Humidifier Diffuser', price: 5900, sku: 'BH-DIF-052', desc: 'Minimalist white cylinder diffuser, ultrasonic mist waves, warm white LED light levels, auto-off safety.' },
        { name: 'ASAKUKI 500ml Smart Diffuser', price: 2990, sku: 'BH-DIF-053', desc: 'Large capacity humidifier diffuser, 5-in-1 functions, 7 LED color lights, remote control and smartphone app link.' },
        { name: 'Stadler Form Jasmine Diffuser', price: 4900, sku: 'BH-DIF-054', desc: 'Sleek modern bowl diffuser, interval mode sprays 10 mins on / 20 mins off, up to 24 hours total run.' },
        { name: 'Canopy Waterless Aroma Diffuser', price: 8900, sku: 'BH-DIF-055', desc: 'Waterless clean mist-free diffuser, fan-powered clean evaporation, ceramic aroma puck oil tray.' },
        { name: 'HoMedics Ellia Blossom Diffuser', price: 6900, sku: 'BH-DIF-056', desc: 'Handcrafted ceramic and wood design diffuser, ambient color light ring, relaxation sound tracks built-in.' },
        { name: 'Sierra Modern Stone Diffuser', price: 9500, sku: 'BH-DIF-057', desc: 'Smart WiFi stone diffuser, compatable with Alexa/Google, app control mist schedules and LED ring colors.' },
        { name: 'Serene House Ranger Portable Diffuser', price: 3490, sku: 'BH-DIF-058', desc: 'USB rechargeable portable diffuser, fits car cup holders, runs wireless up to 4 hours, travel bag included.' },
        { name: 'Innogear 150ml Essential Oil Diffuser', price: 1990, sku: 'BH-DIF-059', desc: 'Compact essential oil diffuser, ultrasonic cool mist, 7 changing colors, auto shut-off without water.' },
        { name: 'Urpower 2nd Gen 100ml Diffuser', price: 1690, sku: 'BH-DIF-060', desc: 'Classic compact diffuser, improved mist output, adjustable continuous and intermittent spray modes.' }
      ],
      img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600'
    },
    // 7. Essential Oils (10)
    {
      items: [
        { name: 'Plant Therapy Organic Lavender Oil', price: 1290, sku: 'BH-OIL-061', desc: '100% pure USDA organic lavender essential oil, steam distilled, calms mind and promotes deep sleep.' },
        { name: 'doTERRA Peppermint Essential Oil', price: 2490, sku: 'BH-OIL-062', desc: 'Therapeutic grade peppermint oil, cooling sensation, alleviates tension headaches, refreshes breathing.' },
        { name: 'Young Living Lemon Essential Oil', price: 1890, sku: 'BH-OIL-063', desc: 'Premium cold-pressed lemon peel oil, energetic citrus aroma, purifies air and supports focus.' },
        { name: 'Edens Garden Tea Tree Oil', price: 990, sku: 'BH-OIL-064', desc: '100% pure tea tree oil, steam-distilled melaleuca, natural antiseptic for acne and scalp health.' },
        { name: 'Now Foods Eucalyptus Essential Oil', price: 790, sku: 'BH-OIL-065', desc: 'Strong clarifying eucalyptus oil, ideal for steam inhalation, relaxes muscles and opens airways.' },
        { name: 'Plant Therapy Lemon & Rosemary Blend', price: 1490, sku: 'BH-OIL-066', desc: 'Synergy focus blend, cold-pressed lemon and steam-distilled rosemary, boosts mental clarity.' },
        { name: 'Mountain Rose Herbs Frankincense Oil', price: 3490, sku: 'BH-OIL-067', desc: 'Organic wildcrafted Boswellia carterii oil, woody warm aroma, ideal for meditation and skin repair.' },
        { name: 'Aura Cacia Sweet Orange Oil', price: 890, sku: 'BH-OIL-068', desc: '100% pure cold-pressed orange oil, sweet uplifting aromatherapy mist, brightens home atmosphere.' },
        { name: 'Edens Garden Fighting Five Blend', price: 1590, sku: 'BH-OIL-069', desc: 'Immunity defense blend, clove, lemon, cinnamon, eucalyptus and rosemary essential oils.' },
        { name: 'Cliganic Organic Jojoba Carrier Oil', price: 1290, sku: 'BH-OIL-070', desc: '100% pure cold-pressed unrefined jojoba oil, ideal carrier for diluting essential oils on skin.' }
      ],
      img: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600'
    },
    // 8. Sunscreens (10)
    {
      items: [
        { name: 'Supergoop! Unseen Sunscreen SPF 40', price: 3800, sku: 'BH-SUN-071', desc: '100% invisible weightless sunscreen, oil-free formula, acts as makeup primer, velvet finish.' },
        { name: 'EltaMD UV Clear Broad-Spectrum SPF 46', price: 4200, sku: 'BH-SUN-072', desc: 'Dermatologist recommended zinc oxide sunscreen, niacinamide calms acne-prone sensitive skin.' },
        { name: 'La Roche-Posay Anthelios SPF 50', price: 2490, sku: 'BH-SUN-073', desc: 'Cell-Ox Shield antioxidant technology, melt-in milk sunscreen lotion, water resistant 80 minutes.' },
        { name: 'Biore UV Aqua Rich Watery Essence', price: 1650, sku: 'BH-SUN-074', desc: 'Japanese water-like light sunscreen, SPF 50+, hyaluronic acid, absorbs instantly with no white cast.' },
        { name: 'Shiseido Ultimate Sun Protector SPF 50+', price: 4500, sku: 'BH-SUN-075', desc: 'SynchroShield technology becomes stronger when exposed to heat and water, invisible barrier.' },
        { name: 'Neutrogena Ultra Sheer Dry-Touch', price: 850, sku: 'BH-SUN-076', desc: 'Helioplex broad-spectrum protection, dry-touch matte finish, lightweight fast-absorbing.' },
        { name: 'Supergoop! Play Everyday Lotion SPF 50', price: 2900, sku: 'BH-SUN-077', desc: 'Hydrating water-resistant sunscreen lotion, sunflower extract, ideal for sports and outdoor use.' },
        { name: 'COSRX Aloe Soothing Sun Cream', price: 1290, sku: 'BH-SUN-078', desc: 'Hydrating daily sunscreen, formulated with Aloe Arborescens Leaf Extract, feels like a cream.' },
        { name: 'Aveeno Protect + Hydrate SPF 60', price: 1590, sku: 'BH-SUN-079', desc: 'Nourishing prebiotic oat sunscreen, oil-free, non-comedogenic, hydrates skin all day.' },
        { name: 'Sun Bum Original Sunscreen Lotion SPF 50', price: 1690, sku: 'BH-SUN-080', desc: 'Hypoallergenic vegan sunscreen, enriched with Vitamin E, signature classic banana coconut scent.' }
      ],
      img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600'
    },
    // 9. Soaps (10)
    {
      items: [
        { name: 'Dr. Bronner\'s Pure-Castile Liquid Soap', price: 1890, sku: 'BH-SOP-081', desc: 'Organic 18-in-1 castile soap, lavender oil, organic coconut/olive base, biodegradable.' },
        { name: 'L\'Occitane Cleansing Almond Shower Oil', price: 2490, sku: 'BH-SOP-082', desc: 'Transforming oil-to-milk cleanser, sweet almond oil, respects skin barrier, delicious scent.' },
        { name: 'Nécessaire The Body Wash (Eucalyptus)', price: 2900, sku: 'BH-SOP-083', desc: 'Multi-vitamin body cleanser, niacinamide, vitamins A/C/E, rich lather, clean eucalyptus scent.' },
        { name: 'Aveeno Daily Moisturising Body Wash', price: 950, sku: 'BH-SOP-084', desc: 'Soap-free body cleanser, formulated with nourishing prebiotic oat, relieves dry itchy skin.' },
        { name: 'Dove Deep Moisture Body Wash', price: 490, sku: 'BH-SOP-085', desc: 'MicroMoisture technology body wash, 24-hour hydration, sulfate-free, dermatologically tested.' },
        { name: 'Outlaw Soaps Fire in the Hole Bar Soap', price: 990, sku: 'BH-SOP-086', desc: 'Handcrafted bar soap, unique campfire, gunpowder, sage, whiskey rugged scent, vegan oils.' },
        { name: 'Mrs. Meyer\'s Lavender Body Wash', price: 1150, sku: 'BH-SOP-087', desc: 'Aromatic essential oils body cleanser, aloe vera and flaxseed oil, cruelty-free formula.' },
        { name: 'Aesop Resurrection Hand Wash', price: 3800, sku: 'BH-SOP-088', desc: 'Exquisite hand wash, mandarin rind, rosemary leaf, cedarwood atlas, fine exfoliating texture.' },
        { name: 'Native Body Wash Coconut & Vanilla', price: 1290, sku: 'BH-SOP-089', desc: 'Simple clean body wash, derived from coconut oil, paraben-free, sweet gourmand aroma.' },
        { name: 'Method Body Wash Pure Peace', price: 1390, sku: 'BH-SOP-090', desc: 'Infused with peony, rose water, and pink sea salt, plant-based biodegradable cleansers.' }
      ],
      img: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=600'
    },
    // 10. Vitamins (10)
    {
      items: [
        { name: 'Sports Research Vitamin D3 5000 IU', price: 1490, sku: 'BH-VIT-091', desc: 'High potency Vitamin D3 coconut MCT oil softgels, supports bone density and immune function.' },
        { name: 'Thorne Research Basic Nutrients 2/Day', price: 3490, sku: 'BH-VIT-092', desc: 'Complete daily multivitamin/mineral formula, bioavailable active forms, gluten-free, NSF certified.' },
        { name: 'Garden of Life Raw Probiotics 100 Billion', price: 4500, sku: 'BH-VIT-093', desc: 'Once daily raw probiotics, 34 raw probiotic strains, digestive enzymes, shelf stable capsules.' },
        { name: 'Nordic Naturals Ultimate Omega 1280mg', price: 3800, sku: 'BH-VIT-094', desc: 'High-concentration EPA/DHA fish oil, lemon flavor softgels, supports cardiovascular and brain health.' },
        { name: 'Vital Proteins Collagen Peptides', price: 4900, sku: 'BH-VIT-095', desc: 'Unflavored grass-fed pasture-raised bovine collagen powder, supports hair, skin, nails, and joints.' },
        { name: 'Hum Nutrition Flatter Me Digestive Enzyme', price: 2900, sku: 'BH-VIT-096', desc: '18 full-spectrum digestive enzymes, ginger, fennel, peppermint, reduces bloating and supports digestion.' },
        { name: 'Ritual Essential Multivitamin for Women', price: 3200, sku: 'BH-VIT-097', desc: 'Clinically backed delayed-release multivitamin, key nutrients including folate and D3, mint tab.' },
        { name: 'MaryRuth\'s Liquid Morning Multivitamin', price: 3900, sku: 'BH-VIT-098', desc: 'Raspberry flavored liquid vitamin, vegan organic ingredients, easy absorption for all ages.' },
        { name: 'MegaFood MegaFlora Probiotic 20 Billion', price: 2800, sku: 'BH-VIT-099', desc: '14 life-enhancing probiotic strains, supports intestinal health and bowel regularity, acid-resistant.' },
        { name: 'Pure Encapsulations Magnesium Glycinate', price: 2600, sku: 'BH-VIT-100', desc: 'Highly absorbable magnesium chelate, supports muscle relaxation, cardiometabolic health and sleep.' }
      ],
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600'
    }
  ],
  'sports-outdoors': [
    // 1. Bands (10)
    {
      items: [
        { name: 'Rogue Monster Bands Set', price: 6900, sku: 'SO-BND-001', desc: 'Heavy-duty natural latex pull-up bands, progressive resistance levels color-coded, ultimate durability.' },
        { name: 'Fit Simplify Resistance Loop Bands', price: 1290, sku: 'SO-BND-002', desc: 'Set of 5 elastic loop bands, heavy-grade latex, included instruction guide and carry pouch.' },
        { name: 'Theraband Latex-Free Bands Set', price: 2490, sku: 'SO-BND-003', desc: 'Professional rehabilitation resistance bands, latex-free elastic, color progressive levels.' },
        { name: 'Black Mountain Products Bands Set', price: 3490, sku: 'SO-BND-004', desc: 'Resistance tube set with foam handles, ankle straps, door anchor, up to 75 lbs resistance stack.' },
        { name: 'WODFitters Pull Up Assisted Bands', price: 4500, sku: 'SO-BND-005', desc: 'Thick loop mobility bands, ideal for powerlifting, crossfit pull up support, heavy duty stretch.' },
        { name: 'Serious Steel Assisted Band', price: 2900, sku: 'SO-BND-006', desc: 'Heavy duty continuous loop resistance bands, ideal for powerlifting and stretching exercises.' },
        { name: 'Undersun Fitness Resistance Bands', price: 8900, sku: 'SO-BND-007', desc: '5 loop resistance bands, outdoor-grade design, customized app exercise tracking program access.' },
        { name: 'Eacktek Loop Resistance Bands Set', price: 1500, sku: 'SO-BND-008', desc: 'Fabric non-slip elastic resistance bands for hip and glute training, double seam stitching.' },
        { name: 'Peach Bands Hip Resistance Band', price: 1990, sku: 'SO-BND-009', desc: 'Fabric elastic loop band, non-slip rubber grip inner, medium-heavy resistance, storage box.' },
        { name: 'TRX All-in-One Suspension Trainer', price: 18900, sku: 'SO-BND-010', desc: 'Bodyweight resistance suspension straps, patented locking loop, door anchor, workout guide.' }
      ],
      img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=600'
    },
    // 2. Weights (10)
    {
      items: [
        { name: 'Bowflex SelectTech 552 Dumbbells', price: 34900, sku: 'SO-WGT-011', desc: 'Adjustable dumbbell pair, dials adjustment from 5 to 52.5 lbs, compact space-saving home gym.' },
        { name: 'Rogue Rubber Hex Dumbbells Pair 15kg', price: 7900, sku: 'SO-WGT-012', desc: 'Heavy duty rubber encased hex head dumbbells, chrome plated ergonomic knurled handle grip.' },
        { name: 'PowerBlock Elite EXP Adjustable Weights', price: 39900, sku: 'SO-WGT-013', desc: 'Square block adjustable dumbbells, steel selector pin system, expands up to 90 lbs per hand.' },
        { name: 'Cap Barbell Cast Iron Dumbbell 20kg', price: 4500, sku: 'SO-WGT-014', desc: 'Solid cast iron hex dumbbell, semi-gloss enamel paint finish, prevents rust chipping.' },
        { name: 'Amazon Basics Neoprene Dumbbell Set', price: 2999, sku: 'SO-WGT-015', desc: 'Set of 3 pairs (2, 3, 5 lbs) neoprene coated weights, included matching stand organizer.' },
        { name: 'Yes4All Adjustable Dumbbells 40kg', price: 6990, sku: 'SO-WGT-016', desc: 'Chrome threaded spinlock dumbbells set, cast iron weight plates, connector rod convert to barbell.' },
        { name: 'Cap Barbell Cast Iron Kettlebell 16kg', price: 3990, sku: 'SO-WGT-017', desc: 'Traditional cast iron kettlebell, wide powder coated handle, ideal for cross training swings.' },
        { name: 'Core Home Fitness Adjustable Dumbbells', price: 29900, sku: 'SO-WGT-018', desc: 'Quick twist handle adjustable dumbbells, 5 to 50 lbs range, cradled holder stands included.' },
        { name: 'Rogue Classic Powder Coat Kettlebell', price: 5400, sku: 'SO-WGT-019', desc: 'First grade casting kettlebell, textured powder coat finish holds chalk well, flat machined base.' },
        { name: 'Cap Barbell 7-Foot Olympic Barbell', price: 8900, sku: 'SO-WGT-020', desc: 'Solid steel barbell bar, medium knurling, 2-inch sleeve collar bearings, 1000 lbs capacity limit.' }
      ],
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'
    },
    // 3. Ropes (10)
    {
      items: [
        { name: 'Crossrope Get Lean Speed Rope Set', price: 9900, sku: 'SO-ROP-021', desc: 'Weighted jump rope system, 1/4 lb and 1/2 lb interchangeable cables, fast clip handle design.' },
        { name: 'Rogue SR-1 Bearing Speed Rope', price: 3490, sku: 'SO-ROP-022', desc: 'Aircraft-grade bearing speed jump rope, adjustable polyurethane cable, knurled handle grip.' },
        { name: 'WOD Nation Speed Jump Rope', price: 1890, sku: 'SO-ROP-023', desc: 'Double under speed rope, steel cable coated in nylon, 4-bearing articulation system.' },
        { name: 'Survival and Cross Jump Rope', price: 1290, sku: 'SO-ROP-024', desc: 'Adjustable steel wire jump rope, smooth rotation, ideal for boxing cardio double unders.' },
        { name: 'Buddy Lee Aero Speed Jump Rope', price: 4500, sku: 'SO-ROP-025', desc: 'Patented swivel bearing system, plastic aerodynamic handles, professional speed skip training.' },
        { name: 'Degol Skipping Rope with Counters', price: 990, sku: 'SO-ROP-026', desc: 'Cardio jump rope, memory foam handles, integrated automatic mechanical jump counter tab.' },
        { name: 'Elite SRS Bullet Fit Jump Rope', price: 2900, sku: 'SO-ROP-027', desc: 'Aluminum handle double under speed rope, dual ball bearings, click adjust cable locks.' },
        { name: 'Epitomie Fitness Sonic Boom Rope', price: 3200, sku: 'SO-ROP-028', desc: 'Ball bearing speed rope, silicon coated steel cable, spare cable and carry bag included.' },
        { name: 'Proud Panda Weighted Jump Rope', price: 1990, sku: 'SO-ROP-029', desc: 'Heavy weighted skip rope, thick PVC solid cord, non-slip handles for power training.' },
        { name: 'Everlast Weighted Speed Rope', price: 1590, sku: 'SO-ROP-030', desc: 'Adjustable plastic speed rope, removable weights in handles, smooth rotating collar.' }
      ],
      img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=600'
    },
    // 4. Tents (10)
    {
      items: [
        { name: 'REI Co-op Half Dome SL 2+ Tent', price: 28900, sku: 'SO-TNT-031', desc: '2-person backpacking tent, lightweight hubbed aluminum poles, dual vestibules, mesh ventilation panels.' },
        { name: 'Big Agnes Copper Spur HV UL2', price: 49900, sku: 'SO-TNT-032', desc: 'High-volume ultralight tent, double ripstop nylon fabric, proprietary awning-style vestibule doors.' },
        { name: 'MSR Hubba Hubba NX 2-Person', price: 44900, sku: 'SO-TNT-033', desc: 'Backpacking tent, durashield waterproof coating, easton syclone shatterproof poles, compact compression bag.' },
        { name: 'Coleman Sundome 4-Person Tent', price: 8900, sku: 'SO-TNT-034', desc: 'Classic dome camping tent, weathertec system welded floors, large window mesh, fiberglass poles.' },
        { name: 'ALPS Mountaineering Lynx 1-Person', price: 11900, sku: 'SO-TNT-035', desc: 'Solo backpacking tent, factory sealed fly and floor seams, aluminum poles, extra vestibule storage.' },
        { name: 'Nemo Hornet OSMO 2P Ultralight', price: 38900, sku: 'SO-TNT-036', desc: 'Ultralight backpacking tent, proprietary OSMO poly-nylon ripstop fabric, single pole setup.' },
        { name: 'Marmot Limelight 2-Person Tent', price: 24500, sku: 'SO-TNT-037', desc: 'Zone construction pre-bent poles maximize headroom, extra wide double doors, footprint sheet included.' },
        { name: 'Coleman Instant Cabin 6-Person', price: 18900, sku: 'SO-TNT-038', desc: 'Instant setup camping tent, pre-attached steel poles fold out in 1 minute, weathertec double thickness floor.' },
        { name: 'Kelty Late Start 2P Backpacking', price: 14900, sku: 'SO-TNT-039', desc: 'Quick corner pole sleeves, durable pre-bent aluminum poles, single door, spacious vestibule fly.' },
        { name: 'Black Diamond Mega Light Shelter', price: 22900, sku: 'SO-TNT-040', desc: 'Four-person floorless pyramid tarp shelter, single adjustable carbon center pole, windproof nylon.' }
      ],
      img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600'
    },
    // 5. Water Bottles (10)
    {
      items: [
        { name: 'Hydro Flask 32 oz Wide Mouth', price: 3990, sku: 'SO-BTL-041', desc: 'TempShield double-wall vacuum insulation, 18/8 pro-grade stainless steel, flex cap handle loop, powder finish.' },
        { name: 'Yeti Rambler 26 oz Straw Bottle', price: 4500, sku: 'SO-BTL-042', desc: 'Duracoat colored insulated bottle, leak-resistant triplehaul straw cap, dishwasher safe, heavy duty.' },
        { name: 'Klean Kanteen Classic 27 oz', price: 2490, sku: 'SO-BTL-043', desc: 'Single-wall non-insulated stainless steel bottle, chip-resistant Klean Coat finish, leakproof loop cap.' },
        { name: 'CamelBak Chute Mag 32 oz', price: 1890, sku: 'SO-BTL-044', desc: 'Vacuum insulated stainless steel bottle, magnetic handle keeps cap stowed, high flow drinking spout.' },
        { name: 'Stanley Classic Vacuum Bottle 1.0L', price: 3890, sku: 'SO-BTL-045', desc: 'Iconic hammertone green thermal bottle, keeps hot/cold for 24 hours, insulated lid doubles as drinking cup.' },
        { name: 'Thermos Stainless King 40 oz', price: 2990, sku: 'SO-BTL-046', desc: 'Double wall vacuum insulated flask, folding metal carry handle, twist-and-pour stopper cap.' },
        { name: 'Takeya Actives 32 oz Insulated', price: 2790, sku: 'SO-BTL-047', desc: 'Powder coated insulated bottle, protective silicone bumper base sleeve, leakproof spout cap.' },
        { name: 'Hydro Flask 24 oz Standard Mouth', price: 3490, sku: 'SO-BTL-048', desc: 'Slim design insulated bottle, fits car cup holders, temp-shield vacuum insulation, honeycomb cap.' },
        { name: 'Nalgene Wide Mouth 32 oz Tritan', price: 1290, sku: 'SO-BTL-049', desc: 'BPA-free daily water bottle, leakproof threaded loop cap, measurement indicators, impact-resistant.' },
        { name: 'Contigo Ashland 2.0 Autospout', price: 1590, sku: 'SO-BTL-050', desc: 'One-touch pop up straw bottle, button lock prevents accidental opening, integrated carrying clip loop.' }
      ],
      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600'
    },
    // 6. Yoga Mats (10)
    {
      items: [
        { name: 'Manduka PRO Yoga Mat 6mm', price: 9900, sku: 'SO-MAT-051', desc: 'Professional dense cushioning yoga mat, closed-cell hygienic surface, slip-resistant grip texture.' },
        { name: 'Lululemon Reversible Mat 5mm', price: 7900, sku: 'SO-MAT-052', desc: 'Polyurethane top layer absorbs moisture, natural rubber textured base, antimicrobial additive.' },
        { name: 'JadeYoga Harmony Mat 4.8mm', price: 6900, sku: 'SO-MAT-053', desc: 'Natural open-cell rubber yoga mat, exceptional non-slip traction grip, eco-friendly sustainable.' },
        { name: 'Gaiam Premium 2-Color Yoga Mat', price: 2990, sku: 'SO-MAT-054', desc: 'Lightweight sticky non-slip textured mat, latex-free PVC, 6mm thickness cushioning support.' },
        { name: 'Hugger Mugger Para Rubber Mat', price: 8900, sku: 'SO-MAT-055', desc: 'Natural rubber mat, dual-sided texturing (dense grip / soft cushion), durable tear-resistant weave.' },
        { name: 'Liforme Original Yoga Mat', price: 13900, sku: 'SO-MAT-056', desc: 'AlignForMe unique alignment line prints, proprietary eco-polyurethane grip material, extra wide.' },
        { name: 'Alo Yoga Warrior Mat', price: 11500, sku: 'SO-MAT-057', desc: 'Luxurious matte dry-grip top surface, natural rubber base, moisture-wicking, odor-resistant.' },
        { name: 'Manduka eKO Lite Mat 4mm', price: 6500, sku: 'SO-MAT-058', desc: 'Biodegradable natural tree rubber mat, catch-grip ripple surface texture, zero chemical plasticizers.' },
        { name: 'Gaiam Athletic 2-Color Yoga Mat', price: 3499, sku: 'SO-MAT-059', desc: 'Durable exercise mat, textured sticky surface, 8mm thick for joint cushion comfort, sling strap.' },
        { name: 'Retrospec Solana 1-inch Mat', price: 1990, sku: 'SO-MAT-060', desc: 'Extra thick ribbed foam exercise mat, non-slip ribbed design, includes carry strap.' }
      ],
      img: 'https://images.unsplash.com/photo-1601925228008-0f4b1ebc9c39?q=80&w=600'
    },
    // 7. Sleeping Bags (10)
    {
      items: [
        { name: 'REI Co-op Trailmade 20 Sleeping Bag', price: 11900, sku: 'SO-BAG-061', desc: 'Mummy sleeping bag, synthetic polyester fill, relaxed fit, zip draft tube, certified to 20°F.' },
        { name: 'Marmot Trestles Elite Eco 15', price: 14500, sku: 'SO-BAG-062', desc: 'HL-ElixR Eco 100% recycled synthetic insulation, anatomical footbox, double side sliders.' },
        { name: 'Kelty Cosmic Down 20 Bag', price: 16900, sku: 'SO-BAG-063', desc: '800-fill power hydrophobic drydown, trapezoidal baffle construction, buttery nylon taffeta lining.' },
        { name: 'Big Agnes Anvil Horn 15 Sleeping Bag', price: 23900, sku: 'SO-BAG-064', desc: '650-fill DownTek water repellent down, integrated sleeping pad sleeve, spacious rectangular fit.' },
        { name: 'Nemo Disco 15 Down Spoon Bag', price: 29500, sku: 'SO-BAG-065', desc: 'Classic Spoon shape adds room for side sleepers, 650-fill RDS down, Thermo Gills vents.' },
        { name: 'Therm-a-Rest Questar 20 Down Bag', price: 26500, sku: 'SO-BAG-066', desc: '650-fill Nikwax Hydrophobic Down, SynergyLink connectors integrate bag with sleeping pad.' },
        { name: 'Coleman North Rim Mummy Bag', price: 5900, sku: 'SO-BAG-067', desc: 'Heavyweight winter sleeping bag, polyester fill, quilted construction, draft collar, rated to 0°F.' },
        { name: 'Sea to Summit Spark Down Bag', price: 34900, sku: 'SO-BAG-068', desc: 'Ultra-lightweight packing sleeping bag, 850+ fill loft down, ultralight 10D nylon shell fabric.' },
        { name: 'Mountain Hardwear Bishop Pass 15', price: 21500, sku: 'SO-BAG-069', desc: '650-fill down insulation, lightweight ripstop shell, glow-in-the-dark zipper pull tab, pocket.' },
        { name: 'Nemo Forte 35 Synthetic Spoon Bag', price: 17900, sku: 'SO-BAG-070', desc: 'Primaloft RISE synthetic insulation, Spoon shape side sleeper profile, blanket fold neck draft collar.' }
      ],
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'
    },
    // 8. Stoves (10)
    {
      items: [
        { name: 'Jetboil Flash Cooking System', price: 11900, sku: 'SO-STV-071', desc: 'All-in-one personal cooking system, integrated 1-liter cup with heat indicator, boils in 100 seconds.' },
        { name: 'MSR PocketRocket 2 Stove', price: 4900, sku: 'SO-STV-072', desc: 'Ultralight canister stove, folding pot support arms, windclip burner protection, fits pocket storage case.' },
        { name: 'Camp Chef Everest 2-Burner Stove', price: 14500, sku: 'SO-STV-073', desc: 'Heavy duty double burner camp stove, 20000 BTU matchless ignition burners, wind block shields.' },
        { name: 'Coleman Triton 2-Burner Stove', price: 8900, sku: 'SO-STV-074', desc: 'Classic propane camp stove, adjustable burner dial control, windblock panels, chrome wire grate.' },
        { name: 'Solo Stove Lite Wood Burner', price: 6900, sku: 'SO-STV-075', desc: 'Eco-friendly double wall biomass gasifier stove, wood twigs burning, stainless steel construction.' },
        { name: 'MSR WindBurner Duo Stove System', price: 19800, sku: 'SO-STV-076', desc: 'Windproof pressure regulated burner stove, integrated 1.8L pot, secure locking connection.' },
        { name: 'BioLite CampStove 2+ Power Generator', price: 14900, sku: 'SO-STV-077', desc: 'Wood burning camp stove converts heat into electricity, internal fan, USB port charges phones.' },
        { name: 'Snow Peak GigaPower 2.0 Stove', price: 4900, sku: 'SO-STV-078', desc: 'Compact steel canister stove, auto igniter, four folding pot supports, precision flame adjust.' },
        { name: 'Soto Amicus Canister Stove', price: 4500, sku: 'SO-STV-079', desc: 'Concave burner head increases wind resistance, spring loaded pot supports, lightweight.' },
        { name: 'Stanley Base Camp Cook Set', price: 8500, sku: 'SO-STV-080', desc: '21-piece prep and cook nesting set, 3.7L stainless steel pot, 3-ply frying pan, plates, bowls.' }
      ],
      img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600'
    },
    // 9. Hiking Backpacks (10)
    {
      items: [
        { name: 'Osprey Atmos AG 65 Backpack', price: 23900, sku: 'SO-HIK-081', desc: 'Anti-Gravity suspension trampoline mesh back panel, fit-on-the-fly harness, raincover included.' },
        { name: 'Gregory Baltoro 75 Heavy Pack', price: 28900, sku: 'SO-HIK-082', desc: 'Heavy load response A3 suspension system, custom raincover, removable daypack compartment.' },
        { name: 'REI Co-op Trail 40 Hiking Pack', price: 9900, sku: 'SO-HIK-083', desc: 'Daypack, U-shaped front panel zipper access, internal hydration sleeve, breathable mesh strap.' },
        { name: 'Osprey Talon 22 Daypack', price: 11900, sku: 'SO-HIK-084', desc: 'Biostretch wrap-around hipbelt harness, lidlock helmet attachment slot, stow-on-the-go trekking pole loop.' },
        { name: 'Patagonia Nine Trails 28L Pack', price: 8900, sku: 'SO-HIK-085', desc: 'Lightweight ripstop daypack, mono-mesh back panel increases airflow, side stretch water slots.' },
        { name: 'Deuter Aircontact Lite Backpack', price: 18500, sku: 'SO-HIK-086', desc: 'Ergonomic back padding frame, variquick easy torso length adjust, expandable collar top lid.' },
        { name: 'Kelty Redwing 50 Backpack', price: 9800, sku: 'SO-HIK-087', desc: 'Versatile travel-hiking daypack, amp-flow ventilated back panel, hybrid zipped access.' },
        { name: 'Arc\'teryx Bora 65 Gear Pack', price: 34500, sku: 'SO-HIK-088', desc: 'Tough weather-resistant grid pack, tegular roto-glide hipbelt swivels vertically and rotates.' },
        { name: 'Mystery Ranch Coulee 25 Pack', price: 14500, sku: 'SO-HIK-089', desc: 'Classic 3-zip design panel bag, adjustable yoke collar frame, external stretch pocket storage.' },
        { name: 'Black Diamond Speed 30 Alpine Pack', price: 12500, sku: 'SO-HIK-090', desc: 'Climbing daypack, strippable design removable lid, hipbelt and frame sheet, micro ice-tool pick sleeves.' }
      ],
      img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600'
    },
    // 10. GPS Watches (10)
    {
      items: [
        { name: 'Garmin Instinct 2 Solar Outdoor Watch', price: 39900, sku: 'SO-GPS-091', desc: 'Rugged GPS watch, solar charging power glass, built-in 3-axis compass, trackback routing.' },
        { name: 'Coros Vertix 2 GPS Adventure Watch', price: 58900, sku: 'SO-GPS-092', desc: 'Dual-frequency GPS watch, offline global landscape maps, titanium bezel, up to 140 hours standard GPS.' },
        { name: 'Suunto 9 Peak Pro GPS Watch', price: 44900, sku: 'SO-GPS-093', desc: 'Ultra-thin sports watch, fast processor, 95 sports modes, military grade durable bezel casing.' },
        { name: 'Garmin Forerunner 965 Premium', price: 62900, sku: 'SO-GPS-094', desc: 'Titanium bezel running GPS watch, bright 1.4-inch AMOLED display, preloaded full-color mapping.' },
        { name: 'Casio Pro Trek PRG-270 Altimeter', price: 11900, sku: 'SO-GPS-095', desc: 'Solar powered digital sport watch, triple sensor altimeter, barometer, thermometer, compass.' },
        { name: 'Polar Grit X Pro Military Watch', price: 39900, sku: 'SO-GPS-096', desc: 'Outdoor multisport watch, scratch-resistant sapphire glass, route guidance turn-by-turn navigation.' },
        { name: 'Suunto Vertical Titanium Solar Watch', price: 68900, sku: 'SO-GPS-097', desc: 'Solar adventure watch, free offline maps, dual-band GPS, 85 hours battery in max accuracy tracking.' },
        { name: 'Garmin eTrex 22x Handheld GPS', price: 18900, sku: 'SO-GPS-098', desc: 'Outdoor navigation handheld, 2.2-inch color display, preloaded TopoActive maps, 8GB memory.' },
        { name: 'Spot Gen4 Satellite Messenger', price: 14500, sku: 'SO-GPS-099', desc: 'Satellite tracker, check-in custom messages, S.O.S. search and rescue direct link.' },
        { name: 'Garmin inReach Mini 2 Satellite communicator', price: 34900, sku: 'SO-GPS-100', desc: 'Compact satellite communicator, interactive SOS, two-way text messaging, trackback routing map.' }
      ],
      img: 'https://images.unsplash.com/photo-1510832198440-a52376950479?q=80&w=600'
    },
    // 11. Cricket Equipment (10)
    {
      items: [
        { name: 'Kookaburra Kahuna Cricket Bat', price: 9500, sku: 'SO-CRK-001', desc: 'Premium English Willow cricket bat, large edge profile, sweet spot positioned for dynamic drive play.' },
        { name: 'SG Club Leather Cricket Ball', price: 650, sku: 'SO-CRK-002', desc: 'Alum tanned leather cricket ball, hand stitched, core made from high quality cork wound with worsted yarn.' },
        { name: 'SS Sunridges Cricket Helmet', price: 2999, sku: 'SO-CRK-003', desc: 'High impact resistant outer shell, inner mesh padding, adjustable steel visor grill, back adjustment.' },
        { name: 'Gray-Nicolls Powerbow Batting Gloves', price: 1899, sku: 'SO-CRK-004', desc: 'Multi-section design, high density foam fingers protection, premium leather palm grip, sweatband.' },
        { name: 'SG Test Batting Legguards', price: 3499, sku: 'SO-CRK-005', desc: 'Test match quality batting pads, high density sponge bolster, dynamic ankle strap, pre-molded protection.' },
        { name: 'Adidas Adipower Vector Cricket Shoes', price: 8999, sku: 'SO-CRK-006', desc: 'Cricket shoes with metal spikes, TPU outsole plate, cushioning midsole, synthetic leather upper.' },
        { name: 'Kookaburra Pro Wheelie Cricket Bag', price: 4500, sku: 'SO-CRK-007', desc: 'Heavy-duty nylon bag, large main compartment, separate bat sleeve pockets, premium wheels.' },
        { name: 'SG Club Wicket Keeping Gloves', price: 2200, sku: 'SO-CRK-008', desc: 'Premium leather keepers gloves, rubber web grip reinforcement, cotton lined cuff padding.' },
        { name: 'Shrey Master Class Air Cricket Helmet', price: 7999, sku: 'SO-CRK-009', desc: 'Titanium visor grill, lightweight carbon fiber composite shell, advanced air ventilation.' },
        { name: 'GM Chrome English Willow Bat', price: 14500, sku: 'SO-CRK-010', desc: 'Grade 1 English Willow cricket bat, natural finish, supreme control and balance, concaved back profile.' }
      ],
      img: 'https://images.unsplash.com/photo-1535137836757-ef95d4957e8f?q=80&w=600'
    },
    // 12. Volleyball Gear (10)
    {
      items: [
        { name: 'Mikasa V200W Official Volleyball', price: 5400, sku: 'SO-VLB-001', desc: 'FIVB official game ball, 18 panel aerodynamic design, double-dimple microfiber surface, sweat resistance.' },
        { name: 'Molten V5M5000 Volleyball', price: 4200, sku: 'SO-VLB-002', desc: 'Premium synthetic leather volleyball, Flistatec flight stability technology, nylon wound core.' },
        { name: 'Tachikara SV5W Gold Volleyball', price: 2900, sku: 'SO-VLB-003', desc: 'High quality leather volleyball, Sensi-Tec micro-fiber composite cover, loose bladder construction.' },
        { name: 'Mizuno Wave Lightning Z7 Shoes', price: 9900, sku: 'SO-VLB-004', desc: 'High performance court volleyball shoes, Wave plate cushion tech, lightweight upper mesh.' },
        { name: 'Asics Gel-Rocket 10 Court Shoes', price: 5999, sku: 'SO-VLB-005', desc: 'Indoor court shoes, Gel cushioning system, Trusstic system technology, gum rubber outsole.' },
        { name: 'McDavid Hexpad Knee Pads', price: 1899, sku: 'SO-VLB-006', desc: 'Hex technology knee pads, lightweight compression sleeve, moisture management fabric.' },
        { name: 'Park & Sun Sports Volleyball Net System', price: 14900, sku: 'SO-VLB-007', desc: 'Outdoor portable volleyball net, telescoping aluminum poles, guyline system, boundary line.' },
        { name: 'Wilson Soft Play Volleyball', price: 1290, sku: 'SO-VLB-008', desc: 'Soft touch synthetic leather volleyball, sponge-backed cover, 18-panel machine sewn.' },
        { name: 'Nike Streak Volleyball Knee Pads', price: 1490, sku: 'SO-VLB-009', desc: 'Dri-FIT fabric knee protection, shock absorbing foam padding, ergonomic contoured fit.' },
        { name: 'Mikasa V300W Competition Ball', price: 3800, sku: 'SO-VLB-010', desc: 'High quality competition indoor volleyball, composite leather, dimple surface panel styling.' }
      ],
      img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600'
    },
    // 13. Basketball Gear (10)
    {
      items: [
        { name: 'Spalding TF-1000 Legacy Basketball', price: 4900, sku: 'SO-BSK-001', desc: 'ZK composite leather cover, moisture management, deep channel design, indoor play official size.' },
        { name: 'Wilson Evolution Game Basketball', price: 5400, sku: 'SO-BSK-002', desc: 'Microfiber composite cover, cushion core carcass, laid-in composite channels, standard high school ball.' },
        { name: 'Nike Giannis Immortality 3 Shoes', price: 7995, sku: 'SO-BSK-003', desc: 'Lightweight breathable mesh basketball shoes, grooved outsole, containment straps.' },
        { name: 'Under Armour Curry Flow 10 Shoes', price: 14900, sku: 'SO-BSK-004', desc: 'UA Flow cushioning technology shoes, lightweight mesh upper, supportive heel counter.' },
        { name: 'Lifetime Adjustable Portable Basketball Hoop', price: 24900, sku: 'SO-BSK-005', desc: '44-inch impact backboard hoop, telescoping height adjustment, heavy-duty roller base.' },
        { name: 'Molten BG4500 FIBA Basketball', price: 4500, sku: 'SO-BSK-006', desc: 'FIBA approved 12-panel design basketball, premium composite leather, natural pebble texture.' },
        { name: 'Baden Elite Indoor Basketball', price: 3900, sku: 'SO-BSK-007', desc: 'Proprietary microfiber cover, stealth valve, cushion core, perfect balance symmetry.' },
        { name: 'Nike Pro Combat Elbow Sleeve', price: 1290, sku: 'SO-BSK-008', desc: 'Compression elbow sleeve, abrasion-resistant design, breathable mesh ventilation panels.' },
        { name: 'Spalding NBA Slam Jam Rim Board', price: 3200, sku: 'SO-BSK-009', desc: 'Mini indoor backboard set, steel breakaway spring action rim, realistic replicas scale.' },
        { name: 'Wilson NBA Forge Outdoor Basketball', price: 1890, sku: 'SO-BSK-010', desc: 'High durability outdoor rubber ball, inflation retention lining, pebble channel grooves.' }
      ],
      img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600'
    }
  ],
  'books-stationery': [
    // 1. Fiction (10)
    {
      items: [
        { name: 'The Midnight Library by Matt Haig', price: 499, sku: 'BS-FIC-001', desc: 'Bestselling novel following a woman who finds a library between life and death containing infinite books of paths.' },
        { name: 'Lessons in Chemistry by Bonnie Garmus', price: 599, sku: 'BS-FIC-002', desc: 'Witty historical fiction about an unconventional female chemist in the 1960s who becomes a TV cooking star.' },
        { name: 'Tomorrow, and Tomorrow, and Tomorrow', price: 549, sku: 'BS-FIC-003', desc: 'A beautiful narrative about two friends who become game design partners, exploring love, art, and failure.' },
        { name: 'Yellowface by R.F. Kuang', price: 449, sku: 'BS-FIC-004', desc: 'A sharp, satirical thriller exploring literary theft, cultural appropriation, and the dark side of social media.' },
        { name: 'Demon Copperhead by Barbara Kingsolver', price: 699, sku: 'BS-FIC-005', desc: 'Pulitzer Prize-winning modern adaptation of David Copperfield set in the Appalachian mountains.' },
        { name: 'Iron Flame by Rebecca Yarros', price: 799, sku: 'BS-FIC-006', desc: 'The epic fantasy sequel to Fourth Wing, following Violet Sorrengail at Basgiath War College.' },
        { name: 'Happy Place by Emily Henry', price: 399, sku: 'BS-FIC-007', desc: 'A charming contemporary romance about a broken-up couple pretending to be together during their annual vacation.' },
        { name: 'Fourth Wing by Rebecca Yarros', price: 699, sku: 'BS-FIC-008', desc: 'Bestselling romantic fantasy novel, dragon riders war college, high stakes battles.' },
        { name: 'A Court of Thorns and Roses Box Set', price: 2499, sku: 'BS-FIC-009', desc: 'Sarah J. Maas classic fantasy series box set (5 books), high fae romance adventure.' },
        { name: 'The Covenant of Water by Abraham Verghese', price: 899, sku: 'BS-FIC-010', desc: 'Epic three-generation family saga set in Kerala, India, exploring medical mystery and love.' }
      ],
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600'
    },
    // 2. Self Improvement (10)
    {
      items: [
        { name: 'Atomic Habits by James Clear', price: 449, sku: 'BS-HLP-011', desc: 'The definitive guide to building tiny daily habits, breaking bad ones, and gaining 1% improvement daily.' },
        { name: 'The Mountain Is You by Brianna Wiest', price: 399, sku: 'BS-HLP-012', desc: 'Insightful guide to understanding self-sabotage, extracting lessons, and embracing transformation.' },
        { name: 'Show Your Work! by Austin Kleon', price: 299, sku: 'BS-HLP-013', desc: '10 ways to share your creativity and get discovered, inspiring guide for modern creators.' },
        { name: 'Deep Work by Cal Newport', price: 450, sku: 'BS-HLP-014', desc: 'Rules for focused success in a distracted world, cognitive training tips to achieve peak flow.' },
        { name: 'Outlive: The Science of Longevity', price: 799, sku: 'BS-HLP-015', desc: 'Dr. Peter Attia\'s medical guide to expanding lifespan and healthspan, nutrition and exercise tips.' },
        { name: 'The Creative Act by Rick Rubin', price: 899, sku: 'BS-HLP-016', desc: 'A legendary producer\'s guide to creativity, art, and being in the world, beautifully designed book.' },
        { name: 'Four Thousand Weeks by Oliver Burkeman', price: 499, sku: 'BS-HLP-017', desc: 'Time management for mortals, embracing limitations to build a meaningful finite life.' },
        { name: 'Clear Thinking by Shane Parrish', price: 699, sku: 'BS-HLP-018', desc: 'Farnam Street founder\'s guide to decision making, overcoming cognitive bias under pressure.' },
        { name: 'Start with Why by Simon Sinek', price: 499, sku: 'BS-HLP-019', desc: 'How great leaders inspire action, the golden circle framework of finding purpose.' },
        { name: 'Thinking, Fast and Slow by Daniel Kahneman', price: 599, sku: 'BS-HLP-020', desc: 'Nobel laureate\'s review of cognitive systems, slow rational thinking vs fast emotional triggers.' }
      ],
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600'
    },
    // 3. History (10)
    {
      items: [
        { name: 'Sapiens: A Brief History of Humankind', price: 599, sku: 'BS-HIS-021', desc: 'Yuval Noah Harari\'s sweeping narrative of human evolution from foragers to rulers of Earth.' },
        { name: 'Homo Deus: A Brief History of Tomorrow', price: 599, sku: 'BS-HIS-022', desc: 'Explores the future of humanity, bioengineering, AI, and search for god-like capabilities.' },
        { name: 'A Brief History of Time by Stephen Hawking', price: 399, sku: 'BS-HIS-023', desc: 'Famous physicist\'s guide to cosmology, black holes, big bang, space-time relativity.' },
        { name: 'Breath: The New Science of a Lost Art', price: 449, sku: 'BS-HIS-024', desc: 'James Nestor\'s journalistic review of breathing techniques to improve physical health.' },
        { name: 'The Emperor of All Maladies by Siddhartha', price: 699, sku: 'BS-HIS-025', desc: 'A biography of cancer, Pulitzer prize winning historical overview of medicine.' },
        { name: 'Guns, Germs, and Steel by Jared Diamond', price: 599, sku: 'BS-HIS-026', desc: 'Fates of human societies, environmental factors that shaped history and technology development.' },
        { name: 'Cosmos by Carl Sagan', price: 499, sku: 'BS-HIS-027', desc: 'Classic science literature, exploring space science, human evolution and future technology.' },
        { name: 'Silent Spring by Rachel Carson', price: 399, sku: 'BS-HIS-028', desc: 'Foundational environmental book exposing dangers of pesticides, launched modern ecology.' },
        { name: 'The Silent Patient by Alex Michaelides', price: 349, sku: 'BS-HIS-029', desc: 'Bestselling psychological thriller, investigation of a woman who shoots husband and goes mute.' },
        { name: 'An Immense World by Ed Yong', price: 699, sku: 'BS-HIS-030', desc: 'Pulitzer prize winner, how animal senses reveal the hidden realms around us.' }
      ],
      img: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600'
    },
    // 4. Journals (10)
    {
      items: [
        { name: 'Vintage Leather Journal with Clasp', price: 1299, sku: 'BS-JRN-031', desc: 'Handcrafted full-grain leather bound notebook, antique deckle edge paper, metal bronze lock clasp.' },
        { name: 'Handcrafted Leather Sketchbook', price: 1499, sku: 'BS-JRN-032', desc: 'Thick brown leather sketchbook, heavy cotton rag sheets, flat opening hand sewn spine.' },
        { name: 'Buffalo Leather Writing Notebook', price: 999, sku: 'BS-JRN-033', desc: 'Genuine water buffalo leather wrap, lined cream paper, leather tie strap wrap closure.' },
        { name: 'Tree of Life Embossed Journal', price: 1199, sku: 'BS-JRN-034', desc: 'Detailed tree design embossed leather journal, blank unlined pages, vintage handmade finish.' },
        { name: 'Refillable Leather Travelers Notebook', price: 1599, sku: 'BS-JRN-035', desc: 'Soft leather sleeve, holds 3 separate notebook inserts, elastic card slot accessory pouch.' },
        { name: 'Distressed Leather Daily Planner', price: 1899, sku: 'BS-JRN-036', desc: 'Dated diary notebook, thick distressed leather sleeve, standard layouts for goals and tasks.' },
        { name: 'Antique Deckle Edge Paper Journal', price: 1299, sku: 'BS-JRN-037', desc: 'Handmade linen cotton rag paper, deckled edges, raw tan leather cover wrap, rustic design.' },
        { name: 'Celtic Cross Embossed Leather Journal', price: 1199, sku: 'BS-JRN-038', desc: 'Ornate Celtic patterns debossed on dark brown leather, lined pages, bookmark ribbon.' },
        { name: 'Leather Bound Grimoire Journal', price: 2200, sku: 'BS-JRN-039', desc: 'Thick spellbook style leather journal, extra thick sheets, lock studs on sides, vintage print.' },
        { name: 'Minimalist Tan Leather Notebook A5', price: 1450, sku: 'BS-JRN-040', desc: 'Clean vegetable-tanned leather sleeve, replaceable notebook, elastic pen holder sleeve.' }
      ],
      img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600'
    },
    // 5. Notebooks (10)
    {
      items: [
        { name: 'Leuchtturm1917 A5 Dotted Notebook', price: 1899, sku: 'BS-NTB-041', desc: 'Premium bullet journal notebook, 80g acid-free dotted paper, page numbers, index tables, double bookmarks.' },
        { name: 'Moleskine Classic Dotted Journal Large', price: 1699, sku: 'BS-NTB-042', desc: 'Soft cover dotted notebook, rounded corners, elastic closure loop, expandable back pouch.' },
        { name: 'Archer & Olive A5 Dot Grid Notebook', price: 2900, sku: 'BS-NTB-043', desc: 'Thick 160gsm white paper, no ghosting, cute gold embossed cover print, silk ribbon.' },
        { name: 'Rhodia Webnotebook Dotted A5', price: 1550, sku: 'BS-NTB-044', desc: '90g ivory brushed vellum paper, smooth fountain pen friendly, hard leatherette cover.' },
        { name: 'Dingbats* Wildlife A5 Dotted Notebook', price: 1799, sku: 'BS-NTB-045', desc: 'Vegan leather cover, FSC-certified green paper, micro-perforated pages, pen loop holder.' },
        { name: 'Baronfig Confidant Dotted Notebook', price: 1490, sku: 'BS-NTB-046', desc: 'Fabric wrap bookbinding, lays completely flat, premium acid-free cream paper, minimal bookmark.' },
        { name: 'Minimalist Art Dotted Notebook A5', price: 990, sku: 'BS-NTB-047', desc: 'PU leather cover, thick 120gsm paper, 192 pages, elastic band, ribbon markers.' },
        { name: 'Ottergami Dotted Bullet Journal', price: 1290, sku: 'BS-NTB-048', desc: 'Heavyweight 150gsm dot grid notebook, includes stencil templates and sticker sheets.' },
        { name: 'Scribbles That Matter A5 Bullet Book', price: 1999, sku: 'BS-NTB-049', desc: 'High quality vegan leather, key and index tables, pen test page, 160gsm paper.' },
        { name: 'Paperage Dotted Journal Notebook', price: 799, sku: 'BS-NTB-050', desc: 'Hardcover journal, heavy 100gsm paper, expandable folder pocket, lay-flat thread binding.' }
      ],
      img: 'https://images.unsplash.com/photo-1455541504462-57ebb2a9cec1?q=80&w=600'
    },
    // 6. Fountain Pens (10)
    {
      items: [
        { name: 'Lamy Safari Fountain Pen', price: 2200, sku: 'BS-PEN-051', desc: 'Ergonomic triangular grip, durable ABS plastic body, steel medium nib, ink level windows.' },
        { name: 'Pilot Metropolitan Fountain Pen', price: 1999, sku: 'BS-PEN-052', desc: 'Brass metal barrel, classic cigar profile, alloy medium nib, squeeze converter included.' },
        { name: 'TWSBI Eco Fountain Pen', price: 3490, sku: 'BS-PEN-053', desc: 'Piston filling ink system, clear transparent demonstrator body, large capacity chamber.' },
        { name: 'Kaweco Sport Classic Pocket Pen', price: 2190, sku: 'BS-PEN-054', desc: 'Compact pocket fountain pen, octagonal cap design, gold plated steel nib, retro branding.' },
        { name: 'Parker 51 Fountain Pen', price: 9500, sku: 'BS-PEN-055', desc: 'Hooded nib design, precious resin body, brushed steel metal cap with jewel crown.' },
        { name: 'Sailor Compass 1911 Pen', price: 3800, sku: 'BS-PEN-056', desc: 'Clear colored demonstrator, steel medium-fine nib, includes matching color converter.' },
        { name: 'Platinum Preppy Fountain Pen', price: 450, sku: 'BS-PEN-057', desc: 'Budget fountain pen, patented slip-and-seal cap prevents ink drying, stainless steel nib.' },
        { name: 'Pelikan M200 Classic Fountain Pen', price: 14500, sku: 'BS-PEN-058', desc: 'Piston-fill mechanism, 24k gold-plated fittings, marble green barrel cylinder body.' },
        { name: 'Conklin Duragraph Fountain Pen', price: 4900, sku: 'BS-PEN-059', desc: 'Handcrafted resin body, flat-top design, custom omniflex steel nib, converter included.' },
        { name: 'Waterman Hemisphere Fountain Pen', price: 8900, sku: 'BS-PEN-060', desc: 'Sleek thin profile, black lacquer barrel, 23k gold plated clip trim, fine steel nib.' }
      ],
      img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600'
    },
    // 7. Calligraphy (10)
    {
      items: [
        { name: 'Speedball Calligraphy Starter Kit', price: 1499, sku: 'BS-CAL-061', desc: 'Complete set, pen holder, 6 assorted calligraphy nibs, 1 bottle black ink, practice pad.' },
        { name: 'Pilot Parallel Pen 4-Pack Set', price: 3800, sku: 'BS-CAL-062', desc: 'Unique parallel plate nib technology, 4 sizes (1.5, 2.4, 3.8, 6.0mm), mixable inks.' },
        { name: 'Tachikawa Comic Pen Nib Holder', price: 950, sku: 'BS-CAL-063', desc: 'Wood pen holder with soft rubber grip, holds mapping and G-nibs securely, made in Japan.' },
        { name: 'Winsor & Newton Calligraphy Ink Set', price: 2490, sku: 'BS-CAL-064', desc: 'Set of 6 colored calligraphy inks, pigmented acrylic formula, water-resistant.' },
        { name: 'Tombow Dual Brush Pen 10-Set', price: 1990, sku: 'BS-CAL-065', desc: 'Flexible brush tip and fine tip markers, water-based blendable inks, pastel color set.' },
        { name: 'Higgins Eternal Black Writing Ink', price: 590, sku: 'BS-CAL-066', desc: 'Carbon writing ink, non-waterproof, flows smoothly in fountain pens and dip nibs.' },
        { name: 'Kuretake Zig Calligraphy Dual Pens', price: 1290, sku: 'BS-CAL-067', desc: 'Set of 6 double-ended markers (2.0 and 5.0mm chisel tips), water-based pigment, acid-free.' },
        { name: 'Sakura Pigma Micron Fineliner Set', price: 990, sku: 'BS-CAL-068', desc: 'Set of 6 archival ink pens, black pigment, waterproof, micro-fine tips for details.' },
        { name: 'Brause Calligraphy Practice Nib Set', price: 1590, sku: 'BS-CAL-069', desc: 'Includes wood holder, 3 bandzug broad nibs, 1 index nib, 1 cito-fehn fine nib.' },
        { name: 'Manuscript Deluxe Calligraphy Set', price: 2800, sku: 'BS-CAL-070', desc: 'Classic fountain pen casing with 6 interchangeable calligraphy nib sections, cartridges.' }
      ],
      img: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=600'
    },
    // 8. Art Supplies (10)
    {
      items: [
        { name: 'Prismacolor Premier Colored Pencils', price: 4900, sku: 'BS-ART-071', desc: 'Set of 72 professional coloring pencils, soft cores for blending, rich pigments.' },
        { name: 'Derwent Graphic Pencils 12-Set', price: 1450, sku: 'BS-ART-072', desc: 'Fine sketching pencils, assorted graphite grades (9H to 9B), metal storage tin.' },
        { name: 'Faber-Castell Pitt Artist Pens 8-Set', price: 1690, sku: 'BS-ART-073', desc: 'Indian ink artist brush pens, waterproof pigment, archival black, assorted tips.' },
        { name: 'Sakura Gelly Roll White Pens Set', price: 650, sku: 'BS-ART-074', desc: 'Pack of 3 opaque white gel pens (05, 08, 10 sizes), smooth flow, highlights drawing.' },
        { name: 'Strathmore 400 Series Sketchbook', price: 1290, sku: 'BS-ART-075', desc: 'Wirebound A4 sketchbook, 100 sheets of acid-free 89gsm paper, micro-perforated.' },
        { name: 'Moleskine Art Watercolor Album', price: 1890, sku: 'BS-ART-076', desc: 'Landscape watercolor pad, heavy 200gsm cold press paper, matching elastic band.' },
        { name: 'Winsor & Newton Pocket Watercolor Set', price: 2900, sku: 'BS-ART-077', desc: 'Cotman watercolor travel case, 12 half pans, pocket brush, integrated mixing palettes.' },
        { name: 'General\'s Charcoal Pencil Kit', price: 890, sku: 'BS-ART-078', desc: 'Includes 4 charcoal pencils, 1 carbon sketch pencil, charcoal block, kneaded eraser.' },
        { name: 'Copic Ciao Marker 12-Pack Set', price: 4500, sku: 'BS-ART-079', desc: 'Alcohol-based dual-tip sketch markers, skin/basic colors, replaceable nibs and refillable.' },
        { name: 'Faber-Castell Polychromos 24-Set', price: 3400, sku: 'BS-ART-080', desc: 'Oil-based colored pencils, smudge-proof water-resistant lead, break-resistant SV binding.' }
      ],
      img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600'
    },
    // 9. Biographies (10)
    {
      items: [
        { name: 'Steve Jobs by Walter Isaacson', price: 699, sku: 'BS-BIO-081', desc: 'The exclusive biography of the Apple co-founder based on forty interviews over two years.' },
        { name: 'Greenlights by Matthew McConaughey', price: 499, sku: 'BS-BIO-082', desc: 'The Oscar-winning actor\'s memoir containing journals, poetry, and life lessons.' },
        { name: 'Becoming by Michelle Obama', price: 599, sku: 'BS-BIO-083', desc: 'A deeply personal memoir by the former First Lady of the United States.' },
        { name: 'Educated by Tara Westover', price: 449, sku: 'BS-BIO-084', desc: 'A memoir of a young girl who leaves her survivalist Idaho family to pursue a PhD.' },
        { name: 'Shoe Dog by Phil Knight', price: 499, sku: 'BS-BIO-085', desc: 'The Nike founder\'s candid memoir about starting a startup import business.' },
        { name: 'Born to Run by Bruce Springsteen', price: 599, sku: 'BS-BIO-086', desc: 'The legendary rock star\'s autobiography, detail of his Jersey shore youth and E-street band.' },
        { name: 'Open by Andre Agassi', price: 499, sku: 'BS-BIO-087', desc: 'The tennis legend\'s raw, honest memoir about his struggles with pressure and success.' },
        { name: 'I\'m Glad My Mom Died by Jennette McCurdy', price: 699, sku: 'BS-BIO-088', desc: 'Bestselling memoir by former Nickelodeon star detailing child acting struggles.' },
        { name: 'Friends, Lovers, and the Big Terrible Thing', price: 599, sku: 'BS-BIO-089', desc: 'Matthew Perry\'s memoir about Friends fame and his long battle with addiction.' },
        { name: 'Surrender by Bono (U2)', price: 799, sku: 'BS-BIO-090', desc: 'U2 frontman\'s autobiography, 40 songs representing 40 chapters of activist life.' }
      ],
      img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600'
    },
    // 10. Office Desk (10)
    {
      items: [
        { name: 'Galen Leather Desk Pad Large', price: 6900, sku: 'BS-ORG-091', desc: 'Premium thick crazy horse leather desk writing pad mat, hand-stitched, smooth texture.' },
        { name: 'Grovemade Wood Desk Organizer Tray', price: 8900, sku: 'BS-ORG-092', desc: 'Solid walnut wood desk pen tray, solid brass base lining, minimalist cork cushion feet.' },
        { name: 'Yamazaki Steel Desk File Tray', price: 2990, sku: 'BS-ORG-093', desc: 'White powder coated steel letter tray, wooden carry handle, stacks document papers.' },
        { name: 'Ugmonk Gather Desk Organizer Set', price: 14500, sku: 'BS-ORG-094', desc: 'Modular magnetic desk organizer, solid wood base, plastic compartments for pens/notes.' },
        { name: 'Philips Hue Signe Smart Desk Lamp', price: 15900, sku: 'BS-ORG-095', desc: 'Smart LED table light, slim profile, dynamic colorful gradients, app and Siri control.' },
        { name: 'Keychron Walnut Palm Rest Keyboard', price: 2490, sku: 'BS-ORG-096', desc: 'Solid walnut wood wrist rest, ergonomic slope, rubber feet, fits mechanical keyboards.' },
        { name: 'Lamy Desk Stand Pen Holder', price: 1990, sku: 'BS-ORG-097', desc: 'Heavy weight desktop pen stand, textured plastic finish, holds Lamy pens at ideal angle.' },
        { name: 'Logitech MX Keys Wireless Keyboard', price: 12900, sku: 'BS-ORG-098', desc: 'Spherically-dished backlit keys, smart illumination sensors, multi-device flow connect.' },
        { name: 'BenQ ScreenBar Monitor Light Bar', price: 9900, sku: 'BS-ORG-099', desc: 'Monitor clip desk lamp, asymmetrical optical light path prevents screen glare, auto dimmer.' },
        { name: 'Orbitkey Leather Desk Mat Medium', price: 4900, sku: 'BS-ORG-100', desc: 'Vegan leather desk pad, quick access toolbar track bar, magnetic cable holder clip.' }
      ],
      img: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600'
    }
  ]
};

// Wait, we need to generate 100 products for EACH of the 6 categories!
// Since we have defined 10 themes with 10 products each for:
// - electronics (100)
// - fashion-apparel (100)
// - home-kitchen (100)
// - beauty-health (100)
// - sports-outdoors (100)
// - books-stationery (100)
// This is exactly 600 products! 
// Let's write the seed logic to map the categories and insert all 600 items.

async function seed() {
  console.log('🚀 Seeding large catalog (680 products) into Supabase...');

  try {
    // 1. Fetch live categories to get their IDs
    const { data: dbCategories, error: catErr } = await supabase
      .from('categories')
      .select('*');

    if (catErr) throw catErr;

    const categoryMap = {};
    dbCategories.forEach(c => {
      categoryMap[c.slug] = c.id;
    });

    // Verify all 6 categories exist
    const requiredSlugs = ['electronics', 'fashion-apparel', 'home-kitchen', 'beauty-health', 'sports-outdoors', 'books-stationery'];
    for (const slug of requiredSlugs) {
      if (!categoryMap[slug]) {
        throw new Error(`Required category slug "${slug}" not found in database! Please run category reset first.`);
      }
    }

    // 2. Clear existing products to ensure clean insert
    console.log('🧹 Clearing existing products...');
    const { error: clearErr } = await supabase
      .from('products')
      .delete()
      .neq('sku', 'DO_NOT_DELETE_SOMETHING_ELSE');

    if (clearErr) {
      console.warn("Could not clean old products:", clearErr.message);
    } else {
      console.log("✅ Cleared old products.");
    }

    // Curated high-quality matching Unsplash photo IDs (5 per theme)
    const curatedPhotoIds = {
      'electronics': [
        // Laptops (0)
        ['1517694712202-14dd9538aa97', '1611186871348-b1ce696e52c9', '1593642632823-8f785ba67e45', '1588872657578-7efd1f1555ed', '1603302576837-37561b2e2302'],
        // Smartphones (1)
        ['1511707171634-5f897ff02aa9', '1610945265064-0e34e5519bbf', '1598327105666-5b89351aff97', '1565630916779-e303be97b6f5', '1523206489230-c012c64b2b48'],
        // Headphones (2)
        ['1505740420928-5e560c06d30e', '1546435770-a3e426bf472b', '1583394838336-acd977736f90', '1613040809024-b4ef7ba99bc3', '1618384887929-16ec33fab9ef'],
        // Earbuds (3)
        ['1590658268037-6bf12165a8df', '1608156639585-b3a032ef9689', '1588444839795-ad200d72008e', '1631009185127-ae35509930f3', '1606220588913-b3a3b4ede8f9'],
        // Smartwatches (4)
        ['1510832198440-a52376950479', '1434494878577-86c23bcb06b9', '1508685096489-7aacd43bd3b1', '1579586337278-3befd40fd17a', '1523275335684-37898b6baf30'],
        // Speakers (5)
        ['1484704849700-f032a568e944', '1608156639585-b3a032ef9689', '1545454675-3531b543be5d', '1589256469067-ea99122bb5a5', '1612196808214-b8e1d6145a8c'],
        // Monitors (6)
        ['1527443224154-c4a3942d3acf', '1585796856573-005f240fbfaf', '1547082299-de196ea013d6', '1551645121-d1034da75057', '1616440347437-b1c73416efc2'],
        // Cameras (7)
        ['1516035069371-29a1b244cc32', '1502920917128-1da500764cbd', '1510127852285-5b89fe7fbe85', '1519741497674-611481863552', '1495707902641-75cac588d2e9'],
        // Gaming (8)
        ['1607604276583-eef5d076aa5f', '1606144042614-b2417e99c4e3', '1592155977996-df26a6e55c06', '1627856013091-fed6e4e30025', '1550745165-9bc0b252726f'],
        // Storage (9)
        ['1587829741301-dc798b83add3', '1531403009284-440f080d1e12', '1563770660941-20978e870e26', '1618424181497-157f25b6ddd5', '1591799264318-7e6ef8ddb7ea']
      ],
      'fashion-apparel': [
        // Outerwear (0)
        ['1611312449412-6cefac5dc3e4', '1551028719-00167b16eac5', '1548883354-7622d03aca27', '1544923246-77307dd654cb', '1539571696357-5a69c17a67c6'],
        // Knitwear (1)
        ['1620799140408-edc6dcb6d633', '1583743814966-8936f5b7be1a', '1614975058789-41316d0e2e9c', '1578587018452-892bacefd3f2', '1608060434411-0c3fa9049e7b'],
        // Dresses (2)
        ['1595777457583-95e059d581b8', '1612336307429-8a898d106c57', '1572804013309-59a88b7e92f1', '1618244972963-dbee1a7edc95', '1496747611176-843222e1e57c'],
        // Shirts (3)
        ['1603252109303-2751441dd157', '1596755094514-f87e34085b2c', '1521572267360-ee0c2909d518', '1620799139507-2a76f79a2f4d', '1581655353564-df123a1eb820'],
        // Shoes (4)
        ['1549298916-b41d501d3772', '1608231387042-66d1773070a5', '1542291026-7eec264c27ff', '1600185365483-26d7a4cc7519', '1595950653106-6c9ebd614d3a'],
        // Backpacks (5)
        ['1553062407-98eeb64c6a62', '1622560480654-d96214fdc887', '1577733966973-d680bffd2e69', '1611186871348-b1ce696e52c9', '1581605405669-fcdf81165afa'],
        // Wallets (6)
        ['1627124156297-9d42b28d94e1', '1601924994987-69e26d50dc26', '1588444839795-ad200d72008e', '1614252369475-531eba835eb1', '1622560480654-d96214fdc887'],
        // Luggage (7)
        ['1547949003-9792a18a2601', '1565026057447-bc90a3dceb87', '1553062407-98eeb64c6a62', '1577733966973-d680bffd2e69', '1581605405669-fcdf81165afa'],
        // Activewear (8)
        ['1515886657613-9f3515b0c78f', '1517838277536-f5f99be501cd', '1518310383802-640c2de311b2', '1506152983158-b4a74a01c721', '1479064555552-3ef4979f8908'],
        // Accessories (9)
        ['1572635196237-14b3f281503f', '1614252369475-531eba835eb1', '1583223667757-fdf0f4b825b0', '1511499767150-a48a237f0083', '1508296695146-257a814070b4']
      ],
      'home-kitchen': [
        // Desk Lamps (0)
        ['1526040652367-ac003a0475fe', '1519219788971-8d9797e0928e', '1542728928-1413d1894ed1', '1551380701-5dd33d5b5d06', '1582356630861-61bb9b41f541'],
        // Floor Lights (1)
        ['1507473885765-e6ed057f782c', '1675767528117-963ce219b52a', '1630578877871-1a2f9d372fd2', '1688918511009-0b3992e6b020', '1646107543597-e95b90ba4081'],
        // Coffee Makers (2)
        ['1544816155-12df9643f363', '1495474472287-4d71bcdd2085', '1517256064527-09c53b2d0bc6', '1509042239860-f550ce710b93', '1579888944880-d98341148494'],
        // Grinders (3)
        ['1545665225-b23b99e4d45e', '1514432324607-a09d9b4aefdd', '1509042239860-f550ce710b93', '1495474472287-4d71bcdd2085', '1517256064527-09c53b2d0bc6'],
        // Cookware (4)
        ['1584269600464-37b1b58a9fe7', '1599940824399-b87987ceb72a', '1556910103-1c02745aae4d', '1590794056226-79ef3a8147e1', '1583847268964-b28dc8f51f92'],
        // Dinnerware (5)
        ['1610701596007-11502861dcfa', '1576092768241-dec231879fc3', '1610701596061-070b4bafcd01', '1535401991746-da3d9055713e', '1603178455924-ef33372953bb'],
        // Tablecloths (6)
        ['1601049541289-9b1b7bbbfe19', '1590794056226-79ef3a8147e1', '1601049541189-e85de11f8022', '1556910103-1c02745aae4d', '1583847268964-b28dc8f51f92'],
        // Furniture (7)
        ['1527018601619-a508a2be00cd', '1586023492125-27b2c045efd7', '1567538096630-e0c55bd6374c', '1555041469-a586c61ea9bc', '1583847268964-b28dc8f51f92'],
        // Cushions (8)
        ['1505691938895-1758d7feb511', '1584100936595-c0654b55a2e2', '1540518614846-7eded433c457', '1583847268964-b28dc8f51f92', '1598928506311-c55ded91a20c'],
        // Organizers (9)
        ['1583847268964-b28dc8f51f92', '1598928506311-c55ded91a20c', '1505691938895-1758d7feb511', '1584100936595-c0654b55a2e2', '1540518614846-7eded433c457'],
        // Sofas (10)
        ['1555041469-a586c61ea9bc', '1493663284031-b7e3aefcae8e', '1586023492125-27b2c045efd7', '1524758631624-e2822e304c36', '1540518614846-7eded433c457'],
        // Beds (11)
        ['1505693416388-ac5ce068fe85', '1522771739844-6a9f6d5f14af', '1540518614846-7eded433c457', '1505691938895-1758d7feb511', '1584100936595-c0654b55a2e2'],
        // Ceiling Fans (12)
        ['1618944913488-8292c2df9e8e', '1618944913488-8292c2df9e8e', '1618944913488-8292c2df9e8e', '1618944913488-8292c2df9e8e', '1618944913488-8292c2df9e8e'],
        // Water Purifiers (13)
        ['1595981267035-7b04ca84a82d', '1595981267035-7b04ca84a82d', '1595981267035-7b04ca84a82d', '1595981267035-7b04ca84a82d', '1595981267035-7b04ca84a82d'],
        // Gas Stoves (14)
        ['1556910103-1c02745aae4d', '1584269600464-37b1b58a9fe7', '1556910103-1c02745aae4d', '1584269600464-37b1b58a9fe7', '1556910103-1c02745aae4d']
      ],
      'beauty-health': [
        // Serums (0)
        ['1620916566398-39f1143ab7be', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Moisturizers (1)
        ['1556228578-8c89e6adf883', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Masks (2)
        ['1598440947619-2c35fc9aa908', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Hair Oils (3)
        ['1522338242992-e1a54906a8da', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Shampoos (4)
        ['1585751119414-ef2636f8aede', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Diffusers (5)
        ['1608571423902-eed4a5ad8108', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Essential Oils (6)
        ['1617897903246-719242758050', '1608248597279-f99d160bfcbc', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0', '1608571423902-eed4a5ad8108'],
        // Sunscreens (7)
        ['1612817288484-6f916006741a', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1601049676099-e7ed07d825b0'],
        // Soaps (8)
        ['1601049676099-e7ed07d825b0', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1570172619644-dfd03ed5d881', '1608571423902-eed4a5ad8108'],
        // Vitamins (9)
        ['1570172619644-dfd03ed5d881', '1608248597279-f99d160bfcbc', '1617897903246-719242758050', '1601049676099-e7ed07d825b0', '1608571423902-eed4a5ad8108']
      ],
      'sports-outdoors': [
        // Resistance Bands (0)
        ['1571902943202-507ec2618e8f', '1517838277536-f5f99be501cd', '1517838277536-f5f99be501cd', '1518310383802-640c2de311b2', '1518310383802-640c2de311b2'],
        // Weights (1)
        ['1534438327276-14e5300c3a48', '1517838277536-f5f99be501cd', '1605296867304-46d5465a25f1', '1584735935682-2f2b69dff9d2', '1518310383802-640c2de311b2'],
        // Ropes (2)
        ['1598289431512-b97b0917affc', '1517838277536-f5f99be501cd', '1605296867304-46d5465a25f1', '1584735935682-2f2b69dff9d2', '1518310383802-640c2de311b2'],
        // Tents (3)
        ['1504280390367-361c6d9f38f4', '1534447677768-be436bb09401', '1504280390367-361c6d9f38f4', '1534447677768-be436bb09401', '1504280390367-361c6d9f38f4'],
        // Water Bottles (4)
        ['1602143407151-7111542de6e8', '1602143407151-7111542de6e8', '1602143407151-7111542de6e8', '1602143407151-7111542de6e8', '1602143407151-7111542de6e8'],
        // Yoga Mats (5)
        ['1601925228008-0f4b1ebc9c39', '1599447421416-3414500d18a5', '1601925228008-0f4b1ebc9c39', '1599447421416-3414500d18a5', '1601925228008-0f4b1ebc9c39'],
        // Sleeping Bags (6)
        ['1517838277536-f5f99be501cd', '1504280390367-361c6d9f38f4', '1517838277536-f5f99be501cd', '1504280390367-361c6d9f38f4', '1517838277536-f5f99be501cd'],
        // Camping Stoves (7)
        ['1541534741688-6078c6bfb5c5', '1504280390367-361c6d9f38f4', '1541534741688-6078c6bfb5c5', '1504280390367-361c6d9f38f4', '1541534741688-6078c6bfb5c5'],
        // Hiking Backpacks (8)
        ['1502680390469-be75c86b636f', '1553062407-98eeb64c6a62', '1502680390469-be75c86b636f', '1553062407-98eeb64c6a62', '1502680390469-be75c86b636f'],
        // GPS Watches (9)
        ['1510832198440-a52376950479', '1434494878577-86c23bcb06b9', '1508685096489-7aacd43bd3b1', '1579586337278-3befd40fd17a', '1523275335684-37898b6baf30'],
        // Cricket (10)
        ['1535137836757-ef95d4957e8f', '1608976693714-d07c4c3b160b', '1593341604644-00fce041a87c', '1508385083091-7aacd43bd3b1', '1520380262778-076eb862d38f'],
        // Volleyball (11)
        ['1612872087720-bb876e2e67d1', '1593787406539-5b6afb19a0c8', '1609127102941-8ae9a5eed7b1', '1547949003-9792a18a2601', '1579586337278-3befd40fd17a'],
        // Basketball (12)
        ['1546519638-68e109498ffc', '1519766304817-4f37bda74a27', '1505666287802-931dc83948e9', '1574629810360-7efbbe195001', '1518063319729-ff441f71dfb1']
      ],
      'books-stationery': [
        // Fiction (0)
        ['1544947950-fa07a98d237f', '1512820790803-83ca734da794', '1610116306796-6fea9f4fae38', '1543002588-bfa74002ed7e', '1497633762265-9d179a990aa6'],
        // Self-Improvement (1)
        ['1512820790803-544947950-fa07a98d237f', '1512820790803-83ca734da794', '1610116306796-6fea9f4fae38', '1543002588-bfa74002ed7e', '1497633762265-9d179a990aa6'],
        // History (2)
        ['1610116306796-6fea9f4fae38', '1544947950-fa07a98d237f', '1512820790803-83ca734da794', '1543002588-bfa74002ed7e', '1497633762265-9d179a990aa6'],
        // Journals (3)
        ['1531346878377-a5be20888e57', '1513001900722-370f803f498d', '1506784983877-45594efa4cbe', '1517842645767-c639042777db', '1455390582262-044cdead277a'],
        // Notebooks (4)
        ['1455541504462-57ebb2a9cec1', '1513001900722-370f803f498d', '1506784983877-45594efa4cbe', '1517842645767-c639042777db', '1455390582262-044cdead277a'],
        // Fountain Pens (5)
        ['1583485088034-697b5bc54ccd', '1569003339405-ea396a5a8a90', '1513542789411-b6a5d4f31634', '1580565807904-14f7f95d51ba', '1562259949-e8e7689d7828'],
        // Calligraphy (6)
        ['1455849318743-b2233052fcff', '1569003339405-ea396a5a8a90', '1513542789411-b6a5d4f31634', '1580565807904-14f7f95d51ba', '1562259949-e8e7689d7828'],
        // Art Supplies (7)
        ['1513364776144-60967b0f800f', '1513364776144-60967b0f800f', '1520420050812-7b68ff5f36fc', '1513364776144-60967b0f800f', '1520420050812-7b68ff5f36fc'],
        // Biographies (8)
        ['1516979187457-637abb4f9353', '1544947950-fa07a98d237f', '1512820790803-83ca734da794', '1543002588-bfa74002ed7e', '1497633762265-9d179a990aa6'],
        // Office Desk (9)
        ['1513001900722-370f803f498d', '1513001900722-370f803f498d', '1506784983877-45594efa4cbe', '1517842645767-c639042777db', '1455390582262-044cdead277a']
      ]
    };

    // 3. Assemble all 600 products
    const productsToInsert = [];

    for (const [catSlug, themes] of Object.entries(dataCatalog)) {
      const categoryId = categoryMap[catSlug];

      themes.forEach((theme, themeIdx) => {
        theme.items.forEach((item, itemIdx) => {
          // Adjust price or name to make them realistic/unique
          // Sku is already defined, let's keep it unique
          // Generate realistic variations for stock, discount, status
          const stock = Math.floor(Math.random() * 45) + 5; // 5 to 50 stock
          const discount = Math.random() > 0.6 ? (Math.random() > 0.5 ? 10 : 15) : 0; // occasional 10% or 15% discount
          
          const photoPool = curatedPhotoIds[catSlug]?.[themeIdx] || ['1523275335684-37898b6baf30'];
          const photoId = photoPool[itemIdx % photoPool.length];
          const imageUrl = `https://images.unsplash.com/photo-${photoId}?q=80&w=600`;

          productsToInsert.push({
            name: item.name,
            description: item.desc,
            price: item.price,
            discount: discount,
            sku: item.sku,
            stock: stock,
            status: 'active',
            images: [imageUrl],
            category_id: categoryId
          });
        });
      });
    }

    console.log(`📦 Prepared ${productsToInsert.length} products to insert.`);

    // 4. Insert in chunks of 100 to avoid request body size limits in Supabase PostgREST
    const chunkSize = 100;
    let successCount = 0;

    for (let i = 0; i < productsToInsert.length; i += chunkSize) {
      const chunk = productsToInsert.slice(i, i + chunkSize);
      console.log(`   → Inserting chunk ${i / chunkSize + 1}...`);
      const { data, error } = await supabase
        .from('products')
        .insert(chunk)
        .select();

      if (error) {
        console.error(`❌ Error inserting chunk starting at index ${i}:`, error.message);
        throw error;
      }
      successCount += data.length;
    }

    console.log(`🎉 Successfully seeded ${successCount} products across 6 categories!`);

  } catch (err) {
    console.error('❌ Error during large seed:', err.message || err);
  }
}

seed();
