import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4 sm:p-8">
      <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-20 w-20 sm:h-24 sm:w-24 mb-6" />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2 text-center">Frontera Digital</h1>
      <h2 className="text-lg sm:text-xl text-blue-700 mb-6 text-center">Sistema oficial de control de salida vehicular – Aduana Chile</h2>
      <p className="max-w-xl text-center text-base sm:text-lg text-gray-700 mb-8">Bienvenido al sistema institucional para la gestión y control moderno de la salida de vehículos en frontera. Optimiza procesos, asegura trazabilidad y cumple con los estándares de calidad y seguridad.</p>
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-all duration-200 w-full max-w-xs"
      >
        Comenzar
      </button>
    </div>
  );
};

export default Index;
