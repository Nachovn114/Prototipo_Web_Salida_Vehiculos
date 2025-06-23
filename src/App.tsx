import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Páginas de autenticación
import Login from './pages/Login';
import RegistroConductor from './pages/RegistroConductor';

// Páginas del conductor
import DashboardConductor from './pages/Dashboard';
import EstadoSolicitud from './pages/conductor/EstadoSolicitud';
import Documentos from './pages/conductor/Documentos';
import DeclaracionCarga from './pages/conductor/DeclaracionCarga';
import ComprobanteSalida from './pages/conductor/ComprobanteSalida.tsx';

// Páginas del inspector
import DashboardInspector from './pages/inspector/Dashboard';
import ValidacionDocumentos from './pages/inspector/ValidacionDocumentos';

// Páginas del administrador
import DashboardAdmin from './pages/admin/Dashboard';

// Otras páginas
import NotFound from './pages/NotFound';
import AccesoNoAutorizado from './pages/AccesoNoAutorizado.tsx';
import RegistroExitoso from '@/pages/RegistroExitoso';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroConductor />} />
        <Route path="/registro-exitoso" element={<RegistroExitoso />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/acceso-no-autorizado" element={<AccesoNoAutorizado />} />
        
        {/* Rutas protegidas - Conductor */}
        <Route
          path="/conductor"
          element={
            <ProtectedRoute roles={['conductor']}>
              <DashboardConductor />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardConductor />} />
          <Route path="solicitudes" element={<EstadoSolicitud />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="declaracion-carga" element={<DeclaracionCarga />} />
          <Route path="comprobante" element={<ComprobanteSalida />} />
        </Route>

        {/* Rutas protegidas - Inspector */}
        <Route
          path="/inspector"
          element={
            <ProtectedRoute roles={['inspector']}>
              <DashboardInspector />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardInspector />} />
          <Route path="validacion" element={<ValidacionDocumentos />} />
        </Route>

        {/* Rutas protegidas - Administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['administrador']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
        </Route>

        {/* Otras rutas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Ruta de error 404 - debe ser la última ruta */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
