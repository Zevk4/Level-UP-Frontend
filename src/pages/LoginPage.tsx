import React from 'react';
import AuthLayout from 'components/auth/AuthLayout';
import MatrixCanvas from 'components/canvas/MatrixCanvas';
import 'styles/auth-page.css';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <MatrixCanvas />
      <div className="auth-form-container">
        <AuthLayout />
      </div>
    </div>
  );
};

export default LoginPage;