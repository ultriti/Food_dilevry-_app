import React, { useState } from 'react';
import './QuickBiteLogin.css';
import axios from 'axios';

const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Email: '',     // ✅ Changed back to Email
    Password: ''   // ✅ Changed back to Password
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Email) newErrors.Email = 'Email is required';
    if (formData.Password.length < 4) newErrors.Password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_PORT}/api/User/Login`,
        formData, // ✅ Sends { Email, Password }
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      const role = response.data.user?.role || 'USER';
      if (role === 'USER') {
        window.location.href = '/user-dashboard';
      } else if (role === 'VENDOR') {
        window.location.href = '/vendor-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response?.status === 400) {
        // Handle your backend error format
        if (error.response.data.error) {
          setErrors({ Email: error.response.data.error[0].message });
        }
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="UserLoginpage">
      <div className="userLoginCont">
        {/* Background Canvas */}
        <div className="bg-canvas">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="grain"></div>

        {/* Left Panel */}
        <div className="UserLoginleft">
          <div className="floaters" aria-hidden="true">
            <span className="fi">🍕</span>
            <span className="fi">🍔</span>
            <span className="fi">🌮</span>
            <span className="fi">🍜</span>
            <span className="fi">🍣</span>
            <span className="fi">🥗</span>
          </div>

          <a href="index.html" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-icon">🛵</div>
            <div className="logo-name">
              Quick<span>Bite</span>
            </div>
          </a>

          <div className="badge">
            <span className="badge-dot"></span> Now live in 50+ cities
          </div>

          <h1 className="headline">
            Hunger<br />
            solved in<br />
            <em>minutes.</em>
          </h1>
          <p className="sub">
            From your favourite local kitchens to your doorstep — hot, fresh, and ridiculously fast.
          </p>
        </div>

        {/* Right Panel */}
        <div className="UserLoginright">
          <div className="card">
            <h2 className="card-title">Welcome back 👋</h2>
            <p className="card-sub">Sign in to track orders & discover new bites.</p>

            {/* Social Buttons */}
            <div className="socials">
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.023 4.388 11.018 10.125 11.927v-8.437H7.078v-3.49h3.047V9.428c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.927-1.956 1.877v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.091 24 18.096 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div className="divider">or continue with email</div>

            {/* Form - EMAIL ONLY */}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="Email">Email Address</label>
                <div className="input-wrap">
                  <span className="icon">✉</span>
                  <input 
                    id="Email"
                    name="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.Email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.Email && (
                  <div style={{ color: '#FF4D00', fontSize: '12px', marginTop: '4px' }}>
                    {errors.Email}
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="Password">Password</label>
                <div className="input-wrap">
                  <span className="icon">🔒</span>
                  <input 
                    id="Password"
                    name="Password"
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.Password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    required
                  />
                </div>
                {errors.Password && (
                  <div style={{ color: '#FF4D00', fontSize: '12px', marginTop: '4px' }}>
                    {errors.Password}
                  </div>
                )}
              </div>

              <div className="row">
                <label className="remember">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    onChange={handleInputChange}
                  />
                  Keep me signed in
                </label>
                <a href="#" className="forgot">Forgot password?</a>
              </div>

              <button 
                className="btn-login" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in…' : 'Sign In'} {isLoading ? '' : '→'}
              </button>
            </form>

            <div className="signup-row">
              New here? <a href="/userRegister">Create a free account</a>
            </div>
            <div className="signup-row" style={{ marginTop: '10px' }}>
              <a href="index.html" style={{ color: 'var(--muted)', fontSize: '13px', textDecoration: 'none' }}>
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;