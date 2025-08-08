import { useEffect, useState, useCallback, useMemo, Component } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import ShopItems from "./ShopItems";
import useEcommerce from "../../context/EcommerceContext";
import PopUp from "../Animation/PopUp";
import PassKey from "../Admin/PassKey";

// Error Boundary Component
class ShopErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Shop component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#ac9f9f]">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Unable to load the shop. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#ac9f9f] text-white rounded-lg hover:bg-[#9a8c8c]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Shop = () => {
  const { 
    products, searchProducts, fetchProducts, cart, user, 
    fetchCartForUser, addToCart, itemIncrement, itemDecrement 
  } = useEcommerce();
  
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productsWithCartControls, setProductsWithCartControls] = useState(new Set());
  
  // 🎯 TIP 2: Loading states for operations
  const [operationLoading, setOperationLoading] = useState(new Set());
  
  // 🎯 TIP 3: Optimistic updates state
  const [optimisticCart, setOptimisticCart] = useState({});

  // 🎯 TIP 1: useCallback for performance
  const handlePopUp = useCallback(() => {
    setQuery('');
    setIsPopUpOpen(true);
  }, []);

  const handleOnClose = useCallback(() => {
    setIsPopUpOpen(false);
  }, []);

  const handleCartIconClick = useCallback((productId) => {
    setProductsWithCartControls(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  // 🎯 Enhanced cart operations with loading states and optimistic updates
  const handleAddToCart = useCallback(async (productId) => {
    try {
      setOperationLoading(prev => new Set([...prev, `add-${productId}`]));
      
      // Optimistic update
      setOptimisticCart(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
      
      await addToCart(productId);
      handleCartIconClick(productId);
      
      // Clear optimistic update after success
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      console.error('Error adding to cart:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`add-${productId}`);
        return newSet;
      });
    }
  }, [addToCart, handleCartIconClick]);

  const handleIncrement = useCallback(async (productId) => {
    try {
      setOperationLoading(prev => new Set([...prev, `inc-${productId}`]));
      
      // Optimistic update
      const currentItem = cart.find(c => c.product_id === productId);
      const currentQuantity = currentItem?.quantity || 0;
      setOptimisticCart(prev => ({
        ...prev,
        [productId]: currentQuantity + 1
      }));
      
      await itemIncrement(productId);
      
      // Clear optimistic update after success
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      console.error('Error incrementing item:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`inc-${productId}`);
        return newSet;
      });
    }
  }, [itemIncrement, cart]);

  const handleDecrement = useCallback(async (productId) => {
    try {
      setOperationLoading(prev => new Set([...prev, `dec-${productId}`]));
      
      // Optimistic update
      const currentItem = cart.find(c => c.product_id === productId);
      const currentQuantity = currentItem?.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity - 1);
      
      // 🎯 Enhanced UX: Only hide manually toggled controls when quantity reaches 0
      // Cart items with actual quantity will auto-hide when displayQuantity becomes 0
      if (newQuantity === 0 && productsWithCartControls.has(productId)) {
        setProductsWithCartControls(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
      
      setOptimisticCart(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
      
      await itemDecrement(productId);
      
      // Clear optimistic update after success
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticCart(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      // Revert cart controls visibility for manually toggled items
      const currentItem = cart.find(c => c.product_id === productId);
      if (currentItem && currentItem.quantity > 0) {
        setProductsWithCartControls(prev => new Set([...prev, productId]));
      }
      console.error('Error decrementing item:', error);
    } finally {
      setOperationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(`dec-${productId}`);
        return newSet;
      });
    }
  }, [itemDecrement, cart, productsWithCartControls]);

  // Memoized search handler
  const handleSearch = useCallback((searchQuery) => {
    if (searchQuery.trim().toLowerCase() === 'admin') {
      handlePopUp();
    } else if (searchQuery.trim() !== '') {
      searchProducts(searchQuery);
    } else {
      fetchProducts();
    }
  }, [searchProducts, handlePopUp]);

  // 🎯 TIP 1: Memoized cart lookup for performance
  const cartLookup = useMemo(() => {
    return cart.reduce((acc, item) => {
      acc[item.product_id] = item;
      return acc;
    }, {});
  }, [cart]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await fetchProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();

    if (user) {
      fetchCartForUser();
    }
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, handleSearch]);

  if (selectedItem) {
    return (
      <ShopErrorBoundary>
        <ShopItems item={selectedItem} setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
      </ShopErrorBoundary>
    );
  }

  return (
    <ShopErrorBoundary>
      <div className="relative flex size-full min-h-screen flex-col bg-[#ac9f9f] group/design-root overflow-x-hidden" style={{ fontFamily: "Plus Jakarta Sans", "Noto Sans": "sans-serif" }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-3 md:px-10 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-none flex-1">
              <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                    <div className="text-[#88636f] flex border-none bg-[#f4f0f2] items-center justify-center pl-4 rounded-l-xl border-r-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <input
                      placeholder="Search Products..."
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181113] focus:outline-0 focus:ring-0 border-none bg-[#f4f0f2] focus:border-none h-full placeholder:text-[#88636f] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <section className="w-40 h-40 flex items-center justify-center relative">
                      <div className="text-center text-base text-[#181113] font-normal font-sans tracking-tightest py-10 animate-pulse relative">
                        Loading products...
                      </div>
                    </section>
                  </div>
                ) : Array.isArray(products) && products.length > 0 ? (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                    {products.map(product => {
                      // 🎯 Use memoized cart lookup and optimistic updates
                      const cartItem = cartLookup[product.id];
                      const optimisticQuantity = optimisticCart[product.id];
                      const displayQuantity = optimisticQuantity !== undefined ? optimisticQuantity : (cartItem?.quantity || 0);
                      
                      // 🎯 Enhanced UX: Show controls if item is in cart OR manually toggled
                      const showCartControls = displayQuantity > 0 || productsWithCartControls.has(product.id);
                      const isAddingToCart = operationLoading.has(`add-${product.id}`);
                      const isIncrementing = operationLoading.has(`inc-${product.id}`);
                      const isDecrementing = operationLoading.has(`dec-${product.id}`);

                      return (
                        <div key={product.id} className={`flex flex-col gap-3 p-1.5 rounded-xl bg-white/60 shadow-lg ${query.trim() !== '' ? 'w-full h-full md:w-[200px] md:h-[280px]' : ''} transition-all duration-200`}>
                          <div
                            className="w-full h-fit bg-center bg-no-repeat aspect-square bg-cover rounded-xl shop-item cursor-pointer border border-gray-400 shadow-lg hover:shadow-xl transition-shadow duration-200"
                            style={{ backgroundImage: `url(${product.image_url})` }}
                            onClick={() => setSelectedItem(product)}
                          />
                          <div className="w-full h-full flex flex-col justify-between">
                            <p onClick={() => setSelectedItem(product)} className="text-[#181113] text-base font-medium leading-normal ml-1 cursor-pointer w-fit hover:text-[#88636f] transition-colors duration-200">
                              <span>{product.title}</span>
                            </p>
                            <div className={`flex items-center justify-between px-2 mt-2 ${showCartControls ? 'flex-col md:flex-row' : 'flex-row'} gap-2`}>
                              <p className="text-gray-800 font-semibold text-shadow-lg text-shadow-gray-500/20 text-lg leading-normal">
                                GH¢ {product.price}
                              </p>
                              {
                                showCartControls ? (
                                  <div className='flex items-center flex-row'>
                                    <button 
                                      className="border text-[24px] cursor-pointer text-black rounded-full bg-gray-100 w-fit h-[4px] px-2 py-3 my-auto flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                                      type="button" 
                                      onClick={() => handleDecrement(product.id)} 
                                      disabled={displayQuantity <= 0 || isDecrementing}
                                    >
                                      {isDecrementing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <span className="-mt-1 font-bold">-</span>
                                      )}
                                    </button>
                                    
                                    <input 
                                      type="text" 
                                      value={displayQuantity}
                                      readOnly
                                      className={`mx-2 text-center text-lg w-6 h-6 rounded-sm bg-gray-100 text-black border border-gray-900 transition-all duration-200 ${optimisticQuantity !== undefined ? 'ring-2 ring-blue-200' : ''}`}
                                    />

                                    <button 
                                      className="border text-[20px] cursor-pointer text-black rounded-full bg-gray-100 w-fit h-[4px] px-2 py-3 my-auto flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                                      type="button" 
                                      onClick={() => handleIncrement(product.id)}
                                      disabled={isIncrementing}
                                    >
                                      {isIncrementing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <span className="font-bold">+</span>
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product.id);
                                      }}
                                      disabled={isAddingToCart}
                                      className="flex items-center justify-center flex-row space-x-2 px-3 py-1 border border-black rounded-lg cursor-pointer text-[#180e11] bg-[#ac9f9f] hover:bg-[#9a8c8c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isAddingToCart ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <p className="size-4 sm:size-5">
                                          <ShoppingCart className="w-full h-full" />
                                        </p>
                                      )}
                                    </button>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="col-span-full text-center">No products found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopUp isOpen={isPopUpOpen} onClose={setIsPopUpOpen}>
        <PassKey handleOnClose={handleOnClose} />
      </PopUp>
    </ShopErrorBoundary>
  );
};

export default Shop;