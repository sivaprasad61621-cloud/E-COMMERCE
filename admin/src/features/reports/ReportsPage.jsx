import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ShoppingBag, TrendingUp, IndianRupee, AlertTriangle } from 'lucide-react';

export const ReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch summary
        const sumResp = await fetch('http://localhost:5000/api/reports/summary');
        const sumData = await sumResp.json();
        setSummary(sumData);

        // Fetch chart data
        const chartResp = await fetch(`http://localhost:5000/api/reports/sales-chart?range=${range}`);
        const chartVals = await chartResp.json();
        setChartData(chartVals);

        // Fetch low stock items
        const stockResp = await fetch('http://localhost:5000/api/reports/low-stock');
        const stockVals = await stockResp.json();
        setLowStockList(stockVals);
      } catch (err) {
        console.error('Error loading reports details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  const stats = [
    { name: 'Products Cataloged', value: summary?.total_products || '0', icon: ShoppingBag, color: 'text-[#8B5E3C]' },
    { name: 'Orders Logged', value: summary?.total_orders || '0', icon: TrendingUp, color: 'text-[#2F2F2F]' },
    { name: 'Revenue Valuation', value: `₹${parseFloat(summary?.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: IndianRupee, color: 'text-[#8B5E3C]' },
    { name: 'Low Stock Alarms', value: summary?.low_stock_count || '0', icon: AlertTriangle, color: 'text-red-700 font-bold' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-editorial-b pb-6">
        <div>
          <h2 className="text-4xl font-serif tracking-wide mb-2">Analytical Ledger</h2>
          <p className="text-sm font-sans text-[#7A756B]">
            Aggregated valuation index mapping platform metrics, sales charts, and stock alerts.
          </p>
        </div>
        
        {/* Date Filter */}
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-[#FAF8F3] border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] cursor-pointer font-sans"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1y">Last 12 Months</option>
        </select>
      </div>

      {loading && chartData.length === 0 ? (
        <p className="text-sm italic text-[#7A756B]">Re-aggregating ledger indexes...</p>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="shadow-sm hover:shadow-vintage-flat transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <span className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                        {stat.name}
                      </span>
                      <p className="text-2xl font-serif text-[#2F2F2F] tracking-tight">{stat.value}</p>
                    </div>
                    <div className={`p-2 border-editorial rounded-sm bg-[#FAF8F3] ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Recharts Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend Area Chart */}
            <Card title="Revenue Growth Valuation" className="shadow-sm">
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(47, 47, 47, 0.1)" />
                    <XAxis dataKey="date" stroke="#7A756B" style={{ fontSize: '11px', fontFamily: 'Inter' }} />
                    <YAxis stroke="#7A756B" style={{ fontSize: '11px', fontFamily: 'Inter' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FAF8F3', 
                        border: '0.5px solid rgba(47, 47, 47, 0.2)', 
                        borderRadius: '2px',
                        fontFamily: 'Inter',
                        fontSize: '11px',
                        color: '#2F2F2F'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue (₹)"
                      stroke="#8B5E3C" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#chartGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Order Vol Bar Chart */}
            <Card title="Order Density Ledger" className="shadow-sm">
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(47, 47, 47, 0.1)" />
                    <XAxis dataKey="date" stroke="#7A756B" style={{ fontSize: '11px', fontFamily: 'Inter' }} />
                    <YAxis stroke="#7A756B" style={{ fontSize: '11px', fontFamily: 'Inter' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FAF8F3', 
                        border: '0.5px solid rgba(47, 47, 47, 0.2)', 
                        borderRadius: '2px',
                        fontFamily: 'Inter',
                        fontSize: '11px',
                        color: '#2F2F2F'
                      }} 
                    />
                    <Bar 
                      dataKey="orders" 
                      name="Orders Placed"
                      fill="#2F2F2F" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Low Stock Alerts table list */}
          <Card title="Inventory Depletion Alert Ledger" className="shadow-sm">
            {lowStockList.length === 0 ? (
              <p className="text-xs italic text-green-800">All inventory items are currently fully allocated.</p>
            ) : (
              <div className="mt-4">
                <Table headers={['Asset', 'SKU ID', 'Product Ledger Name', 'Classification', 'Price (₹)', 'Remaining Stock']}>
                  {lowStockList.map((product) => (
                    <tr key={product.id} className="hover:bg-[#2F2F2F]/5 transition-colors">
                      <td className="py-3">
                        <div className="w-10 h-10 border-editorial rounded-sm overflow-hidden bg-white">
                          {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-xs font-semibold text-[#7A756B]">{product.sku}</td>
                      <td className="py-3 font-serif font-medium text-base">{product.name}</td>
                      <td className="py-3 text-sm text-[#2F2F2F]">
                        {product.category?.name || <span className="italic text-[#7A756B]">Unclassified</span>}
                      </td>
                      <td className="py-3 text-sm">₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 text-sm text-red-700 font-bold flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-red-700" /> {product.stock} units
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
