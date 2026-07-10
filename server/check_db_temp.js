import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  try {
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('*');
      
    console.log('Products Count:', products ? products.length : 0);
    console.log('Products details:', JSON.stringify(products, null, 2));
    
    const { data: categories, error: cErr } = await supabase
      .from('categories')
      .select('*');
      
    console.log('Categories Count:', categories ? categories.length : 0);
    console.log('Categories details:', JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error('Error running check:', err);
  }
}

check();
