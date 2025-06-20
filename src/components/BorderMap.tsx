import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Datos simulados de congestión
const pasos = [
  {
    nombre: 'Los Libertadores',
    lat: -32.832,
    lng: -70.123,
    estado: 'Medio',
    tiempo: 25
  },
  {
    nombre: 'Cardenal Samoré',
    lat: -40.769,
    lng: -71.934,
    estado: 'Alto',
    tiempo: 70
  },
  {
    nombre: 'Paso Jama',
    lat: -23.265,
    lng: -67.011,
    estado: 'Bajo',
    tiempo: 10
  }
];

const estadoColor = {
  'Bajo': 'green',
  'Medio': 'orange',
  'Alto': 'red'
};

export const BorderMap: React.FC = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow">
      <MapContainer center={[-32, -70]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pasos.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]}>
            <Popup>
              <div>
                <strong>{p.nombre}</strong><br />
                Estado: <span style={{ color: estadoColor[p.estado] }}>{p.estado}</span><br />
                Tiempo estimado: <b>{p.tiempo} min</b><br />
                {p.tiempo > 60 && (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Congestión crítica</span>
                )}
              </div>
            </Popup>
            <Circle
              center={[p.lat, p.lng]}
              radius={15000}
              pathOptions={{ color: estadoColor[p.estado], fillColor: estadoColor[p.estado], fillOpacity: 0.3 }}
            />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}; 