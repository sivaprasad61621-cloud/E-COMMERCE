import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false 
}) => {
  const baseStyles = 'px-4 py-2 text-sm font-sans tracking-wider uppercase transition-all duration-300 rounded-sm font-medium focus:outline-none';
  
  const variants = {
    primary: 'bg-[#2F2F2F] text-[#FAF8F3] hover:bg-[#8B5E3C] border border-[#2F2F2F]',
    secondary: 'bg-transparent text-[#2F2F2F] border border-[#2F2F2F] hover:bg-[#2F2F2F] hover:text-[#FAF8F3]',
    accent: 'bg-[#8B5E3C] text-[#FAF8F3] hover:bg-[#2F2F2F] border border-[#8B5E3C]',
    text: 'bg-transparent text-[#2F2F2F] hover:underline px-0 py-1'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
