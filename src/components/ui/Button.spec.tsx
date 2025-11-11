import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renderiza el texto hijo correctamente', () => {
    const { getByText } = render(<Button>Click me</Button>);
    const el = getByText('Click me');
    expect(el).toBeTruthy();
  });

  it('llama onClick cuando se hace click', () => {
    const mockFn = jasmine.createSpy('onClick');
    const { getByText } = render(<Button onClick={mockFn}>Press</Button>);
    const btn = getByText('Press');
    fireEvent.click(btn);
    expect(mockFn).toHaveBeenCalled();
  });
});
