import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import CartDrawer from './components/cart/CartDrawer';

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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />

        <main className="container my-4" style={{ flexGrow: 1, padding: '0 20px', maxWidth: '100%' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/product/:codigo" element={<ProductDetailPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
          </Routes>
        </main>

        <Footer />
      </div>

      <CartDrawer />

      {/* Renderizar LoginPage globalmente para que el modal pueda mostrarse desde cualquier parte mediante ModalContext */}
      <LoginPage />
    </Router>
  );
};

export default App;
