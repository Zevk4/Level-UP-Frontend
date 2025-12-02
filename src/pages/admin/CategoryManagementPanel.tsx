import React, { useState, useRef } from 'react';
import { useCategories } from '../../context/CategoryContext';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryManagementPanel: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    deleteSubcategory 
  } = useCategories();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSaveCategory = async (category: Category) => {
    try {
      // Lógica basada en ID numérico
      if (editingCategory && editingCategory.id) {
        // UPDATE: Pasamos el ID numérico y el objeto
        await updateCategory(editingCategory.id, category);
      } else {
        // CREATE
        await addCategory(category);
      }
      setEditingCategory(null);
    } catch (error) {
      alert('Error al guardar la categoría: ' + error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    // Scroll suave hacia el formulario
    panelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id: number, categoryTitle: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryTitle}" y todas sus subcategorías?`)) {
      await deleteCategory(id);
    }
  };

  // Ajustado para usar 'name' para coincidir con el Contexto
  const handleDeleteSubcategory = async (categoryId: number, subcategoryName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la subcategoría "${subcategoryName}"?`)) {
       await deleteSubcategory(categoryId, subcategoryName); 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6" ref={panelRef}>
      <div className="flex-1 space-y-6">
        {/* Formulario de Categorías */}
        <CategoryForm 
            onSaveCategory={handleSaveCategory} 
            categoryToEdit={editingCategory} 
        />

        {/* Lista de Categorías */}
        <div className="bg-gray-800 rounded-lg shadow p-4 text-white">
          <h2 className="text-xl font-bold mb-4">Listado de Categorías</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat.id} className="p-2 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cat.title}</span>
                  <div>
                    <button 
                      onClick={() => handleEdit(cat)} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => cat.id && handleDelete(cat.id, cat.title)} 
                      className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Lista de Subcategorías */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-600 pl-2">
                    {cat.subcategories.map(sub => (
                      <li key={sub.id || sub.name} className="flex items-center justify-between text-sm text-gray-300">
                        <span>- {sub.name}</span>
                        <div>
                          <button 
                            // IMPORTANTE: Pasamos cat.id y sub.name
                            onClick={() => cat.id && handleDeleteSubcategory(cat.id, sub.name)} 
                            className="text-red-400 hover:text-red-300 text-xs py-1 px-2"
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
          {categories.length === 0 && (
              <p className="text-gray-400 text-center mt-4">No hay categorías registradas.</p>
          )}
        </div>
      </div>

      {/* Sidebar Informativo */}
      <aside className="w-full lg:w-80 mt-6 lg:mt-0 p-4 bg-gray-800 rounded-lg text-white h-fit">
        <h3 className="text-lg font-bold mb-2">Resumen</h3>
        <p>Total de categorías: <span className="font-bold text-indigo-400">{categories.length}</span></p>
      </aside>
    </div>
  );
};

export default CategoryManagementPanel;