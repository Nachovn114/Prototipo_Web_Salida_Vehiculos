import React from 'react';
import { useRouter } from 'next/router';
import { FaClipboardCheck, FaFileSignature, FaHistory, FaMapMarkedAlt, FaUserCog } from 'react-icons/fa';

const DashboardInspector = () => {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Validar Documentos',
      icon: <FaClipboardCheck className="text-4xl mb-2" />,
      path: '/inspector/validar-documentos',
      description: 'Revisa y valida la documentación de los conductores',
    },
    {
      title: 'Firmar Documentos',
      icon: <FaFileSignature className="text-4xl mb-2" />,
      path: '/inspector/firmar',
      description: 'Firma digitalmente documentos de salida',
    },
    {
      title: 'Historial',
      icon: <FaHistory className="text-4xl mb-2" />,
      path: '/inspector/historial',
      description: 'Consulta el historial de validaciones',
    },
    {
      title: 'Mapa de Congestión',
      icon: <FaMapMarkedAlt className="text-4xl mb-2" />,
      path: '/inspector/mapa',
      description: 'Visualiza el estado del tráfico en tiempo real',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-6">
      <header className="bg-gradient-to-r from-[#1e3c72] to-[#74acdf] text-white p-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold">Panel de Inspector</h1>
        <p className="text-blue-100 mt-2">Bienvenido al sistema de control fronterizo</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => router.push(item.path)}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-[#1e3c72] hover:border-[#d52b1e]"
          >
            <div className="text-center">
              <div className="text-[#1e3c72] flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No hay actividad reciente</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardInspector;
