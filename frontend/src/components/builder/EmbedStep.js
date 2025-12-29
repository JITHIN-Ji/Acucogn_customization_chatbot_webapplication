import React from 'react';

function EmbedStep({ config }) {
 
  const chatbotId = config.id;
  
  const embedCode = `<script 
  src="http://localhost:3000/chatbot-loader.js" 
  data-chatbot-id="${chatbotId}"
  defer>
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  return (
    <div className="form-step">
      <h2>Embed Your Chatbot</h2>
      
      {chatbotId ? (
        <>
          <p>Success! Your chatbot has been saved. You can now copy this code and paste it onto your website.</p>
          <div className="form-group">
            <label>Embed Code</label>
            <div className="embed-code-container">
              <pre><code>{embedCode}</code></pre>
              <button onClick={copyToClipboard} className="copy-btn">Copy</button>
            </div>
          </div>
        </>
      ) : (
        <p>There was an error generating the embed code. Please try saving again from the previous step.</p>
      )}
    </div>
  );
}

export default EmbedStep;