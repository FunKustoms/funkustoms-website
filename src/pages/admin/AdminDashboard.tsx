import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/products';
import { useAdminStore } from '../../store/admin';
import type { Order } from '../../types';

const getStatusBadge = (status: Order['status']) => {
  const badges = {
    pending: 'bg-warning text-dark',
    processing: 'bg-info text-white',
    shipped: 'bg-primary text-white',
    delivered: 'bg-success text-white',
    cancelled: 'bg-danger text-white',
  };
  return badges[status] || 'bg-secondary';
};

const AdminDashboard: React.FC = () => {
  const { products } = useProductStore();
  const { orders, analytics, refreshAnalytics, loadOrders, loadCustomers, loadCustomizations, customizations } = useAdminStore();

  // Refresh analytics when component mounts or data changes
  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadCustomizations();
    refreshAnalytics();
  }, [orders, refreshAnalytics, loadOrders, loadCustomers, loadCustomizations]);

  // Get recent orders (latest 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get top products based on mock sales
  const topProducts = products.slice(0, 5).map((product, index) => ({
    ...product,
    sales: Math.floor(Math.random() * 100) + 20,
    rank: index + 1,
  }));

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <i className="bi bi-download me-2"></i>Export Report
          </button>
          <Link to="/admin/products/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-currency-rupee"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{analytics.totalRevenue.toLocaleString()}</span>
              <span className="stat-change positive">
                <i className="bi bi-arrow-up"></i>
                {analytics.revenueGrowth}% from last month
              </span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-cart-check"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{analytics.totalOrders.toLocaleString()}</span>
              <span className="stat-change positive">
                <i className="bi bi-arrow-up"></i>
                {analytics.ordersGrowth}% from last month
              </span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #0ea5e9' }}>
            <div className="stat-icon bg-info-subtle text-info">
              <i className="bi bi-people"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Customers</span>
              <span className="stat-value">{analytics.totalCustomers.toLocaleString()}</span>
              <span className="stat-change positive">
                <i className="bi bi-arrow-up"></i>
                {analytics.customersGrowth}% from last month
              </span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{products.length}</span>
              <span className="stat-change neutral" style={{ color: 'var(--muted-fg)' }}>
                <i className="bi bi-dash"></i>
                Active catalog
              </span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
            <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
              <i className="bi bi-brush"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Customization Requests</span>
              <span className="stat-value">{customizations.length}</span>
              <span className="stat-change neutral" style={{ color: 'var(--muted-fg)' }}>
                <i className="bi bi-dash"></i>
                Submitted by customers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Revenue Overview</h2>
              <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="admin-card-body">
              <div className="revenue-chart">
                <div className="chart-container">
                  <div className="chart-bars">
                    {analytics.revenueByDay.map((item) => {
                      const maxRevenue = 25600;
                      const height = (item.revenue / maxRevenue) * 100;
                      return (
                        <div key={item.day} className="chart-bar-container">
                          <div
                            className="chart-bar"
                            style={{ height: `${height}%` }}
                            title={`₹${item.revenue.toLocaleString()}`}
                          ></div>
                          <span className="chart-label">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Recent Orders</h2>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="admin-card-body p-0">
              <div className="recent-orders-list">
                {recentOrders.map((order) => (
                  <div key={order.id} className="recent-order-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-medium">{order.orderNumber}</div>
                        <small className="text-muted">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="fw-medium">₹{order.total.toLocaleString()}</div>
                        <span className={`badge ${getStatusBadge(order.status)} text-capitalize badge-sm`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="col-lg-6">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Sales by Category</h2>
            </div>
            <div className="admin-card-body">
              <div className="category-sales-list">
                {analytics.salesByCategory.map((item, index) => {
                  const total = analytics.salesByCategory.reduce((sum, i) => sum + i.sales, 0);
                  const percentage = Math.round((item.sales / total) * 100);
                  const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning'];
                  return (
                    <div key={item.category} className="category-sales-item">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-medium">{item.category}</span>
                        <span className="text-muted">{percentage}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Top Products</h2>
            </div>
            <div className="admin-card-body">
              <div className="top-products-list">
                {topProducts.map((product) => {
                  const revenue = product.sales * product.price;
                  return (
                    <div key={product.id} className="top-product-item">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="product-rank" 
                          style={{ 
                            backgroundColor: product.rank <= 3 ? 'var(--accent)' : 'var(--muted)',
                            color: product.rank <= 3 ? 'white' : 'var(--fg)',
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}
                        >
                          {product.rank}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-medium">{product.name}</div>
                          <small className="text-muted">{product.sales} sales</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-medium">₹{revenue.toLocaleString()}</div>
                          <small className="text-muted">₹{product.price} each</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Quick Actions</h2>
            </div>
            <div className="admin-card-body">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <Link to="/admin/products/new" className="quick-action-btn">
                    <i className="bi bi-plus-circle"></i>
                    <span>Add Product</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/admin/coupons/new" className="quick-action-btn">
                    <i className="bi bi-ticket-perforated"></i>
                    <span>Create Coupon</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/admin/orders" className="quick-action-btn">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Process Orders</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/admin/settings" className="quick-action-btn">
                    <i className="bi bi-gear"></i>
                    <span>Store Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
