import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../store/slices/settingsSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Settings, User, Sliders, Database, Save, Check } from 'lucide-react';

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const user = useSelector((state) => state.auth.user);

  // Form states initialized from Redux state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [currency, setCurrency] = useState(settings.currency);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold);
  const [theme, setTheme] = useState(settings.theme);

  // Success indicator
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings({
      storeName,
      currency,
      lowStockThreshold,
      theme,
    }));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#2F2F2F] text-[#FAF8F3] px-4 py-3 rounded-sm shadow-vintage-flat flex items-center gap-2 border-[0.5px] border-[#FAF8F3]/20 animate-slideIn z-50 text-sm tracking-wide">
          <Check size={16} className="text-[#8B5E3C]" />
          <span>Platform configurations saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#2F2F2F]/20 pb-6">
        <h2 className="text-4xl font-serif tracking-wide mb-2 flex items-center gap-3">
          <Settings size={28} className="text-[#8B5E3C] animate-spin-slow" />
          <span>Administration Settings</span>
        </h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Configure business metadata, system parameters, design tokens, and server database connections.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Business & Profile Configuration */}
        <div className="space-y-8">
          <Card title="Business Configuration" icon={Sliders}>
            <div className="space-y-5 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                  Storefront Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F] font-serif text-lg font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                    Primary Currency Symbol
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                    Low Stock warning limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F] font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Database & System Status" icon={Database}>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#2F2F2F]/10 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#7A756B] font-semibold">Active Profile</span>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 font-semibold uppercase tracking-widest rounded-sm border border-amber-300">
                  Offline Mock Mode
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#2F2F2F]/10 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#7A756B] font-semibold">Server Host</span>
                <span className="text-xs font-mono text-[#2F2F2F]">http://localhost:5000/api</span>
              </div>
              <div className="p-3 bg-[#8B5E3C]/5 border-[0.5px] border-[#8B5E3C]/20 rounded-sm">
                <p className="text-[11px] leading-relaxed text-[#7A756B] font-sans">
                  <strong className="text-[#8B5E3C]">Developer Instruction:</strong> To switch to online PostgreSQL database mode, set <code className="bg-[#2F2F2F]/5 px-1 py-0.5 rounded font-mono text-xs">USE_SUPABASE=true</code> inside your backend server env parameters, register your migration schema, and restart your server environment.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Profile & Aesthetic Theme Settings */}
        <div className="space-y-8">
          <Card title="Admin Profile Details" icon={User}>
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                  Authenticated Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || 'admin@sshopping.com'}
                  disabled
                  className="bg-[#2F2F2F]/5 border border-[#2F2F2F]/10 p-3 text-sm rounded-sm text-[#7A756B] cursor-not-allowed font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                  Account Authorization level
                </label>
                <input
                  type="text"
                  value={user?.role || 'admin'}
                  disabled
                  className="bg-[#2F2F2F]/5 border border-[#2F2F2F]/10 p-3 text-sm rounded-sm text-[#7A756B] cursor-not-allowed uppercase tracking-wider font-semibold"
                />
              </div>
            </div>
          </Card>

          <Card title="Branding & Design Tokens" icon={Settings}>
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B]">
                  Aesthetic Theme Mode
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-transparent border border-[#2F2F2F]/20 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                >
                  <option value="vintage">Vintage Editorial (Cream / Charcoal)</option>
                  <option value="classic">Classic Monochrome (White / Pitch Black)</option>
                </select>
              </div>

              <div className="space-y-2 border-t border-[#2F2F2F]/10 pt-3">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#7A756B] block">
                  Active Font Pairing
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="border border-[#2F2F2F]/10 p-2 bg-white rounded-sm text-center">
                    <span className="text-[#7A756B] block text-[9px] uppercase tracking-widest">Headings</span>
                    <span className="font-serif font-bold text-[#2F2F2F] text-sm">Cormorant Garamond</span>
                  </div>
                  <div className="border border-[#2F2F2F]/10 p-2 bg-white rounded-sm text-center">
                    <span className="text-[#7A756B] block text-[9px] uppercase tracking-widest">Body & Labels</span>
                    <span className="font-sans text-[#2F2F2F] text-sm">Inter</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="px-8 py-3.5 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              <Save size={16} />
              <span>Save Configurations</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
