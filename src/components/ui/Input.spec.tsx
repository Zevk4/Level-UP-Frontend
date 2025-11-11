import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input component', () => {
  it('muestra el placeholder y el valor', () => {
    const { getByPlaceholderText } = render(
      <Input name="test" placeholder="Ingrese" value="hola" onChange={() => {}} />
    );

    const input = getByPlaceholderText('Ingrese') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('hola');
  });

  it('muestra mensaje de error cuando se pasa prop error', () => {
    const { getByText } = render(
      <Input name="test" placeholder="Ing" value="" onChange={() => {}} error="Error" />
    );

    const errorEl = getByText('Error');
    expect(errorEl).toBeTruthy();
  });
});
