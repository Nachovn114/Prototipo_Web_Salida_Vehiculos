import React from 'react';
import { Dashboard } from '../components/Dashboard';
import MainLayout from '../components/MainLayout';

const Reportes = () => (
  <MainLayout>
    <h2 className="text-3xl font-bold text-blue-900 mb-6">Reportes y Estadísticas</h2>
    <div className="w-full max-w-4xl mx-auto">
      <Dashboard />
    </div>
  </MainLayout>
);

export default Reportes; 