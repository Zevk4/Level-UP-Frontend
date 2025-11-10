import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const { login } = useAuth();
  const { values, errors, handleChange, validate } = useForm({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    const result = login(values.email, values.password);
    
    if (result.success && result.user) {
      setMessage('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        if (result.user!.email.endsWith('@adminlvup.cl')) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } else {
      setMessage(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      
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

      <a href="#" className={styles.forgotLink}>
        ¿Olvidaste tu contraseña?
      </a>

      {message && (
        <p className={`${styles.message} ${message.includes('exitoso') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}

      <Button type="submit">Ingresar</Button>
    </form>
  );
}
