import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle, Search, Eye, XCircle, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Tesseract from 'tesseract.js';
import { notifyDocumentValidation } from '@/services/notificationService';

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
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [dateFound, setDateFound] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractExpiryDateFromFile = async (file: File): Promise<string | null> => {
    const { data: { text } } = await Tesseract.recognize(file, 'spa');
    const match = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
    return match ? match[1] : null;
  };

  const handleDocumentUpload = async (id: number, file: File) => {
    // Optimistic UI update
    const previewUrl = URL.createObjectURL(file);
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, file, status: 'pending', previewUrl } : doc));
    setSelectedDocId(id);

    toast.info('Procesando documento...', {
      description: 'La lectura OCR puede tardar unos segundos.',
    });

    try {
      if (file.type.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file, 'spa', {
          logger: m => console.log(m),
        });
        
        // Regex mejorada para dd/mm/yyyy o dd-mm-yyyy
        const match = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
        const expiry = match ? match[1].replace(/-/g, '/') : null;

        if (expiry) {
          const isExpired = new Date(expiry.split('/').reverse().join('-')) < new Date();
          const status = isExpired ? 'expired' : 'verified';
          setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, expiryDate: expiry, status } : doc));
          
          if (isExpired) {
            toast.error('Documento Vencido', { description: `Fecha detectada: ${expiry}` });
            notifyDocumentValidation(file.name, 'Vencido');
          } else {
            toast.success('Documento Verificado', { description: `Fecha detectada: ${expiry}` });
            notifyDocumentValidation(file.name, 'Válido');
          }
        } else {
          setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'manual' } : doc));
          toast.warning('Verificación Manual Requerida', { description: 'No se pudo detectar una fecha de vencimiento.' });
          notifyDocumentValidation(file.name, 'Error');
        }
      } else {
        // Para PDFs u otros tipos de archivo, requerir verificación manual
        setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'manual' } : doc));
        toast.warning('Verificación Manual Requerida', { description: 'La previsualización de este archivo no es compatible con OCR.'});
      }
    } catch (error) {
      console.error('Error de OCR:', error);
      setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'manual' } : doc));
      toast.error('Error de OCR', { description: 'No se pudo procesar el documento.' });
      notifyDocumentValidation(file.name, 'Error');
    }
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
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vencido
          </Badge>
        );
      case 'manual':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Eye className="h-3 w-3 mr-1" />
            Verificar
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
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOcrText('');
      setDateFound(null);
      setIsExpired(null);
      setError('');
    }
  };

  const extractDate = (text: string): string | null => {
    // Busca fechas en formato dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, yyyy/mm/dd
    const regex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/g;
    const matches = text.match(regex);
    return matches ? matches[0] : null;
  };

  const checkIfExpired = (dateStr: string): boolean => {
    let parts;
    let date;
    if (dateStr.includes('/')) {
      parts = dateStr.split('/');
    } else {
      parts = dateStr.split('-');
    }
    if (parts[0].length === 4) {
      // yyyy-mm-dd
      date = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
    } else {
      // dd-mm-yyyy
      date = new Date(parts[2], parseInt(parts[1], 10) - 1, parts[0]);
    }
    return date < new Date();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setOcrText('');
    setDateFound(null);
    setIsExpired(null);
    setError('');
    try {
      const { data } = await Tesseract.recognize(file, 'spa', {
        logger: m => {},
      });
      setOcrText(data.text);
      const date = extractDate(data.text);
      setDateFound(date);
      if (date) {
        setIsExpired(checkIfExpired(date));
      }
    } catch (err) {
      setError('Error al analizar el documento.');
    }
    setLoading(false);
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

        <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-2">Validación Inteligente de Documentos</h2>
          <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="mb-2" />
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Analizando...' : 'Analizar Documento'}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {ocrText && (
            <div className="mt-4">
              <div className="font-semibold">Texto extraído:</div>
              <pre className="bg-gray-100 p-2 rounded text-xs max-h-40 overflow-y-auto">{ocrText}</pre>
            </div>
          )}
          {dateFound && (
            <div className="mt-2">
              <span className="font-semibold">Fecha detectada:</span> {dateFound}
              <span className={isExpired ? 'text-red-600 font-bold ml-2' : 'text-green-600 font-bold ml-2'}>
                {isExpired ? 'VENCIDO' : 'VIGENTE'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
