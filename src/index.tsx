import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Importa el CSS global de Bootstrap (¡Muy importante!)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. ¡AÑADE ESTA LÍNEA!
import 'leaflet/dist/leaflet.css';

// 2. Importa tus estilos globales personalizados (si los tienes)
import './index.css';

import './style.css';
// 3. Importa el componente App principal
import App from './App';

// 4. Código estándar de React para iniciar la app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);