import React, { useState, useEffect } from 'react';
import { MapPin, Car, FileText, Clock, CheckCircle, AlertCircle, Info, Navigation, Gauge, Timer, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  getVehicleLocations, 
  getGeoZones, 
  getVehicleHistory,
  type VehicleLocation,
  type GeoZone 
} from '@/services/geolocationService';

// Import Leaflet and react-leaflet components
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression, GeoJSON as LeafletGeoJSON } from 'leaflet';
import { FeatureCollection } from 'geojson';

// --- Type Definitions ---
interface BorderPoint {
  id: string;
  name: string;
  country: 'chile' | 'argentina';
  type: 'paso' | 'aduana' | 'control';
  coordinates: [number, number]; // [lat, lng]
  status: 'activo' | 'inactivo' | 'mantenimiento';
  activeRequests: number;
  waitingTime: string;
}

// --- Mock Data ---
const borderPoints: BorderPoint[] = [
  {
    id: '1',
    name: 'Paso Los Libertadores',
    country: 'chile',
    type: 'paso',
    coordinates: [-32.8333, -70.098],
    status: 'activo',
    activeRequests: 12,
    waitingTime: '45 min',
  },
  {
    id: '2',
    name: 'Aduana Los Horcones',
    country: 'argentina',
    type: 'aduana',
    coordinates: [-32.815, -70.06],
    status: 'activo',
    activeRequests: 8,
    waitingTime: '30 min',
  },
];

// Simulación de vehículos y rutas históricas
const vehicles = [
  {
    patente: 'ABCD-12',
    nombre: 'Toyota Hilux 2023',
    ruta: [
      { pointId: '1', fecha: '2025-06-10 08:00', estado: 'normal' },
      { pointId: '2', fecha: '2025-06-10 09:00', estado: 'normal' },
      { pointId: '3', fecha: '2025-06-10 10:00', estado: 'demorado' },
    ],
    riesgo: 'medio',
  },
  {
    patente: 'EFGH-34',
    nombre: 'Ford Ranger 2022',
    ruta: [
      { pointId: '5', fecha: '2025-06-09 07:30', estado: 'normal' },
      { pointId: '3', fecha: '2025-06-09 08:10', estado: 'normal' },
      { pointId: '2', fecha: '2025-06-09 09:00', estado: 'alto' },
    ],
    riesgo: 'alto',
  },
];

const getRiskBadge = (riesgo: 'bajo' | 'medio' | 'alto') => {
  switch (riesgo) {
    case 'alto':
      return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">Alto</Badge>;
    case 'medio':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">Medio</Badge>;
    default:
      return <Badge className="bg-green-100 text-green-800 border-green-200">Bajo</Badge>;
  }
};

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
          style={{ left: `${point.coordinates[1]}%`, top: `${point.coordinates[0]}%` }}
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

// --- Custom Icons ---
const createVehicleIcon = (vehicle: VehicleLocation) => {
  const statusColor = 
    vehicle.status === 'desviado' ? '#EF4444' : // red-500
    vehicle.status === 'detenido' ? '#F59E0B' : // amber-500
    '#3B82F6'; // blue-500

  const iconHtml = `
    <div style="
      background-color: ${statusColor};
      border-radius: 50%;
      width: 2.2rem;
      height: 2.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transform: rotate(${vehicle.heading}deg);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>
    </div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'leaflet-vehicle-icon',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
  });
};

const controlPointIcon = (point: BorderPoint) => L.icon({
  iconUrl: point.country === 'chile' ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- Main Component ---
export const BorderMap: React.FC = () => {
  const [liveVehicles, setLiveVehicles] = useState<VehicleLocation[]>([]);
  const [geoZones, setGeoZones] = useState<GeoZone[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<BorderPoint | null>(null);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleLocation[]>([]);

  // Effect to load live data periodically
  useEffect(() => {
    const loadData = () => {
      setLiveVehicles(getVehicleLocations());
      setGeoZones(getGeoZones());
    };
    loadData();
    const interval = setInterval(loadData, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);
  
  // Effect to load history when a vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      setVehicleHistory(getVehicleHistory(selectedVehicle.patente));
    } else {
      setVehicleHistory([]);
    }
  }, [selectedVehicle]);

  const handleVehicleClick = (vehicle: VehicleLocation) => {
    setSelectedVehicle(prev => (prev?.id === vehicle.id ? null : vehicle));
    setSelectedPoint(null);
  };

  const handlePointClick = (point: BorderPoint) => {
    setSelectedPoint(prev => (prev?.id === point.id ? null : point));
    setSelectedVehicle(null);
  };

  const mapCenter: [number, number] = [-32.83, -70.09]; // Paso Los Libertadores

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-120px)] p-4 bg-gray-50 dark:bg-gray-900">
      {/* --- Map Panel --- */}
      <div className="flex-grow rounded-xl shadow-lg overflow-hidden border dark:border-gray-700">
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render GeoZones */}
          {geoZones.map(zone => (
            <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2 }}>
              <Tooltip>{zone.name}</Tooltip>
            </Circle>
          ))}

          {/* Render Border Points */}
          {borderPoints.map(point => (
            <Marker key={point.id} position={point.coordinates} icon={controlPointIcon(point)} eventHandlers={{ click: () => handlePointClick(point) }}>
              <Popup>
                <strong>{point.name}</strong><br/>Espera: {point.waitingTime}
              </Popup>
            </Marker>
          ))}
          
          {/* Render Vehicle History */}
          {vehicleHistory.length > 0 && (
            <Polyline pathOptions={{ color: '#6366F1', weight: 5, opacity: 0.7 }} positions={vehicleHistory.map(p => [p.lat, p.lng])} />
          )}

          {/* Render Live Vehicles */}
          {liveVehicles.map(vehicle => (
            <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={createVehicleIcon(vehicle)} eventHandlers={{ click: () => handleVehicleClick(vehicle) }}>
              <Popup><strong>{vehicle.patente}</strong><br/>{vehicle.status}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* --- Details Panel --- */}
      <div className="w-full md:w-96 lg:w-[450px] flex-shrink-0">
        <Card className="h-full shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Panel de Detalles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
            {selectedVehicle ? (
              <VehicleDetails vehicle={selectedVehicle} history={vehicleHistory} onClose={() => setSelectedVehicle(null)} />
            ) : selectedPoint ? (
              <PointDetails point={selectedPoint} onClose={() => setSelectedPoint(null)} />
            ) : (
              <VehicleList vehicles={liveVehicles} onSelect={handleVehicleClick} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Child Components for Details Panel ---

const VehicleList = ({ vehicles, onSelect }: { vehicles: VehicleLocation[], onSelect: (v: VehicleLocation) => void }) => (
  <div>
    <h3 className="font-semibold mb-3 text-lg text-gray-700 dark:text-gray-200">Vehículos en Ruta</h3>
    <div className="space-y-2">
      {vehicles.map(v => (
        <div key={v.id} onClick={() => onSelect(v)} className="p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800 dark:text-gray-100">{v.patente}</span>
            <Badge variant={v.status === 'desviado' ? 'destructive' : 'secondary'}>{v.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Velocidad: {Math.round(v.speed)} km/h</p>
        </div>
      ))}
    </div>
  </div>
);

const VehicleDetails = ({ vehicle, history, onClose }: { vehicle: VehicleLocation, history: VehicleLocation[], onClose: () => void }) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="flex justify-between items-center">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{vehicle.patente}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
    </div>
    <div className="grid grid-cols-2 gap-3 text-center">
      <InfoCard label="Velocidad" value={`${Math.round(vehicle.speed)} km/h`} icon={<Gauge size={16}/>} />
      <InfoCard label="ETA" value={`${vehicle.eta || 'N/A'} min`} icon={<Timer size={16}/>} />
    </div>
    <InfoCard label="Desviación de Ruta" value={`${Math.round(vehicle.routeDeviation || 0)} m`} icon={<AlertCircle size={16}/>} isWarning={vehicle.routeDeviation && vehicle.routeDeviation > 100} />
    <div>
      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Historial de Ruta (24h)</h4>
      <div className="text-sm p-3 bg-gray-100 dark:bg-gray-900/50 rounded-md text-gray-600 dark:text-gray-300">
        {history.length > 0 ? `${history.length} puntos de GPS registrados.` : 'Sin historial reciente para mostrar.'}
      </div>
    </div>
  </div>
);

const PointDetails = ({ point, onClose }: { point: BorderPoint, onClose: () => void }) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="flex justify-between items-center">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{point.name}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
    </div>
    <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg space-y-2">
      <p><strong>País:</strong> {point.country === 'chile' ? '🇨🇱 Chile' : '🇦🇷 Argentina'}</p>
      <p><strong>Tipo:</strong> <Badge variant="outline">{point.type}</Badge></p>
      <p><strong>Estado:</strong> <Badge variant={point.status === 'activo' ? 'default' : 'destructive'}>{point.status}</Badge></p>
      <p><strong>Espera Aprox:</strong> {point.waitingTime}</p>
      <p><strong>Solicitudes Activas:</strong> {point.activeRequests}</p>
    </div>
  </div>
);

const InfoCard = ({ label, value, icon, isWarning = false }: { label: string, value: string | number, icon: React.ReactNode, isWarning?: boolean }) => (
  <div className={`p-3 rounded-lg ${isWarning ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
    </div>
    <p className="font-bold text-lg mt-1">{value}</p>
  </div>
); 