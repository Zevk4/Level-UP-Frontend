import { useState, ChangeEvent } from 'react';
import { FormValues, FormErrors, UseFormReturn } from '../types';

export const useForm = (initialValues: FormValues = {}): UseFormReturn => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    // Actualizar valores
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name: string, value: string): string => {
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
  };

  const validate = (): boolean => {
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
  };

  const reset = (): void => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldError = (fieldName: string, errorMessage: string): void => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  };

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