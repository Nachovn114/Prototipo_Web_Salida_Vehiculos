
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Thermometer, Wind, RefreshCw } from 'lucide-react';

export const BorderStatus: React.FC = () => {
  const borderInfo = {
    status: 'Operativo',
    waitTime: '15 minutos',
    temperature: '12°C',
    windSpeed: '8 km/h',
    lastUpdate: '10:45 AM'
  };

  const handleRefreshStatus = () => {
    // Simulate refresh
    console.log('Refreshing border status...');
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-purple-600" />
          <span>Estado de Frontera</span>
        </CardTitle>
        <CardDescription>
          Los Libertadores - Chile/Argentina
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estado Actual</span>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {borderInfo.status}
          </Badge>
        </div>

        {/* Wait Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Tiempo de Espera</span>
          </div>
          <span className="text-sm font-medium">{borderInfo.waitTime}</span>
        </div>

        {/* Weather Conditions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Temperatura</span>
            </div>
            <span className="text-sm font-medium">{borderInfo.temperature}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Viento</span>
            </div>
            <span className="text-sm font-medium">{borderInfo.windSpeed}</span>
          </div>
        </div>

        {/* Traffic Levels */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-700">Flujo de Tráfico</h5>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Vehículos Livianos</span>
              <Badge className="bg-yellow-100 text-yellow-800">Moderado</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Buses</span>
              <Badge className="bg-green-100 text-green-800">Bajo</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Camiones</span>
              <Badge className="bg-red-100 text-red-800">Alto</Badge>
            </div>
          </div>
        </div>

        {/* Special Alerts */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium">
            ⚠️ Alerta Meteorológica
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Posibles vientos fuertes después de las 14:00
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshStatus}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar Estado
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Última actualización: {borderInfo.lastUpdate}
        </div>
      </CardContent>
    </Card>
  );
};
