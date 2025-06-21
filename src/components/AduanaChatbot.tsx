import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageSquare, Send, X, Bot, User, BookOpen, ThumbsUp, ThumbsDown, Paperclip, Clock, Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

type UserRole = 'conductor' | 'inspector' | 'admin' | 'visitante';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: number;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  lastMessage: string;
  role: UserRole;
}

const DEFAULT_KNOWLEDGE_BASE = [
  // Respuestas generales
  {
    q: /hola|buenas|buenos/i,
    a: (role: UserRole) => ({
      text: `¡Hola! Soy el Asistente Aduanero IA. ¿En qué puedo ayudarte${role ? ' (' + role + ')' : ''}?`,
      quickReplies: [
        '¿Cómo registro una carga?',
        '¿Qué documentos necesito?',
        '¿Cómo firmo digitalmente?'
      ]
    })
  },
  // ... (más respuestas)
];

const FAQ_SUGGESTIONS = [
  '¿Cómo registro una carga?',
  '¿Cuáles son los requisitos de documentación?',
  '¿Cómo funciona el proceso de inspección?',
  '¿Dónde encuentro mis documentos?'
];

const ChatMessage = React.memo(({ 
  message,
  onFeedback,
  feedback,
  theme = 'light' 
}: { 
  message: Message; 
  onFeedback: (messageId: string, type: 'up' | 'down') => void;
  feedback: Record<string, 'up' | 'down'>;
  theme: 'light' | 'dark';
}) => {
  const isUser = message.from === 'user';
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      aria-live={isUser ? undefined : 'polite'}
    >
      <div 
        className={`max-w-[85%] px-4 py-2 rounded-2xl shadow text-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : `bg-${theme === 'dark' ? 'gray-800' : 'white'} text-${theme === 'dark' ? 'gray-100' : 'gray-900'} rounded-bl-none border ${theme === 'dark' ? 'border-blue-900' : 'border-blue-100'}`
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        
        {message.attachments?.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-500 hover:underline"
                download
              >
                <Paperclip className="h-3 w-3 mr-1" />
                {file.name}
              </a>
            ))}
          </div>
        )}
        
        {!isUser && (
          <div className="flex gap-1 mt-2 justify-end">
            <button
              className={`p-1 rounded-full ${feedback[message.id] === 'up' 
                ? 'bg-green-200' 
                : `hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'}`}`}
              onClick={() => onFeedback(message.id, 'up')}
              aria-label="Respuesta útil"
              type="button"
            >
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </button>
            <button
              className={`p-1 rounded-full ${feedback[message.id] === 'down' 
                ? 'bg-red-200' 
                : `hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-200'}`}`}
              onClick={() => onFeedback(message.id, 'down')}
              aria-label="Respuesta no útil"
              type="button"
            >
              <ThumbsDown className="h-4 w-4 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

const AduanaChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userRole = useMemo<UserRole>(
    () => (localStorage.getItem('userRole') as UserRole) || 'visitante',
    []
  );

  // Cargar historial al iniciar
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      
      if (parsed.length > 0) {
        loadSession(parsed[0].id);
      } else {
        startNewSession();
      }
    } else {
      startNewSession();
    }
  }, []);

  const startNewSession = useCallback(() => {
    const sessionId = uuidv4();
    const welcomeMessage = {
      id: uuidv4(),
      from: 'bot' as const,
      text: '¡Hola! Soy el Asistente Aduanero IA. Pregúntame sobre normativas, validaciones o procedimientos.',
      timestamp: Date.now(),
    };
    
    setCurrentSessionId(sessionId);
    setMessages([welcomeMessage]);
    
    const newSession = {
      id: sessionId,
      title: 'Nueva conversación',
      timestamp: Date.now(),
      lastMessage: welcomeMessage.text,
      role: userRole,
    };
    
    setSessions(prev => {
      const updated = [newSession, ...prev].slice(0, 10); // Limitar a 10 conversaciones
      localStorage.setItem('chatSessions', JSON.stringify(updated));
      return updated;
    });
    
    return sessionId;
  }, [userRole]);

  const loadSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const savedMessages = localStorage.getItem(`chatMessages_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
        setCurrentSessionId(sessionId);
      }
    }
  }, [sessions]);

  const saveMessages = useCallback((sessionId: string, msgs: Message[]) => {
    localStorage.setItem(`chatMessages_${sessionId}`, JSON.stringify(msgs));
    
    // Actualizar última sesión
    if (msgs.length > 0) {
      const lastMessage = msgs[msgs.length - 1];
      const lastText = lastMessage.text.length > 50 
        ? lastMessage.text.substring(0, 47) + '...' 
        : lastMessage.text;
      
      setSessions(prev => {
        const updated = prev.map(s => 
          s.id === sessionId 
            ? { ...s, lastMessage: lastText, timestamp: lastMessage.timestamp }
            : s
        );
        localStorage.setItem('chatSessions', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      from: 'user',
      text: input,
      timestamp: Date.now(),
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachments([]);
    
    if (currentSessionId) {
      saveMessages(currentSessionId, newMessages);
    }
    
    setIsThinking(true);
    
    try {
      // Simular respuesta del bot
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse: Message = {
        id: uuidv4(),
        from: 'bot',
        text: 'Gracias por tu mensaje. Estoy procesando tu consulta...',
        timestamp: Date.now()
      };
      
      const updatedMessages = [...newMessages, botResponse];
      setMessages(updatedMessages);
      
      if (currentSessionId) {
        saveMessages(currentSessionId, updatedMessages);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsThinking(false);
    }
  }, [input, messages, currentSessionId, attachments, saveMessages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    // Limpiar el input para permitir cargar el mismo archivo otra vez si es necesario
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Efecto para hacer scroll al final de los mensajes
  useEffect(() => {
    if (chatEndRef.current && isOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const themeClass = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  return (
    <>
      {/* Botón flotante */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-700 hover:bg-blue-800'
          }`}
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
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.18 }}
              className="fixed bottom-0 right-0 m-8 w-full max-w-md z-50"
            >
              <div className={`${themeClass} rounded-2xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col h-[600px]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6" />
                    <span className="font-bold text-lg">Asistente Aduanero IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsDarkMode(!isDarkMode)} 
                      className="text-white hover:bg-white/20"
                      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
                      className="text-white hover:bg-white/20"
                      aria-label={isHistoryOpen ? 'Cerrar historial' : 'Ver historial'}
                    >
                      <Clock className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)} 
                      className="text-white hover:bg-white/20"
                      aria-label="Cerrar chat"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Panel de historial */}
                  <AnimatePresence>
                    {isHistoryOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 250, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className={`border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-y-auto`}
                      >
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold mb-2">Historial de chats</h3>
                          <Button 
                            onClick={startNewSession}
                            className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Nueva conversación
                          </Button>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {sessions.map(session => (
                            <button
                              key={session.id}
                              onClick={() => {
                                loadSession(session.id);
                                setIsHistoryOpen(false);
                              }}
                              className={`w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                session.id === currentSessionId 
                                  ? 'bg-blue-50 dark:bg-blue-900/30' 
                                  : ''
                              }`}
                            >
                              <div className="font-medium truncate">{session.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {new Date(session.timestamp).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
                                {session.lastMessage}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Área de chat */}
                  <div className="flex-1 flex flex-col">
                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <Bot className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Bienvenido al Asistente Aduanero IA</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-6">
                            ¿En qué puedo ayudarte hoy?
                          </p>
                          <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                            {FAQ_SUGGESTIONS.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => setInput(suggestion)}
                                className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          {messages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              message={message}
                              onFeedback={(id, type) => setFeedback(prev => ({ ...prev, [id]: type }))}
                              feedback={feedback}
                              theme={isDarkMode ? 'dark' : 'light'}
                            />
                          ))}
                          {isThinking && (
                            <div className="flex justify-start">
                              <div className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                                isDarkMode 
                                  ? 'bg-gray-800 text-gray-100 border border-blue-900' 
                                  : 'bg-white text-gray-900 border border-blue-100'
                              } flex items-center gap-2`}>
                                <span className="animate-pulse">Escribiendo</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      {/* Archivos adjuntos */}
                      {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {attachments.map((file, i) => (
                            <div 
                              key={i}
                              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span className="max-w-[120px] truncate">{file.name}</span>
                              <button 
                                onClick={() => removeAttachment(i)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                                aria-label="Eliminar archivo"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu pregunta..."
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12`}
                            aria-label="Escribe tu mensaje"
                            ref={inputRef}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                              aria-label="Adjuntar archivo"
                            >
                              <Paperclip className="h-4 w-4" />
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              className="hidden"
                              multiple
                              aria-label="Seleccionar archivo"
                            />
                            <button
                              type="button"
                              onClick={() => setInput('')}
                              className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                input ? 'text-gray-500 dark:text-gray-400' : 'text-transparent'
                              }`}
                              disabled={!input}
                              aria-label="Limpiar mensaje"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <Button 
                          onClick={handleSend}
                          disabled={(!input.trim() && attachments.length === 0) || isThinking}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4"
                          aria-label="Enviar mensaje"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3" />
                          <span>Respuestas basadas en normativa</span>
                        </div>
                        <label className="flex items-center gap-1 cursor-pointer text-sm">
                          <input 
                            type="checkbox" 
                            checked={useAI} 
                            onChange={(e) => setUseAI(e.target.checked)} 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>IA Avanzada</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AduanaChatbot;