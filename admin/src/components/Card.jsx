import React from 'react';

export const Card = ({ children, className = '', title, headerAction }) => {
  return (
    <div className={`bg-[#FAF8F3] border-editorial p-6 rounded-sm ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center pb-4 mb-4 border-editorial-b">
          {title && <h3 className="text-xl font-serif text-[#2F2F2F] tracking-wide">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
