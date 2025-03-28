import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call the backend API that triggers Nodemailer to send the email
      const response = await fetch('https://backend-cc-2j9t.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password reset link has been sent to your email. Please check your inbox.');
      } else {
        setMessage(data.message || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Password reset failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {!isSuccess ? (
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
          <p>Enter the email address associated with your account. We'll send you a link to reset your password.</p>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {message && (
            <div className={`message ${isSuccess ? 'success-message' : 'error-message'}`} role="alert">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="reset-password-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Password Reset Link'}
          </button>
        </form>
      ) : (
        <div className="success-container">
          <p>{message}</p>
          <button 
            className="back-to-login-button" 
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
