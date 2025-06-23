import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Componentes de pasos del formulario
import DatosPersonales from '@/components/registro/DatosPersonales';
import DatosVehiculo from '@/components/registro/DatosVehiculo';
import Documentos from '@/components/registro/Documentos';
import CredencialesAcceso from '@/components/registro/CredencialesAcceso';
import ResumenRegistro from '@/components/registro/ResumenRegistro';

// Tipos
export interface DatosRegistroConductor {
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
  
  // Documentos
  seguro: File | null;
  revisionTecnica: File | null;
  permisoCirculacion: File | null;
  licenciaConducir: File | null;
  
  // Credenciales de Acceso
  nombreUsuario: string;
  contrasena: string;
  confirmarContrasena: string;
  password: string;
  confirmPassword: string;
  preguntaSeguridad1: string;
  respuestaSeguridad1: string;
  preguntaSeguridad2: string;
  respuestaSeguridad2: string;
  
  // Términos y Condiciones
  aceptaTerminos: boolean;
  privacidadAceptada: boolean;
};

interface FormErrors {
  [key: string]: string | undefined;
  aceptaTerminos?: string;
  privacidadAceptada?: string;
  confirmarContrasena?: string;
  // Add other error fields as needed
}

const RegistroConductor = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [autoFilled, setAutoFilled] = useState(false);
  
  // Función para crear un archivo ficticio
  const createMockFile = (fileName: string, type: string, sizeInKB = 100) => {
    const content = '0'.repeat(sizeInKB * 1024); // Archivo de texto con contenido ficticio
    const blob = new Blob([content], { type });
    const file = new File([blob], fileName, { type });
    // Sobrescribir la propiedad size para que coincida con el tamaño simulado
    Object.defineProperty(file, 'size', { value: sizeInKB * 1024 });
    return file;
  };

  // Función para rellenar automáticamente los datos
  const autoFillForm = () => {
    // Nombres masculinos y femeninos separados
    const nombresMasculinos = ['Juan', 'Pedro', 'Diego', 'Matías', 'Sebastián', 'Francisco', 'Javier', 'Alejandro', 'Cristóbal', 'Felipe'];
    const nombresFemeninos = ['María', 'Ana', 'Paula', 'Camila', 'Valentina', 'Isidora', 'Javiera', 'Fernanda', 'Catalina', 'Antonella'];
    const apellidos = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Miranda', 'Lara', 'Silva'];
    const calles = ['Avenida Providencia', 'Calle Monjitas', 'Avenida Vitacura', 'Calle Nueva Costanera', 'Avenida Apoquindo'];
    
    // Datos de regiones y comunas chilenas
    const regiones = [
      { id: '13', nombre: 'Región Metropolitana', comunas: [
        { id: '1', nombre: 'Santiago' }, 
        { id: '2', nombre: 'Providencia' },
        { id: '3', nombre: 'Las Condes' },
        { id: '4', nombre: 'Ñuñoa' },
        { id: '5', nombre: 'La Reina' },
        { id: '6', nombre: 'Macul' }
      ]},
      { id: '5', nombre: 'Región de Valparaíso', comunas: [
        { id: '7', nombre: 'Valparaíso' },
        { id: '8', nombre: 'Viña del Mar' },
        { id: '9', nombre: 'Concón' }
      ]},
      { id: '8', nombre: 'Región del Biobío', comunas: [
        { id: '10', nombre: 'Concepción' },
        { id: '11', nombre: 'Talcahuano' },
        { id: '12', nombre: 'Chiguayante' }
      ]}
    ];

    // Seleccionar género y nombre correspondiente
    const esMasculino = Math.random() > 0.5;
    const nombres = esMasculino ? nombresMasculinos : nombresFemeninos;
    const genero = esMasculino ? 'masculino' : 'femenino';
    
    // Seleccionar región y comuna
    const region = regiones[Math.floor(Math.random() * regiones.length)];
    const comuna = region.comunas[Math.floor(Math.random() * region.comunas.length)];
    
    // Generar datos aleatorios
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const segundoApellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    const rut = `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 9)}`;
    const telefono = `+569${Math.floor(10000000 + Math.random() * 90000000)}`;
    const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(10 + Math.random() * 90)}@gmail.com`;
    const direccion = `${calles[Math.floor(Math.random() * calles.length)]} #${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Crear archivos ficticios
    const licenciaConducir = createMockFile('licencia_conducir.pdf', 'application/pdf');
    const seguro = createMockFile('seguro_vehicular.pdf', 'application/pdf');
    const revisionTecnica = createMockFile('revision_tecnica.pdf', 'application/pdf');
    const permisoCirculacion = createMockFile('permiso_circulacion.pdf', 'application/pdf');
    
    setFormData(prev => ({
      ...prev,
      // Datos Personales
      nombre,
      apellido: `${apellido} ${segundoApellido}`,
      rut,
      nacionalidad: 'Chilena',
      fechaNacimiento: `19${Math.floor(70 + Math.random() * 20)}-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
      genero,
      direccion,
      ciudad: comuna.nombre,  // Establecer el nombre de la ciudad
      region: region.id,      // Establecer el ID de la región
      pais: 'Chile',
      telefono,
      email,
      comuna: comuna.id,      // Establecer el ID de la comuna
      
      // Datos del Vehículo
      patente: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10 + Math.random() * 90)}`,
      marca: ['Toyota', 'Hyundai', 'Chevrolet', 'Kia', 'Nissan', 'Mitsubishi'][Math.floor(Math.random() * 6)],
      modelo: ['Corolla', 'Yaris', 'Spark', 'Rio', 'March', 'Lancer'][Math.floor(Math.random() * 6)],
      anio: (2015 + Math.floor(Math.random() * 9)).toString(),
      color: ['Rojo', 'Azul', 'Blanco', 'Negro', 'Plata', 'Gris'][Math.floor(Math.random() * 6)],
      numeroMotor: `M${Math.floor(10000000 + Math.random() * 90000000)}`,
      numeroChasis: `CH${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      tipoVehiculo: 'Automóvil',
      capacidadCarga: '500',
      
      // Documentos
      licenciaConducir,
      seguro,
      revisionTecnica,
      permisoCirculacion,
      
      // Credenciales de Acceso
      nombreUsuario: email.split('@')[0],
      contrasena: 'Password123!',
      confirmarContrasena: 'Password123!',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      preguntaSeguridad1: '¿Cuál es el nombre de tu mascota?',
      respuestaSeguridad1: 'Firulais',
      preguntaSeguridad2: '¿Cuál es tu comida favorita?',
      respuestaSeguridad2: 'Empanadas',
      
      // Términos y Condiciones
      aceptaTerminos: true,
      privacidadAceptada: true,
    }));
    
    setAutoFilled(true);
  };
  
  // Efecto para autocompletar el formulario al cargar el componente
  useEffect(() => {
    if (!autoFilled) {
      autoFillForm();
    }
  }, [autoFilled]);

  const [formData, setFormData] = useState<DatosRegistroConductor>({
    // Datos Personales
    nombre: '',
    apellido: '',
    rut: '',
    nacionalidad: 'Chilena',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    region: '',
    pais: 'Chile',
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
    
    // Documentos
    seguro: null,
    revisionTecnica: null,
    permisoCirculacion: null,
    licenciaConducir: null,
    
    // Credenciales de Acceso
    nombreUsuario: '',
    contrasena: '',
    confirmarContrasena: '',
    password: '',
    confirmPassword: '',
    preguntaSeguridad1: '',
    respuestaSeguridad1: '',
    preguntaSeguridad2: '',
    respuestaSeguridad2: '',
    
    // Términos y Condiciones
    aceptaTerminos: false,
    privacidadAceptada: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Nuevo estado para controlar si el formulario ha sido enviado
  const navigate = useNavigate();
  const { register: _register } = useAuth();

  // Datos de ejemplo para regiones y comunas (deberían venir de una API)
  const regiones = [
    { id: '13', nombre: 'Región Metropolitana' },
    { id: '5', nombre: 'Región de Valparaíso' },
    { id: '8', nombre: 'Región del Biobío' },
  ];

  const comunas = [
    { id: '1', nombre: 'Santiago', regionId: '13' },
    { id: '2', nombre: 'Providencia', regionId: '13' },
    { id: '3', nombre: 'Las Condes', regionId: '13' },
    { id: '4', nombre: 'Valparaíso', regionId: '5' },
    { id: '5', nombre: 'Viña del Mar', regionId: '5' },
    { id: '6', nombre: 'Concepción', regionId: '8' },
  ];

  const [comunasDisponibles, setComunasDisponibles] = useState<typeof comunas>([]);

  // Función para seleccionar una comuna aleatoria de la región actual
  const seleccionarComunaAleatoria = (regionId: string) => {
    const comunasDeLaRegion = comunas.filter(comuna => comuna.regionId === regionId);
    if (comunasDeLaRegion.length > 0) {
      const comunaAleatoria = comunasDeLaRegion[Math.floor(Math.random() * comunasDeLaRegion.length)];
      return comunaAleatoria.id;
    }
    return '';
  };

  // Actualizar comunas disponibles y seleccionar una al azar cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const nuevasComunas = comunas.filter(comuna => comuna.regionId === formData.region);
      setComunasDisponibles(nuevasComunas);
      
      // Seleccionar una comuna aleatoria de la región
      const comunaAleatoriaId = seleccionarComunaAleatoria(formData.region);
      setFormData(prev => ({
        ...prev,
        comuna: comunaAleatoriaId
      }));
    } else {
      setComunasDisponibles([]);
      setFormData(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  }, [formData.region]);

  // Seleccionar una región aleatoria al cargar el componente
  useEffect(() => {
    if (regiones.length > 0 && !formData.region) {
      const regionAleatoria = regiones[Math.floor(Math.random() * regiones.length)];
      setFormData(prev => ({
        ...prev,
        region: regionAleatoria.id
      }));
    }
  }, []);

  const handleRegionChange = (regionId: string) => {
    setFormData(prev => ({
      ...prev,
      region: regionId
      // La comuna se actualizará automáticamente en el efecto
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      // Ensure we only update if the field is one of our file fields
      const fileFields: (keyof DatosRegistroConductor)[] = [
        'seguro',
        'revisionTecnica',
        'permisoCirculacion',
        'licenciaConducir'
      ];
      
      if (file instanceof File && fileFields.includes(name as any)) {
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
      } else {
        console.warn(`Invalid file field or file type: ${name}`);
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Add the handleEdit function
  const handleEdit = (stepNumber: number) => {
    setStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1: // Validar datos personales
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
        if (!formData.rut.trim()) newErrors.rut = 'El RUT es obligatorio';
        if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
        if (!formData.genero) newErrors.genero = 'El género es obligatorio';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
        if (!formData.region) newErrors.region = 'La región es obligatoria';
        if (!formData.comuna) newErrors.comuna = 'La comuna es obligatoria';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        if (!formData.email.trim()) {
          newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'El correo electrónico no es válido';
        }
        break;
        
      case 2: // Validar datos del vehículo
        if (!formData.patente.trim()) newErrors.patente = 'La patente es obligatoria';
        if (!formData.marca.trim()) newErrors.marca = 'La marca es obligatoria';
        if (!formData.modelo.trim()) newErrors.modelo = 'El modelo es obligatorio';
        if (!formData.anio) newErrors.anio = 'El año es obligatorio';
        if (!formData.color.trim()) newErrors.color = 'El color es obligatorio';
        if (!formData.tipoVehiculo) newErrors.tipoVehiculo = 'El tipo de vehículo es obligatorio';
        break;
        
      case 3: // Validar documentos
        if (!formData.licenciaConducir) newErrors.licenciaConducir = 'La licencia de conducir es obligatoria';
        if (!formData.seguro) newErrors.seguro = 'El seguro del vehículo es obligatorio';
        if (!formData.revisionTecnica) newErrors.revisionTecnica = 'La revisión técnica es obligatoria';
        if (!formData.permisoCirculacion) newErrors.permisoCirculacion = 'El permiso de circulación es obligatorio';
        break;
        
      case 4: // Validar credenciales
        if (!formData.nombreUsuario.trim()) {
          newErrors.nombreUsuario = 'El nombre de usuario es obligatorio';
        } else if (formData.nombreUsuario.length < 4) {
          newErrors.nombreUsuario = 'El nombre de usuario debe tener al menos 4 caracteres';
        }
        
        if (!formData.contrasena) {
          newErrors.contrasena = 'La contraseña es obligatoria';
        } else if (formData.contrasena.length < 8) {
          newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
        }
        
        if (!formData.confirmarContrasena) {
          newErrors.confirmarContrasena = 'Debes confirmar tu contraseña';
        } else if (formData.contrasena !== formData.confirmarContrasena) {
          newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
        }
        break;
        
      case 5: // Validar términos y condiciones
        if (!formData.aceptaTerminos) {
          newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        }
        if (!formData.privacidadAceptada) {
          newErrors.privacidadAceptada = 'Debes aceptar la política de privacidad';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      if (step < 5) {
        nextStep();
      } else {
        // Mostrar el resumen y marcar como cargando
        setLoading(true);
        setError('');
        
        try {
          // Aquí iría la llamada a la API real
          // const formDataToSend = new FormData();
          // ... (código para preparar los datos)
          // await register(formDataToSend);
          
          // Simular tiempo de procesamiento
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Redirigir a la página de éxito
          navigate('/registro-exitoso');
        } catch (err) {
          console.error('Error en el registro:', err);
          setError('Ocurrió un error al procesar tu registro. Por favor, inténtalo de nuevo.');
          setLoading(false);
        }
      }
    }
  };

  const preguntasSeguridad = [
    { value: "madre", label: "¿Cuál es el nombre de tu madre?" },
    { value: "mascota", label: "¿Cuál es el nombre de tu primera mascota?" },
    { value: "ciudad", label: "¿En qué ciudad naciste?" },
    { value: "colegio", label: "¿En qué colegio estudiaste la enseñanza básica?" },
    { value: "libro", label: "¿Cuál es tu libro favorito?" }
  ];

  const renderStep = (): JSX.Element | null => {
    const commonProps = {
      formData,
      errors,
      onChange: handleChange,
    };

    const stepComponents = {
      1: (
        <DatosPersonales 
          {...commonProps}
          setFormData={setFormData}
          onFileChange={handleFileChange}
          regiones={regiones}
          comunas={comunasDisponibles}
          onRegionChange={handleRegionChange}
        />
      ),
      2: (
        <DatosVehiculo
          {...commonProps}
        />
      ),
      3: (
        <Documentos
          {...commonProps}
          setFormData={setFormData}
          onFileChange={handleFileChange}
        />
      ),
      4: (
        <CredencialesAcceso
          {...commonProps}
          setFormData={setFormData}
          preguntasSeguridad={preguntasSeguridad}
        />
      ),
      5: (
        <ResumenRegistro
          formData={formData}
          onChange={handleCheckboxChange}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          isSubmitted={isSubmitted} // Pasar el estado isSubmitted al componente ResumenRegistro
          errors={errors}
        />
      ),
    };

    return stepComponents[step as keyof typeof stepComponents] || null;
  };

  const getStepTitle = () => {
    const titles = [
      'Datos Personales',
      'Datos del Vehículo',
      'Documentación',
      'Credenciales de Acceso',
      'Resumen y Términos'
    ];
    return titles[step - 1] || '';
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed" 
      style={{
        backgroundImage: 'url(/images/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
      data-name="RegistroPage"
    >
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-blue-100">
        {/* Encabezado */}
        <div className="text-center mb-8" data-name="Header">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2">Registro de Conductor</h1>
          <p className="text-blue-600 font-medium">Completa el formulario para crear tu cuenta de conductor</p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8" data-name="ProgressBar">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex flex-col items-center ${step >= stepNumber ? 'text-blue-800' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 text-lg font-bold transition-all duration-300 ${
                    step === stepNumber 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                      : step > stepNumber 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <span className="text-sm font-medium">
                  {['Datos', 'Vehículo', 'Docs', 'Cuenta', 'Resumen'][stepNumber - 1]}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-800 h-3 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario */}
        <Card className="mb-8" data-name="FormCard">
          <CardHeader>
            <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
            <CardDescription>
              {step === 1 && 'Ingresa tus datos personales para crear tu perfil'}
              {step === 2 && 'Proporciona la información de tu vehículo'}
              {step === 3 && 'Sube los documentos requeridos'}
              {step === 4 && 'Crea tus credenciales de acceso'}
              {step === 5 && 'Revisa y confirma tu información'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {renderStep()}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6 border-t border-blue-100">
            <div>
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={loading}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors"
                >
                  Anterior
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {step < 5 ? (
                <Button 
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Siguiente'
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Confirmar y Enviar'
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-700" data-name="LoginPrompt">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 underline underline-offset-2 decoration-2 decoration-blue-400 hover:decoration-blue-600"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistroConductor;