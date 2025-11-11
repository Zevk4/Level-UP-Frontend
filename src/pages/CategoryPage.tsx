import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

// Importar los datos y componentes
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const CategoryPage: React.FC = () => {
  // 1. Hook para leer los parámetros de la URL
  // Ej: /category?cat=Consolas&sub=PlayStation
  const [searchParams] = useSearchParams();

  const category = searchParams.get('cat');
  const subcategory = searchParams.get('sub');

  // Acceder a los productos desde el contexto
  const { products } = useProducts();

  // 2. Filtrar los productos usando 'useMemo'
  // 'useMemo' evita que el filtro se recalcule en cada renderizado
  const filteredProducts: Product[] = useMemo(() => {
    // Si no hay filtros, no mostrar nada (o podrías mostrar todo)
    if (!category && !subcategory) {
      // Por ahora, devolvemos un array vacío si no hay filtro
      // Opcionalmente: return products;
      return [];
    }

    return products.filter(product => {
      // Filtro por Subcategoría (es más específico)
      if (subcategory) {
        // Comparamos la subcategoría del producto con la de la URL
        // Usamos 'decodeURIComponent' por si la URL tiene 'Xbox%20Series'
        return product.subcategoria.toLowerCase() === decodeURIComponent(subcategory).toLowerCase();
      }

      // Filtro por Categoría principal
      if (category) {
        return product.categoria.toLowerCase() === decodeURIComponent(category).toLowerCase();
      }

      return false;
    });

  }, [category, subcategory, products]); // El filtro se recalcula SOLO si 'category', 'subcategory' o 'products' cambian

  // 3. Determinar el título de la página
  const title = subcategory ? decodeURIComponent(subcategory) : (category ? decodeURIComponent(category) : "Categorías");

  return (
    <div>
      <h2 className="mb-4">{title}</h2>

      {/* 4. Mostrar los productos en una grilla */}
      {filteredProducts.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.codigo}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted">
          No se encontraron productos para esta categoría.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;