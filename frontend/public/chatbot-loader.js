(function() {
  const scriptTag = document.currentScript;
  const chatbotId = scriptTag.getAttribute('data-chatbot-id');
  const appOrigin = 'http://localhost:3000'; // In production, change this to your app's live URL
  const apiOrigin = 'https://normal-globally-gannet.ngrok-free.app'; // Your backend URL

  if (!chatbotId) {
    console.error('Cascade AI Error: The data-chatbot-id attribute is missing from the script tag.');
    return;
  }

  // Fetch the chatbot's public configuration
  fetch(`${apiOrigin}/api/v1/chatbots/${chatbotId}/public`)
    .then(response => {
      if (!response.ok) throw new Error('Chatbot configuration not found.');
      return response.json();
    })
    .then(config => {
      buildChatWidget(config); // Build the widget once we have the config
    })
    .catch(error => {
      console.error('Cascade AI Error:', error);
    });

  function buildChatWidget(config) {
    // --- Create the Chat Bubble ---
    const chatBubble = document.createElement('div');
    chatBubble.style.position = 'fixed';
    chatBubble.style.bottom = '20px';
    chatBubble.style.right = '20px';
    chatBubble.style.width = '60px';
    chatBubble.style.height = '60px';
    chatBubble.style.backgroundColor = '#5A47A5'; // Default background color
    chatBubble.style.borderRadius = '50%';
    chatBubble.style.cursor = 'pointer';
    chatBubble.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    chatBubble.style.display = 'flex';
    chatBubble.style.alignItems = 'center';
    chatBubble.style.justifyContent = 'center';
    chatBubble.style.zIndex = '9999';
    chatBubble.style.transition = 'transform 0.2s ease-in-out';

    // --- NEW: Use the custom bubble icon if it exists ---
    if (config.bubble_icon_url) {
      chatBubble.style.backgroundImage = `url(${config.bubble_icon_url})`;
      chatBubble.style.backgroundSize = 'cover';
      chatBubble.style.backgroundPosition = 'center';
    } else {
      // Otherwise, use a default SVG icon
      chatBubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 0 24 24" width="28px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
    }
    
    chatBubble.onmouseover = () => { chatBubble.style.transform = 'scale(1.1)'; };
    chatBubble.onmouseout = () => { chatBubble.style.transform = 'scale(1)'; };

    // --- Create the Iframe ---
    const chatIframe = document.createElement('iframe');
    chatIframe.src = `${appOrigin}/chatbot/${chatbotId}/public`;
    chatIframe.style.position = 'fixed';
    chatIframe.style.bottom = '90px';
    chatIframe.style.right = '20px';
    
    // --- THIS IS THE SIZE CHANGE ---
    chatIframe.style.width = '450px';   // Increased width
    chatIframe.style.height = '700px';  // Increased height
    
    chatIframe.style.border = 'none';
    chatIframe.style.borderRadius = '15px'; // Slightly more rounded
    chatIframe.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)'; // A softer shadow
    chatIframe.style.display = 'none';
    chatIframe.style.transition = 'opacity 0.3s, transform 0.3s ease-out';
    chatIframe.style.opacity = '0';
    chatIframe.style.transform = 'translateY(15px)';
    chatIframe.style.zIndex = '9998';
    
    // --- Toggle Logic ---
     let isOpen = false;
    chatBubble.onclick = () => {
      isOpen = !isOpen;
      if (isOpen) {
        // When the chat opens, hide the bubble
        chatBubble.style.display = 'none'; // <-- THIS IS THE NEW LINE
        
        // And show the iframe
        chatIframe.style.display = 'block';
        setTimeout(() => {
          chatIframe.style.opacity = '1';
          chatIframe.style.transform = 'translateY(0)';
        }, 10);
      } else {
        // When the chat closes, show the bubble again
        chatBubble.style.display = 'flex'; // <-- THIS IS THE NEW LINE
        
        // And hide the iframe
        chatIframe.style.opacity = '0';
        chatIframe.style.transform = 'translateY(20px)';
        setTimeout(() => {
          chatIframe.style.display = 'none';
        }, 300);
      }
    };

    document.body.appendChild(chatBubble);
    document.body.appendChild(chatIframe);
  }
})();