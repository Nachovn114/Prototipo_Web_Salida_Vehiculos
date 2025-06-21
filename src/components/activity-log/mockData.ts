import { ActivityLogItem, ActionType, ActionCategory, ActionSeverity } from './types';

// Tipos de acciones específicas para aduana
const actionTypes = ['create', 'update', 'delete', 'login', 'logout', 'approve', 'reject', 'system'] as const;
const categories = ['SALIDA_VEHICULO', 'DOCUMENTO', 'USUARIO', 'SISTEMA', 'AUDITORIA'] as const;
const severities = ['SUCCESS', 'INFO', 'ADVERTENCIA', 'ERROR'] as const;

interface User {
  id: string;
  name: string;
  role: 'Administrador' | 'Inspector' | 'Sistema' | 'Supervisor';
  avatar?: string;
  department?: string;
}

// Usuarios realistas para una aduana fronteriza
const users: User[] = [
  { id: '1', name: 'Carlos Mendoza', role: 'Administrador', department: 'Administración Aduanera' },
  { id: '2', name: 'María González', role: 'Inspector', department: 'Control Fronterizo' },
  { id: '3', name: 'Ana Rodríguez', role: 'Inspector', department: 'Revisión Vehicular' },
  { id: '4', name: 'Luis Herrera', role: 'Supervisor', department: 'Supervisión Aduanera' },
  { id: '5', name: 'Patricia Silva', role: 'Inspector', department: 'Control Fronterizo' },
  { id: '6', name: 'Roberto Castillo', role: 'Administrador', department: 'Tecnología' },
  { id: '7', name: 'Carmen López', role: 'Supervisor', department: 'Operaciones' },
  { id: '8', name: 'Fernando Torres', role: 'Inspector', department: 'Revisión Vehicular' },
  { id: '9', name: 'Sistema', role: 'Sistema', department: 'Sistema' }
];

// Cruces fronterizos entre Chile y Argentina
const borderCrossings = [
  { id: 'PJ', name: 'Paso Los Libertadores', country: 'CL' },
  { id: 'CH', name: 'Paso Cristo Redentor', country: 'AR' },
  { id: 'CA', name: 'Paso Cardenal Samoré', country: 'CL' },
  { id: 'PA', name: 'Paso Pajaritos', country: 'AR' },
  { id: 'AG', name: 'Paso Agua Negra', country: 'CL' },
  { id: 'SF', name: 'Paso San Francisco', country: 'AR' }
];

// Acciones específicas por categoría
const actionTemplates = {
  SALIDA_VEHICULO: [
    'Registro de salida de vehículo',
    'Verificación documental completada',
    'Inspección física realizada',
    'Aprobación de salida',
    'Rechazo de salida',
    'Documentación incompleta',
    'Problemas en inspección física'
  ],
  DOCUMENTO: [
    'Subida de manifiesto de carga',
    'Validación de documentos',
    'Firma digital aplicada',
    'Error en formato de documento',
    'Documento rechazado',
    'Actualización de estado documental'
  ],
  USUARIO: [
    'Inicio de sesión',
    'Cierre de sesión',
    'Cambio de contraseña',
    'Actualización de perfil',
    'Intento fallido de inicio de sesión',
    'Cuenta bloqueada temporalmente'
  ],
  SISTEMA: [
    'Copia de seguridad completada',
    'Actualización del sistema',
    'Mantenimiento programado',
    'Error en el sistema',
    'Alta disponibilidad activada',
    'Rendimiento degradado'
  ],
  AUDITORIA: [
    'Auditoría de seguridad iniciada',
    'Revisión de registros completada',
    'Intento de acceso no autorizado',
    'Cambio de configuración crítico',
    'Exportación de registros de auditoría'
  ]
};

// Generar una dirección IP aleatoria
const generateIpAddress = (): string => {
  const part1 = Math.floor(Math.random() * 255);
  const part2 = Math.floor(Math.random() * 255);
  return `192.168.${part1}.${part2}`;
};

// Generar una patente de vehículo realista
const generateLicensePlate = (country: 'CL' | 'AR'): string => {
  if (country === 'CL') {
    // Formato chileno: AB CD 12 o AB 1234
    const letters = 'BCDFGHJKLPRSTVWXYZ';
    const numbers = '0123456789';
    
    // 70% de probabilidad para formato nuevo (4 letras + 2 números)
    if (Math.random() > 0.3) {
      return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}` +
             `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}` +
             `${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}`;
    } else {
      // 30% para formato antiguo (2 letras + 4 números)
      return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}` +
             ` ${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}` +
             `${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}`;
    }
  } else {
    // Formato argentino: AB 123 CD o AB 1234 CD
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];
    const letter3 = letters[Math.floor(Math.random() * letters.length)];
    const letter4 = letters[Math.floor(Math.random() * letters.length)];
    
    // 50/50 entre formato viejo y nuevo
    if (Math.random() > 0.5) {
      // Formato nuevo: 2 letras + 3 números + 2 letras
      return `${letter1}${letter2} ${numbers[Math.floor(Math.random() * 10)]}` +
             `${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]} ` +
             `${letter3}${letter4}`;
    } else {
      // Formato viejo: 2 letras + 3 números + 1 letra
      return `${letter1}${letter2} ${numbers[Math.floor(Math.random() * 10)]}` +
             `${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]} ` +
             `${letter3}`;
    }
  }
};

