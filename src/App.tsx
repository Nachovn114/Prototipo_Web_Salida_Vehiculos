import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import ValidacionDocumental from './components/ValidacionDocumental';
import RevisionCarga from './components/RevisionCarga';
import Reportes from './pages/Reportes';
import Calidad from './pages/Calidad';
import SolicitudDetalle from './pages/SolicitudDetalle';
import Inspecciones from './pages/Inspecciones';
import Documentos from './pages/Documentos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="validacion" element={<ValidacionDocumental />} />
          <Route path="revision-carga" element={<RevisionCarga />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="calidad" element={<Calidad />} />
          <Route path="solicitud/:id" element={<SolicitudDetalle />} />
          <Route path="inspecciones" element={<Inspecciones />} />
          <Route path="documentos" element={<Documentos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
