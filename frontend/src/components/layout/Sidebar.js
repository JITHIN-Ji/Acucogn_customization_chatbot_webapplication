import React from 'react';
import { NavLink } from 'react-router-dom';

import { 
  HiOutlineHome, 
  HiOutlineViewGrid, 
  HiOutlineDocumentText, 
  HiOutlineSparkles,
  HiOutlineLogout 
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext'; 
import './Sidebar.css';

const Sidebar = () => {
 
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/home">CASACADE.AI</NavLink>
      </div>

      {/* The main navigation takes up the available space */}
      <nav className="sidebar-nav">
        <NavLink to="/home">
          <HiOutlineHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard">
          <HiOutlineViewGrid />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/documents">
          <HiOutlineDocumentText />
          <span>Documents</span>
        </NavLink>
        <NavLink to="/icons">
          <HiOutlineSparkles />
          <span>Icons</span>
        </NavLink>
      </nav>

      
      {/* This new div will be pushed to the bottom */}
      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={logout}>
          <HiOutlineLogout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;