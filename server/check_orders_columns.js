import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error selecting:', error);
  } else {
    console.log('Order columns:', data.length > 0 ? Object.keys(data[0]) : 'No orders found');
  }
}
check();
