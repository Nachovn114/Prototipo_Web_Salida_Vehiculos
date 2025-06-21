import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Car, User, Box, Check, Loader2, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { faker } from '@faker-js/faker';
import { toast } from "sonner";

// --- Utilidades para datos chilenos realistas ---

const nombresChilenos = [
  "Ignacio", "Camila", "Javiera", "Matías", "Valentina", "Sebastián", "Catalina", "Felipe", "Fernanda", "Diego",
  "Constanza", "Francisco", "Antonia", "Benjamín", "Josefa", "Tomás", "Martina", "Vicente", "Isidora", "Cristóbal"
];
const apellidosChilenos = [
  "González", "Muñoz", "Rojas", "Díaz", "Pérez", "Soto", "Contreras", "Silva", "Martínez", "Sepúlveda",
  "Morales", "Rodríguez", "López", "Fuentes", "Hernández", "Torres", "Araya", "Flores", "Espinoza", "Valenzuela"
];
const marcasModelos = [
  "Chevrolet Sail", "Hyundai Accent", "Kia Morning", "Suzuki Swift", "Toyota Yaris", "Nissan Versa", "Peugeot 208", "Mazda 3", "Chery Tiggo 2", "MG ZS"
];
const patentesEjemplo = [
  "ABCD12", "BCDF34", "CDEF56", "DEFG78", "EFGH90", "GHJK12", "JKLM34", "KLMN56", "MNOP78", "OPQR90"
];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarNombreCompleto() {
  return `${getRandom(nombresChilenos)} ${getRandom(apellidosChilenos)} ${getRandom(apellidosChilenos)}`;
}

// Generador de RUT chileno válido
function generarRut() {
  // Genera un número base de 7 u 8 dígitos
  const base = Math.floor(Math.random() * 9000000) + 1000000;
  let suma = 0, mul = 2;
  let rut = base;
  while (rut > 0) {
    suma += (rut % 10) * mul;
    rut = Math.floor(rut / 10);
    mul = mul === 7 ? 2 : mul + 1;
  }
  const dv = 11 - (suma % 11);
  let dvStr = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  return `${base.toLocaleString('es-CL')}–${dvStr}`;
}

// --- Utilidades para inspecciones vehiculares ---
const estadosInspeccion = ['Aprobado', 'Rechazado', 'Pendiente', 'Aprobado con observaciones'];
const inspectores = [
  'Carlos Mendoza', 
  'María González', 
  'Pedro Rojas', 
  'Ana Silva',
  'Juan Pérez'
];

const itemsInspeccion = [
  { id: 'luces', nombre: 'Sistema de iluminación', descripcion: 'Verificación de luces delanteras, traseras y de emergencia' },
  { id: 'frenos', nombre: 'Sistema de frenos', descripcion: 'Prueba de frenado y estado de pastillas' },
  { id: 'llantas', nombre: 'Estado de neumáticos', descripcion: 'Profundidad del dibujo y estado general' },
  { id: 'documentos', nombre: 'Documentación', descripcion: 'Revisión de permisos de circulación y seguro' },
  { id: 'emisiones', nombre: 'Niveles de emisión', descripcion: 'Control de emisiones contaminantes' },
  { id: 'chasis', nombre: 'Chasis y carrocería', descripcion: 'Estado estructural del vehículo' },
  { id: 'seguridad', nombre: 'Elementos de seguridad', descripcion: 'Cinturones, airbags y extintor' },
  { id: 'vidrios', nombre: 'Vidrios y espejos', descripcion: 'Estado y visibilidad' },
];

function generarInspeccionAleatoria() {
  const resultado = {
    fecha: new Date().toISOString(),
    inspector: getRandom(inspectores),
    resultado: getRandom(estadosInspeccion),
    items: itemsInspeccion.map(item => ({
      ...item,
      estado: Math.random() > 0.2 ? 'Aprobado' : 'Rechazado',
      observaciones: Math.random() > 0.7 ? getRandom([
        'Sin observaciones',
        'Revisar en próximo control',
        'Requiere mantención próxima',
        'En buen estado'
      ]) : ''
    }))
  };
  return resultado;
}

// --- Componente de Inspección ---
const InspeccionVehicular = () => {
  const [inspeccion, setInspeccion] = useState(generarInspeccionAleatoria());
  const [cargando, setCargando] = useState(false);

  const generarNuevaInspeccion = () => {
    setCargando(true);
    // Simular tiempo de carga
    setTimeout(() => {
      setInspeccion(generarInspeccionAleatoria());
      setCargando(false);
    }, 800);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Inspección Vehicular</CardTitle>
        <CardDescription>Resultados de la inspección técnica del vehículo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Inspector: {inspeccion.inspector}</p>
            <p className="text-sm text-muted-foreground">
              Fecha: {new Date(inspeccion.fecha).toLocaleDateString('es-CL')}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generarNuevaInspeccion}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : 'Generar Nueva Inspección'}
          </Button>
        </div>
        
        <div className="space-y-4">
          {inspeccion.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.nombre}</h4>
                  <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.estado === 'Aprobado' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.estado}
                </span>
              </div>
              {item.observaciones && (
                <p className="mt-2 text-sm text-yellow-600">
                  <strong>Observaciones:</strong> {item.observaciones}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className={`mt-4 p-4 rounded-lg ${
          inspeccion.resultado === 'Aprobado' 
            ? 'bg-green-50 text-green-800' 
            : inspeccion.resultado === 'Rechazado'
            ? 'bg-red-50 text-red-800'
            : 'bg-yellow-50 text-yellow-800'
        }`}>
          <h4 className="font-medium">Resultado Final: {inspeccion.resultado}</h4>
          {inspeccion.resultado === 'Aprobado' && (
            <p className="text-sm">El vehículo cumple con todos los requisitos de seguridad.</p>
          )}
          {inspeccion.resultado === 'Rechazado' && (
            <p className="text-sm">Se encontraron observaciones críticas que impiden la circulación.</p>
          )}
          {inspeccion.resultado === 'Aprobado con observaciones' && (
            <p className="text-sm">El vehículo puede circular pero requiere atención en los ítems marcados.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Componentes de cada paso ---

const Step1 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [nombre, setNombre] = useState(generarNombreCompleto());
  const [documento, setDocumento] = useState(generarRut());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ nombre, documento });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Paso 1: Datos del Conductor</h2>
      <div>
        <Label htmlFor="nombre">Nombre Completo</Label>
        <Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="documento">RUT</Label>
        <Input id="documento" value={documento} onChange={e => setDocumento(e.target.value)} required />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>
    </form>
  );
};

