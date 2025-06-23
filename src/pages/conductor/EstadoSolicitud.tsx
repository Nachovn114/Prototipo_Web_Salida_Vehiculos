import React from 'react';
import { useTranslation } from 'react-i18next';

const EstadoSolicitud: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('solicitud.estadoTitulo')}
          </h1>
          <p className="text-gray-600">
            {t('solicitud.estadoSubtitulo')}
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold text-lg mb-2">
              {t('solicitud.detalles')}
            </h2>
            {/* Aquí iría el estado actual de la solicitud */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>{t('solicitud.estadoEnRevision')}</span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold text-lg mb-2">
              {t('solicitud.historial')}
            </h2>
            <ul className="space-y-2">
              {/* Aquí iría el historial de estados */}
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{t('solicitud.estadoCreado')} - 22/06/2025</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoSolicitud;
