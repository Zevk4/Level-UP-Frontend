import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// 1. Importar los datos y los componentes
import { useProducts } from 'context/ProductContext'; // Usar el contexto
import ProductCard from 'components/product/ProductCard';
import { Product } from 'types'; // Importa el tipo

// 1. Importa el archivo CSS
import './MostViewedProducts.css';
// 2. Función para agrupar productos en "diapositivas"
// (Ej. 4 productos por slide en desktop)
const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const MostViewedProducts: React.FC = () => {
  // 3. Obtener productos desde el contexto
  const { products } = useProducts();
  // Agrupamos el JSON en arrays de 4 productos cada uno
  // [[p1, p2, p3, p4], [p5, p6, p7, p8], [p9, p10]]
  const productSlides = chunkArray(products, 4);
  return (
    <section id="mas-visto" className="mas-visto mb-5">
      {/* Encabezado de la sección */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><b>Lo más visto</b></h3>
        <Link className="mv-more" to="/products">Ver más</Link>
      </div>
      {/* 4. Carrusel de React Bootstrap */}
      <Carousel indicators={true} interval={null} variant="dark">
        {productSlides.map((slide, index) => (
          // Cada <Carousel.Item> es una diapositiv
          <Carousel.Item key={index}>
            <Row>
              {slide.map((product) => (
                // Cada Col es un producto dentro de la diapositiva
                // 'md={3}' significa 4 columnas en 'md' y superior
                // 'xs={6}' significa 2 columnas en móvil
                <Col xs={6} md={3} key={product.codigo} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default MostViewedProducts;