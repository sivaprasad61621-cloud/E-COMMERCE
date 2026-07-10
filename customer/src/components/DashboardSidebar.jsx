import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Truck, Headphones, ShoppingBag, ChevronRight, User } from 'lucide-react';

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'My Wishlist', path: '/wishlist', icon: Heart },
    { label: 'Track Order', path: '/track', icon: Truck },
    { label: 'Help & Support', path: '/help', icon: Headphones },
    { label: 'Browse Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <div className="w-[240px] shrink-0 bg-[#FAF8F3] border border-[#2F2F2F]/15 flex flex-col justify-between p-2 rounded-sm select-none">
      <div className="divide-y divide-[#2F2F2F]/10">
        {/* Header decoration */}
        <div className="px-3 py-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C]">
              <User size={15} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2F2F2F]">Customer Space</h4>
              <p className="text-[9px] uppercase tracking-wider text-[#7A756B] mt-0.5">Manage your account</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="pt-2 pb-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = location.pathname === item.path;
            return (
              <div
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center justify-between px-3 py-2.5 text-xs cursor-pointer transition-all duration-200 rounded-sm ${
                  isSelected
                    ? 'bg-[#8B5E3C]/10 text-[#8B5E3C] font-bold'
                    : 'text-[#2F2F2F] hover:text-[#8B5E3C] hover:bg-[#2F2F2F]/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} className={isSelected ? 'text-[#8B5E3C]' : 'text-[#7A756B] group-hover:text-[#8B5E3C]'} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                <ChevronRight size={12} className={isSelected ? 'text-[#8B5E3C]' : 'text-[#2F2F2F]/30'} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer message / info */}
      <div className="border-t border-[#2F2F2F]/15 p-3 text-left">
        <p className="text-[9px] uppercase tracking-widest text-[#7A756B] leading-normal font-bold">
          Velora Editorial Store
        </p>
        <p className="text-[8px] text-[#7A756B]/60 mt-0.5 leading-relaxed">
          Premium vintage quality & timely delivery.
        </p>
      </div>
    </div>
  );
};

export default DashboardSidebar;
