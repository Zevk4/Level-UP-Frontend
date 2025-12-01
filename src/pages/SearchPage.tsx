import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

// Importar los datos y componentes
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters'; // Import the ProductFilters component

const PRICE_RANGES = {
  '0-50000': { min: 0, max: 50000 },
  '50001-200000': { min: 50001, max: 200000 },
  '200001-max': { min: 200001, max: Infinity },
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();

  const query = searchParams.get('q') || '';

  // State to hold the current filters from URL (for ProductFilters component)
  const [currentFilters, setCurrentFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRanges: [] as string[],
  });

  // Effect to parse URL params on initial load and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brands = params.getAll('brand');
    const categories = params.getAll('category');
    const priceRanges = params.getAll('priceRange');
    setCurrentFilters({ brands, categories, priceRanges });
  }, [location.search]);

  // Callback to handle filter changes from ProductFilters component
  const handleFilterChange = useCallback(
    (newFilters: { brands: string[]; categories: string[]; priceRanges: string[] }) => {
      const params = new URLSearchParams(location.search); // Get current URL params
      // Clear existing filter params before appending new ones from ProductFilters
      ['brand', 'category', 'priceRange'].forEach(key => params.delete(key));

      newFilters.brands.forEach((brand) => params.append('brand', brand));
      newFilters.categories.forEach((category) => params.append('category', category));
      newFilters.priceRanges.forEach((range) => params.append('priceRange', range));

      navigate({ search: params.toString() });
    },
    [navigate, location.search]
  );

  const filteredProducts: Product[] = useMemo(() => {
    let tempProducts = products;
    const queryLower = query.toLowerCase();

    // 1. Filter by search query first
    if (query) {
      tempProducts = tempProducts.filter(product => {
        const nameMatch = product.nombre.toLowerCase().includes(queryLower);
        const descMatch = product.descripcion.toLowerCase().includes(queryLower);
        return nameMatch || descMatch;
      });
    }

    // 2. Apply filters from ProductFilters component (currentFilters)
    // Filter by Brand
    if (currentFilters.brands.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        currentFilters.brands.includes(product.marca)
      );
    }

    // Filter by Category
    if (currentFilters.categories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        currentFilters.categories.includes(product.categoria)
      );
    }

    // Filter by Price Range
    if (currentFilters.priceRanges.length > 0) {
      tempProducts = tempProducts.filter((product) => {
        return currentFilters.priceRanges.some((rangeKey) => {
          const range = PRICE_RANGES[rangeKey as keyof typeof PRICE_RANGES];
          return product.precio >= range.min && product.precio <= range.max;
        });
      });
    }

    return tempProducts;
  }, [query, products, currentFilters]); // Se recalcula solo si la 'query', 'products' o 'currentFilters' cambian

  return (
    <div className="container-fluid mt-4">
      <Row>
        {/* Sidebar de Filtros */}
        <Col md={3} lg={3} className="mb-4">
          <ProductFilters
            products={products} // Pass all products for filter options generation
            onFilterChange={handleFilterChange}
            initialFilters={currentFilters}
          />
        </Col>

        {/* Contenido Principal de Productos */}
        <Col md={8} lg={9}>
          <h2 className="mb-4">Resultados para: "{query}" ({filteredProducts.length})</h2>

          {filteredProducts.length > 0 ? (
            <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.codigo}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-muted text-center">
              No se encontraron productos que coincidan con tu búsqueda y filtros.
            </p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;