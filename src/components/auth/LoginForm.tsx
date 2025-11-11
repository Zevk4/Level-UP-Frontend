import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { AuthContextType } from '../../types/index';
import { useForm } from '../../hooks/useForm';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext) as AuthContextType;

  const { closeLoginModal } = useModal();

  const [authError, setAuthError] = useState<string>('');

  const { values, errors, handleChange, validate } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (validate()) {
      const result = login(values.email, values.password);

      if (result.success && result.user) {
        closeLoginModal();

        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setAuthError(result.message || 'Error desconocido');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />

      <h1 className={styles.title}>Iniciar Sesión</h1>
      <span className={styles.subtitle}>Ingresa con tu email y contraseña</span>

      {authError && <p className={styles.errorText}>{authError}</p>}

      <Button type="submit" variant="primary">
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;
