import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Globe,
  Lock,
  Eye,
  Download
} from 'lucide-react';

interface FeatureDemoProps {
  isVisible: boolean;
  onClose: () => void;
}

const FeatureDemo: React.FC<FeatureDemoProps> = ({ isVisible, onClose }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Shield,
      title: "Seguridad Avanzada",
      description: "Autenticación biométrica y encriptación de nivel militar",
      details: [
        "Verificación de identidad por huella dactilar",
        "Encriptación AES-256 para datos sensibles",
        "Auditoría completa de accesos",
        "Detección de amenazas en tiempo real"
      ],
      color: "blue"
    },
    {
      icon: Users,
      title: "Gestión Multirol",
      description: "Sistema de permisos granular por tipo de usuario",
      details: [
        "Roles específicos: Conductor, Inspector, Aduanero, Admin",
        "Permisos personalizados por funcionalidad",
        "Escalación automática de privilegios",
        "Control de sesiones concurrentes"
      ],
      color: "green"
    },
    {
      icon: FileText,
      title: "Documentación Digital",
      description: "Procesamiento inteligente de documentos",
      details: [
        "OCR para lectura automática de documentos",
        "Validación cruzada de información",
        "Almacenamiento seguro en la nube",
        "Historial completo de modificaciones"
      ],
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Analytics en Tiempo Real",
      description: "Dashboard con métricas y reportes avanzados",
      details: [
        "Métricas de flujo vehicular en tiempo real",
        "Análisis predictivo de congestiones",
        "Reportes automáticos por período",
        "Exportación de datos en múltiples formatos"
      ],
      color: "orange"
    },
    {
      icon: Globe,
      title: "Integración Internacional",
      description: "Conectividad con sistemas de ambos países",
      details: [
        "API REST para integración con sistemas externos",
        "Sincronización automática de datos",
        "Protocolos de seguridad internacionales",
        "Soporte multiidioma (ES/EN/PT)"
      ],
      color: "cyan"
    }
  ];

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">🚀 Funcionalidades Avanzadas</h2>
                  <p className="text-blue-100">Demostración de capacidades premium del sistema</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">×</span>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feature Navigation */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Características Destacadas</h3>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        activeFeature === index
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <feature.icon className={`h-5 w-5 ${
                        activeFeature === index ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <span className="font-medium">{feature.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feature Details */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl bg-${features[activeFeature].color}-100`}>
                          <features[activeFeature].icon className={`h-8 w-8 text-${features[activeFeature].color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {features[activeFeature].title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {features[activeFeature].description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {features[activeFeature].details.map((detail, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Demo Actions */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <motion.button
                              onClick={prevFeature}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              ← Anterior
                            </motion.button>
                            <motion.button
                              onClick={nextFeature}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Siguiente →
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{activeFeature + 1} de {features.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Datos protegidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Demo interactiva</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Documentación técnica disponible</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureDemo; 