// Generar un ID de documento (DNI o pasaporte)
const generateDocumentId = (country: 'CL' | 'AR'): string => {
  if (country === 'CL') {
    // RUT chileno: 12.345.678-9
    const num = Math.floor(1000000 + Math.random() * 9000000);
    let sum = 0;
    let m = 2;
    for (let i = String(num).length - 1; i >= 0; i--) {
      sum += parseInt(String(num)[i]) * m;
      m = m === 7 ? 2 : m + 1;
    }
    const dv = 11 - (sum % 11);
    const dvChar = dv === 11 ? '0' : dv === 10 ? 'K' : String(dv);
    return `${num}-${dvChar}`;
  } else {
    // DNI argentino: 12.345.678 o pasaporte: 2 letras + 6 números
    if (Math.random() > 0.3) {
      // DNI
      const num = Math.floor(1000000 + Math.random() * 9000000);
      return `${String(num).substr(0, 2)}.${String(num).substr(2, 3)}.${String(num).substr(5)}`;
    } else {
      // Pasaporte
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return `${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}` +
             `${Math.floor(100000 + Math.random() * 900000)}`;
    }
  }
};

// Generar timestamp aleatorio en los últimos 7 días
const generateRandomTimestamp = (): string => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const randomTime = new Date(sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime()));
  
  // Ajustar para concentrar más actividad en horario laboral (8:00-18:00)
  const hour = randomTime.getHours();
  if (Math.random() > 0.3 && (hour < 8 || hour > 18)) {
    // 70% de probabilidad de ajustar a horario laboral si está fuera de horario
    randomTime.setHours(8 + Math.floor(Math.random() * 10));
  }
  
  return randomTime.toISOString();
};

