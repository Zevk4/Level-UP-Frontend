import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Product, Category, Subcategory } from '../../types'; 
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
  productToEdit?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, productToEdit }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [marca, setMarca] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const { products } = useProducts();
  const { categories: allCategories, addCategory, addSubcategory } = useCategories();

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setCategoria('');
    setSubcategoria('');
    setImagenUrl('');
    setMarca('');
    setPreview(null);
    setMessage('');
    setNewCategoryName('');
    setNewSubcategoryName('');
    setSubcategoriasDisponibles([]);
  };

  // --- CORRECCIÓN 1: useEffect separado para INICIALIZAR el formulario ---
  // Solo se ejecuta si cambia el producto a editar, NO cuando cambian las categorías.
  useEffect(() => {
    if (productToEdit) {
      setNombre(productToEdit.nombre);
      setDescripcion(productToEdit.descripcion);
      setPrecio(productToEdit.precio);
      setCategoria(productToEdit.categoria);
      // Nota: subcategoria se setea en el siguiente useEffect
      setImagenUrl(productToEdit.imagen);
      setMarca(productToEdit.marca);
      setPreview(productToEdit.imagen);
    } else {
      resetForm();
    }
    // QUITAMOS 'allCategories' de aquí para evitar el reseteo indeseado
  }, [productToEdit]); 

  // --- CORRECCIÓN 2: useEffect para ACTUALIZAR listas ---
  // Se encarga de refrescar las subcategorías disponibles si agregas una nueva
  // o si cargas el producto a editar.
  useEffect(() => {
    // Si tenemos una categoría seleccionada, buscamos sus subcategorías actualizadas
    if (categoria) {
        const selectedCategory = allCategories.find(c => c.title === categoria);
        const subs = selectedCategory ? selectedCategory.subcategories.map(s => s.name) : [];
        setSubcategoriasDisponibles(subs);
        
        // Si estamos editando, aseguramos que la subcategoría seleccionada se mantenga
        if (productToEdit && productToEdit.categoria === categoria) {
            setSubcategoria(productToEdit.subcategoria);
        }
    } else {
        setSubcategoriasDisponibles([]);
    }
  }, [allCategories, categoria, productToEdit]);


  const handleAddNewCategory = async () => {
    if (newCategoryName.trim() && !allCategories.some(cat => cat.title.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      try {
        const newCat: Category = {
            title: newCategoryName.trim(),
            link: `/category?cat=${encodeURIComponent(newCategoryName.trim())}`,
            subcategories: []
        };
        await addCategory(newCat);
        
        // Mejora UX: Seleccionar automáticamente la nueva categoría
        setCategoria(newCategoryName.trim());
        
        setNewCategoryName('');
        setMessage(`Categoría "${newCategoryName.trim()}" agregada.`);
      } catch (error) {
        setMessage('Error al agregar la categoría.');
      }
    } else {
      setMessage('El nombre de la categoría es inválido o ya existe.');
    }
  };

  const handleAddNewSubcategory = async () => {
    const currentCategoryObj = allCategories.find(c => c.title === categoria);

    if (newSubcategoryName.trim() && currentCategoryObj && currentCategoryObj.id) {
      try {
        const newSub: Subcategory = {
           name: newSubcategoryName.trim(),
           link: `/category?cat=${encodeURIComponent(categoria)}&sub=${encodeURIComponent(newSubcategoryName.trim())}`
        };

        await addSubcategory(currentCategoryObj.id, newSub);

        // Mejora UX: Seleccionar automáticamente la nueva subcategoría
        setSubcategoria(newSubcategoryName.trim());

        setNewSubcategoryName('');
        setMessage(`Subcategoría "${newSubcategoryName.trim()}" agregada a "${categoria}".`);
      } catch (error) {
         setMessage('Error al agregar subcategoría.');
      }
    } else {
      setMessage('Nombre inválido o categoría no seleccionada.');
    }
  };

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const catTitle = e.target.value;
    setCategoria(catTitle);
    setSubcategoria('');
    // El useEffect se encargará de actualizar las subcategorías disponibles
  };

  // ... (Funciones de imagen handleFileChange, handleUrlChange, updatePreview iguales) ...
  const updatePreview = (src: string | null) => { setPreview(src); };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updatePreview(reader.result as string);
      reader.readAsDataURL(file);
      setImagenUrl('');
    }
  };
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setImagenUrl(url);
    updatePreview(url || null);
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const imagen = preview || '';

    if (!nombre || !descripcion || isNaN(precio) || !categoria || !subcategoria || !marca || !imagen) {
      setMessage('Todos los campos obligatorios deben completarse.');
      return;
    }

    let productCodigo = productToEdit?.codigo;

    // Generación de código (Lógica mantenida)
    if (!productCodigo) {
      const getPrefix = (subcatName: string, catTitle: string) => {
        for (const cat of allCategories) {
          if (cat.title === catTitle) {
            const sub = cat.subcategories.find(s => s.name === subcatName);
            if (sub) {
              const match = sub.link.match(/sub=([^&]+)/);
              if (match && match[1]) {
                const decodedSub = decodeURIComponent(match[1]);
                if (decodedSub === "PlayStation") return "CO";
                if (decodedSub === "Xbox Series") return "AC";
                return decodedSub.substring(0, 2).toUpperCase();
              }
            }
            break;
          }
        }
        return catTitle.substring(0, 2).toUpperCase();
      };

      const prefix = getPrefix(subcategoria, categoria);
      const productosEnSubcategoria = products.filter(p => p.subcategoria === subcategoria);
      const ultimoNumero = productosEnSubcategoria.length > 0
        ? Math.max(...productosEnSubcategoria.map(p => parseInt(p.codigo.slice(prefix.length)) || 0)) + 1
        : 1;
      productCodigo = prefix + ultimoNumero.toString().padStart(3, '0');
    }

    const productToSubmit: Product = {
      codigo: productCodigo,
      nombre,
      descripcion,
      precio,
      categoria, 
      subcategoria, 
      imagen,
      marca
    };

    console.log("Intentando guardar producto:", productToSubmit); // <--- DEBUG

    // Llamamos a la función padre. Si esta función falla, el error debe capturarse allí.
    try {
        onAddProduct(productToSubmit);
        
        if (!productToEdit) {
          resetForm();
          setMessage(`Producto "${nombre}" agregado correctamente.`);
        } else {
          setMessage(`Producto actualizado.`);
        }
    } catch(err) {
        console.error("Error al enviar producto:", err);
        setMessage("Error al guardar el producto.");
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Nombre del Producto</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        
        {/* Descripción */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        {/* Precio */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Precio</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} min="0" step="1" required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        {/* Marca */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Marca</label>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        {/* Categoría */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Categoría</label>
          <select value={categoria} onChange={handleCategoriaChange} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Selecciona una categoría --</option>
            {allCategories.map(cat => (
              <option key={cat.id || cat.title} value={cat.title}>{cat.title}</option>
            ))}
          </select>
          
          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Nueva Categoría" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white" />
            <button type="button" onClick={handleAddNewCategory}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"> + </button>
          </div>
        </div>

        {/* Subcategoría */}
        {categoria && (
          <div>
            <label className="block mb-1 font-medium text-gray-300">Subcategoría</label>
            <select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} required
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">-- Selecciona una subcategoría --</option>
              {subcategoriasDisponibles.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="Nueva Subcategoría" value={newSubcategoryName} onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white" />
              <button type="button" onClick={handleAddNewSubcategory}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"> + </button>
            </div>
          </div>
        )}

        {/* Imagen */}
        <div>
          <label className="block mb-1 font-medium text-gray-300">Imagen del Producto</label>
          <div className="flex gap-2 mb-2">
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white" />
            <input type="url" placeholder="Link de imagen" value={imagenUrl} onChange={handleUrlChange} className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-900 text-white" />
          </div>
          {preview && <img src={preview} alt="Previsualización" className="mt-2 rounded-md w-40 h-40 object-cover border border-gray-600" />}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
            {productToEdit ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
          <button type="button" onClick={resetForm} className="flex-none bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
            Limpiar Formulario
          </button>
        </div>
        {message && <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
      </form>
    </div>
  );
};

export default ProductForm;