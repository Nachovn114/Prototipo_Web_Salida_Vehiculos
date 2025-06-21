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
      const userRole = localStorage.getItem('userRole');
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
  
  const userRole = localStorage.getItem('userRole') || 'user';
  
  if (isLoading) {
    return <SplashScreen isVisible={true} onComplete={() => {}} />;
  }
  
  // Si no hay roles definidos, cualquier usuario autenticado puede acceder
  if (roles.length === 0) return <>{children}</>;
  
  // Si el usuario tiene uno de los roles permitidos, mostrar el contenido
  if (userRole && roles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // Si no tiene permiso, redirigir al dashboard
  return <Navigate to="/" replace />;
};

// Componente para el layout principal con autenticación
const AuthenticatedLayout = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Mostrar splash screen solo en la primera carga
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      localStorage.setItem('hasSeenSplash', 'true');
      const timer = setTimeout(() => setShowSplash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen isVisible={showSplash} onComplete={() => setShowSplash(false)} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={
        <ProtectedRoute>
          <AuthenticatedLayout />
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
