import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RefreshCw, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const getProductGalleryImages = (prod) => {
  if (!prod || !prod.images || prod.images.length === 0) {
    return ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'];
  }
  
  const primary = prod.images[0];
  
  // If the product record already has multiple unique images, use those directly.
  if (prod.images.length > 1) {
    return prod.images;
  }
  
  // To ensure the photos are of the EXACT SAME ITEM, we generate high-end close-up, macro,
  // and detail angles of the primary image by using different focal zoom and crop settings on the same file.
  if (primary.includes('unsplash.com')) {
    const baseUrl = primary.split('?')[0];
    return [
      `${baseUrl}?q=80&w=600`, // View 1: Full Front Shot
      `${baseUrl}?q=80&w=600&fit=crop&crop=entropy&h=600`, // View 2: Macro Material / Texture Detail
      `${baseUrl}?q=80&w=600&fit=crop&crop=focalpoint&fp-z=2&h=600`, // View 3: Center Zoom
      `${baseUrl}?q=80&w=600&fit=crop&crop=focalpoint&fp-z=1.6&fp-y=0.45&h=600`, // View 4: Focal Detail Focus
      `${baseUrl}?q=80&w=600&fit=crop&crop=focalpoint&fp-z=2.5&fp-x=0.55&fp-y=0.4&h=600` // View 5: Alternate Detail Focus
    ];
  }
  
  // Replicate primary image for other domains/local fallbacks
  return [primary, primary, primary, primary, primary].slice(0, 5);
};

const getProductFeatures = (prod) => {
  if (!prod) return [];
  const name = (prod.name || '').toLowerCase();
  const cat = (prod.category?.name || '').toLowerCase();

  if (name.includes('coat') || name.includes('trench') || cat.includes('fashion') || cat.includes('apparel')) {
    return [
      { label: 'Material Composition', value: '100% Premium Cotton Gabardine' },
      { label: 'Inner Lining', value: 'Signature vintage checkered flannel lining' },
      { label: 'Fit & Silhouette', value: 'Classic double-breasted tailored fit' },
      { label: 'Hardware', value: 'Custom horn-textured buttons & solid brass belt buckle' },
      { label: 'Care Instructions', value: 'Professional dry clean only' },
      { label: 'Origin', value: 'Handcrafted in England' }
    ];
  }
  if (name.includes('brogues') || name.includes('shoes') || name.includes('sneakers') || name.includes('leather')) {
    return [
      { label: 'Upper Material', value: 'Full-grain vegetable-tanned calfskin leather' },
      { label: 'Sole Construction', value: 'Hand-stitched Goodyear welted leather sole' },
      { label: 'Lining', value: '100% breathable glove-leather lining' },
      { label: 'Insole', value: 'Cushioned leather insole with arch support' },
      { label: 'Style', value: 'Classic wingtip brogue detailing' },
      { label: 'Origin', value: 'Artisanal workshop in Florence, Italy' }
    ];
  }
  if (name.includes('bag') || name.includes('saddle')) {
    return [
      { label: 'Exterior Leather', value: '5oz Vegetable-tanned saddle leather' },
      { label: 'Hardware & Closures', value: 'Solid sand-cast brass buckles and rivets' },
      { label: 'Strap Design', value: 'Adjustable leather shoulder strap with 20"–24" drop' },
      { label: 'Internal Compartments', value: 'One main chamber with dual slip pockets' },
      { label: 'Dimensions', value: '10.5" W x 8" H x 3.5" D' },
      { label: 'Origin', value: 'Handmade in Oregon, USA' }
    ];
  }
  if (name.includes('headphones') || name.includes('wireless') || cat.includes('electronics')) {
    return [
      { label: 'Audio Driver', value: 'Custom-tuned 40mm dynamic neodymium drivers' },
      { label: 'Connectivity', value: 'Bluetooth 5.2 with aptX Adaptive & AAC support' },
      { label: 'Battery Life', value: 'Up to 30 hours of continuous playback' },
      { label: 'Charging', value: 'USB-C fast charge (10 mins provides 5 hours of playback)' },
      { label: 'Materials', value: 'Premium leather earpads & brushed aluminum arms' },
      { label: 'Noise Cancellation', value: 'Hybrid Active Noise Cancellation (ANC)' }
    ];
  }
  if (name.includes('watch') || name.includes('chronograph')) {
    return [
      { label: 'Movement', value: 'Japanese automatic self-winding movement (40h power reserve)' },
      { label: 'Dial Glass', value: 'Scratch-resistant domed sapphire crystal' },
      { label: 'Case Material', value: '316L Surgical-grade brushed stainless steel' },
      { label: 'Strap Material', value: 'Genuine Horween leather strap with steel buckle' },
      { label: 'Water Resistance', value: '5 ATM / 50 meters (splash proof)' },
      { label: 'Case Diameter', value: '40mm' }
    ];
  }
  return [
    { label: 'Material & Build', value: 'Premium sourced materials, built for durability' },
    { label: 'Quality Guarantee', value: 'Rigorous 100-point inspections' },
    { label: 'Aesthetic Style', value: 'Timeless vintage-editorial catalog appeal' },
    { label: 'Packaging', value: 'Delivered in a bespoke dust bag and hard-shell box' },
    { label: 'Warranty', value: '1-year comprehensive manufacturer warranty' }
  ];
};

