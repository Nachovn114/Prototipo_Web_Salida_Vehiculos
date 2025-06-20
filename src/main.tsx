import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App'
import './index.css'
import './styles/custom.css'
import './lib/i18n'
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
    <Toaster />
  </React.StrictMode>
);
