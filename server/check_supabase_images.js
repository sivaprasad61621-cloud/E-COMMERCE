import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabase
    .from('products')
    .select('name, images')
    .ilike('name', '%Lamp%');
  
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

check();
