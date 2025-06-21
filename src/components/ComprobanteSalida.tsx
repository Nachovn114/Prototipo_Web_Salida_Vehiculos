import { Button } from '@/components/ui/button';
import { QrCode, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ComprobanteSalidaProps {
  data: {
    nombreConductor: string;
    rut: string;
    patente: string;
    marca: string;
    modelo: string;
    fechaSalida: Date;
    inspector: string;
  };
  onClose: () => void;
}

export function ComprobanteSalida({ data, onClose }: ComprobanteSalidaProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-900 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Servicio Nacional de Aduanas</h2>
              <p className="text-blue-100">Gobierno de Chile</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Comprobante Oficial</p>
              <p className="text-lg font-semibold">Autorización de Salida Vehicular</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Datos del Conductor</h3>
              <p>{data.nombreConductor}</p>
              <p className="text-sm text-gray-600">RUT: {data.rut}</p>
            </div>
            <div className="text-right">
              <div className="inline-block p-2 bg-gray-100 rounded">
                <QrCode className="h-16 w-16" />
                <p className="text-xs mt-1">Código de verificación</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Vehículo Autorizado</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patente</p>
                <p className="font-medium">{data.patente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marca</p>
                <p className="font-medium">{data.marca}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="font-medium">{data.modelo}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500">Firmado digitalmente por:</p>
                <div className="mt-2">
                  <p className="font-semibold">Inspector: {data.inspector}</p>
                  <p className="text-sm text-gray-600">
                    Servicio Nacional de Aduanas
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(data.fechaSalida, "PPPpp", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-2 border-red-600 text-red-600">
                  <span className="text-xs font-bold text-center">Sello<br/>Oficial</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
            <p>Este documento es una autorización oficial emitida por el Servicio Nacional de Aduanas</p>
            <p className="mt-1">Para verificar la validez de este documento, escanee el código QR</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
