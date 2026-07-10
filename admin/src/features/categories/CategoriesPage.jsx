import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categoriesList, loading, error } = useSelector((state) => state.categories);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setEditId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !slug) return;

    const payload = { name, slug, description };

    if (isEditing) {
      dispatch(updateCategory({ id: editId, categoryData: payload }));
    } else {
      dispatch(addCategory(payload));
    }
    resetForm();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      <div className="border-editorial-b pb-6">
        <h2 className="text-4xl font-serif tracking-wide mb-2">Category Taxonomy</h2>
        <p className="text-sm font-sans text-[#7A756B]">
          Define classification systems and tags to organize the product inventory catalogs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Category List */}
        <Card title="Classifications Index" className="lg:col-span-2 shadow-sm">
          {loading ? (
            <p className="text-sm italic text-[#7A756B]">Loading catalog entries...</p>
          ) : categoriesList.length === 0 ? (
            <p className="text-sm italic text-[#7A756B]">No categories have been logged yet.</p>
          ) : (
            <Table headers={['Classification', 'Slug Identifier', 'Products Count', 'Actions']}>
              {categoriesList.map((category) => (
                <tr key={category.id} className="hover:bg-[#2F2F2F]/5 transition-colors">
                  <td className="py-4">
                    <div className="font-serif font-medium text-lg">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-[#7A756B] mt-1">{category.description}</div>
                    )}
                  </td>
                  <td className="py-4 text-xs font-mono font-medium text-[#7A756B]">
                    /{category.slug}
                  </td>
                  <td className="py-4 text-sm font-medium">
                    {category.product_count !== undefined ? category.product_count : 0}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-1 hover:bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-sm transition-colors cursor-pointer"
                        title="Edit classification"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-1 hover:bg-red-50 text-red-700 rounded-sm transition-colors cursor-pointer"
                        title="Delete classification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Add/Edit Form */}
        <Card title={isEditing ? "Modify Classification" : "New Classification"} className="shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="bg-transparent border-editorial border-opacity-40 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                placeholder="e.g. Fine Stationery"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                Slug Identifier
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-transparent border-editorial border-opacity-40 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F] font-mono"
                placeholder="e.g. fine-stationery"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-transparent border-editorial border-opacity-40 p-3 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm transition-colors text-[#2F2F2F]"
                placeholder="Brief catalog description..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="flex-1 cursor-pointer">
                {isEditing ? 'Save Changes' : 'Record Category'}
              </Button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="p-3 border-editorial rounded-sm text-[#2F2F2F] hover:bg-[#2F2F2F]/5 transition-colors cursor-pointer"
                  title="Cancel edit"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesPage;
