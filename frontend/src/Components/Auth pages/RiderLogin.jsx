import React, { useState } from 'react';
import './RiderLogin.css';

const RiderLogin = () => {
    const [activeTab, setActiveTab] = useState('phone'); // 'phone' or 'riderid'
    const [isLoading, setIsLoading] = useState(false);

    const switchTab = (mode) => {
        if (activeTab !== mode) {
            setActiveTab(mode);
        }
    };

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            navigate("/rider-dashboard"); // or "/rider-dashboard" depending on your route
        }, 1200);
    };

    return (
        <div className="Riderpage">

            <div className="RiderPageCont">


                {/* Background blobs */}
                <div className="bg-canvas">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                    <div className="blob blob-3"></div>
                </div>
                <div className="grain"></div>

                {/* Left panel */}
                <div className="RiderPageleft">
                    <div className="speed-lines" aria-hidden="true">
                        <div className="sl"></div>
                        <div className="sl"></div>
                        <div className="sl"></div>
                        <div className="sl"></div>
                    </div>

                    <a href="index.html" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="logo-icon">🛵</div>
                        <div className="logo-name">
                            Quick<span>Bite</span>
                        </div>
                    </a>

                    <div className="badge">
                        <span className="badge-dot"></span> Rider Portal — Live
                    </div>

                    <h1 className="headline">
                        Ride.<br />
                        Earn.<br />
                        <em>Repeat.</em>
                    </h1>

                    <p className="sub">
                        Your delivery dashboard. Accept orders, track your earnings, and manage your shifts — all in one place.
                    </p>

                    <div className="watermark" aria-hidden="true">🛵</div>
                </div>

                {/* Right panel (form) */}
                <div className="RiderPageright">
                    <div className="card">
                        <div className="card-logo">
                            <div className="card-logo-icon">🛵</div>
                            <div className="card-logo-text">
                                Quick<span>Bite</span>
                            </div>
                            <span className="rider-badge">Rider</span>
                        </div>

                        <div className="card-title">Welcome back 🏍️</div>
                        <p className="card-sub">Sign in to start accepting deliveries.</p>

                        {/* Tabs */}
                        <div className="tabs">
                            <button
                                type="button"
                                className={`tab ${activeTab === 'phone' ? 'active' : ''}`}
                                onClick={() => switchTab('phone')}
                            >
                                📱 Phone
                            </button>
                            <button
                                type="button"
                                className={`tab ${activeTab === 'riderid' ? 'active' : ''}`}
                                onClick={() => switchTab('riderid')}
                            >
                                🪪 Rider ID
                            </button>
                        </div>

                        {/* Phone form */}
                        <div className={`tab-form ${activeTab === 'phone' ? '' : 'hidden'}`} id="phone-form">
                            <div className="field">
                                <label>Phone Number</label>
                                <div className="input-wrap">
                                    <span className="icon">📱</span>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <div className="input-wrap">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rider ID form */}
                        <div className={`tab-form ${activeTab === 'riderid' ? '' : 'hidden'}`} id="riderid-form">
                            <div className="field">
                                <label>Rider ID</label>
                                <div className="input-wrap">
                                    <span className="icon">🪪</span>
                                    <input
                                        type="text"
                                        placeholder="e.g. RDR-204857"
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <div className="input-wrap">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <label className="remember">
                                <input type="checkbox" /> Stay signed in
                            </label>
                            <a href="#" className="forgot">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            className="btn-login"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connecting…' : 'Start Riding'} →
                        </button>

                        <div className="register-row">
                            New rider?{' '}
                            <a href="#">Apply to join the fleet</a>
                        </div>
                        <div className="register-row" style={{ marginTop: '10px' }}>
                            <a
                                href="index.html"
                                style={{ color: 'var(--muted)', fontSize: '13px', textDecoration: 'none' }}
                            >
                                ← Back to Home
                            </a>
                        </div>

                        <div className="help-bar">
                            ⚠️{' '}
                            <span>
                                Rider support: <strong>1800‑DELIVER</strong>
                            </span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default RiderLogin;