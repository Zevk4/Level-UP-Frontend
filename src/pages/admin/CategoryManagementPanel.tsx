import React, { useState } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryManagementPanel: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSaveCategory = (category: Category) => {
    // Aquí la lógica para determinar si es add o update es más compleja
    // ya que no tenemos un 'id' numérico simple. Usaremos el 'title'
    // para identificar si una categoría ya existe.
    if (categories.some(cat => cat.title === category.title && cat !== editingCategory)) {
        alert('Una categoría con este título ya existe.');
        return;
    }

    if (editingCategory) {
      updateCategory(category);
    } else {
      addCategory(category);
    }
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = (categoryTitle: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryTitle}" y todas sus subcategorías?`)) {
      deleteCategory(categoryTitle);
    }
  };

  // Funciones para subcategorías (aún no se implementarán formularios específicos para estas aquí, se manejan en CategoryForm)
  const handleEditSubcategory = (categoryTitle: string, oldSubcategoryName: string, updatedSubcategory: { name: string; link: string }) => {
    updateSubcategory(categoryTitle, oldSubcategoryName, updatedSubcategory);
  };

  const handleDeleteSubcategory = (categoryTitle: string, subcategoryName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la subcategoría "${subcategoryName}" de "${categoryTitle}"?`)) {
      deleteSubcategory(categoryTitle, subcategoryName);
    }
  };


  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <CategoryForm onSaveCategory={handleSaveCategory} categoryToEdit={editingCategory} />

        <div className="bg-gray-800 rounded-lg shadow p-4 text-white">
          <h2 className="text-xl font-bold mb-4">Listado de Categorías</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat.title} className="p-2 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span>{cat.title}</span>
                  <div>
                    <button 
                      onClick={() => handleEdit(cat)} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.title)} 
                      className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {cat.subcategories.map(sub => (
                      <li key={sub.name} className="flex items-center justify-between text-sm text-gray-300">
                        <span>- {sub.name}</span>
                        <div>
                          {/* Aquí podrías añadir botones para editar/eliminar subcategorías directamente si CategoryForm se expandiera */}
                          <button 
                            onClick={() => handleDeleteSubcategory(cat.title, sub.name)} 
                            className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
                          >
                            Eliminar Sub
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="w-80 p-4 bg-gray-800 rounded-lg text-white">
        <h3 className="text-lg font-bold mb-2">Información de Categorías</h3>
        <p>Total de categorías: {categories.length}</p>
        {/* Más contenido futuro */}
      </aside>
    </div>
  );
};

export default CategoryManagementPanel;