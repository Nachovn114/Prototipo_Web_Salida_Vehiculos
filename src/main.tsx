import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/custom.css'
import './lib/i18n'

createRoot(document.getElementById("root")!).render(<App />);
