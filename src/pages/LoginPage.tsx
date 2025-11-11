import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import MatrixCanvas from '../components/canvas/MatrixCanvas';
import { useModal } from '../context/ModalContext';
import './LoginPage.css';
import '../styles/auth.css';
import '../styles/auth-fixed.css';
import '../styles/auth-responsive.css';

const LoginPage: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal } = useModal();

  if (!isLoginModalOpen) {
    return null;
  }

  return (
    <div className="login-modal-overlay" onClick={closeLoginModal}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <MatrixCanvas />
        <AuthLayout />
        <button className="close-button" onClick={closeLoginModal}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
