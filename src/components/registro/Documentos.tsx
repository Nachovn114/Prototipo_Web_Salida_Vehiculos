import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Upload, X, CheckCircle2, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  licenciaConducir: File | null;
  seguro: File | null;
  revisionTecnica: File | null;
  permisoCirculacion: File | null;
}

interface DocumentosProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string | undefined>;
}

const Documentos: React.FC<DocumentosProps> = ({ formData, setFormData, onFileChange, errors }) => {
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({
    licenciaConducir: null,
    seguro: null,
    revisionTecnica: null,
    permisoCirculacion: null
  });

  const handleFileSelect = (name: string) => {
    const input = fileInputs.current[name];
    if (input) {
      // Create a new input element to ensure the change event fires even if the same file is selected again
      const newInput = document.createElement('input');
      newInput.type = 'file';
      newInput.accept = '.pdf,.jpg,.jpeg,.png';
      newInput.onchange = (e) => {
        const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
        if (event.target.files && event.target.files.length > 0) {
          onFileChange({
            ...event,
            target: {
              ...event.target,
              name: name,
              files: event.target.files
            }
          });
        }
      };
      newInput.click();
    }
  };

  const handleRemoveFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev: any) => ({
      ...prev,
      [name]: null
    }));

    // Reset the file input
    if (fileInputs.current[name]) {
      fileInputs.current[name]!.value = '';
    }
  };

  const getFilePreview = (file: File | null) => {
    if (!file) return null;
    
    const fileType = file.type.split('/')[0];
    const fileSize = (file.size / (1024 * 1024)).toFixed(2); // MB
    
    if (fileType === 'image') {
      return (
        <div className="relative h-32 w-full rounded-md border border-dashed border-gray-300 overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm font-medium">Ver</span>
          </div>
        </div>
      );
    }
    
    // For PDFs
    return (
      <div className="flex items-center p-4 border border-gray-200 rounded-md bg-gray-50">
        <FileIcon className="h-10 w-10 text-red-500" />
        <div className="ml-4 flex-1 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{fileSize} MB</p>
        </div>
      </div>
    );
  };

  const documentTypes = [
    {
      id: 'licenciaConducir',
      title: 'Licencia de Conducir',
      description: 'Formato: PDF, JPG, PNG (Máx. 5MB)',
      required: true
    },
    {
      id: 'seguro',
      title: 'Seguro del Vehículo',
      description: 'Formato: PDF, JPG, PNG (Máx. 5MB)',
      required: true
    },
    {
      id: 'revisionTecnica',
      title: 'Revisión Técnica',
      description: 'Formato: PDF, JPG, PNG (Máx. 5MB)',
      required: true
    },
    {
      id: 'permisoCirculacion',
      title: 'Permiso de Circulación',
      description: 'Formato: PDF, JPG, PNG (Máx. 5MB)',
      required: true
    }
  ];

  return (
    <div className="space-y-6" data-name="Documentos">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Documentación Requerida</h2>
        <p className="text-muted-foreground">
          Sube los documentos solicitados en formato digital. Asegúrate de que sean claros y legibles.
        </p>
      </div>

      <div className="space-y-8">
        {documentTypes.map((doc) => {
          const hasFile = !!formData[doc.id as keyof FormData];
          const error = errors[doc.id];
          
          return (
            <Card key={doc.id} className={cn(
              "overflow-hidden",
              error ? "border-red-500" : "border-gray-200"
            )}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {doc.title}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                      {hasFile && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
                    </CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                  <input
                    type="file"
                    ref={el => {
                      if (el) {
                        fileInputs.current[doc.id] = el;
                      }
                    }}
                    onChange={onFileChange}
                    name={doc.id}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant={hasFile ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFileSelect(doc.id)}
                  >
                    {hasFile ? 'Cambiar' : 'Subir'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {hasFile ? (
                  <div className="relative">
                    {getFilePreview(formData[doc.id as keyof FormData] as File)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full h-6 w-6"
                      onClick={(e) => handleRemoveFile(doc.id, e)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className={cn(
                      "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md",
                      "hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer",
                      error ? "border-red-300 bg-red-50" : "border-gray-300"
                    )}
                    onClick={() => handleFileSelect(doc.id)}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Haz clic para subir o arrastra un archivo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.description}
                    </p>
                  </div>
                )}
                
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Importante</h3>
            <div className="mt-2 text-sm text-amber-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Asegúrate de que los documentos estén vigentes</li>
                <li>Los archivos deben estar en formato PDF, JPG o PNG</li>
                <li>Tamaño máximo por archivo: 5MB</li>
                <li>Toda la información debe ser clara y legible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;
