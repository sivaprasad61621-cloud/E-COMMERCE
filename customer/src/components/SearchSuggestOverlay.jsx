import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export function SearchSuggestOverlay({ onSelectProduct, onPerformSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/suggest?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Suggest error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      if (onPerformSearch) onPerformSearch(query);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search items, brands, categories (Elasticsearch-style)..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-amber-700 rounded-full text-sm transition focus:outline-none focus:ring-4 focus:ring-amber-500/10 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        {isLoading && <Loader2 className="w-4 h-4 text-amber-700 absolute right-3.5 top-3.5 animate-spin" />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in duration-150">
          <div className="px-4 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-600" /> Instant Match Suggestions</span>
            <span>TF-IDF Score</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsOpen(false);
                  if (onSelectProduct) onSelectProduct(item);
                }}
                className="w-full px-4 py-3 text-left hover:bg-amber-50/60 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400">IMG</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-900 transition line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-900 font-mono">₹{parseFloat(item.price || 0).toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{(item.score || 1).toFixed(1)} pts</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              if (onPerformSearch) onPerformSearch(query);
            }}
            className="w-full p-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <span>See all results for "{query}"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchSuggestOverlay;
