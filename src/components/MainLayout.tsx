import React from 'react';
import { Header } from './Header';
import { useNotifications } from '../hooks/useNotifications';
import { Toaster } from '@/components/ui/sonner';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header unreadCount={unreadCount} notifications={notifications} markAsRead={markAsRead} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout; 