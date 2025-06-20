import React, { useState, useEffect } from 'react';
import { Card, Steps, Form, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, CheckCircle, XCircle, Clock, Loader2, Paperclip, AlertCircle } from 'lucide-react';
import StatusFeedback from './StatusFeedback';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const { Step } = Steps;

type DocStatus = 'pendiente' | 'uploading' | 'uploaded' | 'validado' | 'rechazado';

interface Documento {
  id: number;
  tipo: string;
  estado: DocStatus;
  observaciones?: string;
  file?: File;
  progress?: number;
}

// Componente para la carga de archivos
const FileUploader = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <label 
      onDragEnter={handleDrag} 
      onDragLeave={handleDrag} 
      onDragOver={handleDrag} 
      onDrop={handleDrop} 
      className={`relative block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input type="file" className="hidden" onChange={handleChange} />
      <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
        <UploadCloud className="w-10 h-10" />
        <p className="text-sm font-medium">
          <span className="text-blue-600">Haz clic para subir</span> o arrastra un archivo
        </p>
        <p className="text-xs">PDF, PNG, JPG (max. 5MB)</p>
      </div>
    </label>
  );
};

const ValidacionDocumental: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([
    { id: 1, tipo: 'Cédula de Identidad', estado: 'pendiente', progress: 0 },
    { id: 2, tipo: 'Licencia de Conducir', estado: 'pendiente', progress: 0 },
    { id: 3, tipo: 'Permiso de Circulación', estado: 'pendiente', progress: 0 },
    { id: 4, tipo: 'SOAP', estado: 'pendiente', progress: 0 },
  ]);

  const [feedback, setFeedback] = useState<{
    isVisible: boolean;
    status: 'success' | 'error';
    message: string;
  }>({ isVisible: false, status: 'success', message: '' });

  const handleFileSelect = (docId: number, file: File) => {
    setDocumentos(prevDocs => 
      prevDocs.map(doc => doc.id === docId ? { ...doc, file, estado: 'uploading', progress: 0 } : doc)
    );
  };

  useEffect(() => {
    const uploadingDocs = documentos.filter(d => d.estado === 'uploading');
    if (uploadingDocs.length === 0) return;

    const interval = setInterval(() => {
      setDocumentos(prevDocs => 
        prevDocs.map(doc => {
          if (doc.estado === 'uploading' && doc.progress !== undefined && doc.progress < 100) {
            const newProgress = doc.progress + 20;
            if (newProgress >= 100) {
              return { ...doc, progress: 100, estado: 'uploaded' };
            }
            return { ...doc, progress: newProgress };
          }
          return doc;
        })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [documentos]);
  
  const handleValidar = (docId: number, newStatus: 'validado' | 'rechazado') => {
    setDocumentos(prev => prev.map(d => d.id === docId ? {...d, estado: newStatus} : d));
    setFeedback({
      isVisible: true,
      status: newStatus === 'validado' ? 'success' : 'error',
      message: `Documento ${newStatus === 'validado' ? 'validado' : 'rechazado'}.`
    });
  };

  const handleFeedbackComplete = () => setFeedback(prev => ({ ...prev, isVisible: false }));
  
  const getStatusInfo = (estado: DocStatus) => {
    switch (estado) {
      case 'pendiente': return { icon: <Clock className="h-4 w-4" />, color: "text-gray-500", label: "Pendiente" };
      case 'uploading': return { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: "text-blue-500", label: "Subiendo..." };
      case 'uploaded': return { icon: <Paperclip className="h-4 w-4" />, color: "text-purple-600", label: "Listo para revisión" };
      case 'validado': return { icon: <CheckCircle className="h-4 w-4" />, color: "text-green-600", label: "Validado" };
      case 'rechazado': return { icon: <XCircle className="h-4 w-4" />, color: "text-red-600", label: "Rechazado" };
      default: return { icon: null, color: "", label: "" };
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <Steps current={1} className="mb-8 p-6">
          <Step title="Recepción de Documentos" />
          <Step title="Validación" description="En proceso" />
          <Step title="Aprobación Final" />
        </Steps>

        <div className="space-y-6 p-6 border-t">
          {documentos.map((doc) => (
            <motion.div key={doc.id} layout>
              <Card className="overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{doc.tipo}</h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      {React.cloneElement(getStatusInfo(doc.estado).icon, { className: `h-4 w-4 ${getStatusInfo(doc.estado).color}` })}
                      <span className={getStatusInfo(doc.estado).color}>{getStatusInfo(doc.estado).label}</span>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
                    {doc.estado === 'uploaded' && (
                      <div className="flex gap-2">
                        <Button onClick={() => handleValidar(doc.id, 'validado')} size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                          <CheckCircle className="mr-2 h-4 w-4" /> Aprobar
                        </Button>
                        <Button onClick={() => handleValidar(doc.id, 'rechazado')} size="sm" variant="destructive">
                          <XCircle className="mr-2 h-4 w-4" /> Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {doc.estado === 'pendiente' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 border-t">
                      <FileUploader onFileSelect={(file) => handleFileSelect(doc.id, file)} />
                    </motion.div>
                  )}
                  {doc.estado === 'uploading' && doc.file && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 border-t space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <FileIcon className="h-5 w-5 text-gray-500" />
                          <span className="font-medium truncate">{doc.file.name}</span>
                          <span className="text-gray-500 text-xs">({(doc.file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Progress value={doc.progress} className="w-full" />
                     </motion.div>
                  )}
                  {doc.estado === 'rechazado' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 border-t">
                      <Form.Item label="Observaciones de Rechazo" className="m-0">
                        <Input.TextArea rows={2} placeholder="Ingrese el motivo del rechazo..." />
                      </Form.Item>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card title="Resumen de Validación">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="text-lg font-medium">Total Documentos</h4>
            <p className="text-2xl">{documentos.length}</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-medium">Validados</h4>
            <p className="text-2xl text-green-600">
              {documentos.filter(d => d.estado === 'validado').length}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-medium">Pendientes</h4>
            <p className="text-2xl text-yellow-600">
              {documentos.filter(d => d.estado === 'pendiente').length}
            </p>
          </div>
        </div>
      </Card>

      <StatusFeedback
        isVisible={feedback.isVisible}
        status={feedback.status}
        message={feedback.message}
        onComplete={handleFeedbackComplete}
      />
    </div>
  );
};

export default ValidacionDocumental; 