import React, { useState } from 'react';

import './Header.css';
import HeaderDesktop from 'components/layout/header/HeaderDesktop';
import HeaderMobile from 'components/layout/header/HeaderMobile';
import useWindowSize from 'hooks/useWindowSize';
import { useProductSearch } from 'hooks/useProductSearch';

// Definir el punto de quiebre
const MOBILE_BREAKPOINT = 992; // lg

const Header: React.FC = () => {
  // --- Lógica ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { width = 0 } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;
  
  const search = useProductSearch();

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

  // --- Props para los sub-componentes ---
  const searchProps = {
    searchTerm: search.searchTerm,
    results: search.results,
    onSearchChange: search.handleSearchChange,
    onSearchBlur: search.handleSearchBlur,
    onSearchSubmit: search.handleSearchSubmit,
    onResultClick: search.handleResultClick,
  };

  const mobileProps = {
    isMobileMenuOpen,
    isSearchOpen,
    onToggleMenu: handleToggleMenu,
    onToggleSearch: handleToggleSearch,
    onCloseMenus: handleCloseMenus,
    onLinkClick: handleCloseMenus
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
          <HeaderMobile {...searchProps} {...mobileProps} />
        ) : (
          <HeaderDesktop {...searchProps} />
        )}
      </div>
    </header>
  );
};

export default Header;