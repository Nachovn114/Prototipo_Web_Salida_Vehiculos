/**
 * Utilidades para generar datos realistas de personas chilenas
 */

// Nombres y apellidos chilenos comunes
const NOMBRES_HOMBRES = [
  'Juan', 'Pedro', 'Diego', 'Andrés', 'Cristóbal', 'Matías', 'Joaquín', 'Sebastián', 'Gabriel', 'Alejandro',
  'Felipe', 'Martín', 'Benjamín', 'Maximiliano', 'Javier', 'Tomás', 'Lucas', 'Emiliano', 'Daniel', 'Ignacio',
  'Cristián', 'Rodrigo', 'Gonzalo', 'Francisco', 'Pablo', 'Ricardo', 'Sergio', 'Hernán', 'Mauricio', 'Patricio'
];

const NOMBRES_MUJERES = [
  'María', 'Josefa', 'Ana', 'Paula', 'Isidora', 'Florencia', 'Valentina', 'Sofía', 'Emilia', 'Martina',
  'Catalina', 'Antonella', 'Agustina', 'Fernanda', 'Constanza', 'Javiera', 'Francisca', 'Camila', 'Antonia', 'Isabella',
  'Daniela', 'Carolina', 'Valeria', 'Macarena', 'Paz', 'Amanda', 'Gabriela', 'Pilar', 'Trinidad', 'Rocío'
];

const APELLIDOS = [
  'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda',
  'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela',
  'Castillo', 'Ramírez', 'Reyes', 'Gutiérrez', 'Castro', 'Vargas', 'Álvarez', 'Vásquez', 'Tapia', 'Fernández',
  'Sánchez', 'Carrasco', 'Gómez', 'Cortés', 'Herrera', 'Núñez', 'Jara', 'Vergara', 'Rivera', 'Figueroa', 'Riquelme'
];

// Marcas y modelos de vehículos comunes en Chile
const MARCAS_VEHICULOS = [
  'Chevrolet', 'Kia', 'Hyundai', 'Toyota', 'Nissan', 'Mitsubishi', 'Suzuki', 'Renault', 'Peugeot', 'Volkswagen',
  'Ford', 'Mazda', 'Fiat', 'Citroën', 'Chery', 'Great Wall', 'JAC', 'MG', 'Changan', 'DFSK'
];

const MODELOS_VEHICULOS = {
  'Chevrolet': ['Spark', 'Sonic', 'Aveo', 'Onix', 'Cruze', 'Orlando', 'Tracker', 'Captiva', 'Trailblazer'],
  'Kia': ['Morning', 'Rio', 'Cerato', 'Forte', 'Stinger', 'Seltos', 'Sportage', 'Sorento', 'Soul'],
  'Hyundai': ['i10', 'Grand i10', 'Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Kona'],
  'Toyota': ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Fortuner', 'Hilux', 'Land Cruiser', 'Prado'],
  'Nissan': ['March', 'Versa', 'Sentra', 'Qashqai', 'X-Trail', 'Kicks', 'Navara', 'Frontier']
};

// Tipos de carga comunes
const TIPOS_CARGA = [
  'Electrodomésticos', 'Muebles', 'Alimentos', 'Textiles', 'Electrónica', 'Herramientas', 'Materiales de construcción',
  'Productos químicos', 'Productos agrícolas', 'Mercadería general', 'Repuestos', 'Artículos deportivos', 'Juguetes'
];

// Ciudades de Chile
const CIUDADES = [
  'Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'La Serena', 'Antofagasta', 'Iquique', 'Arica', 'Punta Arenas',
  'Puerto Montt', 'Osorno', 'Valdivia', 'Temuco', 'Rancagua', 'Talca', 'Chillán', 'Los Ángeles', 'Curicó', 'Quillota', 'San Antonio'
];

