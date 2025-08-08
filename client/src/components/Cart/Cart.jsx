import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Trash2 } from 'lucide-react';
import useEcommerce from '../../context/EcommerceContext'; // Fixed import
import NoUser from '../Users/NoUser';

const Cart = () => {
  const {
    cart,
    cartLoading,
    removeFromCart,
    itemIncrement,
    itemDecrement,
    userProfile,
    user,
    fetchCartForUser
  } = useEcommerce(); // Fixed context usage

  const [operationLoading, setOperationLoading] = useState(new Set());

  useEffect(() => {
    // Check for user instead of userProfile for cart fetching
    if (user) {
      fetchCartForUser();
    }
  }, [user]);

  const handleIncrement = async (item) => {
    try {
      setOperationLoading(prev => new Set([...prev, `inc-${item.id}`]));
      await itemIncrement(item.product_id);
    } catch (error) {
      console.error('Error incrementing item:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`inc-${item.id}`);
        return newSet;
      });
    }
  };

  const handleDecrement = async (item) => {
    try {
      setOperationLoading(prev => new Set([...prev, `dec-${item.id}`]));
      await itemDecrement(item.product_id);
    } catch (error) {
      console.error('Error decrementing item:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`dec-${item.id}`);
        return newSet;
      });
    }
  };

  const handleRemove = async (item) => {
    try {
      setOperationLoading(prev => new Set([...prev, `remove-${item.id}`]));
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`remove-${item.id}`);
        return newSet;
      });
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);
  
  const taxes = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  // Not logged in - check for user instead of userProfile
  if (!user) {
    return (
      <NoUser userText='cart' />
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#ac9f9f] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 px-[10px]">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h1 className="text-[#181113] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
              Your Cart
            </h1>

            <div className='bg-white/80 min-h-[72px] py-2 rounded-xl'>
              {cartLoading ? (
                <div className="py-8 text-center text-gray-600 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading cart...
                </div>
              ) : cart.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p className="text-lg mb-2">Your cart is empty.</p>
                  <Link 
                    to="/shop" 
                    className="text-[#ac9f9f] hover:text-[#9a8c8c] underline font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const isIncrementing = operationLoading.has(`inc-${item.id}`);
                  const isDecrementing = operationLoading.has(`dec-${item.id}`);
                  const isRemoving = operationLoading.has(`remove-${item.id}`);
                  
                  return (
                    <div key={item.id} className="flex items-center gap-4 py-3 px-2 justify-between border-b last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 border border-gray-400"
                          style={{ backgroundImage: `url(${item.image_url})` }} // Fixed property name
                        />
                        <div className="flex flex-col justify-center">
                          <p className="text-[#181113] text-base font-medium leading-normal">{item.title}</p>
                          <p className="text-[#88636f] text-sm">GH¢ {item.price}</p>
                        </div>
                      </div>
                      
                      <div className="shrink-0">
                        <div className="flex items-center gap-2 text-[#181113]">
                          <button 
                            onClick={() => handleDecrement(item)} 
                            disabled={isDecrementing || item.quantity <= 0}
                            title='Decrement quantity'
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff] hover:bg-[#f4f0f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-gray-400"
                          >
                            {isDecrementing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <span className="font-bold text-black text-[20px]">-</span>
                            )}
                          </button>
                          
                          <input
                            className="w-12 text-center bg-transparent border border-gray-300 rounded px-1 py-1"
                            type="number"
                            value={item.quantity || 1}
                            readOnly
                          />
                          
                          <button 
                            onClick={() => handleIncrement(item)} 
                            disabled={isIncrementing}
                            title='Increase quantity'
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff] hover:bg-[#f4f0f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-gray-400"
                          >
                            {isIncrementing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <span className="font-bold">+</span>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => handleRemove(item)} 
                            disabled={isRemoving}
                            className="ml-3 p-1 border border-gray-500 text-red-500 hover:text-red-700 hover:bg-white rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from cart"
                          >
                            {isRemoving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        {/* Item total */}
                        <div className="text-center mt-1">
                          <p className="text-sm text-[#88636f] font-medium">
                            Total: GH¢ {((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && !cartLoading && (
              <section className='border-2 border-gray-600 border-dashed mt-5 rounded-xl bg-[#dfcdcd]'>
                <h3 className="text-[#181113] text-lg font-bold px-4 pt-4 pb-2">Order Summary</h3>
                <div className="p-4">
                  <div className="flex justify-between py-2">
                    <p className="text-[#181113] font-normal text-sm">Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</p>
                    <p className="text-[#181113] font-semibold text-sm">GH¢ {subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-[#181113] font-normal text-sm">Shipping</p>
                    <p className="text-[#181113] font-semibold text-sm">Free</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-[#181113] font-normal text-sm">Taxes (8%)</p>
                    <p className="text-[#181113] font-semibold text-sm">GH¢ {taxes.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-400">
                  <div className="flex justify-between py-2">
                    <p className="text-[#181113] text-lg font-bold">Total</p>
                    <p className="text-[#181113] text-lg font-bold">GH¢ {total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex px-4 py-3">
                  <Link
                    to='/checkout'
                    className="flex items-center justify-center w-full h-12 px-5 rounded-2xl bg-[#ea477d] hover:bg-[#d63d6f] text-white font-bold transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;