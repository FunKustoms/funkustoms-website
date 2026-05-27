import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCartStore, useUserStore } from '../../store';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const user = useUserStore((state) => state.user);

  const getAvatarImage = () => {
    return user?.gender === 'female' ? '/assets/pp/female pp.png' : '/assets/pp/male pp.png';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/assets/logo.png"
            alt="FunKustoms Logo"
            height="40"
            className="me-2"
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto gap-lg-2">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/shop"
                onClick={closeMenu}
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/customize"
                onClick={closeMenu}
              >
                Customize
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/bulk-orders"
                onClick={closeMenu}
              >
                Bulk Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/about"
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* User Profile */}
            {user ? (
              <Link 
                to="/profile" 
                className="text-decoration-none" 
                title="User Profile" 
                onClick={closeMenu}
              >
                <div 
                  className="rounded-circle overflow-hidden"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    backgroundColor: '#f0f0f0',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={getAvatarImage()}
                    alt="Profile Avatar"
                    className="w-100 h-100"
                    style={{ 
                      objectFit: 'cover',
                      filter: `hue-rotate(${user?.avatarHue || 0}deg)`
                    }}
                  />
                </div>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline-primary btn-sm" onClick={closeMenu}>
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="position-relative d-inline-block" title="Cart" onClick={closeMenu} style={{ color: 'var(--fg)', textDecoration: 'none' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '1.5rem' }}></i>
              {cartCount > 0 && (
                <span 
                  className="position-absolute badge rounded-pill" 
                  style={{ 
                    fontSize: '0.65rem',
                    top: '-8px',
                    right: '-10px',
                    padding: '0.35em 0.55em',
                    fontWeight: 700,
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Link
              to="/customize"
              className="btn btn-primary d-none d-lg-inline-flex align-items-center gap-2"
              onClick={closeMenu}
            >
              Start Customizing
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
