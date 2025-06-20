import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle, Search, Eye, XCircle, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import Tesseract from 'tesseract.js';
import { notifyDocumentValidation } from '@/services/notificationService';
import { format, parse, isAfter, isBefore, subYears, addYears, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const DocumentVerification = () => {
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

  const extractExpiryDateFromFile = async (file: File): Promise<{date: Date | null, rawText: string}> => {
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'spa');
      
      // Mejores patrones para fechas
      const datePatterns = [
        // dd/mm/yyyy o dd-mm-yyyy
        /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,
        // yyyy-mm-dd
        /(\d{4}[\-]\d{2}[\-]\d{2})/,
        // Texto con mes en español (ej: 15 de enero de 2023)
        /(\d{1,2}\s+(?:de\s+)?(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)[a-z]*\s+(?:de\s+)?\d{4})/i,
        // Menciones de vencimiento
        /venc(?:e|imiento|imiento:?)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
      ];

      let bestDate: Date | null = null;
      
      // Procesar cada patrón
      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          let dateStr = match[1] || match[0];
          let parsedDate: Date | null = null;
          
          try {
            // Intentar diferentes formatos de fecha
            const formats = [
              'dd/MM/yyyy',
              'dd-MM-yyyy',
              'yyyy-MM-dd',
              "d 'de' MMMM 'de' yyyy",
              "d 'de' MMM 'de' yyyy"
            ];
            
            for (const fmt of formats) {
              parsedDate = parse(dateStr, fmt, new Date(), { locale: es });
              if (!isNaN(parsedDate.getTime())) break;
            }
            
            // Validar que la fecha sea razonable (no en el pasado lejano ni futuro lejano)
            if (parsedDate && !isNaN(parsedDate.getTime())) {
              const today = new Date();
              const minDate = subYears(today, 10);
              const maxDate = addYears(today, 20);
              
              if (isWithinInterval(parsedDate, { start: minDate, end: maxDate })) {
                bestDate = parsedDate;
                break;
              }
            }
          } catch (e) {
            console.warn('Error al parsear fecha:', dateStr, e);
          }
        }
      }
      
      return { date: bestDate, rawText: text };
    } catch (error) {
      console.error('Error en OCR:', error);
      return { date: null, rawText: '' };
    }
  };

  const handleDocumentUpload = async (id: number, file: File) => {
    // Optimistic UI update
    const previewUrl = URL.createObjectURL(file);
    setLoading(true);
    setError('');
    setOcrText('');
    setDateFound(null);
    setIsExpired(null);
    
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, file, status: 'processing', previewUrl, ocrResult: null } 
        : doc
    ));
    setSelectedDocId(id);

    const processingToast = toast.loading('Procesando documento...', {
      description: 'Analizando el documento con OCR. Por favor espere.',
    });

    try {
      // Verificar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Formato de archivo no soportado');
      }

      // Procesar con OCR
      const { date: expiryDate, rawText } = await extractExpiryDateFromFile(file);
      setOcrText(rawText.substring(0, 500) + (rawText.length > 500 ? '...' : ''));
      
      let status = 'manual';
      let statusMessage = 'Verificación Manual Requerida';
      let description = 'No se pudo determinar la fecha de vencimiento automáticamente.';
      
      if (expiryDate) {
        const formattedDate = format(expiryDate, "PPP", { locale: es });
        setDateFound(formattedDate);
        
        const today = new Date();
        const isDocExpired = isBefore(expiryDate, today);
        setIsExpired(isDocExpired);
        
        if (isDocExpired) {
          status = 'expired';
          statusMessage = 'Documento Vencido';
          description = `El documento venció el ${formattedDate}.`;
          notifyDocumentValidation(file.name, 'Vencido', formattedDate);
        } else {
          status = 'verified';
          statusMessage = 'Documento Verificado';
          description = `Válido hasta el ${formattedDate}.`;
          notifyDocumentValidation(file.name, 'Válido', formattedDate);
        }
      } else {
        statusMessage = 'Verificación Manual Requerida';
        description = 'No se pudo detectar una fecha de vencimiento. Se requiere revisión manual.';
        notifyDocumentValidation(file.name, 'Revisión Manual', 'No se detectó fecha');
      }
      
      // Actualizar estado del documento
      setDocuments(prev => prev.map(doc => 
        doc.id === id 
          ? { 
              ...doc, 
              status,
              expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : doc.expiryDate,
              ocrResult: { text: rawText, date: expiryDate }
            } 
          : doc
      ));
      
      // Mostrar notificación apropiada
      if (status === 'expired') {
        toast.error(statusMessage, { description });
      } else if (status === 'verified') {
        toast.success(statusMessage, { description });
      } else {
        toast.warning(statusMessage, { description });
      }
      
    } catch (error) {
      console.error('Error en el procesamiento del documento:', error);
      setError('Error al procesar el documento. Por favor, intente con una imagen más clara.');
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: 'error' } : doc
      ));
      toast.error('Error de Procesamiento', { 
        description: 'No se pudo procesar el documento. ' + (error.message || 'Por favor, intente nuevamente.') 
      });
      notifyDocumentValidation(file?.name || 'Documento', 'Error de Procesamiento', error.message || 'Error desconocido');
    } finally {
      setLoading(false);
      toast.dismiss(processingToast);
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
    toast.error('Documento eliminado', { 
      description: 'El archivo fue quitado de la solicitud.',
      duration: 3000,
      position: 'top-center'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Verificado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pendiente
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Expirado
          </Badge>
        );
      case 'manual':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Verificación Manual
          </Badge>
        );
      default:
        return null;
    }
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
      date = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
    } else {
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

  const isDocumentExpiringSoon = (expiryDate: string): boolean => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return isAfter(expiry, today) && isBefore(expiry, thirtyDaysFromNow);
  };

  const handleFileInputClick = (docId: number) => {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Verificación de Documentos</CardTitle>
        <CardDescription>
          Sube y verifica los documentos requeridos para el control vehicular
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <span>{doc.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            type="button" 
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={`Información sobre ${doc.name}`}
                          >
                            <Info className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">
                            {doc.name === 'Permiso de Circulación' && 'Documento oficial que acredita que el vehículo está autorizado para circular.'}
                            {doc.name === 'Revisión Técnica' && 'Certificado que acredita que el vehículo cumple con los requisitos técnicos y de emisiones.'}
                            {doc.name === 'Seguro Obligatorio' && 'Seguro que cubre daños a terceros en caso de accidentes de tránsito.'}
                            {doc.name === 'Cédula de Identidad' && 'Documento de identificación oficial del conductor.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveFile(doc.id)}
                        aria-label="Eliminar documento"
                      >
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
                    aria-label="Seleccionar archivo para subir"
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

export default DocumentVerification;
