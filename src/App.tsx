import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './components/utils/ScrollToTop';
import CartDrawer from './components/cart/CartDrawer';
import MainLayout from './components/layout/MainLayout';

// Páginas
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AllProductsPage from './pages/AllProductsPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import AdminRoute from './components/auth/AdminRoute';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product/:codigo" element={<ProductDetailPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>

      <CartDrawer />
    </Router>
  );
};

export default App;
