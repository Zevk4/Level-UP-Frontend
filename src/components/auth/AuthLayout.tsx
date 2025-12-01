import { useState } from 'react';
import LoginForm from 'components/auth/LoginForm';
import RegisterForm from 'components/auth/RegisterForm';
import Button from 'components/ui/Button';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  return (
    <div className={`auth-container ${isRegister ? 'active' : ''}`}>
      {/* Formulario de Registro */}
      <div className="form-container register">
        <RegisterForm />
        <p className={`mobile-toggle-text ${styles.mobileToggleText}`}>
          ¿Ya tienes una cuenta?{' '}
          <a onClick={() => setIsRegister(false)} className={styles.link}>
            Inicia Sesión
          </a>
        </p>
      </div>

      {/* Formulario de Login */}
      <div className="form-container login">
        <LoginForm />
        <p className={`mobile-toggle-text ${styles.mobileToggleText}`}>
          ¿No tienes una cuenta?{' '}
          <a onClick={() => setIsRegister(true)} className={styles.link}>
            Regístrate
          </a>
        </p>
      </div>

      {/* Panel Toggle (Desktop) */}
      <div className="alternar-container">
        <div className="alternar">
          <div className="alternar-panel alternar-izquierda">
            <h1>¡Bienvenido de Nuevo!</h1>
            <p>Ingresa con la información de tu cuenta</p>
            <Button variant="secondary" onClick={() => setIsRegister(false)}>
              Ingresar
            </Button>
          </div>
          <div className="alternar-panel alternar-derecha">
            <h1>Crea una cuenta</h1>
            <p>Regístrate con tus datos para empezar</p>
            <Button variant="secondary" onClick={() => setIsRegister(true)}>
              Registrarte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
