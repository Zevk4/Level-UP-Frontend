// Define la estructura de tu 'productos.json'
export interface Product {
  codigo: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

// Define la estructura de tu 'categorias.json' (para el Mega Menú)
export interface Category {
  title: string;
  link: string;
  subcategories: {
    name: string;
    link: string;
  }[];
}

// Define la estructura de tu 'users.json' (para el Login)
export interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  role: "admin" | "vendedor" | "cliente"; // Usamos los roles que definiste
}