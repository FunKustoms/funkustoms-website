import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Firebase Admin', email: 'admin@funkustoms.com', password: 'your-admin-password' },
  ];

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  return (
    <div className="admin-login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
      padding: '2rem'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <div className="row g-0">
                {/* Left Side - Branding */}
                <div className="col-md-5 d-none d-md-block" style={{ 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #3557c9 100%)',
                  padding: '3rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <div className="text-center mb-4">
                    <img 
                      src="/assets/logo.png" 
                      alt="FunKustoms" 
                      style={{ height: '60px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                  <h3 className="text-center fw-bold mb-3">Admin Portal</h3>
                  <p className="text-center opacity-75 small mb-4">
                    Manage your FunKustoms store with powerful tools and insights
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-shield-check fs-5"></i>
                      <small>Secure access</small>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-speedometer2 fs-5"></i>
                      <small>Real-time analytics</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-people fs-5"></i>
                      <small>Team collaboration</small>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-md-7">
                  <div className="p-4 p-md-5">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold mb-2">Welcome Back</h2>
                      <p className="text-muted">Sign in to access your admin dashboard</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-medium">
                          <i className="bi bi-envelope me-2"></i>Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@funkustoms.com"
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="form-label fw-medium">
                          <i className="bi bi-lock me-2"></i>Password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-lg"
                          disabled={isLoading}
                          style={{ 
                            backgroundColor: 'var(--primary)', 
                            color: 'white',
                            fontWeight: 600
                          }}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Signing in...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-box-arrow-in-right me-2"></i>
                              Sign In
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <a href="#" className="text-decoration-none small" style={{ color: 'var(--primary)' }}>
                          Forgot your password?
                        </a>
                      </div>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-4 pt-4 border-top">
                      <p className="text-muted small mb-2">
                        <i className="bi bi-info-circle me-1"></i>
                        Firebase Admin Credentials (Click to auto-fill email):
                      </p>
                      <div className="d-flex flex-column gap-2">
                        {demoCredentials.map((cred) => (
                          <button
                            key={cred.email}
                            type="button"
                            className="btn btn-sm btn-outline-primary text-start"
                            onClick={() => fillDemo(cred.email, cred.password)}
                          >
                            <strong>{cred.role}:</strong> {cred.email}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Store Link */}
            <div className="text-center mt-4">
              <a 
                href="/" 
                className="text-white text-decoration-none"
                style={{ opacity: 0.9 }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