const Step2 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [patente, setPatente] = useState(getRandom(patentesEjemplo));
  const [modelo, setModelo] = useState(getRandom(marcasModelos));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ patente, modelo });
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Paso 2: Datos del Vehículo</h2>
        <div>
          <Label htmlFor="patente">Patente Chilena</Label>
          <Input id="patente" value={patente} onChange={e => setPatente(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="modelo">Marca y Modelo</Label>
          <Input id="modelo" value={modelo} onChange={e => setModelo(e.target.value)} required />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </form>
      <InspeccionVehicular />
    </>
  );
};

const Step3 = ({ onNext }: { onNext: (data: any) => void }) => {
  const [bienes, setBienes] = useState<string[]>([]);
  const itemsDeclarables = [
    'Alimentos de origen animal o vegetal',
    'Frutas y verduras frescas',
    'Carnes, embutidos o lácteos',
    'Bebidas alcohólicas en exceso de la franquicia',
    'Cigarrillos en exceso de la franquicia',
    'Dinero en efectivo sobre $10.000 USD',
    'Electrodomésticos o electrónicos nuevos',
    'Mercadería para reventa',
    'Mascotas o animales vivos',
    'Productos farmacéuticos o medicamentos',
  ];

  const handleCheckboxChange = (item: string, checked: boolean) => {
    setBienes(prev => checked ? [...prev, item] : prev.filter(i => i !== item));
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Paso 3: Declaración de Bienes</h2>
      <p className="text-sm text-muted-foreground">Marque los bienes que transporta y que requieren declaración según la normativa chilena.</p>
      <div className="space-y-2">
        {itemsDeclarables.map(item => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox id={item} onCheckedChange={(checked) => handleCheckboxChange(item, !!checked)} />
            <Label htmlFor={item}>{item}</Label>
          </div>
        ))}
      </div>
       <div className="flex justify-end pt-4">
        <Button onClick={() => onNext({ bienes })}>Finalizar y Generar QR <Check className="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  );
};

const Step4 = ({ formData }: { formData: any }) => {
  const qrValue = JSON.stringify(formData);
  
  const downloadQR = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) {
      toast.error("No se pudo encontrar el código QR para descargar.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `pre-declaracion-${formData.documento || 'qr'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pre-Declaración completada con éxito!</h2>
      <p className="mb-6">Presente este código QR en el control fronterizo para un proceso más rápido.</p>
      <div className="flex justify-center mb-6">
        <QRCodeSVG id="qr-code-svg" value={qrValue} size={256} />
      </div>
      <Button onClick={downloadQR}><Download className="mr-2 h-4 w-4" /> Descargar QR</Button>
      
      <Card className="mt-8 text-left">
        <CardHeader>
          <CardTitle>Resumen de la Declaración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Conductor:</strong> {formData.nombre} (Doc: {formData.documento})</p>
          <p><strong>Vehículo:</strong> {formData.modelo} (Patente: {formData.patente})</p>
          <p><strong>Bienes declarados:</strong> {formData.bienes?.join(', ') || 'Ninguno'}</p>
        </CardContent>
      </Card>
    </div>
  );
};


// --- Componente Principal ---
const steps = [
  { id: '01', name: 'Datos Personales', icon: User, component: Step1 },
  { id: '02', name: 'Datos del Vehículo', icon: Car, component: Step2 },
  { id: '03', name: 'Declaración de Bienes', icon: Box, component: Step3 },
  { id: '04', name: 'Finalizar', icon: Check, component: Step4 },
];

const PreDeclaracion = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    id: faker.string.uuid(),
    timestamp: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNext = (data: object) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    if (currentStep < steps.length - 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit(newFormData);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = async (finalData: object) => {
    setIsSubmitting(true);
    console.log("Enviando formulario completo:", finalData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setCurrentStep(prev => prev + 1); 
  };
  
  const progress = ((currentStep + 1) / (steps.length)) * 100;
  
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-2">Formulario de Pre-Declaración Digital</h1>
      <p className="text-center text-muted-foreground mb-8">Complete los siguientes pasos para agilizar su cruce fronterizo.</p>
      
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => setCurrentStep(index)}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= index ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
                }`}
              >
                {currentStep > index ? <Check /> : <step.icon className="w-6 h-6" />}
              </div>
              <p className={`mt-2 text-sm font-semibold ${currentStep >= index ? 'text-primary' : 'text-muted-foreground'}`}>{step.name}</p>
            </div>
            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 transition-colors duration-500 ${currentStep > index ? 'bg-primary' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>
      
      <Progress value={progress} className="mb-4" />
      
      <Card>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent onNext={handleNext} formData={formData} />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button onClick={handlePrev} disabled={currentStep === 0 || currentStep === steps.length -1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        {/* El botón de siguiente/finalizar ahora está dentro de cada paso */}
      </div>
    </div>
  );
};

export default PreDeclaracion; 