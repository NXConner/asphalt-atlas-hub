import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initSentry } from './lib/sentry'
import './index.css'

// Initialize error monitoring
initSentry()

createRoot(document.getElementById("root")!).render(<App />);
