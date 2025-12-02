import { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, AuthResult, LoginResponse } from 'types';

import { storageService } from 'services/storageService';
import { apiService } from 'services/apiService';
import { AxiosError } from 'axios';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}



// Type guard to validate the AuthUser object structure
const isAuthUser = (obj: any): obj is AuthUser => {
  return (
    obj &&
    typeof obj.nombre === 'string' &&
    typeof obj.email === 'string' &&
    ['ADMIN', 'VENDEDOR', 'CLIENTE'].includes(obj.role)
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar usuario desde el almacenamiento al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = storageService.local.get<AuthUser>('loggedInUser');
        // Validar la integridad de los datos antes de usarlos
        if (storedUser && isAuthUser(storedUser)) {
          setUser(storedUser);
        } else if (storedUser) {
          // Si los datos existen pero son inválidos, se limpian.
          console.warn('Invalid user data found in storage. Clearing.');
          storageService.local.remove('loggedInUser');
        }
      } catch (error) {
        console.error('Error al cargar usuario desde localStorage:', error);
        storageService.local.remove('loggedInUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {  
    try {  
      const response = await apiService.post('/auth/login', { email, password });  
      const { user, token } = response.data as LoginResponse;  
        
      localStorage.setItem('token', token);  
      storageService.local.set('loggedInUser', user);  
      setUser(user);  
      return { success: true, user, message: 'Login exitoso' };  
    } catch (error) {  
      return { success: false, message: 'Credenciales inválidas' };  
    }  
  }

  const register = async (nombre: string, email: string, password: string, role: string = 'CLIENTE'): Promise<AuthResult> => {
    try {
      await apiService.post('/auth/register', { nombre, email, password, role });
      return { success: true, message: 'Registro exitoso. Por favor inicia sesión.' };
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        return { success: false, message: 'El email ya está registrado.' };
      }
      return { success: false, message: 'Error al registrar. Intenta nuevamente.' };
    }
  };

  // Función de logout
  const logout = (): void => {
    try {
      storageService.local.remove('loggedInUser');
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};