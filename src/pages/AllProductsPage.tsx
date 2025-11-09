import React from 'react';
import { Row, Col } from 'react-bootstrap';

// Importar los datos y componentes
import productsData from '../data/productos.json';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';

const AllProductsPage: React.FC = () => {
  // 1. Simplemente cargamos todos los productos
  const allProducts: Product[] = productsData as Product[];

  return (
    <div>
      <h2 className="mb-4">Todos Nuestros Productos</h2>

      {/* 2. Mostrar todos los productos en una grilla */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {allProducts.map((product) => (
          <Col key={product.codigo}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AllProductsPage;