import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'context/AuthContext';
import { AuthContextType } from 'types';
import { useForm } from 'hooks/useForm';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext) as AuthContextType;

  const [authError, setAuthError] = useState<string>('');

  const { values, errors, handleChange, validate } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (validate()) {
      const result = await login(values.email, values.password);

      if (result.success && result.user) {
        if (result.user.role === 'ADMIN') {
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
