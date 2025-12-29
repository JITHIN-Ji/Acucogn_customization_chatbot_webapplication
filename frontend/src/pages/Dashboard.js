import React from 'react';
import { Link } from 'react-router-dom';

import { HiOutlineChatAlt2, HiOutlineUsers } from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>View and manage external chatbots</h1>
        <div className="header-buttons"> 
          <button className="header-button">Chat History</button>
          <Link to="/chatbot/new" className="header-button primary">
            + Add New Chatbot
          </Link>
        </div>
      </header>
      
      <div className="dashboard-grid">
        
        <div className="stat-card">What's New. <span>0</span></div>
        <div className="stat-card">New Agent Messages <span>0</span></div>
        <div className="stat-card">New AI Messages <span>0</span></div>
        <div className="stat-card">Total Messages <span>0</span></div>

        
        <div className="action-card">
          <div className="action-card-icon icon-create">
            <HiOutlineChatAlt2 />
          </div>
          <h3>Create and configure a chatbot</h3>
          <p>Create a chatbot that interacts with your users.</p>
          <Link to="/chatbot/new">+ Add New Chatbot</Link>
        </div>

        
        <div className="action-card">
          <div className="action-card-icon icon-explore">
            <HiOutlineUsers />
          </div>
          <h3>Explore recent conversations</h3>
          <p>Explore recent conversations from your users.</p>
          <Link to="#">+ AI Bot Messages</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;