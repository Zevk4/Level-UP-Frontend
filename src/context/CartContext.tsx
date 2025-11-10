import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../types'; // Importa los tipos

// 1. Definir la forma del Contexto
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (codigo: string) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotal: () => number;

    // --- ¡AÑADIDO! ---
    // Estado y funciones para controlar el panel (drawer)
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

// 2. Crear el Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Crear el Proveedor (El Componente "Cerebro")
interface CartProviderProps {
    children: ReactNode; // 'children' es nuestra App
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // 4. Estado: Inicializa el carrito desde localStorage
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    // --- ¡AÑADIDO! ---
    // Estado para el panel (drawer)
    const [isCartOpen, setIsCartOpen] = useState(false);

    // 5. Efecto: Guarda el carrito en localStorage CADA VEZ que cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // --- Funciones del Carrito (Sin cambios) ---

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.codigo === product.codigo);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.codigo === product.codigo
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { product: product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (codigo: string) => {
        setCartItems(prevItems => {
            return prevItems.filter(item => item.product.codigo !== codigo);
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
    };

    // --- ¡AÑADIDO! ---
    // Funciones para controlar el panel
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // 6. Valor que se expone a toda la app (con los nuevos valores)
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getItemCount,
        getTotal,
        // --- ¡AÑADIDO! ---
        isCartOpen,
        openCart,
        closeCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 7. Hook personalizado (la forma fácil de usar el contexto)
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};