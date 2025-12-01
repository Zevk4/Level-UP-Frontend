import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from 'types';
import { useProducts } from 'context/ProductContext';

export const useProductSearch = () => {
  const { products: allProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const filtered = allProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm, allProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setResults([]);
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
    setResults([]);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
        setResults([]);
    }, 200);
  }

  return {
    searchTerm,
    results,
    handleSearchChange,
    handleSearchSubmit,
    handleResultClick,
    handleSearchBlur,
  };
};
