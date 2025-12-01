import { Category } from 'types';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import categoriasData from 'data/categorias.json'; // Cambiado de menuData
import { storageService } from 'services/storageService'; // Importar storageService

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>; // Función para recargar categorías
  addCategory: (newCategory: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  deleteCategory: (categoryTitle: string) => void;
  addSubcategory: (categoryTitle: string, newSubcategory: { name: string; link: string }) => void;
  updateSubcategory: (categoryTitle: string, oldSubcategoryName: string, updatedSubcategory: { name: string; link: string }) => void;
  deleteSubcategory: (categoryTitle: string, subcategoryName: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedCategories = storageService.local.get<Category[]>('categories');
      if (storedCategories && storedCategories.length > 0) {
        setCategories(storedCategories);
      } else {
        const data: Category[] = categoriasData as Category[];
        setCategories(data);
        storageService.local.set('categories', data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const addCategory = (newCategory: Category) => {
    try {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  const updateCategory = (updatedCategory: Category) => {
    try {
      const updatedCategories = categories.map((cat) =>
        cat.title === updatedCategory.title ? updatedCategory : cat
      );
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    }
  };

  const deleteCategory = (categoryTitle: string) => {
    try {
      const updatedCategories = categories.filter((cat) => cat.title !== categoryTitle);
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const addSubcategory = (categoryTitle: string, newSubcategory: { name: string; link: string }) => {
    try {
      const updatedCategories = categories.map(cat => {
        if (cat.title === categoryTitle) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, newSubcategory]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al agregar subcategoría:', error);
    }
  };

  const updateSubcategory = (categoryTitle: string, oldSubcategoryName: string, updatedSubcategory: { name: string; link: string }) => {
    try {
      const updatedCategories = categories.map(cat => {
        if (cat.title === categoryTitle) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.name === oldSubcategoryName ? updatedSubcategory : sub
            )
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al actualizar subcategoría:', error);
    }
  };

  const deleteSubcategory = (categoryTitle: string, subcategoryName: string) => {
    try {
      const updatedCategories = categories.map(cat => {
        if (cat.title === categoryTitle) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.name !== subcategoryName)
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      storageService.local.set('categories', updatedCategories);
    } catch (error) {
      console.error('Error al eliminar subcategoría:', error);
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, refreshCategories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
