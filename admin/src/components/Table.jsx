import React from 'react';

export const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-editorial-b">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="pb-3 text-xs font-sans font-semibold uppercase tracking-widest text-[#7A756B] py-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2F2F2F]/10">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
