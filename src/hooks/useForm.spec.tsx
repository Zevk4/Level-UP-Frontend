import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useForm } from './useForm';

// Componente de prueba para exponer el hook
const TestComponent: React.FC<any> = ({ initial = {} }) => {
  const { values, errors, handleChange, validate, reset, setFieldError } = useForm(initial);

  return (
    <div>
      <input name="email" value={values.email || ''} onChange={handleChange} placeholder="email" />
      <button onClick={() => {
        const ok = validate();
        (window as any).__lastValidate = ok;
      }}>validate</button>
      <button onClick={() => reset()}>reset</button>
      <button onClick={() => setFieldError('email', 'err')}>setErr</button>
      <div data-testid="error">{errors.email}</div>
    </div>
  );
};

describe('useForm hook', () => {
  it('handleChange actualiza values', () => {
    const { getByPlaceholderText } = render(<TestComponent initial={{ email: '' }} />);
    const input = getByPlaceholderText('email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a@a.com', name: 'email' } });
    expect((input as HTMLInputElement).value).toBe('a@a.com');
  });

  it('validate detecta email inválido y retorna false', () => {
    const { getByPlaceholderText, getByText } = render(<TestComponent initial={{ email: 'bad' }} />);
    const btn = getByText('validate');
    fireEvent.click(btn);
    expect((window as any).__lastValidate).toBe(false);
  });

  it('reset y setFieldError funcionan', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<TestComponent initial={{ email: 'a@a.com' }} />);
    const setErrBtn = getByText('setErr');
    fireEvent.click(setErrBtn);
    expect(getByTestId('error').textContent).toBe('err');

    const resetBtn = getByText('reset');
    fireEvent.click(resetBtn);
    // tras reset, error debería estar vacío
    expect(getByTestId('error').textContent).toBe('');
  });
});
