import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Clock, CheckCircle, BarChart, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const indicadores = [
  {
    icon: <Server className="h-7 w-7 text-green-600" />, 
    titulo: 'Disponibilidad',
    valor: '99.6%',
    color: 'bg-green-100 text-green-900',
    descripcion: 'Sistema disponible en el último mes',
  },
  {
    icon: <Clock className="h-7 w-7 text-blue-600" />, 
    titulo: 'Tiempo medio de respuesta',
    valor: '1.4s',
    color: 'bg-blue-100 text-blue-900',
    descripcion: 'Promedio de respuesta a solicitudes',
  },
  {
    icon: <CheckCircle className="h-7 w-7 text-emerald-600" />, 
    titulo: 'Usabilidad',
    valor: '97%',
    color: 'bg-emerald-100 text-emerald-900',
    descripcion: '% de formularios enviados correctamente',
  },
  {
    icon: <BarChart className="h-7 w-7 text-yellow-600" />, 
    titulo: 'Errores críticos',
    valor: '0',
    color: 'bg-yellow-100 text-yellow-900',
    descripcion: 'Errores críticos detectados este mes',
  },
];

const Calidad = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-8 px-0">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2 text-center sm:text-left">
        <BarChart className="h-7 w-7 text-blue-700" /> Calidad del Sistema (ISO 25000)
      </h2>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 sm:p-8">
        {indicadores.map((ind, i) => {
          let statusIcon = null;
          if (ind.titulo === 'Disponibilidad' && parseFloat(ind.valor) >= 99) {
            statusIcon = <CheckCircle className="h-6 w-6 text-green-500 animate-pulse ml-2" />;
          } else if (ind.titulo === 'Tiempo medio de respuesta' && parseFloat(ind.valor) <= 2) {
            statusIcon = <CheckCircle className="h-6 w-6 text-green-500 animate-pulse ml-2" />;
          } else if (ind.titulo === 'Errores críticos' && ind.valor === '0') {
            statusIcon = <CheckCircle className="h-6 w-6 text-green-500 animate-pulse ml-2" />;
          } else if (ind.titulo === 'Usabilidad' && parseFloat(ind.valor) >= 95) {
            statusIcon = <CheckCircle className="h-6 w-6 text-green-500 animate-pulse ml-2" />;
          } else {
            statusIcon = <AlertTriangle className="h-6 w-6 text-yellow-500 animate-bounce ml-2" />;
          }
          return (
            <Card key={i} className={`shadow-md flex flex-col items-center bg-white dark:bg-gray-900 text-foreground dark:text-white rounded-2xl border border-blue-100 dark:border-blue-800 transition-all duration-300`}>
              <CardHeader className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  {ind.icon}
                  {statusIcon}
                </div>
                <CardTitle className="mt-2 text-lg">{ind.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center w-full">
                <div className="text-4xl font-extrabold mb-1 flex items-center gap-2">
                  {ind.valor}
                </div>
                {ind.titulo === 'Disponibilidad' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mt-2">
                    <div className="bg-green-500 h-3 rounded-full animate-pulse" style={{ width: `${parseFloat(ind.valor)}%`, transition: 'width 1s' }} />
                  </div>
                )}
                {ind.titulo === 'Tiempo medio de respuesta' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mt-2">
                    <div className="bg-blue-500 h-3 rounded-full animate-pulse" style={{ width: `${Math.min(100, 100 - parseFloat(ind.valor) * 40)}%`, transition: 'width 1s' }} />
                  </div>
                )}
                <div className="text-sm text-gray-700 dark:text-gray-300 text-center mt-2">{ind.descripcion}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Calidad; 