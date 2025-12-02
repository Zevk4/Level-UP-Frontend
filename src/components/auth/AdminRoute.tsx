import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
  
import { AuthContext } from 'context/AuthContext'; 
import { AuthContextType } from 'types'; 

const AdminRoute: React.FC = () => {
  // 1. Usamos el hook useContext de React para leer nuestro AuthContext
  const context = useContext<AuthContextType | undefined>(AuthContext);

  // 2. Verificamos que el contexto exista
  if (context === undefined) {
    throw new Error('AdminRoute debe ser usado dentro de un AuthProvider');
  }

  // 3. Obtenemos el usuario y el estado de carga
  const { user, loading } = context;

  // 4. Esperamos a que el contexto termine de leer el sessionStorage
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 5. Verificamos si el usuario es admin
  if (!user || user.role !== 'ADMIN') {
    // Si no hay usuario o no es admin, redirige a la página de inicio
    return <Navigate to="/" replace />;
  }

  // 6. Si es admin, permite el acceso a la página anidada (AdminPage)
  return <Outlet />;
};

export default AdminRoute;