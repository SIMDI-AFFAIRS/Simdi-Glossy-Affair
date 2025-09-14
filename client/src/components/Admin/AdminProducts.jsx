import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useEcommerce from '../../context/EcommerceContext';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { products, fetchProducts } = useEcommerce();
  
  // All state declarations
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    price: '',
    intro: '',
    how_to_use: '',
    shade: '',
    finish: '',
    size: '',
    color: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  // Open edit modal and populate form
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      title: product.title || '',
      price: product.price || '',
      intro: product.intro || '',
      how_to_use: product.how_to_use || '',
      shade: product.shade || '',
      finish: product.finish || '',
      size: product.size || '',
      color: product.color || ''
    });
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Save edited product
  const handleSaveEdit = async () => {
    if (!selectedProduct) return;

    setEditLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editFormData.title.trim(),
          price: parseFloat(editFormData.price) || 0,
          intro: editFormData.intro.trim(),
          how_to_use: editFormData.how_to_use.trim(),
          shade: editFormData.shade.trim(),
          finish: editFormData.finish.trim(),
          size: editFormData.size.trim(),
          color: editFormData.color.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast.success('Product updated successfully');
      await fetchProducts(); // Refresh products list
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted successfully');
      await fetchProducts(); // Use context function to refresh
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Refresh products using context function
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchProducts();
      toast.success('Products refreshed');
    } catch (error) {
      toast.error('Failed to refresh products');
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter products
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products.filter(product =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.finish?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredProducts;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Load products on mount if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  return (
    <div
      className="min-h-screen w-full bg-[#2a2a2a] py-5 px-5 md:px-10"
      style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
    >
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Products Management ({filteredProducts.length})
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-xl transition-colors ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-[#2e1f27] hover:bg-[#a13a77]'
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by title, shade, color, or finish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c]"
            >
              <option value="created_at">Date Added</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="shade">Shade</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c]"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-xl">No products found</p>
            <p className="text-[#be9db0] mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Add some products to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4 hover:bg-[#2e1f27] transition-colors"
              >
                {/* Product Image */}
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {product.title || 'Untitled Product'}
                    </h3>
                    <span className="text-[#be9db0] text-sm whitespace-nowrap ml-2">
                      ID: {product.id}
                    </span>
                  </div>

                  <div className="text-white font-semibold text-xl">
                    GH¢ {product.price || '0.00'}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-[#be9db0]">Shade:</span>
                      <span className="text-white ml-1">{product.shade || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#be9db0]">Finish:</span>
                      <span className="text-white ml-1">{product.finish || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#be9db0]">Size:</span>
                      <span className="text-white ml-1">{product.size || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#be9db0]">Color:</span>
                      <span className="text-white ml-1">{product.color || 'N/A'}</span>
                    </div>
                  </div>

                  {product.intro && (
                    <p className="text-[#be9db0] text-sm">
                      {truncateText(product.intro)}
                    </p>
                  )}

                  <div className="text-xs text-[#be9db0]">
                    Added: {product.created_at ? formatDate(product.created_at) : 'Unknown'}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2e1f27] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                className="text-[#be9db0] hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                  placeholder="Enter product title"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Price <span className="font-semibold">GH¢</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditFormChange}
                  className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                  placeholder="Enter price"
                />
              </div>

              {/* Specifications Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Shade</label>
                  <input
                    type="text"
                    name="shade"
                    value={editFormData.shade}
                    onChange={handleEditFormChange}
                    className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                    placeholder="Enter shade"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Finish</label>
                  <input
                    type="text"
                    name="finish"
                    value={editFormData.finish}
                    onChange={handleEditFormChange}
                    className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                    placeholder="Enter finish"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={editFormData.size}
                    onChange={handleEditFormChange}
                    className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                    placeholder="Enter size"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={editFormData.color}
                    onChange={handleEditFormChange}
                    className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
                    placeholder="Enter color"
                  />
                </div>
              </div>

              {/* Intro */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Intro</label>
                <textarea
                  name="intro"
                  value={editFormData.intro}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c] resize-none"
                  placeholder="Write product intro"
                />
              </div>

              {/* How to Use */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">How to Use</label>
                <textarea
                  name="how_to_use"
                  value={editFormData.how_to_use}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#251a22] placeholder:text-[#be9db0] p-4 text-base focus:outline-none focus:border-[#822b5c] resize-none"
                  placeholder="Write how to use instructions"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  editLoading
                    ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2e1f27] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-[#be9db0] mb-6">
              Are you sure you want to delete "{selectedProduct.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(selectedProduct.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;