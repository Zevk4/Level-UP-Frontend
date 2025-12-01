import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';

import { useProducts } from 'context/ProductContext';
import { Product } from 'types';

// 1. Importar el hook 'useCart'
import { useCart } from 'context/CartContext';

// Función helper para formatear el precio
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(price);
};

const ProductDetailPage: React.FC = () => {
    const { codigo } = useParams<{ codigo: string }>();

    // 2. Obtener la función 'addToCart' del contexto
    const { addToCart } = useCart();

    // Acceder a los productos desde el contexto
    const { products } = useProducts();

    // Encontrar el producto
    const product: Product | undefined = useMemo(() => {
        return products.find(p => p.codigo === codigo);
    }, [codigo, products]);

    // Manejar el caso de que el producto no se encuentre (sin cambios)
    if (!product) {
        return (
            <div>
                <h2 className="text-danger">Producto no encontrado</h2>
                <p>No pudimos encontrar un producto con el código "{codigo}".</p>
            </div>
        );
    }

    // Renderizar la página de detalle
    return (
        <Row className="g-5">

            {/* Columna de la Imagen */}
            <Col md={6}>
                <Image
                    src={product.imagen}
                    alt={product.nombre}
                    fluid
                    style={{
                        backgroundColor: '#FFF',
                        borderRadius: '8px',
                        padding: '10px'
                    }}
                />
            </Col>

            {/* Columna de la Información */}
            <Col md={6}>
                <h1 className="display-5 fw-bold">{product.nombre}</h1>

                <p
                    className="h2 my-3"
                    style={{ color: 'var(--color-secundario)', fontWeight: 'bold' }}
                >
                    {formatPrice(product.precio)}
                </p>

                {/* 3. AÑADIR 'onClick' AL BOTÓN */}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-100 my-3"
                    style={{
                        backgroundColor: 'var(--color-principal)',
                        borderColor: 'var(--color-principal)',
                        fontWeight: 'bold'
                    }}
                    onClick={() => addToCart(product)} // ¡AQUÍ ESTÁ LA MAGIA!
                >
                    Agregar al Carrito
                </Button>

                <h3 className="mt-4">Descripción</h3>
                <p style={{ color: 'var(--color-texto)', fontSize: '1.1rem' }}>
                    {product.descripcion}
                </p>
            </Col>
        </Row>
    );
};

export default ProductDetailPage;