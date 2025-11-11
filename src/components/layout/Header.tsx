import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, ListGroup, Collapse } from 'react-bootstrap';

import productsData from '../../data/productos.json';
import { Product } from '../../types';

import './Header.css';
import MegaMenu from './header/MegaMenu';
import HeaderDesktop from './header/HeaderDesktop';
import HeaderMobile from './header/HeaderMobile';
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



export default Header;