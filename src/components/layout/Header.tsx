import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, ListGroup, Collapse } from 'react-bootstrap';

import productsData from '../../data/productos.json';
import { Product } from '../../types';

import './Header.css';
import MegaMenu from './header/MegaMenu';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

const Header: React.FC = () => {
  // --- Estados y Lógica (Sin cambios) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();
  const allProducts = productsData as Product[];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  return (
    <header>
      {/* Aviso Superior (Siempre visible) */}
      <div className="bg-dark text-white text-center py-1">
        <p className="m-0 small">
          ¡Atención! Descuento 20% con correo DuocUC DE POR VIDA!!
        </p>
      </div>

      {/* ======================================= */}
      {/* 1. VISTA DESKTOP (lg y superior)      */}
      {/* (Oculto en móvil)                     */}
      {/* ======================================= */}
      <Navbar variant="dark" className="py-3 custom-navbar d-none d-lg-block">
        <Container fluid="xl" className="d-flex justify-content-between align-items-center">

          {/* Logo y Menú Desktop */}
          <div className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/">
              <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654178/Icono_Level_UP_Header_slxfdo.png" alt="Icono-Level-UP-Header" style={{ height: '40px' }} />
            </Navbar.Brand>
            {/* El MegaMenu de Desktop con botón y panel flotante */}
            <MegaMenu />
          </div>

          {/* Búsqueda Desktop */}
          <div className="search-form-container d-none d-lg-flex mx-4">
            <Form className="w-100" onSubmit={handleSearchSubmit}>
              <InputGroup className="custom-search-bar">
                <Form.Control type="text" placeholder="🔎 Buscar Producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onBlur={() => setTimeout(() => setResults([]), 200)} />
              </InputGroup>
            </Form>
            {results.length > 0 && (
              <ListGroup className="search-results-dropdown">
                {results.map((product) => (
                  <ListGroup.Item key={product.codigo} as={Link} to={`/product/${product.codigo}`} onClick={handleResultClick} className="search-result-item">
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
            <Nav.Link as={Link} to="/auth" className="d-flex align-items-center me-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
              <div><p className="m-0 small">Hola!</p><p className="m-0 small"><b>Inicia sesión</b></p></div>
            </Nav.Link>
            <div className="vr mx-3 d-none d-lg-block "></div>
            <Nav.Link as={Link} to="/cart" className="position-relative text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></svg>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* ======================================= */}
      {/* 2. VISTA MÓVIL (md e inferior)        */}
      {/* (Oculto en desktop)                   */}
      {/* ======================================= */}
      <Navbar
        variant="dark"
        expand={false}
        className="py-3 custom-navbar d-lg-none"
        expanded={isMobileMenuOpen}
        onToggle={(isExpanded) => {
          setIsMobileMenuOpen(isExpanded);
          if (isExpanded) {
            setIsSearchOpen(false);
          }
        }}
      >
        <Container fluid="xl">
          <div className="d-flex justify-content-between align-items-center w-100">

            {/* LADO IZQUIERDO: Logo y Menú */}
            <div className="d-flex align-items-center">
              <Navbar.Brand as={Link} to="/">
                <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654178/Icono_Level_UP_Header_slxfdo.png" alt="Icono-Level-UP-Header" style={{ height: '30px' }} />
              </Navbar.Brand>

              {/* Icono de Menú (Categorías) */}
              <Navbar.Toggle
                aria-controls="mobile-menu-nav"
                className="icon-button ms-2"
              />
            </div>

            {/* LADO DERECHO: Iconos */}
            <Nav className="d-flex flex-row align-items-center">

              {/* Icono de Búsqueda (botón) */}
              <button
                className="icon-button me-2"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMobileMenuOpen(false);
                }}
                aria-controls="mobile-search-nav"
                aria-expanded={isSearchOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Icono de Usuario */}
              <Nav.Link as={Link} to="/auth" className="icon-button me-2" onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></svg>
              </Nav.Link>

              {/* Icono de Carrito */}
              <Nav.Link as={Link} to="/cart" className="position-relative icon-button me-2" onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></svg>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
              </Nav.Link>
            </Nav>

          </div>

          {/* --- Paneles Colapsables (Móvil) --- */}

          {/* Colapso para BÚSQUEDA (controlado por 'isSearchOpen') */}
          <Collapse in={isSearchOpen}>
            <div className="search-form-container mt-3" id="mobile-search-nav">
              <Form className="w-100" onSubmit={handleSearchSubmit}>
                <InputGroup className="custom-search-bar">
                  <Form.Control
                    type="text"
                    placeholder="🔎 Buscar Producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => setTimeout(() => setResults([]), 200)}
                  />
                </InputGroup>
              </Form>
              {results.length > 0 && (
                <ListGroup className="search-results-dropdown">
                  {results.map((product) => (
                    <ListGroup.Item key={product.codigo} as={Link} to={`/product/${product.codigo}`} onClick={handleResultClick} className="search-result-item">
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

          {/* Colapso para MENÚ (controlado por 'expanded' en la Navbar) */}
          <Navbar.Collapse id="mobile-menu-nav">
            <div className="mt-3">
              <MegaMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;