import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from 'types';
import './ProductCard.css';

// 1. Importar el hook 'useCart'
import { useCart } from 'context/CartContext';

// Definición del tipo
interface ProductCardProps {
  product: Product;
}

// Función formatPrice (sin cambios)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // 2. Obtener la función 'addToCart' del contexto
  const { addToCart } = useCart();

  const { codigo, imagen, nombre, precio, descripcion } = product;
  const imageUrl = imagen;

  return (
    <Card className="h-100 shadow-sm border-0 product-card-custom">

      <Link to={`/product/${codigo}`} style={{ textDecoration: 'none' }}>
        <Card.Img
          variant="top"
          src={imageUrl} // La URL completa se usa aquí
          alt={nombre}
          style={{
            height: '200px',
            objectFit: 'contain',
            padding: '10px',
            backgroundColor: '#FFF' /* Fondo blanco para las imágenes */
          }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Title as="h5" className="fs-6 product-title-truncate">
          <Link to={`/product/${codigo}`} style={{ textDecoration: 'none' }}>
            {nombre}
          </Link>
        </Card.Title>

        <Card.Text className="small flex-grow-1 product-description-truncate">
          {descripcion}
        </Card.Text>

        <div className="mt-auto">
          <Card.Text className="h4 fw-bold product-price my-2">
            {formatPrice(precio)}
          </Card.Text>

          {/* 3. Añadir el 'onClick' al botón */}
          <Button
            variant="primary"
            className="w-100"
            onClick={() => addToCart(product)} // ¡AQUÍ ESTÁ LA MAGIA!
          >
            Agregar al Carrito
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;