import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Category } from '../../types';

interface CategoryFormProps {
  onSaveCategory: (category: Category) => void;
  categoryToEdit?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSaveCategory, categoryToEdit }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [subcategories, setSubcategories] = useState<{ name: string; link: string }[]>([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryLink, setNewSubcategoryLink] = useState('');
  const [message, setMessage] = useState('');

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
      resetForm(); // Call resetForm when categoryToEdit is null
    }
  }, [categoryToEdit]);

  useEffect(() => {
    if (title.trim()) {
      const generatedLink = `/category?cat=${encodeURIComponent(title.trim())}`;
      setLink(generatedLink);
    } else {
      setLink('');
    }
  }, [title]); // Depende de los cambios en el título

  useEffect(() => {
    if (newSubcategoryName.trim()) {
      const generatedSubLink = `/category?cat=${encodeURIComponent(title.trim())}&sub=${encodeURIComponent(newSubcategoryName.trim())}`;
      setNewSubcategoryLink(generatedSubLink);
    } else {
      setNewSubcategoryLink('');
    }
  }, [newSubcategoryName, title]); // Depende del nombre de la subcategoría y el título de la categoría
  
  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && newSubcategoryLink.trim()) {
      setSubcategories([...subcategories, { name: newSubcategoryName.trim(), link: newSubcategoryLink.trim() }]);
      setNewSubcategoryName('');
      setNewSubcategoryLink('');
    } else {
      setMessage('El nombre y el enlace de la subcategoría no pueden estar vacíos.');
    }
  };

  const handleRemoveSubcategory = (index: number) => {
    const updatedSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      setMessage('El título y el enlace de la categoría no pueden estar vacíos.');
      return;
    }

    const categoryToSubmit: Category = {
      title,
      link,
      subcategories,
    };

    onSaveCategory(categoryToSubmit);
    if (!categoryToEdit) {
      setTitle('');
      setLink('');
      setSubcategories([]);
      setMessage(`Categoría "${title}" agregada correctamente.`);
    } else {
      setMessage(`Categoría "${title}" actualizada correctamente.`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">{categoryToEdit ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Título de la Categoría */}
        <div>
          <label htmlFor="categoryTitle" className="block mb-1 font-medium text-white">Título</label>
          <input type="text" id="categoryTitle" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
        </div>
        
        {/* Enlace de la Categoría */}
        <div>
          <label htmlFor="categoryLink" className="block mb-1 font-medium text-white">Enlace</label>
          <input type="text" id="categoryLink" value={link} readOnly required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
        </div>

        {/* Subcategorías */}
        <div>
          <label className="block mb-1 font-medium text-white">Subcategorías</label>
          <div className="space-y-2">
            {subcategories.map((sub, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="text" value={sub.name} readOnly
                  className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" />
                <input type="text" value={sub.link} readOnly
                  className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" />
                <button type="button" onClick={() => handleRemoveSubcategory(index)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm">
                  -
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Nombre Subcategoría" value={newSubcategoryName} onChange={(e) => setNewSubcategoryName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
            <input type="text" placeholder="Enlace Subcategoría" value={newSubcategoryLink} readOnly
              className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
            <button type="button" onClick={handleAddSubcategory}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm">
              +
            </button>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex gap-4 mt-4">
          <button type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
            {categoryToEdit ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
          <button type="button" onClick={resetForm}
            className="flex-none bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
            Limpiar Formulario
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-white">{message}</p>}
      </form>
    </div>
  );
};

export default CategoryForm;