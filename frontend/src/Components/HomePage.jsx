import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const nav = useNavigate()
  return (
    <div className="Homepage">
      {/* Background blobs */}
      <div className="bg-canvas">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="grain"></div>

     



      <div className="topFramehome">

         {/* Floating food emojis */}
      <div className="floaters" aria-hidden="true">
        <span className="fi">🍕</span>
        <span className="fi">🍔</span>
        <span className="fi">🌮</span>
        <span className="fi">🍜</span>
        <span className="fi">🍣</span>
        <span className="fi">🥗</span>
        <span className="fi">🍗</span>
      </div>


        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">🛵</div>
          <div className="logo-name">
            Quick<span>Bite</span>
          </div>
        </div>

        <h1 className="tagline">
          One app.<br />
          <em>Three portals.</em>
        </h1>

        <p className="sub">
          Choose who you are to get started. Customers, riders and restaurant partners all have their own experience.
        </p>


      </div>


      <div className="bottomFramehome">

        {/* Portal cards */}
        <div className="portals">
          <a className="portal-card" href="/userLogin">
            <div className="portal-emoji">🍽️</div>
            <span className="portal-badge badge-user">Customer</span>
            <div className="portal-title">I'm Hungry</div>
            <div className="portal-desc">
              Order food from your favourite restaurants and get it delivered fast.
            </div>
            <div className="portal-arrow">→</div>
          </a>

          <a className="portal-card" href="/RiderLogin">
            <div className="portal-emoji">🛵</div>
            <span className="portal-badge badge-rider">Rider</span>
            <div className="portal-title">I'm a Rider</div>
            <div className="portal-desc">
              Accept deliveries, track earnings and manage your shifts on the go.
            </div>
            <div className="portal-arrow">→</div>
          </a>

          <a className="portal-card" href="/vendorRegister">
            <div className="portal-emoji">🏪</div>
            <span className="portal-badge badge-rest">Restaurant</span>
            <div className="portal-title">I'm a Partner</div>
            <div className="portal-desc">
              Manage your menu, live orders and grow your restaurant business.
            </div>
            <div className="portal-arrow">→</div>
          </a>
        </div>
      </div>



    </div>
  );
};

export default HomePage;