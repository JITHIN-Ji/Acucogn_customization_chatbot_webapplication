import React, { useState, useRef } from 'react';
import { uploadIcon } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

function CustomizeStep({ config, updateConfig, token }) {
  const { userIcon, updateUserIcon } = useAuth(); 
  const [isUploading, setIsUploading] = useState(null); // 'avatar', 'user', or 'bubble'
  const avatarInputRef = useRef(null);
  const userIconInputRef = useRef(null);
  const bubbleIconInputRef = useRef(null); // Make sure this ref is here

  const handleFileSelect = async (event, iconType) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(iconType);
    try {
      const response = await uploadIcon(file, token);
      const newIconUrl = `https://normal-globally-gannet.ngrok-free.app${response.data.url}`;
      const cacheBustedUrl = `${newIconUrl}?t=${new Date().getTime()}`;

      // This logic handles all three icon types
      if (iconType === 'user') {
        updateUserIcon(cacheBustedUrl);
      } else if (iconType === 'avatar') {
        updateConfig('avatarUrl', cacheBustedUrl);
      } else if (iconType === 'bubble') {
        updateConfig('bubbleIconUrl', cacheBustedUrl);
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Token Expired! Please Login..");
    } finally {
      setIsUploading(null);
    }
  };

  return (
    <div className="form-step">
      <h2>Customize</h2>
      <p>Personalize the appearance of your user avatar and chatbot icons.</p>

      {/* --- USER ICON UPLOAD (No changes needed) --- */}
      <div className="form-group">
        <label>Your User Icon</label>
        <p className="form-description">This is your personal avatar for all chats.</p>
        <div className="icon-upload-wrapper">
          <div className="icon-preview-box" onClick={() => userIconInputRef.current.click()} title="Click to upload new user icon">
            {isUploading === 'user' ? <div className="loader"></div> : <img src={userIcon} alt="User Avatar" className="avatar-preview"/>}
          </div>
          <div className="icon-upload-text">
            <button className="upload-button" onClick={() => userIconInputRef.current.click()}>Upload Image</button>
            <span>PNG, JPG, GIF (Max 5MB)</span>
          </div>
          <input type="file" ref={userIconInputRef} style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'user')}/>
        </div>
      </div>

      {/* --- CHATBOT ICON UPLOAD (No changes needed) --- */}
      <div className="form-group">
        <label>Chatbot Icon (Avatar)</label>
        <p className="form-description">The icon that appears inside the chat window.</p>
        <div className="icon-upload-wrapper">
          <div className="icon-preview-box" onClick={() => avatarInputRef.current.click()} title="Click to upload new chatbot icon">
            {isUploading === 'avatar' ? <div className="loader"></div> : <img src={config.avatarUrl} alt="Chatbot Avatar" className="avatar-preview"/>}
          </div>
          <div className="icon-upload-text">
            <button className="upload-button" onClick={() => avatarInputRef.current.click()}>Upload Image</button>
            <span>PNG, JPG, GIF (Max 5MB)</span>
          </div>
          <input type="file" ref={avatarInputRef} style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'avatar')}/>
        </div>
      </div>
      
      {/* --- THIS IS THE CORRECTED CHAT BUBBLE ICON SECTION --- */}
      <div className="form-group">
        <label>Chat Bubble Icon</label>
        <p className="form-description">The icon for the floating bubble on your website.</p>
        <div className="icon-upload-wrapper">
          <div className="icon-preview-box" onClick={() => bubbleIconInputRef.current.click()} title="Click to upload new bubble icon">
            {isUploading === 'bubble' ? 
              <div className="loader"></div> : 
              // This line is crucial. It says: "Try to use the config.bubbleIconUrl.
              // If it's null or undefined, use '/icons/default-bubble.png' instead."
              <img src={config.bubbleIconUrl || '/icons/default-bubble.png'} alt="Bubble Icon" className="avatar-preview"/>
            }
          </div>
          <div className="icon-upload-text">
            <button className="upload-button" onClick={() => bubbleIconInputRef.current.click()}>Upload Image</button>
            <span>PNG, JPG, GIF (Max 5MB)</span>
          </div>
          <input type="file" ref={bubbleIconInputRef} style={{ display: 'none' }} onChange={(e) => handleFileSelect(e, 'bubble')}/>
        </div>
      </div>

    </div>
  );
}

export default CustomizeStep;