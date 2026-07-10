import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingBag, Star, Trash2 } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [addedIds, setAddedIds] = useState({});

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [item.id]: false })), 1500);
  };

  const handleRemoveFromWishlist = (e, item) => {
    e.stopPropagation();
    dispatch(toggleWishlist(item));
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Page Header */}
      <div className="border-b border-[#2F2F2F]/10 pb-5">
        <h2 className="text-3xl font-serif font-bold tracking-wide">My Wishlist</h2>
        <p className="text-xs text-[#7A756B] mt-1.5 font-sans">
          Save items you love and shop them when you're ready.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center">
            <Heart size={36} className="text-[#8B5E3C]" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#2F2F2F]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#7A756B] max-w-sm leading-relaxed">
              Browse our catalog and tap the heart icon on any product to save it here for later.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 bg-[#6C4E31] hover:bg-[#8B5E3C] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-sm cursor-pointer mt-2"
          >
            <ShoppingBag size={14} />
            Browse Products
          </button>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const hasDiscount = parseFloat(item.discount || 0) > 0;
            const originalPrice = parseFloat(item.originalPrice || item.price || 0);
            const discountPercentage = parseFloat(item.discount || 0);
            const finalPrice = hasDiscount ? originalPrice * (1 - discountPercentage / 100) : originalPrice;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-[#FAF8F3] border border-[#2F2F2F]/15 rounded-sm p-4 relative flex flex-col justify-between group hover:shadow-md hover:border-[#8B5E3C]/30 transition-all duration-300 cursor-pointer"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => handleRemoveFromWishlist(e, item)}
                  className="absolute top-3 right-3 text-[#7A756B] hover:text-red-500 cursor-pointer z-10 transition-colors bg-white/80 p-1.5 rounded-full border border-[#2F2F2F]/10 hover:border-red-200"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={13} />
                </button>

                {/* Card content */}
                <div className="space-y-3">
                  <div className="aspect-square bg-white border border-[#2F2F2F]/10 p-2 overflow-hidden flex items-center justify-center rounded-sm">
                    <img
                      src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                      alt={item.name}
                      className="object-contain h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                      }}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <h4 className="font-serif text-sm font-bold text-[#2F2F2F] group-hover:text-[#8B5E3C] transition-colors leading-tight line-clamp-1">
                      {item.name}
                    </h4>
                    {/* Pricing */}
                    <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
                      <span className="text-[#8B5E3C] text-xs font-bold">
                        ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-[9px] text-[#7A756B] line-through">
                            ₹{originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[8px] uppercase tracking-wider font-semibold text-[#8B5E3C]">
                            ({discountPercentage}% OFF)
                          </span>
                        </>
                      )}
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 pt-0.5">
                      <div className="flex gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[9px] text-[#7A756B]">({Math.floor(Math.random() * 80) + 20})</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  className={`mt-3 w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-all cursor-pointer border ${
                    addedIds[item.id]
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-[#2F2F2F]/20 text-[#2F2F2F] hover:bg-[#6C4E31] hover:text-white hover:border-[#6C4E31]'
                  }`}
                >
                  {addedIds[item.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
