
import { useState, useCallback } from 'react';

export interface Notification {
  id: number;
  tipo: 'aprobacion' | 'documento' | 'info' | 'warning' | 'error';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    tipo: 'aprobacion',
    titulo: 'Solicitud Aprobada',
    mensaje: 'Su solicitud ABCD-12 ha sido aprobada',
    fecha: '2024-06-20 14:30',
    leida: false
  },
  {
    id: 2,
    tipo: 'documento',
    titulo: 'Documento Requerido',
    mensaje: 'Falta subir Revisión Técnica para EFGH-34',
    fecha: '2024-06-20 13:15',
    leida: false
  },
  {
    id: 3,
    tipo: 'info',
    titulo: 'Actualización del Sistema',
    mensaje: 'El sistema estará en mantenimiento el 25/06',
    fecha: '2024-06-19 10:00',
    leida: true
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, leida: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, leida: true }))
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.leida).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};
