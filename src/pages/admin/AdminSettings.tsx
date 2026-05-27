import React, { useState } from 'react';
import type { AdminSettings as AdminSettingsType } from '../../types';

const defaultSettings: AdminSettingsType = {
  storeName: 'FunKustoms',
  storeEmail: 'contact@funkustoms.com',
  storePhone: '+91 98765 43210',
  storeAddress: '123 Creative Lane, Mumbai, Maharashtra 400001',
  currency: 'INR',
  taxRate: 18,
  shippingFee: 99,
  freeShippingThreshold: 999,
  orderPrefix: 'FK',
  socialLinks: {},
  emailNotifications: {
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
  },
};

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsType>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'bi-gear' },
    { id: 'store', label: 'Store Info', icon: 'bi-shop' },
    { id: 'shipping', label: 'Shipping & Tax', icon: 'bi-truck' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'features', label: 'Features', icon: 'bi-toggles' },
    { id: 'security', label: 'Security', icon: 'bi-shield-lock' },
  ];

  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your store preferences</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>Save Changes
            </>
          )}
        </button>
      </div>

      <div className="row g-4">
        {/* Settings Navigation */}
        <div className="col-lg-3">
          <div className="admin-card">
            <div className="admin-card-body p-2">
              <nav className="settings-nav">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={`bi ${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-lg-9">
          <div className="admin-card">
            <div className="admin-card-body">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">General Settings</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Store Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Currency</label>
                      <select
                        className="form-select"
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Order Prefix</label>
                      <input
                        type="text"
                        className="form-control"
                        value={settings.orderPrefix}
                        onChange={(e) => setSettings({ ...settings, orderPrefix: e.target.value })}
                        placeholder="e.g., FK"
                      />
                      <small className="text-muted">Order numbers will be like FK-2026-0001</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Store Info */}
              {activeTab === 'store' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">Store Information</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Contact Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={settings.storeEmail}
                        onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={settings.storePhone}
                        onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Store Address</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={settings.storeAddress}
                        onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Store Logo</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="store-logo-preview">
                          <img src="/logo.svg" alt="Store Logo" />
                        </div>
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-upload me-2"></i>Upload New Logo
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Favicon</label>
                      <div className="d-flex align-items-center gap-3">
                        <div className="favicon-preview">
                          <img src="/favicon.ico" alt="Favicon" />
                        </div>
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-upload me-2"></i>Upload Favicon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping & Tax */}
              {activeTab === 'shipping' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">Shipping & Tax</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tax Rate (%)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={settings.taxRate}
                          onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                          min={0}
                          max={100}
                          step={0.5}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      <small className="text-muted">GST/VAT rate applied to orders</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Shipping Fee</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.shippingFee}
                          onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                          min={0}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Free Shipping Threshold</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                          min={0}
                        />
                      </div>
                      <small className="text-muted">Orders above this amount get free shipping</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">Email Notifications</h4>
                  <div className="notification-settings">
                    {[
                      { id: 'orderConfirmation', label: 'Order Confirmation', description: 'Send email when order is placed' },
                      { id: 'orderShipped', label: 'Order Shipped', description: 'Send email when order is shipped' },
                      { id: 'orderDelivered', label: 'Order Delivered', description: 'Send email when order is delivered' },
                      { id: 'lowStock', label: 'Low Stock Alert', description: 'Notify admin when stock is low' },
                      { id: 'newUser', label: 'New User Registration', description: 'Notify admin when new user signs up' },
                      { id: 'abandonedCart', label: 'Abandoned Cart Reminder', description: 'Send reminder for abandoned carts' },
                    ].map(item => (
                      <div key={item.id} className="form-check form-switch notification-item">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={item.id}
                          defaultChecked
                        />
                        <label className="form-check-label" htmlFor={item.id}>
                          <strong>{item.label}</strong>
                          <small className="text-muted d-block">{item.description}</small>
                        </label>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />

                  <h5>SMTP Configuration</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">SMTP Host</label>
                      <input type="text" className="form-control" placeholder="smtp.example.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SMTP Port</label>
                      <input type="number" className="form-control" placeholder="587" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SMTP Username</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SMTP Password</label>
                      <input type="password" className="form-control" />
                    </div>
                    <div className="col-12">
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-envelope me-2"></i>Send Test Email
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {activeTab === 'features' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">Store Features</h4>
                  <div className="feature-settings">
                    <div className="form-check form-switch feature-item">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="dummyFeature"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="dummyFeature">
                        <strong>Product Reviews</strong>
                        <small className="text-muted d-block">Allow customers to leave reviews</small>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="settings-section">
                  <h4 className="settings-section-title">Security Settings</h4>
                  
                  <div className="security-settings">
                    <div className="form-check form-switch security-item">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="twoFactorAuth"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="twoFactorAuth">
                        <strong>Two-Factor Authentication</strong>
                        <small className="text-muted d-block">Require 2FA for admin accounts</small>
                      </label>
                    </div>

                    <div className="form-check form-switch security-item">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="forceSSL"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="forceSSL">
                        <strong>Force SSL</strong>
                        <small className="text-muted d-block">Redirect all traffic to HTTPS</small>
                      </label>
                    </div>

                    <div className="form-check form-switch security-item">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="loginNotifications"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="loginNotifications">
                        <strong>Login Notifications</strong>
                        <small className="text-muted d-block">Send email for new device logins</small>
                      </label>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h5>Password Policy</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Minimum Password Length</label>
                      <input type="number" className="form-control" defaultValue={8} min={6} max={32} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Password Expiry (days)</label>
                      <input type="number" className="form-control" defaultValue={90} min={0} />
                      <small className="text-muted">Set to 0 to disable expiry</small>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h5>API Keys</h5>
                  <div className="api-keys-list">
                    <div className="api-key-item d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <div>
                        <strong>Production API Key</strong>
                        <code className="d-block text-muted">fk_live_••••••••••••••••</code>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary">Regenerate</button>
                        <button className="btn btn-sm btn-outline-danger">Revoke</button>
                      </div>
                    </div>
                    <div className="api-key-item d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <strong>Test API Key</strong>
                        <code className="d-block text-muted">fk_test_••••••••••••••••</code>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary">Regenerate</button>
                        <button className="btn btn-sm btn-outline-danger">Revoke</button>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary mt-3">
                    <i className="bi bi-plus me-2"></i>Generate New API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
