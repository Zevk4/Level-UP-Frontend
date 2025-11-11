import React, { useState, ChangeEvent, FormEvent } from 'react';
// Usamos la ruta relativa que funcionó para AdminRoute: ../../
import { Product } from '../../types/index';
import { useProducts } from '../../context/ProductContext';

// Definimos las subcategorías aquí, tal como en admin.js [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/js/admin.js]
const subcategoriasMap: { [key: string]: string[] } = {
  "Juegos": ["Juegos de Mesa", "Videojuegos", "Cartas"],
  "Perifericos": ["Mouse Gamer", "Teclados", "Auriculares", "Controles"],
  "Consolas": ["PlayStation", "Xbox", "Nintendo"],
  "Computacion": ["PC Escritorio", "Laptop", "Componentes"],
  "Sillas Gamer": ["Secretlab", "DXRacer", "Cougar"],
  "Accesorios": ["Mousepad", "Audífonos", "Cables"],
  "Poleras Personalizadas": ["Otras"]
};

// Mapa de prefijos por subcategoría basado en productos.json
const subcategoryPrefixMap: { [key: string]: string } = {
  "Juegos de Mesa": "JM",
  "Videojuegos": "JM",
  "Cartas": "JM",
  "Controles": "AC",
  "Auriculares Gamer": "AC",
  "Mouse Gamer": "MO",
  "Teclados": "TE",
  "PlayStation": "CO",
  "Xbox": "CO",
  "Nintendo": "CO",
  "PC Escritorio": "CG",
  "Laptop": "CG",
  "Componentes": "COMP",
  "Secretlab": "SG",
  "DXRacer": "SG",
  "Cougar": "SG",
  "Mousepad": "MP",
  "Audífonos": "AC",
  "Otras": "PP"
};

// Definimos los props que este componente recibirá de AdminPage
interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null); // Para la vista previa de la imagen
  const [message, setMessage] = useState(''); // Mensaje de éxito o error

  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState<string[]>([]);

  // Acceder a los productos existentes para generar códigos únicos
  const { products } = useProducts();

  // Lógica de admin.js para cambiar subcategorías [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/js/admin.js]
  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setCategoria(cat);
    setSubcategoria(''); // Resetea subcategoría
    setSubcategoriasDisponibles(subcategoriasMap[cat] || []);
  };

  // Lógica de admin.js para la vista previa de imagen [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/js/admin.js]
  const updatePreview = (src: string | null) => {
    setPreview(src);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updatePreview(reader.result as string);
      reader.readAsDataURL(file);
      setImagenUrl(''); // Limpia el input de URL si se sube un archivo
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setImagenUrl(url);
    updatePreview(url || null);
  };

  // Lógica de admin.js para el envío del formulario [cite: zevk4/level_up/Level_UP-9310edfd8117bb149283794742f89c0802893a4e/js/admin.js]
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre || !descripcion || isNaN(precio) || !categoria || !subcategoria) {
      setMessage('Todos los campos obligatorios deben completarse.');
      return;
    }

    // Generar código basado en la subcategoría, siguiendo el patrón de productos.json
    const prefix = subcategoryPrefixMap[subcategoria] || categoria.substring(0, 2).toUpperCase();
    const productosEnSubcategoria = products.filter(p => p.subcategoria === subcategoria);
    const ultimoNumero = productosEnSubcategoria.length > 0
      ? Math.max(...productosEnSubcategoria.map(p => parseInt(p.codigo.slice(2)))) + 1
      : 1;
    const codigo = prefix + ultimoNumero.toString().padStart(3, '0');

    const imagen = preview || ''; // Usa la vista previa (sea Data URL o URL)

    const nuevoProducto: Product = {
      codigo,
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen
    };

    onAddProduct(nuevoProducto); // Llama a la función del padre (AdminPage)

    // Resetea el formulario
    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setCategoria('');
    setSubcategoria('');
    setImagenUrl('');
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

        {/* Categoría */}
        <div>
          <label htmlFor="productCategory" className="block mb-1 font-medium">Categoría</label>
          <select id="productCategory" value={categoria} onChange={handleCategoriaChange} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Selecciona una categoría --</option>
            {Object.keys(subcategoriasMap).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Subcategoría (Dinámica) */}
        <div>
          <label htmlFor="productSubcategory" className="block mb-1 font-medium">Subcategoría</label>
          <select id="productSubcategory" value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">-- Selecciona una subcategoría --</option>
            {subcategoriasDisponibles.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

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