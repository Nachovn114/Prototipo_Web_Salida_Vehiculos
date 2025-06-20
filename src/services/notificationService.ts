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
 * @param fileName Nombre del archivo del documento
 * @param status Estado de la validación
 * @param details Detalles adicionales como la fecha de vencimiento detectada
 * @param documentType Tipo de documento (opcional)
 */
export const notifyDocumentValidation = (
  fileName: string, 
  status: 'Válido' | 'Vencido' | 'Error' | 'Revisión Manual' | 'Error de Procesamiento',
  details: string = '',
  documentType?: string
) => {
    const statusConfig = {
        'Válido': {
            message: 'El documento ha sido validado correctamente.',
            type: 'success' as NotificationType,
            priority: 'normal' as const
        },
        'Vencido': {
            message: `¡Atención! El documento ha vencido.${details ? `\nFecha de vencimiento: ${details}` : ''}`,
            type: 'warning' as NotificationType,
            priority: 'alta' as const
        },
        'Revisión Manual': {
            message: `No se pudo validar automáticamente. Se requiere revisión manual.${details ? `\nRazón: ${details}` : ''}`,
            type: 'warning' as NotificationType,
            priority: 'media' as const
        },
        'Error': {
            message: 'Error en la validación del documento. Se requiere revisión manual.',
            type: 'error' as NotificationType,
            priority: 'alta' as const
        },
        'Error de Procesamiento': {
            message: `No se pudo procesar el documento.${details ? `\nError: ${details}` : ''}`,
            type: 'error' as NotificationType,
            priority: 'alta' as const
        }
    };

    const config = statusConfig[status] || statusConfig['Error'];
    const title = documentType 
        ? `${documentType}: ${status}` 
        : `Validación de Documento: ${status}`;

    createNotification({
        tipo: config.type,
        titulo: title,
        mensaje: `Archivo: ${fileName}\n${config.message}`,
        prioridad: config.priority,
        timestamp: new Date(),
        acciones: [
            {
                label: 'Ver Documento',
                action: () => {
                    notificationStore?.navigate?.('/documentos');
                },
                variant: 'default' as const
            },
            ...(status === 'Vencido' ? [{
                label: 'Solicitar Renovación',
                action: () => {
                    // Lógica para solicitar renovación
                    console.log(`Solicitando renovación para ${fileName}`);
                },
                variant: 'outline' as const
            }] : [])
        ],
        metadata: {
            documentName: fileName,
            validationStatus: status,
            validationDate: new Date().toISOString(),
            ...(details && { validationDetails: details }),
            ...(documentType && { documentType })
        }
    });
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