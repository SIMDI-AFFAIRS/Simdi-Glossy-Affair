import { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { scrollToTopManually } from './utilities/ScrollToTop';
import MainLayout from './layout/MainLayout';
import PageNotFound from './pages/PageNotFound';
import { NavBarProvider } from './context/NavBarContext';
import { EcommerceProvider } from './context/EcommerceContext';
import { Toaster } from 'react-hot-toast'
// import App from '../../../portfolio/client/src/App'
// import Scroll from '../../../portfolio/client/src/components/Scrolls/ScrollToTop'

// Lazy load the components
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const UserPage = lazy(() => import('./pages/userPage'));
const CheckOut = lazy(() => import('./pages/ShippingPage'));
const LogInPage = lazy(() => import('./components/Users/LogIn'));
const SignUpPage = lazy(() => import('./components/Users/SignUp'));
const PasswordForgotPage = lazy(() => import('./components/Users/ForgetPassword'));
const PasswordResetPage = lazy(() => import('./components/Users/ResetPassword'));
// Wrapper Component to handle route refreshing
const RouteWrapper = ({ children }) => {
  const location = useLocation();

  const handleNav = (e) => {
    // If clicking a link or current path, refresh the page
    const clickedPath = e.target.getAttribute('href' || 'to');

    if (clickedPath === location.pathname) {
      e.preventDefault();

      // Scroll to top before refreshing
      scrollToTopManually()

      // Allow a short delay before reloading for smooth UX
      setTimeout(() => {
        window.location.reload();
      }, 50); // Adjustable
    }
  };

  return (
    <div onClick={handleNav}>
      {children}
    </div>
  )
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={
        <RouteWrapper>
          <MainLayout />
        </RouteWrapper>
      }>
        <Route index element={ <HomePage/> } />
        <Route path='/shop' element={ <ShopPage/> } />
        <Route path='/cart' element={ <CartPage/> } />
        <Route path='/cart' element={ <CartPage/> } />
        <Route path='/checkout' element={ <CheckOut/> } />
        <Route path='/admin' element={ <AdminPage/> } />
        <Route path='/profile' element={ <UserPage/> } />
        <Route path='/login' element={ <LogInPage/> } />
        <Route path='/signup' element={ <SignUpPage/> } />
        <Route path='/forgot-password' element={ <PasswordForgotPage/> } />
        <Route path='/reset-password' element={ <PasswordResetPage/> } />
        <Route path='*' element={ <PageNotFound /> } />
      </Route>
    )
  );

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <EcommerceProvider>
        <NavBarProvider>
          <RouterProvider router={router} />
        </NavBarProvider>
      </EcommerceProvider>
    </>
  )
}

export default App