import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, ListGroup, Collapse } from 'react-bootstrap';
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

interface HeaderMobileProps {
    searchTerm: string;
    results: Product[];
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchBlur: () => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onResultClick: () => void;
    onToggleMenu: (isExpanded: boolean) => void;
    onToggleSearch: () => void;
    onCloseMenus: () => void;
    onLinkClick: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
    searchTerm,
    results,
    isMobileMenuOpen,
    isSearchOpen,
    onSearchChange,
    onSearchBlur,
    onSearchSubmit,
    onResultClick,
    onToggleMenu,
    onToggleSearch,
    onCloseMenus,
    onLinkClick,
}) => {
    const { cartItems, openCart } = useCart();
    const { user, logout } = useAuth();
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Navbar
            variant="dark"
            expand={false}
            className="py-3 custom-navbar d-lg-none"
            expanded={isMobileMenuOpen}
            onToggle={onToggleMenu}
        >
            <Container fluid="xl">
                <div className="d-flex justify-content-between align-items-center w-100">

                    {/* LADO IZQUIERDO: Logo y Menú */}
                    <div className="d-flex align-items-center">
                        <Navbar.Brand as={Link} to="/">
                            <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654178/Icono_Level_UP_Header_slxfdo.png" alt="Icono-Level-UP-Header" style={{ height: '30px' }} />
                        </Navbar.Brand>
                        <Navbar.Toggle
                            aria-controls="mobile-menu-nav"
                            className="icon-button ms-2"
                        />
                    </div>

                    {/* LADO DERECHO: Iconos */}
                    <Nav className="d-flex flex-row align-items-center">
                        <button
                            className="icon-button me-2"
                            onClick={onToggleSearch}
                            aria-controls="mobile-search-nav"
                            aria-expanded={isSearchOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                        {user && user.role === 'ADMIN' && (
                            <Nav.Link as={Link} to="/admin" onClick={onCloseMenus} className="icon-button me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </Nav.Link>
                        )}
                        {user ? (
                            <Nav.Link as={Link} to="/" onClick={logout} className="icon-button me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login" onClick={onCloseMenus} className="icon-button me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                            </Nav.Link>
                        )}
                        <Nav.Link
                            onClick={() => {
                                openCart();
                                onCloseMenus();
                            }}
                            className="position-relative icon-button me-2"
                            style={{ cursor: 'pointer' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></svg>
                            {cartItemCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartItemCount}
                                </span>
                            )}
                        </Nav.Link>
                    </Nav>
                </div>

                {/* --- Paneles Colapsables (Móvil) --- */}
                <Collapse in={isSearchOpen}>
                    <div className="search-form-container mt-3" id="mobile-search-nav">
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
                </Collapse>
                <Navbar.Collapse id="mobile-menu-nav">
                    <div className="mt-3">
                        <MegaMenu onLinkClick={onCloseMenus} />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HeaderMobile;