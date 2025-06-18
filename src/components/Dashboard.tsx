import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Car, CheckCircle, AlertTriangle, TrendingUp, FileText, Bell, Server, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Row, Col, Statistic } from 'antd';
import { 
  CarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  SyncOutlined 
} from '@ant-design/icons';

const userRole = localStorage.getItem('userRole') || 'inspector';
const userName = {
  conductor: 'Conductor',
  inspector: 'Inspector García',
  aduanero: 'Aduanero Soto',
  admin: 'Administrador',
}[userRole] || 'Usuario';

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fechaActual = new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  // Datos simulados
  const stats = [
    {
      title: 'Solicitudes Hoy',
      value: 18,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Rechazadas Hoy',
      value: 2,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Promedio de Salida',
      value: '14 min',
      icon: Car,
      color: 'text-emerald-600',
    },
    {
      title: 'En Inspección',
      value: 3,
      icon: CheckCircle,
      color: 'text-amber-600',
    },
  ];

  const notificaciones = [
    { tipo: 'alerta', mensaje: 'Sistema argentino no responde', fecha: 'Hoy 10:12' },
    { tipo: 'info', mensaje: 'Nuevo protocolo de revisión implementado.', fecha: 'Hoy 09:15' },
    { tipo: 'sistema', mensaje: 'Sincronización exitosa con SII.', fecha: 'Ayer 18:22' },
  ];

  // Estado de sincronización
  const syncArgentina = false; // Simula caída
  const syncSII = true; // Simula OK

  // Simulación de solicitudes recientes
  const solicitudesRecientes = [
    { id: 1, conductor: 'Juan Pérez', patente: 'ABCD-12', estado: 'Pendiente' },
    { id: 2, conductor: 'María Silva', patente: 'EFGH-34', estado: 'Verificando' },
    { id: 3, conductor: 'Carlos Rodríguez', patente: 'IJKL-56', estado: 'Aprobado' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 md:px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Solicitudes Activas"
              value={42}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tiempo Promedio"
              value="15"
              suffix="min"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#059669' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inspecciones Completadas"
              value={156}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#7c3aed' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sincronización"
              value={98}
              suffix="%"
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Estado del Sistema">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Disponibilidad</span>
                  <span>99.9%</span>
                </div>
                <Progress percent={99.9} status="active" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Tiempo de Respuesta</span>
                  <span>0.8s</span>
                </div>
                <Progress percent={85} status="active" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Errores (24h)</span>
                  <span>0.1%</span>
                </div>
                <Progress percent={99.9} status="active" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Versión del Sistema">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Versión Actual</span>
                <span className="text-blue-600">v1.0.0</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Última actualización: 15/03/2024</p>
                <p>Estado: Estable</p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Historial de Cambios</h4>
                <ul className="text-sm space-y-2">
                  <li>• v1.0.0 - Implementación inicial del sistema</li>
                  <li>• v0.9.0 - Pruebas de integración</li>
                  <li>• v0.8.0 - Desarrollo de módulos principales</li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Encabezado destacado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-1 tracking-tight drop-shadow-sm flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-700" /> Panel de Control - Frontera Chile ↔ Argentina
          </h1>
          <p className="text-gray-600 text-base md:text-lg">{fechaActual} — <span className="font-semibold text-blue-800">{userName}</span> <span className="text-xs text-blue-500 ml-2">({userRole.charAt(0).toUpperCase() + userRole.slice(1)})</span></p>
        </div>
        {/* Accesos rápidos solo para inspector y admin */}
        {(userRole === 'inspector' || userRole === 'admin') && (
          <div className="flex gap-2 flex-wrap mt-2 md:mt-0">
            <Link to="/inspecciones" className="inline-flex items-center px-5 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors text-base">
              <Car className="h-5 w-5 mr-2" /> Nueva Inspección
            </Link>
            <Link to="/documentos" className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition-colors text-base">
              <FileText className="h-5 w-5 mr-2" /> Subir Documento
            </Link>
            {location.pathname !== '/reportes' && (
              <Link to="/reportes" className="inline-flex items-center px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold shadow hover:bg-emerald-700 transition-colors text-base">
                <TrendingUp className="h-5 w-5 mr-2" /> Ver Reportes
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Contenido según rol */}
      {userRole === 'conductor' ? (
        <Card className="shadow-lg border-2 border-blue-50 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Estado de Documentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">SOAP: Válido</Badge>
                <Badge className="bg-green-100 text-green-800">Licencia: Válido</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Revisión Técnica: Pendiente</Badge>
              </div>
              <div className="mt-4 text-blue-900 font-semibold">Estado general: <span className="text-emerald-600">Apto para salida</span></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-50 bg-white/90">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className={`rounded-full p-3 bg-blue-100 ${stat.color} shadow-inner`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-blue-900 drop-shadow-sm">{stat.value}</div>
                  <CardDescription className="text-gray-600 text-base font-medium">{stat.title}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Estado de sincronización y alertas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-2 border-blue-50 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Server className="h-5 w-5 text-blue-600" />
                  <span>Sincronización con Sistemas Externos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-700" />
                    <span className="font-medium">Argentina</span>
                    <Badge className={syncArgentina ? 'bg-green-500' : 'bg-red-500'}>
                      {syncArgentina ? 'Conectado' : 'Caído'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-blue-700" />
                    <span className="font-medium">SII</span>
                    <Badge className={syncSII ? 'bg-green-500' : 'bg-red-500'}>
                      {syncSII ? 'Conectado' : 'Caído'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Panel de alertas */}
            <Card className="shadow-lg border-2 border-blue-50 bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Alertas del Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-blue-50">
                  {notificaciones.map((n, i) => (
                    <li key={i} className="py-2 flex items-center gap-3">
                      {n.tipo === 'alerta' ? <AlertTriangle className="h-4 w-4 text-red-500" /> : n.tipo === 'sistema' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                      <span className="text-sm text-gray-700 flex-1">{n.mensaje}</span>
                      <span className="text-xs text-gray-400">{n.fecha}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Mini gráfico de flujo vehicular (simulado) */}
          <Card className="shadow-lg border-2 border-blue-50 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Flujo Vehicular - Últimas 24h</span>
              </CardTitle>
              <CardDescription className="text-gray-700">
                Cantidad de vehículos procesados por hora en el paso Los Libertadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { hora: '06:00 - 08:00', vehiculos: 23, capacidad: 85 },
                  { hora: '08:00 - 10:00', vehiculos: 45, capacidad: 95 },
                  { hora: '10:00 - 12:00', vehiculos: 38, capacidad: 80 },
                  { hora: '12:00 - 14:00', vehiculos: 42, capacidad: 90 },
                  { hora: '14:00 - 16:00', vehiculos: 35, capacidad: 75 }
                ].map((periodo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{periodo.hora}</span>
                      <span className="font-semibold text-blue-900">{periodo.vehiculos} vehículos</span>
                    </div>
                    <Progress value={periodo.capacidad} className="h-2 bg-blue-200" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabla de solicitudes recientes */}
          <Card className="shadow-lg border-2 border-blue-50 bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Solicitudes Recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left font-semibold">ID</th>
                      <th className="px-4 py-2 text-left font-semibold">Conductor</th>
                      <th className="px-4 py-2 text-left font-semibold">Patente</th>
                      <th className="px-4 py-2 text-left font-semibold">Estado</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudesRecientes.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-blue-50">
                        <td className="px-4 py-2">{s.id}</td>
                        <td className="px-4 py-2">{s.conductor}</td>
                        <td className="px-4 py-2">{s.patente}</td>
                        <td className="px-4 py-2">
                          <Badge className={s.estado === 'Aprobado' ? 'bg-green-100 text-green-800' : s.estado === 'Verificando' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>{s.estado}</Badge>
                        </td>
                        <td className="px-4 py-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/solicitud/${s.id}`)}>
                            Ver Detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
