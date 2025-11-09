import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

// Importar los datos y componentes
import productsData from '../data/productos.json';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // 1. Lee el parámetro "q" de la URL (ej. /search?q=catan)
  const query = searchParams.get('q') || '';

  const filteredProducts: Product[] = useMemo(() => {
    const allProducts = productsData as Product[];
    const queryLower = query.toLowerCase();

    if (!query) {
      return []; // No mostrar nada si la búsqueda está vacía
    }

    // 2. Filtra por nombre O descripción
    return allProducts.filter(product => {
      const nameMatch = product.nombre.toLowerCase().includes(queryLower);
      const descMatch = product.descripcion.toLowerCase().includes(queryLower);
      return nameMatch || descMatch;
    });

  }, [query]); // Se recalcula solo si la 'query' cambia

  return (
    <div>
      <h2 className="mb-4">Resultados para: "{query}"</h2>

      {/* 3. Muestra la grilla de resultados */}
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
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      )}
    </div>
  );
};

export default SearchPage;