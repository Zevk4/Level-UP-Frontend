import { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser, AuthResult, User } from 'types';
import usersData from 'data/users.json';
import { storageService } from 'services/storageService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const typedUsersData = usersData as User[];

// Type guard to validate the AuthUser object structure
const isAuthUser = (obj: any): obj is AuthUser => {
  return (
    obj &&
    typeof obj.nombre === 'string' &&
    typeof obj.email === 'string' &&
    ['admin', 'vendedor', 'cliente'].includes(obj.role)
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

  // Función de login
  const login = (email: string, password: string): AuthResult => {
    // !! NOTA DE SEGURIDAD !!
    // La validación de contraseña NUNCA debe hacerse en el frontend.
    // Esto es solo una simulación. En una aplicación real, el email y la contraseña
    // se enviarían a un servidor seguro que haría la verificación con un hash.
    try {
      // Buscar en datos estáticos
      let foundUser = typedUsersData.find((u) => u.email === email);

      // Si no se encuentra, buscar en usuarios registrados localmente
      if (!foundUser) {
        const localUsers = storageService.local.get<User[]>('users') || [];
        foundUser = localUsers.find((u) => u.email === email);
      }

      if (foundUser) {
        // En una app real, aquí se compararía el hash de la contraseña.
        // Como esto es solo frontend, simulamos un éxito si el usuario existe.
        const userData: AuthUser = {
          nombre: foundUser.nombre,
          email: foundUser.email,
          role: foundUser.role,
        };

        setUser(userData);
        storageService.local.set('loggedInUser', userData);

        return {
          success: true,
          user: userData,
          message: '¡Inicio de sesión exitoso!',
        };
      }

      return {
        success: false,
        message: 'Email o contraseña incorrectos',
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error al iniciar sesión. Intenta nuevamente.',
      };
    }
  };

  // Función de registro
  const register = (nombre: string, email: string, password: string): AuthResult => {
    // !! NOTA DE SEGURIDAD !!
    // NUNCA guardes contraseñas en texto plano. En una aplicación real,
    // la contraseña se enviaría a un servidor para ser "hasheada" y almacenada de forma segura.
    try {
      const existsInPreUsers = typedUsersData.some((u) => u.email === email);
      if (existsInPreUsers) {
        return {
          success: false,
          message: 'El email ya está registrado',
        };
      }

      const localUsers = storageService.local.get<User[]>('users') || [];
      const existsInLocalUsers = localUsers.some((u) => u.email === email);

      if (existsInLocalUsers) {
        return {
          success: false,
          message: 'El email ya está registrado',
        };
      }

      const newUser: User = {
        id: Date.now(),
        nombre,
        email,
        // NUNCA hacer esto en producción. Solo para simulación de un hash.
        password: `hashed_${password}_demo`,
        role: 'cliente',
      };

      localUsers.push(newUser);
      storageService.local.set('users', localUsers);

      return {
        success: true,
        message: '¡Registro exitoso! Ahora puedes iniciar sesión',
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error al registrar. Intenta nuevamente.',
      };
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