import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './Footer.css';

// Usamos el enlace directo de Cloudinary para el ícono.
const customMapIcon = L.icon({
  iconUrl: 'https://res.cloudinary.com/dinov1bgq/image/upload/v1762654178/Icon_Level_UP_Basico_sahywy.png',
  iconSize: [38, 38], 
  iconAnchor: [19, 38], 
  popupAnchor: [0, -38] 
});

const Footer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Evita que el mapa se reinicie si el componente se vuelve a renderizar
    if (mapRef.current && !mapInstanceRef.current) {
      
      mapInstanceRef.current = L.map(mapRef.current).setView([-36.82, -73.05], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // --- MARCADORES ---

      // 1. Marcador Principal (Tu tienda)
      L.marker([-36.82, -73.05], { icon: customMapIcon }) 
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>¡Level-Up Gamer!</b><br>Tienda Principal.')
        .openPopup();

      // 2. Marcador de Evento 1 (Ej. Talcahuano)
      L.marker([-36.725, -73.11], { icon: customMapIcon }) 
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Evento: Torneo Shooters</b><br>Gimnasio La Tortuga.');

      // 3. Marcador de Evento 2 (Ej. San Pedro)
      L.marker([-36.83, -73.10], { icon: customMapIcon }) 
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Evento: Noche de Boardgames</b><br>Centro Comunitario San Pedro.');
        
      // 4. Marcador de Evento 3 (Ej. Hualpén)
      L.marker([-36.79, -73.11], { icon: customMapIcon }) 
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Evento: Feria Retro</b><br>Plaza de Hualpén.');
    }
  }, []); // El array vacío asegura que esto solo se ejecute una vez

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="footer-content-wrapper">
        <Row className="gy-4">
          
          {/* Columna Izquierda: Mapa */}
          <Col md={6}>
            <h3 className="h4 text-uppercase fw-bold">EVENTOS EN LA REGIÓN</h3>
            <div className="map-container">
              <div ref={mapRef} id="footerMap" />
            </div>
          </Col>

          {/* Columna Derecha: Redes Sociales (con los SVGs) */}
          <Col md={6} className="text-center">
            <h3 className="h4 text-uppercase fw-bold">SÍGUENOS</h3>
            <p>¡Mantente conectado con nuestras redes!</p>
            <div className="social-links">
              {/* ... (Tus SVGs para Facebook, Instagram, LinkedIn, X, YouTube) ... */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                </svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.556 0 5.829 0 8s.01 2.444.048 3.297c.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372.526-.205.972-.478 1.417-.923.445-.444.719-.89.923-1.416.198-.51.333-1.09.372-1.942C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.04-.852-.174-1.433-.372-1.942a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.09-.333-1.942-.372C10.444.01 10.171 0 8 0m0 2.163c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.389-.009-3.232-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.598-.92c-.11-.281-.24-.705-.276-1.486-.038-.843-.047-1.096-.047-3.232s.009-2.389.047-3.232c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.281-.11.705-.24 1.485-.276.843-.038 1.096.047 3.232.047M8 3.882a4.118 4.118 0 1 0 0 8.236 4.118 4.118 0 0 0 0-8.236M8 10.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4m3.496-6.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0"/>
                </svg>
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999c.662 0 1.25.064 1.83.187C11.666 2.388 12.38 3.102 12.63 4.297c.244 1.14.364 2.51.364 4.11s-.12 2.97-.364 4.109c-.25 1.196-.964 1.91-2.185 2.146C10.036 14.896 9.03 15 8.05 15s-2.005-.104-3.37-.346C3.456 14.406 2.74 13.692 2.49 12.5c-.24-1.139-.36-2.509-.36-4.11s.12-2.97.36-4.109C2.74 3.102 3.456 2.388 4.676 2.146C5.896 1.903 6.9 1.899 8.05 1.999M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M6.468 4.156v7.687L11.02 8z"/>
                </svg>
              </a>
            </div>
          </Col>

        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col className="text-center">
            <p>&copy; 2025 Level-Up Gamer. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;