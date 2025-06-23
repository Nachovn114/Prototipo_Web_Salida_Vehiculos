import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'conductor' | 'inspector' | 'administrador' | 'funcionario';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Aquí iría la lógica para validar el token con el backend
          // Por ahora simulamos un usuario de prueba
          setUser({
            id: '1',
            nombre: 'Usuario de Prueba',
            email: 'usuario@ejemplo.com',
            rol: 'conductor',
          });
        } catch (err) {
          console.error('Error al verificar autenticación:', err);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Aquí iría la llamada real a la API
      // const response = await api.post('/auth/login', { email, password });
      
      // Simulamos una respuesta exitosa
      const response = {
        data: {
          user: {
            id: '1',
            nombre: 'Usuario de Prueba',
            email,
            rol: 'conductor',
          },
          token: 'fake-jwt-token',
        },
      };

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intente nuevamente.');
      console.error('Error al iniciar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Aquí iría la llamada real a la API
      // const response = await api.post('/auth/register', userData);
      
      // Simulamos una respuesta exitosa
      const response = {
        data: {
          user: {
            id: '1',
            nombre: userData.nombre,
            email: userData.email,
            rol: 'conductor',
          },
          token: 'fake-jwt-token',
        },
      };

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar el usuario. Por favor, intente nuevamente.');
      console.error('Error al registrar:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};