import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

// Importar los datos y componentes
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters'; // Import the new filter component

const PRICE_RANGES = {
  '0-50000': { min: 0, max: 50000 },
  '50001-200000': { min: 50001, max: 200000 },
  '200001-max': { min: 200001, max: Infinity },
};

const AllProductsPage: React.FC = () => {
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  // State to hold the current filters from URL
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
      const params = new URLSearchParams();
      newFilters.brands.forEach((brand) => params.append('brand', brand));
      newFilters.categories.forEach((category) => params.append('category', category));
      newFilters.priceRanges.forEach((range) => params.append('priceRange', range));
      navigate({ search: params.toString() });
    },
    [navigate]
  );

  // Memoized filtering logic
  const filteredProducts = useMemo(() => {
    let tempProducts = products;

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
  }, [products, currentFilters]);

  return (
    <div className="container-fluid mt-4">
      <Row>
        {/* Sidebar de Filtros */}
        <Col md={3} lg={3} className="mb-4">
          <ProductFilters
            products={products}
            onFilterChange={handleFilterChange}
            initialFilters={currentFilters}
          />
        </Col>

        {/* Contenido Principal de Productos */}
        <Col md={8} lg={9}>
          <h2 className="mb-4">Todos Nuestros Productos ({filteredProducts.length})</h2>

          {filteredProducts.length === 0 ? (
            <p className="text-center">No se encontraron productos con estos filtros.</p>
          ) : (
            <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.codigo}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AllProductsPage;