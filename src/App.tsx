import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AllProductsPage from './pages/AllProductsPage';
import SearchPage from './pages/SearchPage';
import ScrollToTop from './components/utils/ScrollToTop';
import CartDrawer from './components/cart/CartDrawer';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <ScrollToTop />
          <LoginPage />
          <CartDrawer />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main className="container my-4" style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/product/:codigo" element={<ProductDetailPage />} />
                <Route path="/products" element={<AllProductsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;