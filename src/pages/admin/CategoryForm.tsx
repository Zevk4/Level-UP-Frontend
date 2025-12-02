import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Category, Subcategory } from '../../types'; // Asegúrate de importar Subcategory si la definiste en types
import { useCategories } from '../../context/CategoryContext';

interface CategoryFormProps {
  onSaveCategory: (category: Category) => void;
  categoryToEdit?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSaveCategory, categoryToEdit }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  // Usamos la interfaz Subcategory o el tipo literal
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryLink, setNewSubcategoryLink] = useState('');
  const [message, setMessage] = useState('');

  const { categories } = useCategories();

  const resetForm = () => {
    setTitle('');
    setLink('');
    setSubcategories([]);
    setNewSubcategoryName('');
    setNewSubcategoryLink('');
    setMessage('');
  };

  useEffect(() => {
    if (categoryToEdit) {
      setTitle(categoryToEdit.title);
      setLink(categoryToEdit.link);
      setSubcategories(categoryToEdit.subcategories);
    } else {
      resetForm();
    }
  }, [categoryToEdit]);

  // Auto-generar link para la categoría principal
  useEffect(() => {
    if (title.trim()) {
      const generatedLink = `/category?cat=${encodeURIComponent(title.trim())}`;
      setLink(generatedLink);
    } else {
      setLink('');
    }
  }, [title]);

  // Auto-generar link para la NUEVA subcategoría
  useEffect(() => {
    if (newSubcategoryName.trim()) {
      const generatedSubLink = `/category?cat=${encodeURIComponent(title.trim())}&sub=${encodeURIComponent(newSubcategoryName.trim())}`;
      setNewSubcategoryLink(generatedSubLink);
    } else {
      setNewSubcategoryLink('');
    }
  }, [newSubcategoryName, title]);

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !newSubcategoryLink.trim()) {
      setMessage('El nombre y el enlace de la subcategoría no pueden estar vacíos.');
      return;
    }

    const isSubcategoryDuplicate = subcategories.some(
      (sub) => sub.name.toLowerCase() === newSubcategoryName.trim().toLowerCase()
    );
    if (isSubcategoryDuplicate) {
      setMessage('Ya existe una subcategoría con este nombre.');
      return;
    }

    // Nota: Al crearla localmente no tiene ID todavía, eso está bien
    setSubcategories([...subcategories, { name: newSubcategoryName.trim(), link: newSubcategoryLink.trim() }]);
    setNewSubcategoryName('');
    setNewSubcategoryLink('');
  };

  // --- NUEVA FUNCIÓN: Permite editar subcategorías existentes ---
  const handleSubcategoryChange = (index: number, field: 'name' | 'link', value: string) => {
    const updatedSubcategories = [...subcategories];
    
    // Actualizamos el campo específico
    updatedSubcategories[index] = {
      ...updatedSubcategories[index],
      [field]: value
    };

    // Opcional: Si cambias el nombre, podrías querer actualizar el link automáticamente
    // Si descomentas esto, el link se regenerará al escribir el nombre:
    /*
    if (field === 'name') {
         updatedSubcategories[index].link = `/category?cat=${encodeURIComponent(title.trim())}&sub=${encodeURIComponent(value.trim())}`;
    }
    */

    setSubcategories(updatedSubcategories);
  };

  const handleRemoveSubcategory = (index: number) => {
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      setMessage('El título y el enlace de la categoría no pueden estar vacíos.');
      return;
    }

    // Validación de categoría duplicada (solo si cambia el título)
    if (!categoryToEdit || (categoryToEdit && categoryToEdit.title !== title)) {
      const isDuplicate = categories.some(
        (cat) => cat.title.toLowerCase() === title.trim().toLowerCase()
      );
      if (isDuplicate) {
        setMessage('Ya existe una categoría con este nombre.');
        return;
      }
    }

    const categoryToSubmit: Category = {
      ...(categoryToEdit && { id: categoryToEdit.id }), // Mantiene el ID si existe
      title,
      link,
      subcategories,
    };

    try {
      await onSaveCategory(categoryToSubmit);
      if (!categoryToEdit) {
        resetForm();
        setMessage(`Categoría "${title}" agregada correctamente.`);
      } else {
        setMessage(`Categoría "${title}" actualizada correctamente.`);
      }
    } catch (error) {
      setMessage('Error al guardar la categoría: ' + error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {categoryToEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Título de la Categoría */}
        <div>
          <label htmlFor="categoryTitle" className="block mb-1 font-medium text-white">Título</label>
          <input 
            type="text" 
            id="categoryTitle" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" 
          />
        </div>
        
        {/* Enlace de la Categoría */}
        <div>
          <label htmlFor="categoryLink" className="block mb-1 font-medium text-white">Enlace</label>
          <input 
            type="text" 
            id="categoryLink" 
            value={link} 
            readOnly 
            required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-gray-400 cursor-not-allowed" 
          />
        </div>

        {/* Subcategorías */}
        <div>
          <label className="block mb-1 font-medium text-white">Subcategorías</label>
          <div className="space-y-2">
            {subcategories.map((sub, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center sm:items-stretch gap-2">
                
                {/* INPUT DE NOMBRE (Ya no es readOnly) */}
                <input 
                  type="text" 
                  value={sub.name} 
                  onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:bg-gray-900 focus:ring-indigo-500" 
                />
                
                {/* INPUT DE LINK (Ya no es readOnly, permite ajuste manual) */}
                <input 
                  type="text" 
                  value={sub.link} 
                  onChange={(e) => handleSubcategoryChange(index, 'link', e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:bg-gray-900 focus:ring-indigo-500" 
                />
                
                <button 
                  type="button" 
                  onClick={() => handleRemoveSubcategory(index)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  -
                </button>
              </div>
            ))}
          </div>

          {/* Agregar Nueva Subcategoría */}
          <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-2 border-t border-gray-700">
            <input 
              type="text" 
              placeholder="Nueva Subcategoría" 
              value={newSubcategoryName} 
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" 
            />
            <input 
              type="text" 
              placeholder="Enlace (Auto-generado)" 
              value={newSubcategoryLink} 
              readOnly
              className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-400" 
            />
            <button 
              type="button" 
              onClick={handleAddSubcategory}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          >
            {categoryToEdit ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
          <button 
            type="button" 
            onClick={resetForm}
            className="flex-none bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Limpiar Formulario
          </button>
        </div>
        {message && (
            <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
            </p>
        )}
      </form>
    </div>
  );
};

export default CategoryForm;