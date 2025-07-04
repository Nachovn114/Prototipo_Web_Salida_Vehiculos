import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/contexts/AuthContext';
import './index.css';
import './styles/custom.css';
import './lib/i18n';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
}
