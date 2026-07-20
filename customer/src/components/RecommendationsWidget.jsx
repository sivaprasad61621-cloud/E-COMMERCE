import React, { useState, useEffect } from 'react';
import { Sparkles, Star, ShoppingBag, ArrowUpRight } from 'lucide-react';

export function RecommendationsWidget({ productId, onAddToCart, onSelectProduct }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      setIsLoading(true);
      try {
        const url = productId 
          ? `http://localhost:5000/api/products/recommendations?productId=${productId}&limit=4`
          : `http://localhost:5000/api/products/recommendations?limit=6`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        }
      } catch (err) {
        console.error('Recommendations error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecs();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        <Sparkles className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-600" />
        <span>Curating recommendations for you...</span>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="my-10 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 sm:p-8 rounded-3xl border border-amber-100/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-800 text-white rounded-xl shadow-md shadow-amber-900/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              {productId ? 'Frequently Bought Together & Similar Items' : 'Recommended for You'}
            </h3>
            <p className="text-xs text-slate-500">AI-powered recommendation engine based on your preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendations.map((item) => {
          const imgUrl = item.image_url || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600';
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-900 shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.rating || 4.8}
                  </span>
                </div>
                <h4 
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className="font-semibold text-slate-800 text-sm hover:text-amber-800 cursor-pointer line-clamp-1"
                >
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-sans">Price</span>
                  <span className="text-base font-bold text-amber-900 font-mono">
                    ₹{parseFloat(item.price || 0).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onAddToCart && onAddToCart(item)}
                  className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendationsWidget;
