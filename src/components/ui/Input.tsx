import { ChangeEvent } from 'react';
import styles from './Input.module.css';

interface InputProps {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({ 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error 
}: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ''}`}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}