import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main className="container my-4" style={{ flexGrow: 1, padding: '0 20px', maxWidth: '75%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
