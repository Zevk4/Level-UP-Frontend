import { ReactNode, MouseEvent } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary' 
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}