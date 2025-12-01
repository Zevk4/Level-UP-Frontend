import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { CategoryProvider } from './context/CategoryContext'; // Importar CategoryProvider

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <UserProvider>
            <CategoryProvider> {/* Envolver App con CategoryProvider */}
              <App />
            </CategoryProvider>
          </UserProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);