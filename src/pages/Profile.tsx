import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store';
import { useCartStore } from '../store';
import type { Order } from '../types';

type TabType = 'orders' | 'cart' | 'designs' | 'settings';

// Preset color options for avatar
const avatarColorPresets = [
  { name: 'Original', hue: 0, displayColor: '#e07a5f' },
  { name: 'Blue', hue: 60, displayColor: '#4a90d9' },
  { name: 'Purple', hue: 110, displayColor: '#9b59b6' },
  { name: 'Pink', hue: 150, displayColor: '#e84393' },
  { name: 'Red', hue: 200, displayColor: '#e74c3c' },
  { name: 'Green', hue: 250, displayColor: '#27ae60' },
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const { user, orders, savedDesigns, updateUser, removeSavedDesign, logout, hydrateUserData } = useUserStore();
  const { items: cartItems, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  // Avatar customization state
  const [avatarHue, setAvatarHue] = useState(user?.avatarHue || 0);
  const [gender, setGender] = useState<'male' | 'female'>(user?.gender || 'male');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      hydrateUserData();
    }
  }, [user, hydrateUserData]);

  // Get avatar image based on gender
  const getAvatarImage = () => {
    return gender === 'female' ? '/assets/pp/female pp.png' : '/assets/pp/male pp.png';
  };

  // Handle gender change
  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender);
    updateUser({ gender: newGender });
  };

  // Handle hue change
  const handleHueChange = (newHue: number) => {
    setAvatarHue(newHue);
    updateUser({ avatarHue: newHue });
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSettingsMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      updateUser({
        name: settingsForm.name,
        email: settingsForm.email,
        phone: settingsForm.phone,
      });
      
      setSettingsMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setSettingsMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSettingsMessage(null);

    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'New passwords do not match!' });
      setIsSaving(false);
      return;
    }

    if (settingsForm.newPassword.length < 8) {
      setSettingsMessage({ type: 'error', text: 'Password must be at least 8 characters long!' });
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSettingsForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      setSettingsMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch {
      setSettingsMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'processing':
        return 'bg-info text-white';
      case 'shipped':
        return 'bg-primary text-white';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="profile-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <i className="fas fa-user-circle text-muted mb-4" style={{ fontSize: '80px' }}></i>
              <h2 className="fw-bold mb-3">Please Sign In</h2>
              <p className="text-muted mb-4">
                Sign in to view your orders, saved designs, and manage your account settings.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page py-5">
      <div className="container">
        {/* Profile Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: 'var(--fg)', color: 'white', borderRadius: '1rem' }}>
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                  <div 
                    className="profile-avatar rounded-circle overflow-hidden"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      backgroundColor: '#f0f0f0',
                      flexShrink: 0
                    }}
                  >
                    <img 
                      src={getAvatarImage()}
                      alt="Profile Avatar"
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        filter: `hue-rotate(${avatarHue}deg)`
                      }}
                    />
                  </div>
                  <div className="text-center text-md-start flex-grow-1">
                    <h2 className="fw-bold mb-1">{user.name}</h2>
                    <p className="mb-2 opacity-75">
                      <i className="fas fa-envelope me-2"></i>{user.email}
                    </p>
                    <p className="mb-0 opacity-75">
                      <i className="fas fa-phone me-2"></i>{user.phone}
                    </p>
                  </div>
                  <div className="text-center text-md-end">
                    <p className="small opacity-75 mb-2">Member since {formatDate(user.createdAt)}</p>
                    <button 
                      className="btn btn-outline-light btn-sm"
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-pills nav-fill gap-2 flex-nowrap overflow-auto" style={{ flexWrap: 'nowrap' }}>
              <li className="nav-item">
                <button
                  className={`nav-link profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                  style={{ 
                    backgroundColor: activeTab === 'orders' ? 'var(--accent)' : 'transparent',
                    border: activeTab === 'orders' ? 'none' : '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-shopping-bag me-2"></i>My Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link profile-tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cart')}
                  style={{ 
                    backgroundColor: activeTab === 'cart' ? 'var(--accent)' : 'transparent',
                    border: activeTab === 'cart' ? 'none' : '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-shopping-cart me-2"></i>Cart ({cartItems.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link profile-tab-btn ${activeTab === 'designs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('designs')}
                  style={{ 
                    backgroundColor: activeTab === 'designs' ? 'var(--accent)' : 'transparent',
                    border: activeTab === 'designs' ? 'none' : '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-palette me-2"></i>Saved Designs
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                  style={{ 
                    backgroundColor: activeTab === 'settings' ? 'var(--accent)' : 'transparent',
                    border: activeTab === 'settings' ? 'none' : '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className="fas fa-cog me-2"></i>Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h4 className="fw-bold mb-4">Order History</h4>
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-box-open text-muted mb-3" style={{ fontSize: '60px' }}></i>
                    <h5 className="text-muted">No orders yet</h5>
                    <p className="text-muted mb-4">Start shopping to see your orders here!</p>
                    <Link to="/shop" className="btn btn-primary">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="card border-0 shadow-sm mb-3" style={{ borderRadius: '1rem' }}>
                        <div className="card-header bg-white border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2 py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                          <div>
                            <span className="fw-bold">{order.orderNumber}</span>
                            <span className="text-muted ms-3">{formatDate(order.date)}</span>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(order.status)} text-capitalize`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="card-body">
                          {order.items.map((item) => (
                            <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
                              <div 
                                className="order-item-image bg-light rounded"
                                style={{ width: '70px', height: '70px', overflow: 'hidden' }}
                              >
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/70x70?text=Product';
                                  }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">{item.name}</h6>
                                <p className="small text-muted mb-0">
                                  {item.size && <span className="me-2">Size: {item.size}</span>}
                                  {item.color && <span className="me-2">Color: {item.color}</span>}
                                  <span>Qty: {item.quantity}</span>
                                </p>
                              </div>
                              <div className="text-end">
                                <span className="fw-bold">₹{item.price * item.quantity}</span>
                              </div>
                            </div>
                          ))}
                          <hr />
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              {order.trackingNumber && (
                                <span className="small text-muted">
                                  <i className="fas fa-truck me-1"></i>
                                  Tracking: {order.trackingNumber}
                                </span>
                              )}
                            </div>
                            <div className="text-end">
                              <span className="text-muted small">Total: </span>
                              <span className="fw-bold fs-5">₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="cart-tab">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Shopping Cart</h4>
                  {cartItems.length > 0 && (
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={clearCart}
                    >
                      <i className="fas fa-trash me-2"></i>Clear Cart
                    </button>
                  )}
                </div>
                {cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-cart text-muted mb-3" style={{ fontSize: '60px' }}></i>
                    <h5 className="text-muted">Your cart is empty</h5>
                    <p className="text-muted mb-4">Add some products to get started!</p>
                    <Link to="/shop" className="btn btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cartItems.map((item) => (
                        <div key={item.id} className="card border-0 shadow-sm mb-3" style={{ borderRadius: '1rem' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-3">
                              <div 
                                className="cart-item-image bg-light rounded"
                                style={{ width: '80px', height: '80px', overflow: 'hidden' }}
                              >
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Product';
                                  }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">{item.name}</h6>
                                <p className="small text-muted mb-2">
                                  {item.size && <span className="me-2">Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </p>
                                <span className="fw-bold" style={{ color: 'var(--accent)' }}>₹{item.price}</span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="fw-semibold" style={{ minWidth: '30px', textAlign: 'center' }}>
                                  {item.quantity}
                                </span>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                              <div className="text-end" style={{ minWidth: '80px' }}>
                                <span className="fw-bold">₹{item.price * item.quantity}</span>
                              </div>
                              <button 
                                className="btn btn-sm text-danger"
                                onClick={() => removeItem(item.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '1rem' }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Subtotal</span>
                          <span className="fw-semibold">₹{getTotalPrice()}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Shipping</span>
                          <span className="text-success fw-semibold">FREE</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="fw-bold fs-5">Total</span>
                          <span className="fw-bold fs-4" style={{ color: 'var(--accent)' }}>₹{getTotalPrice()}</span>
                        </div>
                        <button className="btn btn-lg w-100" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                          <i className="fas fa-lock me-2"></i>Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Designs Tab */}
            {activeTab === 'designs' && (
              <div className="designs-tab">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Saved Designs</h4>
                  <Link to="/customize" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Create New Design
                  </Link>
                </div>
                {savedDesigns.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-palette text-muted mb-3" style={{ fontSize: '60px' }}></i>
                    <h5 className="text-muted">No saved designs</h5>
                    <p className="text-muted mb-4">Create your first custom design!</p>
                    <Link to="/customize" className="btn btn-primary">
                      Start Designing
                    </Link>
                  </div>
                ) : (
                  <div className="row g-4">
                    {savedDesigns.map((design) => (
                      <div key={design.id} className="col-sm-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                          <div 
                            className="design-preview bg-light"
                            style={{ height: '200px', overflow: 'hidden' }}
                          >
                            <img 
                              src={design.image} 
                              alt={design.name}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Design';
                              }}
                            />
                          </div>
                          <div className="card-body">
                            <h6 className="fw-bold mb-2">{design.name}</h6>
                            <p className="small text-muted mb-2">
                              <i className="fas fa-tshirt me-1"></i>{design.productType}
                              {design.size && <span className="ms-2">• Size: {design.size}</span>}
                            </p>
                            <p className="small text-muted mb-3">
                              <i className="fas fa-calendar me-1"></i>Created: {formatDate(design.createdAt)}
                            </p>
                            <div className="d-flex gap-2">
                              <Link 
                                to="/customize" 
                                className="btn btn-sm flex-grow-1"
                                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                              >
                                <i className="fas fa-edit me-1"></i>Edit
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeSavedDesign(design.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h4 className="fw-bold mb-4">Account Settings</h4>

                {settingsMessage && (
                  <div className={`alert alert-${settingsMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                    <i className={`fas fa-${settingsMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                    {settingsMessage.text}
                    <button type="button" className="btn-close" onClick={() => setSettingsMessage(null)}></button>
                  </div>
                )}

                <div className="row g-4">
                  {/* Avatar Customization */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                      <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-user-circle me-2" style={{ color: 'var(--accent)' }}></i>
                          Profile Picture
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row align-items-center">
                          {/* Avatar Preview */}
                          <div className="col-md-4 text-center mb-4 mb-md-0">
                            <div 
                              className="avatar-preview mx-auto rounded-circle overflow-hidden mb-3"
                              style={{ 
                                width: '150px', 
                                height: '150px', 
                                backgroundColor: '#f0f0f0',
                                border: '4px solid var(--accent)'
                              }}
                            >
                              <img 
                                src={getAvatarImage()}
                                alt="Avatar Preview"
                                className="w-100 h-100"
                                style={{ 
                                  objectFit: 'cover',
                                  filter: `hue-rotate(${avatarHue}deg)`
                                }}
                              />
                            </div>
                            <p className="text-muted small mb-0">Live Preview</p>
                          </div>

                          {/* Avatar Options */}
                          <div className="col-md-8">
                            {/* Gender Selection */}
                            <div className="mb-4">
                              <label className="form-label fw-semibold">Select Gender</label>
                              <div className="d-flex gap-3">
                                <button
                                  type="button"
                                  className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 ${gender === 'male' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                  onClick={() => handleGenderChange('male')}
                                  style={gender === 'male' ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                                >
                                  <i className="fas fa-mars" style={{ fontSize: '1.5rem' }}></i>
                                  <span className="fw-semibold">Male</span>
                                </button>
                                <button
                                  type="button"
                                  className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 ${gender === 'female' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                  onClick={() => handleGenderChange('female')}
                                  style={gender === 'female' ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                                >
                                  <i className="fas fa-venus" style={{ fontSize: '1.5rem' }}></i>
                                  <span className="fw-semibold">Female</span>
                                </button>
                              </div>
                            </div>

                            {/* Hue Slider */}
                            <div className="mb-4">
                              <label className="form-label fw-semibold">
                                Avatar Color <span className="text-muted fw-normal">({avatarHue}°)</span>
                              </label>
                              <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="360"
                                value={avatarHue}
                                onChange={(e) => handleHueChange(parseInt(e.target.value))}
                                style={{
                                  background: `linear-gradient(to right, 
                                    hsl(0, 80%, 60%), 
                                    hsl(60, 80%, 60%), 
                                    hsl(120, 80%, 60%), 
                                    hsl(180, 80%, 60%), 
                                    hsl(240, 80%, 60%), 
                                    hsl(300, 80%, 60%), 
                                    hsl(360, 80%, 60%)
                                  )`,
                                  height: '12px',
                                  borderRadius: '6px'
                                }}
                              />
                            </div>

                            {/* Color Presets */}
                            <div>
                              <label className="form-label fw-semibold">Quick Color Presets</label>
                              <div className="d-flex flex-wrap gap-2">
                                {avatarColorPresets.map((preset) => (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    className={`btn btn-sm ${avatarHue === preset.hue ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleHueChange(preset.hue)}
                                    style={avatarHue === preset.hue ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                                  >
                                    <span 
                                      className="d-inline-block rounded-circle me-1"
                                      style={{ 
                                        width: '12px', 
                                        height: '12px', 
                                        backgroundColor: preset.displayColor,
                                        verticalAlign: 'middle'
                                      }}
                                    ></span>
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                      <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-user me-2" style={{ color: 'var(--accent)' }}></i>
                          Profile Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleProfileUpdate}>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={settingsForm.name}
                              onChange={handleSettingsChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={settingsForm.email}
                              onChange={handleSettingsChange}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="form-label fw-semibold">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              name="phone"
                              value={settingsForm.phone}
                              onChange={handleSettingsChange}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn w-100"
                            disabled={isSaving}
                            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                          >
                            {isSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                      <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-lock me-2" style={{ color: 'var(--accent)' }}></i>
                          Change Password
                        </h5>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handlePasswordChange}>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Current Password</label>
                            <input
                              type="password"
                              className="form-control"
                              name="currentPassword"
                              value={settingsForm.currentPassword}
                              onChange={handleSettingsChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              name="newPassword"
                              value={settingsForm.newPassword}
                              onChange={handleSettingsChange}
                              required
                              minLength={8}
                            />
                            <div className="form-text">Minimum 8 characters</div>
                          </div>
                          <div className="mb-4">
                            <label className="form-label fw-semibold">Confirm New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              name="confirmPassword"
                              value={settingsForm.confirmPassword}
                              onChange={handleSettingsChange}
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-outline-secondary w-100"
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-key me-2"></i>
                                Update Password
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="col-12">
                    <div className="card border-danger" style={{ borderRadius: '1rem' }}>
                      <div className="card-header bg-danger text-white py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                        <h5 className="mb-0 fw-bold">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Danger Zone
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                          <div>
                            <h6 className="fw-bold mb-1">Delete Account</h6>
                            <p className="text-muted small mb-0">
                              Once you delete your account, there is no going back. All your data will be permanently removed.
                            </p>
                          </div>
                          <button className="btn btn-outline-danger">
                            <i className="fas fa-trash me-2"></i>Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
