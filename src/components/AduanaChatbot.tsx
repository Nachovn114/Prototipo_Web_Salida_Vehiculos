import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Base de conocimiento local (expandida y contextual por rol)
const knowledgeBase = [
  // Respuestas generales
  {
    q: /hola|buenas/i,
    a: (role) => `¡Hola! Soy el Asistente Aduanero IA. ¿En qué puedo ayudarte${role ? ' (' + role + ')' : ''}?`
  },
  // Conductor
  {
    q: /documento.*vencid[oa]/i,
    a: (role) => role === 'conductor' ? 'Si tienes un documento vencido, debes cargar uno vigente en la sección Documentos antes de continuar con tu solicitud.' : null
  },
  {
    q: /cómo.*registrar.*carga/i,
    a: (role) => role === 'conductor' ? 'Para registrar una carga, dirígete a la sección "Carga" y completa los datos requeridos. Adjunta los documentos de respaldo.' : null
  },
  // Inspector
  {
    q: /firmar digital/i,
    a: (role) => role === 'inspector' ? 'Para firmar digitalmente, asegúrate de tener tu certificado vigente y haz clic en "Firmar" al finalizar la inspección.' : null
  },
  {
    q: /qué hacer.*documento.*vencid[oa]/i,
    a: (role) => role === 'inspector' ? 'Si detectas un documento vencido, rechaza la solicitud y notifica al conductor para que cargue uno vigente.' : null
  },
  // Admin
  {
    q: /predicci[oó]n.*flujo|congesti[oó]n/i,
    a: (role) => role === 'admin' ? 'Puedes ver el panel predictivo de congestión en el Dashboard, donde se muestran las horas pico y sugerencias de recursos.' : null
  },
  // Ejemplos adicionales
  {
    q: /observad[oa]/i,
    a: (role) => '“Observado” significa que tu solicitud tiene detalles pendientes o requiere revisión adicional. Consulta la sección de observaciones para más información.'
  },
  {
    q: /faltante.*documento/i,
    a: (role) => 'Si falta un documento, revisa la lista de requisitos y adjunta el archivo correspondiente en la sección Documentos.'
  },
  {
    q: /ayuda|soporte/i,
    a: (role) => 'Puedes contactar al soporte institucional desde la sección Contacto o escribir tu duda aquí.'
  },
  // Respuesta por defecto
  {
    q: /.*/,
    a: (role) => 'No tengo una respuesta exacta para tu consulta, pero puedes revisar el Centro de Ayuda o ser más específico.'
  }
];

const getBotResponse = async (input, role, useAI = false) => {
  if (useAI) {
    // Estructura para conectar a una API real de IA (ejemplo OpenAI, requiere endpoint y API key)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, role })
      });
      const data = await res.json();
      return data?.response || 'No se pudo obtener respuesta de la IA.';
    } catch {
      return 'Error al conectar con el asistente inteligente.';
    }
  }
  for (const entry of knowledgeBase) {
    const res = entry.a(role);
    if (entry.q.test(input) && res) return res;
  }
  return knowledgeBase[knowledgeBase.length - 1].a(role);
};

export const AduanaChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Cargar historial de localStorage
    const saved = localStorage.getItem('aduanaChatHistory');
    return saved ? JSON.parse(saved) : [
      { from: 'bot', text: '¡Hola! Soy el Asistente Aduanero IA. Pregúntame sobre normativas, validaciones o procedimientos.' }
    ];
  });
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useAI, setUseAI] = useState(false); // Permite alternar entre base local y API real
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [feedback, setFeedback] = useState({}); // {msgIndex: 'up'|'down'}

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // Guardar historial
    localStorage.setItem('aduanaChatHistory', JSON.stringify(messages));
  }, [messages, isOpen]);

  const userRole = localStorage.getItem('userRole') || 'conductor';

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);
    setIsThinking(true);
    setInput('');
    const response = await getBotResponse(input, userRole, useAI);
    setMessages((msgs) => [...msgs, { from: 'bot', text: response }]);
    setIsThinking(false);
  };

  const handleFeedback = (idx, type) => {
    setFeedback((f) => ({ ...f, [idx]: type }));
    // Aquí podrías enviar feedback a un backend si lo deseas
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Abrir asistente IA"
        >
          <Bot className="h-7 w-7 group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Modal de chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed bottom-0 right-0 m-8 w-full max-w-md z-50"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6" />
                    <span className="font-bold text-lg">Asistente Aduanero IA</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-900/40">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-blue-100 dark:border-blue-900'}`}>
                        {msg.text}
                        {/* Feedback solo para respuestas del bot */}
                        {msg.from === 'bot' && i !== 0 && (
                          <div className="flex gap-1 mt-1">
                            <button
                              className={`p-1 rounded-full ${feedback[i] === 'up' ? 'bg-green-200' : 'hover:bg-gray-200'}`}
                              onClick={() => handleFeedback(i, 'up')}
                              title="Respuesta útil"
                              type="button"
                            >
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                            </button>
                            <button
                              className={`p-1 rounded-full ${feedback[i] === 'down' ? 'bg-red-200' : 'hover:bg-gray-200'}`}
                              onClick={() => handleFeedback(i, 'down')}
                              title="Respuesta poco útil"
                              type="button"
                            >
                              <ThumbsDown className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="max-w-xs px-4 py-2 rounded-2xl shadow text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-blue-100 dark:border-blue-900 flex items-center gap-2">
                        <span className="animate-pulse">...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                {/* Input */}
                <form
                  className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl"
                  onSubmit={e => { e.preventDefault(); handleSend(); }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <Button type="submit" disabled={!input.trim()} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="px-6 pb-3 text-xs text-gray-400 text-right flex items-center gap-2">
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  Respuestas basadas en normativa y ayuda institucional
                  <label className="ml-auto flex items-center gap-1 cursor-pointer text-blue-700">
                    <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} />
                    IA real
                  </label>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}; 