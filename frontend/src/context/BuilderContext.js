
import React, { createContext, useState, useContext } from 'react';

const BuilderContext = createContext();


const initialConfig = {
  chatbotTitle: 'CASACADE.AI Chatbot',
  welcomeMessage: 'Hi, how can I help you?',
  chatbotInstructions: 'You are a helpful AI assistant.',
  logoUrl: null,
  avatarUrl: '/icons/bot.png',
  bubbleIconUrl: null, 
  documentId: null,
  id: null 
};

export const BuilderProvider = ({ children }) => {
  const [chatbotConfig, setChatbotConfig] = useState(initialConfig);

 
  const updateConfig = (key, value) => {
    console.log("2. BuilderContext: State is being updated with key:", key, "and value:", value);
    setChatbotConfig(prev => ({ ...prev, [key]: value }));
  };
  
  
  const resetConfig = () => {
      setChatbotConfig(initialConfig);
  }

  const value = { chatbotConfig, updateConfig, resetConfig };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};


export const useBuilder = () => {
  return useContext(BuilderContext);
};