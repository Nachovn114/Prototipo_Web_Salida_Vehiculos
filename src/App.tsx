import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import ValidacionDocumental from './components/ValidacionDocumental';
import RevisionCarga from './components/RevisionCarga';
import Reportes from './pages/Reportes';
import Calidad from './pages/Calidad';
import SolicitudDetalle from './pages/SolicitudDetalle';
import Inspecciones from './pages/Inspecciones';
import Documentos from './pages/Documentos';
import Acerca from './pages/Acerca';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="validacion" element={<ValidacionDocumental />} />
        <Route path="revision-carga" element={<RevisionCarga />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="calidad" element={<Calidad />} />
        <Route path="solicitud/:id" element={<SolicitudDetalle />} />
        <Route path="inspecciones" element={<Inspecciones />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="acerca" element={<Acerca />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
