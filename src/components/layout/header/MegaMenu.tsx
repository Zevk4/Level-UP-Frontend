import React, { useState, useEffect, useRef } from 'react'; // 1. Importar useRef y useEffect
import { Link } from 'react-router-dom';
import './MegaMenu.css';
import menuData from '../../../data/categorias.json';
import { Category } from '../../../types';
import useWindowSize from '../../../hooks/useWindowSize';

const MOBILE_BREAKPOINT = 992; // lg

// Componente interno CategoryList (sin cambios)
const CategoryList: React.FC<{ onLinkClick: () => void }> = ({ onLinkClick }) => {
  const categories: Category[] = menuData as Category[];
  const itemsPerColumn = Math.ceil(categories.length / 3);
  const columns: Category[][] = [
    categories.slice(0, itemsPerColumn),
    categories.slice(itemsPerColumn, itemsPerColumn * 2),
    categories.slice(itemsPerColumn * 2),
  ];

  const { width } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

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
                </li>
              ))}
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
  const { width } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

  // 2. Crear una referencia para el contenedor del menú
  const menuRef = useRef<HTMLDivElement>(null);

  // 3. Hook 'useEffect' para detectar clics FUERA del menú
  useEffect(() => {
    // Función que se ejecuta en cualquier clic del documento
    const handleClickOutside = (event: MouseEvent) => {
      // Si el menú está abierto Y el clic NO fue dentro del 'menuRef'
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Cierra el menú
      }
    };
    // Añadir el 'oyente' de clics
    document.addEventListener('mousedown', handleClickOutside);
    // Limpiar el 'oyente' cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Este efecto se re-ejecuta solo si 'isOpen' cambia

  if (isMobile) {
    // EN MÓVIL: Devuelve solo la lista (para el 'Navbar.Collapse')
    return <CategoryList onLinkClick={onLinkClick} />;
  }

  // EN DESKTOP: Devuelve el botón + panel flotante
  return (
    // 4. Adjuntar la referencia al div principal
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
        {/* 5. CAMBIO DE TEXTO */}
        Menú
      </button>
      <div
        id="mega-menu-panel"
        className={`mega-menu ${isOpen ? 'is-open' : ''}`}
      >
        <CategoryList onLinkClick={() => {
          setIsOpen(false); // Cierra el dropdown de desktop
          onLinkClick();    // Cierra el navbar (no hará nada en desktop)
        }} />
      </div>
    </div>
  );
};

export default MegaMenu;