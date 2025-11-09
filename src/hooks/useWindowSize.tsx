import { useState, useEffect } from 'react';

// Define la forma del objeto que devolverá el hook
interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = (): WindowSize => {
  // Inicializa el estado con un ancho y alto de 'undefined'
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Esta función se ejecutará cada vez que la ventana cambie de tamaño
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Añade el "listener" (oyente) de eventos
    window.addEventListener('resize', handleResize);
    
    // Llama a la función una vez al inicio para obtener el tamaño inicial
    handleResize();
    
    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => window.removeEventListener('resize', handleResize);
  }, []); // El array vacío asegura que esto solo se ejecute al montar/desmontar

  return windowSize;
};

export default useWindowSize;