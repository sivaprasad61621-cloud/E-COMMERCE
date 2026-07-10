import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, setProductFilters } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';
import ProductModal from './ProductModal';
import { Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const { productsList, pagination, filters, loading } = useSelector((state) => state.products);
  const { categoriesList } = useSelector((state) => state.categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Local filter states to prevent excessive dispatch on type
  const [searchVal, setSearchVal] = useState(filters.search);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setProductFilters({ search: searchVal, page: 1 }));
  };

  const handleFilterChange = (key, val) => {
    dispatch(setProductFilters({ [key]: val, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setProductFilters({ page: newPage }));
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the product index?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#2F2F2F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-editorial-b pb-6">
        <div>
          <h2 className="text-4xl font-serif tracking-wide mb-2">Products Ledger</h2>
          <p className="text-sm font-sans text-[#7A756B]">
            Catalog index database detailing product fields, pricing records, and stock status.
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" className="flex items-center gap-2 cursor-pointer">
          <Plus size={16} /> Record Product
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-sm py-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent border-editorial border-opacity-40 p-2.5 pl-10 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
              placeholder="Search by name, SKU..."
            />
            <div className="absolute left-3 top-3 text-[#7A756B]">
              <Search size={16} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end">
            {/* Category Select */}
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] cursor-pointer"
            >
              <option value="">All Classifications</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <Button type="submit" variant="secondary" className="text-xs cursor-pointer">
              Apply
            </Button>
          </div>
        </form>
      </Card>

      {/* Ledger Table */}
      <Card className="shadow-sm">
        {loading ? (
          <p className="text-sm italic text-[#7A756B]">Loading ledger entries...</p>
        ) : productsList.length === 0 ? (
          <p className="text-sm italic text-[#7A756B]">No product entries match active queries.</p>
        ) : (
          <div className="space-y-6">
            <Table headers={['Asset', 'SKU', 'Product Details', 'Classification', 'Price (₹)', 'Stock', 'Status', 'Actions']}>
              {productsList.map((product) => {
                const discount = parseFloat(product.discount || 0);
                const hasDiscount = discount > 0;
                const finalPrice = hasDiscount 
                  ? product.price * (1 - discount / 100) 
                  : product.price;

                return (
                  <tr key={product.id} className="hover:bg-[#2F2F2F]/5 transition-colors">
                    {/* Image */}
                    <td className="py-4">
                      <div className="w-12 h-12 border-editorial rounded-sm overflow-hidden bg-white flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-[10px] text-[#7A756B] uppercase font-mono">No img</span>
                        )}
                      </div>
                    </td>
                    {/* SKU */}
                    <td className="py-4 font-mono text-xs font-semibold text-[#7A756B]">
                      {product.sku}
                    </td>
                    {/* Name */}
                    <td className="py-4">
                      <div className="font-serif font-medium text-lg text-[#2F2F2F]">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-[#7A756B] line-clamp-1 max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </td>
                    {/* Category */}
                    <td className="py-4 text-sm text-[#2F2F2F]">
                      {product.category?.name || <span className="italic text-[#7A756B]">Unclassified</span>}
                    </td>
                    {/* Price */}
                    <td className="py-4 text-sm">
                      {hasDiscount ? (
                        <div className="space-y-0.5">
                          <span className="text-[#8B5E3C] font-semibold">₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-xs text-[#7A756B] line-through block">₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      ) : (
                        <span className="font-medium">₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </td>
                    {/* Stock */}
                    <td className="py-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-medium ${product.stock < 10 ? 'text-red-700 font-bold' : ''}`}>
                          {product.stock}
                        </span>
                        {product.stock < 10 && (
                          <AlertTriangle size={14} className="text-red-700" title="Low stock alert" />
                        )}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="py-4">
                      <span className={`px-2 py-0.5 border-[0.5px] rounded-full text-[10px] uppercase font-semibold tracking-wider ${getStatusBadgeClass(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-1 hover:bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-sm transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1 hover:bg-red-50 text-red-700 rounded-sm transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </Table>

            {/* Pagination UI */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-editorial-t pt-4">
                <span className="text-xs text-[#7A756B]">
                  Page {pagination.page} of {pagination.pages} (Total: {pagination.total} entries)
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="secondary"
                    className="text-xs py-1 px-3 cursor-pointer"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    variant="secondary"
                    className="text-xs py-1 px-3 cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal Trigger */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
