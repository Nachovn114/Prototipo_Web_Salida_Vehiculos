import React from 'react';
import { X, CheckCircle, AlertTriangle, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification } from '../hooks/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  markAsRead,
  onClose
}) => {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'aprobacion': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'documento': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 text-foreground dark:text-white rounded-none shadow-none">
      <div className="p-0">
        <div className="space-y-3 px-2 pb-2">
          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-center py-4">No hay notificaciones</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors duration-300 cursor-pointer ${notification.leida ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 animate-pulse'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.tipo)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm dark:text-white">{notification.titulo}</p>
                      {!notification.leida && (
                        <Badge variant="secondary" className="text-xs animate-bounce">Nuevo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">{notification.mensaje}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{notification.fecha}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
