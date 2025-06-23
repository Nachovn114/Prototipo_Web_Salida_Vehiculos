import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccesoNoAutorizado() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-red-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Acceso No Autorizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">
            No tienes los permisos necesarios para acceder a esta sección del sistema.
          </p>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Volver atrás
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full border-gray-300"
            >
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
