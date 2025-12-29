import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { BuilderProvider } from '../../context/BuilderContext'
import './MainLayout.css'; // We will create this CSS file

const MainLayout = () => {
  return (
    // 2. WRAP the entire layout with BuilderProvider
    <BuilderProvider> 
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          {/* Outlet now renders all pages INSIDE the provider's scope */}
          <Outlet /> 
        </div>
      </div>
    </BuilderProvider>
  );
};

export default MainLayout;