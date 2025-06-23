import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegistroExitoso = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mostrar el loader por 5 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <Card className="w-full max-w-md shadow-lg border-0 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800">Procesando tu registro</h2>
            <p className="text-gray-600">Por favor, espera mientras validamos tu información...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Registro Exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-600">
            Tu registro se ha completado exitosamente. Por favor inicia sesión para continuar.
          </p>
          <div className="pt-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/login">
                Ir al Inicio de Sesión
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroExitoso;
