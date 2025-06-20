import React, { useState, useEffect } from 'react';
import { VehicleInspection } from '../components/VehicleInspection';
import { Skeleton } from '@/components/ui/skeleton';

const Inspecciones = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-8 px-4 sm:px-8">
        <Skeleton className="h-12 w-1/2 mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 sm:h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center sm:text-left">Inspección de Vehículos</h2>
      <div className="w-full max-w-2xl mx-auto p-2 sm:p-0">
        <VehicleInspection />
      </div>
    </>
  );
};

export default Inspecciones; 