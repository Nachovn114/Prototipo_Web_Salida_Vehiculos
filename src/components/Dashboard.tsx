import React from 'react';
import { Card } from 'antd';
import { Row, Col, Statistic, Button, Tooltip } from 'antd';
import { CarOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, GlobalOutlined, WarningOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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
  { version: 'v1.0.0', desc: 'Implementación inicial del sistema', date: '15/03/2024' },
  { version: 'v0.9.0', desc: 'Pruebas de integración', date: '10/03/2024' },
  { version: 'v0.8.0', desc: 'Desarrollo de módulos principales', date: '01/03/2024' },
];

const Dashboard: React.FC = () => {
  // Estado de conexión simulado
  const argentinaOnline = false;

  return (
    <div className="min-h-screen px-4 py-10 md:px-10 bg-gradient-to-br from-white via-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900 tracking-tight">Panel de Control</h1>
        {/* Métricas */}
        <Row gutter={[32, 32]} className="mb-10">
          {metricData.map((metric) => (
            <Col xs={24} sm={12} md={6} key={metric.title}>
              <Card
                bordered={false}
                style={{ boxShadow: '0 4px 24px rgba(37,99,235,0.07)', borderRadius: 18, minHeight: 120 }}
                className="h-full hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ color: metric.color, fontSize: 32 }}>{metric.icon}</span>
                  <span className="text-gray-600 font-semibold text-lg">{metric.title}</span>
                </div>
                <Statistic
                  value={metric.value}
                  valueStyle={{ color: metric.color, fontWeight: 700, fontSize: 32 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Gráfico de flujo diario y estado de conexión */}
        <Row gutter={[32, 32]} className="mb-10">
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
                  <Line type="monotone" dataKey="vehiculos" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
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
