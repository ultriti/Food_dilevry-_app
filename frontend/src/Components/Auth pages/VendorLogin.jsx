import React, { useState } from "react";
import "./QuickBiteRegister.css";
import axios from "axios";

const VendorLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
    role: "VENDOR",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email";
    }

    if (formData.Password.length < 4) {
      newErrors.Password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Vendor login data:", formData);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_PORT}/api/User/Login`,
        formData,
        { withCredentials: true }
      );

      console.log("Login success:", response.data);
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "/VendorDashboard";
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors({
          Email: backendErrors.Email?.[0] || backendErrors.email?.[0] || "",
          Password:
            backendErrors.Password?.[0] || backendErrors.password?.[0] || "",
        });
      } else {
        alert(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="UserRegisterpage">
      <div className="userRegisterCont">
        <div className="bg-canvas">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="grain"></div>

        <div className="UserRegisterleft">
          <div className="floaters" aria-hidden="true">
            <span className="fi">🍕</span>
            <span className="fi">🍔</span>
            <span className="fi">🌮</span>
            <span className="fi">🍜</span>
            <span className="fi">🍣</span>
            <span className="fi">🥗</span>
          </div>

          <a
            href="index.html"
            className="logo"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="logo-icon">🛵</div>
            <div className="logo-name">
              Quick<span>Bite</span>
            </div>
          </a>

          <div className="badge">
            <span className="badge-dot"></span> Restaurant Partner Portal
          </div>

          <h1 className="headline">
            Welcome back.
            <br />
            Let’s get <em>cooking.</em>
          </h1>
          <p className="sub">
            Sign in to manage orders, update your menu, and track restaurant
            activity.
          </p>
        </div>

        <div className="UserRegisterright">
          <div className="card">
            <h2 className="card-title">Vendor Login 🔐</h2>
            <p className="card-sub">
              Sign in to access your restaurant dashboard.
            </p>

            <div className="socials">
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none">
                  {/* SVG for Google */}
                </svg>
                Continue with Google
              </button>
              <button className="social-btn" type="button">
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  {/* SVG for Facebook */}
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="divider">or login with email</div>

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
                    required
                  />
                </div>
                {errors.Email && (
                  <div
                    style={{
                      color: "#FF4D00",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
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
                    placeholder="Enter your password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.Password && (
                  <div
                    style={{
                      color: "#FF4D00",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.Password}
                  </div>
                )}
              </div>

              <div className="row">
                <label className="remember">
                  <input type="checkbox" name="rememberMe" />
                  Remember me
                </label>
              </div>

              <button
                className="btn-register"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in…" : "Login as Vendor"}{" "}
                {isLoading ? "" : "→"}
              </button>
            </form>

            <div className="signup-row">
              Don’t have an account? <a href="/VendorRegister">Register here</a>
            </div>
            <div className="signup-row" style={{ marginTop: "10px" }}>
              <a
                href="/"
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;