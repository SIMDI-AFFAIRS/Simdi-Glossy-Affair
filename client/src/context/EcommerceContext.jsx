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
  const [cartTotal, setCartTotal] = useState(0);

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
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
    if (error) {
      toast.error(error.message);
      throw error;
    };
    setUser(data.user);
    return data?.user;
  };

  // Auth: Signup
  const signup = async (email, password, onAfterSignup) => {
    const { data, error } = await supabase.auth.signUp({ 
      email: email, 
      password: password, 
      options: {
        emailRedirectTo: 'https://glossy-affair.mandc2025.org/email-confirmed',
      },
    });
    if (error.message === 'User already registered') {
      toast.error('User already registered');
      // throw error;
    } 
    // else if (error) {
    //   toast.error(error.message);
    //   throw error;
    // };

    // If user is created, add to profiles table
    const user = data?.user;
    if (user) {
      await supabase.from('profiles').insert({ id: user.id, email: user.email });
    }

    if (onAfterSignup) {
      onAfterSignup();
    }
  };

  // Auth: Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    console.log('User logged out');
    toast.success('Logged out successfully');
window.location.reload();
  };

  // Fetch all products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    setProducts(data);
    // console.log('Products fetched:', data);
  };

  // Search products
  const searchProducts = async (query) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${query}%`);
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
          image_url,
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

      // Compute total quantity
      const total = formattedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartTotal(total);
    }

    setCartLoading(false);
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

  // Adding Items
  const itemIncrement = async (productId) => {
    if (!user) return;

    const existingItem = cart.find((item) => item.product_id === productId);
    if (!existingItem) return;

    const { error } = await supabase
      .from('cart')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);

    if (error) {
      console.error('Error incrementing item:', error.message);
      console.log('Error incrementing item:', error.message);
      toast.error('Could not increase quantity');
    } else {
      fetchCartForUser();
    }
  };

  const itemDecrement = async (productId) => {
    if (!user) return;

    const existingItem = cart.find((item) => item.product_id === productId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity - 1 })
        .eq('id', existingItem.id);

      if (error) {
        console.error('Error decrementing item:', error.message);
        console.log('Error decrementing item:', error.message);
        toast.error('Could not decrease quantity');
      } else {
        fetchCartForUser();
      }
    } else {
      // If quantity is 1 remove the item
      await removeFromCart(existingItem.id);
    }
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
        itemIncrement,
        itemDecrement,
        cartTotal,
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
