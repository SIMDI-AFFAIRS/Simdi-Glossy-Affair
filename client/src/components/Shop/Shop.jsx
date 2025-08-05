import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import ShopItems from "./ShopItems";
import useEcommerce from "../../context/EcommerceContext";
import PopUp from "../Animation/PopUp";
import PassKey from "../Admin/PassKey";

const Shop = () => {
  const { products, searchProducts, fetchProducts, addToCart } = useEcommerce();
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 NEW

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await fetchProducts();
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [fetchProducts]);

  const handlePopUp = () => {
    setQuery('');
    setIsPopUpOpen(true);
  };

  const handleOnClose = () => {
    setIsPopUpOpen(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === 'admin') {
        handlePopUp();
      } else if (query.trim() !== '') {
        searchProducts(query);
      } else {
        fetchProducts();
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, searchProducts, fetchProducts]);

  if (selectedItem) {
    return (
      <ShopItems item={selectedItem} setSelectedItem={setSelectedItem} selectedItem={selectedItem} />
    );
  }

  return (
    <>
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

              {/* ✅ Loading Spinner or Product Grid */}
              <div className="p-4">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <section className="w-40 h-40 flex items-center justify-center relative">
                      <div className="absolute inset-0 w-full h-full border-t-transparent border-b-transparent border-4 rounded-full animate-spin"></div>
                      <div className="text-center text-base text-[#181113] font-normal font-sans tracking-tightest py-10 animate-pulse relative">
                        Loading products...
                      </div>
                    </section>
                  </div>
                ) : Array.isArray(products) && products.length > 0 ? (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                    {products.map((product) => (
                      <div key={product.id} className={`flex flex-col gap-3 p-1.5 rounded-xl bg-white/60 shadow-lg ${query.trim() !== '' ? 'w-full h-full md:w-[200px] md:h-[280px]' : ''}`}>
                        <div
                          className="w-full h-fit bg-center bg-no-repeat aspect-square bg-cover rounded-xl shop-item cursor-pointer border border-gray-400 shadow-lg"
                          style={{ backgroundImage: `url(${product.imageUrl})` }}
                          onClick={() => setSelectedItem(product)}
                        />
                        <div className="w-full h-full flex flex-col justify-between">
                          <p onClick={() => setSelectedItem(product)} className="text-[#181113] text-base font-medium leading-normal ml-1 cursor-pointer w-fit">
                            <span>{product.title}</span>
                          </p>
                          <div className="flex items-center justify-between px-2 mt-2">
                            <p className="text-gray-800 font-semibold text-shadow-lg text-shadow-gray-500/20 text-lg leading-normal">
                              {product.price}
                            </p>
                            <button
                              onClick={() => addToCart(product.id)}
                              className="flex items-center justify-center flex-row space-x-2 px-3 py-1 border border-black rounded-lg cursor-pointer text-[#180e11] bg-[#ac9f9f]"
                            >
                              <p className="hidden md:flex">Add to</p>
                              <p className="size-4 sm:size-5">
                                <ShoppingCart className="w-full h-full" />
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
    </>
  );
};

export default Shop;