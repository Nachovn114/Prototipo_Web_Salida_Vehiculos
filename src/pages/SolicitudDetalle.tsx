import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, User, Users, Car, FileText, Fingerprint, Package, PenTool, Eye, Upload, AlertCircle, Info, Clock, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ComprobanteButton } from '@/components/ComprobantePDF';
import { BitacoraExporter } from '@/components/BitacoraExporter';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const mockSolicitud = {
  id: 1,
  conductor: {
    nombre: 'Juan Pérez González',
    documento: '12.345.678-9',
  },
  acompanantes: [
    { nombre: 'María Silva', documento: '22.222.222-2' },
    { nombre: 'Pedro Soto', documento: '18.888.888-8' },
  ],
  vehiculo: {
    patente: 'ABCD-12',
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2021,
    color: 'Gris',
  },
  documentos: [
    { nombre: 'SOAP', estado: 'Válido', vencimiento: '2025-12-31' },
    { nombre: 'Revisión Técnica', estado: 'Válido', vencimiento: '2025-08-20' },
    { nombre: 'Licencia', estado: 'Válido', vencimiento: '2028-05-15' },
  ],
  biometria: 'Pendiente',
  mercancias: [
    { tipo: 'Electrodomésticos', valor: 500, observaciones: 'Sin observaciones' },
  ],
  observaciones: '',
  estado: 'Pendiente',
  riesgo: 'bajo',
};

const SolicitudDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(mockSolicitud);
  const [observaciones, setObservaciones] = useState('');
  const [biometria, setBiometria] = useState('Pendiente');
  const [firma, setFirma] = useState(false);
  const [estado, setEstado] = useState('Pendiente');
  const [documentos, setDocumentos] = useState([
    { id: 1, nombre: 'SOAP', estado: 'Válido', vencimiento: '2025-12-31', file: null },
    { id: 2, nombre: 'Revisión Técnica', estado: 'Pendiente', vencimiento: '2025-08-20', file: null },
    { id: 3, nombre: 'Licencia', estado: 'Válido', vencimiento: '2028-05-15', file: null },
  ]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [mercancias, setMercancias] = useState([
    { tipo: 'Electrodomésticos', valor: 500, observaciones: 'Sin observaciones' },
  ]);
  const [nuevaMercancia, setNuevaMercancia] = useState({ tipo: '', valor: '', observaciones: '' });
  const [loading, setLoading] = useState(true);

  // Bitácora de acciones simulada
  const bitacora = [
    { fecha: '2024-06-20 10:15', usuario: 'Inspector García', accion: 'Solicitud creada' },
    { fecha: '2024-06-20 10:18', usuario: 'Inspector García', accion: 'Documento SOAP validado' },
    { fecha: '2024-06-20 10:20', usuario: 'Inspector García', accion: 'Observación agregada: Falta revisión técnica' },
    { fecha: '2024-06-20 10:25', usuario: 'Admin Silva', accion: 'Solicitud revisada y aprobada' },
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
    setEstado('Aprobado');
    setSolicitud({ ...solicitud, estado: 'Aprobado' });
    toast.success('¡Solicitud aprobada!', { description: '🎉 La solicitud fue aprobada exitosamente.' });
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

  const handleAddMercancia = () => {
    if (!nuevaMercancia.tipo || !nuevaMercancia.valor) return;
    setMercancias([...mercancias, { ...nuevaMercancia, valor: Number(nuevaMercancia.valor) }]);
    setNuevaMercancia({ tipo: '', valor: '', observaciones: '' });
  };
  const handleRemoveMercancia = (idx: number) => {
    setMercancias(mercancias.filter((_, i) => i !== idx));
  };
  const totalValor = mercancias.reduce((acc, m) => acc + Number(m.valor), 0);
  const arancel = Math.round(totalValor * 0.1 * 100) / 100; // 10% simulado

  // Función para obtener el color y texto del riesgo
  const getRiskBadge = (riesgo: 'bajo' | 'medio' | 'alto') => {
    switch (riesgo) {
      case 'alto':
        return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">Alto</Badge>;
      case 'medio':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">Medio</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Bajo</Badge>;
    }
  };

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
      <div className="bg-white/90 shadow-xl rounded-3xl px-4 sm:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-blue-100 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <FileText className="h-9 w-9 text-blue-700" />
            <span className="text-3xl font-extrabold text-blue-900">Solicitud #{id}</span>
          </div>
          <div className="text-blue-600 text-base font-medium">Detalle completo de la solicitud</div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-auto">{getRiskBadge((solicitud.riesgo || 'bajo') as 'bajo' | 'medio' | 'alto')}</span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                <span>Nivel de riesgo calculado automáticamente según prioridad, documentos y observaciones.</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ComprobanteButton solicitud={solicitud} />
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
                <div><span className="font-semibold text-blue-800">Nombre:</span> <span className="text-base text-gray-800">{solicitud.conductor.nombre}</span></div>
                <div><span className="font-semibold text-blue-800">Documento:</span> <span className="text-base text-gray-800">{solicitud.conductor.documento}</span></div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="acompanantes">
            <AccordionTrigger>
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Acompañantes</span>
            </AccordionTrigger>
            <AccordionContent>
              {solicitud.acompanantes.length === 0 ? <span className="text-gray-500">Sin acompañantes</span> : (
                <ul className="list-disc ml-6 space-y-1">
                  {solicitud.acompanantes.map((a, i) => (
                    <li key={i}><span className="font-semibold text-blue-800">{a.nombre}</span> <span className="text-gray-700">— {a.documento}</span></li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="vehiculo">
            <AccordionTrigger>
              <Car className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Datos del Vehículo</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-6 py-2">
                <div><span className="font-semibold text-blue-800">Patente:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.patente}</span></div>
                <div><span className="font-semibold text-blue-800">Marca:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.marca}</span></div>
                <div><span className="font-semibold text-blue-800">Modelo:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.modelo}</span></div>
                <div><span className="font-semibold text-blue-800">Año:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.año}</span></div>
                <div><span className="font-semibold text-blue-800">Color:</span> <span className="text-base text-gray-800">{solicitud.vehiculo.color}</span></div>
              </div>
            </AccordionContent>
          </AccordionItem>
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
                      {doc.estado === 'Válido' && <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse"><CheckCircle className="h-4 w-4 mr-1" />Válido</Badge>}
                      {doc.estado === 'Pendiente' && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse"><AlertCircle className="h-4 w-4 mr-1" />Pendiente</Badge>}
                      {doc.estado === 'Observado' && <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse"><XCircle className="h-4 w-4 mr-1" />Observado</Badge>}
                    </div>
                    <span className="text-xs text-gray-500">Vence: {doc.vencimiento}</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleFileInputClick(doc.id)} className="border-blue-300 text-blue-800 hover:bg-blue-50">
                        <Upload className="h-4 w-4 mr-1" />{doc.file ? 'Reemplazar' : 'Cargar'} Documento
                      </Button>
                      {doc.file && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setPreviewUrl(URL.createObjectURL(doc.file!))} className="border-green-300 text-green-800 hover:bg-green-50">
                            <Eye className="h-4 w-4 mr-1" /> Ver
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveFile(doc.id)} className="border-red-300 text-red-800 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" /> Quitar
                          </Button>
                        </>
                      )}
                    </div>
                    {doc.file && previewUrl && selectedDocId === doc.id && (
                      <div className="mt-2">
                        {doc.file.type.startsWith('image/') ? (
                          <img src={previewUrl} alt="Previsualización" className="max-h-32 rounded shadow border border-blue-100 mx-auto" />
                        ) : (
                          <iframe src={previewUrl} title="PDF" className="w-full h-32 rounded shadow bg-white" />
                        )}
                      </div>
                    )}
                    {doc.estado === 'Pendiente' && doc.file && (
                      <Button size="sm" onClick={() => handleVerifyDocument(doc.id)} className="mt-2 w-full bg-blue-700 hover:bg-blue-800 text-white">
                        <CheckCircle className="h-4 w-4 mr-1" /> Validar con sistema externo
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mercancias">
            <AccordionTrigger>
              <Package className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-900 uppercase tracking-wide">Declaración de Mercancías</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {/* Contenedor para hacer la tabla responsive */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Valor (USD)</th>
                        <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Observaciones</th>
                        <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {mercancias.map((m, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">{m.tipo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${m.valor.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-normal max-w-xs truncate">{m.observaciones}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveMercancia(idx)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base">Añadir Nueva Mercancía</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Tipo"
                      value={nuevaMercancia.tipo}
                      onChange={(e) => setNuevaMercancia({ ...nuevaMercancia, tipo: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Valor (USD)"
                      value={nuevaMercancia.valor}
                      onChange={(e) => setNuevaMercancia({ ...nuevaMercancia, valor: e.target.value })}
                    />
                    <Input
                      placeholder="Observaciones"
                      value={nuevaMercancia.observaciones}
                      onChange={(e) => setNuevaMercancia({ ...nuevaMercancia, observaciones: e.target.value })}
                    />
                    <Button onClick={handleAddMercancia} className="md:col-span-3">Añadir</Button>
                  </CardContent>
                </Card>

                <div className="text-right font-semibold space-y-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Declarado:</span>
                    <span>${totalValor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Arancel Aduanero (10%):</span>
                    <span className="text-red-600">${arancel.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="biometria">
            <AccordionTrigger><Fingerprint className="h-6 w-6 text-blue-600 mr-2" />Validación Biométrica</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-4">
                <Badge className={biometria === 'Validado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{biometria}</Badge>
                <Button onClick={handleBiometria} disabled={biometria === 'Validado'} variant="outline" size="sm">
                  Simular Validación
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="firma">
            <AccordionTrigger><PenTool className="h-6 w-6 text-blue-600 mr-2" />Firma del Inspector</AccordionTrigger>
            <AccordionContent>
              {firma ? (
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <div className="font-bold text-blue-900 text-base">Firmado digitalmente por Inspector García</div>
                    <div className="text-xs text-blue-700">Fecha y hora: {new Date().toLocaleString('es-CL')}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>
                  <Button onClick={handleFirmar} disabled={firma} variant="outline" size="sm">
                    Simular Firma
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="observaciones">
            <AccordionTrigger><Eye className="h-6 w-6 text-blue-600 mr-2" />Observaciones</AccordionTrigger>
            <AccordionContent>
              <label className="font-medium text-blue-900">Observaciones</label>
              <Textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Ingrese observaciones..." />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="acciones">
            <AccordionTrigger><CheckCircle className="h-6 w-6 text-blue-600 mr-2" />Acciones</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-4 mt-2">
                <Button onClick={handleAprobar} disabled={estado === 'Aprobado'} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" /> Aprobar
                </Button>
                <Button onClick={handleRechazar} disabled={estado === 'Rechazado'} className="bg-red-600 hover:bg-red-700 text-white flex-1">
                  <XCircle className="h-4 w-4 mr-2" /> Rechazar
                </Button>
              </div>
              <div className="mt-2">
                <Badge className={estado === 'Aprobado' ? 'bg-green-100 text-green-800' : estado === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                  Estado: {estado}
                </Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="px-6 py-2 text-base font-semibold">
            Volver
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mt-8 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <span className="text-xl font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2 text-center md:text-left">
            <Clock className="h-6 w-6 text-blue-600" /> Bitácora de Acciones
          </span>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button size="sm" variant="outline" onClick={exportBitacoraCSV} className="border-blue-300 text-blue-800 hover:bg-blue-50 w-full md:w-auto">Exportar CSV</Button>
            <Button size="sm" variant="outline" onClick={exportBitacoraPDF} className="border-blue-300 text-blue-800 hover:bg-blue-50 w-full md:w-auto">Exportar PDF</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Fecha</th>
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Usuario</th>
                <th className="px-4 py-2 text-left font-semibold text-blue-900">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bitacora.map((b, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 whitespace-nowrap">{b.fecha}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.usuario}</td>
                  <td className="px-4 py-2 whitespace-normal">{b.accion}</td>
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