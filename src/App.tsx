import { Routes, Route, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import RevisionCarga from './components/RevisionCarga';
import Reportes from './pages/Reportes';
import Calidad from './pages/Calidad';
import SolicitudDetalle from './pages/SolicitudDetalle';
import Inspecciones from './pages/Inspecciones';
import Documentos from './pages/Documentos';
import Acerca from './pages/Acerca';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Ayuda from './pages/Ayuda';
import SplashScreen from './components/SplashScreen';
import PreDeclaracion from './pages/PreDeclaracion';
import RegistroActividad from './pages/RegistroActividad';
import { useEffect, useState } from 'react';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, roles = [] }: { children: React.ReactNode, roles?: string[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole') || 'conductor';
      const isLoginPage = location.pathname === '/login';
      
      // Si no hay usuario, redirigir a login
      if (!userRole && !isLoginPage) {
        navigate('/login', { replace: true });
      } 
      // Si está en login y ya está autenticado, redirigir al dashboard
      else if (userRole && isLoginPage) {
        navigate('/', { replace: true });
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [location, navigate]);
  
  const userRole = localStorage.getItem('userRole') || 'conductor';
  
  // Verificar si el usuario tiene los roles necesarios
  const hasRequiredRole = roles.length === 0 || roles.includes(userRole);
  
  if (isLoading) {
    return <SplashScreen isVisible={true} onComplete={() => {}} />;
  }
  
  if (!hasRequiredRole) {
    // Redirigir al dashboard si no tiene permisos
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Componente para el layout principal con autenticación
const AuthenticatedLayout = () => {
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas con layout principal */}
      <Route element={
        <ProtectedRoute>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="pre-declaracion" element={<PreDeclaracion />} />
        <Route path="revision-carga" element={<RevisionCarga />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="calidad" element={<Calidad />} />
        <Route path="solicitud/:id" element={<SolicitudDetalle />} />
        <Route path="inspecciones" element={<Inspecciones />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="acerca" element={<Acerca />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="ayuda" element={<Ayuda />} />
        
        {/* Ruta de administración con protección de roles */}
        <Route 
          path="admin/registro-actividad" 
          element={
            <ProtectedRoute roles={['admin']}>
              <RegistroActividad />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
