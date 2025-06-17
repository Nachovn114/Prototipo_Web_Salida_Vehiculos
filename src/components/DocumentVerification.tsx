
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentVerification: React.FC = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Permiso de Circulación', status: 'verified', expiryDate: '2024-12-15' },
    { id: 2, name: 'Revisión Técnica', status: 'pending', expiryDate: '2024-08-20' },
    { id: 3, name: 'Seguro Obligatorio', status: 'verified', expiryDate: '2024-11-30' },
    { id: 4, name: 'Cédula de Identidad', status: 'verified', expiryDate: '2028-05-15' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleDocumentUpload = () => {
    toast.success('Documento cargado correctamente');
  };

  const handleVerifyDocument = (id: number) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, status: 'verified' } : doc
      )
    );
    toast.success('Documento verificado');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verificado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleDocumentUpload} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Cargar Documento
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Escanear QR
          </Button>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Documentos del Vehículo</h4>
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{doc.name}</h5>
                  {getStatusBadge(doc.status)}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Vence: {doc.expiryDate}</span>
                  {isDocumentExpiringSoon(doc.expiryDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Por vencer
                    </Badge>
                  )}
                </div>
                
                {doc.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyDocument(doc.id)}
                    className="mt-2 w-full"
                  >
                    Verificar Documento
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
              75% Verificado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
