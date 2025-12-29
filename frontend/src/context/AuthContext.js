
import React, { createContext, useState, useContext, useEffect } from 'react';


// This is the path to the default icon in your `public/icons/` folder.
const DEFAULT_USER_ICON = '/icons/user.png';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [token, setToken] = useState(localStorage.getItem("app_token"));
  
  
  // We will now manage the user's icon state right here.
  const [userIcon, setUserIcon] = useState(localStorage.getItem('userIcon') || DEFAULT_USER_ICON);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("app_token", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, "/"); 
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("app_token", newToken);
    setToken(newToken);
  };

  
  
  const updateUserIcon = (newIconUrl) => {
    // Add a timestamp to the URL to prevent browser caching issues.
    const cacheBustedUrl = `${newIconUrl}?t=${new Date().getTime()}`;
    
    localStorage.setItem('userIcon', cacheBustedUrl);
    setUserIcon(cacheBustedUrl);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    
    // Reset the icon to default when the user logs out.
    setUserIcon(DEFAULT_USER_ICON);
    window.location.href = '/login'; 
  };


  // Add userIcon and updateUserIcon to the context value.
  const value = { token, isLoading, userIcon, updateUserIcon, handleLoginSuccess, logout };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};