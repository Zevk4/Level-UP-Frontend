import { ChangeEvent, Dispatch, SetStateAction } from 'react';

// ============================================
// TIPOS DE USUARIO
// ============================================

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  role: "ADMIN" | "VENDEDOR" | "CLIENTE";
}

export interface AuthUser {
  nombre: string;
  email: string;
  role: "ADMIN" | "VENDEDOR" | "CLIENTE";
}

// ============================================
// TIPOS DE DATOS (PRODUCTOS Y CATEGORÍAS)
// ============================================

export interface Product {
  codigo: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
  marca: string;
}

// --- NUEVO: Interfaz explícita para Subcategorías ---
export interface Subcategory {
  id?: number; // Opcional (undefined al crear una nueva)
  name: string;
  link: string;
}

// --- ACTUALIZADO: Category con ID numérico ---
export interface Category {
  id?: number; // Ahora es number para coincidir con el backend (Long)
  title: string;
  link: string;
  subcategories: Subcategory[];
}

// ============================================
// TIPOS DEL CARRITO
// ============================================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (nombre: string, email: string, password: string, role?: string) => Promise<AuthResult>;
  logout: () => void;
  loading: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// ============================================
// TIPOS DE FORMULARIOS
// ============================================

export interface FormValues {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormReturn {
  values: FormValues;
  errors: FormErrors;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  validate: () => boolean;
  reset: () => void;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  setFieldError: (fieldName: string, errorMessage: string) => void;
}

// ============================================
// TIPOS DE COMPONENTES UI
// ============================================

export interface InputProps {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

// ============================================
// TIPOS DE CANVAS
// ============================================

export interface Pixel {
  x: number;
  y: number;
  z: number;
}