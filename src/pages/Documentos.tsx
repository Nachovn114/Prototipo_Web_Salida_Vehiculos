import React from 'react';
import { DocumentVerification } from '../components/DocumentVerification';

const Documentos = () => (
  <>
    <h2 className="text-3xl font-bold text-blue-900 mb-6">Gestión y Verificación de Documentos</h2>
    <div className="w-full max-w-2xl mx-auto">
      <DocumentVerification />
    </div>
  </>
);

export default Documentos; 