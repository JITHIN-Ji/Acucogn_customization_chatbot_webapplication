import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import '../../App.css'; // Ensure App.css is imported for message styles

// Helper function to create a clean, short display name for any source label.
const formatSourceLabel = (label) => {
  if (!label) return 'Unknown Source';
  try {
    if (label.startsWith('http')) {
      const url = new URL(label);
      let shortHost = url.hostname.replace('www.', '');
      return shortHost;
    }
  } catch (error) {
    // Not a valid URL, treat as filename
  }
  return label;
};

function ChatWindow({ messages, userIcon, chatbotIcon, title }) {
  const messageListRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getIconUrl = (iconPath) => {
    if (!iconPath) return '/icons/bot.png'; // Add a fallback for safety
    if (iconPath.startsWith('/uploads/')) {
      return `https://normal-globally-gannet.ngrok-free.app${iconPath}`;
    }
    return iconPath;
  };

  return (
    // --- THIS IS THE ONLY CHANGE ---
    // We wrap the entire component in a div with a new class name.
    // This allows the CSS in ChatbotBuilder.css to correctly size this component.
    <div className="chat-window-wrapper">
      <ChatHeader title={title} avatarUrl={getIconUrl(chatbotIcon)} />

      <div className="chat-window-container">
        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && (
            <div className="message system info">
              <div className="message-bubble">
                Get started by configuring your chatbot!
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            switch (msg.role) {
              case 'user':
                return (
                  <div key={index} className="message user">
                    <div className="message-avatar">
                      <img src={getIconUrl(userIcon)} alt="user avatar" className="avatar-image" />
                    </div>
                    <div className="message-bubble">{msg.content}</div>
                  </div>
                );

              case 'assistant':
                return (
                  <div key={index} className="message assistant">
                    <div className="message-avatar">
                       <img src={getIconUrl(chatbotIcon)} alt="bot avatar" className="avatar-image" />
                    </div>
                    <div className="message-bubble">
                      {msg.content}
                      {Array.isArray(msg.sources) && msg.sources.length > 0 && (
                        <div className="message-sources">
                          <strong>Sources:</strong>
                          <ul>
                            {msg.sources.map((src, i) => {
                              const fullLabel = src.label || 'Unknown Source';
                              const shortLabel = formatSourceLabel(fullLabel);
                              const isUrl = fullLabel.startsWith('http');
                              const pageInfo = src.page > 0 ? ` (p. ${src.page})` : '';
                              return (
                                <li key={i}>
                                  {isUrl ? (
                                    <a href={fullLabel} title={fullLabel} target="_blank" rel="noopener noreferrer">
                                      {shortLabel}{pageInfo}
                                    </a>
                                  ) : (
                                    <span title={fullLabel}>
                                      {shortLabel}{pageInfo}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );

              case 'system':
                const messageType = msg.type || 'info'; 
                return (
                  <div key={index} className={`message system ${messageType}`}>
                    <div className="message-bubble">{msg.content}</div>
                  </div>
                );

              default:
                return null;
            }
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;