import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useEcommerce from "../../context/EcommerceContext";

const AdminDashboard = () => {
  const { products, fetchProducts, user } = useEcommerce();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    avgPrice: 0,
    recentProducts: 0
  });

  // Calculate dashboard statistics
  useEffect(() => {
    if (products.length > 0) {
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0);
      const avgPrice = totalValue / totalProducts;
      
      // Products added in the last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentProducts = products.filter(product => 
        new Date(product.created_at) > weekAgo
      ).length;

      setStats({
        totalProducts,
        totalValue: totalValue.toFixed(2),
        avgPrice: avgPrice.toFixed(2),
        recentProducts
      });
    }
  }, [products]);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Admin navigation items
  const adminActions = [
    {
      title: 'Add New Product',
      description: 'Create and upload new products to your store',
      icon: '➕',
      path: '/admin/add',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'View All Products',
      description: 'Manage, edit, and delete existing products',
      icon: '📦',
      path: '/admin/products',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Orders Management',
      description: 'View and manage customer orders',
      icon: '🛍️',
      path: '/admin/orders',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View sales reports and analytics',
      icon: '📊',
      path: '/admin/analytics',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-tr from-[#101720] to-[#212a37] py-5 px-5 md:px-10"
      style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Welcome Header border border-[#822b5c] */}
        <div className="bg-gradient-to-tr from-[#f5ebf1] to-[#b3a9a9] rounded-2xl shadow-md shadow-gray-300 p-6 mb-8">
          <div className="text-center">
            <h1 className="text-gray-800 text-3xl md:text-4xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-[#413c3f] text-lg mb-2">
              Welcome back, {user?.email || 'Administrator'}!
            </p>
            <p className="text-[#1d181b] text-xl font-medium">
              You have complete control over your store's products and operations
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#251a22] to-[#2e1f27] border border-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm font-medium">Total Products</p>
                <p className="text-white text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#251a22] to-[#2e1f27] border border-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm font-medium">Total Value</p>
                <p className="text-white text-2xl font-bold">GH¢ {stats.totalValue}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#251a22] to-[#2e1f27] border border-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm font-medium">Average Price</p>
                <p className="text-white text-2xl font-bold">GH¢ {stats.avgPrice}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#251a22] to-[#2e1f27] border border-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm font-medium">Recent (7 days)</p>
                <p className="text-white text-2xl font-bold">{stats.recentProducts}</p>
              </div>
              <div className="text-3xl">🆕</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-tr from-[#e0d9d9b3] to-[#807474] rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="block group hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-6 hover:bg-[#2e1f27] transition-colors h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{action.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{action.title}</h3>
                    <p className="text-[#be9db0] text-sm leading-relaxed">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products Preview */}
        {products.length > 0 && (
          <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Recent Products</h2>
              <Link
                to="/admin/products"
                className="px-4 py-2 bg-[#2e1f27] text-white rounded-xl hover:bg-[#a13a77] transition-colors"
              >
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4"
                >
                  <div className="flex gap-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No img</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">
                        {product.title || 'Untitled'}
                      </h4>
                      <p className="text-[#be9db0] text-sm">GH¢ {product.price || '0.00'}</p>
                      <p className="text-[#be9db0] text-xs">
                        {product.shade} • {product.finish}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center text-[#be9db0] py-8">
                <p>No products yet. Start by adding your first product!</p>
              </div>
            )}
          </div>
        )}

        {/* Admin Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6">
          <h3 className="text-white text-xl font-bold mb-4">💡 Admin Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div className="flex items-start gap-3">
              <span className="text-yellow-300">•</span>
              <p className="text-sm">Keep product images high quality and consistent</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-300">•</span>
              <p className="text-sm">Write detailed product descriptions for better sales</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-300">•</span>
              <p className="text-sm">Regular price updates help maintain competitiveness</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-300">•</span>
              <p className="text-sm">Monitor recent products to track your progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;