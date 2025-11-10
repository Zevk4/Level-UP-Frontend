import { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, AuthResult, User } from '../types';
// Asumimos que usersData se importa directamente como un array, pero TypeScript no es estricto con el tipo 'role'
import usersData from '../data/users.json'; 

// Crear el contexto con valor por defecto undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Aplicamos una aserción de tipo al JSON importado una vez, para asegurar que TS lo vea como User[]
const typedUsersData = usersData as User[];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar usuario desde sessionStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error al cargar usuario desde sessionStorage:', error);
        sessionStorage.removeItem('loggedInUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = (email: string, password: string): AuthResult => {
    try {
      // Buscar en usuarios precargados (JSON)
      // Usamos typedUsersData que ya tiene la aserción de tipo User[]
      const foundUser = typedUsersData.find( 
        (u: User) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData: AuthUser = {
          nombre: foundUser.nombre,
          email: foundUser.email,
          role: foundUser.role
        };

        setUser(userData);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

        return { 
          success: true, 
          user: userData,
          message: '¡Inicio de sesión exitoso!' 
        };
      }

      // Si no está en los precargados, buscar en localStorage (usuarios registrados)
      // ⭐ MODIFICACIÓN CLAVE: Aplicamos aserción de tipo 'as User[]' al resultado de JSON.parse
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[]; 
      const localUser = localUsers.find(
        (u: User) => u.email === email && u.password === password
      );

      if (localUser) {
        const userData: AuthUser = {
          nombre: localUser.nombre,
          email: localUser.email,
          role: localUser.role || 'user'
        };

        setUser(userData);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

        return { 
          success: true, 
          user: userData,
          message: '¡Inicio de sesión exitoso!' 
        };
      }

      return { 
        success: false, 
        message: 'Email o contraseña incorrectos' 
      };

    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: 'Error al iniciar sesión. Intenta nuevamente.' 
      };
    }
  };

  // Función de registro
  const register = (nombre: string, email: string, password: string): AuthResult => {
    try {
      // Verificar si el email ya existe en usuarios precargados
      const existsInPreUsers = typedUsersData.some((u: User) => u.email === email);
      if (existsInPreUsers) {
        return { 
          success: false, 
          message: 'El email ya está registrado' 
        };
      }

      // Verificar si el email ya existe en localStorage
      // ⭐ MODIFICACIÓN CLAVE: Aplicamos aserción de tipo 'as User[]' al resultado de JSON.parse
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[]; 
      const existsInLocalUsers = localUsers.some((u: User) => u.email === email);

      if (existsInLocalUsers) {
        return { 
          success: false, 
          message: 'El email ya está registrado' 
        };
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now(),
        nombre,
        email,
        password,
        role: 'cliente'
      };

      // Guardar en localStorage
      localUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(localUsers));

      return { 
        success: true, 
        message: '¡Registro exitoso! Ahora puedes iniciar sesión' 
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: 'Error al registrar. Intenta nuevamente.' 
      };
    }
  };

  // Función de logout
  const logout = (): void => {
    try {
      sessionStorage.removeItem('loggedInUser');
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Proveer el contexto
  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};