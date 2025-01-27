import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupModal from './SignupModal';
import '../index.css';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const ROLE_REDIRECTS = {
  Employee: '/employee',
  'Department Manager': '/department-manager',
  'Finance Manager': '/finance-manager',
  'Transport Manager': '/transport-manager',
  CEO: '/ceo',
  Driver: '/driver',
  'System Admin': '/admin',
};

const LoginModal = ({ onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { mylanguage } = useLanguage();
  const { myTheme } = useTheme();
  const navigate = useNavigate();

  if (showSignup) {
    return <SignupModal onClose={() => setShowSignup(false)} />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user and get token
      const tokenResponse = await axios.post('http://127.0.0.1:8000/api/token/', { email, password });
      const { access } = tokenResponse.data;
      localStorage.setItem('authToken', access);

      // Fetch user details
      const userResponse = await axios.get('http://127.0.0.1:8000/api/user/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      const { role } = userResponse.data;

      // Redirect to the appropriate role page
      const redirectPath = ROLE_REDIRECTS[role] || '/unknown-role';
      if (redirectPath === '/unknown-role') {
        setError(
          mylanguage === 'EN'
            ? 'Unknown role. Please contact support.'
            : 'ያልታወቀ ሚና። እባኮትን ድጋፍ ያግኙ።'
        );
        return;
      }
      onClose();
      navigate(redirectPath);
    } catch (err) {
      setError(
        mylanguage === 'EN'
          ? 'Invalid email or password. Please try again.'
          : 'የተሳሳተ ኢሜል ወይም ፓስወርድ። እባኮትን እንደገና ይሞክሩ።'
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className={`card p-4 shadow" style={{ width: '22rem', position: 'relative' }} ${
          myTheme === 'dark' ? 'dark' : 'light'
        }`}
      >
        <button
          className="btn-close"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        ></button>
        <h1 className="text-center mb-4">{mylanguage === 'EN' ? 'Login' : 'መግቢያ'}</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              {mylanguage === 'EN' ? 'Email Address' : 'የኢሜል አድራሻ'}
            </label>
            <input
              type="email"
              className="form-control"
              id="login-email"
              placeholder={
                mylanguage === 'EN' ? 'Your email address' : 'የኢሜል አድራሻዎን ያስገቡ'
              }
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">
              {mylanguage === 'EN' ? 'Password' : 'ፓስወርድ'}
            </label>
            <input
              type="password"
              className="form-control"
              id="login-password"
              placeholder={
                mylanguage === 'EN' ? 'Your password' : 'ፓስወርድዎን ያስገቡ'
              }
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#27485D', color: '#ffffff' }}
          >
            {mylanguage === 'EN' ? 'Login' : 'ይግቡ'}
          </button>
        </form>
        <div className="text-center mt-3">
          {mylanguage === 'EN'
            ? "Don't have an account?"
            : 'አካዉንት የሎትም?'}
          <a
            href="#"
            className="text-decoration-none signup"
            onClick={() => setShowSignup(true)}
          >
            {mylanguage === 'EN' ? 'Sign Up' : 'ይመዝገቡ'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
