import React from 'react';

export const Card = ({ title, children, className = '', headerAction }) => {
  return (
    <div className={`bg-[#FAF8F3] border-editorial p-6 rounded-sm shadow-sm select-none ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center border-editorial-b pb-4 mb-6">
          {title && (
            <h3 className="font-serif font-bold text-lg text-[#2F2F2F] tracking-wide uppercase">
              {title}
            </h3>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
