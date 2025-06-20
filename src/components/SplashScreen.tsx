import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, onComplete }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadingSteps = [
    'Inicializando sistema...',
    'Cargando módulos de seguridad...',
    'Conectando con servidores...',
    'Verificando permisos...',
    'Sistema listo'
  ];

  useEffect(() => {
    if (!isVisible) return;

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(onComplete, 1000);
          }, 500);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
        >
          <div className="text-center max-w-md mx-auto px-6">
            {/* Logo animado */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1, 
                type: "spring", 
                stiffness: 100, 
                damping: 15 
              }}
              className="mb-8"
            >
              <div className="bg-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white/30 mx-auto w-48 h-48 flex items-center justify-center">
                <img 
                  src="/assets/frontera-digital-logo.png" 
                  alt="Frontera Digital" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl font-bold text-white mb-2 tracking-wider"
            >
              Frontera Digital
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-blue-200 text-lg mb-8"
            >
              Sistema de Control Vehicular Chile-Argentina
            </motion.p>

            {/* Indicador de carga */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-4"
            >
              {isLoading ? (
                <>
                  <div className="flex items-center justify-center gap-3 text-blue-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">
                      {loadingSteps[loadingStep]}
                    </span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center gap-3 text-green-300"
                >
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-semibold">¡Sistema listo!</span>
                </motion.div>
              )}
            </motion.div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 text-blue-200 text-xs space-y-1"
            >
              <p>Servicio Nacional de Aduanas</p>
              <p>Gobierno de Chile</p>
              <p className="text-blue-300">Versión 2.1.0</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen; 