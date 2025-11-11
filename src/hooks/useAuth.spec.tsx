import React from 'react';
import { render } from '@testing-library/react';
import { useAuth } from './useAuth';

const TestComponent = () => {
  // Sólo intentar usar el hook (debe lanzar si no hay provider)
  useAuth();
  return <div />;
};

describe('useAuth hook', () => {
  it('lanza error si se usa fuera de AuthProvider', () => {
    const renderFn = () => render(<TestComponent />);
    expect(renderFn).toThrow();
  });
});
