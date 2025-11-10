import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, ListGroup, Collapse } from 'react-bootstrap';

import productsData from '../../data/productos.json';
import { Product } from '../../types';

import './Header.css';
import MegaMenu from './header/MegaMenu';
import { useCart } from '../../context/CartContext';
import useWindowSize from '../../hooks/useWindowSize';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../hooks/useAuth';

// Definir el punto de quiebre
const MOBILE_BREAKPOINT = 992; // lg

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

const Header: React.FC = () => {
  // --- Lógica ---
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();
  const allProducts = productsData as Product[];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems, openCart } = useCart();
  const { openLoginModal } = useModal();
  const { user, logout } = useAuth();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { width } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = allProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm, allProducts]);

  const handleResultClick = () => {
    setSearchTerm('');
    setResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setResults([]);
    }
  };

  // --- Lógica de Menús Móviles ---
  const handleToggleMenu = (isExpanded: boolean) => {
    setIsMobileMenuOpen(isExpanded);
    if (isExpanded) setIsSearchOpen(false);
  };
  const handleToggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
  };
  const handleCloseMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- Props para los sub-componentes ---
  const commonProps = {
    searchTerm,
    results,
    cartItemCount,
    user,
    logout,
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    onSearchBlur: () => setTimeout(() => setResults([]), 200),
    onSearchSubmit: handleSearchSubmit,
    onResultClick: handleResultClick,
    onOpenCart: openCart,
    onOpenLoginModal: openLoginModal,
  };
  const mobileProps = {
    isMobileMenuOpen,
    isSearchOpen,
    onToggleMenu: handleToggleMenu,
    onToggleSearch: handleToggleSearch,
    onCloseMenus: handleCloseMenus,
  };

  return (
    <header>
      {/* 1. Aviso Superior (Se oculta con el scroll) */}
      <div className="bg-dark text-white text-center py-1">
        <p className="m-0 small">
          ¡Atención! Descuento 20% con correo DuocUC DE POR VIDA!!
        </p>
      </div>

      {/* 2. ¡NUEVO CONTENEDOR! Este div se hará "sticky" */}
      <div className="sticky-header-bar">
        {isMobile ? (
          <HeaderMobile {...commonProps} {...mobileProps} onLinkClick={handleCloseMobileMenu} />
        ) : (
          <HeaderDesktop {...commonProps} />
        )}
      </div>
    </header>
  );
};

// --- Componentes Separados ---

// Props de Desktop
interface HeaderDesktopProps {
  searchTerm: string;
  results: Product[];
  cartItemCount: number;
  user: any;
  logout: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchBlur: () => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onResultClick: () => void;
  onOpenCart: () => void;
  onOpenLoginModal: () => void;
}

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
  searchTerm, results, cartItemCount, user, logout,
  onSearchChange, onSearchBlur, onSearchSubmit, onResultClick, onOpenCart, onOpenLoginModal
}) => {
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
              <Form.Control type="text" placeholder="🔎 Buscar Producto..." value={searchTerm} onChange={onSearchChange} onBlur={onSearchBlur} />
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
                <Nav.Link onClick={onOpenLoginModal} className="d-flex align-items-center me-3 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                    <div><p className="m-0 small">Hola!</p><p className="m-0 small"><b>Inicia sesión</b></p></div>
                </Nav.Link>
              )}
          <div className="vr mx-3 d-none d-lg-block "></div>
          <Nav.Link onClick={onOpenCart} className="position-relative text-white" style={{ cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></svg>
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

// Props de Móvil
interface HeaderMobileProps extends HeaderDesktopProps {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  onToggleMenu: (isExpanded: boolean) => void;
  onToggleSearch: () => void;
  onCloseMenus: () => void;
  onLinkClick: () => void; // Prop para cerrar el menú
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  searchTerm, results, cartItemCount, user, logout, isMobileMenuOpen, isSearchOpen,
  onSearchChange, onSearchBlur, onSearchSubmit, onResultClick, onOpenCart, onOpenLoginModal,
  onToggleMenu, onToggleSearch, onCloseMenus, onLinkClick
}) => {
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
            {user ? (
              <Nav className="d-flex align-items-center me-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                  <div>
                      <p className="m-0 small">Hola, {user.nombre}</p>
                      <Link to="/" onClick={logout} className="small text-danger" style={{textDecoration: 'none'}}><b>Cerrar Sesión</b></Link>
                  </div>
              </Nav>
            ) : (
              <Nav.Link onClick={onOpenLoginModal} className="d-flex align-items-center me-3 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
                  <div><p className="m-0 small">Hola!</p><p className="m-0 small"><b>Inicia sesión</b></p></div>
              </Nav.Link>
            )}
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
            <Nav.Link
              onClick={() => {
                onOpenCart();
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
            <MegaMenu onLinkClick={onLinkClick} />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;