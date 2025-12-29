import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';
import { saveChatbot } from '../services/apiService';
import { HiCheck } from 'react-icons/hi'; 

// Import step components
import ConfigureStep from '../components/builder/ConfigureStep';
import CustomizeStep from '../components/builder/CustomizeStep';
import TrainStep from '../components/builder/TrainStep';
import EmbedStep from '../components/builder/EmbedStep';

// Import common components
import ChatWindow from '../components/common/ChatWindow';

// Import CSS
import './ChatbotBuilder.css';

// This is the new, smarter Stepper component
const Stepper = ({ currentStep, setCurrentStep }) => {
  const steps = ['Configure', 'Customize', 'Train', 'Embed', 'Channel'];
  
  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={step}>
            <button 
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              // Allow users to click back to previously completed steps
              onClick={() => { if (isCompleted) setCurrentStep(stepNumber); }}
            >
              <div className="step-counter">
                {/* Conditionally render a checkmark icon if the step is completed */}
                {isCompleted ? <HiCheck /> : stepNumber}
              </div>
              <div className="step-name">{step}</div>
            </button>
            {/* Also apply a 'completed' class to the connector line */}
            {index < steps.length - 1 && <div className={`step-connector ${isCompleted ? 'completed' : ''}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Main component function with the new JSX structure
function ChatbotBuilder() {
  const { token, userIcon } = useAuth();
  const { chatbotConfig, updateConfig, resetConfig } = useBuilder(); 
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveAndProceed = async () => {
    if (isSaving || chatbotConfig.id) {
      setCurrentStep(4);
      return;
    }
    setIsSaving(true);
    try {
      const finalConfig = { ...chatbotConfig, userIconUrl: userIcon };
      const response = await saveChatbot(finalConfig, token);
      updateConfig('id', response.data.id);
      setCurrentStep(4);
    } catch (error) {
      console.error("Failed to save chatbot:", error);
      alert("Error: Could not save the chatbot. Please check the console and backend logs.");
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));

  const handleFinish = () => {
    resetConfig();
    navigate('/dashboard');
  };

  const previewMessages = [
    { role: 'assistant', content: chatbotConfig.welcomeMessage },
    { role: 'user', content: 'I need to make a refund.' },
    { role: 'assistant', content: 'A refund will be provided after we process your return item.' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ConfigureStep config={chatbotConfig} updateConfig={updateConfig} />;
      case 2:
        return <CustomizeStep config={chatbotConfig} updateConfig={updateConfig} token={token} />;
      case 3:
        return <TrainStep config={chatbotConfig} updateConfig={updateConfig} token={token} />;
      case 4:
        return <EmbedStep config={chatbotConfig} />;
      case 5:
        return <div><h2>Channel</h2><p>This is a placeholder for the Channel step, where you can configure additional platforms for your chatbot.</p></div>;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="builder-page-container">
      <header className="builder-header">
        <div className="header-left">
          <button className="close-customizer-btn" onClick={() => navigate('/dashboard')}>&lt; Close Customizer</button>
        </div>
        <div className="header-center">
            <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} /> 
        </div>
        <div className="header-right">
            <h3>Editing: {chatbotConfig.chatbotTitle}</h3>
        </div>
      </header>

      <main className="builder-main-content">
        {/* Left Side: The Form Panel */}
        <div className="builder-form-panel">
          <div className="builder-step-content">
            {isSaving ? <div><p>Saving your chatbot, please wait...</p></div> : renderStep()}
          </div>
          <div className="builder-navigation">
            {currentStep > 1 && <button onClick={prevStep} className="nav-btn-secondary">Previous</button>}
            {[1, 2, 4].includes(currentStep) && <button onClick={nextStep} className="nav-btn-primary">Next</button>}
            {currentStep === 3 && <button onClick={handleSaveAndProceed} className="nav-btn-primary" disabled={!chatbotConfig.documentId || isSaving}>{isSaving ? 'Saving...' : 'Save Chatbot'}</button>}
            {currentStep === 5 && <button onClick={handleFinish} className="nav-btn-primary">Finish</button>}
          </div>
        </div>

        {/* Right Side: The Preview Panel */}
        <div className="builder-preview-panel">
          <ChatWindow 
            messages={previewMessages}
            userIcon={userIcon}
            chatbotIcon={chatbotConfig.avatarUrl}
            title={chatbotConfig.chatbotTitle} 
          />
        </div>
      </main>
    </div>
  );
}

export default ChatbotBuilder;