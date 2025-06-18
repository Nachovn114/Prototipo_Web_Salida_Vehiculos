import React from 'react';
import { Card } from 'antd';
import { Row, Col, Statistic, Button, Tooltip } from 'antd';
import { CarOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, GlobalOutlined, WarningOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Area } from 'recharts';
import { Car, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const metricData = [
  {
    title: 'Solicitudes Activas',
    value: 42,
    icon: <Car className="h-12 w-12 text-blue-600" />, 
    color: 'bg-blue-50 border-blue-200',
    text: 'text-blue-900',
    border: 'border-blue-200',
  },
  {
    title: 'Tiempo Promedio',
    value: '15 min',
    icon: <Clock className="h-12 w-12 text-green-600" />, 
    color: 'bg-green-50 border-green-200',
    text: 'text-green-900',
    border: 'border-green-200',
  },
  {
    title: 'Inspecciones Completadas',
    value: 156,
    icon: <CheckCircle className="h-12 w-12 text-purple-600" />, 
    color: 'bg-purple-50 border-purple-200',
    text: 'text-purple-900',
    border: 'border-purple-200',
  },
  {
    title: 'Sincronización',
    value: '98 %',
    icon: <RefreshCw className="h-12 w-12 text-red-600 animate-spin-slow" />, 
    color: 'bg-red-50 border-red-200',
    text: 'text-red-900',
    border: 'border-red-200',
  },
];

const flujoDiario = [
  { hora: '06:00', vehiculos: 23 },
  { hora: '08:00', vehiculos: 45 },
  { hora: '10:00', vehiculos: 38 },
  { hora: '12:00', vehiculos: 42 },
  { hora: '14:00', vehiculos: 35 },
  { hora: '16:00', vehiculos: 28 },
  { hora: '18:00', vehiculos: 20 },
];

const changelog = [
  { version: 'v1.0.0', desc: 'Implementación inicial del sistema', date: '17/06/2025' },
  { version: 'v0.9.0', desc: 'Pruebas de integración', date: '20/06/2025' },
  { version: 'v0.8.0', desc: 'Desarrollo de módulos principales', date: '25/06/2025' },
];

const Dashboard: React.FC = () => {
  // Estado de conexión simulado
  const argentinaOnline = false;

  React.useEffect(() => {
    toast.success('¡Bienvenido al Panel de Control!', { description: 'Sistema listo para operar 🚗🎉' });
  }, []);

  return (
    <div className="min-h-screen px-2 py-6 md:px-8 bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 tracking-tight font-sans text-left">Panel de Control</h1>
        {/* Métricas */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {metricData.map((metric) => (
            <div
              key={metric.title}
              className={`rounded-2xl shadow-lg ${metric.color} ${metric.border} ${metric.text} flex flex-col items-center justify-center py-8 px-4 border transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group`}
              style={{ minHeight: 180 }}
            >
              <div className="mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <div className="text-lg font-semibold mb-1 text-center">{metric.title}</div>
              <div className="text-4xl font-extrabold text-center">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Gráfico de flujo diario y estado de conexión */}
        <Row gutter={[32, 32]} className="mb-8">
          <Col xs={24} md={16}>
            <Card
              title={<span className="font-semibold text-blue-800">Flujo Diario de Vehículos</span>}
              bordered={false}
              style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.07)', borderRadius: 18 }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={flujoDiario} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="vehiculos" stroke="#2563eb" strokeWidth={3} dot={{ r: 8, stroke: '#fff', strokeWidth: 2, fill: '#2563eb', className: 'transition-all duration-300' }} activeDot={{ r: 12, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 3, className: 'transition-all duration-300' }} isAnimationActive={true} animationDuration={1800} animationEasing="ease-in-out" >
                    <Area type="monotone" dataKey="vehiculos" stroke="#2563eb" fillOpacity={0.18} fill="#2563eb" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              title={<span className="font-semibold text-blue-800">Estado de Conexión</span>}
              bordered={false}
              style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.07)', borderRadius: 18 }}
            >
              <div className="flex flex-col items-center justify-center py-6">
                <Tooltip title={argentinaOnline ? 'Conectado' : 'Sin conexión'}>
                  <span className={`rounded-full p-4 ${argentinaOnline ? 'bg-green-100' : 'bg-red-100'} mb-2 animate-pulse`}>
                    {argentinaOnline ? <GlobalOutlined style={{ color: '#22c55e', fontSize: 40 }} /> : <WarningOutlined style={{ color: '#ef4444', fontSize: 40 }} />}
                  </span>
                </Tooltip>
                <div className={`text-lg font-bold ${argentinaOnline ? 'text-green-700' : 'text-red-700'}`}>Argentina {argentinaOnline ? 'Online' : 'Sin conexión'}</div>
                <div className="text-gray-500 text-sm mt-1">Última verificación: 10:12</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Changelog y versión */}
        <Row gutter={[32, 32]} className="mb-10">
          <Col xs={24} md={8}>
            <Card
              title={<span className="font-semibold text-blue-800">Versión y Cambios</span>}
              bordered={false}
              style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.07)', borderRadius: 18 }}
            >
              <div className="mb-2 text-blue-700 font-bold text-lg">v1.0.0</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {changelog.map((c, i) => (
                  <li key={i} className="flex flex-col">
                    <span className="font-semibold">{c.version}</span>
                    <span>{c.desc}</span>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <div className="flex flex-col md:flex-row gap-4 h-full items-end justify-end">
              <Button type="primary" size="large" icon={<CarOutlined />} className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg transition-all duration-200">
                Nueva Inspección
              </Button>
              <Button size="large" style={{ background: '#6d28d9', color: '#fff', border: 'none' }} icon={<CheckCircleOutlined />} className="shadow-lg transition-all duration-200">
                Subir Documento
              </Button>
              <Button size="large" style={{ background: '#059669', color: '#fff', border: 'none' }} icon={<SyncOutlined />} className="shadow-lg transition-all duration-200">
                Ver Reportes
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
