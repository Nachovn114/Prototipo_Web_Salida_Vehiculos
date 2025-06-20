import React, { useState, useEffect } from 'react';
import { MapPin, Car, FileText, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BorderPoint {
  id: string;
  name: string;
  country: 'chile' | 'argentina';
  type: 'paso' | 'aduana' | 'control';
  coordinates: { x: number; y: number };
  status: 'activo' | 'inactivo' | 'mantenimiento';
  activeRequests: number;
  waitingTime: string;
  description: string;
}

const borderPoints: BorderPoint[] = [
  {
    id: '1',
    name: 'Paso Los Libertadores',
    country: 'chile',
    type: 'paso',
    coordinates: { x: 25, y: 45 },
    status: 'activo',
    activeRequests: 12,
    waitingTime: '45 min',
    description: 'Principal paso fronterizo entre Chile y Argentina'
  },
  {
    id: '2',
    name: 'Aduana San Cristóbal',
    country: 'argentina',
    type: 'aduana',
    coordinates: { x: 75, y: 45 },
    status: 'activo',
    activeRequests: 8,
    waitingTime: '30 min',
    description: 'Aduana principal del lado argentino'
  },
  {
    id: '3',
    name: 'Control Cardenal Samoré',
    country: 'chile',
    type: 'control',
    coordinates: { x: 20, y: 70 },
    status: 'activo',
    activeRequests: 5,
    waitingTime: '20 min',
    description: 'Control vehicular y documental'
  },
  {
    id: '4',
    name: 'Paso Pino Hachado',
    country: 'argentina',
    type: 'paso',
    coordinates: { x: 80, y: 70 },
    status: 'mantenimiento',
    activeRequests: 0,
    waitingTime: 'Cerrado',
    description: 'Paso secundario en mantenimiento'
  },
  {
    id: '5',
    name: 'Aduana Pehuenche',
    country: 'chile',
    type: 'aduana',
    coordinates: { x: 15, y: 85 },
    status: 'activo',
    activeRequests: 3,
    waitingTime: '15 min',
    description: 'Aduana menor para tráfico local'
  }
];

const MapPoint: React.FC<{ point: BorderPoint; onClick: (point: BorderPoint) => void }> = ({ point, onClick }) => {
  const getStatusColor = () => {
    switch (point.status) {
      case 'activo': return 'bg-green-500';
      case 'inactivo': return 'bg-gray-500';
      case 'mantenimiento': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = () => {
    switch (point.type) {
      case 'paso': return <Car className="h-3 w-3" />;
      case 'aduana': return <FileText className="h-3 w-3" />;
      case 'control': return <MapPin className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={() => onClick(point)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 ${getStatusColor()}`}
          style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`${point.name} - ${point.status}`}
        >
          <div className="flex items-center justify-center text-white">
            {getTypeIcon()}
          </div>
          {point.activeRequests > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-600">
              {point.activeRequests}
            </Badge>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="text-center">
          <p className="font-semibold">{point.name}</p>
          <p className="text-sm text-gray-600">{point.status}</p>
          <p className="text-xs text-gray-500">{point.activeRequests} solicitudes activas</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const BorderMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<BorderPoint | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'chile' | 'argentina'>('all');

  const filteredPoints = borderPoints.filter(point => 
    filter === 'all' || point.country === filter
  );

  const handlePointClick = (point: BorderPoint) => {
    setSelectedPoint(point);
    setShowDetails(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactivo': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'mantenimiento': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCountryFlag = (country: string) => {
    return country === 'chile' ? '🇨🇱' : '🇦🇷';
  };

  return (
    <div className="w-full">
      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'chile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('chile')}
        >
          🇨🇱 Chile
        </Button>
        <Button
          variant={filter === 'argentina' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('argentina')}
        >
          🇦🇷 Argentina
        </Button>
      </div>

      {/* Mapa */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de la Frontera Chile-Argentina
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-green-50 border-2 border-gray-200 rounded-lg overflow-hidden">
            {/* Fondo del mapa */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-green-100 opacity-30"></div>
            
            {/* Línea fronteriza */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 border-t-2 border-dashed border-gray-600"></div>
            
            {/* Etiquetas de países */}
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md border">
              <span className="text-sm font-semibold text-blue-700">🇨🇱 Chile</span>
            </div>
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg shadow-md border">
              <span className="text-sm font-semibold text-green-700">🇦🇷 Argentina</span>
            </div>

            {/* Puntos del mapa */}
            {filteredPoints.map((point) => (
              <MapPoint
                key={point.id}
                point={point}
                onClick={handlePointClick}
              />
            ))}

            {/* Leyenda */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Activo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Mantenimiento</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Inactivo</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      <AnimatePresence>
        {showDetails && selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getCountryFlag(selectedPoint.country)}
                    {selectedPoint.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Estado:</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedPoint.status)}
                      <span className="text-sm capitalize">{selectedPoint.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tipo:</span>
                    <span className="text-sm capitalize">{selectedPoint.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Solicitudes activas:</span>
                    <Badge variant="secondary">{selectedPoint.activeRequests}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tiempo de espera:</span>
                    <span className="text-sm">{selectedPoint.waitingTime}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Descripción:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedPoint.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Ver solicitudes
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Más información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total solicitudes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {borderPoints.reduce((sum, point) => sum + point.activeRequests, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Puntos activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {borderPoints.filter(p => p.status === 'activo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Tiempo promedio</p>
                <p className="text-2xl font-bold text-orange-600">32 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 