// Funciones de utilidad
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomRut(): string {
  const num = getRandomInt(1000000, 25000000);
  const dv = getDigitoVerificador(num);
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

function getDigitoVerificador(numero: number): string {
  let suma = 0;
  let multiplicador = 2;
  const numStr = numero.toString().split('').reverse().join('');
  
  for (let i = 0; i < numStr.length; i++) {
    suma += parseInt(numStr[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dv = 11 - resto;
  
  if (dv === 10) return 'K';
  if (dv === 11) return '0';
  return dv.toString();
}

export function getRandomEmail(nombre: string, apellido: string): string {
  const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.cl', 'uc.cl', 'usach.cl'];
  const dominio = getRandomElement(dominios);
  const separadores = ['', '.', '_', '-'];
  const separador = getRandomElement(separadores);
  const numero = Math.random() > 0.5 ? getRandomInt(1, 99) : '';
  
  return `${nombre.toLowerCase()}${separador}${apellido.toLowerCase()}${numero}@${dominio}`.replace(/\s+/g, '');
}

export function getRandomPhone(): string {
  const prefix = ['9', '2'];
  return `+56 9 ${getRandomInt(5000, 9999)} ${getRandomInt(1000, 9999)}`;
}

export function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generadores de datos
export function generateRandomPersona() {
  const esHombre = Math.random() > 0.5;
  const nombres = esHombre ? NOMBRES_HOMBRES : NOMBRES_MUJERES;
  const nombre = getRandomElement(nombres);
  const apellidoPaterno = getRandomElement(APELLIDOS);
  const apellidoMaterno = getRandomElement(APELLIDOS);
  const rut = getRandomRut();
  const email = getRandomEmail(nombre, apellidoPaterno);
  const telefono = getRandomPhone();
  const fechaNacimiento = getRandomDate(new Date(1980, 0, 1), new Date(2003, 11, 31));
  
  return {
    nombre: `${nombre} ${apellidoPaterno} ${apellidoMaterno}`,
    rut,
    email,
    telefono,
    fechaNacimiento
  };
}

export function generateRandomVehiculo() {
  const marca = getRandomElement(MARCAS_VEHICULOS);
  const modelos = MODELOS_VEHICULOS[marca as keyof typeof MODELOS_VEHICULOS] || ['Desconocido'];
  const modelo = getRandomElement(modelos);
  const año = getRandomInt(2010, 2023);
  const colores = ['Azul', 'Rojo', 'Blanco', 'Negro', 'Plata', 'Gris', 'Verde', 'Amarillo', 'Naranjo'];
  const color = getRandomElement(colores);
  const patente = `${getRandomElement(['BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BJ', 'BK', 'BL', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CJ', 'CK', 'CL', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DJ', 'DK', 'DL', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EJ', 'EK', 'EL'])} ${getRandomInt(10, 99)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  
  return {
    patente,
    marca,
    modelo,
    año,
    color
  };
}

export function generateRandomSolicitud() {
  const conductor = generateRandomPersona();
  const numAcompanantes = getRandomInt(0, 3);
  const acompanantes = Array(numAcompanantes).fill(0).map(() => generateRandomPersona());
  const vehiculo = generateRandomVehiculo();
  const tipoCarga = getRandomElement(TIPOS_CARGA);
  const origen = getRandomElement(CIUDADES);
  const destino = getRandomElement(CIUDADES.filter(ciudad => ciudad !== origen));
  const fechaHora = getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const riesgo = getRandomElement(['bajo', 'medio', 'alto'] as const);
  const estado = getRandomElement(['Pendiente', 'Aprobado', 'Rechazado']);
  
  return {
    id: `SOL-${getRandomInt(1000, 9999)}`,
    conductor,
    acompanantes,
    vehiculo,
    tipoCarga,
    origen,
    destino,
    fechaHora,
    riesgo,
    estado,
    documentos: [
      { id: 1, nombre: 'SOAP', estado: 'Válido', vencimiento: '2025-12-31' },
      { id: 2, nombre: 'Revisión Técnica', estado: 'Válido', vencimiento: '2025-08-20' },
      { id: 3, nombre: 'Licencia', estado: 'Válido', vencimiento: '2028-05-15' },
    ],
    biometria: 'Pendiente',
    mercancias: [
      { tipo: tipoCarga, valor: getRandomInt(100, 5000), observaciones: 'Sin observaciones' }
    ],
    observaciones: '',
  };
}

// Datos de ejemplo para la aplicación
export const DATOS_EJEMPLO = {
  solicitudes: Array(10).fill(0).map((_, i) => generateRandomSolicitud()),
  usuarios: Array(5).fill(0).map(() => generateRandomPersona()).map((p, i) => ({
    ...p,
    rol: i === 0 ? 'Administrador' : i < 3 ? 'Inspector' : 'Usuario',
    usuario: p.email.split('@')[0]
  }))
};