const getDefaultReviews = (productId) => {
  return [
    {
      id: 'rev-1',
      author: 'Evelyn V.',
      rating: 5,
      date: '2026-06-12',
      title: 'Absolutely Exquisite Piece',
      comment: 'The craftsmanship on this item is stunning. It feels heavy, premium, and durable. The leather has a beautiful natural patina. Strongly recommend it!'
    },
    {
      id: 'rev-2',
      author: 'Julian K.',
      rating: 4,
      date: '2026-05-28',
      title: 'Classic styling and solid build',
      comment: 'Very pleased with the purchase. The packaging was beautiful, wrapping paper had an old newspaper style print. Delivery took 3 days to Mumbai.'
    },
    {
      id: 'rev-3',
      author: 'Mirabai S.',
      rating: 5,
      date: '2026-05-10',
      title: 'Exceeded all expectations',
      comment: 'The photos do not do this justice. It looks even better in real life. Elegant, simple, and functional. Worth every rupee.'
    }
  ];
};

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  // Features and Reviews State
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Product Image Gallery State
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reset active image index when ID changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Object not found in ledger archives.');
        }
        const data = await response.json();
        setProduct(data);
        setReviews(getDefaultReviews(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    navigate('/checkout', {
      state: {
        buyNowItem: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          discount: parseFloat(product.discount || 0),
          image: product.images?.[0] || '',
          sku: product.sku || '',
          quantity: 1
        }
      }
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    const authorName = currentUser?.fullName || currentUser?.email || 'Anonymous User';
    const newRevItem = {
      id: `rev-custom-${Date.now()}`,
      userId: currentUser?.id || 'anonymous-id',
      author: authorName,
      rating: parseInt(newReview.rating),
      date: new Date().toISOString().split('T')[0],
      title: newReview.title.trim(),
      comment: newReview.comment.trim()
    };
    setReviews(prev => [newRevItem, ...prev]);
    setReviewSubmitted(true);
    setNewReview({ rating: 5, title: '', comment: '' });
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  if (loading) return <p className="text-sm italic text-[#7A756B] text-center py-24">Loading object ledger details...</p>;
  if (error) return <p className="text-sm text-red-700 text-center py-24">Error: {error}</p>;
  if (!product) return null;

  const hasDiscount = parseFloat(product.discount || 0) > 0;
  const finalPrice = hasDiscount 
    ? product.price * (1 - parseFloat(product.discount) / 100)
    : product.price;

  const galleryImages = getProductGalleryImages(product);

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Navigation breadcrumb */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#7A756B] hover:text-[#2F2F2F] cursor-pointer transition-colors"
      >
        <ArrowLeft size={14} /> Back to Catalog
      </button>

      {/* Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Images Slider */}
        <div className="space-y-4">
          <div className="bg-white border-editorial border-opacity-40 p-6 relative flex items-center justify-center aspect-square group overflow-hidden">
            {galleryImages.length > 0 ? (
              <>
                <img
                  src={galleryImages[activeImageIdx]}
                  alt={`${product.name} - View ${activeImageIdx + 1}`}
                  className="object-contain max-h-full max-w-full transition-all duration-500 animate-fadeIn"
                  key={activeImageIdx}
                />
                
                {/* Arrow buttons (only visible if we have multiple images) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#2F2F2F] hover:text-white border border-[#2F2F2F]/20 text-[#2F2F2F] p-1.5 rounded-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm z-10"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx(prev => (prev + 1) % galleryImages.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-[#2F2F2F] hover:text-white border border-[#2F2F2F]/20 text-[#2F2F2F] p-1.5 rounded-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm z-10"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <span className="font-mono text-xs uppercase text-[#7A756B]">No image index</span>
            )}
          </div>

          {/* Thumbnails Row */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square bg-white border p-1 rounded-sm overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    activeImageIdx === idx 
                      ? 'border-[#8B5E3C] ring-1 ring-[#8B5E3C]' 
                      : 'border-[#2F2F2F]/15 hover:border-[#2F2F2F]/50'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="object-contain max-h-full max-w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content details description and cart forms */}
        <div className="space-y-8">
          <div className="border-editorial-b pb-6 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-[#7A756B]">
              {product.category?.name || 'Unclassified'}
            </span>
            <h1 className="font-serif font-bold text-4xl leading-tight">{product.name}</h1>
            <p className="text-xs font-mono text-[#7A756B] tracking-wider">SKU: {product.sku}</p>
          </div>

          {/* Pricing Details */}
          <div className="flex items-baseline gap-4">
            {hasDiscount ? (
              <>
                <span className="text-[#8B5E3C] font-semibold text-3xl font-serif">
                  ₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-[#7A756B] line-through">
                  ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#8B5E3C] tracking-widest px-2 py-0.5 border border-[#8B5E3C]">
                  SAVE {parseInt(product.discount)}%
                </span>
              </>
            ) : (
              <span className="font-semibold text-3xl font-serif">
                ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock Alert */}
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono font-semibold tracking-wider block">Allocation Pool</span>
            {product.stock === 0 ? (
              <span className="text-red-700 text-xs font-bold font-mono">DEPLETED OUT OF STOCK</span>
            ) : product.stock < 10 ? (
              <span className="text-red-700 text-xs font-semibold font-mono">SCARCE: ONLY {product.stock} UNITS REMAINING</span>
            ) : (
              <span className="text-green-800 text-xs font-semibold font-mono">AVAILABLE FOR DISPATCH</span>
            )}
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-2 border-editorial-t border-opacity-20 pt-6">
              <span className="text-xs uppercase font-mono font-semibold tracking-wider block">Description Details</span>
              <p className="text-sm leading-relaxed text-[#7A756B] max-w-lg">
                {product.description}
              </p>
            </div>
          )}

          {/* Cart Buttons */}
          <div className="border-editorial-t border-opacity-20 pt-6 space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full md:w-64 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold border-editorial transition-all cursor-pointer ${
                product.stock === 0
                  ? 'border-opacity-30 text-[#7A756B] cursor-not-allowed bg-[#FAF8F3]'
                  : added
                  ? 'bg-green-800 text-white border-green-800'
                  : 'bg-[#2F2F2F] text-white hover:bg-transparent hover:text-[#2F2F2F]'
              }`}
            >
              <ShoppingBag size={14} />
              {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
            </button>
            {product.stock > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full md:w-64 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold bg-[#8B5E3C] text-white hover:bg-[#6C4E31] transition-all cursor-pointer"
              >
                <Zap size={14} fill="currentColor" /> Buy Now
              </button>
            )}
          </div>

          {/* Marketing points */}
          <div className="grid grid-cols-3 gap-4 border-editorial-t border-opacity-20 pt-6 text-center">
            <div className="space-y-1 flex flex-col items-center">
              <Truck size={18} className="text-[#8B5E3C]" />
              <span className="text-[9px] uppercase tracking-wider font-semibold block">Camelot Shipping</span>
            </div>
            <div className="space-y-1 flex flex-col items-center">
              <ShieldCheck size={18} className="text-[#8B5E3C]" />
              <span className="text-[9px] uppercase tracking-wider font-semibold block">Secured Assets</span>
            </div>
            <div className="space-y-1 flex flex-col items-center">
              <RefreshCw size={18} className="text-[#8B5E3C]" />
              <span className="text-[9px] uppercase tracking-wider font-semibold block">Fulfillment Gurantees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section below */}
      <div className="border-t border-[#2F2F2F]/20 pt-8 mt-12 space-y-6">
        <div className="flex border-b border-[#2F2F2F]/20">
          {[
            { id: 'description', label: 'Details' },
            { id: 'features', label: 'Features & Specifications' },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 text-xs uppercase tracking-widest font-extrabold border-b-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'border-[#8B5E3C] text-[#8B5E3C]'
                  : 'border-transparent text-[#7A756B] hover:text-[#2F2F2F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-2xl text-left">
              <h3 className="font-serif text-xl font-bold">About {product.name}</h3>
              <p className="text-sm leading-relaxed text-[#7A756B]">
                {product.description || 'No additional catalog descriptions available for this product record.'}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-mono text-[#7A756B]">
                <div><span className="font-semibold text-[#2F2F2F]">Model SKU:</span> {product.sku}</div>
                <div><span className="font-semibold text-[#2F2F2F]">Status:</span> Available</div>
                <div><span className="font-semibold text-[#2F2F2F]">Dimensions:</span> Premium standard package</div>
                <div><span className="font-semibold text-[#2F2F2F]">Shipping Weight:</span> 1.2 kg</div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-2xl text-left space-y-4">
              <h3 className="font-serif text-xl font-bold">Technical Specifications</h3>
              <div className="border border-[#2F2F2F]/15 rounded-sm overflow-hidden divide-y divide-[#2F2F2F]/10">
                {getProductFeatures(product).map((feat, idx) => (
                  <div key={idx} className="grid grid-cols-3 text-xs p-3 bg-[#FAF8F3]">
                    <span className="font-bold text-[#2F2F2F] uppercase tracking-wider">{feat.label}</span>
                    <span className="col-span-2 text-[#7A756B]">{feat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 text-left">
              {/* Rating Summary & Add Review Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Average Score (4/12 columns) */}
                <div className="md:col-span-4 bg-[#FAF8F3] border border-[#2F2F2F]/15 p-6 rounded-sm text-center space-y-3">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#7A756B]">Customer Score</span>
                  <div className="text-5xl font-serif font-bold text-[#8B5E3C]">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                  </div>
                  <div className="flex justify-center text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
                      return (
                        <span key={i} className="text-lg">
                          {i < Math.round(avg) ? '★' : '☆'}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-[#7A756B] block">Based on {reviews.length} reviews</span>
                </div>

                {/* Add Review Form (8/12 columns) */}
                <div className="md:col-span-8 bg-[#FAF8F3] border border-[#2F2F2F]/15 p-6 rounded-sm space-y-4">
                  <h4 className="font-serif text-lg font-bold">Write a Review</h4>
                  {reviews.some(r => r.userId === currentUser?.id || (currentUser?.fullName && r.author === currentUser.fullName)) ? (
                    <div className="p-6 border border-[#2F2F2F]/10 rounded-sm text-center bg-[#2F2F2F]/5 space-y-1">
                      <p className="text-xs font-semibold text-[#2F2F2F]">You have already submitted a review for this product.</p>
                      <p className="text-[10px] text-[#7A756B]">To keep reviews authentic, we limit submissions to one review per product.</p>
                    </div>
                  ) : reviewSubmitted ? (
                    <div className="p-4 bg-green-50 text-green-800 text-xs font-semibold rounded-sm border border-green-200">
                      ✓ Thank you! Your review has been added successfully.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div className="text-xs text-[#7A756B] mb-1">
                        Reviewing as <strong className="text-[#2F2F2F]">{currentUser?.fullName || currentUser?.email || 'Anonymous User'}</strong>
                      </div>
                      
                      <div className="w-full">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A756B] block mb-1">Rating</label>
                        <select
                          value={newReview.rating}
                          onChange={e => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
                          className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-1.5 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                        >
                          <option value="5">5 Stars ★★★★★</option>
                          <option value="4">4 Stars ★★★★☆</option>
                          <option value="3">3 Stars ★★★☆☆</option>
                          <option value="2">2 Stars ★★☆☆☆</option>
                          <option value="1">1 Star ★☆☆☆☆</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A756B] block mb-1">Review Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Exquisite Craftsmanship"
                          value={newReview.title}
                          onChange={e => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-1.5 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A756B] block mb-1">Review Details</label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Tell us what you liked or disliked about this product..."
                          value={newReview.comment}
                          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          className="w-full bg-white border border-[#2F2F2F]/20 px-3 py-1.5 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-[#2F2F2F] hover:bg-[#8B5E3C] text-white text-[10px] uppercase tracking-widest font-bold px-6 py-2 transition-colors duration-300 rounded-sm cursor-pointer"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-4 border-t border-[#2F2F2F]/10">
                <h4 className="font-serif text-lg font-bold">Detailed Reviews</h4>
                <div className="space-y-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="border-b border-[#2F2F2F]/10 pb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#2F2F2F]">{rev.author}</span>
                          <span className="text-[9px] text-[#7A756B] font-mono">{rev.date}</span>
                        </div>
                        <div className="text-amber-500 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx} className="text-xs">
                              {idx < rev.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-[#2F2F2F] font-serif">{rev.title}</h5>
                      <p className="text-xs text-[#7A756B] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
