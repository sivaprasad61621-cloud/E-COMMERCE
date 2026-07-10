import supabase from '../config/supabase.js';
import { mockProducts } from './products.js';
import { mockOrders } from './orders.js';

export const getSummary = async (req, res) => {
  if (!supabase) {
    // Mock Mode
    const totalProducts = mockProducts.length;
    const totalOrders = mockOrders.length;
    const revenue = mockOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
    const lowStockCount = mockProducts.filter(p => p.stock < 10).length;

    return res.json({
      total_products: totalProducts,
      total_orders: totalOrders,
      revenue: parseFloat(revenue.toFixed(2)),
      low_stock_count: lowStockCount
    });
  }

  try {
    // Online Supabase Mode
    const { count: productsCount, error: prodErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: ordersCount, data: orders, error: ordErr } = await supabase
      .from('orders')
      .select('total_amount');

    const { count: lowStockCount, error: stockErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock', 10);

    if (prodErr || ordErr || stockErr) {
      return res.status(400).json({ error: 'Database aggregation error' });
    }

    const revenue = orders ? orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) : 0;

    return res.json({
      total_products: productsCount || 0,
      total_orders: ordersCount || 0,
      revenue: parseFloat(revenue.toFixed(2)),
      low_stock_count: lowStockCount || 0
    });
  } catch (err) {
    console.error('Error fetching reports summary:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getSalesChart = async (req, res) => {
  const { range = '7d' } = req.query;

  if (!supabase) {
    // Mock Mode: return preloaded dates corresponding to the active mockOrders
    // In production, we'd dynamically aggregate by date ranges (7d, 30d, 12m)
    let chartData = [];
    if (range === '7d') {
      chartData = [
        { date: 'June 23', revenue: 450.00, orders: 2 },
        { date: 'June 24', revenue: 980.50, orders: 4 },
        { date: 'June 25', revenue: 120.00, orders: 1 },
        { date: 'June 26', revenue: 310.00, orders: 1 },
        { date: 'June 27', revenue: 85.00,  orders: 1 },
        { date: 'June 28', revenue: 1429.00, orders: 2 },
        { date: 'June 29', revenue: 420.00, orders: 1 }
      ];
    } else if (range === '30d') {
      chartData = [
        { date: 'Week 1', revenue: 2400.00, orders: 12 },
        { date: 'Week 2', revenue: 4100.50, orders: 21 },
        { date: 'Week 3', revenue: 3800.00, orders: 19 },
        { date: 'Week 4', revenue: 6814.50, orders: 32 }
      ];
    } else {
      chartData = [
        { date: 'Jan', revenue: 14500.00, orders: 85 },
        { date: 'Feb', revenue: 18900.00, orders: 110 },
        { date: 'Mar', revenue: 21000.00, orders: 125 },
        { date: 'Apr', revenue: 27500.00, orders: 154 },
        { date: 'May', revenue: 35600.00, orders: 195 },
        { date: 'Jun', revenue: 42000.50, orders: 240 }
      ];
    }
    return res.json(chartData);
  }

  try {
    // Online Supabase Mode: query and aggregate orders grouped by dates
    // For simplicity of execution, we can query orders created in the last N days
    let daysLimit = 7;
    if (range === '30d') daysLimit = 30;
    if (range === '1y') daysLimit = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysLimit);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    // Group in JS
    const grouped = {};
    orders.forEach(o => {
      const dateStr = new Date(o.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
      }
      grouped[dateStr].revenue += parseFloat(o.total_amount);
      grouped[dateStr].orders += 1;
    });

    const chartData = Object.values(grouped);
    return res.json(chartData);
  } catch (err) {
    console.error('Error fetching sales chart analytics:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getLowStock = async (req, res) => {
  if (!supabase) {
    // Mock Mode
    const lowStock = mockProducts.filter(p => p.stock < 10);
    return res.json(lowStock);
  }

  try {
    // Online Mode
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .lt('stock', 10)
      .order('stock', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error('Error fetching low stock report:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
