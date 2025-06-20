import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Tesseract from 'tesseract.js';

const getBadge = (estado: 'vigente' | 'vencido' | 'por-vencer') => {
  switch (estado) {
    case 'vigente':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Vigente</Badge>;
    case 'por-vencer':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">Por vencer</Badge>;
    default:
      return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">Vencido</Badge>;
  }
};

const ValidacionDocumental: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [estado, setEstado] = useState<'vigente' | 'vencido' | 'por-vencer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFecha(null);
      setEstado(null);
      setError(null);
    }
  };

  const handleOCR = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await Tesseract.recognize(image, 'spa');
      const text = data.text;
      // Buscar fecha en formato dd/mm/yyyy o yyyy-mm-dd
      const match = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
      if (match) {
        setFecha(match[0]);
        // Lógica de vigencia
        const hoy = new Date();
        const partes = match[0].includes('-') ? match[0].split('-') : match[0].split('/');
        let fechaDoc;
        if (partes[0].length === 4) {
          // yyyy-mm-dd
          fechaDoc = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
        } else {
          // dd/mm/yyyy
          fechaDoc = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
        }
        const diff = (fechaDoc.getTime() - hoy.getTime()) / (1000 * 3600 * 24);
        if (diff < 0) setEstado('vencido');
        else if (diff < 30) setEstado('por-vencer');
        else setEstado('vigente');
      } else {
        setFecha(null);
        setEstado(null);
        setError('No se detectó fecha de vencimiento en el documento.');
      }
    } catch (e) {
      setError('Error al procesar la imagen.');
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Validación Documental Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleOCR} disabled={!image || loading} className="mt-2 w-full">
            {loading ? 'Procesando...' : 'Validar Documento'}
          </Button>
        </div>
        {fecha && estado && (
          <div className="flex items-center gap-4">
            {getBadge(estado)}
            <span className="font-semibold">Vencimiento detectado:</span>
            <span>{fecha}</span>
          </div>
        )}
        {estado === 'vencido' && (
          <div className="flex items-center gap-2 text-red-700 font-bold animate-pulse">
            <AlertTriangle className="h-5 w-5" /> Documento vencido. No es válido para el cruce fronterizo.
          </div>
        )}
        {error && (
          <div className="text-red-600 font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValidacionDocumental; 