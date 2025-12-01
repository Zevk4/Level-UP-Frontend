import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'types';
import usersData from 'data/users.json';
import { storageService } from 'services/storageService';

// --- Definición del Contexto ---
interface UserContextType {
  users: User[];
  addUser: (newUser: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: number) => void;
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

  useEffect(() => {
    setLoading(true);
    try {
      const storedUsers = storageService.local.get<User[]>('users');
      if (storedUsers) {
        setUsers(storedUsers);
      } else {
        setUsers(usersData as User[]);
        storageService.local.set('users', usersData as User[]);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsers(usersData as User[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = (newUser: User) => {
    try {
      // Asignar un ID único al nuevo usuario
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const userWithId = { ...newUser, id: newId };
      const updatedUsers = [...users, userWithId];
      setUsers(updatedUsers);
      storageService.local.set('users', updatedUsers);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      storageService.local.set('users', updatedUsers);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const deleteUser = (userId: number) => {
    try {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      storageService.local.set('users', updatedUsers);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};