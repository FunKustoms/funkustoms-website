import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CursorOrb from './components/ui/CursorOrb';

// Eager load pages that are likely visited first
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy load other public pages
const Shop = React.lazy(() => import('./pages/Shop'));
const Product = React.lazy(() => import('./pages/Product'));
const Customize = React.lazy(() => import('./pages/Customize'));
const About = React.lazy(() => import('./pages/About'));
const BulkOrders = React.lazy(() => import('./pages/BulkOrders'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));

// Lazy load admin pages (these are rarely accessed)
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminIntegrations = React.lazy(() => import('./pages/admin/AdminIntegrations'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));

// Import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Loading component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Login Route (Public) */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLogin />
            </Suspense>
          }
        />

        {/* Admin Routes (Protected by AdminLayout) */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminProducts />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminUsers />
              </Suspense>
            }
          />
          <Route
            path="coupons"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminCoupons />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminOrders />
              </Suspense>
            }
          />
          <Route
            path="integrations"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminIntegrations />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSettings />
              </Suspense>
            }
          />
        </Route>

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <div className="app d-flex flex-column min-vh-100">
              <CursorOrb />
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/shop"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Shop />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Product />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customize"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Customize />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <About />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/bulk-orders"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <BulkOrders />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Profile />
                      </Suspense>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Login />} />
                  <Route
                    path="/cart"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Cart />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Checkout />
                      </Suspense>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
