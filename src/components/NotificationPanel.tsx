
import React from 'react';
import { X, CheckCircle, AlertTriangle, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 shadow-xl">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notificaciones</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay notificaciones</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.leida ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.tipo)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.titulo}</p>
                      {!notification.leida && (
                        <Badge variant="secondary" className="text-xs">Nuevo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.mensaje}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.fecha}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
