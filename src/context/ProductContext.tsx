import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- CAMBIO: Usando rutas absolutas desde la carpeta 'src/' ---
import { Product } from 'types/index'; 
import productosData from 'data/productos.json'; // Carga inicial

// --- Definición del Contexto ---
interface ProductContextType {
  products: Product[];
  addProduct: (newProduct: Product) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedProducts = sessionStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(productosData);
        sessionStorage.setItem('products', JSON.stringify(productosData));
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProducts(productosData);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = (newProduct: Product) => {
    try {
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      sessionStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};