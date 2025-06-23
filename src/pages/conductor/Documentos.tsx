import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentVerification from '../../components/DocumentVerification';

const Documentos = () => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Documentación Requerida</h1>
      <DocumentVerification />
    </div>
  );
};

export default Documentos;
