import { Routes, Route, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
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
import RegistroConductor from './pages/RegistroConductor';
import Ayuda from './pages/Ayuda';
import SplashScreen from './components/SplashScreen';
import PreDeclaracion from './pages/PreDeclaracion';
import RegistroActividad from './pages/RegistroActividad';
import { useEffect, useState } from 'react';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, roles = [] }: { children: React.ReactNode, roles?: string[] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
      
      // Si no está autenticado y no está en la página de login, redirigir a login
      if (!isAuthenticated && !location.pathname.startsWith('/login')) {
        navigate('/login', { state: { from: location }, replace: true });
      }
      // Si está autenticado y está en la página de login, redirigir al dashboard
      else if (isAuthenticated && location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, loading, location, navigate]);
  
  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading || isLoading) {
    return <SplashScreen isVisible={true} onComplete={() => {}} />;
  }

  // Verificar si el usuario tiene los roles necesarios
  const hasRequiredRole = !roles.length || (user && roles.includes(user.role));
  
  // Si está autenticado pero no tiene el rol necesario, mostrar acceso denegado
  if (isAuthenticated && !hasRequiredRole) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </MainLayout>
    );
  }

  // Si está autenticado y tiene el rol necesario, mostrar el contenido
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, redirigir a login (esto es por si acaso)
  return <Navigate to="/login" state={{ from: location }} replace />;
};

// Componente para el layout principal con autenticación
const AuthenticatedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<RegistroConductor />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/revision-carga" element={<RevisionCarga />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/calidad" element={<Calidad />} />
        <Route path="/solicitud/:id" element={<SolicitudDetalle />} />
        <Route path="/inspecciones" element={<Inspecciones />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/pre-declaracion" element={<PreDeclaracion />} />
        <Route path="/registro-actividad" element={<RegistroActividad />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>
      
      {/* Ruta por defecto para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
