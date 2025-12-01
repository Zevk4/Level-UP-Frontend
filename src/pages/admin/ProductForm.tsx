import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Product, Category } from '../../types'; // Import Category type
import { useProducts } from '../../context/ProductContext';
import categoriasData from '../../data/categorias.json'; // Import dynamic categories data

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [marca, setMarca] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<string[]>([]);

  // States for new category/subcategory inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  const { products } = useProducts();

  useEffect(() => {
    setAllCategories(categoriasData);
  }, []);

  // Function to add a new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim() && !allCategories.some(cat => cat.title.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      const newCat: Category = {
        title: newCategoryName.trim(),
        link: `/category?cat=${encodeURIComponent(newCategoryName.trim())}`,
        subcategories: []
      };
      setAllCategories(prev => [...prev, newCat]);
      setNewCategoryName('');
      setMessage(`Categoría "${newCategoryName.trim()}" agregada.`);
    } else {
      setMessage('El nombre de la categoría es inválido o ya existe.');
    }
  };

  // Function to add a new subcategory to the selected category
  const handleAddNewSubcategory = () => {
    if (newSubcategoryName.trim() && categoria) {
      setAllCategories(prevCategories => {
        return prevCategories.map(cat => {
          if (cat.title === categoria) {
            if (!cat.subcategories.some(sub => sub.name.toLowerCase() === newSubcategoryName.trim().toLowerCase())) {
              const newSub = {
                name: newSubcategoryName.trim(),
                link: `/category?cat=${encodeURIComponent(categoria)}&sub=${encodeURIComponent(newSubcategoryName.trim())}`
              };
              // Update subcategoriasDisponibles immediately
              setSubcategoriasDisponibles(prev => [...prev, newSub.name]);
              return { ...cat, subcategories: [...cat.subcategories, newSub] };
            }
          }
          return cat;
        });
      });
      setNewSubcategoryName('');
      setMessage(`Subcategoría "${newSubcategoryName.trim()}" agregada a "${categoria}".`);
    } else {
      setMessage('El nombre de la subcategoría es inválido o no se ha seleccionado una categoría.');
    }
  };

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const catTitle = e.target.value;
    setCategoria(catTitle);
    setSubcategoria('');
    const selectedCategory = allCategories.find(c => c.title === catTitle);
    setSubcategoriasDisponibles(selectedCategory ? selectedCategory.subcategories.map(s => s.name) : []);
  };

  const updatePreview = (src: string | null) => {
    setPreview(src);
  };

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
    if (!nombre || !descripcion || isNaN(precio) || !categoria || !subcategoria || !marca) {
      setMessage('Todos los campos obligatorios deben completarse.');
      return;
    }

    // Dynamically generate prefix based on selected subcategory or category
    const getPrefix = (subcatName: string, catTitle: string) => {
      // Find the subcategory in allCategories to get its link, then derive prefix
      for (const cat of allCategories) {
        if (cat.title === catTitle) {
          const sub = cat.subcategories.find(s => s.name === subcatName);
          if (sub) {
            // Extract prefix from link, e.g., /category?cat=Consolas&sub=PlayStation -> CO
            const match = sub.link.match(/sub=([^&]+)/);
            if (match && match[1]) {
              const decodedSub = decodeURIComponent(match[1]);
              if (decodedSub === "PlayStation") return "CO";
              if (decodedSub === "Xbox Series") return "AC"; // This might need adjustment based on desired prefix logic
              // Fallback or more complex logic to derive prefix from subcategory name
              return decodedSub.substring(0, 2).toUpperCase();
            }
          }
          break;
        }
      }
      return catTitle.substring(0, 2).toUpperCase(); // Fallback to category prefix
    };

    const prefix = getPrefix(subcategoria, categoria);

    const productosEnSubcategoria = products.filter(p => p.subcategoria === subcategoria);
    const ultimoNumero = productosEnSubcategoria.length > 0
      ? Math.max(...productosEnSubcategoria.map(p => parseInt(p.codigo.slice(prefix.length)))) + 1
      : 1;
    const codigo = prefix + ultimoNumero.toString().padStart(3, '0');

    const imagen = preview || '';

    const nuevoProducto: Product = {
      codigo,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen,
      marca
    };

    onAddProduct(nuevoProducto);

    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setCategoria('');
    setSubcategoria('');
    setImagenUrl('');
    setMarca('');
    setPreview(null);
    setSubcategoriasDisponibles([]);
    setMessage(`Producto "${nombre}" agregado correctamente. Código: ${codigo}`);
  };

  return (
    // Usamos el HTML y clases de index_admin.html [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/admin/index_admin.html]
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre del Producto */}
        <div>
          <label htmlFor="productName" className="block mb-1 font-medium">Nombre del Producto</label>
          <input type="text" id="productName" value={nombre} onChange={(e) => setNombre(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        
        {/* Descripción */}
        <div>
          <label htmlFor="productDescription" className="block mb-1 font-medium">Descripción</label>
          <textarea id="productDescription" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="productPrice" className="block mb-1 font-medium">Precio</label>
          <input type="number" id="productPrice" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} min="0" step="1" required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        {/* Marca del Producto */}
        <div>
          <label htmlFor="productBrand" className="block mb-1 font-medium">Marca</label>
          <input type="text" id="productBrand" value={marca} onChange={(e) => setMarca(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="productCategory" className="block mb-1 font-medium">Categoría</label>
          <select id="productCategory" value={categoria} onChange={handleCategoriaChange} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Selecciona una categoría --</option>
            {allCategories.map(cat => (
              <option key={cat.title} value={cat.title}>{cat.title}</option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Nueva Categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Subcategoría (Dinámica) */}
        {categoria && (
          <div>
            <label htmlFor="productSubcategory" className="block mb-1 font-medium">Subcategoría</label>
            <select id="productSubcategory" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} required
              className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">-- Selecciona una subcategoría --</option>
              {subcategoriasDisponibles.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Nueva Subcategoría"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900"
              />
              <button
                type="button"
                onClick={handleAddNewSubcategory}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Imagen del Producto */}
        <div>
          <label className="block mb-1 font-medium">Imagen del Producto</label>
          <div className="flex gap-2 mb-2">
            <input type="file" id="productImageFile" accept="image/*" onChange={handleFileChange}
              className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-900" />
            <input type="url" id="productImageURL" placeholder="O pega un link de imagen" value={imagenUrl} onChange={handleUrlChange}
              className="w-1/2 px-3 py-2 rounded-md border border-gray-600 bg-gray-900" />
          </div>
          {preview && (
            <img src={preview} alt="Previsualización"
              className="mt-2 rounded-md w-40 h-40 object-cover" />
          )}
        </div>

        {/* Botón de envío y mensaje */}
        <button type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
          Agregar Producto
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default ProductForm;