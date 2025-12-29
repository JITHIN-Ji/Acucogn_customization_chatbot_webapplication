import React from 'react';

function ConfigureStep({ config, updateConfig }) {
  return (
    <div className="form-step">
      <h2>Configure</h2>
      <p>Create and configure a chatbot that interacts with your users, ensuring it delivers accurate information.</p>

      <div className="form-group">
        <label htmlFor="chatbotTitle">Chatbot Title</label>
        <input
          type="text"
          id="chatbotTitle"
          value={config.chatbotTitle}
          onChange={(e) => updateConfig('chatbotTitle', e.target.value)}
        />
      </div>
       {/* <div className="form-group">
        <label htmlFor="bubbleMessage">Bubble Message</label>
        <input
          type="text"
          id="bubbleMessage"
          value={config.bubbleMessage}
          placeholder="Hey there. How can I help you?"
          onChange={(e) => updateConfig('bubbleMessage', e.target.value)}
        />
      </div> */}

      <div className="form-group">
        <label htmlFor="welcomeMessage">Welcome Message</label>
        <input
          type="text"
          id="welcomeMessage"
          value={config.welcomeMessage}
          placeholder="Hi, how can I help you?"
          onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
        />
      </div>

      {/* --- CHANGE IS HERE --- */}
      <div className="form-group">
        <label htmlFor="systemPrompt">System Prompt</label>
        <p className="form-description">Define the chatbot's personality and instructions.</p>
        <textarea
          id="systemPrompt"
          rows="4"
          placeholder="e.g., Act as a friendly teacher who explains concepts simply."
          // Note: We use the 'chatbotInstructions' key from our config state
          value={config.chatbotInstructions} 
          onChange={(e) => updateConfig('chatbotInstructions', e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default ConfigureStep;