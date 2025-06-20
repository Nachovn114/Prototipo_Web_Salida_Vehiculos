import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, CheckCircle, RefreshCw, Truck, XCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
  { name: 'Lun', livianos: 800, buses: 120, camiones: 280 },
  { name: 'Mar', livianos: 950, buses: 100, camiones: 300 },
  { name: 'Mié', livianos: 700, buses: 90, camiones: 310 },
  { name: 'Jue', livianos: 1100, buses: 130, camiones: 270 },
  { name: 'Vie', livianos: 1600, buses: 180, camiones: 320 },
  { name: 'Sáb', livianos: 2400, buses: 220, camiones: 580 },
  { name: 'Dom', livianos: 2100, buses: 200, camiones: 500 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Dashboard: React.FC = () => {
  const handleRefresh = () => {
    toast.success('Datos actualizados', { description: 'Panel refrescado correctamente' });
  };

  React.useEffect(() => {
    toast.success('¡Bienvenido al Panel de Control!', { description: 'Sistema listo para operar 🚗🎉' });
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 px-0">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Panel de Control</h1>
        <Button 
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
          aria-label="Actualizar datos del panel"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </motion.div>

      {/* Métricas */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div variants={cardVariants}>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Vehículos Pendientes</p>
                  <p className="text-3xl font-bold text-blue-900 group-hover:scale-105 transition-transform duration-200">24</p>
                </div>
                <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Truck className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Aprobados Hoy</p>
                  <p className="text-3xl font-bold text-green-900 group-hover:scale-105 transition-transform duration-200">156</p>
                </div>
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">En Revisión</p>
                  <p className="text-3xl font-bold text-yellow-900 group-hover:scale-105 transition-transform duration-200">8</p>
                </div>
                <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Clock className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Rechazados</p>
                  <p className="text-3xl font-bold text-red-900 group-hover:scale-105 transition-transform duration-200">3</p>
                </div>
                <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <XCircle className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Gráfico Principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" aria-hidden="true" />
              Flujo de Vehículos por Tipo - Últimos 7 Días
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  barGap={4}
                  barCategoryGap={16}
                  className="group"
                  style={{ transition: 'all 0.7s cubic-bezier(.4,2,.3,1)' }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                    formatter={(value, name) => [`${value} vehículos`, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Bar
                    dataKey="livianos"
                    stackId="a"
                    fill="#2563EB"
                    name="Livianos"
                  />
                  <Bar
                    dataKey="buses"
                    stackId="a"
                    fill="#DC2626"
                    name="Buses"
                  />
                  <Bar
                    dataKey="camiones"
                    stackId="a"
                    fill="#38BDF8"
                    name="Camiones"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
