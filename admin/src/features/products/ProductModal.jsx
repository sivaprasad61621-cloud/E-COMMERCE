import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { X, Upload } from 'lucide-react';

export const ProductModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const { categoriesList } = useSelector((state) => state.categories);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('draft');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategoryId(product.category_id || '');
      setPrice(product.price);
      setDiscount(product.discount || 0);
      setStock(product.stock);
      setStatus(product.status);
      setDescription(product.description || '');
      setImages(product.images || []);
    } else {
      setName('');
      setSku('');
      setCategoryId('');
      setPrice('');
      setDiscount('0');
      setStock('0');
      setStatus('draft');
      setDescription('');
      setImages([]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sku || price === undefined) return;

    const payload = {
      name,
      sku,
      category_id: categoryId || null,
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      stock: parseInt(stock || 0),
      status,
      description,
      images,
    };

    if (product) {
      dispatch(updateProduct({ id: product.id, productData: payload }));
    } else {
      dispatch(addProduct(payload));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#2F2F2F]/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-[#2F2F2F] overflow-y-auto">
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-vintage-flat"
        title={product ? 'Edit Ledger Record' : 'Record New Product'}
        headerAction={
          <button onClick={onClose} className="p-2 hover:bg-[#2F2F2F]/5 rounded-sm cursor-pointer">
            <X size={18} />
          </button>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                  placeholder="e.g. Vintage Leather Satchel"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                  Stock Keeping Unit (SKU)
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm font-mono text-[#2F2F2F]"
                  placeholder="e.g. BG-LTH-021"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                  Classification / Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                >
                  <option value="">Unclassified</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    placeholder="120.00"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    placeholder="10"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                    Catalog Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                  Catalog Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-transparent border-editorial border-opacity-40 p-2.5 text-sm focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                  placeholder="Vintage editorial descriptions..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#7A756B]">
                  Product Assets (Images)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-transparent border-editorial border-opacity-40 p-2 text-xs focus:outline-none focus:border-[#8B5E3C] rounded-sm text-[#2F2F2F]"
                    placeholder="Paste Image URL"
                  />
                  <Button type="button" variant="secondary" className="text-xs py-2 cursor-pointer" onClick={handleAddImageUrl}>
                    Add URL
                  </Button>
                </div>

                <div className="flex items-center justify-center border-editorial border-dashed border-opacity-60 rounded-sm p-4 hover:bg-[#2F2F2F]/5 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-xs text-[#7A756B]">
                    <Upload size={18} className="text-[#8B5E3C]" />
                    <span>Upload Image File</span>
                  </div>
                </div>

                {/* Images Preview list */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group border-editorial rounded-sm aspect-square bg-white flex items-center justify-center overflow-hidden">
                        <img src={img} alt="Product preview" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-[#2F2F2F]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-editorial-t">
            <Button type="submit" variant="primary" className="flex-1 cursor-pointer">
              {product ? 'Commit Changes' : 'Record Product'}
            </Button>
            <Button type="button" variant="secondary" className="flex-1 cursor-pointer" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductModal;
