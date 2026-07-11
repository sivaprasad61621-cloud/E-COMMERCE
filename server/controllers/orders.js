import supabase from '../config/supabase.js';
import { mockProducts } from './products.js';
import { sendOrderStatusEmail } from '../services/emailService.js';

// Preloaded mock customers state
export let mockCustomers = [
  { id: 'cust-1', first_name: 'Arthur', last_name: 'Pendragon', email: 'arthur@camelot.gov', phone: '+12345678', address_line1: '1 King Way', address_line2: 'Royal Wing', city: 'Camelot', state: 'Wales', postal_code: 'CM1 1AA', country: 'United Kingdom', created_at: '2026-05-12T10:00:00Z' },
  { id: 'cust-2', first_name: 'Guinevere', last_name: 'de Bois', email: 'guinevere@camelot.gov', phone: '+12345679', address_line1: '2 Castle Road', address_line2: '', city: 'Camelot', state: 'Wales', postal_code: 'CM1 2BB', country: 'United Kingdom', created_at: '2026-05-24T12:00:00Z' },
  { id: 'cust-3', first_name: 'Lancelot', last_name: 'du Lac', email: 'lancelot@lake.org', phone: '+12345680', address_line1: 'Lake Tower Apt 4', address_line2: '', city: 'Waterford', state: 'Munster', postal_code: 'WT5 5XY', country: 'Ireland', created_at: '2026-06-01T09:30:00Z' },
  { id: 'cust-4', first_name: 'Merlin', last_name: 'Ambrosius', email: 'merlin@magic.net', phone: '+12345681', address_line1: 'Old Oak Cave', address_line2: 'Underwood Section', city: 'Carmarthen', state: 'Wales', postal_code: 'SA31 1AA', country: 'United Kingdom', created_at: '2026-06-15T15:45:00Z' },
  { id: 'cust-5', first_name: 'Morgan', last_name: 'le Fay', email: 'morgan@avalon.edu', phone: '+12345682', address_line1: '9 Misty Cliff', address_line2: '', city: 'Avalon', state: 'Cornwall', postal_code: 'TR11 1AA', country: 'United Kingdom', created_at: '2026-06-20T11:15:00Z' },
];

// Preloaded mock orders state
export let mockOrders = [
  { id: 'ORD-0921', customer_id: 'cust-1', status: 'pending', total_amount: 420.00, tax_amount: 20.00, shipping_amount: 15.00, tracking_number: null, created_at: '2026-06-29T10:15:30Z', updated_at: '2026-06-29T10:15:30Z' },
  { id: 'ORD-0920', customer_id: 'cust-2', status: 'delivered', total_amount: 189.00, tax_amount: 9.00, shipping_amount: 10.00, tracking_number: 'TRK-9876543', created_at: '2026-06-28T14:22:15Z', updated_at: '2026-06-28T18:45:00Z' },
  { id: 'ORD-0919', customer_id: 'cust-3', status: 'shipped', total_amount: 1240.00, tax_amount: 60.00, shipping_amount: 30.00, tracking_number: 'TRK-5566778', created_at: '2026-06-28T09:12:00Z', updated_at: '2026-06-28T15:30:10Z' },
  { id: 'ORD-0918', customer_id: 'cust-4', status: 'packed', total_amount: 85.00, tax_amount: 5.00, shipping_amount: 5.00, tracking_number: null, created_at: '2026-06-27T16:40:00Z', updated_at: '2026-06-27T18:20:00Z' },
  { id: 'ORD-0917', customer_id: 'cust-5', status: 'cancelled', total_amount: 310.00, tax_amount: 15.00, shipping_amount: 15.00, tracking_number: null, created_at: '2026-06-26T11:05:00Z', updated_at: '2026-06-26T14:10:00Z' },
];

// Preloaded mock order items state
export let mockOrderItems = [
  { id: 'item-1', order_id: 'ORD-0921', product_id: 'prod-2', quantity: 1, unit_price: 240.00, discount_amount: 0.00, total_price: 240.00 },
  { id: 'item-2', order_id: 'ORD-0921', product_id: 'prod-1', quantity: 1, unit_price: 189.00, discount_amount: 18.90, total_price: 170.10 },
  { id: 'item-3', order_id: 'ORD-0920', product_id: 'prod-1', quantity: 1, unit_price: 189.00, discount_amount: 18.90, total_price: 170.10 },
  { id: 'item-4', order_id: 'ORD-0919', product_id: 'prod-2', quantity: 5, unit_price: 240.00, discount_amount: 0.00, total_price: 1200.00 },
  { id: 'item-5', order_id: 'ORD-0918', product_id: 'prod-3', quantity: 1, unit_price: 165.00, discount_amount: 24.75, total_price: 140.25 },
];

