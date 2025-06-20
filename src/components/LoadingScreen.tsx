import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, onComplete }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm border border-white/30">
            <img 
              src="/assets/frontera-digital-logo.png" 
              alt="Frontera Digital" 
              className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
            />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-4 tracking-wider"
        >
          Frontera Digital
        </motion.h1>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Shield className="h-6 w-6 text-blue-200" />
          <span className="text-blue-200 font-medium">Sistema de Control Vehicular</span>
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="w-64 h-1 bg-white/30 rounded-full mx-auto mb-4 overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="h-full bg-white rounded-full"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="flex items-center justify-center gap-2 text-blue-200"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm">Acceso autorizado</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 