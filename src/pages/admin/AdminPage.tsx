import React, { useContext, useState } from 'react';
// Usamos las rutas relativas que hemos confirmado que funcionan
import { AuthContext } from 'context/AuthContext'; 
import { AuthContextType } from 'types';
import { useProducts } from 'context/ProductContext'; 
import ProductManagementPanel from 'pages/admin/ProductManagementPanel'; // Importar el nuevo componente
import UserManagement from 'pages/admin/UserManagement'; // Importar el nuevo componente
import CategoryManagement from 'pages/admin/CategoryManagement'; // Importar el nuevo componente

const AdminPage: React.FC = () => {
  // Contexto de autenticación (para el saludo y logout)
  const authContext = useContext<AuthContextType | undefined>(AuthContext);
  if (authContext === undefined) {
    throw new Error('AdminPage debe ser usado dentro de un AuthProvider');
  }
  const { user, logout } = authContext;
  
  // Consumimos el contexto de productos
  const { products, addProduct, loading } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'categories'>('products');

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
          <div className="bg-gray-900 text-white font-roboto p-4 sm:p-6">
          
          {/* 'bg-gray-800' usará tu 'fondo-oscuro' gracias al config. */}
          <header className="bg-gray-800 shadow p-4 flex items-center justify-start mb-6">
            <div className="flex items-center gap-4">
              {/* Original Logo and Title for md screens and above */}
              <img src="/Icon_Level_UP_Basico.png" alt="Logo" className="h-12 hidden md:block" />
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
            </div>
          </header> {/* <-- Esta era la etiqueta que faltaba */}
    
          <div className="flex flex-wrap mb-6 border-b border-gray-700">
              <button
                className={`flex-1 sm:flex-none py-2 px-4 text-sm font-medium ${activeTab === 'products' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('products')}
              >
                Gestión de Productos
              </button>
              <button
                className={`flex-1 sm:flex-none py-2 px-4 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('users')}
              >
                Gestión de Usuarios
              </button>
              <button
                className={`flex-1 sm:flex-none py-2 px-4 text-sm font-medium ${activeTab === 'categories' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('categories')}
              >
                Gestión de Categorías
              </button>
            </div>
        <div>
          {activeTab === 'products' && (
            <ProductManagementPanel />
          )}
          {activeTab === 'users' && (
            <UserManagement /> // Usar el componente real
          )}
          {activeTab === 'categories' && (
            <CategoryManagement /> // Usar el componente real
          )}
        </div>
    </div>
  );
};

export default AdminPage;