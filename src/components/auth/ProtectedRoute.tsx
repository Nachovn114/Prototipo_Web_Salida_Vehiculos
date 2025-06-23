import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Si no hay usuario, redirigir a la página de login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles y el usuario no tiene un rol permitido
  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    // Redirigir a la página de acceso no autorizado o al dashboard
    return <Navigate to="/acceso-no-autorizado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
