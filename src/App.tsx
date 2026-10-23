import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';

import { ScrollToTop } from './components/layout/ScrollToTop';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { ContactUs } from './pages/ContactUs';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StaticPage } from './pages/StaticPage';
import { OrderSuccess } from './pages/OrderSuccess';
import { BlogList } from './pages/BlogList';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { SettingsProvider } from './context/SettingsContext';



import { WhatsAppFloat } from './components/layout/WhatsAppFloat';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white w-full max-w-full">
      <div className="w-full max-w-full flex-1">
        {/* Fixed / Sticky Header Container across all mobile and desktop viewports */}
        <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
          <AnnouncementBar />
          <Navbar />
        </header>
        <Outlet />
      </div>
      <Footer />
      <Toast />
      <WhatsAppFloat />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Main Fashion Storefront */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order-success/:orderId" element={<OrderSuccess />} />
              <Route path="profile" element={<Profile />} />

              <Route path="contact" element={<ContactUs />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogPostDetail />} />
              <Route path="pages/:slug" element={<StaticPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

          {/* Admin routes redirect to home on storefront (Admin has separate web portal) */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </ShopProvider>
  );
}

export default App;
