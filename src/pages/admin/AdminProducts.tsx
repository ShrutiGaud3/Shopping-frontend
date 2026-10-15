import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, SlidersHorizontal, ShoppingBag, Eye, ShieldAlert, Palette, Maximize2, Image as ImageIcon, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import type { Product, ProductSpecification } from '../../types';

interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size', '28', '30', '32', '34', '36'];

const PRESET_COLORS: ColorOption[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Olive Green', hex: '#4D7C0F' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Tan / Brown', hex: '#78350F' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Pink', hex: '#F43F5E' }
];

export const AdminProducts: React.FC = () => {
  const { products, loadingProducts, addProduct, updateProduct, deleteProduct, fetchProducts } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Custom size/color inputs for Add Modal
  const [addCustomSizeInput, setAddCustomSizeInput] = useState('');
  const [addCustomColorName, setAddCustomColorName] = useState('');
  const [addCustomColorHex, setAddCustomColorHex] = useState('#000000');

  // Custom size/color inputs for Edit Modal
  const [editCustomSizeInput, setEditCustomSizeInput] = useState('');
  const [editCustomColorName, setEditCustomColorName] = useState('');
  const [editCustomColorHex, setEditCustomColorHex] = useState('#000000');

  // Gallery Image URL input states
  const [addGalleryUrlInput, setAddGalleryUrlInput] = useState('');
  const [editGalleryUrlInput, setEditGalleryUrlInput] = useState('');

  // Sub-type dropdown state for accessories: 'bags' | 'sunglasses' | 'belts'
  const [addAccessorySubtype, setAddAccessorySubtype] = useState<'bags' | 'sunglasses' | 'belts'>('bags');
  const [editAccessorySubtype, setEditAccessorySubtype] = useState<'bags' | 'sunglasses' | 'belts'>('bags');

  // Fetch all products on admin page mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Empty specifications templates for clean user input
  const emptyGarmentSpecs: ProductSpecification = {
    fabric: '',
    sleeveLength: '',
    collar: '',
    fit: '',
    pattern: '',
    occasion: '',
    closure: '',
    pockets: ''
  };

  const emptyBagSpecs: ProductSpecification = {
    material: '',
    bagStyle: '',
    compartments: '',
    laptopFit: '',
    hardware: '',
    closure: '',
    dimensions: '',
    warranty: ''
  };

  const emptySunglassesSpecs: ProductSpecification = {
    material: '',
    lensMaterial: '',
    frameShape: '',
    uvProtection: '',
    dimensions: '',
    warranty: '',
    closure: '',
    occasion: ''
  };

  const emptyBeltSpecs: ProductSpecification = {
    material: '',
    buckleType: '',
    beltWidth: '',
    dimensions: '',
    pattern: '',
    warranty: '',
    closure: '',
    occasion: ''
  };

  // Clean New Product Form State
  const initialNewProd = {
    name: '',
    brand: '',
    category: 'Jackets',
    gender: 'Women' as 'Women' | 'Men' | 'Kids' | 'Unisex',
    price: '' as unknown as number,
    originalPrice: '' as unknown as number,
    discountPercent: '' as unknown as number,
    rating: 4.5,
    reviewsCount: 0,
    image: '',
    images: [] as string[],
    description: '',
    sizes: [] as string[],
    colors: [] as ColorOption[],
    specifications: emptyGarmentSpecs
  };

  const [newProd, setNewProd] = useState(initialNewProd);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Multiple Image Gallery Management Helpers
  const addGalleryImageToAdd = () => {
    if (!addGalleryUrlInput.trim()) return;
    const url = addGalleryUrlInput.trim();
    const updatedImages = [...newProd.images, url];
    setNewProd({
      ...newProd,
      image: newProd.image || url,
      images: updatedImages
    });
    setAddGalleryUrlInput('');
  };

  const removeGalleryImageFromAdd = (index: number) => {
    const updatedImages = newProd.images.filter((_, idx) => idx !== index);
    const newMain = updatedImages.includes(newProd.image) ? newProd.image : (updatedImages[0] || '');
    setNewProd({
      ...newProd,
      image: newMain,
      images: updatedImages
    });
  };

  const addGalleryImageToEdit = () => {
    if (!editingProduct || !editGalleryUrlInput.trim()) return;
    const url = editGalleryUrlInput.trim();
    const currentImages = editingProduct.images || [editingProduct.image];
    const updatedImages = [...currentImages, url];
    setEditingProduct({
      ...editingProduct,
      image: editingProduct.image || url,
      images: updatedImages
    });
    setEditGalleryUrlInput('');
  };

  const removeGalleryImageFromEdit = (index: number) => {
    if (!editingProduct) return;
    const currentImages = editingProduct.images || [editingProduct.image];
    const updatedImages = currentImages.filter((_, idx) => idx !== index);
    const newMain = updatedImages.includes(editingProduct.image) ? editingProduct.image : (updatedImages[0] || '');
    setEditingProduct({
      ...editingProduct,
      image: newMain,
      images: updatedImages
    });
  };

  // Size Toggling Helpers
  const toggleSizeInAdd = (size: string) => {
    const exists = newProd.sizes.includes(size);
    const updated = exists ? newProd.sizes.filter((s) => s !== size) : [...newProd.sizes, size];
    setNewProd({ ...newProd, sizes: updated.length ? updated : [size] });
  };

  const toggleSizeInEdit = (size: string) => {
    if (!editingProduct) return;
    const currentSizes = editingProduct.sizes || ['Free Size'];
    const exists = currentSizes.includes(size);
    const updated = exists ? currentSizes.filter((s) => s !== size) : [...currentSizes, size];
    setEditingProduct({ ...editingProduct, sizes: updated.length ? updated : [size] });
  };

  const addCustomSizeToAdd = () => {
    if (!addCustomSizeInput.trim()) return;
    const clean = addCustomSizeInput.trim().toUpperCase();
    if (!newProd.sizes.includes(clean)) {
      setNewProd({ ...newProd, sizes: [...newProd.sizes, clean] });
    }
    setAddCustomSizeInput('');
  };

  const addCustomSizeToEdit = () => {
    if (!editingProduct || !editCustomSizeInput.trim()) return;
    const clean = editCustomSizeInput.trim().toUpperCase();
    const current = editingProduct.sizes || [];
    if (!current.includes(clean)) {
      setEditingProduct({ ...editingProduct, sizes: [...current, clean] });
    }
    setEditCustomSizeInput('');
  };

  // Color Toggling Helpers
  const toggleColorInAdd = (color: ColorOption) => {
    const exists = newProd.colors.some((c) => c.name.toLowerCase() === color.name.toLowerCase());
    const updated = exists
      ? newProd.colors.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase())
      : [...newProd.colors, color];
    setNewProd({ ...newProd, colors: updated.length ? updated : [color] });
  };

  const toggleColorInEdit = (color: ColorOption) => {
    if (!editingProduct) return;
    const currentColors = editingProduct.colors || [];
    const exists = currentColors.some((c) => c.name.toLowerCase() === color.name.toLowerCase());
    const updated = exists
      ? currentColors.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase())
      : [...currentColors, color];
    setEditingProduct({ ...editingProduct, colors: updated.length ? updated : [color] });
  };

  const addCustomColorToAdd = () => {
    if (!addCustomColorName.trim()) return;
    const newColor: ColorOption = { name: addCustomColorName.trim(), hex: addCustomColorHex };
    setNewProd({ ...newProd, colors: [...newProd.colors, newColor] });
    setAddCustomColorName('');
  };

  const addCustomColorToEdit = () => {
    if (!editingProduct || !editCustomColorName.trim()) return;
    const newColor: ColorOption = { name: editCustomColorName.trim(), hex: editCustomColorHex };
    setEditingProduct({ ...editingProduct, colors: [...(editingProduct.colors || []), newColor] });
    setEditCustomColorName('');
  };

  const handleCategoryChange = (newCategory: string, isEdit = false) => {
    const isAcc = newCategory === 'Accessories';
    const nextSpecs = isAcc ? { ...emptyBagSpecs } : { ...emptyGarmentSpecs };

    if (isEdit && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        category: newCategory,
        sizes: isAcc ? ['One Size'] : editingProduct.sizes,
        specifications: {
          ...nextSpecs,
          ...(editingProduct.specifications || {})
        }
      });
    } else {
      setNewProd({
        ...newProd,
        category: newCategory,
        sizes: isAcc ? ['One Size'] : [],
        specifications: {
          ...nextSpecs,
          ...(newProd.specifications || {})
        }
      });
    }
  };

  const handleSubtypeChange = (subtype: 'bags' | 'sunglasses' | 'belts', isEdit = false) => {
    let targetSpecs = emptyBagSpecs;
    if (subtype === 'sunglasses') targetSpecs = emptySunglassesSpecs;
    if (subtype === 'belts') targetSpecs = emptyBeltSpecs;

    if (isEdit && editingProduct) {
      setEditAccessorySubtype(subtype);
      setEditingProduct({
        ...editingProduct,
        specifications: {
          ...targetSpecs,
          ...(editingProduct.specifications || {})
        }
      });
    } else {
      setAddAccessorySubtype(subtype);
      setNewProd({
        ...newProd,
        specifications: {
          ...targetSpecs,
          ...(newProd.specifications || {})
        }
      });
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;

    setIsAddModalOpen(false);

    const productToAdd = {
      ...newProd,
      price: Number(newProd.price) || 0,
      originalPrice: Number(newProd.originalPrice) || Number(newProd.price) || 0,
      discountPercent: Number(newProd.discountPercent) || 0,
      image: newProd.image || newProd.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      images: newProd.images.length > 0 ? newProd.images : [newProd.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80']
    };

    setNewProd(initialNewProd);

    await addProduct(productToAdd);
    fetchProducts();
  };

  const handleEditClick = (product: Product) => {
    const isAcc = product.category === 'Accessories';
    const nameLower = product.name.toLowerCase();
    
    let subtype: 'bags' | 'sunglasses' | 'belts' = 'bags';
    if (nameLower.includes('sunglasses') || nameLower.includes('glasses') || !!product.specifications?.lensMaterial) {
      subtype = 'sunglasses';
    } else if (nameLower.includes('belt') || nameLower.includes('wallet') || !!product.specifications?.beltWidth || !!product.specifications?.buckleType) {
      subtype = 'belts';
    }

    setEditAccessorySubtype(subtype);

    let defaultForSubtype = emptyBagSpecs;
    if (subtype === 'sunglasses') defaultForSubtype = emptySunglassesSpecs;
    if (subtype === 'belts') defaultForSubtype = emptyBeltSpecs;

    setEditingProduct({
      ...product,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      sizes: product.sizes || ['S', 'M', 'L'],
      colors: product.colors || [{ name: 'Default', hex: '#000000' }],
      specifications: {
        ...(isAcc ? defaultForSubtype : emptyGarmentSpecs),
        ...(product.specifications || {})
      }
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const targetProd = editingProduct;
    setEditingProduct(null);

    await updateProduct(targetProd.id, {
      name: targetProd.name,
      brand: targetProd.brand,
      category: targetProd.category,
      gender: targetProd.gender,
      price: Number(targetProd.price),
      originalPrice: Number(targetProd.originalPrice),
      discountPercent: Number(targetProd.discountPercent),
      image: targetProd.image,
      images: targetProd.images && targetProd.images.length > 0 ? targetProd.images : [targetProd.image],
      sizes: targetProd.sizes,
      colors: targetProd.colors,
      description: targetProd.description,
      specifications: targetProd.specifications || {},
      isTrending: targetProd.isTrending,
      isDeal: targetProd.isDeal
    });

    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Products Catalog Management
          </h1>
          <p className="text-xs text-gray-500">
            Manage product listings, pricing, gallery photos, available sizes, colors, and detailed specifications.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 border border-gray-200 rounded-sm flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-sm px-3 py-2 text-xs text-gray-800 focus:outline-none cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="Jackets">Jackets</option>
          <option value="Dresses">Dresses</option>
          <option value="Shirts">Shirts</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Accessories">Accessories (Bags, Belts, Eyewear)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 min-w-[700px]">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">Product</th>
                <th className="py-3 px-4 min-w-[100px]">Brand</th>
                <th className="py-3 px-4 min-w-[110px]">Category</th>
                <th className="py-3 px-4 min-w-[110px]">Gallery Images</th>
                <th className="py-3 px-4 min-w-[130px]">Sizes &amp; Colors</th>
                <th className="py-3 px-4 min-w-[90px]">Sale Price</th>
                <th className="py-3 px-4 min-w-[80px]">MRP</th>
                <th className="py-3 px-4 min-w-[160px]">Specifications</th>
                <th className="py-3 px-4 text-right min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingProducts ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold uppercase tracking-widest animate-pulse">Loading Products Catalog from Database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500 text-xs font-medium">
                    No products found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                const isAcc = p.category === 'Accessories';
                const nameLower = p.name.toLowerCase();
                const isSun = nameLower.includes('sunglasses') || !!p.specifications?.lensMaterial;
                const isBelt = nameLower.includes('belt') || !!p.specifications?.beltWidth;

                let specSummary = `${p.specifications?.fabric || 'Cotton Blend'} | ${p.specifications?.fit || 'Regular Fit'}`;
                if (isAcc) {
                  if (isSun) {
                    specSummary = `🕶️ ${p.specifications?.lensMaterial || 'Polarized UV400'} | ${p.specifications?.frameShape || 'Wayfarer'}`;
                  } else if (isBelt) {
                    specSummary = `🥋 Belt: ${p.specifications?.beltWidth || '3.5 cm'} | ${p.specifications?.buckleType || 'Pin Buckle'}`;
                  } else {
                    specSummary = `👜 ${p.specifications?.bagStyle || 'Tote Bag'} | ${p.specifications?.material || 'Leather'}`;
                  }
                }

                const galleryCount = (p.images && p.images.length > 0) ? p.images.length : 1;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-xs border border-gray-200 shrink-0" />
                      <div>
                        <span className="font-bold text-gray-900 block truncate max-w-[150px] sm:max-w-[200px]">{p.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap">{p.brand}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${isAcc ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-blue-600" /> {galleryCount} Photos
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {(p.sizes || []).map((s) => (
                          <span key={s} className="bg-gray-100 text-gray-800 text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-gray-200">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        {(p.colors || []).map((c) => (
                          <span
                            key={c.name}
                            className="w-3 h-3 rounded-full border border-gray-300 inline-block shrink-0"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">₹{p.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-400 line-through whitespace-nowrap">₹{p.originalPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 max-w-xs text-gray-500">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-xs block truncate" title={specSummary}>
                        {specSummary}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xs transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-sm max-w-2xl sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 sm:space-y-5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Reversible Leather Belt or Tote Bag"
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    placeholder="e.g. Velora Studio, Zara, Nike..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs cursor-pointer font-bold text-gray-900 focus:outline-none focus:border-gray-900"
                  >
                    <option value="Jackets">Jackets</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories (Bags, Belts, Eyewear)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender / Section *</label>
                  <select
                    value={newProd.gender}
                    onChange={(e) => setNewProd({ ...newProd, gender: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs cursor-pointer font-bold text-gray-900 focus:outline-none focus:border-gray-900"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder="e.g. 1299"
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder="e.g. 2499"
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newProd.discountPercent}
                    onChange={(e) => setNewProd({ ...newProd, discountPercent: e.target.value === '' ? '' as any : Number(e.target.value) })}
                    placeholder="e.g. 48"
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Multiple Gallery Images Manager */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-blue-600" /> Multiple Gallery Images ({newProd.images.length} Photos)
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">Click "Cover" badge on thumbnail to choose main image</span>
                </div>

                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-2.5 py-1">
                  {newProd.images.map((imgUrl, idx) => {
                    const isMain = newProd.image === imgUrl;
                    return (
                      <div key={idx} className="relative group w-18 h-22 sm:w-20 sm:h-24 border border-gray-300 rounded-sm overflow-hidden bg-white shadow-xs">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        {isMain ? (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-xs shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" /> Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setNewProd({ ...newProd, image: imgUrl })}
                            className="absolute top-1 left-1 bg-black/70 hover:bg-amber-500 text-white text-[9px] font-bold px-1 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryImageFromAdd(idx)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Gallery URL Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Paste additional Image URL (e.g. Unsplash photo link)..."
                    value={addGalleryUrlInput}
                    onChange={(e) => setAddGalleryUrlInput(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImageToAdd}
                    className="bg-blue-600 text-white text-xs font-bold px-4 py-2 sm:py-1.5 rounded-sm hover:bg-blue-700 cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Image
                  </button>
                </div>
              </div>

              {/* Sizes Selection Controls */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">
                  <Maximize2 className="w-4 h-4 text-emerald-600" /> Available Sizes Configuration
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Select Preset Sizes:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SIZES.map((sz) => {
                      const isSelected = newProd.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSizeInAdd(sz)}
                          className={`px-3 py-1 rounded-xs text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gray-900 text-white shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {sz} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type custom size (e.g. UK 9, 38)"
                    value={addCustomSizeInput}
                    onChange={(e) => setAddCustomSizeInput(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={addCustomSizeToAdd}
                    className="bg-gray-800 text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-sm hover:bg-black cursor-pointer shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Colors Selection Controls */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-purple-600" /> Available Colors Configuration
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Select Preset Colors:</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((clr) => {
                      const isSelected = newProd.colors.some((c) => c.name.toLowerCase() === clr.name.toLowerCase());
                      return (
                        <button
                          key={clr.name}
                          type="button"
                          onClick={() => toggleColorInAdd(clr)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-bold cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"
                            style={{ backgroundColor: clr.hex }}
                          />
                          {clr.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Custom Color Name (e.g. Emerald Green)"
                    value={addCustomColorName}
                    onChange={(e) => setAddCustomColorName(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="color"
                      value={addCustomColorHex}
                      onChange={(e) => setAddCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded-sm border border-gray-300 cursor-pointer p-0.5 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={addCustomColorToAdd}
                      className="bg-purple-800 text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-sm hover:bg-purple-900 cursor-pointer shrink-0 flex-1 sm:flex-initial"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Detailed product description..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Dynamic Specifications Section */}
              {newProd.category === 'Accessories' ? (
                <div className="bg-purple-50/60 p-4 sm:p-5 border border-purple-200 rounded-sm space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
                    <div className="flex items-center gap-2 font-serif font-bold text-sm sm:text-base text-purple-950">
                      {addAccessorySubtype === 'sunglasses' ? (
                        <Eye className="w-5 h-5 text-purple-700" />
                      ) : addAccessorySubtype === 'belts' ? (
                        <ShieldAlert className="w-5 h-5 text-purple-700" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-purple-700" />
                      )}
                      Accessory Specifications
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-purple-900 whitespace-nowrap">Accessory Type:</label>
                      <select
                        value={addAccessorySubtype}
                        onChange={(e) => handleSubtypeChange(e.target.value as any)}
                        className="bg-white border border-purple-300 rounded-sm px-3 py-1.5 text-xs font-bold text-purple-900 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                      >
                        <option value="bags">👜 Bags &amp; Handbags</option>
                        <option value="sunglasses">🕶️ Sunglasses &amp; Eyewear</option>
                        <option value="belts">🥋 Belts, Wallets &amp; Accessories</option>
                      </select>
                    </div>
                  </div>

                  {addAccessorySubtype === 'sunglasses' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Lens Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. TAC Polarized UV400"
                          value={newProd.specifications.lensMaterial || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, lensMaterial: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Shape</label>
                        <input
                          type="text"
                          placeholder="e.g. Wayfarer / Aviator"
                          value={newProd.specifications.frameShape || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, frameShape: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Material</label>
                        <input
                          type="text"
                          placeholder="e.g. Italian Acetate / Metal"
                          value={newProd.specifications.material || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">UV Protection Level</label>
                        <input
                          type="text"
                          placeholder="e.g. 100% UV400 Protection (Cat 3)"
                          value={newProd.specifications.uvProtection || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, uvProtection: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Dimensions</label>
                        <input
                          type="text"
                          placeholder="e.g. 52-18-145 mm (Medium Fit)"
                          value={newProd.specifications.dimensions || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Packaging &amp; Case</label>
                        <input
                          type="text"
                          placeholder="e.g. Includes Hard Leather Case &amp; Cloth"
                          value={newProd.specifications.closure || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={newProd.specifications.warranty || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion / Wear</label>
                        <input
                          type="text"
                          placeholder="e.g. Outdoor / Travel / Driving"
                          value={newProd.specifications.occasion || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, occasion: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  ) : addAccessorySubtype === 'belts' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Belt / Strap Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. Full-Grain Genuine Leather"
                          value={newProd.specifications.material || newProd.specifications.fabric || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Buckle / Clasp Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Reversible Pin Buckle"
                          value={newProd.specifications.buckleType || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, buckleType: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Belt Width</label>
                        <input
                          type="text"
                          placeholder="e.g. 3.5 cm (Standard Width)"
                          value={newProd.specifications.beltWidth || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, beltWidth: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Waist Size / Length</label>
                        <input
                          type="text"
                          placeholder="e.g. 32 to 42 inch Adjustable Free Size"
                          value={newProd.specifications.dimensions || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Finish &amp; Texture</label>
                        <input
                          type="text"
                          placeholder="e.g. Smooth Grain / Embossed Finish"
                          value={newProd.specifications.pattern || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, pattern: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Reversible Feature</label>
                        <input
                          type="text"
                          placeholder="e.g. Reversible Black / Tan Dual Side"
                          value={newProd.specifications.closure || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={newProd.specifications.warranty || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion / Wear</label>
                        <input
                          type="text"
                          placeholder="e.g. Formal / Business Casual"
                          value={newProd.specifications.occasion || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, occasion: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Bag Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. Italian Genuine Grain Leather"
                          value={newProd.specifications.material || newProd.specifications.fabric || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Bag Style / Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Tote / Crossbody / Clutch"
                          value={newProd.specifications.bagStyle || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, bagStyle: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Compartments</label>
                        <input
                          type="text"
                          placeholder="e.g. 2 Main Zip Compartments + Inner Slots"
                          value={newProd.specifications.compartments || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, compartments: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Laptop / Tablet Fit</label>
                        <input
                          type="text"
                          placeholder="e.g. Fits up to 15.6 inch Laptop"
                          value={newProd.specifications.laptopFit || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, laptopFit: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Hardware Accent</label>
                        <input
                          type="text"
                          placeholder="e.g. Gold-Tone Brushed Metal"
                          value={newProd.specifications.hardware || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, hardware: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Closure Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Top Zip Closure / Magnetic Clasp"
                          value={newProd.specifications.closure || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Dimensions (L x W x H)</label>
                        <input
                          type="text"
                          placeholder="e.g. 35 x 26 x 14 cm"
                          value={newProd.specifications.dimensions || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={newProd.specifications.warranty || ''}
                          onChange={(e) =>
                            setNewProd({
                              ...newProd,
                              specifications: { ...newProd.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 sm:p-5 border border-gray-200 rounded-sm space-y-4">
                  <div className="flex items-center gap-2 font-serif font-bold text-sm sm:text-base text-gray-900 border-b border-gray-200 pb-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Garment Specifications &amp; Material Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Fabric / Material</label>
                      <input
                        type="text"
                        placeholder="e.g. Synthetic Leather"
                        value={newProd.specifications.fabric || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, fabric: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Sleeve Length</label>
                      <input
                        type="text"
                        placeholder="e.g. Long Sleeves"
                        value={newProd.specifications.sleeveLength || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, sleeveLength: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Collar / Neck</label>
                      <input
                        type="text"
                        placeholder="e.g. Notched Lapel"
                        value={newProd.specifications.collar || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, collar: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Fit Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Slim Fit"
                        value={newProd.specifications.fit || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, fit: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Pattern</label>
                      <input
                        type="text"
                        placeholder="e.g. Solid"
                        value={newProd.specifications.pattern || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, pattern: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion</label>
                      <input
                        type="text"
                        placeholder="e.g. Evening / Party"
                        value={newProd.specifications.occasion || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, occasion: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Closure</label>
                      <input
                        type="text"
                        placeholder="e.g. Front Zip"
                        value={newProd.specifications.closure || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, closure: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Pockets</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Zipper Pockets"
                        value={newProd.specifications.pockets || ''}
                        onChange={(e) =>
                          setNewProd({
                            ...newProd,
                            specifications: { ...newProd.specifications, pockets: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-sm cursor-pointer hover:bg-gray-50 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-sm hover:bg-emerald-700 cursor-pointer shadow-xs text-center"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-sm max-w-2xl sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 sm:space-y-5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => handleCategoryChange(e.target.value, true)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs cursor-pointer font-bold text-gray-900 focus:outline-none focus:border-gray-900"
                  >
                    <option value="Jackets">Jackets</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories (Bags, Belts, Eyewear)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender / Section</label>
                  <select
                    value={editingProduct.gender}
                    onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs cursor-pointer font-bold text-gray-900 focus:outline-none focus:border-gray-900"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.discountPercent}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Multiple Gallery Images Manager for Editing */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-blue-600" /> Multiple Gallery Images ({(editingProduct.images || [editingProduct.image]).length} Photos)
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">Click "Cover" badge on thumbnail to choose main image</span>
                </div>

                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-2.5 py-1">
                  {(editingProduct.images || [editingProduct.image]).map((imgUrl, idx) => {
                    const isMain = editingProduct.image === imgUrl;
                    return (
                      <div key={idx} className="relative group w-18 h-22 sm:w-20 sm:h-24 border border-gray-300 rounded-sm overflow-hidden bg-white shadow-xs">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        {isMain ? (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-xs shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" /> Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl })}
                            className="absolute top-1 left-1 bg-black/70 hover:bg-amber-500 text-white text-[9px] font-bold px-1 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryImageFromEdit(idx)}
                          className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Gallery URL Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Paste additional Image URL (e.g. Unsplash photo link)..."
                    value={editGalleryUrlInput}
                    onChange={(e) => setEditGalleryUrlInput(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImageToEdit}
                    className="bg-blue-600 text-white text-xs font-bold px-4 py-2 sm:py-1.5 rounded-sm hover:bg-blue-700 cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Image
                  </button>
                </div>
              </div>

              {/* Sizes Selection Controls for Editing */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">
                  <Maximize2 className="w-4 h-4 text-emerald-600" /> Available Sizes Configuration
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Select Preset Sizes:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SIZES.map((sz) => {
                      const isSelected = (editingProduct.sizes || []).includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSizeInEdit(sz)}
                          className={`px-3 py-1 rounded-xs text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gray-900 text-white shadow-xs'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {sz} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type custom size (e.g. UK 9, 38)"
                    value={editCustomSizeInput}
                    onChange={(e) => setEditCustomSizeInput(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <button
                    type="button"
                    onClick={addCustomSizeToEdit}
                    className="bg-gray-800 text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-sm hover:bg-black cursor-pointer shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Colors Selection Controls for Editing */}
              <div className="bg-gray-50 p-3.5 sm:p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-purple-600" /> Available Colors Configuration
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 text-[11px]">Select Preset Colors:</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((clr) => {
                      const isSelected = (editingProduct.colors || []).some((c) => c.name.toLowerCase() === clr.name.toLowerCase());
                      return (
                        <button
                          key={clr.name}
                          type="button"
                          onClick={() => toggleColorInEdit(clr)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-bold cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0"
                            style={{ backgroundColor: clr.hex }}
                          />
                          {clr.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Custom Color Name (e.g. Emerald Green)"
                    value={editCustomColorName}
                    onChange={(e) => setEditCustomColorName(e.target.value)}
                    className="bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs flex-1 w-full"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="color"
                      value={editCustomColorHex}
                      onChange={(e) => setEditCustomColorHex(e.target.value)}
                      className="w-8 h-8 rounded-sm border border-gray-300 cursor-pointer p-0.5 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={addCustomColorToEdit}
                      className="bg-purple-800 text-white text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-sm hover:bg-purple-900 cursor-pointer shrink-0 flex-1 sm:flex-initial"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Dynamic Specifications Section for Editing */}
              {editingProduct.category === 'Accessories' ? (
                <div className="bg-purple-50/60 p-4 sm:p-5 border border-purple-200 rounded-sm space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
                    <div className="flex items-center gap-2 font-serif font-bold text-sm sm:text-base text-purple-950">
                      {editAccessorySubtype === 'sunglasses' ? (
                        <Eye className="w-5 h-5 text-purple-700" />
                      ) : editAccessorySubtype === 'belts' ? (
                        <ShieldAlert className="w-5 h-5 text-purple-700" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-purple-700" />
                      )}
                      Accessory Specifications
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-purple-900 whitespace-nowrap">Accessory Type:</label>
                      <select
                        value={editAccessorySubtype}
                        onChange={(e) => handleSubtypeChange(e.target.value as any, true)}
                        className="bg-white border border-purple-300 rounded-sm px-3 py-1.5 text-xs font-bold text-purple-900 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                      >
                        <option value="bags">bag style</option>
                        <option value="sunglasses">sunglasses style</option>
                        <option value="belts">belts style</option>
                      </select>
                    </div>
                  </div>

                  {editAccessorySubtype === 'sunglasses' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Lens Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. TAC Polarized UV400"
                          value={editingProduct.specifications?.lensMaterial || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, lensMaterial: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Shape</label>
                        <input
                          type="text"
                          placeholder="e.g. Wayfarer / Aviator"
                          value={editingProduct.specifications?.frameShape || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, frameShape: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Material</label>
                        <input
                          type="text"
                          placeholder="e.g. Italian Acetate / Metal"
                          value={editingProduct.specifications?.material || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">UV Protection Level</label>
                        <input
                          type="text"
                          placeholder="e.g. 100% UV400 Protection (Cat 3)"
                          value={editingProduct.specifications?.uvProtection || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, uvProtection: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Frame Dimensions</label>
                        <input
                          type="text"
                          placeholder="e.g. 52-18-145 mm (Medium Fit)"
                          value={editingProduct.specifications?.dimensions || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Packaging &amp; Case</label>
                        <input
                          type="text"
                          placeholder="e.g. Includes Hard Leather Case &amp; Cloth"
                          value={editingProduct.specifications?.closure || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={editingProduct.specifications?.warranty || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion / Wear</label>
                        <input
                          type="text"
                          placeholder="e.g. Outdoor / Travel / Driving"
                          value={editingProduct.specifications?.occasion || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, occasion: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  ) : editAccessorySubtype === 'belts' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Belt / Strap Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. Full-Grain Genuine Leather"
                          value={editingProduct.specifications?.material || editingProduct.specifications?.fabric || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Buckle / Clasp Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Reversible Pin Buckle"
                          value={editingProduct.specifications?.buckleType || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, buckleType: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Belt Width</label>
                        <input
                          type="text"
                          placeholder="e.g. 3.5 cm (Standard Width)"
                          value={editingProduct.specifications?.beltWidth || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, beltWidth: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Waist Size / Length</label>
                        <input
                          type="text"
                          placeholder="e.g. 32 to 42 inch Adjustable Free Size"
                          value={editingProduct.specifications?.dimensions || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Finish &amp; Texture</label>
                        <input
                          type="text"
                          placeholder="e.g. Smooth Grain / Embossed Finish"
                          value={editingProduct.specifications?.pattern || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, pattern: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Reversible Feature</label>
                        <input
                          type="text"
                          placeholder="e.g. Reversible Black / Tan Dual Side"
                          value={editingProduct.specifications?.closure || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={editingProduct.specifications?.warranty || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion / Wear</label>
                        <input
                          type="text"
                          placeholder="e.g. Formal / Business Casual"
                          value={editingProduct.specifications?.occasion || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, occasion: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Bag Material *</label>
                        <input
                          type="text"
                          placeholder="e.g. Italian Genuine Grain Leather"
                          value={editingProduct.specifications?.material || editingProduct.specifications?.fabric || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, material: e.target.value, fabric: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Bag Style / Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Tote / Crossbody / Clutch"
                          value={editingProduct.specifications?.bagStyle || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, bagStyle: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Compartments</label>
                        <input
                          type="text"
                          placeholder="e.g. 2 Main Zip Compartments + Inner Slots"
                          value={editingProduct.specifications?.compartments || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, compartments: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Laptop / Tablet Fit</label>
                        <input
                          type="text"
                          placeholder="e.g. Fits up to 15.6 inch Laptop"
                          value={editingProduct.specifications?.laptopFit || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, laptopFit: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Hardware Accent</label>
                        <input
                          type="text"
                          placeholder="e.g. Gold-Tone Brushed Metal"
                          value={editingProduct.specifications?.hardware || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, hardware: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Closure Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Top Zip Closure / Magnetic Clasp"
                          value={editingProduct.specifications?.closure || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, closure: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Dimensions (L x W x H)</label>
                        <input
                          type="text"
                          placeholder="e.g. 35 x 26 x 14 cm"
                          value={editingProduct.specifications?.dimensions || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, dimensions: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1 text-xs">Warranty</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 Year Brand Warranty"
                          value={editingProduct.specifications?.warranty || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specifications: { ...editingProduct.specifications, warranty: e.target.value }
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 sm:p-5 border border-gray-200 rounded-sm space-y-4">
                  <div className="flex items-center gap-2 font-serif font-bold text-sm sm:text-base text-gray-900 border-b border-gray-200 pb-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Garment Specifications &amp; Material Details
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Fabric / Material</label>
                      <input
                        type="text"
                        placeholder="e.g. Synthetic Leather"
                        value={editingProduct.specifications?.fabric || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, fabric: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Sleeve Length</label>
                      <input
                        type="text"
                        placeholder="e.g. Long Sleeves"
                        value={editingProduct.specifications?.sleeveLength || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, sleeveLength: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Collar / Neck</label>
                      <input
                        type="text"
                        placeholder="e.g. Notched Lapel"
                        value={editingProduct.specifications?.collar || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, collar: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Fit Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Slim Fit"
                        value={editingProduct.specifications?.fit || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, fit: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Pattern</label>
                      <input
                        type="text"
                        placeholder="e.g. Solid"
                        value={editingProduct.specifications?.pattern || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, pattern: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Occasion</label>
                      <input
                        type="text"
                        placeholder="e.g. Evening / Party"
                        value={editingProduct.specifications?.occasion || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, occasion: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Closure</label>
                      <input
                        type="text"
                        placeholder="e.g. Front Zip"
                        value={editingProduct.specifications?.closure || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, closure: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1 text-xs">Pockets</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Zipper Pockets"
                        value={editingProduct.specifications?.pockets || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, pockets: e.target.value }
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-sm cursor-pointer hover:bg-gray-50 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 cursor-pointer shadow-xs text-center"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
