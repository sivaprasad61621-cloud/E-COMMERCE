import supabase from '../config/supabase.js';

// Shared mock database state for categories
export let mockCategories = [
  { id: 'cat-1', name: 'Electronics',       slug: 'electronics',      description: 'Premium electronic devices and accessories' },
  { id: 'cat-2', name: 'Fashion & Apparel', slug: 'fashion-apparel',   description: 'Curated apparel and lifestyle wear' },
  { id: 'cat-3', name: 'Home & Kitchen',    slug: 'home-kitchen',      description: 'Decor and kitchen essentials' },
  { id: 'cat-4', name: 'Beauty & Health',   slug: 'beauty-health',     description: 'Skincare, wellness, and personal care' },
  { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports-outdoors',   description: 'Gear for active living and outdoor adventures' },
  { id: 'cat-6', name: 'Books & Stationery',slug: 'books-stationery',  description: 'Books, journals, and fine writing tools' },
];

export const getCategories = async (req, res) => {
  if (!supabase) {
    // Mock Mode
    // Product count mapping will be done dynamically by checking the products list
    // Importing mockProducts here causes circular dependency, so we will read from global mock storage if possible
    // or calculate product count on the frontend/controller dynamically
    const categoriesWithCount = mockCategories.map(cat => {
      // In mock mode, we'll assign a static or calculated count (we will import products dynamically)
      return { ...cat, product_count: 3 }; 
    });
    return res.json(categoriesWithCount);
  }

  try {
    // Online Supabase Mode
    // Fetch categories and join with products count
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, products(id)');

    if (error) return res.status(400).json({ error: error.message });

    const categoriesWithCount = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      created_at: cat.created_at,
      product_count: cat.products ? cat.products.length : 0
    }));

    return res.json(categoriesWithCount);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required fields.' });
  }

  if (!supabase) {
    // Mock Mode
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description,
      product_count: 0
    };
    mockCategories.push(newCat);
    return res.status(201).json(newCat);
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, description }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description } = req.body;

  if (!supabase) {
    // Mock Mode
    const catIdx = mockCategories.findIndex(c => c.id === id);
    if (catIdx === -1) return res.status(404).json({ error: 'Category not found.' });

    mockCategories[catIdx] = {
      ...mockCategories[catIdx],
      name: name || mockCategories[catIdx].name,
      slug: slug ? slug.toLowerCase().replace(/[^a-z0-9]/g, '-') : mockCategories[catIdx].slug,
      description: description !== undefined ? description : mockCategories[catIdx].description
    };
    return res.json(mockCategories[catIdx]);
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, description })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!supabase) {
    // Mock Mode
    const catIdx = mockCategories.findIndex(c => c.id === id);
    if (catIdx === -1) return res.status(404).json({ error: 'Category not found.' });

    mockCategories = mockCategories.filter(c => c.id !== id);
    return res.json({ message: 'Category deleted successfully.' });
  }

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
