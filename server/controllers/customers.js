import supabase from '../config/supabase.js';
import { mockCustomers, mockOrders } from './orders.js';

export const getCustomers = async (req, res) => {
  if (!supabase) {
    // Mock Mode: calculate LTV and order count from in-memory arrays
    const populated = mockCustomers.map(cust => {
      const customerOrders = mockOrders.filter(o => o.customer_id === cust.id);
      const ltv = customerOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      return {
        ...cust,
        order_count: customerOrders.length,
        ltv: parseFloat(ltv.toFixed(2))
      };
    });
    return res.json(populated);
  }

  try {
    // Online Supabase Mode
    // We can query customers and aggregate LTV using SQL / JS mapping
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*, orders(total_amount)');

    if (error) return res.status(400).json({ error: error.message });

    const populated = customers.map(cust => {
      const orderCount = cust.orders ? cust.orders.length : 0;
      const ltv = cust.orders ? cust.orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) : 0;
      return {
        id: cust.id,
        first_name: cust.first_name,
        last_name: cust.last_name,
        email: cust.email,
        phone: cust.phone,
        city: cust.city,
        country: cust.country,
        created_at: cust.created_at,
        order_count: orderCount,
        ltv: parseFloat(ltv.toFixed(2))
      };
    });

    return res.json(populated);
  } catch (err) {
    console.error('Error fetching customers:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    // Mock Mode
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });

    const customerOrders = mockOrders.filter(o => o.customer_id === id);
    return res.json({
      ...customer,
      orders: customerOrders
    });
  }

  try {
    // Online Supabase Mode
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (custError) return res.status(400).json({ error: custError.message });

    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    return res.json({
      ...customer,
      orders: orders || []
    });
  } catch (err) {
    console.error('Error fetching customer profile:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
