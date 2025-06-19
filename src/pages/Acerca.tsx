import React from 'react';

const Acerca: React.FC = () => (
  <div className="max-w-2xl mx-auto py-10 px-4">
    <div className="flex flex-col items-center mb-8">
      <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-16 w-16 mb-2" />
      <h1 className="text-3xl font-bold text-blue-900 mb-2">Frontera Digital – Aduana Chile</h1>
    </div>
    <p className="mb-4 text-lg">Sistema institucional para el control y modernización de la salida vehicular en frontera Chile-Argentina.</p>
    <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-2">Objetivo institucional</h2>
    <p className="mb-4">Modernizar y digitalizar el proceso de control fronterizo, asegurando eficiencia, trazabilidad y cumplimiento normativo.</p>
    <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-2">Perfiles y roles</h2>
    <ul className="list-disc pl-6 mb-4">
      <li><b>Conductor:</b> Inicia solicitudes y presenta documentación.</li>
      <li><b>Inspector:</b> Revisa, valida y firma digitalmente las inspecciones.</li>
      <li><b>Aduanero:</b> Supervisa y autoriza el flujo vehicular.</li>
      <li><b>Admin:</b> Gestiona usuarios, reportes y calidad del sistema.</li>
    </ul>
    <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-2">Enlaces útiles</h2>
    <ul className="list-disc pl-6 mb-4">
      <li><a href="/calidad" className="text-blue-600 underline">Métricas de calidad</a></li>
      <li><a href="/changelog" className="text-blue-600 underline">Changelog</a></li>
    </ul>
    <div className="mt-8 text-sm text-gray-500">Desarrollado por Ignacio Valeria (2025)</div>
  </div>
);

export default Acerca; 