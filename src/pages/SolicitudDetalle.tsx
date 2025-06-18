import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, User, Users, Car, FileText, Fingerprint, Package, PenTool, Eye, Upload, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

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

  const handleAprobar = () => {
    setEstado('Aprobado');
    setSolicitud({ ...solicitud, estado: 'Aprobado' });
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

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
            <FileText className="h-6 w-6 text-blue-700" /> Solicitud #{id}
          </CardTitle>
          <CardDescription className="text-blue-700">Detalle completo de la solicitud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sección: Conductor */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><User className="h-5 w-5 text-blue-600" /> Conductor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">Nombre:</span> {solicitud.conductor.nombre}</div>
              <div><span className="font-medium">Documento:</span> {solicitud.conductor.documento}</div>
            </div>
          </div>
          {/* Sección: Acompañantes */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Users className="h-5 w-5 text-blue-600" /> Acompañantes</h3>
            {solicitud.acompanantes.length === 0 ? <span className="text-gray-500">Sin acompañantes</span> : (
              <ul className="list-disc ml-6">
                {solicitud.acompanantes.map((a, i) => (
                  <li key={i}>{a.nombre} — {a.documento}</li>
                ))}
              </ul>
            )}
          </div>
          {/* Sección: Vehículo */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Car className="h-5 w-5 text-blue-600" /> Vehículo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">Patente:</span> {solicitud.vehiculo.patente}</div>
              <div><span className="font-medium">Marca:</span> {solicitud.vehiculo.marca}</div>
              <div><span className="font-medium">Modelo:</span> {solicitud.vehiculo.modelo}</div>
              <div><span className="font-medium">Año:</span> {solicitud.vehiculo.año}</div>
              <div><span className="font-medium">Color:</span> {solicitud.vehiculo.color}</div>
            </div>
          </div>
          {/* Sección: Documentos */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-blue-600" /> Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentos.map((doc) => (
                <div key={doc.id} className="p-3 border rounded-lg bg-gray-50 flex flex-col gap-2">
                  <span className="font-medium">{doc.nombre}</span>
                  <div className="flex items-center gap-2">
                    {doc.estado === 'Válido' && <Badge className="bg-green-100 text-green-800 border-green-200"><CheckIcon className="h-3 w-3 mr-1" />Válido</Badge>}
                    {doc.estado === 'Pendiente' && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="h-3 w-3 mr-1" />Pendiente</Badge>}
                    {doc.estado === 'Observado' && <Badge className="bg-red-100 text-red-800 border-red-200"><XIcon className="h-3 w-3 mr-1" />Observado</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">Vence: {doc.vencimiento}</span>
                  <div className="flex gap-2 items-center mb-2">
                    <Button variant="outline" size="sm" onClick={() => handleFileInputClick(doc.id)}>
                      <Upload className="h-4 w-4 mr-1" />{doc.file ? 'Reemplazar' : 'Cargar'} Documento
                    </Button>
                    {doc.file && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setPreviewUrl(URL.createObjectURL(doc.file!))}>
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveFile(doc.id)}>
                          <XIcon className="h-4 w-4 mr-1" /> Quitar
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
                        <img src={previewUrl} alt="Previsualización" className="max-h-48 rounded shadow" />
                      ) : (
                        <iframe src={previewUrl} title="PDF" className="w-full h-48 rounded shadow bg-white" />
                      )}
                    </div>
                  )}
                  {doc.estado === 'Pendiente' && doc.file && (
                    <Button size="sm" onClick={() => handleVerifyDocument(doc.id)} className="mt-2 w-full">
                      <CheckIcon className="h-4 w-4 mr-1" /> Validar con sistema externo
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Sección: Biometría */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Fingerprint className="h-5 w-5 text-blue-600" /> Validación Biométrica</h3>
            <div className="flex items-center gap-4">
              <Badge className={biometria === 'Validado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{biometria}</Badge>
              <Button onClick={handleBiometria} disabled={biometria === 'Validado'} variant="outline" size="sm">
                Simular Validación
              </Button>
            </div>
          </div>
          {/* Sección: Mercancías */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Package className="h-5 w-5 text-blue-600" /> Declaración de Mercancías</h3>
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
                <Button onClick={handleAddMercancia} className="bg-blue-700 hover:bg-blue-800 text-white">
                  Agregar
                </Button>
              </div>
            </div>
            <div className="flex gap-6 mt-2">
              <Badge className="bg-blue-100 text-blue-800">Total declarado: ${totalValor} USD</Badge>
              <Badge className="bg-emerald-100 text-emerald-800">Arancel estimado: ${arancel} USD</Badge>
            </div>
          </div>
          {/* Sección: Firma */}
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><PenTool className="h-5 w-5 text-blue-600" /> Firma del Inspector</h3>
            <div className="flex items-center gap-4">
              <Badge className={firma ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{firma ? 'Firmado' : 'Pendiente'}</Badge>
              <Button onClick={handleFirmar} disabled={firma} variant="outline" size="sm">
                Simular Firma
              </Button>
            </div>
          </div>
          {/* Sección: Observaciones y acciones */}
          <div className="space-y-2">
            <label className="font-medium text-blue-900">Observaciones</label>
            <Textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Ingrese observaciones..." />
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
          </div>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolicitudDetalle; 