import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '@/types/form';
import { AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminosCondicionesProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onFieldChange: (field: keyof FormData, value: any) => void;
}

const TerminosCondiciones: React.FC<TerminosCondicionesProps> = ({
  formData,
  errors,
  onFieldChange
}) => {
  const [showTerms, setShowTerms] = React.useState(false);

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4">
      <h2 className="text-lg font-semibold mb-2 text-blue-700">
        Términos y Condiciones
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <div className="flex items-center h-5 mt-0.5">
            <Checkbox
              id="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onCheckedChange={(checked) => onFieldChange('aceptaTerminos', checked)}
              className={`${errors.aceptaTerminos ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="aceptaTerminos"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto los{' '}
              <button 
                type="button" 
                className="text-blue-600 hover:underline"
                onClick={() => setShowTerms(true)}
              >
                Términos y Condiciones
              </button>{' '}
              del servicio <span className="text-red-500">*</span>
            </label>
            {errors.aceptaTerminos && (
              <p className="text-sm text-red-500 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.aceptaTerminos}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="flex items-center h-5 mt-0.5">
            <Checkbox
              id="infoVeridica"
              checked={formData.aceptaTerminos}
              onCheckedChange={(checked) => onFieldChange('aceptaTerminos', checked)}
              className={`${errors.aceptaTerminos ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="aceptaTerminos"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Declaro que la información proporcionada es verídica y acepto que será verificada por las autoridades correspondientes. <span className="text-red-500">*</span>
            </label>
            {errors.aceptaTerminos && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.aceptaTerminos}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Términos y Condiciones
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowTerms(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-700">
                <h4 className="font-semibold text-blue-700 mt-4">1. Aceptación de los Términos</h4>
                <p className="mt-2">
                  Al registrarte como conductor en el sistema de control fronterizo Chile-Argentina, aceptas cumplir con todos los términos y condiciones establecidos en este documento, así como con la normativa vigente de ambos países.
                </p>
                
                <h4 className="font-semibold text-blue-700 mt-4">2. Uso de la Plataforma</h4>
                <p className="mt-2">
                  La plataforma está diseñada para facilitar los trámites de cruce fronterizo de vehículos. El usuario se compromete a utilizar la plataforma de manera lícita y ética, absteniéndose de realizar actividades que puedan dañar, deshabilitar o sobrecargar el servicio.
                </p>
                
                <h4 className="font-semibold text-blue-700 mt-4">3. Responsabilidades del Conductor</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Proporcionar información veraz y actualizada en todo momento.</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                  <li>Notificar cualquier uso no autorizado de su cuenta.</li>
                  <li>Presentar la documentación requerida en los plazos establecidos.</li>
                </ul>
                
                <h4 className="font-semibold text-blue-700 mt-4">4. Protección de Datos</h4>
                <p className="mt-2">
                  Sus datos personales serán tratados de acuerdo con la Ley de Protección de Datos Personales de Chile (Ley 19.628) y la Ley de Protección de Datos Personales de Argentina (Ley 25.326). Los datos recopilados serán utilizados exclusivamente para los fines del proceso de control fronterizo.
                </p>
                
                <h4 className="font-semibold text-blue-700 mt-4">5. Modificaciones</h4>
                <p className="mt-2">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor una vez publicadas en la plataforma.
                </p>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    Al hacer clic en "Aceptar" y completar el registro, confirmas que has leído, comprendido y aceptado estos Términos y Condiciones en su totalidad.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => {
                    onFieldChange('aceptaTerminos', true);
                    setShowTerms(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Aceptar y Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminosCondiciones;
