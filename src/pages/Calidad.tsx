import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Clock, CheckCircle, BarChart } from 'lucide-react';

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

const Calidad = () => (
  <>
    <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      <BarChart className="h-7 w-7 text-blue-700" /> Calidad del Sistema (ISO 25000)
    </h2>
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
      {indicadores.map((ind, i) => (
        <Card key={i} className={`shadow-md flex flex-col items-center ${ind.color}`}>
          <CardHeader className="flex flex-col items-center">
            {ind.icon}
            <CardTitle className="mt-2 text-lg">{ind.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-extrabold mb-1">{ind.valor}</div>
            <div className="text-sm text-gray-700 text-center">{ind.descripcion}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export default Calidad; 