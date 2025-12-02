import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Product } from 'types';
import MegaMenu from 'components/layout/header/MegaMenu';
import { useCart } from 'context/CartContext';
import { useAuth } from 'hooks/useAuth';

// Función de formato de precio
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(price);
};

interface HeaderDesktopProps {
    searchTerm: string;
    results: Product[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchBlur: () => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onResultClick: () => void;
}

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
    searchTerm,
    results,
    onSearchChange,
    onSearchBlur,
    onSearchSubmit,
    onResultClick,
}) => {
    const { cartItems, openCart } = useCart();
    const { user, logout } = useAuth();
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Navbar variant="dark" className="py-3 custom-navbar d-none d-lg-block">
            <Container fluid="xl" className="d-flex justify-content-between align-items-center">

                {/* Logo y Menú Desktop */}
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/">
                        <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654178/Icono_Level_UP_Header_slxfdo.png" alt="Icono-Level-UP-Header" style={{ height: '40px' }} />
                    </Navbar.Brand>
                    <MegaMenu />
                </div>

                {/* Búsqueda Desktop */}
                <div className="search-form-container d-none d-lg-flex mx-4">
                    <Form className="w-100" onSubmit={onSearchSubmit}>
                        <InputGroup className="custom-search-bar">
                            <Form.Control
                                type="text"
                                placeholder="🔎 Buscar Producto..."
                                value={searchTerm}
                                onChange={onSearchChange}
                                onBlur={onSearchBlur}
                            />
                        </InputGroup>
                    </Form>
                    {results.length > 0 && (
                        <ListGroup className="search-results-dropdown">
                            {results.map((product) => (
                                <ListGroup.Item key={product.codigo} as={Link} to={`/product/${product.codigo}`} onClick={onResultClick} className="search-result-item">
                                    <img src={product.imagen} alt={product.nombre} />
                                    <div className="info">
                                        <div className="name">{product.nombre}</div>
                                        <div className="price">{formatPrice(product.precio)}</div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>

                {/* Acciones Desktop */}
                <Nav className="d-flex align-items-center flex-row">
                    {user ? (
                        <Nav className="d-flex align-items-center me-3 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                            <div>
                                <p className="m-0 small">Hola, {user.nombre}</p>
                                <Link to="/" onClick={logout} className="small text-danger" style={{textDecoration: 'none'}}><b>Cerrar Sesión</b></Link>
                            </div>
                        </Nav>
                    ) : (
                        <Nav.Link as={Link} to="/login" className="d-flex align-items-center me-3 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                            <div><p className="m-0 small">Hola!</p><p className="m-0 small"><b>Inicia sesión</b></p></div>
                        </Nav.Link>
                    )}
                    <div className="vr mx-3 d-none d-lg-block "></div>
                    <Nav.Link onClick={openCart} className="position-relative text-white" style={{ cursor: 'pointer' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></svg>
                        {cartItemCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartItemCount}
                            </span>
                        )}
                    </Nav.Link>

                    {/* Botón para Admin */}
                    {user && user.role === 'ADMIN' && (
                        <Nav.Link as={Link} to="/admin" className="text-white ms-3">
                            <b>Panel de Admin</b>
                        </Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default HeaderDesktop;