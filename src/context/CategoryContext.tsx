import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { apiService } from '../services/apiService'; // Ajusta la ruta si es necesario
import { Category, Subcategory } from '../types'; // Importamos los tipos correctos

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  addCategory: (newCategory: Category) => Promise<void>;
  
  // CAMBIO: id ahora es number
  updateCategory: (id: number, updatedCategory: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // CAMBIO: categoryId es number y usamos el tipo Subcategory
  addSubcategory: (categoryId: number, newSubcategory: Subcategory) => Promise<void>;
  updateSubcategory: (categoryId: number, oldSubcategoryName: string, updatedSubcategory: Subcategory) => Promise<void>;
  deleteSubcategory: (categoryId: number, subcategoryName: string) => Promise<void>;
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
      const response = await apiService.get('/categories');
      setCategories(response.data as Category[]);
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

  const addCategory = async (newCategory: Category) => {
    try {
      // Preparamos el request (Spring Boot espera esto)
      const request = {
        title: newCategory.title,
        link: newCategory.link,
        subcategories: newCategory.subcategories
      };
      const response = await apiService.post('/categories/create', request);
      // Agregamos la respuesta real del servidor (que incluye el nuevo ID)
      setCategories(prev => [...prev, response.data as Category]);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      throw error; // Lanzamos el error para que el componente lo pueda mostrar si quiere
    }
  };

  // CAMBIO: id es number
  const updateCategory = async (id: number, updatedCategory: Category) => {
    try {
      const request = {
        title: updatedCategory.title,
        link: updatedCategory.link,
        subcategories: updatedCategory.subcategories
      };
      // La URL ahora usa el ID numérico
      const response = await apiService.put(`/categories/${id}`, request);
      
      // Actualizamos el estado local comparando números
      setCategories(prev => prev.map(cat => (cat.id === id ? response.data as Category : cat)));
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  };

  // CAMBIO: id es number
  const deleteCategory = async (id: number) => {
    try {
      await apiService.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  };

  // -----------------------------------------------------------------------
  // LÓGICA DE SUBCATEGORÍAS (Adaptada para usar updateCategory)
  // -----------------------------------------------------------------------

  const addSubcategory = async (categoryId: number, newSubcategory: Subcategory) => {
    try {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      // Creamos un objeto categoría actualizado agregando la subcategoría
      const updatedCategory = {
        ...categoryToUpdate,
        subcategories: [...categoryToUpdate.subcategories, newSubcategory]
      };

      // Reutilizamos la función updateCategory
      await updateCategory(categoryId, updatedCategory);

    } catch (error) {
      console.error('Error al agregar subcategoría:', error);
    }
  };

  const updateSubcategory = async (categoryId: number, oldSubcategoryName: string, updatedSubcategory: Subcategory) => {
    try {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      // Mapeamos para reemplazar la subcategoría específica
      const updatedSubs = categoryToUpdate.subcategories.map(sub => 
        sub.name === oldSubcategoryName ? updatedSubcategory : sub
      );

      const updatedCategory = {
        ...categoryToUpdate,
        subcategories: updatedSubs
      };

      await updateCategory(categoryId, updatedCategory);

    } catch (error) {
      console.error('Error al actualizar subcategoría:', error);
    }
  };

  const deleteSubcategory = async (categoryId: number, subcategoryName: string) => {
    try {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      // Filtramos para quitar la subcategoría
      const updatedSubs = categoryToUpdate.subcategories.filter(sub => sub.name !== subcategoryName);

      const updatedCategory = {
        ...categoryToUpdate,
        subcategories: updatedSubs
      };

      await updateCategory(categoryId, updatedCategory);

    } catch (error) {
      console.error('Error al eliminar subcategoría:', error);
    }
  };

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      loading, 
      error, 
      refreshCategories, 
      addCategory, 
      updateCategory, 
      deleteCategory, 
      addSubcategory, 
      updateSubcategory, 
      deleteSubcategory 
    }}>
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