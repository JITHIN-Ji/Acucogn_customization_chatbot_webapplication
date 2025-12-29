import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessage, getPublicChatbotConfig } from '../services/apiService';
import ChatWindow from '../components/common/ChatWindow';
import MessageInput from '../components/common/MessageInput';
import './PublicChat.css';

function PublicChat() {
  const { chatbotId } = useParams();
  const [messages, setMessages] = useState([]); 
  const [isSending, setIsSending] = useState(false);
  const [botConfig, setBotConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getPublicChatbotConfig(chatbotId);
        const config = response.data;
        
        setBotConfig(config);
        setMessages([{ role: 'assistant', content: config.welcome_message }]);

      } catch (error) {
        console.error("Failed to fetch public chatbot config:", error);
        setMessages([{ role: 'system', type: 'error', content: 'Could not load chat session.' }]);
      }
    };

    if (chatbotId) {
      fetchConfig();
    }
  }, [chatbotId]);


  const handleSendMessage = async (userInput) => {
    setIsSending(true);
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);

    try {
      const history = newMessages.filter(m => m.role !== 'system');
      const res = await sendMessage(userInput, history, chatbotId, null, 'chatbot');
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer, sources: res.data.sources || [] }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'system', type: 'error', content: 'Sorry, I am unable to respond right now.' }]);
    } finally {
      setIsSending(false);
    }
  };

  if (!botConfig) {
    return <div className="loading-container">Loading Chatbot...</div>;
  }

  return (
    <div className="public-chat-container">
      <ChatWindow 
        messages={messages} 
        
        
        userIcon={botConfig.user_icon_url || '/icons/user.png'} 
        
        chatbotIcon={botConfig.avatar_url || '/icons/bot.png'}
        title={botConfig.chatbot_title} 
      />
      <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}

export default PublicChat;