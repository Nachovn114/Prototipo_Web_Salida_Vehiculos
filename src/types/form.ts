export interface ConductorFormData {
  // Datos Personales
  nombre: string;
  apellido: string;
  rut: string;
  nacionalidad: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  ciudad: string;
  region: string;
  pais: string;
  telefono: string;
  email: string;
  comuna: string;

  // Datos del Vehículo
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  numeroMotor: string;
  numeroChasis: string;
  tipoVehiculo: string;
  capacidadCarga: string;
  seguro: File | null;
  revisionTecnica: File | null;
  permisoCirculacion: File | null;
  licenciaConducir: File | null;

  // Credenciales de Acceso
  nombreUsuario: string;
  contrasena: string;
  confirmarContrasena: string;
  aceptaTerminos: boolean;
  privacidadAceptada: boolean;
  
  // Estado de la solicitud
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'observado';
  fechaSolicitud: string;
  
  // Datos adicionales
  motivoViaje?: string;
  destino?: string;
  tiempoEstimado?: string;
  tieneMercancia?: boolean;
  tipoMercancia?: string;
  valorMercancia?: number;
  observaciones?: string;
}

export type FormErrors = Partial<Record<keyof ConductorFormData, string>>;
