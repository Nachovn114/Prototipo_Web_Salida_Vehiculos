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

const metricData = [
  {
    title: 'Solicitudes Activas',
    value: 42,
    icon: <CarOutlined />, 
    color: '#2563eb',
  },
  {
    title: 'Tiempo Promedio',
    value: '15 min',
    icon: <ClockCircleOutlined />, 
    color: '#059669',
  },
  {
    title: 'Inspecciones Completadas',
    value: 156,
    icon: <CheckCircleOutlined />, 
    color: '#7c3aed',
  },
  {
    title: 'Sincronización',
    value: '98 %',
    icon: <SyncOutlined />, 
    color: '#dc2626',
  },
];

const Dashboard: React.FC = () => {
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
    <div className="dashboard-bg min-h-screen px-4 py-8 md:px-10 md:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Panel de Control</h1>
        {/* Métricas */}
        <Row gutter={[24, 24]} className="mb-8">
          {metricData.map((metric) => (
            <Col xs={24} sm={12} md={6} key={metric.title}>
              <Card
                bordered={false}
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderRadius: 16 }}
                className="h-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: metric.color, fontSize: 28 }}>{metric.icon}</span>
                  <span className="text-gray-500 font-medium text-base">{metric.title}</span>
                </div>
                <Statistic
                  value={metric.value}
                  valueStyle={{ color: metric.color, fontWeight: 700, fontSize: 28 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Paneles de sistema */}
        <Row gutter={[24, 24]} className="mb-10">
          <Col xs={24} md={14}>
            <Card
              title={<span className="font-semibold text-blue-800">Estado del Sistema</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderRadius: 16 }}
            >
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Disponibilidad</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <Progress percent={99.9} status="active" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Tiempo de Respuesta</span>
                    <span className="font-semibold">0.8s</span>
                  </div>
                  <Progress percent={85} status="active" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Errores (24h)</span>
                    <span className="font-semibold">0.1%</span>
                  </div>
                  <Progress percent={99.9} status="active" showInfo={false} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card
              title={<span className="font-semibold text-blue-800">Versión Actual</span>}
              bordered={false}
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderRadius: 16 }}
              extra={<span className="text-blue-600 font-bold">v1.0.0</span>}
            >
              <div className="text-sm text-gray-700 mb-2">
                <div>Última actualización: <b>15/03/2024</b></div>
                <div>Estado: <span className="text-green-600 font-semibold">Estable</span></div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Historial de Cambios</h4>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• v1.0.0 - Implementación inicial del sistema</li>
                  <li>• v0.9.0 - Pruebas de integración</li>
                  <li>• v0.8.0 - Desarrollo de módulos principales</li>
                </ul>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Acciones principales */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button type="primary" size="large" icon={<CarOutlined />} className="bg-blue-600 hover:bg-blue-700 border-none">
            Nueva Inspección
          </Button>
          <Button size="large" style={{ background: '#6d28d9', color: '#fff', border: 'none' }} icon={<CheckCircleOutlined />}>
            Subir Documento
          </Button>
          <Button size="large" style={{ background: '#059669', color: '#fff', border: 'none' }} icon={<SyncOutlined />}>
            Ver Reportes
          </Button>
        </div>

        {/* Título inferior */}
        <div className="bg-white rounded-xl shadow p-6 mt-2">
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
            <CarOutlined /> Panel de Control - Frontera Chile Argentina
          </h2>
          <div className="text-gray-500 text-base">
            martes, 17 de junio de 2025 — <span className="font-semibold text-blue-700">Inspector García</span> <span className="text-xs text-blue-400">(Inspector)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
