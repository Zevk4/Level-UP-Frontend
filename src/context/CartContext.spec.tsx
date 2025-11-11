import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react';
import { CartProvider, useCart } from './CartContext';
import { AuthProvider } from './AuthContext';

const Consumer = ({ onRun }: any) => {
  const { addToCart, getTotal, getDiscountedTotal } = useCart();
  onRun({ addToCart, getTotal, getDiscountedTotal });
  return null;
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('addToCart y getTotal funcionan y getDiscountedTotal aplica descuento según usuario', async () => {
    let api: any;
    // crear usuario en AuthProvider para aplicar descuento (email @duocuc.cl)
    sessionStorage.setItem('loggedInUser', JSON.stringify({ nombre: 'D', email: 'user@duocuc.cl' }));

    render(
      <AuthProvider>
        <CartProvider>
          <Consumer onRun={(val: any) => (api = val)} />
        </CartProvider>
      </AuthProvider>
    );

    // esperar a que los efectos se apliquen
    await act(async () => Promise.resolve());

    // producto de prueba
    const product = { codigo: 'p1', precio: 1000 } as any;
    // envolver actualización de estado en act
    act(() => {
      api.addToCart(product);
    });

    // luego verificar
    expect(api.getTotal()).toBe(1000);
    // con descuento 20% => 800
    expect(api.getDiscountedTotal()).toBeCloseTo(800);
  });
});
