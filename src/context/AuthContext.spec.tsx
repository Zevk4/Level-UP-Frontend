import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';

describe('AuthContext (register/login/logout)', () => {
  beforeEach(() => {
    // limpiar storages
    localStorage.clear();
    sessionStorage.clear();
  });

  it('register agrega usuario a localStorage y retorna success', () => {
    let result: any;
    const Consumer = () => (
      <AuthContext.Consumer>
        {(ctx: any) => {
          const uniqueEmail = `test${Date.now()}@example.com`;
          result = ctx.register('Test', uniqueEmail, 'password');
          return null;
        }}</AuthContext.Consumer>
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
    // comprobar que localStorage contiene users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    expect(users.length).toBeGreaterThan(0);
  });

  it('login con usuario precargado retorna success o false segun credenciales', () => {
    let result: any;
    const Consumer = () => (
      <AuthContext.Consumer>
        {(ctx: any) => {
          // intentar login con credenciales falsas
          result = ctx.login('noexiste@test.com', 'bad');
          return null;
        }}</AuthContext.Consumer>
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(result).toBeTruthy();
    expect(typeof result.success).toBe('boolean');
  });

  it('logout limpia sessionStorage', () => {
    let ctxRef: any;
    const Consumer = () => (
      <AuthContext.Consumer>
        {(ctx: any) => {
          ctxRef = ctx;
          return null;
        }}</AuthContext.Consumer>
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

  // simular login guardando en sessionStorage
  sessionStorage.setItem('loggedInUser', JSON.stringify({ nombre: 'X', email: 'x@a.com' }));
  // envolver logout en act para evitar warnings sobre actualizaciones en tests
  act(() => ctxRef.logout());
    expect(sessionStorage.getItem('loggedInUser')).toBeNull();
  });
});
