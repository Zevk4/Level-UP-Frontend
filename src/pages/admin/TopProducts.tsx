import React, { useMemo } from 'react';
// Usamos la ruta relativa que funcionó para ProductForm: ../../
import { Product } from 'types'; 

// 1. Definimos los props que este componente recibirá de AdminPage
interface TopProductsProps {
  products: Product[];
}

const TopProducts: React.FC<TopProductsProps> = ({ products }) => {

  // 2. Usamos useMemo para recalcular esta lista solo si 'products' cambia
  // Esta es la misma lógica de .sort().slice() de tu admin.js [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/js/admin.js]
  const top = useMemo(() => {
    return [...products]
      .sort((a, b) => b.precio - a.precio) // Ordena por precio (más caro primero)
      .slice(0, 5); // Toma los 5 primeros
  }, [products]); // La dependencia [products] es la clave

  // 3. Función para resolver la ruta de imagen (igual que en admin.js)
  const getImageUrl = (imagen: string) => {
    // Si es una Data URL (de la vista previa) o una URL http, úsala directamente
    if (imagen.startsWith('data:') || imagen.startsWith('http')) {
      return imagen;
    }
    
    // Si no, asumimos que es un archivo local de productos.json
    // En React, la ruta pública debe ser absoluta desde la raíz /
    // Asumiendo que tus imágenes de producto están en 'public/assets/img/product/'
    return `/assets/img/product/${imagen}`; 
  };

  return (
    // 4. Renderizamos el HTML de la barra lateral de index_admin.html [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/admin/index_admin.html]
    <div className="w-full h-full bg-gray-800 rounded-lg shadow p-4 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Productos Más Caros</h2>
      <ul className="space-y-3">
        {top.map(prod => (
          <li key={prod.codigo} className="flex items-center gap-3 bg-gray-700 p-3 rounded justify-center">
            <img
              src={getImageUrl(prod.imagen)}
              alt={prod.nombre}
              className="w-14 h-14 object-cover rounded"
            />
            {/* Usamos .toLocaleString() para formatear el precio */}
            <div className="text-center">
              <div>{prod.nombre} - ${prod.precio.toLocaleString()}</div>
              <div className="text-gray-400">Cod: {prod.codigo}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts; 