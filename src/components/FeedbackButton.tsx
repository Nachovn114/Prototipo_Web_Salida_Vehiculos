import React, { useState } from 'react';
import { MessageSquare, X, Send, Star, ThumbsUp, ThumbsDown, Smile, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FeedbackData {
  type: 'sugerencia' | 'problema' | 'elogio' | 'pregunta';
  rating: number;
  message: string;
  category: string;
}

const feedbackCategories = [
  { value: 'usabilidad', label: 'Usabilidad' },
  { value: 'funcionalidad', label: 'Funcionalidad' },
  { value: 'rendimiento', label: 'Rendimiento' },
  { value: 'diseno', label: 'Diseño' },
  { value: 'documentacion', label: 'Documentación' },
  { value: 'otro', label: 'Otro' }
];

const feedbackTypes = [
  { value: 'sugerencia', label: 'Sugerencia', icon: <ThumbsUp className="h-4 w-4" /> },
  { value: 'problema', label: 'Problema', icon: <ThumbsDown className="h-4 w-4" /> },
  { value: 'elogio', label: 'Elogio', icon: <Smile className="h-4 w-4" /> },
  { value: 'pregunta', label: 'Pregunta', icon: <MessageSquare className="h-4 w-4" /> }
];

export const FeedbackButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: 'sugerencia',
    rating: 0,
    message: '',
    category: 'usabilidad'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.message.trim()) {
      toast.error('Por favor, escribe tu comentario');
      return;
    }

    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Guardar en localStorage
    const feedbacks = JSON.parse(localStorage.getItem('user-feedbacks') || '[]');
    const newFeedback = {
      ...feedbackData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    feedbacks.push(newFeedback);
    localStorage.setItem('user-feedbacks', JSON.stringify(feedbacks));

    toast.success('¡Gracias por tu feedback!', {
      description: 'Tu comentario nos ayuda a mejorar el sistema.',
    });

    setFeedbackData({
      type: 'sugerencia',
      rating: 0,
      message: '',
      category: 'usabilidad'
    });
    setIsSubmitting(false);
    setIsOpen(false);
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            className={`p-1 transition-colors ${
              star <= feedbackData.rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Enviar feedback"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Modal de feedback */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">¿Cómo mejorarías este sistema?</h3>
                        <p className="text-blue-100 text-sm">Tu opinión nos ayuda a mejorar</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Tipo de feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tipo de comentario
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {feedbackTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFeedbackData(prev => ({ ...prev, type: type.value as any }))}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            feedbackData.type === type.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          {type.icon}
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoría
                    </label>
                    <Select 
                      value={feedbackData.category} 
                      onValueChange={(value) => setFeedbackData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ¿Cómo calificarías tu experiencia?
                    </label>
                    <div className="flex items-center gap-4">
                      {renderStars()}
                      <span className="text-sm text-gray-500">
                        {feedbackData.rating > 0 ? `${feedbackData.rating}/5` : 'Sin calificar'}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tu comentario *
                    </label>
                    <Textarea
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Cuéntanos qué piensas del sistema, qué te gustaría mejorar o qué problemas has encontrado..."
                      rows={4}
                      className="resize-none"
                      required
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !feedbackData.message.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}; 