import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import DatosPersonales from '@/components/registro/DatosPersonales';
import DatosVehiculo from '@/components/registro/DatosVehiculo';
import CredencialesAcceso from '@/components/registro/CredencialesAcceso';
import TerminosCondiciones from '@/components/registro/TerminosCondiciones';

type EstadoSolicitud = "pendiente" | "aprobado" | "rechazado" | "observado";

interface FormData {
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

  // Credenciales de Acceso
  nombreUsuario: string;
  contrasena: string;
  confirmarContrasena: string;
  aceptaTerminos: boolean;
  privacidadAceptada: boolean;
  
  // Documentación
  licenciaConducir: File | null;
  estado: EstadoSolicitud;
  motivoViaje: string;
  destino: string;
  tiempoEstimado: string;
  tieneMercancia: boolean;
  fechaSolicitud: string;
}

export default function RegistroConductor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tiposVehiculo] = useState<string[]>([
    'Automóvil', 'Camioneta', 'Camión', 'Moto', 'Otro'
  ]);
  const [formData, setFormData] = useState<FormData>({
    // Datos Personales
    nombre: '',
    apellido: '',
    rut: '',
    nacionalidad: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    region: '',
    pais: '',
    telefono: '',
    email: '',
    comuna: '',

    // Datos del Vehículo
    patente: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    numeroMotor: '',
    numeroChasis: '',
    tipoVehiculo: '',
    capacidadCarga: '',
    seguro: null,
    revisionTecnica: null,
    permisoCirculacion: null,

    // Credenciales de Acceso
    nombreUsuario: '',
    contrasena: '',
    confirmarContrasena: '',
    aceptaTerminos: false,
    privacidadAceptada: false,
    
    // Documentación
    licenciaConducir: null,
    estado: 'pendiente',
    motivoViaje: '',
    destino: '',
    tiempoEstimado: '',
    tieneMercancia: false,
    fechaSolicitud: new Date().toISOString().split('T')[0],
  });

  // Datos de regiones y comunas de Chile
  const regionesChile = [
    { id: '13', nombre: 'Región Metropolitana' },
    { id: '5', nombre: 'Región de Valparaíso' },
    { id: '8', nombre: 'Región del Biobío' },
    { id: '9', nombre: 'Región de La Araucanía' },
    { id: '1', nombre: 'Región de Tarapacá' },
    { id: '2', nombre: 'Región de Antofagasta' },
    { id: '3', nombre: 'Región de Atacama' },
    { id: '4', nombre: 'Región de Coquimbo' },
    { id: '6', nombre: 'Región del Libertador Bernardo O\'Higgins' },
    { id: '7', nombre: 'Región del Maule' },
    { id: '10', nombre: 'Región de Los Lagos' },
    { id: '11', nombre: 'Región de Aysén' },
    { id: '12', nombre: 'Región de Magallanes' },
    { id: '14', nombre: 'Región de Los Ríos' },
    { id: '15', nombre: 'Región de Arica y Parinacota' },
    { id: '16', nombre: 'Región de Ñuble' }
  ];

  const comunasPorRegion = {
    '13': [
      'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida',
      'Maipú', 'Puente Alto', 'La Reina', 'Vitacura', 'Lo Barnechea',
      'La Cisterna', 'La Granja', 'La Pintana', 'San Ramón', 'Pedro Aguirre Cerda'
    ],
    '5': [
      'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana',
      'Quillota', 'La Calera', 'San Antonio', 'San Felipe', 'Los Andes'
    ],
    '8': [
      'Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz', 'Los Ángeles',
      'Coronel', 'Lota', 'Chillán', 'Chillán Viejo', 'Bulnes'
    ],
    '9': [
      'Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol',
      'Victoria', 'Lautaro', 'Nueva Imperial', 'Pitrufquén', 'Vilcún'
    ]
    // Podemos agregar más regiones y comunas si es necesario
  };

  // Estado para las comunas disponibles
  const [comunasDisponibles, setComunasDisponibles] = useState<{ id: string; nombre: string; regionId: string; }[]>([]);

  // Obtener comunas basadas en la región seleccionada
  const getComunasByRegion = (regionId: string) => {
    if (!regionId) return [];
    const comunas = comunasPorRegion[regionId as keyof typeof comunasPorRegion] || [];
    return comunas.map((nombre, index) => ({
      id: `${regionId}-${index}`,
      nombre,
      regionId
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => {
        // Si está cambiando la región, también limpiamos la comuna seleccionada
        const updatedData = {
          ...prev,
          [name]: value,
          ...(name === 'region' ? { comuna: '' } : {}) // Limpiar comuna al cambiar de región
        };
        return updatedData;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    navigate('/registro-exitoso');
  };

  const [selectedRegion, setSelectedRegion] = useState('');

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    setFormData(prev => ({
      ...prev,
      region: regionId,
      comuna: '' // Reset comuna when region changes
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DatosPersonales 
            formData={formData} 
            setFormData={setFormData} 
            onRegionChange={handleRegionChange}
            errors={{}} 
            regiones={regionesChile} 
            comunas={comunasDisponibles}
          />
        );
      case 2:
        return (
          <DatosVehiculo 
            formData={formData} 
            errors={{}} 
            tiposVehiculo={tiposVehiculo}
            onFieldChange={(field, value) => handleChange({
              target: { name: field, value }
            } as React.ChangeEvent<HTMLInputElement>)}
          />
        );
      case 3:
        return <CredencialesAcceso formData={formData} handleChange={handleChange} />;
      case 4:
        return (
          <TerminosCondiciones 
            formData={formData} 
            errors={{}} 
            onFieldChange={(field, value) => handleChange({
              target: { name: field, value }
            } as React.ChangeEvent<HTMLInputElement>)}
          />
        );
      default:
        return (
          <DatosPersonales 
            formData={formData} 
            setFormData={setFormData} 
            onRegionChange={handleRegionChange}
            errors={{}} 
            regiones={regionesChile} 
            comunas={comunasDisponibles}
          />
        );
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    // Primero establecer la región y comuna
    const initialRegion = '13'; // Región Metropolitana
    const initialComuna = 'Santiago';
    
    // Obtener las comunas para la región inicial
    const initialComunas = getComunasByRegion(initialRegion);
    
    // Actualizar el estado con los datos iniciales
    setFormData(prev => ({
      ...prev,
      // Datos personales de prueba
      nombre: 'Juan',
      apellido: 'Pérez',
      rut: '12.345.678-9',
      nacionalidad: 'Chilena',
      fechaNacimiento: '1990-01-01',
      genero: 'masculino',
      direccion: 'Av. Principal 123',
      ciudad: initialComuna,
      region: initialRegion,
      pais: 'Chile',
      telefono: '+56912345678',
      email: 'juan.perez@example.com',
      comuna: initialComuna,
      
      // Datos del vehículo de prueba
      patente: 'AB123CD',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: '2020',
      color: 'Blanco',
      numeroMotor: 'ENG123456789',
      numeroChasis: 'CHS123456789',
      tipoVehiculo: 'Automóvil',
      capacidadCarga: '500',
      
      // Credenciales de prueba
      nombreUsuario: 'juan.perez',
      contrasena: 'Password123!',
      confirmarContrasena: 'Password123!',
      
      // Otros
      motivoViaje: 'Viaje de negocios',
      destino: 'Mendoza, Argentina',
      tiempoEstimado: '7 días',
      tieneMercancia: true,
      tipoMercancia: 'Electrónica',
      valorMercancia: 1500,
      observaciones: 'Sin observaciones',
      aceptaTerminos: true
    }));
    
    // Establecer las comunas disponibles para la región inicial
    setComunasDisponibles(initialComunas);
  }, []);

  // Actualizar las comunas disponibles cuando cambia la región seleccionada
  useEffect(() => {
    if (formData.region) {
      const nuevasComunas = getComunasByRegion(formData.region);
      setComunasDisponibles(nuevasComunas);
    } else {
      setComunasDisponibles([]);
    }
  }, [formData.region]);

  return (
    <div 
      className="min-h-screen w-full flex items-start justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-fixed overflow-y-auto"
      style={{
        backgroundImage: 'url(/images/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Contenido principal */}
      <div className="w-full max-w-4xl my-4 sm:my-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 bg-white/90 hover:bg-white transition-colors shadow-md rounded-full px-4 py-2 text-blue-800 hover:text-blue-900 z-20"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver atrás
        </Button>

        <Card className="w-full mx-auto shadow-2xl overflow-hidden bg-white/95 backdrop-blur-sm border border-white/30">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Registro de Conductor
            </CardTitle>
            <CardDescription className="text-blue-100">
              Completa todos los pasos para registrar tu vehículo en el sistema de control fronterizo
            </CardDescription>
          </CardHeader>

          {/* Progress Steps */}
          <div className="px-6 pt-6 pb-2 border-b">
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex-1 min-w-[120px]">
                  <div 
                    className={`flex flex-col items-center text-center ${
                      step >= stepNumber ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step >= stepNumber 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-400'
                      } font-semibold`}
                    >
                      {stepNumber}
                    </div>
                    <span className="text-xs sm:text-sm font-medium">
                      {stepNumber === 1 && 'Datos Personales'}
                      {stepNumber === 2 && 'Vehículo'}
                      {stepNumber === 3 && 'Credenciales'}
                      {stepNumber === 4 && 'Términos'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CardContent className="p-4 sm:p-6">
            <div className="min-h-[300px] sm:min-h-[350px]">
              {renderStep()}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className={`${step === 1 ? 'invisible' : ''} w-full sm:w-auto`}
              >
                Anterior
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {step < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full sm:w-auto"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Enviar Solicitud
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs sm:text-sm text-white/80">
          <p>¿Necesitas ayuda? <a href="#" className="text-white hover:underline font-medium">Contáctanos</a></p>
          <p className="mt-1"> {new Date().getFullYear()} Control Fronterizo Chile-Argentina. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
