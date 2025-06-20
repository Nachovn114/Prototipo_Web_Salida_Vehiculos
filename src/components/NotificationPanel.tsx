import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, FileText, Info, Bell, Filter, Trash2, Check, Clock, Zap, Shield, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Notification, NotificationType } from '../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPanelProps {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  executeAction: (id: number, actionIndex: number) => void;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  executeAction,
  onClose
}) => {
  const [filter, setFilter] = useState<string>('todas');

  const getIcon = (tipo: NotificationType) => {
    switch (tipo) {
      case 'urgente': return <Zap className="h-4 w-4 text-red-500" />;
      case 'aprobacion': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rechazo': return <X className="h-4 w-4 text-red-500" />;
      case 'documento': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'sistema': return <Settings className="h-4 w-4 text-purple-500" />;
      case 'usuario': return <User className="h-4 w-4 text-indigo-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'alta': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'media': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'baja': return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return <Zap className="h-3 w-3 text-red-500" />;
      case 'alta': return <AlertTriangle className="h-3 w-3 text-orange-500" />;
      case 'media': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'baja': return <Info className="h-3 w-3 text-gray-500" />;
      default: return <Info className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('es-CL');
  };

  const filteredNotifications = filter === 'todas' 
    ? notifications 
    : filter === 'no-leidas' 
    ? notifications.filter(n => !n.leida)
    : notifications.filter(n => n.tipo === filter);

  const unreadCount = notifications.filter(n => !n.leida).length;
  const urgentCount = notifications.filter(n => n.prioridad === 'urgente' && !n.leida).length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 text-foreground dark:text-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtros y acciones */}
        <div className="flex items-center gap-2 mb-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="no-leidas">No leídas</SelectItem>
              <SelectItem value="urgente">Urgentes</SelectItem>
              <SelectItem value="aprobacion">Aprobaciones</SelectItem>
              <SelectItem value="documento">Documentos</SelectItem>
              <SelectItem value="sistema">Sistema</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="h-8 px-2 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Indicador de urgencia */}
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <Zap className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {urgentCount} notificación{urgentCount > 1 ? 'es' : ''} urgente{urgentCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500 dark:text-gray-400"
            >
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay notificaciones</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  notification.leida ? 'opacity-75' : ''
                } ${getPriorityColor(notification.prioridad)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium text-sm ${notification.leida ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {notification.titulo}
                          </p>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(notification.prioridad)}
                            {!notification.leida && (
                              <Badge variant="secondary" className="text-xs animate-pulse">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {notification.mensaje}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(notification.fecha)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Acciones */}
                    {notification.acciones && notification.acciones.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.acciones.map((accion, actionIndex) => (
                          <Button
                            key={actionIndex}
                            size="sm"
                            variant={accion.variant || 'outline'}
                            onClick={() => executeAction(notification.id, actionIndex)}
                            className="text-xs h-7 px-2"
                          >
                            {accion.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
