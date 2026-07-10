import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { 
  TrendingUp, 
  ShoppingBag, 
  IndianRupee, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  // States for live data
  const [summary, setSummary] = useState({
    total_products: 248,
    total_orders: 1420,
    revenue: 184500.50,
    low_stock_count: 8
  });
  const [salesData, setSalesData] = useState([
    { date: 'Mon', revenue: 2400 },
    { date: 'Tue', revenue: 1398 },
    { date: 'Wed', revenue: 9800 },
    { date: 'Thu', revenue: 3908 },
    { date: 'Fri', revenue: 4800 },
    { date: 'Sat', revenue: 3800 },
    { date: 'Sun', revenue: 4300 },
  ]);
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-0921', customerName: 'Arthur Pendragon', date: '29 Jun 2026', total: '₹420.00' },
    { id: 'ORD-0920', customerName: 'Guinevere de Bois', date: '28 Jun 2026', total: '₹189.00' },
    { id: 'ORD-0919', customerName: 'Lancelot du Lac', date: '28 Jun 2026', total: '₹1,240.00' },
    { id: 'ORD-0918', customerName: 'Merlin Ambrosius', date: '27 Jun 2026', total: '₹85.00' },
    { id: 'ORD-0917', customerName: 'Morgan le Fay', date: '26 Jun 2026', total: '₹310.00' },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Summary Stats
        const summaryRes = await fetch(`${API}/reports/summary`);
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }

        // 2. Fetch Sales Chart Data
        const chartRes = await fetch(`${API}/reports/sales-chart?range=7d`);
        if (chartRes.ok) {
          const chartData = await chartRes.json();
          if (chartData && chartData.length > 0) {
            // Map keys date/revenue to fit AreaChart
            const formatted = chartData.map(item => ({
              date: item.date || item.day,
              revenue: parseFloat(item.revenue || item.sales || 0)
            }));
            setSalesData(formatted);
          }
        }

        // 3. Fetch Recent Orders
        const ordersRes = await fetch(`${API}/orders?limit=5`);
        if (ordersRes.ok) {
          const resObj = await ordersRes.json();
          const ordersList = resObj.data || [];
          if (ordersList.length > 0) {
            const formattedOrders = ordersList.map(order => ({
              id: order.id,
              customerName: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Walk-in Customer',
              date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
              total: `₹${parseFloat(order.total_amount).toLocaleString('en-IN')}`
            }));
            setRecentOrders(formattedOrders);
          }
        }
      } catch (err) {
        console.warn('Backend API reporting offline, using fallbacks.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'Total Products', value: summary.total_products.toString(), icon: ShoppingBag, color: 'text-[#8B5E3C]' },
    { name: 'Total Orders', value: summary.total_orders.toString(), icon: TrendingUp, color: 'text-[#2F2F2F]' },
    { name: 'Revenue Generated', value: `₹${summary.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: IndianRupee, color: 'text-[#8B5E3C]' },
    { name: 'Low Stock Warnings', value: summary.low_stock_count.toString(), icon: AlertTriangle, color: 'text-red-700' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Welcome banner */}
      <div className="border-editorial-b pb-6">
        <h2 className="text-4xl font-serif text-[#2F2F2F] tracking-wide mb-2">Chronicle & Insights</h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Welcome back, <span className="font-medium text-[#2F2F2F]">{user?.email || 'Administrator'}</span>. Here is the operational catalog for Velora.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="hover:shadow-vintage-flat transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                    {stat.name}
                  </span>
                  <p className="text-3xl font-serif text-[#2F2F2F] tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-2 border-editorial rounded-sm bg-[#FAF8F3] ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Graphs and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card title="Sales Curve (Weekly Overview)" className="lg:col-span-2 shadow-sm">
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47, 47, 47, 0.1)" />
                <XAxis dataKey="date" stroke="#7A756B" style={{ fontSize: '12px', fontFamily: 'Inter' }} />
                <YAxis stroke="#7A756B" style={{ fontSize: '12px', fontFamily: 'Inter' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FAF8F3', 
                    border: '0.5px solid rgba(47, 47, 47, 0.2)', 
                    borderRadius: '2px',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    color: '#2F2F2F'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5E3C" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#salesGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Orders List */}
        <Card title="Recent Ledger Entries" className="shadow-sm">
          <div className="mt-4">
            <Table headers={['Order ID', 'Customer', 'LTV']}>
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#2F2F2F]/5 transition-colors">
                  <td className="py-3 text-xs font-mono font-medium text-[#2F2F2F]">{order.id.slice(0, 8)}...</td>
                  <td className="py-3 text-sm text-[#2F2F2F] text-left">{order.customerName}</td>
                  <td className="py-3 text-sm font-medium text-[#8B5E3C]">{order.total}</td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
