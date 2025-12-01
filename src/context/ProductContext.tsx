import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from 'types';
import productosData from 'data/productos.json';
import { storageService } from 'services/storageService'; // CAMBIO: Importar el servicio

// --- Definición del Contexto ---
interface ProductContextType {
  products: Product[];
  addProduct: (newProduct: Product) => void;
  updateProduct: (updatedProduct: Product) => void; // Nueva función
  deleteProduct: (productCode: string) => void;     // Nueva función
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
      // CAMBIO: Usar storageService.local en lugar de sessionStorage
      const storedProducts = storageService.local.get<Product[]>('products');
      if (storedProducts) {
        setProducts(storedProducts);
      } else {
        setProducts(productosData);
        // CAMBIO: Usar storageService.local para guardar
        storageService.local.set('products', productosData);
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
      // CAMBIO: Usar storageService.local para guardar
      storageService.local.set('products', updatedProducts);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    try {
      const updatedProducts = products.map((prod) =>
        prod.codigo === updatedProduct.codigo ? updatedProduct : prod
      );
      setProducts(updatedProducts);
      storageService.local.set('products', updatedProducts);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const deleteProduct = (productCode: string) => {
    try {
      const updatedProducts = products.filter((prod) => prod.codigo !== productCode);
      setProducts(updatedProducts);
      storageService.local.set('products', updatedProducts);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};