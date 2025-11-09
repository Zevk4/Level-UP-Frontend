import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image, Button } from 'react-bootstrap';

// Importar datos y tipos
import productsData from '../data/productos.json';
import { Product } from '../types';

// Función helper para formatear el precio (la misma de ProductCard)
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(price);
};

const ProductDetailPage: React.FC = () => {
    // 1. Leer el 'codigo' de la URL (ej. "AC001")
    const { codigo } = useParams<{ codigo: string }>();

    // 2. Encontrar el producto que coincide con el código
    const product: Product | undefined = useMemo(() => {
        const allProducts = productsData as Product[];
        return allProducts.find(p => p.codigo === codigo);
    }, [codigo]); // Se recalcula solo si el 'codigo' de la URL cambia

    // 3. Manejar el caso de que el producto no se encuentre
    if (!product) {
        return (
            <div>
                <h2 className="text-danger">Producto no encontrado</h2>
                <p>No pudimos encontrar un producto con el código "{codigo}".</p>
            </div>
        );
    }

    // 4. Renderizar la página de detalle
    return (
        <Row className="g-5"> {/* 'g-5' añade un buen espacio entre columnas */}

            {/* Columna de la Imagen */}
            <Col md={6}>
                <Image
                    src={product.imagen}
                    alt={product.nombre}
                    fluid // Hace la imagen responsiva
                    style={{
                        backgroundColor: '#FFF',
                        borderRadius: '8px',
                        padding: '10px'
                    }}
                />
            </Col>

            {/* Columna de la Información */}
            <Col md={6}>
                {/* Título */}
                <h1 className="display-5 fw-bold">{product.nombre}</h1>

                {/* Precio (usando tu color verde neón) */}
                <p
                    className="h2 my-3"
                    style={{ color: 'var(--color-secundario)', fontWeight: 'bold' }}
                >
                    {formatPrice(product.precio)}
                </p>

                {/* Botón de Agregar */}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-100 my-3"
                    style={{
                        backgroundColor: 'var(--color-principal)',
                        borderColor: 'var(--color-principal)',
                        fontWeight: 'bold'
                    }}
                >
                    Agregar al Carrito
                </Button>

                {/* Descripción */}
                <h3 className="mt-4">Descripción</h3>
                <p style={{ color: 'var(--color-texto)', fontSize: '1.1rem' }}>
                    {product.descripcion}
                </p>
            </Col>
        </Row>
    );
};

export default ProductDetailPage;