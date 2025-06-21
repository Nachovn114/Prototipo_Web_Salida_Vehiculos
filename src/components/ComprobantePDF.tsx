import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

type ComprobantePDFProps = {
  solicitud: {
    id: string;
    patente: string;
    conductor: string;
    rut: string;
    origen: string;
    destino: string;
    fechaHora: Date;
    tipoCarga: string;
  };
};

export const ComprobantePDF: React.FC<ComprobantePDFProps> = ({ solicitud }) => {
  const handleDownload = () => {
    // En una implementación real, aquí se generaría el PDF
    // Por ahora mostramos un mensaje
    alert('Función de descarga de PDF en desarrollo. Este es un diseño de ejemplo.');
  };

  // Código QR de ejemplo (en producción, usar una librería como qrcode.react)
  const QRCodePlaceholder = () => (
    <div className="border-2 border-dashed border-gray-300 p-4 text-center text-xs text-gray-500">
      [CÓDIGO QR]
      <div className="mt-1 text-[8px]">ID: {solicitud.id}</div>
    </div>
  );

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Comprobante de Salida de Vehículo</h3>
          <div className="text-xs bg-blue-700 px-2 py-1 rounded">
            ID: {solicitud.id}
          </div>
        </div>
      </div>

      {/* Logo y datos */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-700 mb-2">Aduana de Chile</div>
            <div className="text-sm text-gray-600">Sistema de Control de Salida de Vehículos</div>
          </div>
          <QRCodePlaceholder />
        </div>

        {/* Datos del vehículo */}
        <div className="border-t border-b border-gray-200 py-4 my-4">
          <h4 className="font-semibold text-gray-700 mb-3">Datos del Vehículo</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Patente</div>
              <div className="font-medium">{solicitud.patente}</div>
            </div>
            <div>
              <div className="text-gray-500">Tipo de Carga</div>
              <div className="font-medium">{solicitud.tipoCarga}</div>
            </div>
            <div>
              <div className="text-gray-500">Origen</div>
              <div className="font-medium">{solicitud.origen}</div>
            </div>
            <div>
              <div className="text-gray-500">Destino</div>
              <div className="font-medium">{solicitud.destino}</div>
            </div>
          </div>
        </div>

        {/* Datos del conductor */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Datos del Conductor</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Nombre</div>
              <div className="font-medium">{solicitud.conductor}</div>
            </div>
            <div>
              <div className="text-gray-500">RUT</div>
              <div className="font-medium">{solicitud.rut}</div>
            </div>
          </div>
        </div>

        {/* Firma y validación */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-16 w-48 border-b border-gray-400 mb-1"></div>
              <div className="text-xs text-gray-500">Firma del Inspector</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Fecha y hora de emisión</div>
              <div className="font-medium">
                {new Date().toLocaleString('es-CL')}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-green-50 text-green-800 text-sm rounded-md flex items-start">
            <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <strong>Documento válido</strong>
              <div className="text-xs">Verificado electrónicamente por Aduana de Chile</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Este documento es válido sin firma manuscrita según lo establecido en la Ley N° 19.799</p>
        <p className="mt-1">Documento generado electrónicamente - No requiere sello ni firma</p>
      </div>

      {/* Botón de descarga */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Comprobante (PDF)
        </Button>
      </div>
    </div>
  );
};

// Componente de botón para mostrar el comprobante
export const ComprobanteButton = ({ solicitud }: { solicitud: ComprobantePDFProps['solicitud'] }) => {
  return (
    <Button variant="outline" size="sm" className="gap-2">
      <FileText className="h-4 w-4" />
      Ver Comprobante
    </Button>
  );
};

export default ComprobantePDF;