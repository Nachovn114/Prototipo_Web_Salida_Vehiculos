import React from 'react';

const Contacto: React.FC = () => (
  <div className="max-w-lg mx-auto py-10 px-4">
    <div className="flex flex-col items-center mb-8">
      <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-14 w-14 mb-2" />
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Contacto Institucional</h1>
    </div>
    <div className="mb-4">
      <b>Nombre del sistema:</b> Frontera Digital
    </div>
    <div className="mb-4">
      <b>Correo de soporte:</b> <a href="mailto:soporte@aduanachile.cl" className="text-blue-600 underline">soporte@aduanachile.cl</a>
    </div>
    <div className="mb-4">
      <b>Horario de atención:</b> Lunes a Viernes, 08:00 a 18:00 hrs
    </div>
    <div className="mb-4">
      <b>Teléfono:</b> +56 2 1234 5678
    </div>
    <div className="text-xs text-gray-500 mt-8">Este es un sistema prototipo para fines académicos.</div>
  </div>
);

export default Contacto; 