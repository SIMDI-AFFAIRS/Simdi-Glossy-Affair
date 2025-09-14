import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useEcommerce from '../../context/EcommerceContext';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { products, orders, setOrders } = useEcommerce();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      growth: 0,
      thisMonth: 0,
      lastMonth: 0
    },
    orders: {
      total: 0,
      pending: 0,
      delivered: 0,
      cancelled: 0,
      growth: 0
    },
    products: {
      total: 0,
      mostPopular: [],
      lowStock: []
    },
    customers: {
      total: 0,
      newThisMonth: 0,
      returning: 0
    }
  });

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch orders with related data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (email, full_name, created_at),
          order_items (
            *,
            products (title, price)
          )
        `);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch customer data
      const { data: customersData, error: customersError } = await supabase
        .from('profiles')
        .select('*');

      if (customersError) throw customersError;

      // Calculate analytics
      calculateAnalytics(ordersData || [], customersData || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics from data
  const calculateAnalytics = (ordersData, customersData) => {
    const now = new Date();
    const daysAgo = new Date(now.getTime() - (parseInt(timeRange) * 24 * 60 * 60 * 1000));
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter orders by time range
    const recentOrders = ordersData.filter(order => new Date(order.created_at) >= daysAgo);
    const thisMonthOrders = ordersData.filter(order => new Date(order.created_at) >= thisMonthStart);
    const lastMonthOrders = ordersData.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    });

    // Revenue calculations
    const totalRevenue = ordersData
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    const thisMonthRevenue = thisMonthOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    const lastMonthRevenue = lastMonthOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
      : 0;

    // Orders statistics
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const deliveredOrders = ordersData.filter(o => o.status === 'delivered').length;
    const cancelledOrders = ordersData.filter(o => o.status === 'cancelled').length;

    const ordersGrowth = lastMonthOrders.length > 0
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100)
      : 0;

    // Product analytics
    const productSales = {};
    ordersData.forEach(order => {
      order.order_items?.forEach(item => {
        const productId = item.product_id;
        const productTitle = item.products?.title || `Product ${productId}`;
        if (!productSales[productId]) {
          productSales[productId] = {
            title: productTitle,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity || 0;
        productSales[productId].revenue += (item.quantity || 0) * parseFloat(item.products?.price || 0);
      });
    });

    const mostPopular = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Customer analytics
    const totalCustomers = customersData.length;
    const newCustomersThisMonth = customersData.filter(customer => 
      new Date(customer.created_at) >= thisMonthStart
    ).length;

    const returningCustomers = ordersData.reduce((acc, order) => {
      const customerId = order.user_id;
      acc[customerId] = (acc[customerId] || 0) + 1;
      return acc;
    }, {});

    const returningCustomerCount = Object.values(returningCustomers).filter(count => count > 1).length;

    setAnalytics({
      revenue: {
        total: totalRevenue,
        growth: revenueGrowth,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        growth: ordersGrowth
      },
      products: {
        total: products.length,
        mostPopular: mostPopular,
        lowStock: [] // You can implement stock tracking if needed
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth,
        returning: returningCustomerCount
      }
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `GH¢ ${parseFloat(amount).toFixed(2)}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Get growth color
  const getGrowthColor = (value) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#a75e5eb3] to-[#ac9f9f] flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-[#2a2a2a] py-5 px-5 md:px-10"
      style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
    >
      <div className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-[#be9db0]">
                Insights and performance metrics for your store
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">💰 Revenue Analytics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#be9db0] text-sm">Total Revenue</p>
                <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue.growth)}`}>
                  {formatPercentage(analytics.revenue.growth)}
                </span>
              </div>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(analytics.revenue.total)}
              </p>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <p className="text-[#be9db0] text-sm mb-2">This Month</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(analytics.revenue.thisMonth)}
              </p>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <p className="text-[#be9db0] text-sm mb-2">Last Month</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(analytics.revenue.lastMonth)}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Analytics */}
        <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">📦 Orders Analytics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#be9db0] text-sm">Total Orders</p>
                <span className={`text-sm font-medium ${getGrowthColor(analytics.orders.growth)}`}>
                  {formatPercentage(analytics.orders.growth)}
                </span>
              </div>
              <p className="text-white text-2xl font-bold">{analytics.orders.total}</p>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#be9db0] text-sm">Pending</p>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-white text-2xl font-bold">{analytics.orders.pending}</p>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#be9db0] text-sm">Delivered</p>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-white text-2xl font-bold">{analytics.orders.delivered}</p>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#be9db0] text-sm">Cancelled</p>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <p className="text-white text-2xl font-bold">{analytics.orders.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Products and Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Products */}
          <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
            <h2 className="text-white text-xl font-bold mb-4">🏆 Top Selling Products</h2>
            
            {analytics.products.mostPopular.length === 0 ? (
              <div className="text-center text-[#be9db0] py-8">
                <p>No sales data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.products.mostPopular.map((product, index) => (
                  <div key={index} className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#822b5c] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-[#be9db0] text-sm">
                            {product.quantity} sold • {formatCurrency(product.revenue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Analytics */}
          <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
            <h2 className="text-white text-xl font-bold mb-4">👥 Customer Analytics</h2>
            
            <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
              <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#be9db0] text-sm">Total Customers</p>
                    <p className="text-white text-2xl font-bold">{analytics.customers.total}</p>
                  </div>
                  <div className="text-3xl">👤</div>
                </div>
              </div>
              
              <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#be9db0] text-sm">New This Month</p>
                    <p className="text-white text-2xl font-bold">{analytics.customers.newThisMonth}</p>
                  </div>
                  <div className="text-3xl">🆕</div>
                </div>
              </div>
              
              <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#be9db0] text-sm">Returning Customers</p>
                    <p className="text-white text-2xl font-bold">{analytics.customers.returning}</p>
                  </div>
                  <div className="text-3xl">🔄</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">📈 Quick Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#be9db0] text-sm">Average Order Value</p>
                  <p className="text-white text-xl font-bold">
                    {analytics.orders.delivered > 0 
                      ? formatCurrency(analytics.revenue.total / analytics.orders.delivered)
                      : formatCurrency(0)
                    }
                  </p>
                </div>
                <div className="text-2xl">💳</div>
              </div>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#be9db0] text-sm">Conversion Rate</p>
                  <p className="text-white text-xl font-bold">
                    {analytics.customers.total > 0 
                      ? `${((analytics.orders.total / analytics.customers.total) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#be9db0] text-sm">Success Rate</p>
                  <p className="text-white text-xl font-bold">
                    {analytics.orders.total > 0 
                      ? `${((analytics.orders.delivered / analytics.orders.total) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#be9db0] text-sm">Total Products</p>
                  <p className="text-white text-xl font-bold">{analytics.products.total}</p>
                </div>
                <div className="text-2xl">📦</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
          <h2 className="text-white text-xl font-bold mb-4">💡 Performance Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">📈 Growth Trends</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">Revenue Growth:</span>
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue.growth)}`}>
                    {formatPercentage(analytics.revenue.growth)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">Orders Growth:</span>
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.orders.growth)}`}>
                    {formatPercentage(analytics.orders.growth)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">New Customers:</span>
                  <span className="text-white text-sm font-medium">
                    {analytics.customers.newThisMonth} this month
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">🎯 Key Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">Pending Orders:</span>
                  <span className="text-yellow-400 text-sm font-medium">
                    {analytics.orders.pending} orders
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">Customer Retention:</span>
                  <span className="text-white text-sm font-medium">
                    {analytics.customers.total > 0 
                      ? `${((analytics.customers.returning / analytics.customers.total) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#be9db0] text-sm">Active Products:</span>
                  <span className="text-white text-sm font-medium">
                    {analytics.products.total} products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-medium transition-colors border border-white ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-[#2e1f27] hover:bg-[#a13a77]'
            }`}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh Analytics'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;