import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import useEcommerce from '../../context/EcommerceContext';
import toast from 'react-hot-toast';

const CheckOut = () => {
  const navigate = useNavigate();
  const { cart, user, cartLoading, fetchCartForUser } = useEcommerce();
  
  const [currentStep, setCurrentStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'Ghana',
    state: 'Greater Accra',
    zipCode: '',
    saveInfo: false,
    paymentMethod: 'mobile_money',
    phoneNumber: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartForUser();
  }, [user, navigate]);

  useEffect(() => {
    // Pre-fill email if user is available
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'zipCode'];
    if (currentStep === 'payment' && formData.paymentMethod === 'mobile_money') {
      required.push('phoneNumber');
    }
    
    for (let field of required) {
      if (!formData[field].trim()) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      if (currentStep === 'shipping') {
        setCurrentStep('payment');
      } else {
        handlePlaceOrder();
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Order placed successfully!');
      // In a real app, you'd clear the cart and redirect to order confirmation
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);
  
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over GH¢100
  const taxes = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + taxes).toFixed(2);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ac9f9f]">
        <div className="text-center">
          <p className="text-white mb-4">Please log in to continue</p>
          <Link to="/login" className="text-[#ea477d] underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ac9f9f]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#ac9f9f]">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center bg-white/80 p-8 rounded-xl">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#88636f] mb-4" />
            <h2 className="text-xl font-bold text-[#181113] mb-2">Your cart is empty</h2>
            <p className="text-[#88636f] mb-4">Add some items to your cart before checking out</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 bg-[#ea477d] text-white rounded-full hover:bg-[#d63d6f] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#ac9f9f] group/design-root overflow-x-hidden" style={{ fontFamily: "Plus Jakarta Sans, Noto Sans, sans-serif" }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-5 md:px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col-reverse lg:flex-row gap-8 max-w-6xl w-full">
            
            {/* Main Form Section */}
            <div className="flex-1 bg-white/90 rounded-xl p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <Link 
                  to="/cart" 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Back to Cart"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-[#181113]">Checkout</h1>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-5 h-5 ${currentStep === 'shipping' ? 'text-[#ea477d]' : 'text-gray-400'}`} />
                    <span className={`font-medium ${currentStep === 'shipping' ? 'text-[#ea477d]' : 'text-gray-400'}`}>
                      Shipping
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 ${currentStep === 'payment' ? 'text-[#ea477d]' : 'text-gray-400'}`} />
                    <span className={`font-medium ${currentStep === 'payment' ? 'text-[#ea477d]' : 'text-gray-400'}`}>
                      Payment
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#e5dcdf] rounded-full h-2">
                  <div 
                    className="bg-[#ea477d] h-2 rounded-full transition-all duration-300"
                    style={{ width: currentStep === 'shipping' ? '50%' : '100%' }}
                  />
                </div>
              </div>

              {/* Form Content */}
              {currentStep === 'shipping' ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#181113] mb-4">Shipping Information</h3>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane.doe@example.com"
                      className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#181113] font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jane"
                        className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#181113] font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                    />
                  </div>

                  {/* Apartment */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-2">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apt 4B"
                      className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Accra"
                      className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                    />
                  </div>

                  {/* Country and State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#181113] font-medium mb-2">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                      >
                        <option value="Ghana">Ghana</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#181113] font-medium mb-2">State/Region *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Greater Accra"
                        className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00233"
                      className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                    />
                  </div>

                  {/* Save Info Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-2 border-[#e5dcdf] text-[#ea477d] focus:ring-[#ea477d]"
                    />
                    <label htmlFor="saveInfo" className="text-[#181113] font-normal">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#181113] mb-4">Payment Information</h3>
                  
                  {/* Payment Method */}
                  <div>
                    <label className="block text-[#181113] font-medium mb-4">Payment Method *</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 border border-[#e5dcdf] rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          id="mobile_money"
                          name="paymentMethod"
                          value="mobile_money"
                          checked={formData.paymentMethod === 'mobile_money'}
                          onChange={handleInputChange}
                          className="text-[#ea477d] focus:ring-[#ea477d]"
                        />
                        <label htmlFor="mobile_money" className="flex-1 font-medium">Mobile Money</label>
                      </div>
                      <div className="flex items-center gap-3 p-4 border border-[#e5dcdf] rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="text-[#ea477d] focus:ring-[#ea477d]"
                        />
                        <label htmlFor="card" className="flex-1 font-medium">Credit/Debit Card</label>
                      </div>
                    </div>
                  </div>

                  {/* Phone Number for Mobile Money */}
                  {formData.paymentMethod === 'mobile_money' && (
                    <div>
                      <label className="block text-[#181113] font-medium mb-2">Mobile Money Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+233 XX XXX XXXX"
                        className="w-full p-4 rounded-xl border border-[#e5dcdf] focus:border-[#ea477d] focus:outline-none focus:ring-2 focus:ring-[#ea477d]/20 transition-colors"
                      />
                    </div>
                  )}

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="text-[#88636f] hover:text-[#181113] font-medium transition-colors"
                  >
                    ← Back to Shipping
                  </button>
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-8">
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full flex items-center justify-center h-12 px-6 bg-[#ea477d] hover:bg-[#d63d6f] text-white font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>
                      {currentStep === 'shipping' ? 'Continue to Payment' : 'Place Order'}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-96">
              <div className="bg-[#dfcdcd] rounded-xl p-6 sticky top-5">
                <h3 className="text-lg font-bold text-[#181113] mb-4">Order Summary</h3>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                      <div
                        className="w-12 h-12 bg-center bg-cover rounded-lg border"
                        style={{ backgroundImage: `url(${item.image_url})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#181113] truncate">{item.title}</p>
                        <p className="text-xs text-[#88636f]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#181113]">
                        GH¢ {((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-gray-400">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#88636f]">Subtotal</span>
                    <span className="text-[#181113]">GH¢ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#88636f]">Shipping</span>
                    <span className="text-[#181113]">
                      {shipping === 0 ? 'Free' : `GH¢ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#88636f]">Taxes</span>
                    <span className="text-[#181113]">GH¢ {taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-400">
                    <span className="text-[#181113]">Total</span>
                    <span className="text-[#181113]">GH¢ {total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 text-center">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;