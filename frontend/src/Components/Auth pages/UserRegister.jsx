import React, { useState } from 'react';
import './QuickBiteRegister.css';
import axios from 'axios';

const UserRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    phoneNumber: '',
    role: 'USER'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.Username.length < 3) newErrors.Username = 'Name must be at least 3 characters';
    if (!/^\S+@\S+\.\S+$/.test(formData.Email)) newErrors.Email = 'Please enter a valid email';
    if (formData.Password.length < 4) newErrors.Password = 'Password must be at least 4 characters';
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) newErrors.phoneNumber = 'Please enter a valid phone number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    console.log("Register data:", formData);
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_PORT}/api/User/Register`, 
        formData, 
        { withCredentials: true }
      );

      console.log("Success:", response.data);
      alert("Registration successful! Redirecting to login...");
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors({
          Username: backendErrors.Username?.[0] || backendErrors.userName?.[0] || '',
          Email: backendErrors.Email?.[0] || backendErrors.email?.[0] || '',
          phoneNumber: backendErrors.phoneNumber?.[0] || '',
          Password: backendErrors.Password?.[0] || backendErrors.password?.[0] || ''
        });
      } else {
        alert(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="UserRegisterpage">
      <div className="userRegisterCont">
        {/* Background Canvas */}
        <div className="bg-canvas">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="grain"></div>

        {/* Left Panel */}
        <div className="UserRegisterleft">
          <div className="floaters" aria-hidden="true">
            <span className="fi">🍕</span><span className="fi">🍔</span><span className="fi">🌮</span>
            <span className="fi">🍜</span><span className="fi">🍣</span><span className="fi">🥗</span>
          </div>

          <a href="index.html" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-icon">🛵</div>
            <div className="logo-name">Quick<span>Bite</span></div>
          </a>

          <div className="badge">
            <span className="badge-dot"></span> Join 1M+ happy customers
          </div>

          <h1 className="headline">
            Join Quick<span>Bite</span><br />in one <em>click.</em>
          </h1>
          <p className="sub">
            Create your account to order from your favourite local kitchens — hot, fresh, and ridiculously fast.
          </p>
        </div>

        {/* Right Panel */}
        <div className="UserRegisterright">
          <div className="card">
            <h2 className="card-title">Create Account 🎉</h2>
            <p className="card-sub">Join QuickBite and start ordering in minutes.</p>

            <div className="socials">
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none">...</svg>Continue with Google
              </button>
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="#1877F2">...</svg>Continue with Facebook
              </button>
            </div>

            <div className="divider">or create account with email</div>

            <form onSubmit={handleRegister}>
              <div className="field">
                <label htmlFor="Username">Full Name</label>
                <div className="input-wrap">
                  <span className="icon">👤</span>
                  <input 
                    id="Username"
                    name="Username"
                    type="text" 
                    placeholder="John Doe" 
                    value={formData.Username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.Username && <div style={{color: '#FF4D00', fontSize: '12px', marginTop: '4px'}}>{errors.Username}</div>}
              </div>

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
                    required
                  />
                </div>
                {errors.Email && <div style={{color: '#FF4D00', fontSize: '12px', marginTop: '4px'}}>{errors.Email}</div>}
              </div>

              <div className="field">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className="input-wrap">
                  <span className="icon">📱</span>
                  <input 
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.phoneNumber && <div style={{color: '#FF4D00', fontSize: '12px', marginTop: '4px'}}>{errors.phoneNumber}</div>}
              </div>

              <div className="field">
                <label htmlFor="Password">Password</label>
                <div className="input-wrap">
                  <span className="icon">🔒</span>
                  <input 
                    id="Password"
                    name="Password"
                    type="password" 
                    placeholder="Create a password" 
                    value={formData.Password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.Password && <div style={{color: '#FF4D00', fontSize: '12px', marginTop: '4px'}}>{errors.Password}</div>}
              </div>

              <div className="row">
                <label className="remember">
                  <input type="checkbox" name="terms" onChange={handleInputChange} required />
                  I agree to Terms of Service & Privacy Policy
                </label>
              </div>

              <button className="btn-register" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account…' : 'Create Account'} {isLoading ? '' : '→'}
              </button>
            </form>

            <div className="signup-row">
              Already have an account? <a href="/userLogin">Sign in here</a>
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

export default UserRegister;