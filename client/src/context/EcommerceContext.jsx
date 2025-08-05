import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../lib/supabase';
import toast from "react-hot-toast";

const EcommerceContext = createContext();

export const EcommerceProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Load authenticated user
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Auth: Login
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    return data?.user;
  };

  // Auth: Signup
  const signup = async (email, password, onAfterSignup) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (onAfterSignup) {
      onAfterSignup();
    }
  };

  // Auth: Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Fetch all products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    setProducts(data);
  };

  // Search products
  const searchProducts = async (query) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`);
    if (error) throw error;
    setProducts(data);
  };

  // Add to cart (updates quantity if exists)
  const addToCart = async (productId) => {
    if (!user) return;

    const { data: existing, error: fetchErr } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error('Error checking cart:', fetchErr);
      toast.error('Failed to update cart');
      return;
    }

    let error;

    if (existing) {
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);

      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('cart')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        });

      error = insertError;
    }

    if (error) {
      console.error('Error updating cart:', error);
      toast.error('Could not add item to cart');
    } else {
      toast.success('Item added to cart');
      fetchCartForUser();
    }
  };

  // Fetch cart for current user (with joined product info)
  const fetchCartForUser = async () => {
    if (!user) return;

    setCartLoading(true);

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        products (
          title,
          imageUrl,
          price
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error.message);
      toast.error('Failed to load cart');
    } else {
      const formattedCart = data.map((item) => ({
        ...item,
        ...item.products
      }));
      setCart(formattedCart);
    }

    setCartLoading(false);
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing from cart:', error.message);
      toast.error('Failed to remove item');
    } else {
      toast.success('Item removed from cart');
      fetchCartForUser();
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error) setUserProfile(data);
    setLoadingProfile(false);
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
    await fetchUserProfile();
  };

  // Delete user profile
  const deleteProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (error) throw error;
    setUserProfile(null);
  };

  return (
    <EcommerceContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        products,
        fetchProducts,
        searchProducts,
        cart,
        cartLoading,
        fetchCartForUser,
        addToCart,
        removeFromCart,
        userProfile,
        loadingProfile,
        fetchUserProfile,
        updateProfile,
        deleteProfile,
        orders,
        setOrders
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

const useEcommerce = () => useContext(EcommerceContext);

export default useEcommerce;
