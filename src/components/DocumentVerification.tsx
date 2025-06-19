import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle, Search, Eye, XCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentVerification: React.FC = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Permiso de Circulación', status: 'verified', expiryDate: '2024-12-15', file: null },
    { id: 2, name: 'Revisión Técnica', status: 'pending', expiryDate: '2024-08-20', file: null },
    { id: 3, name: 'Seguro Obligatorio', status: 'verified', expiryDate: '2024-11-30', file: null },
    { id: 4, name: 'Cédula de Identidad', status: 'verified', expiryDate: '2028-05-15', file: null }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  const handleDocumentUpload = (id: number, file: File) => {
    const url = URL.createObjectURL(file);
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, file, status: 'pending' } : doc));
    setPreviewUrl(url);
    setSelectedDocId(id);
    toast.success('Documento cargado correctamente');
  };

  const handleVerifyDocument = (id: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, status: 'verified' } : doc
      )
    );
    toast.success('Documento verificado', { description: '🎉 El documento fue validado correctamente.' });
  };

  const handleRemoveFile = (id: number) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, file: null, status: 'pending' } : doc));
    setPreviewUrl(null);
    setSelectedDocId(null);
    toast.error('Documento eliminado', { description: 'El archivo fue quitado de la solicitud.' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verificado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Desconocido
          </Badge>
        );
    }
  };

  const isDocumentExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
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

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <span>Verificación de Documentos</span>
        </CardTitle>
        <CardDescription>
          Control documental y validación digital
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar documento o número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 form-input"
          />
        </div>

        {/* Document List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Documentos del Vehículo</h4>
          <div className="space-y-3">
            {documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase())).map((doc) => (
              <div key={doc.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col gap-2 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" /> {doc.name}
                  </h5>
                  {getStatusBadge(doc.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Vence: {doc.expiryDate}</span>
                  {isDocumentExpiringSoon(doc.expiryDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Por vencer
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <Button variant="outline" size="sm" onClick={() => handleFileInputClick(doc.id)}>
                    <Upload className="h-4 w-4 mr-1" />
                    {doc.file ? 'Reemplazar' : 'Cargar'} Documento
                  </Button>
                  {doc.file && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setPreviewUrl(URL.createObjectURL(doc.file!))}>
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveFile(doc.id)}>
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
                {doc.status === 'pending' && doc.file && (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyDocument(doc.id)}
                    className="mt-2 w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Verificar Documento
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Digital Verification */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Verificación Digital</h4>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Conexión con Registro Civil
                </p>
                <p className="text-xs text-blue-700">
                  Verificación automática en tiempo real
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              Verificar RUT
            </Button>
            <Button variant="outline" size="sm">
              Validar Patente
            </Button>
          </div>
        </div>

        {/* Visualización institucional de la firma digital */}
        <div className="flex items-center gap-3 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-2xl">🔐</span>
          <div>
            <div className="font-bold text-blue-900">Firmado digitalmente por Inspector García</div>
            <div className="text-xs text-blue-700">Fecha y hora: {new Date().toLocaleString('es-CL')}</div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Documentación Completa
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {Math.round((documents.filter(d => d.status === 'verified').length / documents.length) * 100)}% Verificado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
