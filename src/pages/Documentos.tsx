import React, { useState, useEffect } from 'react';
import { DocumentVerification } from '../components/DocumentVerification';
import { Skeleton } from '@/components/ui/skeleton';

const Documentos = () => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-8 px-0">
        <Skeleton className="h-12 w-1/2 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Gestión y Verificación de Documentos</h2>
      <div className="w-full max-w-2xl mx-auto">
        <DocumentVerification />
      </div>
    </>
  );
};

export default Documentos; 