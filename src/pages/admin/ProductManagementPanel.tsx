import React, { useState, useRef } from 'react';
import ProductForm from './ProductForm';
import TopProducts from './TopProducts'; // Mantener TopProducts como una vista secundaria si es relevante
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

const ProductManagementPanel: React.FC = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts(); // Asumimos que ProductContext tendrá deleteProduct y updateProduct
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const panelRef = useRef<HTMLDivElement>(null); // Ref para el scroll

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    panelRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll al editar
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(productId); // Asumimos que deleteProduct toma un ID
    }
  };

  const handleFormSubmit = (product: Product) => {
    if (editingProduct) {
      updateProduct(product); // Asumimos que updateProduct recibe el producto actualizado
      setEditingProduct(null);
    } else {
      addProduct(product);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6" ref={panelRef}>
      <div className="flex-1 space-y-6">
        <ProductForm onAddProduct={handleFormSubmit} productToEdit={editingProduct} /> {/* Pasar producto para edición */}
        
        {/* Aquí podemos listar todos los productos para edición/eliminación */}
        <div className="bg-gray-800 rounded-lg shadow p-4 text-white">
          <h2 className="text-xl font-bold mb-4">Listado de Productos</h2>
          <ul>
            {products.map(prod => (
              <li key={prod.codigo} className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0">
                <span>{prod.nombre} ({prod.codigo})</span>
                <div>
                  <button 
                    onClick={() => handleEdit(prod)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(prod.codigo)} 
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="w-full lg:w-80 mt-6 lg:mt-0">
        <TopProducts products={products} />
      </aside>
    </div>
  );
};

export default ProductManagementPanel;