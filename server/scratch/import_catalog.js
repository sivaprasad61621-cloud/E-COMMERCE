import supabase from '../config/supabase.js';
import fs from 'fs';
import path from 'path';

async function importCatalog() {
  if (!supabase) {
    console.error('Supabase client not initialized.');
    return;
  }

  try {
    console.log('[Catalog Importer] Fetching products and categories...');
    
    // Fetch all products and categories
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('id, name, price, description, category_id');
      
    if (pErr) throw pErr;

    const { data: categories, error: cErr } = await supabase
      .from('categories')
      .select('id, name, slug');
      
    if (cErr) throw cErr;

    console.log(`[Catalog Importer] Loaded ${products.length} products and ${categories.length} categories.`);

    // Group products by category
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = {
        name: cat.name,
        slug: cat.slug,
        products: []
      };
    });

    products.forEach(prod => {
      if (categoryMap[prod.category_id]) {
        categoryMap[prod.category_id].products.push(prod);
      }
    });

    // Programmatically login to obtain Admin JWT token
    console.log('[Catalog Importer] Logging in to obtain admin JWT token...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sshopping.com',
        password: 'password123'
      })
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed with status: ${loginRes.status}`);
    }

    const { token } = await loginRes.json();
    console.log('[Catalog Importer] Admin token obtained successfully.');

    // For each category, compile catalog text file and upload
    for (const catId of Object.keys(categoryMap)) {
      const cat = categoryMap[catId];
      if (cat.products.length === 0) continue;

      let fileContent = `Velora E-Commerce Product Catalog: Category: ${cat.name}\n`;
      fileContent += `==========================================\n\n`;

      cat.products.forEach(p => {
        const priceFormatted = parseFloat(p.price).toLocaleString('en-IN');
        fileContent += `Product Name: ${p.name}\n`;
        fileContent += `Price: ₹${priceFormatted}\n`;
        fileContent += `Description: ${p.description || 'No description available.'}\n`;
        fileContent += `Product ID: ${p.id}\n`;
        fileContent += `------------------------------------------\n\n`;
      });

      // Write catalog file to customer public directory
      const fileName = `catalog_${cat.slug}.txt`;
      const publicPath = path.resolve('../customer/public', fileName);
      fs.writeFileSync(publicPath, fileContent);
      console.log(`[Catalog Importer] Wrote catalogue file: ${fileName}`);

      // Ingest the file using the server's upload endpoint
      const docUrl = `http://localhost:5173/${fileName}`;
      console.log(`[Catalog Importer] Uploading document to knowledge base: ${docUrl}`);

      const uploadRes = await fetch('http://localhost:5000/api/admin/knowledge/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Catalog - ${cat.name}`,
          file_url: docUrl,
          file_type: 'txt',
          namespace: 'general'
        })
      });

      if (uploadRes.ok) {
        const resData = await uploadRes.json();
        console.log(`[Catalog Importer] Ingested successfully:`, resData.message);
      } else {
        const errorText = await uploadRes.text();
        console.error(`[Catalog Importer] Failed to ingest category ${cat.name}:`, errorText);
      }
    }

    console.log('[Catalog Importer] All catalog categories imported successfully!');
  } catch (err) {
    console.error('[Catalog Importer] Import process failed:', err.message);
  }
}

importCatalog();
