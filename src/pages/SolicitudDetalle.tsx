import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, User, Users, Car, FileText, Fingerprint, Package, PenTool, Eye, Upload, AlertCircle, Info, Clock, Download, MapPin, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ComprobantePDF, ComprobanteButton } from '@/components/ComprobantePDF';
import { BitacoraExporter } from '@/components/BitacoraExporter';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RiskBadge } from '@/components/RiskBadge';
import { generateRandomSolicitud } from '@/utils/chileData';
import { cn } from "@/lib/utils";

const mockSolicitud = generateRandomSolicitud();

const SolicitudDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(mockSolicitud);
  const [observaciones, setObservaciones] = useState('');
  const [biometria, setBiometria] = useState('Pendiente');
  const [firma, setFirma] = useState(false);
  const [estado, setEstado] = useState(solicitud.estado);
  const [documentos, setDocumentos] = useState([
    { id: 1, nombre: 'SOAP', estado: 'Válido', vencimiento: '2025-12-31', file: null },
    { id: 2, nombre: 'Revisión Técnica', estado: 'Pendiente', vencimiento: '2025-08-20', file: null },
    { id: 3, nombre: 'Licencia', estado: 'Válido', vencimiento: '2028-05-15', file: null },
  ]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [mercancias, setMercancias] = useState([
    {
      tipo: 'Electrodomésticos',
      valor: 250000,
      observaciones: 'Incluye refrigerador y microondas',
      cantidad: 2,
      peso: 120,
      unidadPeso: 'kg'
    },
    {
      tipo: 'Ropa y Calzado',
      valor: 150000,
      observaciones: 'Ropa de temporada y calzado deportivo',
      cantidad: 15,
      peso: 30,
      unidadPeso: 'kg'
    },
    {
      tipo: 'Herramientas',
      valor: 180000,
      observaciones: 'Juego de herramientas profesionales',
      cantidad: 1,
      peso: 25,
      unidadPeso: 'kg'
    }
  ]);

  const [nuevaMercancia, setNuevaMercancia] = useState({
    tipo: '',
    valor: '',
    observaciones: '',
    cantidad: 1,
    peso: '',
    unidadPeso: 'kg'
  });

  const tiposMercancia = [
    'Electrodomésticos',
    'Ropa y Calzado',
    'Herramientas',
    'Muebles',
    'Equipos Electrónicos',
    'Juguetes',
    'Artículos Deportivos',
    'Alimentos no perecibles',
    'Libros y Material Educativo',
    'Artículos de Cocina'
  ];

  const handleTipoMercanciaChange = (tipo: string) => {
    const valoresPredeterminados: Record<string, { valor: number; peso: number; observaciones: string }> = {
      'Electrodomésticos': { valor: 300000, peso: 80, observaciones: 'Incluye empaque original' },
      'Ropa y Calzado': { valor: 120000, peso: 25, observaciones: 'Ropa de temporada' },
      'Herramientas': { valor: 200000, peso: 30, observaciones: 'Juego completo' },
      'Muebles': { valor: 450000, peso: 150, observaciones: 'Desarmado' },
      'Equipos Electrónicos': { valor: 600000, peso: 15, observaciones: 'Nuevo en caja sellada' },
      'Juguetes': { valor: 75000, peso: 10, observaciones: 'Para niños' },
      'Artículos Deportivos': { valor: 180000, peso: 20, observaciones: 'Equipo profesional' },
      'Alimentos no perecibles': { valor: 50000, peso: 25, observaciones: 'Válido por 1 año' },
      'Libros y Material Educativo': { valor: 100000, peso: 15, observaciones: 'Nuevos' },
      'Artículos de Cocina': { valor: 150000, peso: 40, observaciones: 'Acero inoxidable' }
    };

    const datosPredeterminados = valoresPredeterminados[tipo] || { valor: 0, peso: 0, observaciones: '' };
    
    setNuevaMercancia({
      ...nuevaMercancia,
      tipo,
      valor: datosPredeterminados.valor.toString(),
      peso: datosPredeterminados.peso.toString(),
      observaciones: datosPredeterminados.observaciones,
      cantidad: 1
    });
  };

  const handleAddMercancia = () => {
    if (nuevaMercancia.tipo && nuevaMercancia.valor) {
      const nueva = {
        tipo: nuevaMercancia.tipo,
        valor: parseFloat(nuevaMercancia.valor),
        observaciones: nuevaMercancia.observaciones || 'Sin observaciones',
        cantidad: Number(nuevaMercancia.cantidad) || 1,
        peso: Number(nuevaMercancia.peso) || 0,
        unidadPeso: nuevaMercancia.unidadPeso
      };
      
      setMercancias([...mercancias, nueva]);
      
      // Restablecer el formulario
      setNuevaMercancia({
        tipo: '',
        valor: '',
        observaciones: '',
        cantidad: 1,
        peso: '',
        unidadPeso: 'kg'
      });
      
      toast.success('Mercancía agregada correctamente');
    }
  };

  const bitacora = [
    { 
      fecha: solicitud.fechaHora.toLocaleString('es-CL'), 
      usuario: 'Inspector García', 
      accion: 'Solicitud creada' 
    },
    { 
      fecha: new Date(solicitud.fechaHora.getTime() + 3 * 60 * 1000).toLocaleString('es-CL'), 
      usuario: 'Inspector García', 
      accion: 'Documento SOAP validado' 
    },
    { 
      fecha: new Date(solicitud.fechaHora.getTime() + 5 * 60 * 1000).toLocaleString('es-CL'), 
      usuario: 'Inspector García', 
      accion: 'Observación agregada' 
    },
    { 
      fecha: new Date(solicitud.fechaHora.getTime() + 10 * 60 * 1000).toLocaleString('es-CL'), 
      usuario: 'Admin Silva', 
      accion: `Solicitud ${solicitud.estado.toLowerCase()}` 
    },
  ];

  const exportBitacoraCSV = () => {
    const csv = [
      ['Fecha', 'Usuario', 'Acción'],
      ...bitacora.map(b => [b.fecha, b.usuario, b.accion])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora-solicitud-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBitacoraPDF = () => {
    const doc = new jsPDF();
    doc.text(`Bitácora de Solicitud #${id}`, 14, 16);
    doc.autoTable({
      startY: 22,
      head: [['Fecha', 'Usuario', 'Acción']],
      body: bitacora.map(b => [b.fecha, b.usuario, b.accion]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save(`bitacora-solicitud-${id}.pdf`);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAprobar = () => {
    const updatedSolicitud = { 
      ...solicitud, 
      estado: 'Aprobado',
      riesgo: 'bajo' as const, // Ensure TypeScript knows this is a literal type
      fechaAprobacion: new Date().toISOString(),
      numeroComprobante: `C-${Date.now()}`
    };
    setEstado('Aprobado');
    setSolicitud(updatedSolicitud);
    toast.success('¡Solicitud aprobada!', { 
      description: '🎉 La solicitud fue aprobada exitosamente.',
      action: {
        label: 'Ver Comprobante',
        onClick: () => setShowComprobante(true)
      }
    });
  };
  const handleRechazar = () => {
    setEstado('Rechazado');
    setSolicitud({ ...solicitud, estado: 'Rechazado' });
  };
  const handleBiometria = () => {
    setBiometria('Validado');
  };
  const handleFirmar = () => {
    setFirma(true);
  };

  const handleDocumentUpload = (id: number, file: File) => {
    const url = URL.createObjectURL(file);
    setDocumentos(prev => prev.map(doc => doc.id === id ? { ...doc, file, estado: 'Pendiente' } : doc));
    setPreviewUrl(url);
    setSelectedDocId(id);
  };

  const handleVerifyDocument = (id: number) => {
    setDocumentos(prev => prev.map(doc => doc.id === id ? { ...doc, estado: 'Válido' } : doc));
  };

  const handleRemoveFile = (id: number) => {
    setDocumentos(prev => prev.map(doc => doc.id === id ? { ...doc, file: null, estado: 'Pendiente' } : doc));
    setPreviewUrl(null);
    setSelectedDocId(null);
  };

  const handleFileInputClick = (id: number) => {
    setSelectedDocId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && selectedDocId) {
      handleDocumentUpload(selectedDocId, e.target.files[0]);
    }
  };

  const handleRemoveMercancia = (idx: number) => {
    setMercancias(mercancias.filter((_, i) => i !== idx));
  };

  const totalValor = mercancias.reduce((acc, m) => acc + Number(m.valor), 0);
  const arancel = Math.round(totalValor * 0.1 * 100) / 100; // 10% simulado

  const getRiskLevel = (): 'bajo' | 'medio' | 'alto' => {
    if (solicitud.estado === 'Rechazado') return 'alto';
    if (solicitud.estado === 'Pendiente') return 'medio';
    return 'bajo';
  };

  const [loading, setLoading] = useState(true);
  const [showComprobante, setShowComprobante] = useState(false);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8 px-0">
        <Skeleton className="h-12 w-2/3 mb-6" />
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-2 sm:p-6">
      {showComprobante && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowComprobante(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <ComprobantePDF solicitud={{
              ...solicitud,
              fechaHora: new Date(),
              tipoCarga: mercancias.length > 0 ? mercancias[0].tipo : 'Sin especificar',
              origen: 'Chile',
              destino: 'Argentina',
              rut: solicitud.conductor.rut,
              patente: solicitud.vehiculo.patente,
              conductor: solicitud.conductor.nombre,
              id: solicitud.id?.toString() || '12345',
            }} />
          </div>
        </div>
      )}
      
      <div className="bg-white/90 shadow-xl rounded-3xl px-4 sm:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-blue-100 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <FileText className="h-9 w-9 text-blue-700" />
            <span className="text-3xl font-extrabold text-blue-900">Solicitud #{id}</span>
          </div>
          <div className="text-blue-600 text-base font-medium">Detalle completo de la solicitud</div>
        </div>
        
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <RiskBadge 
                    level={getRiskLevel()} 
                    size="lg"
                    showText={false}
                    className="text-xl"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Nivel de Riesgo: {getRiskLevel().toUpperCase()}</p>
                    <p className="text-sm text-gray-600">
                      {getRiskLevel() === 'alto' 
                        ? 'Alto riesgo detectado. Se recomienda revisión exhaustiva.'
                        : getRiskLevel() === 'medio' 
                        ? 'Riesgo moderado. Se recomienda verificar documentación.'
                        : 'Riesgo bajo. Documentación en orden.'}
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {estado === 'Aprobado' && (
            <Button 
              onClick={() => setShowComprobante(true)}
              variant="outline" 
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300"
            >
              <FileText className="h-5 w-5 mr-2" />
              Ver Comprobante
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 space-y-8 border border-blue-100">
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="conductor">
            <AccordionTrigger>
              <User className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Datos del Conductor</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                <div><span className="font-semibold text-blue-800">Nombre completo:</span> <span className="text-base text-gray-800">{solicitud.conductor.nombre}</span></div>
                <div><span className="font-semibold text-blue-800">RUT:</span> <span className="text-base text-gray-800">{solicitud.conductor.rut}</span></div>
                <div><span className="font-semibold text-blue-800">Email:</span> <span className="text-base text-gray-800">{solicitud.conductor.email}</span></div>
                <div><span className="font-semibold text-blue-800">Teléfono:</span> <span className="text-base text-gray-800">{solicitud.conductor.telefono}</span></div>
                <div><span className="font-semibold text-blue-800">Fecha de Nacimiento:</span> <span className="text-base text-gray-800">{solicitud.conductor.fechaNacimiento.toLocaleDateString('es-CL')}</span></div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="acompanantes">
            <AccordionTrigger>
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Acompañantes</span>
            </AccordionTrigger>
            <AccordionContent>
              {solicitud.acompanantes.length === 0 ? (
                <span className="text-gray-500">Sin acompañantes</span>
              ) : (
                <div className="space-y-4">
                  {solicitud.acompanantes.map((acompanante, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-900">{acompanante.nombre}</div>
                      <div className="text-sm text-gray-600">RUT: {acompanante.rut}</div>
                      <div className="text-sm text-gray-600">Email: {acompanante.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="vehiculo">
            <AccordionTrigger>
              <Car className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Datos del Vehículo</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                <div><span className="font-semibold text-blue-800">Patente:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.patente}</span></div>
                <div><span className="font-semibold text-blue-800">Marca:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.marca}</span></div>
                <div><span className="font-semibold text-blue-800">Modelo:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.modelo}</span></div>
                <div><span className="font-semibold text-blue-800">Año:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.año}</span></div>
                <div><span className="font-semibold text-blue-800">Color:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.color}</span></div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="viaje">
            <AccordionTrigger>
              <MapPin className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Detalles del Viaje</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="font-semibold text-blue-800 mb-2">Origen</div>
                    <div className="text-lg font-medium">{solicitud.origen}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="font-semibold text-green-800 mb-2">Destino</div>
                    <div className="text-lg font-medium">{solicitud.destino}</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="font-semibold text-gray-800 mb-2">Fecha y Hora de Salida</div>
                  <div className="text-lg font-medium">
                    {solicitud.fechaHora.toLocaleString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-amber-50">
                  <div className="font-semibold text-amber-800 mb-2">Tipo de Carga</div>
                  <div className="text-lg font-medium">{solicitud.tipoCarga}</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mercancias">
            <AccordionTrigger>
              <Package className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Mercancías</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {mercancias.map((mercancia, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{mercancia.tipo}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div><span className="text-gray-500">Valor:</span> ${mercancia.valor.toLocaleString('es-CL')}</div>
                          <div><span className="text-gray-500">Cantidad:</span> {mercancia.cantidad}</div>
                          <div><span className="text-gray-500">Peso:</span> {mercancia.peso} {mercancia.unidadPeso}</div>
                          {mercancia.observaciones && (
                            <div className="col-span-2">
                              <span className="text-gray-500">Observaciones:</span> {mercancia.observaciones}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleRemoveMercancia(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Agregar Mercancía</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="tipoMercancia" className="text-sm font-medium text-gray-700">Tipo de Mercancía *</Label>
                      <select
                        id="tipoMercancia"
                        value={nuevaMercancia.tipo}
                        onChange={(e) => handleTipoMercanciaChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Seleccione un tipo</option>
                        {tiposMercancia.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cantidadMercancia" className="text-sm font-medium text-gray-700">Cantidad *</Label>
                        <Input
                          id="cantidadMercancia"
                          type="number"
                          min="1"
                          value={nuevaMercancia.cantidad}
                          onChange={(e) => setNuevaMercancia({...nuevaMercancia, cantidad: parseInt(e.target.value) || 1})}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="valorMercancia" className="text-sm font-medium text-gray-700">Valor (CLP) *</Label>
                        <Input
                          id="valorMercancia"
                          type="number"
                          min="0"
                          value={nuevaMercancia.valor}
                          onChange={(e) => setNuevaMercancia({...nuevaMercancia, valor: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pesoMercancia" className="text-sm font-medium text-gray-700">Peso *</Label>
                        <div className="flex">
                          <Input
                            id="pesoMercancia"
                            type="number"
                            min="0"
                            step="0.1"
                            value={nuevaMercancia.peso}
                            onChange={(e) => setNuevaMercancia({...nuevaMercancia, peso: e.target.value})}
                            className="mt-1 rounded-r-none"
                          />
                          <select
                            value={nuevaMercancia.unidadPeso}
                            onChange={(e) => setNuevaMercancia({...nuevaMercancia, unidadPeso: e.target.value})}
                            className="mt-1 rounded-l-none border-l-0 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="valorTotal" className="text-sm font-medium text-gray-700">Valor Total</Label>
                        <Input
                          id="valorTotal"
                          type="text"
                          value={`$${(parseFloat(nuevaMercancia.valor || '0') * (nuevaMercancia.cantidad || 1)).toLocaleString('es-CL')}`}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="observacionesMercancia" className="text-sm font-medium text-gray-700">Observaciones</Label>
                      <Textarea
                        id="observacionesMercancia"
                        value={nuevaMercancia.observaciones}
                        onChange={(e) => setNuevaMercancia({...nuevaMercancia, observaciones: e.target.value})}
                        placeholder="Detalles adicionales sobre la mercancía"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button 
                        onClick={handleAddMercancia}
                        disabled={!nuevaMercancia.tipo || !nuevaMercancia.valor || !nuevaMercancia.peso}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Mercancía
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h5 className="font-medium text-blue-800 mb-3">Resumen de Mercancías</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-blue-600">Total Artículos</div>
                      <div className="font-medium">{mercancias.reduce((sum, m) => sum + (m.cantidad || 0), 0)}</div>
                    </div>
                    <div>
                      <div className="text-blue-600">Peso Total</div>
                      <div className="font-medium">
                        {mercancias.reduce((sum, m) => {
                          const peso = m.unidadPeso === 'kg' ? m.peso : 
                                         m.unidadPeso === 'g' ? m.peso / 1000 : 
                                         m.peso * 0.453592; // lb a kg
                          return sum + (Number(peso) || 0) * (m.cantidad || 1);
                        }, 0).toFixed(2)} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-600">Valor Total</div>
                      <div className="font-medium">
                        ${mercancias.reduce((sum, m) => sum + (m.valor || 0) * (m.cantidad || 1), 0).toLocaleString('es-CL')}
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-600">Arancel Aduanero (10%)</div>
                      <div className="font-medium">
                        ${(mercancias.reduce((sum, m) => sum + (m.valor || 0) * (m.cantidad || 1), 0) * 0.1).toLocaleString('es-CL')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Documentos */}
          <AccordionItem value="documentos">
            <AccordionTrigger>
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Documentos</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documentos.map((doc) => (
                  <div key={doc.id} className="p-5 border rounded-2xl bg-gray-50 flex flex-col gap-3 shadow-md">
                    <span className="font-semibold text-blue-900 text-lg">{doc.nombre}</span>
                    <div className="flex items-center gap-3">
                      {doc.estado === 'Válido' && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                          <CheckCircle className="h-4 w-4 mr-1" />Válido
                        </Badge>
                      )}
                      {doc.estado === 'Pendiente' && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">
                          <AlertCircle className="h-4 w-4 mr-1" />Pendiente
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Vence: {doc.vencimiento}</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleFileInputClick(doc.id)} 
                        className="border-blue-300 text-blue-800 hover:bg-blue-50"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {doc.file ? 'Reemplazar' : 'Cargar'} Documento
                      </Button>
                      {doc.file && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPreviewUrl(URL.createObjectURL(doc.file!))} 
                            className="border-green-300 text-green-800 hover:bg-green-50"
                          >
                            <Eye className="h-4 w-4 mr-1" /> Ver
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleRemoveFile(doc.id)} 
                            className="border-red-300 text-red-800 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Quitar
                          </Button>
                        </>
                      )}
                    </div>
                    {doc.file && previewUrl && selectedDocId === doc.id && (
                      <div className="mt-2">
                        {doc.file.type.startsWith('image/') ? (
                          <img 
                            src={previewUrl} 
                            alt="Previsualización" 
                            className="max-h-32 rounded shadow border border-blue-100 mx-auto" 
                          />
                        ) : (
                          <iframe 
                            src={previewUrl} 
                            title="PDF" 
                            className="w-full h-32 rounded shadow bg-white" 
                          />
                        )}
                      </div>
                    )}
                    {doc.estado === 'Pendiente' && doc.file && (
                      <Button 
                        size="sm" 
                        onClick={() => handleVerifyDocument(doc.id)} 
                        className="mt-2 w-full bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Validar con sistema externo
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Validación Biométrica */}
          <AccordionItem value="biometria">
            <AccordionTrigger>
              <Fingerprint className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Validación Biométrica</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-4">
                <Badge className={biometria === 'Validado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {biometria}
                </Badge>
                <Button 
                  onClick={handleBiometria} 
                  disabled={biometria === 'Validado'} 
                  variant="outline" 
                  size="sm"
                >
                  {biometria === 'Validado' ? 'Validado' : 'Validar Huella'}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Firma Digital */}
          <AccordionItem value="firma">
            <AccordionTrigger>
              <PenTool className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Firma del Inspector</span>
            </AccordionTrigger>
            <AccordionContent>
              {firma ? (
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <div className="font-bold text-blue-900 text-base">Firmado digitalmente por Inspector García</div>
                    <div className="text-xs text-blue-700">
                      Fecha y hora: {new Date().toLocaleString('es-CL')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>
                  <Button 
                    onClick={handleFirmar} 
                    disabled={firma} 
                    variant="outline" 
                    size="sm"
                  >
                    Firmar Digitalmente
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Observaciones */}
          <AccordionItem value="observaciones">
            <AccordionTrigger>
              <Eye className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Observaciones</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <label className="font-medium text-blue-900 block">Observaciones</label>
                <Textarea 
                  value={observaciones} 
                  onChange={e => setObservaciones(e.target.value)} 
                  placeholder="Ingrese observaciones sobre la solicitud..." 
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      // Aquí iría la lógica para guardar las observaciones
                      toast.success('Observaciones guardadas correctamente');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Guardar Observaciones
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de Acciones */}
          <AccordionItem value="acciones">
            <AccordionTrigger>
              <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Acciones</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleAprobar} 
                    disabled={estado === 'Aprobado'} 
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 h-12"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" /> 
                    <span className="text-base">Aprobar Solicitud</span>
                  </Button>
                  <Button 
                    onClick={handleRechazar} 
                    disabled={estado === 'Rechazado'} 
                    className="bg-red-600 hover:bg-red-700 text-white flex-1 h-12"
                  >
                    <XCircle className="h-5 w-5 mr-2" /> 
                    <span className="text-base">Rechazar Solicitud</span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                  <span className="font-medium text-gray-700">Estado actual:</span>
                  <Badge 
                    className={cn(
                      'text-sm py-1.5 px-3',
                      estado === 'Aprobado' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : estado === 'Rechazado' 
                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    )}
                  >
                    {estado}
                  </Badge>
                </div>

                {estado === 'Rechazado' && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-1">Motivo del rechazo:</h4>
                    <p className="text-sm text-red-700">
                      Documentación incompleta o incorrecta. Por favor, verifique los requisitos y vuelva a enviar la solicitud.
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Botón de volver */}
        <div className="flex justify-end mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 text-base font-semibold border-gray-300 hover:bg-gray-50"
          >
            Volver al listado
          </Button>
        </div>
      </div>

      {/* Sección de Bitácora */}
      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mt-8 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <span className="text-xl font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2 text-center md:text-left">
            <Clock className="h-6 w-6 text-blue-600" /> 
            Bitácora de Acciones
          </span>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={exportBitacoraCSV} 
              className="border-blue-300 text-blue-800 hover:bg-blue-50 w-full md:w-auto"
            >
              <Download className="h-4 w-4 mr-2" /> Exportar CSV
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={exportBitacoraPDF} 
              className="border-blue-300 text-blue-800 hover:bg-blue-50 w-full md:w-auto"
            >
              <FileText className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">Fecha y Hora</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">Usuario</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-900">Acción Realizada</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bitacora.map((registro, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {registro.fecha}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    {registro.usuario}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {registro.accion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SolicitudDetalle;