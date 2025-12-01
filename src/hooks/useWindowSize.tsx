import { useState, useEffect } from 'react';

// Define la forma del objeto que devolverá el hook
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Función de debounce para retrasar la ejecución de una función
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
}


const useWindowSize = (): WindowSize => {
  // Inicializa el estado con el tamaño actual de la ventana
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Esta función se ejecutará cada vez que la ventana cambie de tamaño
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Crea una versión "debounced" del handler
    const debouncedHandleResize = debounce(handleResize, 200);

    // Añade el "listener" (oyente) de eventos
    window.addEventListener('resize', debouncedHandleResize);
    
    // Función de limpieza: se ejecuta cuando el componente se desmonta
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []); // El array vacío asegura que esto solo se ejecute al montar/desmontar

  return windowSize;
};

export default useWindowSize;