import { ChangeEvent, Dispatch, SetStateAction } from 'react';

// ============================================
// TIPOS DE USUARIO
// ============================================

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  role: "admin" | "vendedor" | "cliente";
}

export interface AuthUser {
  nombre: string;
  email: string;
  role: "admin" | "vendedor" | "cliente";
}

// --- Tipos de Datos (Basados en tus JSON) ---

export interface Product {
  codigo: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

export interface Category {
  title: string;
  link: string;
  subcategories: {
    name: string;
    link: string;
  }[];
}
// --- Tipos del Carrito ---

export interface CartItem {
  product: Product; // Usa la interfaz Product de arriba
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
  login: (email: string, password: string) => AuthResult;
  register: (nombre: string, email: string, password: string) => AuthResult;
  logout: () => void;
  loading: boolean;
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