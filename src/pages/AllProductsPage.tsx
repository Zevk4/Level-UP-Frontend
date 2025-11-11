import React from 'react';
import { Row, Col } from 'react-bootstrap';

// Importar los datos y componentes
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const AllProductsPage: React.FC = () => {
  // 1. Usar el contexto para obtener todos los productos (incluyendo los agregados dinámicamente)
  const { products } = useProducts();

  return (
    <div>
      <h2 className="mb-4">Todos Nuestros Productos</h2>

      {/* 2. Mostrar todos los productos en una grilla */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.codigo}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllProductsPage;