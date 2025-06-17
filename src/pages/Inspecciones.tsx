import React from 'react';
import { VehicleInspection } from '../components/VehicleInspection';
import MainLayout from '../components/MainLayout';

const Inspecciones = () => (
  <MainLayout>
    <h2 className="text-3xl font-bold text-blue-900 mb-6">Inspección de Vehículos</h2>
    <div className="w-full max-w-2xl mx-auto">
      <VehicleInspection />
    </div>
  </MainLayout>
);

export default Inspecciones; 