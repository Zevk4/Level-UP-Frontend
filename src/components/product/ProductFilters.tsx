import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../../types'; // Assuming Product type is defined here
import '../../styles/ProductFilters.css'; // Make sure to create this CSS file

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filters: {
    brands: string[];
    categories: string[];
    priceRanges: string[];
  }) => void;
  initialFilters?: {
    brands?: string[];
    categories?: string[];
    priceRanges?: string[];
  };
}

const PRICE_RANGES = {
  '0-50000': { min: 0, max: 50000 },
  '50001-200000': { min: 50001, max: 200000 },
  '200001-max': { min: 200001, max: Infinity },
};

const CATEGORIES = [
  "Juegos",
  "Perifericos",
  "Consolas",
  "Computacion",
  "Sillas Gamer",
  "Accesorios",
  "Poleras Personalizadas"
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  products,
  onFilterChange,
  initialFilters,
}) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialFilters?.brands || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(
    initialFilters?.priceRanges || []
  );

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((product) => brands.add(product.marca));
    return Array.from(brands).sort();
  }, [products]);

  useEffect(() => {
    onFilterChange({
      brands: selectedBrands,
      categories: selectedCategories,
      priceRanges: selectedPriceRanges,
    });
  }, [selectedBrands, selectedCategories, selectedPriceRanges, onFilterChange]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
  }, []);

  return (
    <div className="product-filters-sidebar text-light bg-dark-subtle p-3">
      <div className="filters-header">
        <h5>Filtros</h5>
        <button className="clear-filters-btn text-light" onClick={clearFilters}>
          Limpiar Filtros
        </button>
      </div>

      <div className="filter-section">
        <h6>Marca</h6>
        <div className="filter-options d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <input
              type="checkbox"
              checked={selectedBrands.length === 0}
              onChange={() => setSelectedBrands([])}
              id="brand-all"
            />
            <label htmlFor="brand-all" className="ms-2 mb-0">Todas</label>
          </div>
          {availableBrands.map((brand) => (
            <div key={brand} className="d-flex align-items-center mb-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                id={`brand-${brand}`}
              />
              <label htmlFor={`brand-${brand}`} className="ms-2 mb-0">{brand}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h6>Categoría</h6>
        <div className="filter-options d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.length === 0}
              onChange={() => setSelectedCategories([])}
              id="category-all"
            />
            <label htmlFor="category-all" className="ms-2 mb-0">Todas</label>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category} className="d-flex align-items-center mb-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                id={`category-${category}`}
              />
              <label htmlFor={`category-${category}`} className="ms-2 mb-0">{category}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h6>Precio</h6>
        <div className="filter-options d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <input
              type="checkbox"
              checked={selectedPriceRanges.length === 0}
              onChange={() => setSelectedPriceRanges([])}
              id="price-all"
            />
            <label htmlFor="price-all" className="ms-2 mb-0">Todos</label>
          </div>
          {Object.keys(PRICE_RANGES).map((rangeKey) => (
            <div key={rangeKey} className="d-flex align-items-center mb-2">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(rangeKey)}
                onChange={() => handlePriceRangeChange(rangeKey)}
                id={`price-${rangeKey}`}
              />
              <label htmlFor={`price-${rangeKey}`} className="ms-2 mb-0">
                {rangeKey === '0-50000' && '$0 - $50.000'}
                {rangeKey === '50001-200000' && '$50.001 - $200.000'}
                {rangeKey === '200001-max' && '$200.000+'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;