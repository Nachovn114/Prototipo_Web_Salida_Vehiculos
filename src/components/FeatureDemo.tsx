import React from 'react';

interface FeatureDemoProps {
  isVisible: boolean;
  onClose: () => void;
}

const FeatureDemo: React.FC<FeatureDemoProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🚀 Funcionalidades Avanzadas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Seguridad Avanzada</h3>
            <p className="text-blue-600 text-sm">
              Autenticación biométrica y encriptación de nivel militar
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Gestión Multirol</h3>
            <p className="text-green-600 text-sm">
              Sistema de permisos granular por tipo de usuario
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Documentación Digital</h3>
            <p className="text-purple-600 text-sm">
              Procesamiento inteligente de documentos
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Demo de funcionalidades premium del sistema
        </div>
      </div>
    </div>
  );
};

export default FeatureDemo; 