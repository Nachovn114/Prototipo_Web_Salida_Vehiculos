import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FileText, AlertCircle, FileCheck, Car, User, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type FormData = {
  // Datos Personales
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  email: string;
  
  // Datos del Vehículo
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  tipoVehiculo: string;
  numeroMotor: string;
  numeroChasis: string;
  capacidadCarga: string;
  
  // Documentos
  licenciaConducir: File | null;
  seguro: File | null;
  revisionTecnica: File | null;
  permisoCirculacion: File | null;
  
  // Términos
  aceptaTerminos: boolean;
  privacidadAceptada: boolean;
};

interface ResumenRegistroProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string | undefined>;
  onEdit?: (step: number) => void;
  onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

const ResumenRegistro: React.FC<ResumenRegistroProps> = ({
  formData,
  onChange,
  onEdit,
  onSubmit,
  isSubmitting = false,
  isSubmitted = false,
  errors
}) => {
  // Formatear fecha de nacimiento
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return dateString; // En caso de error, devolver el valor original
    }
  };

  // Obtener nombre del género
  const getGeneroLabel = (genero: string) => {
    const generos: Record<string, string> = {
      'masculino': 'Masculino',
      'femenino': 'Femenino',
      'otro': 'Otro',
      'prefiero-no-decir': 'Prefiero no decir'
    };
    return generos[genero] || genero;
  };

  // Verificar si hay errores
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-8" data-name="ResumenRegistro">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Revisa tu información</h2>
        <p className="text-muted-foreground">
          Por favor, verifica que toda la información sea correcta antes de enviar tu solicitud.
        </p>
      </div>

      {/* Tarjeta de Datos Personales */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Datos Personales</span>
              </CardTitle>
              <CardDescription>Información personal del conductor</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit?.(1)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre completo</p>
              <p>{formData.nombre} {formData.apellido}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">RUT</p>
              <p>{formData.rut || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
              <p>{formatDate(formData.fechaNacimiento)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Género</p>
              <p>{getGeneroLabel(formData.genero)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nacionalidad</p>
              <p>{formData.nacionalidad || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p>{formData.telefono || 'No especificado'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p>{formData.direccion || 'No especificada'}</p>
              <p className="text-muted-foreground">
                {formData.comuna ? `${formData.comuna}, ` : ''}
                {formData.region || ''}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
              <p className="break-all">{formData.email || 'No especificado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Datos del Vehículo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span>Vehículo</span>
              </CardTitle>
              <CardDescription>Información del vehículo registrado</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit?.(2)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patente</p>
              <p className="font-mono uppercase">{formData.patente || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marca y Modelo</p>
              <p>{formData.marca} {formData.modelo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Año</p>
              <p>{formData.anio || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Color</p>
              <p>{formData.color || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Vehículo</p>
              <p>{formData.tipoVehiculo || 'No especificado'}</p>
            </div>
            {formData.capacidadCarga && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capacidad de Carga</p>
                <p>{formData.capacidadCarga} kg</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">N° de Motor</p>
              <p className="font-mono">{formData.numeroMotor || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">N° de Chasis</p>
              <p className="font-mono">{formData.numeroChasis || 'No especificado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Documentos */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Documentos</span>
              </CardTitle>
              <CardDescription>Documentos adjuntos</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit?.(3)}
              className="text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Licencia de Conducir</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.licenciaConducir ? formData.licenciaConducir.name : 'No subido'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Seguro del Vehículo</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.seguro ? formData.seguro.name : 'No subido'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Revisión Técnica</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.revisionTecnica ? formData.revisionTecnica.name : 'No subido'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Permiso de Circulación</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.permisoCirculacion ? formData.permisoCirculacion.name : 'No subido'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Términos y Condiciones */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg">Términos y Condiciones</CardTitle>
          <CardDescription>
            Por favor, lee y acepta los términos y condiciones para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terminos" 
                checked={formData.aceptaTerminos}
                onCheckedChange={(checked) => 
                  onChange({ 
                    target: { 
                      name: 'aceptaTerminos', 
                      checked,
                      type: 'checkbox'
                    } 
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className={cn(
                  'mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600',
                  errors.aceptaTerminos && 'border-destructive text-destructive'
                )}
              />
              <div className="space-y-1">
                <Label htmlFor="terminos" className="text-sm font-medium leading-none">
                  Acepto los Términos y Condiciones
                </Label>
                <p className="text-sm text-muted-foreground">
                  He leído y acepto los{' '}
                  <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Términos y Condiciones
                  </a>{' '}
                  del servicio.
                </p>
                {errors.aceptaTerminos && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.aceptaTerminos}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="privacidad" 
                checked={formData.privacidadAceptada}
                onCheckedChange={(checked) => 
                  onChange({ 
                    target: { 
                      name: 'privacidadAceptada', 
                      checked,
                      type: 'checkbox'
                    } 
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className={cn(
                  'mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600',
                  errors.privacidadAceptada && 'border-destructive text-destructive'
                )}
              />
              <div className="space-y-1">
                <Label htmlFor="privacidad" className="text-sm font-medium leading-none">
                  Política de Privacidad
                </Label>
                <p className="text-sm text-muted-foreground">
                  Acepto la{' '}
                  <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </a>{' '}
                  y el tratamiento de mis datos personales.
                </p>
                {errors.privacidadAceptada && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.privacidadAceptada}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mensaje de error general */}
          {hasErrors && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Por favor, completa todos los campos requeridos y corrige los errores antes de continuar.
              </p>
            </div>
          )}

          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">¡Solicitud enviada con éxito!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Tu solicitud está siendo procesada. Serás redirigido en breve...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Al hacer clic en "Confirmar y Enviar", aceptas nuestros términos y condiciones y política de privacidad.
            Te enviaremos un correo electrónico de confirmación una vez que hayamos procesado tu solicitud.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumenRegistro;