// Datos para generación de información vehicular chilena
const marcasModelosChilenos = [
  { marca: 'Chevrolet', modelos: ['Sail', 'Spark', 'Onix', 'Cruze', 'Trailblazer', 'S10'] },
  { marca: 'Hyundai', modelos: ['Accent', 'HB20', 'Creta', 'Tucson', 'Kona', 'Santa Fe'] },
  { marca: 'Kia', modelos: ['Rio', 'Morning', 'Seltos', 'Sportage', 'Sorento', 'Soul'] },
  { marca: 'Toyota', modelos: ['Yaris', 'Corolla', 'Corolla Cross', 'RAV4', 'Hilux', 'Fortuner'] },
  { marca: 'Nissan', modelos: ['Versa', 'Kicks', 'Qashqai', 'X-Trail', 'Navara', 'Frontier'] },
  { marca: 'Suzuki', modelos: ['Swift', 'Baleno', 'Vitara', 'Jimny', 'Grand Vitara', 'S-Cross'] },
  { marca: 'Mazda', modelos: ['2', '3', 'CX-3', 'CX-5', 'CX-30', 'BT-50'] },
  { marca: 'Peugeot', modelos: ['208', '2008', '3008', '5008', 'Partner', 'Expert'] },
  { marca: 'Renault', modelos: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Koleos', 'Oroch'] },
  { marca: 'Volkswagen', modelos: ['Gol', 'Polo', 'T-Cross', 'Tiguan', 'Taos', 'Amarok'] }
];

// Nombres y apellidos chilenos comunes
const nombresChilenos = [
  'Juan', 'José', 'Miguel', 'Carlos', 'Luis', 'Diego', 'Francisco', 'Alejandro', 'Andrés', 'Felipe',
  'María', 'Ana', 'Carolina', 'Camila', 'Valentina', 'Javiera', 'Francisca', 'Catalina', 'Isidora', 'Martina'
];

const apellidosChilenos = [
  'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda',
  'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela'
];

// Función para generar un nombre completo chileno aleatorio
const generarNombreCompleto = (): string => {
  const nombre = nombresChilenos[Math.floor(Math.random() * nombresChilenos.length)];
  const apellido1 = apellidosChilenos[Math.floor(Math.random() * apellidosChilenos.length)];
  const apellido2 = apellidosChilenos[Math.floor(Math.random() * apellidosChilenos.length)];
  return `${nombre} ${apellido1} ${apellido2}`;
};

// Función para generar un RUT chileno válido
const generarRut = (): string => {
  // Genera un número base de 7 u 8 dígitos
  const base = Math.floor(Math.random() * 9000000) + 1000000;
  let suma = 0, mul = 2;
  let rut = base;
  
  // Cálculo del dígito verificador
  while (rut > 0) {
    suma += (rut % 10) * mul;
    rut = Math.floor(rut / 10);
    mul = mul === 7 ? 2 : mul + 1;
  }
  
  const resto = suma % 11;
  const dv = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString();
  
  // Formatear con puntos y guión
  const rutStr = base.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${rutStr}-${dv}`;
};

// Función para generar información de vehículo realista
const generarInfoVehiculo = () => {
  const marcaInfo = marcasModelosChilenos[Math.floor(Math.random() * marcasModelosChilenos.length)];
  const modelo = marcaInfo.modelos[Math.floor(Math.random() * marcaInfo.modelos.length)];
  const año = new Date().getFullYear() - Math.floor(Math.random() * 15); // Últimos 15 años
  
  return {
    patente: generateLicensePlate('CL'),
    marca: marcaInfo.marca,
    modelo,
    año
  };
};

// Función para generar información del conductor
const generarInfoConductor = () => {
  return {
    nombreCompleto: generarNombreCompleto(),
    documento: generarRut(),
    tipoDocumento: 'RUT'
  };
};

// Función para generar datos de inspección vehicular
const generarInspeccionVehicular = () => {
  const vehiculo = generarInfoVehiculo();
  const conductor = generarInfoConductor();
  
  return {
    ...vehiculo,
    conductor: conductor.nombreCompleto,
    documentoConductor: conductor.documento,
    tipoDocumento: conductor.tipoDocumento,
    fechaInspeccion: new Date().toISOString(),
    resultado: ['APROBADO', 'RECHAZADO', 'PENDIENTE'][Math.floor(Math.random() * 3)],
    observaciones: ['', 'Vehículo en buen estado', 'Luz trasera dañada', 'Espejo lateral roto', 'Neumáticos desgastados', 'Documentación en regla'][Math.floor(Math.random() * 6)]
  };
};

// Generar datos de actividad realistas
export const generateMockData = (count: number): ActivityLogItem[] => {
  const activities: ActivityLogItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)] as ActionSeverity;
    const country: 'CL' | 'AR' = Math.random() > 0.5 ? 'CL' : 'AR';
    const crossing = borderCrossings[Math.floor(Math.random() * borderCrossings.length)];
    const actionTemplate = actionTemplates[category][Math.floor(Math.random() * actionTemplates[category].length)];
    
    // Ajustar severidad basado en la acción y el tipo de usuario
    let finalSeverity = severity;
    if (user.role === 'Sistema' && severity === 'ERROR') {
      finalSeverity = Math.random() > 0.7 ? 'ERROR' : 'ADVERTENCIA';
    }
    if (user.role === 'Administrador' && severity === 'ERROR') {
      finalSeverity = Math.random() > 0.8 ? 'ERROR' : 'ADVERTENCIA';
    }
    
    // Determinar el tipo de acción basado en el template
    let actionType: ActionType = 'actualizar'; // Valor por defecto
    if (actionTemplate.includes('Inicio de sesión')) actionType = 'iniciar_sesion';
    else if (actionTemplate.includes('Cierre de sesión')) actionType = 'cerrar_sesion';
    else if (actionTemplate.includes('Creación') || actionTemplate.includes('Creó')) actionType = 'crear';
    else if (actionTemplate.includes('Eliminación') || actionTemplate.includes('Eliminó')) actionType = 'eliminar';
    else if (actionTemplate.includes('Aprobación') || actionTemplate.includes('Aprobó')) actionType = 'aprobar';
    else if (actionTemplate.includes('Rechazo') || actionTemplate.includes('Rechazó')) actionType = 'rechazar';
    else if (actionTemplate.includes('Sistema')) actionType = 'sistema';
    
    // Generar metadatos específicos por categoría
    const metadata: any = {
      location: crossing.name,
      country,
      ipAddress: generateIpAddress(),
      timestamp: generateRandomTimestamp()
    };
    
    if (category === 'SALIDA_VEHICULO') {
      const inspeccion = generarInspeccionVehicular();
      metadata.vehiclePlate = inspeccion.patente;
      metadata.documentId = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
      metadata.borderCrossing = crossing.name;
      metadata.vehiculo = {
        marca: inspeccion.marca,
        modelo: inspeccion.modelo,
        año: inspeccion.año,
        conductor: inspeccion.conductor,
        documentoConductor: inspeccion.documentoConductor,
        tipoDocumento: inspeccion.tipoDocumento,
        resultadoInspeccion: inspeccion.resultado,
        observaciones: inspeccion.observaciones
      };
    } else if (category === 'DOCUMENTO') {
      metadata.documentId = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
      metadata.documentType = ['Manifiesto', 'Factura', 'Conocimiento de Embarque', 'Certificado de Origen'][Math.floor(Math.random() * 4)];
    }
    
    activities.push({
      id: `ACT-${1000 + i}`,
      timestamp: metadata.timestamp,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userAvatar: user.avatar,
      action: actionTemplate,
      actionType,
      category,
      severity: finalSeverity,
      ipAddress: metadata.ipAddress,
      location: metadata.location,
      country,
      metadata: {
        documentId: metadata.documentId,
        vehiclePlate: metadata.vehiclePlate,
        borderCrossing: metadata.borderCrossing,
        location: metadata.location,
        duration: category === 'SALIDA_VEHICULO' ? Math.floor(5 + Math.random() * 55) : undefined,
        vehiculo: metadata.vehiculo
      }
    });
  }
  
  // Ordenar por timestamp
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generar 50 actividades de ejemplo
export const mockData = generateMockData(50);
