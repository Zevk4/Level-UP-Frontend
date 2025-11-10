import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

// Función helper para formatear el precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
};

const CartDrawer: React.FC = () => {
  // 1. Obtener 'clearCart' además de las otras funciones
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    getTotal,
    clearCart // <-- ¡Importante!
  } = useCart();

  // 2. Crear la función de "Finalizar Compra"
  const handleCheckout = () => {
    // 1. Simular la compra con una alerta
    alert('¡Gracias por tu compra!');
    
    // 2. Vaciar el carrito
    clearCart();
    
    // 3. Cerrar el panel
    closeCart();
  };

  return (
    <aside className={`drawer ${isCartOpen ? 'is-open' : ''}`} aria-labelledby="cartTitle" role="dialog" aria-modal="true">
      
      <div className="drawer-header">
        <h3 id="cartTitle">Tu carrito</h3>
        <button type="button" className="drawer-close-btn" onClick={closeCart} aria-label="Cerrar">✕</button>
      </div>

      <div className="drawer-body">
        {cartItems.length === 0 ? (
          <p className="cart-empty-message">Tu carrito está vacío.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.product.codigo} className="cart-line">
              <img src={item.product.imagen} alt={item.product.nombre} />
              <div className="info">
                <strong>{item.product.nombre}</strong>
                <span className="price">{formatPrice(item.product.precio)}</span>
              </div>
              <div className="actions">
                <span className="quantity">x {item.quantity}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.codigo)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Solo mostramos el footer si hay items */}
      {cartItems.length > 0 && (
        <div className="drawer-footer">
          <div className="total">
            <span>Total</span>
            <strong>{formatPrice(getTotal())}</strong>
          </div>
          
          {/* 3. Conectar el botón a la nueva función */}
          <button 
            type="button" 
            id="checkout"
            onClick={handleCheckout} // ¡AQUÍ ESTÁ LA MAGIA!
          >
            Finalizar compra
          </button>
        </div>
      )}
    </aside>
  );
};

export default CartDrawer;