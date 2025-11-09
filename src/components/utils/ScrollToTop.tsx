import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // 1. Obtiene el 'pathname' (ej. "/", "/category", "/product/JM001")
  const { pathname } = useLocation();

  // 2. Ejecuta este efecto CADA VEZ que el 'pathname' cambie
  useEffect(() => {
    // 3. Sube el scroll de la ventana al tope (x: 0, y: 0)
    window.scrollTo(0, 0);
  }, [pathname]); // El array de dependencias asegura que esto se ejecute en cada cambio de URL

  // 4. Este componente no renderiza nada, solo ejecuta el efecto
  return null;
};

export default ScrollToTop;