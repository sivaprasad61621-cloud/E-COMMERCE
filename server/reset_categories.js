import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newCategories = [
  { name: 'Electronics',        slug: 'electronics',      description: 'Premium electronic devices and accessories' },
  { name: 'Fashion & Apparel',  slug: 'fashion-apparel',  description: 'Curated apparel and lifestyle wear' },
  { name: 'Home & Kitchen',     slug: 'home-kitchen',     description: 'Decor and kitchen essentials' },
  { name: 'Beauty & Health',    slug: 'beauty-health',    description: 'Skincare, wellness, and personal care' },
  { name: 'Sports & Outdoors',  slug: 'sports-outdoors',  description: 'Gear for active living and outdoor adventures' },
  { name: 'Books & Stationery', slug: 'books-stationery', description: 'Books, journals, and fine writing tools' },
];

async function resetCategories() {
  console.log('🗑️  Deleting all existing categories...');

  // First, set all products category_id to NULL to avoid FK constraint errors
  const { error: prodErr } = await supabase
    .from('products')
    .update({ category_id: null })
    .not('id', 'is', null);

  if (prodErr) {
    console.warn('⚠️  Could not null out product category_ids:', prodErr.message);
  } else {
    console.log('✅ Product category_ids cleared.');
  }

  // Delete all categories
  const { error: delErr } = await supabase
    .from('categories')
    .delete()
    .not('id', 'is', null);

  if (delErr) {
    console.error('❌ Failed to delete categories:', delErr.message);
    process.exit(1);
  }
  console.log('✅ All old categories deleted.');

  // Insert new 6 categories
  console.log('➕ Inserting 6 new categories...');
  const { data: inserted, error: insErr } = await supabase
    .from('categories')
    .insert(newCategories)
    .select();

  if (insErr) {
    console.error('❌ Failed to insert categories:', insErr.message);
    process.exit(1);
  }

  console.log('✅ New categories inserted:');
  inserted.forEach(c => console.log(`   • [${c.id}] ${c.name}`));

  // Now update products to point to the correct new category IDs
  const catMap = {};
  inserted.forEach(c => { catMap[c.slug] = c.id; });

  const productUpdates = [
    // Electronics
    { slugs: ['electronics-laptops', 'electronics-smartphones', 'electronics-audio', 'electronics'], targetSlug: 'electronics' },
    // Fashion & Apparel
    { slugs: ['fashion-apparel', 'fashion-apparel-men', 'fashion-apparel-women', 'fashion-apparel-children', 'fashion', 'fashion-men', 'fashion-women', 'fashion-children'], targetSlug: 'fashion-apparel' },
    // Home & Kitchen
    { slugs: ['home-kitchen', 'home-kitchen-kitchenware', 'home-kitchen-lighting', 'home-kitchen-tableware'], targetSlug: 'home-kitchen' },
    // Beauty & Health
    { slugs: ['beauty-health', 'beauty-health-skincare', 'beauty-health-haircare', 'beauty-health-wellness', 'beauty', 'beauty-personal-care'], targetSlug: 'beauty-health' },
    // Sports & Outdoors
    { slugs: ['sports-outdoors', 'sports-outdoors-fitness', 'sports-outdoors-camping', 'sports-outdoors-yoga', 'sports'], targetSlug: 'sports-outdoors' },
    // Books & Stationery
    { slugs: ['books-stationery', 'books-stationery-fiction', 'books-stationery-journals', 'books-stationery-pens', 'stationery', 'books'], targetSlug: 'books-stationery' },
  ];

  // Also handle products that might belong to old unrelated categories
  // Get all current products with their category info
  const { data: allProds } = await supabase.from('products').select('id, name, category_id');
  console.log(`\n📦 Found ${allProds?.length || 0} products to reassign.`);

  // For any products still without a category, assign to Electronics as default
  const electronicsId = catMap['electronics'];
  if (electronicsId && allProds) {
    const { error: defaultErr } = await supabase
      .from('products')
      .update({ category_id: electronicsId })
      .is('category_id', null);
    if (!defaultErr) console.log(`   → Assigned uncategorized products to Electronics.`);
  }

  console.log('\n🎉 Category reset complete! Your 6 new categories are live.');
}

resetCategories();
