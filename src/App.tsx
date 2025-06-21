import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
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
import Auditoria from './pages/Auditoria';
import { useEffect, useState } from 'react';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, roles = [] }: { children: React.ReactNode, roles?: string[] }) => {
  const userRole = localStorage.getItem('userRole') || 'user';
  
  // Si no hay roles definidos, cualquier usuario autenticado puede acceder
  if (roles.length === 0) return <>{children}</>;
  
  // Si el usuario tiene uno de los roles permitidos, mostrar el contenido
  if (roles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // Si no tiene permiso, redirigir al dashboard
  return <Navigate to="/" replace />;
};

// Componente para el layout principal con autenticación
const AuthenticatedLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Si está en una página de autenticación, no mostrar el layout principal
  if (isAuthPage) return <Outlet />;
  
  // Para el resto de rutas, usar el layout principal
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    // Si no está autenticado y no está en /login, redirigir a login
    if (!userRole && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
    // Si está autenticado y está en /login, redirigir al dashboard
    if (userRole && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Mostrar splash screen solo en la primera carga
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      localStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  return (
    <>
      <SplashScreen isVisible={showSplash} onComplete={handleSplashComplete} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthenticatedLayout />}>
          {/* Rutas públicas */}
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
          
          {/* Ruta de auditoría protegida para administradores */}
          <Route 
            path="admin/auditoria" 
            element={
              <ProtectedRoute roles={['admin']}>
                <Auditoria />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
