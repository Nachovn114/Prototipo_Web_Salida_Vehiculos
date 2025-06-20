import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, SkipForward, HelpCircle, Bell, Search, FileText, Car, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Frontera Digital!',
    content: 'Te guiaremos por las principales funcionalidades del sistema de control vehicular Chile-Argentina.',
    target: 'body',
    position: 'top'
  },
  {
    id: 'search',
    title: 'Búsqueda Global',
    content: 'Encuentra rápidamente solicitudes, documentos y vehículos usando Ctrl+K o el botón de búsqueda.',
    target: '[data-tour="search"]',
    position: 'bottom'
  },
  {
    id: 'notifications',
    title: 'Sistema de Notificaciones',
    content: 'Mantente informado sobre el estado de tus solicitudes y novedades del sistema.',
    target: '[data-tour="notifications"]',
    position: 'left'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Principal',
    content: 'Vista general de métricas, solicitudes pendientes y estadísticas en tiempo real.',
    target: '[data-tour="dashboard"]',
    position: 'bottom'
  },
  {
    id: 'inspections',
    title: 'Inspecciones Vehiculares',
    content: 'Gestiona las inspecciones físicas de vehículos y documentación requerida.',
    target: '[data-tour="inspections"]',
    position: 'bottom'
  },
  {
    id: 'documents',
    title: 'Gestión Documental',
    content: 'Sube, valida y gestiona todos los documentos necesarios para el cruce fronterizo.',
    target: '[data-tour="documents"]',
    position: 'bottom'
  },
  {
    id: 'reports',
    title: 'Reportes y Estadísticas',
    content: 'Accede a reportes detallados, estadísticas y análisis de datos del sistema.',
    target: '[data-tour="reports"]',
    position: 'bottom'
  },
  {
    id: 'help',
    title: 'Centro de Ayuda',
    content: 'Encuentra respuestas a tus preguntas, tutoriales y soporte técnico.',
    target: '[data-tour="help"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: '¡Tour Completado!',
    content: 'Ya conoces las principales funcionalidades. ¡Comienza a usar Frontera Digital!',
    target: 'body',
    position: 'top'
  }
];

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('tour-completed') === 'true';
  });
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      highlightCurrentStep();
    } else {
      document.body.style.overflow = 'unset';
      removeHighlights();
    }

    return () => {
      document.body.style.overflow = 'unset';
      removeHighlights();
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= tourSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const highlightCurrentStep = () => {
    removeHighlights();
    const currentTarget = tourSteps[currentStep].target;
    const element = document.querySelector(currentTarget);
    
    if (element) {
      element.classList.add('tour-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const removeHighlights = () => {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('tour-completed', 'true');
    setHasSeenTour(true);
    onClose();
  };

  const skipTour = () => {
    completeTour();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Tour Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tour Interactivo</h3>
                    <p className="text-blue-100 text-sm">Paso {currentStep + 1} de {tourSteps.length}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {currentStepData.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {currentStepData.content}
              </p>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Auto
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={skipTour}
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Saltar
                  </Button>
                  
                  <Button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {currentStep === tourSteps.length - 1 ? (
                      <>
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Comenzar
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-600 scale-125'
                  : index < currentStep
                  ? 'bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Hook para usar el tour
export const useTour = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('tour-completed') === 'true';
  });

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const resetTour = () => {
    localStorage.removeItem('tour-completed');
    setHasSeenTour(false);
  };

  return {
    isTourOpen,
    hasSeenTour,
    startTour,
    closeTour,
    resetTour
  };
}; 