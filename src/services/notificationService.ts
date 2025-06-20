import type { Notification, NotificationType } from '@/hooks/useNotifications';
import type { NavigateFunction } from 'react-router-dom';

// Este 'almacén' contendrá la función addNotification y navigate
let notificationStore: {
  add: (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => void;
  navigate: NavigateFunction | null;
} | null = null;

/**
 * Inyecta la función addNotification y navigate en el servicio.
 * Debe ser llamado en un componente de alto nivel como MainLayout.
 */
export const provideNotificationStore = (store: {
  add: (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => void;
  navigate: NavigateFunction;
}) => {
  notificationStore = store;
};

const createNotification = (
  notification: Omit<Notification, 'id' | 'fecha' | 'leida'>
) => {
  if (!notificationStore) {
    console.warn(
      'Notification store not provided. Call provideNotificationStore() first.'
    );
    return;
  }
  notificationStore.add(notification);
};

// --- Notificaciones Inteligentes ---

/**
 * Notificación para un vehículo marcado con alto riesgo.
 */
export const notifyHighRiskVehicle = (solicitudId: string, riskLevel: 'alta' | 'urgente') => {
    createNotification({
        tipo: 'warning',
        titulo: 'Vehículo de Alto Riesgo Detectado',
        mensaje: `La solicitud ${solicitudId} ha sido clasificada con riesgo ${riskLevel}. Se requiere inspección prioritaria.`,
        prioridad: riskLevel,
        acciones: [
            { label: 'Ver Solicitud', action: () => { 
                notificationStore?.navigate?.(`/solicitud/${solicitudId}`); 
            }, variant: 'default' },
        ],
    });
};

/**
 * Notificación sobre el resultado de la validación de un documento.
 */
export const notifyDocumentValidation = (fileName: string, status: 'Válido' | 'Vencido' | 'Error') => {
    let tipo: NotificationType = 'info';
    let titulo = 'Validación de Documento';
    let mensaje = `El documento ${fileName} ha sido procesado.`;
    let prioridad: 'baja' | 'media' | 'alta' = 'media';

    if (status === 'Vencido') {
        tipo = 'error';
        titulo = 'Documento Vencido';
        mensaje = `El documento ${fileName} parece haber expirado. Por favor, revise manualmente.`;
        prioridad = 'alta';
    } else if (status === 'Válido') {
        tipo = 'aprobacion';
        titulo = 'Documento Válido';
        mensaje = `El documento ${fileName} fue validado correctamente por OCR.`;
        prioridad = 'baja';
    } else if (status === 'Error') {
        tipo = 'warning';
        titulo = 'Error de Lectura OCR';
        mensaje = `No se pudo leer la fecha de vencimiento del documento ${fileName}. Se requiere verificación manual.`;
        prioridad = 'media';
    }
  
    createNotification({ tipo, titulo, mensaje, prioridad });
};

/**
 * Notificación sobre predicciones de congestión.
 */
export const notifyCongestionPrediction = (level: 'Moderada' | 'Alta' | 'Severa') => {
    createNotification({
        tipo: 'sistema',
        titulo: 'Alerta de Congestión Fronteriza',
        mensaje: `Predicción de congestión ${level.toLowerCase()} para las próximas 2 horas. Considere reasignar personal.`,
        prioridad: level === 'Severa' ? 'alta' : 'media',
        acciones: [{ label: 'Ver Dashboard', action: () => notificationStore?.navigate?.('/') }]
    });
};

/**
 * Notificación genérica para cambios de estado de una solicitud.
 */
export const notifyStatusChange = (solicitudId: string, newStatus: string) => {
    createNotification({
        tipo: 'info',
        titulo: 'Actualización de Solicitud',
        mensaje: `El estado de la solicitud ${solicitudId} ha cambiado a: ${newStatus}.`,
        prioridad: 'media',
        acciones: [{ label: 'Ver Detalles', action: () => notificationStore?.navigate?.(`/solicitud/${solicitudId}`) }]
    });
}; 