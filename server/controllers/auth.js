import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';
import { mockCustomers } from './orders.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_key_12345';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // 1. Master developer credentials bypass (for easy local review / testing)
  if (email === 'admin@sshopping.com' && password === 'password123') {
    const user = {
      id: 'mock-admin-uuid-1111-2222',
      email: email,
      role: 'admin',
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  }

  if (email === 'customer@sshopping.com' && password === 'password123') {
    const user = {
      id: 'mock-customer-uuid-3333-4444',
      email: email,
      role: 'customer',
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  }

  // 2. If Supabase is not configured, deny other credentials
  if (!supabase) {
    return res.status(401).json({ error: 'Invalid credentials. (Supabase offline. Use admin@sshopping.com or customer@sshopping.com / password123)' });
  }

  // 2. Online Mode: Try Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get user profile details from public.users profile table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const userRole = profile?.role || 'admin';

    const user = {
      id: data.user.id,
      email: data.user.email,
      role: userRole,
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Server error during authentication' });
  }
};

export const oauthLogin = async (req, res) => {
  const { email, fullName, provider } = req.body;

  if (!email || !fullName || !provider) {
    return res.status(400).json({ error: 'Email, fullName, and provider are required' });
  }

  const nameParts = fullName.split(' ');
  const first_name = nameParts[0] || 'Social';
  const last_name = nameParts.slice(1).join(' ') || 'User';

  if (!supabase) {
    // Mock Mode
    let customer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!customer) {
      customer = {
        id: `cust-oauth-${Date.now()}`,
        first_name,
        last_name,
        email,
        phone: '',
        address_line1: '123 Social Way',
        address_line2: '',
        city: 'WebCity',
        state: 'Global',
        postal_code: '00000',
        country: 'Online',
        created_at: new Date().toISOString()
      };
      mockCustomers.push(customer);
    }

    const user = {
      id: customer.id,
      email: customer.email,
      role: 'customer',
      fullName: `${customer.first_name} ${customer.last_name}`
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  }

  try {
    // Supabase Mode
    // 1. Check if customer exists
    let { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    // 2. Create customer if not exists
    if (!customer) {
      const { data: newCust, error: insertError } = await supabase
        .from('customers')
        .insert({
          first_name,
          last_name,
          email,
          phone: '',
          address_line1: '123 Social Way',
          address_line2: '',
          city: 'WebCity',
          state: 'Global',
          postal_code: '00000',
          country: 'Online'
        })
        .select()
        .single();

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }
      customer = newCust;
    }

    const user = {
      id: customer.id,
      email: customer.email,
      role: 'customer',
      fullName: `${customer.first_name} ${customer.last_name}`
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Error during social authentication:', err);
    return res.status(500).json({ error: 'Server error during social authentication' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and fullName are required' });
    }

    // 1. If Supabase is offline (mock fallback)
    if (!supabase) {
      let customer = mockCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (customer) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }

      const nameParts = fullName.split(' ');
      const first_name = nameParts[0] || 'Registered';
      const last_name = nameParts.slice(1).join(' ') || 'User';

      customer = {
        id: `cust-reg-${Date.now()}`,
        first_name,
        last_name,
        email,
        phone: '',
        address_line1: '123 Social Way',
        address_line2: '',
        city: 'WebCity',
        state: 'Global',
        postal_code: '00000',
        country: 'Online',
        created_at: new Date().toISOString()
      };
      mockCustomers.push(customer);

      const user = {
        id: customer.id,
        email: customer.email,
        role: 'customer',
        fullName: `${customer.first_name} ${customer.last_name}`
      };

      const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ 
        message: 'Registration successful! (Offline Mock Mode)', 
        token, 
        user 
      });
    }

    // 2. Supabase Online Mode: Try Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Note: If email confirmation is enabled, session will be null and the user status
    // is unconfirmed. In this case, we advise them to check their email.
    // If confirmation is disabled, session will be populated.
    const isConfirmed = data.session !== null;

    // Create profile in customers table too
    const nameParts = fullName.split(' ');
    const first_name = nameParts[0] || 'Registered';
    const last_name = nameParts.slice(1).join(' ') || 'User';

    const { error: profileError } = await supabase
      .from('customers')
      .insert({
        id: data.user.id,
        first_name,
        last_name,
        email,
        phone: '',
        address_line1: '123 Social Way',
        address_line2: '',
        city: 'WebCity',
        state: 'Global',
        postal_code: '00000',
        country: 'Online'
      });

    if (profileError) {
      console.error('Error creating customer profile:', profileError);
    }

    if (!isConfirmed) {
      return res.json({
        message: 'A verification link has been sent to your email. Please confirm it before logging in.',
        requiresConfirmation: true
      });
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      role: 'customer',
      fullName
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: err.message || 'Server error during registration' });
  }
};
