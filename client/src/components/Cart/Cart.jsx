import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEcommerceContext from '../../context/EcommerceContext';

const Cart = () => {
  const {
    cart,
    cartLoading,
    addToCart,
    removeFromCart,
    userProfile,
    fetchCartForUser
  } = useEcommerceContext();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (userProfile) fetchCartForUser();
  }, [userProfile]);

  useEffect(() => {
    const q = {};
    cart.forEach(item => {
      q[item.id] = item.quantity || 1;
    });
    setQuantities(q);
  }, [cart]);

  const handleIncrement = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item) => {
    if ((item.quantity || 1) > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace('$', '') || 0);
    return sum + price * (item.quantity || 1);
  }, 0);
  const taxes = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  // Not logged in
  if (!userProfile) {
    return (
      <section className="p-10 bg-[#ac9f9f]">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-white/80 rounded-xl px-6 py-10 shadow-md max-w-md mx-auto bg-[#88636f] text-white">
          <h2 className="text-2xl font-semibold text-[#181113] mb-4">You're not logged in</h2>
          <p className="text-[#2b2325] mb-6">To view your cart and start shopping, please log in or create an account.</p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-5 py-2 bg-[#574f4f] text-white rounded-full hover:bg-[#a27575] transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 border border-[#ac9f9f] text-[#1a1818] rounded-full hover:bg-[#c5a6a6] transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#ac9f9f] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-5 md:px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
            <h1 className="text-[#181113] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
              Your Cart
            </h1>

            <div className='bg-white/80 px-4 min-h-[72px] py-2 rounded-xl'>
              {cartLoading ? (
                <div className="py-8 text-center text-gray-600">Loading cart...</div>
              ) : cart.length === 0 ? (
                <div className="py-8 text-center text-gray-500">Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 justify-between border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-[#181113] text-base font-medium leading-normal">{item.title}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="flex items-center gap-2 text-[#181113]">
                        <button onClick={() => handleDecrement(item)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f0f2]">-</button>
                        <input
                          className="w-8 text-center bg-transparent"
                          type="number"
                          value={item.quantity || 1}
                          readOnly
                        />
                        <button onClick={() => handleIncrement(item)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f0f2]">+</button>
                        <button onClick={() => handleRemove(item)} className="ml-2 text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && !cartLoading && (
              <section className='border-2 border-gray-600 border-dashed mt-5 rounded-xl bg-[#dfcdcd]'>
                <h3 className="text-[#181113] text-lg font-bold px-4 pt-4 pb-2">Order Summary</h3>
                <div className="p-4">
                  <div className="flex justify-between py-2">
                    <p className="text-[#88636f] text-sm">Subtotal</p>
                    <p className="text-[#181113] text-sm">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-[#88636f] text-sm">Shipping</p>
                    <p className="text-[#181113] text-sm">Free</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-[#88636f] text-sm">Taxes</p>
                    <p className="text-[#181113] text-sm">${taxes.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between py-2">
                    <p className="text-[#88636f] text-sm">Total</p>
                    <p className="text-[#181113] text-sm">${total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex px-4 py-3">
                  <Link
                    to='/checkout'
                    className="flex items-center justify-center w-full h-12 px-5 rounded-full bg-[#ea477d] text-white font-bold"
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
