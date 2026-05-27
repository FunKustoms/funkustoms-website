import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  module: 'dashboard' | 'products' | 'orders' | 'users' | 'coupons' | 'integrations' | 'settings' | 'blogs';
}

const navItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill', module: 'dashboard' },
  { path: '/admin/products', label: 'Products', icon: 'bi-box-seam-fill', module: 'products' },
  { path: '/admin/orders', label: 'Orders', icon: 'bi-cart-fill', module: 'orders' },
  { path: '/admin/users', label: 'Users', icon: 'bi-people-fill', module: 'users' },
  { path: '/admin/coupons', label: 'Coupons', icon: 'bi-ticket-perforated-fill', module: 'coupons' },
  { path: '/admin/integrations', label: 'Integrations', icon: 'bi-plug-fill', module: 'integrations' },
  { path: '/admin/settings', label: 'Settings', icon: 'bi-gear-fill', module: 'settings' },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser, canAccessModule, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Filter nav items based on user permissions
  const accessibleNavItems = navItems.filter(item => canAccessModule(item.module));

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getRoleBadgeColor = () => {
    const colors = {
      super_admin: 'bg-danger',
      website_admin: 'bg-primary',
      author: 'bg-info',
      inventory: 'bg-warning text-dark',
    };
    return colors[currentUser.role];
  };

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="admin-mobile-header d-lg-none">
        <button 
          className="btn btn-link text-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        <div className="admin-sidebar-logo">
          <img 
            src="/assets/logo.png" 
            alt="FunKustoms Admin" 
            style={{ 
              height: '32px', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <span>Admin</span>
        </div>
        <Link to="/" className="btn btn-link text-dark" title="View Store">
          <i className="bi bi-shop fs-5"></i>
        </Link>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-logo">
            <img 
              src="/assets/logo.png" 
              alt="FunKustoms" 
              style={{ 
                height: '36px', 
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            {!sidebarCollapsed && <span>Admin</span>}
          </Link>
          <button 
            className="admin-sidebar-toggle d-none d-lg-block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="admin-nav">
          {accessibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon}`}></i>
              {!sidebarCollapsed && <span className="admin-nav-text">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link 
            to="/" 
            className="admin-nav-item"
            title={sidebarCollapsed ? 'View Store' : undefined}
          >
            <i className="bi bi-shop"></i>
            {!sidebarCollapsed && <span className="admin-nav-text">View Store</span>}
          </Link>
          
          {!sidebarCollapsed && (
            <div className="px-3 mb-3">
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#4169e1',
                    fontSize: '0.875rem',
                  }}
                >
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                    {currentUser.name}
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <span className={`badge ${getRoleBadgeColor()} w-100`} style={{ fontSize: '0.7rem' }}>
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    logout();
                  }
                }}
              >
                <i className="bi bi-box-arrow-left me-2"></i>
                Logout
              </button>
            </div>
          )}
          
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <i className="bi bi-person-fill"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="admin-user-details">
                <span className="admin-user-name">Admin User</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="admin-overlay d-lg-none"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
