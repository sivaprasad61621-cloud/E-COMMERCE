import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  // Get category for home-kitchen
  const { data: cat } = await supabase.from('categories').select('id, name').ilike('name', '%Home%').single();
  console.log('Category:', cat);
  
  if (cat) {
    // Fetch products for this category from backend API
    const res = await fetch(`http://localhost:5000/api/products?category_id=${cat.id}&limit=20`);
    const json = await res.json();
    console.log('API products for Home & Kitchen:', json.data.map(p => ({ name: p.name, images: p.images })));
  }
}

check();
