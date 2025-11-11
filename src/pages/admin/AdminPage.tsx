import React, { useContext } from 'react';
// Usamos las rutas relativas que hemos confirmado que funcionan
import { AuthContext } from '../../context/AuthContext'; 
import { AuthContextType } from '../../types/index';
import { useProducts } from '../../context/ProductContext'; 
import ProductForm from '../../pages/admin/ProductForm'; 
import TopProducts from '../../pages/admin/TopProducts'; 

const AdminPage: React.FC = () => {
  // Contexto de autenticación (para el saludo y logout)
  const authContext = useContext<AuthContextType | undefined>(AuthContext);
  if (authContext === undefined) {
    throw new Error('AdminPage debe ser usado dentro de un AuthProvider');
  }
  const { user, logout } = authContext;
  
  // Consumimos el contexto de productos
  const { products, addProduct, loading } = useProducts();

  // Lógica de 'loading'
  if (loading) {
    return (
      // Corregimos el layout quitando el margen negativo '-m-4'.
      <div className="bg-gray-900 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Cargando Productos desde la Base de Datos...</h1>
      </div>
    )
  }

  return (
    // Corregimos el layout quitando el margen negativo '-m-4'.
    <div className="bg-gray-900 text-white font-roboto p-6">
      
      {/* 'bg-gray-800' usará tu 'fondo-oscuro' gracias al config. */}
      <header className="bg-gray-800 shadow p-4 flex items-center justify-start mb-6">
        <div className="flex items-center gap-4">
          <img src="/Icon_Level_UP_Basico.png" alt="Logo" className="h-12" />
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
        </div>
      </header> {/* <-- Esta era la etiqueta que faltaba */}

      {/* Esta es la sección que faltaba */}
      <div className="flex gap-6"> 
        <div className="flex-1 space-y-6">
          {/* Pasamos la función 'addProduct' del contexto */}
          <ProductForm onAddProduct={addProduct} />
        </div>
        <aside className="w-80">
          {/* 'products' es la lista actualizada de Firestore */}
          <TopProducts products={products} />
        </aside>
      </div>
    </div>
  );
};

export default AdminPage;