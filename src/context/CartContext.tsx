import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from 'types';
import { useAuth } from 'hooks/useAuth';
import { storageService } from 'services/storageService'; // CAMBIO: Importar servicio

// 1. Definir la forma del Contexto
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (codigo: string) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotal: () => number;
    getDiscountedTotal: () => number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

// 2. Crear el Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Crear el Proveedor
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // 4. Estado: Inicializa el carrito desde el almacenamiento
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        // CAMBIO: Usar storageService.local
        return storageService.local.get<CartItem[]>('cart') || [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();

    // 5. Efecto: Guarda el carrito CADA VEZ que cambie
    useEffect(() => {
        // CAMBIO: Usar storageService.local
        storageService.local.set('cart', cartItems);
    }, [cartItems]);

    // --- Funciones del Carrito ---

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

    const getDiscountedTotal = () => {
        const total = getTotal();
        if (user && user.email.endsWith('@duocuc.cl')) {
            return total * 0.8;
        }
        return total;
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // 6. Valor que se expone
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getItemCount,
        getTotal,
        getDiscountedTotal,
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

// 7. Hook personalizado
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};