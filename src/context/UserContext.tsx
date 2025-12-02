import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types'; // Ajusta la ruta de importación si es necesario
import { apiService } from '../services/apiService';

// --- Definición del Contexto ---
interface UserContextType {
  users: User[];
  // Actualizamos para que retornen Promesas y el formulario pueda usar await
  addUser: (newUser: User) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers debe ser usado dentro de un UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await apiService.get('/users');
      setUsers(response.data as User[]);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (newUser: User) => {
    try {
      // --- CORRECCIÓN AQUÍ: Agregamos "/create" ---
      const response = await apiService.post('/users/create', newUser);
      setUsers(prev => [...prev, response.data as User]);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error; // Lanzamos el error para que el formulario sepa que falló
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      // Nota: Verifica si tu backend usa /users/{id} o /users/update/{id}
      // Por estándar suele ser directo al ID, así que lo dejo así:
      const response = await apiService.put(`/users/${updatedUser.id}`, updatedUser);
      setUsers(prev => prev.map(user => (user.id === updatedUser.id ? response.data as User : user)));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await apiService.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};