export const getOrders = async (req, res) => {
  const { status, email, page = 1, limit = 10 } = req.query;

  if (!supabase) {
    // Mock Mode
    let results = [...mockOrders];

    if (status) {
      results = results.filter(o => o.status === status);
    }

    // Join customer info
    let populated = results.map(o => {
      const customer = mockCustomers.find(c => c.id === o.customer_id);
      return {
        ...o,
        customer: customer ? { first_name: customer.first_name, last_name: customer.last_name, email: customer.email } : null
      };
    });

    if (email) {
      populated = populated.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
    }

    // Pagination
    const startIdx = (parseInt(page) - 1) * parseInt(limit);
    const endIdx = startIdx + parseInt(limit);
    const paginatedData = populated.slice(startIdx, endIdx);

    return res.json({
      data: paginatedData,
      pagination: {
        total: populated.length,
        page: parseInt(page),
        pages: Math.ceil(populated.length / parseInt(limit))
      }
    });
  }

  try {
    // Online Supabase Mode
    if (email) {
      // 1. Fetch customer by email first
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (customerError) return res.status(400).json({ error: customerError.message });
      if (!customerData) {
        return res.json({
          data: [],
          pagination: { total: 0, page: parseInt(page), pages: 1 }
        });
      }

      // 2. Query orders with customer_id
      let query = supabase
        .from('orders')
        .select('*, customer:customers(first_name, last_name, email)', { count: 'exact' })
        .eq('customer_id', customerData.id);

      if (status) {
        query = query.eq('status', status);
      }

      const from = (parseInt(page) - 1) * parseInt(limit);
      const to = from + parseInt(limit) - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) return res.status(400).json({ error: error.message });

      return res.json({
        data,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit))
        }
      });
    } else {
      // Fetch all orders if email is not specified
      let query = supabase
        .from('orders')
        .select('*, customer:customers(first_name, last_name, email)', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const from = (parseInt(page) - 1) * parseInt(limit);
      const to = from + parseInt(limit) - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) return res.status(400).json({ error: error.message });

      return res.json({
        data,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit))
        }
      });
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    // Mock Mode
    const order = mockOrders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const customer = mockCustomers.find(c => c.id === order.customer_id);
    const items = mockOrderItems.filter(i => i.order_id === order.id).map(item => {
      const product = mockProducts.find(p => p.id === item.product_id);
      return {
        ...item,
        product: product ? { id: product.id, name: product.name, sku: product.sku, images: product.images } : null
      };
    });

    return res.json({
      ...order,
      customer,
      order_items: items
    });
  }

  try {
    // Online Supabase Mode
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*), order_items(*, product:products(id, name, sku, images))')
      .eq('id', id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error('Error fetching order details:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, tracking_number, cancellation_reason } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  if (!['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status workflow code.' });
  }

  // Statuses that trigger customer email notifications
  const EMAIL_TRIGGER_STATUSES = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

  if (!supabase) {
    // Mock Mode
    const ordIdx = mockOrders.findIndex(o => o.id === id);
    if (ordIdx === -1) return res.status(404).json({ error: 'Order not found.' });

    mockOrders[ordIdx] = {
      ...mockOrders[ordIdx],
      status,
      tracking_number: tracking_number !== undefined ? tracking_number : mockOrders[ordIdx].tracking_number,
      cancellation_reason: cancellation_reason !== undefined ? cancellation_reason : mockOrders[ordIdx].cancellation_reason,
      updated_at: new Date().toISOString()
    };

    // Send email in mock mode using stored customer info
    if (EMAIL_TRIGGER_STATUSES.includes(status)) {
      const order = mockOrders[ordIdx];
      const customer = mockCustomers.find(c => c.id === order.customer_id);
      if (customer) {
        sendOrderStatusEmail({
          orderId: order.id,
          customerEmail: customer.email,
          customerName: `${customer.first_name} ${customer.last_name}`,
          status,
          trackingNumber: order.tracking_number,
          totalAmount: order.total_amount,
        }).catch(err => console.error('[Email] Background send error:', err.message));
      }
    }

    return res.json(mockOrders[ordIdx]);
  }

  try {
    // Online Supabase Mode
    const updateData = { status, updated_at: new Date().toISOString() };
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number;
    if (cancellation_reason !== undefined) updateData.cancellation_reason = cancellation_reason;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select('*, customer:customers(first_name, last_name, email), order_items(product_name, quantity, unit_price, total_price)')
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Fire email notification for meaningful status changes
    if (EMAIL_TRIGGER_STATUSES.includes(status) && data.customer?.email) {
      const customer = data.customer;
      sendOrderStatusEmail({
        orderId: data.id,
        customerEmail: customer.email,
        customerName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email,
        status,
        trackingNumber: data.tracking_number || null,
        items: data.order_items || [],
        totalAmount: data.total_amount,
      }).catch(err => console.error('[Email] Background send error:', err.message));
    }

    return res.json(data);
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createOrder = async (req, res) => {
  const { customer, items, shipping_amount = 0, tax_amount = 0 } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer information and order items are required.' });
  }

  // Validate customer keys
  const { first_name, last_name, email, address_line1, city, state, postal_code } = customer;
  if (!first_name || !last_name || !email || !address_line1 || !city || !state || !postal_code) {
    return res.status(400).json({ error: 'Missing required customer address details.' });
  }

  if (!supabase) {
    // Mock Mode
    // 1. Find or create customer
    let existingCust = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!existingCust) {
      existingCust = {
        id: `cust-${mockCustomers.length + 1}`,
        first_name,
        last_name,
        email,
        phone: customer.phone || '',
        address_line1,
        address_line2: customer.address_line2 || '',
        city,
        state,
        postal_code,
        country: customer.country || 'United States',
        created_at: new Date().toISOString()
      };
      mockCustomers.push(existingCust);
    }

    // 2. Calculate totals
    let itemsTotal = 0;
    const itemsToSave = items.map((item, idx) => {
      const unitPrice = parseFloat(item.unit_price || 0);
      const discountAmount = parseFloat(item.discount_amount || 0);
      const qty = parseInt(item.quantity || 1);
      const totalPrice = (unitPrice - discountAmount) * qty;
      itemsTotal += totalPrice;

      return {
        id: `item-${mockOrderItems.length + idx + 1}`,
        product_id: item.product_id,
        quantity: qty,
        unit_price: unitPrice,
        discount_amount: discountAmount,
        total_price: totalPrice
      };
    });

    const totalAmount = itemsTotal + parseFloat(shipping_amount) + parseFloat(tax_amount);
    
    // 3. Create Order record
    const nextOrderIdNum = mockOrders.length > 0 
      ? parseInt(mockOrders[mockOrders.length - 1].id.split('-')[1]) + 1 
      : 922;

    const newOrder = {
      id: `ORD-0${nextOrderIdNum}`,
      customer_id: existingCust.id,
      status: 'pending',
      total_amount: parseFloat(totalAmount.toFixed(2)),
      tax_amount: parseFloat(parseFloat(tax_amount).toFixed(2)),
      shipping_amount: parseFloat(parseFloat(shipping_amount).toFixed(2)),
      tracking_number: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockOrders.push(newOrder);

    // Save items
    itemsToSave.forEach(it => {
      it.order_id = newOrder.id;
      mockOrderItems.push(it);
    });

    // Send order placement email (mock mode)
    sendOrderStatusEmail({
      orderId: newOrder.id,
      customerEmail: existingCust.email,
      customerName: `${existingCust.first_name} ${existingCust.last_name}`,
      status: 'pending',
      items: itemsToSave,
      totalAmount: newOrder.total_amount,
    }).catch(err => console.error('[Email] Background send error:', err.message));

    return res.status(201).json({
      ...newOrder,
      customer: existingCust,
      order_items: itemsToSave
    });
  }

  try {
    // Online Supabase Mode
    // 1. Find or create customer
    const { data: custSearch, error: custSearchErr } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (custSearchErr) return res.status(400).json({ error: custSearchErr.message });

    let dbCustomer = custSearch;
    if (!dbCustomer) {
      // Use actual Supabase schema columns for customers table
      const shippingAddress = [address_line1, city, state, postal_code, customer.country || 'India'].filter(Boolean).join(', ');
      const { data: newCust, error: createCustErr } = await supabase
        .from('customers')
        .insert({
          first_name,
          last_name,
          email,
          phone: customer.phone || null,
          shipping_address: shippingAddress || null
        })
        .select()
        .single();

      if (createCustErr) {
        console.warn('Customer insert failed:', createCustErr.message);
        // Try absolutely minimal insert
        const { data: minCust, error: minCustErr } = await supabase
          .from('customers')
          .insert({ first_name, last_name, email })
          .select()
          .single();
        if (minCustErr) return res.status(400).json({ error: `Could not create customer: ${minCustErr.message}` });
        dbCustomer = minCust;
      } else {
        dbCustomer = newCust;
      }
    }

    // 2. Calculate items price & check inventory/stock
    let itemsTotal = 0;
    for (const item of items) {
      const unitPrice = parseFloat(item.unit_price || 0);
      const discountAmount = parseFloat(item.discount_amount || 0);
      const qty = parseInt(item.quantity || 1);
      itemsTotal += (unitPrice - discountAmount) * qty;

      // Update product stock on Supabase
      const { data: prodData } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (prodData && prodData.stock >= qty) {
        await supabase
          .from('products')
          .update({ stock: prodData.stock - qty })
          .eq('id', item.product_id);
      }
    }

    const totalAmount = itemsTotal + parseFloat(shipping_amount) + parseFloat(tax_amount);

    // 3. Create order using actual Supabase schema column names
    let newOrder;
    const subtotalAmount = parseFloat(itemsTotal.toFixed(2));
    const taxAmt = parseFloat(parseFloat(tax_amount).toFixed(2));
    const shippingAmt = parseFloat(parseFloat(shipping_amount).toFixed(2));
    const totalAmount2 = parseFloat((subtotalAmount + taxAmt + shippingAmt).toFixed(2));

    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: dbCustomer.id,
        status: 'pending',
        subtotal: subtotalAmount,
        tax: taxAmt,
        shipping_fee: shippingAmt,
        total_amount: totalAmount2
      })
      .select()
      .single();

    if (orderErr) {
      console.warn('Order insert failed:', orderErr.message);
      // Fallback: try with only required columns
      const { data: bareOrder, error: bareErr } = await supabase
        .from('orders')
        .insert({ customer_id: dbCustomer.id, status: 'pending', subtotal: subtotalAmount, total_amount: totalAmount2 })
        .select()
        .single();
      if (bareErr) return res.status(400).json({ error: bareErr.message });
      newOrder = bareOrder;
    } else {
      newOrder = orderData;
    }

    // 4. Create order items with actual Supabase schema columns
    // Real schema has: order_id, product_id (UUID), product_name, quantity, unit_price
    const dbOrderItems = items.map(item => {
      const unitPrice = parseFloat(item.unit_price || 0);
      const discountAmt = parseFloat(item.discount_amount || 0);
      const qty = parseInt(item.quantity || 1);
      // product_id must be valid UUID — if it's a mock ID like "prod-2", set to null
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validProductId = uuidRegex.test(item.product_id) ? item.product_id : null;
      return {
        order_id: newOrder.id,
        product_id: validProductId,
        product_name: item.product_name || item.name || `Product ${item.product_id}`,
        quantity: qty,
        unit_price: unitPrice,
        discount_amount: discountAmt,
        total_price: (unitPrice - discountAmt) * qty
      };
    });

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(dbOrderItems);

    if (itemsErr) {
      // Fallback: try minimal insert with only confirmed columns
      console.warn('Full order_items insert failed, trying minimal:', itemsErr.message);
      const minItems = dbOrderItems.map(item => ({
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));
      const { error: minItemsErr } = await supabase.from('order_items').insert(minItems);
      if (minItemsErr) {
        console.warn('Minimal order_items insert also failed:', minItemsErr.message);
        // Last resort: just log, order still succeeds
      }
    }

    // Send order placement confirmation email
    sendOrderStatusEmail({
      orderId: newOrder.id,
      customerEmail: dbCustomer.email,
      customerName: `${dbCustomer.first_name || ''} ${dbCustomer.last_name || ''}`.trim() || dbCustomer.email,
      status: 'pending',
      items: dbOrderItems,
      totalAmount: newOrder.total_amount,
    }).catch(err => console.error('[Email] Background send error:', err.message));

    return res.status(201).json({
      ...newOrder,
      customer: dbCustomer,
      order_items: dbOrderItems
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
