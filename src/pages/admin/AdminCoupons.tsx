import React, { useState } from 'react';
import type { Coupon } from '../../types';

// Mock coupon data
const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 499,
    maxDiscount: 200,
    usageLimit: 1000,
    usedCount: 456,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    code: 'FLAT100',
    type: 'fixed',
    value: 100,
    minOrderAmount: 999,
    usageLimit: 500,
    usedCount: 234,
    startDate: '2026-01-15',
    endDate: '2026-02-15',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minOrderAmount: 1499,
    maxDiscount: 500,
    usageLimit: 200,
    usedCount: 200,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'expired',
    applicableCategories: ['tshirt', 'hoodie'],
    createdAt: '2025-06-01',
  },
  {
    id: '4',
    code: 'NEWUSER',
    type: 'percentage',
    value: 15,
    minOrderAmount: 0,
    maxDiscount: 300,
    usageLimit: undefined,
    usedCount: 1289,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    status: 'active',
    createdAt: '2025-01-01',
  },
  {
    id: '5',
    code: 'PAUSED50',
    type: 'fixed',
    value: 50,
    minOrderAmount: 500,
    usageLimit: 100,
    usedCount: 45,
    startDate: '2026-01-10',
    endDate: '2026-01-20',
    status: 'inactive',
    createdAt: '2026-01-10',
  },
];

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: Coupon['status']) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const getStatusBadge = (status: Coupon['status']) => {
    const badges = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      expired: 'bg-danger',
    };
    return badges[status];
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  return (
    <div className="admin-coupons">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-subtitle">Create and manage discount codes</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Active Coupons</span>
              <span className="stat-value">{coupons.filter(c => c.status === 'active').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Total Uses</span>
              <span className="stat-value">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Expired</span>
              <span className="stat-value">{coupons.filter(c => c.status === 'expired').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Inactive</span>
              <span className="stat-value">{coupons.filter(c => c.status === 'inactive').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by coupon code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="col-md-4 text-md-end">
              <span className="text-muted">{filteredCoupons.length} coupon(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="admin-card">
        <div className="admin-card-body p-0">
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Usage</th>
                  <th>Valid Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <code className="coupon-code">{coupon.code}</code>
                        <button
                          className="btn btn-sm btn-link p-0"
                          onClick={() => copyToClipboard(coupon.code)}
                          title="Copy code"
                        >
                          <i className="bi bi-clipboard"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </span>
                      {coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
                        <small className="text-muted d-block">
                          Min: ₹{coupon.minOrderAmount}
                        </small>
                      )}
                      {coupon.maxDiscount && (
                        <small className="text-muted d-block">
                          Max: ₹{coupon.maxDiscount}
                        </small>
                      )}
                    </td>
                    <td>
                      <div className="usage-info">
                        <span className="fw-medium">{coupon.usedCount}</span>
                        {coupon.usageLimit && (
                          <span className="text-muted"> / {coupon.usageLimit}</span>
                        )}
                        {coupon.usageLimit && (
                          <div className="progress mt-1" style={{ height: '4px', width: '80px' }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <small>
                        {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(coupon.status)} text-capitalize`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingCoupon(coupon)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        {coupon.status === 'active' ? (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleStatusChange(coupon.id, 'inactive')}
                            title="Deactivate"
                          >
                            <i className="bi bi-pause"></i>
                          </button>
                        ) : coupon.status === 'inactive' ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleStatusChange(coupon.id, 'active')}
                            title="Activate"
                          >
                            <i className="bi bi-play"></i>
                          </button>
                        ) : null}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Coupon Modal */}
      {(showAddModal || editingCoupon) && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => {
            setShowAddModal(false);
            setEditingCoupon(null);
          }}
          onSave={(coupon) => {
            if (editingCoupon) {
              setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
            } else {
              setCoupons(prev => [...prev, { ...coupon, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setEditingCoupon(null);
          }}
        />
      )}
    </div>
  );
};

// Coupon Modal Component
interface CouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: (coupon: Coupon) => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Coupon>>(
    coupon || {
      code: '',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
      maxDiscount: undefined,
      usageLimit: undefined,
      usedCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Coupon);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Coupon Code *</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g., SAVE20"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={generateCode}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Discount Type *</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Discount Value * {formData.type === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  required
                  min={0}
                  max={formData.type === 'percentage' ? 100 : undefined}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.minOrderAmount || ''}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              {formData.type === 'percentage' && (
                <div className="col-md-6">
                  <label className="form-label">Maximum Discount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) || undefined })}
                    min={0}
                  />
                </div>
              )}
              <div className="col-md-6">
                <label className="form-label">Usage Limit</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) || undefined })}
                  placeholder="Unlimited"
                  min={0}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Coupon['status'] })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {coupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCoupons;
