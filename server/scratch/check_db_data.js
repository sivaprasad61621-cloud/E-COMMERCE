import supabase from '../config/supabase.js';

async function checkData() {
  if (!supabase) {
    console.error('Supabase client not initialized.');
    return;
  }
  
  try {
    // 1. Check products
    const { data: products, error: pErr, count: pCount } = await supabase
      .from('products')
      .select('id, name, price, description, category:categories(name)', { count: 'exact' });
      
    if (pErr) {
      console.error('Error fetching products:', pErr.message);
    } else {
      console.log(`Total products in database: ${pCount}`);
      if (products && products.length > 0) {
        console.log('Sample product:', products[0]);
      }
    }

    // 2. Check categories
    const { data: categories, error: cErr } = await supabase
      .from('categories')
      .select('id, name, slug');
      
    if (cErr) {
      console.error('Error fetching categories:', cErr.message);
    } else {
      console.log(`Total categories in database: ${categories?.length || 0}`);
      if (categories && categories.length > 0) {
        console.log('Sample category:', categories[0]);
      }
    }
  } catch (err) {
    console.error('Query failed:', err.message);
  }
}

checkData();
