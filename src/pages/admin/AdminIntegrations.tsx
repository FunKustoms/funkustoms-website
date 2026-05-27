import React, { useState } from 'react';
import type { ApiIntegration } from '../../types';

// Mock API integration data
const mockIntegrations: ApiIntegration[] = [
  {
    id: '1',
    name: 'Razorpay',
    type: 'payment',
    provider: 'Razorpay',
    status: 'connected',
    apiKey: 'rzp_live_xxxxxxxxxxxx',
    lastSync: '2026-01-16T10:00:00',
    config: { keySecret: '••••••••••••••••' },
  },
  {
    id: '2',
    name: 'Shiprocket',
    type: 'shipping',
    provider: 'Shiprocket',
    status: 'connected',
    apiKey: 'shiprocket_xxxxx',
    lastSync: '2026-01-16T09:30:00',
    config: { email: 'admin@funkustoms.com', password: '••••••••', channelId: '12345' },
  },
  {
    id: '3',
    name: 'Google Analytics',
    type: 'analytics',
    provider: 'Google',
    status: 'connected',
    apiKey: 'G-XXXXXXXXXX',
    lastSync: '2026-01-16T08:00:00',
    config: {},
  },
  {
    id: '4',
    name: 'Meta Pixel',
    type: 'analytics',
    provider: 'Meta',
    status: 'disconnected',
    config: { pixelId: '1234567890' },
  },
  {
    id: '5',
    name: 'Delhivery',
    type: 'shipping',
    provider: 'Delhivery',
    status: 'disconnected',
    config: { token: '••••••••••••••••' },
  },
  {
    id: '6',
    name: 'Printful',
    type: 'other',
    provider: 'Printful',
    status: 'connected',
    apiKey: '••••••••••••••••',
    lastSync: '2026-01-15T14:00:00',
    config: {},
  },
  {
    id: '7',
    name: 'Mailchimp',
    type: 'marketing',
    provider: 'Mailchimp',
    status: 'connected',
    apiKey: '••••••••••••••••',
    lastSync: '2026-01-16T06:00:00',
    config: { audienceId: 'abc123' },
  },
];

const integrationTypes = [
  { value: 'payment', label: 'Payment Gateway', icon: 'bi-credit-card' },
  { value: 'shipping', label: 'Shipping', icon: 'bi-truck' },
  { value: 'analytics', label: 'Analytics', icon: 'bi-graph-up' },
  { value: 'marketing', label: 'Marketing', icon: 'bi-envelope' },
  { value: 'inventory', label: 'Inventory', icon: 'bi-boxes' },
  { value: 'other', label: 'Other', icon: 'bi-puzzle' },
];

const AdminIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>(mockIntegrations);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState<ApiIntegration | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesType = typeFilter === 'all' || integration.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id 
        ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' } 
        : i
    ));
  };

  const handleSync = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id 
        ? { ...i, lastSync: new Date().toISOString() } 
        : i
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this integration?')) {
      setIntegrations(prev => prev.filter(i => i.id !== id));
    }
  };

  const getTypeIcon = (type: ApiIntegration['type']) => {
    return integrationTypes.find(t => t.value === type)?.icon || 'bi-puzzle';
  };

  const getTypeLabel = (type: ApiIntegration['type']) => {
    return integrationTypes.find(t => t.value === type)?.label || type;
  };

  const getIntegrationLogo = (name: string) => {
    const logos: Record<string, string> = {
      'Razorpay': '💳',
      'Shiprocket': '🚚',
      'Google Analytics': '📊',
      'Meta Pixel': '📱',
      'Delhivery': '📦',
      'Printful': '👕',
      'Mailchimp': '📧',
    };
    return logos[name] || '🔌';
  };

  return (
    <div className="admin-integrations">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">API Integrations</h1>
          <p className="admin-page-subtitle">Connect third-party services to your store</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>Add Integration
        </button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Total Integrations</span>
              <span className="stat-value">{integrations.length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Active</span>
              <span className="stat-value text-success">{integrations.filter(i => i.status === 'connected').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Inactive</span>
              <span className="stat-value text-secondary">{integrations.filter(i => i.status === 'disconnected').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Errors</span>
              <span className="stat-value text-danger">{integrations.filter(i => i.status === 'error').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {integrationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="col-md-4 text-md-end">
              <span className="text-muted">{filteredIntegrations.length} integration(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="row g-4">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="col-md-6 col-lg-4">
            <div className={`admin-card integration-card ${integration.status}`}>
              <div className="admin-card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="integration-logo">
                      {getIntegrationLogo(integration.name)}
                    </div>
                    <div>
                      <h5 className="mb-1">{integration.name}</h5>
                      <span className="badge bg-light text-dark">
                        <i className={`bi ${getTypeIcon(integration.type)} me-1`}></i>
                        {getTypeLabel(integration.type)}
                      </span>
                    </div>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={integration.status === 'connected'}
                      onChange={() => handleToggleStatus(integration.id)}
                    />
                  </div>
                </div>

                <div className="integration-status mb-3">
                  {integration.status === 'connected' && (
                    <span className="text-success">
                      <i className="bi bi-check-circle-fill me-1"></i>Connected
                    </span>
                  )}
                  {integration.status === 'disconnected' && (
                    <span className="text-secondary">
                      <i className="bi bi-pause-circle-fill me-1"></i>Disabled
                    </span>
                  )}
                  {integration.status === 'error' && (
                    <span className="text-danger">
                      <i className="bi bi-exclamation-circle-fill me-1"></i>Connection Error
                    </span>
                  )}
                </div>

                {integration.lastSync && (
                  <p className="text-muted small mb-3">
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </p>
                )}

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    <i className="bi bi-gear me-1"></i>Configure
                  </button>
                  {integration.status === 'connected' && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleSync(integration.id)}
                      title="Sync Now"
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(integration.id)}
                    title="Remove"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Integrations Section */}
      <div className="mt-5">
        <h3 className="mb-4">Available Integrations</h3>
        <div className="row g-4">
          {[
            { name: 'PayU', type: 'payment', description: 'Accept payments via PayU' },
            { name: 'PhonePe', type: 'payment', description: 'PhonePe payment gateway' },
            { name: 'Blue Dart', type: 'shipping', description: 'Blue Dart shipping integration' },
            { name: 'DTDC', type: 'shipping', description: 'DTDC courier services' },
            { name: 'Klaviyo', type: 'email', description: 'Email marketing platform' },
            { name: 'Twilio', type: 'other', description: 'SMS notifications' },
          ].filter(available => !integrations.find(i => i.name === available.name)).map((available, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="admin-card available-integration">
                <div className="admin-card-body">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="integration-logo muted">
                      <i className={`bi ${getTypeIcon(available.type as ApiIntegration['type'])}`}></i>
                    </div>
                    <div>
                      <h5 className="mb-0">{available.name}</h5>
                      <small className="text-muted">{available.description}</small>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-primary w-100 mt-3">
                    <i className="bi bi-plus me-1"></i>Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <IntegrationConfigModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onSave={(updated) => {
            setIntegrations(prev => prev.map(i => i.id === updated.id ? updated : i));
            setSelectedIntegration(null);
          }}
        />
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <AddIntegrationModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newIntegration) => {
            setIntegrations(prev => [...prev, { ...newIntegration, id: Date.now().toString() }]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Configuration Modal
interface IntegrationConfigModalProps {
  integration: ApiIntegration;
  onClose: () => void;
  onSave: (integration: ApiIntegration) => void;
}

const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({ integration, onClose, onSave }) => {
  const [config, setConfig] = useState<Record<string, unknown>>(integration.config || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...integration, config });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Configure {integration.name}</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {Object.entries(config).map(([key, value]) => (
              <div className="mb-3" key={key}>
                <label className="form-label text-capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                  className="form-control"
                  value={String(value ?? '')}
                  onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Make sure to keep your API credentials secure and never share them publicly.
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-outline-danger">
              Test Connection
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Integration Modal
interface AddIntegrationModalProps {
  onClose: () => void;
  onAdd: (integration: Omit<ApiIntegration, 'id'>) => void;
}

const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'payment' as ApiIntegration['type'],
    provider: '',
    status: 'disconnected' as ApiIntegration['status'],
    config: {} as Record<string, unknown>,
  });
  const [configKey, setConfigKey] = useState('');
  const [configValue, setConfigValue] = useState('');

  const handleAddConfig = () => {
    if (configKey && configValue) {
      setFormData({
        ...formData,
        config: { ...formData.config, [configKey]: configValue },
      });
      setConfigKey('');
      setConfigValue('');
    }
  };

  const handleRemoveConfig = (key: string) => {
    const newConfig = { ...formData.config };
    delete newConfig[key];
    setFormData({ ...formData, config: newConfig });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Add New Integration</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="mb-3">
              <label className="form-label">Integration Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Razorpay, Shiprocket"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ApiIntegration['type'] })}
              >
                {integrationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Configuration</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Key (e.g., apiKey)"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value"
                  value={configValue}
                  onChange={(e) => setConfigValue(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddConfig}
                >
                  Add
                </button>
              </div>
              {Object.entries(formData.config).length > 0 && (
                <div className="config-list">
                  {Object.entries(formData.config).map(([key, value]) => (
                    <div key={key} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-1">
                      <span><strong>{key}:</strong> {String(value ?? '').substring(0, 20)}...</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger"
                        onClick={() => handleRemoveConfig(key)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Integration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminIntegrations;
