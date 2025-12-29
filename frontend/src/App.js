import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BuilderProvider } from './context/BuilderContext'; 

// Import Pages and Layouts
import LoginPage from './components/auth/LoginButton';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage'; 
import Dashboard from './pages/Dashboard';
import ChatbotBuilder from './pages/ChatbotBuilder';
import Documents from './pages/Documents';
import Icons from './pages/Icons';
import PublicChat from './pages/PublicChat';



// This component protects routes that require a user to be logged in
function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return token ? children : <Navigate to="/login" />;
}

// This component handles the login page route
function LoginRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute><LoginPage /></LoginRoute>} />
        <Route path="/chatbot/:chatbotId/public" element={<PublicChat />} />

        <Route 
          path="/" 
          element={<PrivateRoute><MainLayout /></PrivateRoute>}
        >
          <Route index element={<Navigate to="/home" replace />} /> 
          <Route path="home" element={<HomePage />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="icons" element={<Icons />} />
          
          
          {/* --- 2. WRAP THE BUILDER ROUTES --- */}
          <Route 
            path="chatbot/new" 
            element={
              <BuilderProvider>
                <ChatbotBuilder />
              </BuilderProvider>
            } 
          />
          <Route 
            path="chatbot/edit/:chatbotId" 
            element={
              <BuilderProvider>
                <ChatbotBuilder />
              </BuilderProvider>
            } 
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;