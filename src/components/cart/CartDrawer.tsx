import React from 'react';
import { useCart } from 'context/CartContext';
import { useAuth } from 'hooks/useAuth';
import './CartDrawer.css';

// 🧮 Helper para formatear el precio en pesos chilenos
const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);

const CartDrawer: React.FC = () => {
  // 📦 Hook del carrito
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    getTotal,
    getDiscountedTotal,
    clearCart,
  } = useCart();

  // 👤 Hook de autenticación
  const { user } = useAuth();

  // 🛒 Acción al finalizar compra
  const handleCheckout = () => {
    alert('¡Gracias por tu compra!');
    clearCart();
    closeCart();
  };

  return (
    <aside
      className={`drawer ${isCartOpen ? 'is-open' : ''}`}
      aria-labelledby="cartTitle"
      role="dialog"
      aria-modal="true"
    >
      {/* 🧭 Encabezado */}
      <div className="drawer-header">
        <h3 id="cartTitle">Tu carrito</h3>
        <button
          type="button"
          className="drawer-close-btn"
          onClick={closeCart}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* 🧾 Cuerpo del carrito */}
      <div className="drawer-body">
        {cartItems.length === 0 ? (
          <p className="cart-empty-message">Tu carrito está vacío.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product.codigo} className="cart-line">
              <img src={item.product.imagen} alt={item.product.nombre} />
              <div className="info">
                <strong>{item.product.nombre}</strong>
                <span className="price">
                  {formatPrice(item.product.precio)}
                </span>
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

      {/* 🧮 Totales y descuentos */}
      {cartItems.length > 0 && (
        <div className="drawer-footer">
          {/* Total bruto */}
          <div className="total">
            <span>Total</span>
            <strong>{formatPrice(getTotal())}</strong>
          </div>

          {/* Descuento DUOC si aplica */}
          {user && user.email.endsWith('@duocuc.cl') && (
            <>
              <div className="discount">
                <span>Descuento DUOC (20%)</span>
                <strong>
                  -{formatPrice(getTotal() - getDiscountedTotal())}
                </strong>
              </div>

              <div className="total-discounted">
                <span>Total con descuento</span>
                <strong>{formatPrice(getDiscountedTotal())}</strong>
              </div>
            </>
          )}

          {/* Botón de finalizar compra */}
          <button
            type="button"
            id="checkout"
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Finalizar compra
          </button>
        </div>
      )}
    </aside>
  );
};

export default CartDrawer;
