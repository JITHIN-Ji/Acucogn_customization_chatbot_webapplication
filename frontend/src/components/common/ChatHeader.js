import React from 'react';
import './ChatHeader.css'; // We will create this CSS file

function ChatHeader({ title, avatarUrl }) {
  // A helper function to create an initial from the title
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="chat-header-container">
      <div className="chat-header-avatar-wrapper">
        {avatarUrl.includes('/uploads/') ? (
          <img src={avatarUrl} alt="Chatbot Avatar" className="chat-header-avatar" />
        ) : (
          <div className="chat-header-avatar-initials">
            {getInitials(title)}
          </div>
        )}
      </div>
      <div className="chat-header-info">
        <h3 className="chat-header-title">{title}</h3>
        <span className="chat-header-status">Online</span>
      </div>
      <button className="chat-close-btn">&times;</button>
    </div>
  );
}

export default ChatHeader;