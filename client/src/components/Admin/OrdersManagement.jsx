import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import useEcommerce from '../../context/EcommerceContext';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  const { orders, setOrders } = useEcommerce();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  console.log('orders in stock: ', orders);

  // Order statuses
  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-500' },
    { value: 'shipped', label: 'Shipped', color: 'bg-orange-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
  ];

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (
            email,
            full_name,
            phone
          ),
          order_items (
            *,
            products (
              title,
              image_url,
              price
            )
          )
        `)
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filteredOrders = orders.filter(order => {
      const matchesSearch = order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id?.toString().includes(searchTerm) ||
                          order.profiles?.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filteredOrders.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'total' || sortBy === 'total_amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'created_at' || sortBy === 'updated_at') {
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

    return filteredOrders;
  };

  const filteredOrders = getFilteredAndSortedOrders();

  // Calculate order statistics
  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    return { total, pending, delivered, totalRevenue };
  };

  const stats = getOrderStats();

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

  // Get status color
  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-500';
  };

  useEffect(() => {
    fetchOrders();
  }, [sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-[#a75e5eb3] to-[#ac9f9f] flex items-center justify-center">
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div
        className="min-h-screen w-full bg-[#2a2a2a] py-5 px-5 md:px-10 font-[Plus_Jakarta_Sans,_Noto_Sans,_sans-serif]"
    >
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-tr from-[#a75e5eb3] to-[#807474] rounded-2xl shadow-lg p-6">
        
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Orders Management ({filteredOrders.length})
          </h1>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-[#2e1f27] cursor-pointer border border-white/80 text-white rounded-xl hover:bg-[#a13a77] transition-all transform duration-200 hover:scale-[1.08]"
          >
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm">Total Orders</p>
                <p className="text-white text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="text-2xl">📦</div>
            </div>
          </div>
          
          <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm">Pending</p>
                <p className="text-white text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </div>
          
          <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm">Delivered</p>
                <p className="text-white text-2xl font-bold">{stats.delivered}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          
          <div className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#be9db0] text-sm">Revenue</p>
                <p className="text-white text-2xl font-bold">GH¢ {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 placeholder:text-[#be9db0] px-4 text-base focus:outline-none focus:border-[#822b5c]"
            />
            <span className='absolute top-2 right-3'>
              <button onClick={() => setSearchTerm('')} className='flex items-center justify-between py-1 px-3 bg-white rounded-full font-semibold border border-[#2e1f27] text-black cursor-pointer transition-all transform duration-200 hover:scale-[1.03]'>X</button>
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl cursor-pointer text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c"
            >
              <option value="all">All Status</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl cursor-pointer text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c]"
            >
              <option value="created_at">Date Created</option>
              <option value="updated_at">Last Updated</option>
              <option value="total_amount">Total Amount</option>
              <option value="status">Status</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-xl cursor-pointer text-white border border-[#5c3d4f] bg-[#2e1f27] h-12 px-4 text-base focus:outline-none focus:border-[#822b5c]"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-xl">No orders found</p>
            <p className="text-[#be9db0] mt-2">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No orders have been placed yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#251a22] border border-[#822b5c] rounded-xl p-4 hover:bg-[#2e1f27] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg">
                        Order #{order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#be9db0]">Customer:</p>
                        <p className="text-white">
                          {order.profiles?.full_name || 'N/A'}
                        </p>
                        <p className="text-[#be9db0]">{order.profiles?.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#be9db0]">Phone:</p>
                        <p className="text-white">{order.profiles?.phone || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-[#be9db0]">Total Amount:</p>
                        <p className="text-white font-semibold text-lg">
                          GH¢ {parseFloat(order.total_amount || 0).toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-[#be9db0]">Order Date:</p>
                        <p className="text-white">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[#be9db0] text-sm mb-2">
                          Items ({order.order_items.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.order_items.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-white text-sm bg-[#2e1f27] px-2 py-1 rounded">
                              {item.products?.title || 'Unknown'} x{item.quantity}
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="text-[#be9db0] text-sm px-2 py-1">
                              +{order.order_items.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="rounded-xl text-white border border-[#5c3d4f] bg-[#2e1f27] h-10 px-3 text-sm focus:outline-none focus:border-[#822b5c]"
                    >
                      {orderStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2e1f27] rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">
                Order Details #{selectedOrder.id}
              </h3>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="text-[#be9db0] hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h4 className="text-white text-lg font-semibold">Order Items:</h4>
              {selectedOrder.order_items?.map((item, index) => (
                <div key={index} className="bg-[#251a22] rounded-lg p-4 flex gap-4">
                  {item.products?.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="text-white font-medium">
                      {item.products?.title || 'Unknown Product'}
                    </h5>
                    <p className="text-[#be9db0] text-sm">
                      Quantity: {item.quantity} × GH¢ {item.products?.price || '0.00'}
                    </p>
                    <p className="text-white font-semibold">
                      Subtotal: GH¢ {((item.quantity || 1) * parseFloat(item.products?.price || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-[#822b5c] pt-4">
                <div className="text-right">
                  <p className="text-white text-xl font-bold">
                    Total: GH¢ {parseFloat(selectedOrder.total_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;