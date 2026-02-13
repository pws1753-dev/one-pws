import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TemplateProvider } from './context/TemplateContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemplateProvider>
      <App />
    </TemplateProvider>
  </StrictMode>
);
