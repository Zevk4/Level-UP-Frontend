import React from 'react';

// Importar los componentes de la página de inicio
import Reviews from 'components/home/Reviews'; // 1. Importar Reviews
import MostViewedProducts from 'components/home/MostViewedProducts';
import PopularCategories from 'components/home/PopularCategories';

const HomePage: React.FC = () => {
  return (
    <>
      {/* ===== Sección 1: Nuevas Reviews (Refactorizada) ===== */}
      <Reviews /> {/* 2. Reemplazar el JSX por el componente */}

      {/* ===== Sección 2: Lo más visto (Dinámica) ===== */}
      <MostViewedProducts /> 

      {/* ===== Sección 3: Categorías populares (Refactorizada) ===== */}
      <PopularCategories />
    </>
  );
};

export default HomePage;