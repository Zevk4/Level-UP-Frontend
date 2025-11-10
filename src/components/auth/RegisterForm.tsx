import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const { register } = useAuth();
  const { values, errors, handleChange, validate, reset } = useForm({
    nombre: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    const result = register(values.nombre, values.email, values.password);
    setMessage(result.message || '');

    if (result.success) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Crear una cuenta</h1>
      <span className={styles.subtitle}>Utiliza tu email para registrarte</span>

      <Input
        name="nombre"
        placeholder="Nombre"
        value={values.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />
      
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

      {message && (
        <p className={`${styles.message} ${message.includes('exitoso') ? styles.success : styles.error}`}>
          {message}
        </p>
      )}

      <Button type="submit">Registrarte</Button>
    </form>
  );
}
