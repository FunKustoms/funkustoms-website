import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/admin';
import type { Order } from '../../types';

const AdminOrders: React.FC = () => {
  const { orders, customizations, loadOrders, loadCustomizations, syncOrderStatus } = useAdminStore();
    useEffect(() => {
      loadOrders();
      loadCustomizations();
    }, [loadOrders, loadCustomizations]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const badges: Record<Order['status'], string> = {
      pending: 'bg-warning text-dark',
      processing: 'bg-primary',
      shipped: 'bg-purple',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
    };
    return badges[status] || 'bg-secondary';
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    syncOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Manage and track customer orders</p>
        </div>
        <button className="btn btn-outline-primary">
          <i className="bi bi-download me-2"></i>Export Orders
        </button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <span className="stat-value text-warning">{orders.filter(o => o.status === 'pending').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Processing</span>
              <span className="stat-value text-primary">{orders.filter(o => o.status === 'processing').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Shipped</span>
              <span className="stat-value" style={{ color: '#9333ea' }}>{orders.filter(o => o.status === 'shipped').length}</span>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="admin-stat-card mini">
            <div className="stat-content">
              <span className="stat-label">Delivered</span>
              <span className="stat-value text-success">{orders.filter(o => o.status === 'delivered').length}</span>
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
                  placeholder="Search order #, name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4 text-md-end">
              <span className="text-muted">{filteredOrders.length} order(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-card-body p-0">
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="fw-medium">{order.orderNumber}</span>
                      {order.trackingNumber && (
                        <div><small className="text-muted">Track: {order.trackingNumber}</small></div>
                      )}
                    </td>
                    <td>
                      <div>{order.customerName || 'N/A'}</div>
                      <small className="text-muted">{order.customerEmail || ''}</small>
                    </td>
                    <td>
                      <span>{order.items.length} item(s)</span>
                    </td>
                    <td>
                      <span className="fw-medium">₹{order.total.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)} text-capitalize`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(order.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            {statusOptions.map(status => (
                              <li key={status}>
                                <button
                                  className="dropdown-item text-capitalize"
                                  onClick={() => handleStatusChange(order.id, status)}
                                  disabled={order.status === status}
                                >
                                  Mark as {status}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-card mt-4">
        <div className="admin-card-body">
          <h5 className="mb-3">Customer Customization Requests</h5>
          {customizations.length === 0 ? (
            <p className="text-muted mb-0">No customization requests submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table admin-table mb-0">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customizations.map((item) => (
                    <tr key={item.id}>
                      <td>{item.customerName}</td>
                      <td>
                        <div className="fw-medium">{item.title}</div>
                        {item.description && <small className="text-muted">{item.description}</small>}
                      </td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">{item.status}</span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

// Order Details Modal
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onStatusChange }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [notes, setNotes] = useState('');

  const getStatusBadge = (status: Order['status']) => {
    const badges: Record<Order['status'], string> = {
      pending: 'bg-warning text-dark',
      processing: 'bg-primary',
      shipped: 'bg-purple',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
    };
    return badges[status] || 'bg-secondary';
  };

  const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h3>Order {order.orderNumber}</h3>
            <small className="text-muted">
              Placed on {new Date(order.date).toLocaleString()}
            </small>
          </div>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="admin-modal-body">
          <div className="row g-4">
            {/* Order Status */}
            <div className="col-12">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className={`badge ${getStatusBadge(order.status)} text-capitalize fs-6`}>
                  {order.status}
                </span>
                <select
                  className="form-select w-auto"
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status} className="text-capitalize">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Info */}
            <div className="col-md-6">
              <div className="admin-detail-card">
                <h5><i className="bi bi-person me-2"></i>Customer</h5>
                <p className="mb-1 fw-medium">{order.customerName || 'N/A'}</p>
                <p className="mb-1 text-muted">{order.customerEmail || 'N/A'}</p>
                <p className="mb-0 text-muted">—</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="col-md-6">
              <div className="admin-detail-card">
                <h5><i className="bi bi-geo-alt me-2"></i>Shipping Address</h5>
                <p className="mb-0">{order.shippingAddress || 'N/A'}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="col-12">
              <div className="admin-detail-card">
                <h5><i className="bi bi-bag me-2"></i>Order Items</h5>
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Customization</th>
                      <th className="text-end">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td><small className="text-muted">{item.size || item.color || '-'}</small></td>
                        <td className="text-end">{item.quantity}</td>
                        <td className="text-end">₹{item.price}</td>
                        <td className="text-end">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-end">Total</td>
                      <td className="text-end">₹{order.total}</td>
                    </tr>
                    <tr className="fw-bold">
                      <td colSpan={4} className="text-end">Payable</td>
                      <td className="text-end">₹{order.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Info */}
            <div className="col-md-6">
              <div className="admin-detail-card">
                <h5><i className="bi bi-credit-card me-2"></i>Payment</h5>
                <p className="mb-1">Method: Online</p>
                <p className="mb-0">
                  Status: <span className="badge bg-warning text-dark">
                    pending
                  </span>
                </p>
              </div>
            </div>

            {/* Tracking */}
            <div className="col-md-6">
              <div className="admin-detail-card">
                <h5><i className="bi bi-truck me-2"></i>Tracking</h5>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <button className="btn btn-outline-primary">Update</button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="col-12">
              <div className="admin-detail-card">
                <h5><i className="bi bi-sticky me-2"></i>Notes</h5>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Add internal notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-outline-danger">
            <i className="bi bi-printer me-2"></i>Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
