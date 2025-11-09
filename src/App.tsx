import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa el layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Importa las Páginas
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage'; 

// 1. Importar la nueva página de detalle (¡NUEVO!)
import ProductDetailPage from './pages/ProductDetailPage';
// 1. ¡Importa el nuevo componente!
import ScrollToTop from './components/utils/ScrollToTop';

// 1. Importar la nueva página de "Todos los Productos"
import AllProductsPage from './pages/AllProductsPage';

// 1. Importar la nueva página de búsqueda
import SearchPage from './pages/SearchPage';

const App: React.FC = () => {
  return (
    // Envolvemos todo en <Router>
    <Router>
      {/* 2. ¡Añádelo aquí! Justo dentro del Router */}
      <ScrollToTop />

      {/* 2. Div principal con Flexbox para sticky footer */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />

        {/* 3. Main ocupa el espacio restante */}
        <main className="container my-4" style={{ flexGrow: 1 }}>
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<HomePage />} />

            {/* Ruta de ejemplo para categorías */}
            <Route path="/category" element={<CategoryPage />} />

            {/* 2. Ruta de detalle del producto (¡NUEVO!) */}
            <Route path="/product/:codigo" element={<ProductDetailPage />} />

            {/* 2. Añadir la nueva ruta */}
            <Route path="/products" element={<AllProductsPage />} />

            {/* 2. Añadir la nueva ruta de búsqueda */}
            <Route path="/search" element={<SearchPage />} />

            {/* Ruta 'catch-all' para 404 */}
            <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;