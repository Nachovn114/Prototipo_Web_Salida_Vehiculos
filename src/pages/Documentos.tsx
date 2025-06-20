import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentVerification from '../components/DocumentVerification';

const Documentos = () => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-8 px-4 sm:px-8">
        <Skeleton className="h-12 w-2/3 sm:w-1/2 mb-6 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-72 sm:h-96 w-full" />
          <Skeleton className="h-72 sm:h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center sm:text-left">Gestión y Verificación de Documentos</h2>
      <div className="w-full max-w-2xl mx-auto p-2 sm:p-0">
        <DocumentVerification />
      </div>
    </>
  );
};

export default Documentos; 