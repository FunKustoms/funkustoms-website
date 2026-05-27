import React, { useEffect, useState } from 'react';
import { useAuthStore, type AdminUser, type UserRole } from '../../store/auth';

const AdminUsers: React.FC = () => {
  const { users, currentUser, inviteUser, updateUser, deleteUser, hasPermission, syncUsers } = useAuthStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    syncUsers();
  }, [syncUsers]);

  // Check if current user can manage users
  const canManageUsers = hasPermission('users', 'edit');
  const canInviteUsers = hasPermission('users', 'create');

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    const badges = {
      super_admin: 'bg-danger',
      website_admin: 'bg-primary',
      author: 'bg-info',
      inventory: 'bg-warning text-dark',
    };
    return badges[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      super_admin: 'Super Admin',
      website_admin: 'Website Admin',
      author: 'Author',
      inventory: 'Inventory Manager',
    };
    return labels[role];
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const badges = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      invited: 'bg-warning text-dark',
    };
    return badges[status];
  };

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      super_admin: 'Full access to all features including revenue, reporting, and system settings',
      website_admin: 'Access to development tools, integrations, and content management (no revenue/reporting)',
      author: 'Can create, edit, and read blog posts only',
      inventory: 'Can add, edit, and delete products only',
    };
    return descriptions[role];
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    updateUser(user.id, { status: newStatus });
  };

  return (
    <div className="admin-users">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Team Members</h1>
          <p className="admin-page-subtitle">Manage admin users and their permissions</p>
        </div>
        {canInviteUsers && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
          >
            <i className="bi bi-person-plus me-2"></i>Invite User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini" style={{ borderLeft: '4px solid #16a34a' }}>
            <div className="stat-content">
              <span className="stat-label">Active Users</span>
              <span className="stat-value text-success">{users.filter(u => u.status === 'active').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini" style={{ borderLeft: '4px solid #d97706' }}>
            <div className="stat-content">
              <span className="stat-label">Pending Invites</span>
              <span className="stat-value text-warning">{users.filter(u => u.status === 'invited').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stat-content">
              <span className="stat-label">Website Admins</span>
              <span className="stat-value" style={{ color: 'var(--primary)' }}>
                {users.filter(u => u.role === 'website_admin').length}
              </span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini" style={{ borderLeft: '4px solid #6366f1' }}>
            <div className="stat-content">
              <span className="stat-label">Total Users</span>
              <span className="stat-value" style={{ color: '#6366f1' }}>{users.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="website_admin">Website Admin</option>
                <option value="author">Author</option>
                <option value="inventory">Inventory Manager</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-2 text-md-end">
              <span className="text-muted">{filteredUsers.length} user(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="row g-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 'var(--radius)' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: 600
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{user.name}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex gap-2 mb-2">
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <span className={`badge ${getStatusBadge(user.status)} text-capitalize`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="small text-muted mb-0">{getRoleDescription(user.role)}</p>
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </small>
                  </div>
                  {user.lastLogin && (
                    <small className="text-muted d-block mb-2">
                      <i className="bi bi-clock me-1"></i>
                      Last login: {new Date(user.lastLogin).toLocaleDateString('en-IN')}
                    </small>
                  )}
                  {user.invitedBy && (
                    <small className="text-muted d-block">
                      <i className="bi bi-person-check me-1"></i>
                      Invited by: {user.invitedBy}
                    </small>
                  )}
                </div>

                {canManageUsers && user.id !== currentUser?.id && (
                  <div className="d-flex gap-2 mt-3 pt-3 border-top">
                    <button
                      className={`btn btn-sm flex-grow-1 ${user.status === 'active' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                      onClick={() => handleToggleStatus(user)}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`bi ${user.status === 'active' ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger flex-grow-1"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Remove User"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}

                {user.id === currentUser?.id && (
                  <div className="alert alert-info py-2 px-3 mt-3 mb-0 small">
                    <i className="bi bi-info-circle me-1"></i>
                    This is you
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onInvite={(userData) => {
            inviteUser({
              ...userData,
              invitedBy: currentUser?.email,
            });
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
};

// Invite User Modal Component
interface InviteUserModalProps {
  onClose: () => void;
  onInvite: (userData: Omit<AdminUser, 'id' | 'createdAt' | 'permissions' | 'status'>) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'inventory' as UserRole,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };

  const roleOptions: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'super_admin',
      label: 'Super Admin',
      description: 'Full access to all features including revenue and reporting',
    },
    {
      value: 'website_admin',
      label: 'Website Admin',
      description: 'Access to development tools but not revenue/reporting',
    },
    {
      value: 'author',
      label: 'Author',
      description: 'Can only create, edit, and read blogs',
    },
    {
      value: 'inventory',
      label: 'Inventory Manager',
      description: 'Can only manage products (add, edit, delete)',
    },
  ];

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>
            <i className="bi bi-person-plus me-2" style={{ color: 'var(--primary)' }}></i>
            Invite Team Member
          </h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="mb-3">
              <label className="form-label fw-medium">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <small className="text-muted">An invitation email will be sent to this address</small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Role *</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                required
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Description */}
            <div className="alert alert-info">
              <strong>
                <i className="bi bi-info-circle me-2"></i>
                {roleOptions.find(r => r.value === formData.role)?.label}:
              </strong>
              <p className="mb-0 mt-1">
                {roleOptions.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Permissions Preview */}
            <div className="border rounded p-3" style={{ backgroundColor: 'var(--muted)' }}>
              <h6 className="fw-bold mb-2">
                <i className="bi bi-shield-check me-2"></i>
                Access Permissions
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {formData.role === 'super_admin' && (
                  <>
                    <span className="badge bg-success">Dashboard</span>
                    <span className="badge bg-success">Products</span>
                    <span className="badge bg-success">Orders</span>
                    <span className="badge bg-success">Users</span>
                    <span className="badge bg-success">Coupons</span>
                    <span className="badge bg-success">Integrations</span>
                    <span className="badge bg-success">Settings</span>
                    <span className="badge bg-success">Blogs</span>
                  </>
                )}
                {formData.role === 'website_admin' && (
                  <>
                    <span className="badge bg-success">Products</span>
                    <span className="badge bg-success">Coupons</span>
                    <span className="badge bg-success">Integrations</span>
                    <span className="badge bg-success">Settings</span>
                    <span className="badge bg-success">Blogs</span>
                  </>
                )}
                {formData.role === 'author' && (
                  <span className="badge bg-success">Blogs Only</span>
                )}
                {formData.role === 'inventory' && (
                  <span className="badge bg-success">Products Only</span>
                )}
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-send me-2"></i>
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;
