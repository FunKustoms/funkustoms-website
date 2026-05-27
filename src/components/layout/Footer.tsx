import React from 'react';
import { Link } from 'react-router-dom';

const socials = [
  { href: 'https://instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
  { href: 'https://facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
  { href: 'https://youtube.com', icon: 'fab fa-youtube', label: 'YouTube' },
];

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/customize', label: 'Customize' },
  { to: '/bulk-orders', label: 'Bulk Orders' },
  { to: '/about', label: 'About Us' },
];

const supportLinks = [
  { to: '/faq', label: 'FAQ' },
  { to: '/shipping', label: 'Shipping Info' },
  { to: '/returns', label: 'Returns' },
  { to: '/size-guide', label: 'Size Guide' },
  { to: '/contact', label: 'Contact' },
];

const footerHighlights = [
  { value: '24h', label: 'Fast-moving production' },
  { value: 'Premium', label: 'Materials and print finish' },
  { value: 'Creator', label: 'Designed around your style' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="footer-shell">
          <div className="footer-top-band">
            <div className="footer-top-copy">
              <span className="footer-eyebrow">Create without compromise</span>
              <h2 className="footer-title">Bring your ideas to life with color, character, and quality.</h2>
            </div>

            <div className="footer-stat-grid">
              {footerHighlights.map((item) => (
                <div className="footer-stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand-card h-100">
                <Link to="/" className="d-inline-block mb-3">
                  <img src="/assets/logo.png" alt="FunKustoms Logo" height="42" />
                </Link>

                <p className="footer-brand-copy mb-4">
                  Premium print-on-demand for apparel, gifts, and branded merch that feels expressive from the first sketch to the final delivery.
                </p>

                <div className="footer-contact-chip mb-4">
                  <i className="fas fa-sparkles"></i>
                  <span>Made for creators, brands, teams, and one-off ideas.</span>
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={social.label}
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Quick Links</h6>
              <ul className="list-unstyled footer-links">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Support</h6>
              <ul className="list-unstyled footer-links">
                {supportLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="footer-news-card h-100">
                <h6 className="footer-heading">Stay in the Loop</h6>
                <p className="footer-news-copy mb-3">
                  Get product drops, offers, and creative inspiration without the spammy energy.
                </p>

                <form className="footer-newsletter">
                  <div className="input-group footer-news-input">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                      aria-label="Email for newsletter"
                    />
                    <button className="btn btn-primary" type="submit">
                      Subscribe
                    </button>
                  </div>
                </form>

                <div className="footer-payment-wrap mt-4">
                  <span className="footer-payment-label">We accept</span>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <span className="footer-pay-badge"><i className="fab fa-cc-visa"></i></span>
                    <span className="footer-pay-badge"><i className="fab fa-cc-mastercard"></i></span>
                    <span className="footer-pay-badge"><i className="fab fa-cc-paypal"></i></span>
                    <span className="footer-pay-badge"><i className="fab fa-google-pay"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row align-items-center g-3">
              <div className="col-md-6 text-center text-md-start">
                <small className="footer-bottom-copy">&copy; {currentYear} FunKustoms. All rights reserved.</small>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <Link to="/privacy" className="footer-bottom-link me-3">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="footer-bottom-link">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
