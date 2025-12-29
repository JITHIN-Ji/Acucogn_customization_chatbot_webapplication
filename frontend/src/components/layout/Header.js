import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css'; // We will create this CSS file
const Header = ({ title }) => {
const { logout } = useAuth();
return (
<header className="header">
<h1 className="header-title">{title}</h1>
<button className="logout-btn" onClick={logout}>
Logout
</button>
</header>
);
};