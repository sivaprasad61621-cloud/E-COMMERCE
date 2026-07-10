import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-semibold border-editorial transition-all duration-200 focus:outline-none flex items-center justify-center rounded-sm';
  const variants = {
    primary: 'bg-[#2F2F2F] text-white hover:bg-transparent hover:text-[#2F2F2F] border-transparent hover:border-[#2F2F2F]',
    secondary: 'bg-transparent text-[#2F2F2F] hover:bg-[#2F2F2F] hover:text-white border-[#2F2F2F]/40 hover:border-transparent',
    danger: 'bg-red-700 text-white hover:bg-transparent hover:text-red-700 border-transparent hover:border-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
