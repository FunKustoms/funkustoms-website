import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterMode = location.pathname === '/register';
  const { login, register } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const success = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });

        if (!success) {
          setError('Registration failed. Please try with a different email.');
          setIsLoading(false);
          return;
        }
      } else {
        const success = await login(form.email, form.password);
        if (!success) {
          setError('Invalid email or password.');
          setIsLoading(false);
          return;
        }
      }

      navigate('/profile');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-4 p-md-5">
                <h2 className="fw-bold mb-2">{isRegisterMode ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-muted mb-4">
                  {isRegisterMode ? 'Register to track your orders and saved designs.' : 'Sign in to access your profile and orders.'}
                </p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {isRegisterMode && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
                  </div>

                  {isRegisterMode && (
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                    </div>
                  )}

                  <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
                    {isLoading ? 'Please wait...' : isRegisterMode ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <div className="text-center mt-3">
                  {isRegisterMode ? (
                    <span className="text-muted">
                      Already have an account? <Link to="/login">Sign in</Link>
                    </span>
                  ) : (
                    <span className="text-muted">
                      New customer? <Link to="/register">Create account</Link>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
