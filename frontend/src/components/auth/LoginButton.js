import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://normal-globally-gannet.ngrok-free.app';

function LoginPage() {
  const { handleLoginSuccess, authError } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/login`;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isLoginView && password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const endpoint = isLoginView
      ? '/api/v1/auth/token'
      : '/api/v1/auth/register';

    const headers = {};
    let body;

    if (isLoginView) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = new URLSearchParams({ username: email, password: password });
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({ email, password });
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed.');
      }
      if (isLoginView) {
        handleLoginSuccess(data.access_token);
      } else {
        const loginResponse = await fetch(
          `${API_URL}/api/v1/auth/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              username: email,
              password: password,
            }),
          }
        );
        const loginData = await loginResponse.json();
        if (!loginResponse.ok)
          throw new Error(loginData.detail || 'Login after signup failed.');
        handleLoginSuccess(loginData.access_token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-layout">
      {/* --- Left Column for Branding --- */}
      <div className="login-promo-panel">
        <div className="promo-content">
          <h1 className="promo-logo">CASACADE.AI</h1>
          <h2 className="promo-title">
            Build, Train, and Deploy AI Chatbots in Minutes.
          </h2>
          <p className="promo-description">
            Instantly learn from your documents, websites, and knowledge bases
            to create a chatbot that provides intelligent, context-aware answers
            automatically.
          </p>
        </div>
      </div>

      {/* --- Right Column --- */}
      <div className="login-form-panel">
        
        {/* --- Top Navigation --- */}
        <div className="form-header-nav">
          <button className="nav-btn">About Us</button>
          <button className="nav-btn">Contact Us</button>
          <button className="nav-btn">Features</button>
          <button
            className={`nav-btn ${isLoginView ? 'active' : ''}`}
            onMouseEnter={() => { setIsLoginView(true); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`nav-btn ${!isLoginView ? 'active' : ''}`}
            onMouseEnter={() => { setIsLoginView(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* --- Auth Card --- */}
        <div className="auth-card">
          <h2>{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h2>
          <p className="auth-subtitle">
            {isLoginView
              ? 'Sign in to manage your chatbots.'
              : 'Get started for free.'}
          </p>

          <form onSubmit={handleAuthSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLoginView ? 'current-password' : 'new-password'}
              />
            </div>
            {!isLoginView && (
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {(error || authError) && (
              <p className="error-message">{error || authError}</p>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading
                ? 'Processing...'
                : isLoginView
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="divider-alt">
            <span>OR</span>
          </div>

          <button className="google-auth-button" onClick={handleGoogleLogin}>
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
