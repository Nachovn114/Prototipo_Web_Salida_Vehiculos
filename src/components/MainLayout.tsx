import React, { useState } from 'react';
import { Header } from './Header';
import { useNotifications } from '../hooks/useNotifications';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <Header unreadCount={unreadCount} notifications={notifications} markAsRead={markAsRead} />
      <main className="container mx-auto px-4 py-6 flex-1">
        {children}
      </main>
      <footer className="w-full py-3 bg-white border-t flex justify-center items-center">
        <Button variant="ghost" className="text-blue-900 font-semibold" onClick={() => setOpen(true)}>
          Versión 1.0
        </Button>
      </footer>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Historial de Cambios (Changelog)</DialogTitle>
          </DialogHeader>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li><b>v1.0</b> - Versión inicial profesional para presentación</li>
            <li>✔ Dashboard visual con métricas y accesos rápidos</li>
            <li>✔ Detalle de solicitud completo y validación documental</li>
            <li>✔ Módulo de reportes con gráficos y exportación</li>
            <li>✔ Panel de calidad ISO 25000</li>
            <li>✔ Control de versiones y changelog</li>
            <li>✔ Notificaciones y roles simulados</li>
          </ul>
          <a href="https://github.com/Nachovn114/Prototipo_Web_Salida_Vehiculos" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-sm mt-2 inline-block">Ver en GitHub</a>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default MainLayout; 