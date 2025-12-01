import { useState, ChangeEvent, useCallback } from 'react';
import { FormValues, FormErrors, UseFormReturn } from 'types';

export const useForm = (initialValues: FormValues = {}): UseFormReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((name: string, value: string): string => {
    // Validar campo vacío
    if (!value.trim()) {
      return 'Este campo es requerido';
    }

    // Validar email
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email inválido';
      }
    }

    // Validar contraseña
    if (name === 'password') {
      if (value.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    // Validar nombre
    if (name === 'nombre') {
      if (value.length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
      }
    }

    return '';
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    // Actualizar valores
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo y actualizar los errores
    const error = validateField(name, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error };
      }
      // Si no hay error, eliminamos el error anterior para ese campo
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, [validateField]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    // Validar cada campo
    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    
    // Retornar true si no hay errores
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldError = useCallback((fieldName: string, errorMessage: string): void => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  }, []);

  return { 
    values, 
    errors, 
    handleChange, 
    validate, 
    reset, 
    setErrors,
    setFieldError 
  };
};