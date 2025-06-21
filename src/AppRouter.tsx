import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';

// Componente para manejar la lógica de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole');
      const isLoginPage = location.pathname === '/login';
      
      // Solo redirigir si no hay usuario y no está en la página de login
      if (!userRole && !isLoginPage) {
        navigate('/login', { replace: true });
      } 
      // Solo redirigir si está en login y ya está autenticado
      else if (userRole && isLoginPage) {
        navigate('/', { replace: true });
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [location, navigate]);

  if (isLoading) {
    return <SplashScreen isVisible={true} onComplete={() => {}} />;
  }

  return <>{children}</>;
};

// Componente principal del enrutador
export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AppRouter;
