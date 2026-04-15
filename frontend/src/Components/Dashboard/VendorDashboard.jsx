import React from 'react';
import './VendorDashboard.css';

const VendorDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo">QuickBite<span className="dot">.</span></div>
                <nav className="nav-menu">
                    <div className="nav-item active">Dashboard</div>
                    <div className="nav-item">Menu Management</div>
                    <div className="nav-item">Orders</div>
                    <div className="nav-item">Earnings</div>
                    <div className="nav-item">Settings</div>
                </nav>
                <div className="upgrade-card">
                    <p>Boost your reach with Pro Plan</p>
                    <button className="btn-primary">Upgrade</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <div className="MainCont">
                    <header className="main-header">
                        <h1>Welcome back, Kitchen Partner</h1>
                        <div className="search-bar">
                            <input type="text" placeholder="Search orders, dishes..." />
                        </div>
                    </header>

                    <section className="banner">
                        <div className="banner-text">
                            <h2>Commission 0% for your first month!</h2>
                            <p>Onboard your signature dishes and start selling today.</p>
                        </div>
                    </section>

                    <section className="stats-grid">
                        <div className="stat-card"><h3>Total Orders</h3><p>124</p></div>
                        <div className="stat-card"><h3>Active Menu</h3><p>12 Items</p></div>
                        <div className="stat-card"><h3>Rating</h3><p>4.8 ★</p></div>
                    </section>

                    <section className="product-section">
                        <div className="section-header">
                            <h3>Your Top Dishes</h3>
                            <span>View all</span>
                        </div>
                        <div className="product-grid">
                            <DishCard name="Classic Burger" price="₹299" img="🍔" />
                            <DishCard name="Pepperoni Pizza" price="₹499" img="🍕" />
                            <DishCard name="Veggie Pasta" price="₹350" img="🍝" />
                        </div>
                    </section>

                </div>

            </main>

            {/* RIGHT PANEL */}
            <aside className="right-panel">
                <div className="user-profile">
                    <div className="profile-img"></div>
                    <span>Restaurant Portal</span>
                </div>

                <div className="wallet-card">
                    <label>Available Balance</label>
                    <h2>₹12,450.00</h2>
                    <div className="wallet-actions">
                        <button>Withdraw</button>
                        <button>History</button>
                    </div>
                </div>

                <div className="recent-activity">
                    <h3>Live Orders</h3>
                    <div className="activity-item">
                        <p>Order #4021 - <span>Preparing</span></p>
                    </div>
                    <div className="activity-item">
                        <p>Order #4022 - <span>On the way</span></p>
                    </div>
                </div>
            </aside>

        </div>
    );
};

const DishCard = ({ name, price, img }) => (
    <div className="dish-card">
        <div className="dish-emoji">{img}</div>
        <h4>{name}</h4>
        <p>{price}</p>
        <button className="add-btn">+</button>
    </div>
);

export default VendorDashboard;