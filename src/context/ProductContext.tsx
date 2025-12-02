import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from 'types';

 
import { apiService } from 'services/apiService'; // CAMBIO: Importar el servicio

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
    const loadProducts = async () => {
      try {
        const response = await apiService.get('/products');
        setProducts(response.data as Product[]);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addProduct = async (newProduct: Product) => {
    try {
      const request = {
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        precio: newProduct.precio,
        categoria: newProduct.categoria,
        subcategoria: newProduct.subcategoria,
        imagen: newProduct.imagen,
        marca: newProduct.marca
      };
      const response = await apiService.post('/products/create', request);
      setProducts(prev => [response.data as Product, ...prev]);
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const request = {
        nombre: updatedProduct.nombre,
        descripcion: updatedProduct.descripcion,
        precio: updatedProduct.precio,
        categoria: updatedProduct.categoria,
        subcategoria: updatedProduct.subcategoria,
        imagen: updatedProduct.imagen,
        marca: updatedProduct.marca
      };
      const response = await apiService.put(`/products/${updatedProduct.codigo}`, request);
      setProducts(prev => prev.map(prod =>
        prod.codigo === updatedProduct.codigo ? response.data as Product : prod
      ));
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const deleteProduct = async (productCode: string) => {
    try {
      await apiService.delete(`/products/${productCode}`);
      setProducts(prev => prev.filter(prod => prod.codigo !== productCode));
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