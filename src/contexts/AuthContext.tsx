import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'conductor' | 'inspector' | 'aduanero' | 'admin';

interface User {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  // Add any additional user fields as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  // Add other auth methods as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored user session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; role: UserRole }) => {
    setLoading(true);
    try {
      // Replace this with your actual authentication API call
      // const response = await api.post('/auth/login', credentials);
      
      // Mock response for now
      const mockUser: User = {
        id: '123',
        email: credentials.email,
        name: 'Test User',
        role: credentials.role,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect based on role
      switch(credentials.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'aduanero':
          navigate('/aduanero/dashboard');
          break;
        case 'inspector':
          navigate('/inspector/dashboard');
          break;
        case 'conductor':
        default:
          navigate('/conductor/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};