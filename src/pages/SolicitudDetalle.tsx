import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, User, Users, Car, FileText, Fingerprint, Package, PenTool, Eye, Upload, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
    { nombre: 'SOAP', estado: 'Válido', vencimiento: '2024-12-31' },
    { nombre: 'Revisión Técnica', estado: 'Válido', vencimiento: '2024-08-20' },
    { nombre: 'Licencia', estado: 'Válido', vencimiento: '2028-05-15' },
  ],
  biometria: 'Pendiente',
  mercancias: [
    { tipo: 'Electrodomésticos', valor: 500, observaciones: 'Sin observaciones' },
  ],
  observaciones: '',
  estado: 'Pendiente',
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
    { id: 1, nombre: 'SOAP', estado: 'Válido', vencimiento: '2024-12-31', file: null },
    { id: 2, nombre: 'Revisión Técnica', estado: 'Pendiente', vencimiento: '2024-08-20', file: null },
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
    <div className="max-w-3xl mx-auto py-8 space-y-8 px-0">
      <Card className="shadow-lg border-blue-100 bg-white dark:bg-gray-900 text-foreground dark:text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-blue-900 dark:text-blue-200">
            <FileText className="h-6 w-6 text-blue-700" /> Solicitud #{id}
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">Detalle completo de la solicitud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <Accordion type="multiple" className="w-full rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-gray-800 shadow-sm divide-y divide-blue-200 dark:divide-blue-800">
            <AccordionItem value="conductor">
              <AccordionTrigger>
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900 dark:text-blue-200">Datos del Conductor</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Nombre:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.conductor.nombre}</span></div>
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Documento:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.conductor.documento}</span></div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="acompanantes">
              <AccordionTrigger>
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900 dark:text-blue-200">Acompañantes</span>
              </AccordionTrigger>
              <AccordionContent>
                {solicitud.acompanantes.length === 0 ? <span className="text-gray-500">Sin acompañantes</span> : (
                  <ul className="list-disc ml-6">
                    {solicitud.acompanantes.map((a, i) => (
                      <li key={i}><span className="font-semibold text-blue-800 dark:text-blue-300">{a.nombre}</span> <span className="text-gray-700 dark:text-gray-200">— {a.documento}</span></li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vehiculo">
              <AccordionTrigger>
                <Car className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900 dark:text-blue-200">Datos del Vehículo</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Patente:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.vehiculo.patente}</span></div>
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Marca:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.vehiculo.marca}</span></div>
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Modelo:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.vehiculo.modelo}</span></div>
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Año:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.vehiculo.año}</span></div>
                  <div><span className="font-semibold text-blue-800 dark:text-blue-300">Color:</span> <span className="text-base text-gray-800 dark:text-gray-200">{solicitud.vehiculo.color}</span></div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="documentos">
              <AccordionTrigger>
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900 dark:text-blue-200">Documentos</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-4">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col gap-2 transition-all duration-300">
                      <span className="font-medium">{doc.nombre}</span>
                      <div className="flex items-center gap-2">
                        {doc.estado === 'Válido' && <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse"><CheckCircle className="h-3 w-3 mr-1" />Válido</Badge>}
                        {doc.estado === 'Pendiente' && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse"><AlertCircle className="h-3 w-3 mr-1" />Pendiente</Badge>}
                        {doc.estado === 'Observado' && <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse"><XCircle className="h-3 w-3 mr-1" />Observado</Badge>}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-300">Vence: {doc.vencimiento}</span>
                      <div className="flex gap-2 items-center mb-2">
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
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      {doc.file && previewUrl && selectedDocId === doc.id && (
                        <div className="mt-2">
                          {doc.file.type.startsWith('image/') ? (
                            <img src={previewUrl} alt="Previsualización" className="max-h-32 rounded shadow border border-blue-100 dark:border-blue-800 mx-auto" />
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
              <AccordionTrigger><Package className="h-5 w-5 text-blue-600 mr-2" />Declaración de Mercancías</AccordionTrigger>
              <AccordionContent>
                <div className="mb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                          <th className="px-3 py-2 text-left font-semibold">Valor (USD)</th>
                          <th className="px-3 py-2 text-left font-semibold">Observaciones</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {mercancias.length === 0 ? (
                          <tr><td colSpan={4} className="text-gray-500 px-3 py-2">Sin mercancías declaradas</td></tr>
                        ) : mercancias.map((m, i) => (
                          <tr key={i} className="border-b">
                            <td className="px-3 py-2">{m.tipo}</td>
                            <td className="px-3 py-2">${m.valor}</td>
                            <td className="px-3 py-2">{m.observaciones}</td>
                            <td className="px-3 py-2">
                              <Button size="sm" variant="destructive" onClick={() => handleRemoveMercancia(i)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Formulario para agregar mercancía */}
                  <div className="flex flex-col md:flex-row gap-2 mt-3">
                    <Input
                      placeholder="Tipo de mercancía"
                      value={nuevaMercancia.tipo}
                      onChange={e => setNuevaMercancia({ ...nuevaMercancia, tipo: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Valor (USD)"
                      type="number"
                      min={0}
                      value={nuevaMercancia.valor}
                      onChange={e => setNuevaMercancia({ ...nuevaMercancia, valor: e.target.value })}
                      className="w-32"
                    />
                    <Input
                      placeholder="Observaciones"
                      value={nuevaMercancia.observaciones}
                      onChange={e => setNuevaMercancia({ ...nuevaMercancia, observaciones: e.target.value })}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleAddMercancia()} className="bg-blue-700 hover:bg-blue-800 text-white">
                      Agregar
                    </Button>
                  </div>
                </div>
                <div className="flex gap-6 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">Total declarado: ${totalValor} USD</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800">Arancel estimado: ${arancel} USD</Badge>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="biometria">
              <AccordionTrigger><Fingerprint className="h-5 w-5 text-blue-600 mr-2" />Validación Biométrica</AccordionTrigger>
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
              <AccordionTrigger><PenTool className="h-5 w-5 text-blue-600 mr-2" />Firma del Inspector</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-4">
                  <Badge className={firma ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{firma ? 'Firmado' : 'Pendiente'}</Badge>
                  <Button onClick={handleFirmar} disabled={firma} variant="outline" size="sm">
                    Simular Firma
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="observaciones">
              <AccordionTrigger><Eye className="h-5 w-5 text-blue-600 mr-2" />Observaciones</AccordionTrigger>
              <AccordionContent>
                <label className="font-medium text-blue-900">Observaciones</label>
                <Textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Ingrese observaciones..." />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="acciones">
              <AccordionTrigger><CheckCircle className="h-5 w-5 text-blue-600 mr-2" />Acciones</AccordionTrigger>
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
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolicitudDetalle; 