import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full text-left border-collapse select-none">
        <thead>
          <tr className="border-editorial-b">
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 text-[10px] uppercase font-mono tracking-widest text-[#7A756B]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
