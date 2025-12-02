import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MegaMenu.css';
import { Category } from 'types';
import useWindowSize from 'hooks/useWindowSize';
import { useCategories } from '../../../context/CategoryContext';

const MOBILE_BREAKPOINT = 992; // lg

// Componente interno CategoryList (sin cambios)
const CategoryList: React.FC<{ categories: Category[]; onLinkClick: () => void }> = ({ categories, onLinkClick }) => {
  const { width = 0 } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

  // Check if categories is empty or null, handle accordingly
  if (!categories || categories.length === 0) {
    return <div className="menu-column">No categories available.</div>;
  }

  const itemsPerColumn = Math.ceil(categories.length / 3);
  const columns: Category[][] = [
    categories.slice(0, itemsPerColumn),
    categories.slice(itemsPerColumn, itemsPerColumn * 2),
    categories.slice(itemsPerColumn * 2),
  ];

  if (isMobile) {
    // === VISTA MÓVIL ===
    return (
      <div className="menu-column">
        {categories.map((cat) => (
          <div key={cat.title}>
            <Link to={cat.link} className="category-title" onClick={onLinkClick}>
              {cat.title}
            </Link>
            <ul>
              {cat.subcategories.map((sub) => (
                                  <li key={sub.name}>
                                    <Link to={sub.link} onClick={onLinkClick}>{sub.name}</Link>
                                  </li>              ))}
            </ul>
          </div>
        ))}
        <hr style={{ borderColor: '#333' }} />
        <Link to="/products" className="view-all-link" onClick={onLinkClick}>
          Ver Todos los Productos
        </Link>
      </div>
    );
  }

  // === VISTA DESKTOP ===
  return (
    <>
      {columns.map((column, colIndex) => (
        <div className="menu-column" key={colIndex}>
          {column.map((cat) => (
            <div key={cat.title}>
              <Link to={cat.link} className="category-title" onClick={onLinkClick}>
                {cat.title}
              </Link>
              <ul>
                {cat.subcategories.map((sub) => (
                  <li key={sub.name}>
                    <Link to={sub.link} onClick={onLinkClick}>{sub.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {colIndex === columns.length - 1 && (
            <div className="mt-auto">
              <hr style={{ borderColor: '#333' }} />
              <Link to="/products" className="view-all-link" onClick={onLinkClick}>
                Ver Todos los Productos
              </Link>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// Componente Principal
interface MegaMenuProps {
  onLinkClick?: () => void; // Prop opcional
}

const MegaMenu: React.FC<MegaMenuProps> = ({ onLinkClick = () => { } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width = 0 } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

  const { categories, loading, error } = useCategories();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="menu-container">
        <button className="menu-trigger" disabled>Cargando Menú...</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <button className="menu-trigger" disabled>Error al cargar el menú</button>
      </div>
    );
  }

  if (isMobile) {
    return <CategoryList categories={categories} onLinkClick={onLinkClick} />;
  }

  return (
    <div className="menu-container" ref={menuRef}>
      <button
        className="menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mega-menu-panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list me-2" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
        Menú
      </button>
      <div
        id="mega-menu-panel"
        className={`mega-menu ${isOpen ? 'is-open' : ''}`}
      >
        <CategoryList categories={categories} onLinkClick={() => {
          setIsOpen(false);
          onLinkClick();
        }} />
      </div>
    </div>
  );
};

export default MegaMenu;