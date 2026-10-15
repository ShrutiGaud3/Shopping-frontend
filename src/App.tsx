import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
import { SettingsProvider } from './context/SettingsContext';

import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminContactMessages } from './pages/admin/AdminContactMessages';

import { WhatsAppFloat } from './components/layout/WhatsAppFloat';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full overflow-x-hidden">
        <AnnouncementBar />
        <Navbar />
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
              <Route path="profile" element={<Profile />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="pages/:slug" element={<StaticPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

          {/* Admin Management Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminContactMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </ShopProvider>
  );
}

export default App;
