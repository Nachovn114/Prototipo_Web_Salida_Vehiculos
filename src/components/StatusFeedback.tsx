import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusFeedbackProps {
  isVisible: boolean;
  status: 'success' | 'error' | 'warning';
  message: string;
  onComplete: () => void;
}

const StatusFeedback: React.FC<StatusFeedbackProps> = ({ 
  isVisible, 
  status, 
  message, 
  onComplete 
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconBg: 'bg-green-100'
        };
      case 'error':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-12 w-12 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBg: 'bg-yellow-100'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} ${config.textColor}
            border-2 rounded-2xl p-8 shadow-2xl backdrop-blur-sm
            flex flex-col items-center justify-center gap-4
            min-w-[300px] max-w-[400px]
          `}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.1, 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
              className={`${config.iconBg} rounded-full p-4 shadow-lg`}
            >
              {config.icon}
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-xl font-bold text-center"
            >
              {status === 'success' ? '¡Aprobado!' : 
               status === 'error' ? 'Rechazado' : 'Advertencia'}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center text-sm leading-relaxed"
            >
              {message}
            </motion.p>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full h-1 bg-current opacity-30 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.4, duration: 1.5 }}
                className="h-full bg-current rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusFeedback; 