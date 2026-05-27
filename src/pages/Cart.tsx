import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="cart-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center py-5">
              <div className="mb-4">
                <i className="fas fa-shopping-cart" style={{ fontSize: '80px', color: 'var(--muted-fg)' }}></i>
              </div>
              <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet. Start exploring our products!
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <i className="fas fa-store me-2"></i>Browse Shop
                </Link>
                <Link to="/customize" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-paint-brush me-2"></i>Create Custom Design
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">Shopping Cart</h1>
          <button 
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            <i className="fas fa-trash me-2"></i>Clear Cart
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
              <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <span className="fw-bold">Product</span>
                  </div>
                  <div className="col-md-2 text-center d-none d-md-block">
                    <span className="fw-bold">Price</span>
                  </div>
                  <div className="col-md-2 text-center d-none d-md-block">
                    <span className="fw-bold">Quantity</span>
                  </div>
                  <div className="col-md-2 text-end d-none d-md-block">
                    <span className="fw-bold">Total</span>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`p-4 ${index !== items.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="row align-items-center">
                      {/* Product Info */}
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="cart-item-image bg-light rounded overflow-hidden"
                            style={{ width: '100px', height: '100px', flexShrink: 0 }}
                          >
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Product';
                              }}
                            />
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">{item.name}</h6>
                            <p className="small text-muted mb-1">
                              {item.size && <span className="me-2">Size: {item.size}</span>}
                              {item.color && (
                                <span className="d-inline-flex align-items-center">
                                  Color: 
                                  <span 
                                    className="ms-1 rounded-circle d-inline-block"
                                    style={{ 
                                      width: '14px', 
                                      height: '14px', 
                                      backgroundColor: item.color,
                                      border: '1px solid var(--border)'
                                    }}
                                  ></span>
                                </span>
                              )}
                            </p>
                            <button 
                              className="btn btn-link text-danger p-0 small"
                              onClick={() => removeItem(item.id)}
                            >
                              <i className="fas fa-trash me-1"></i>Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-md-2 text-center mt-3 mt-md-0">
                        <span className="d-md-none text-muted small me-2">Price:</span>
                        <span className="fw-semibold">₹{item.price}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-2 text-center mt-3 mt-md-0">
                        <div className="d-inline-flex align-items-center border rounded" style={{ borderColor: 'var(--border)' }}>
                          <button 
                            className="btn btn-sm border-0 px-3 py-2"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="px-3 fw-semibold" style={{ minWidth: '40px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-sm border-0 px-3 py-2"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-md-2 text-end mt-3 mt-md-0">
                        <span className="d-md-none text-muted small me-2">Total:</span>
                        <span className="fw-bold fs-5" style={{ color: 'var(--accent)' }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-4">
              <Link to="/shop" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', position: 'sticky', top: '100px' }}>
              <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <h5 className="fw-bold mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="fw-semibold">₹{getTotalPrice()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">GST (5%)</span>
                  <span className="fw-semibold">₹{Math.round(getTotalPrice() * 0.05)}</span>
                </div>

                {/* Coupon Code */}
                <div className="mb-4">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Coupon code"
                      style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-4" style={{ color: 'var(--accent)' }}>
                    ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
                  </span>
                </div>

                <Link 
                  to="/checkout" 
                  className="btn btn-lg w-100 mb-3"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <i className="fas fa-lock me-2"></i>Proceed to Checkout
                </Link>

                {/* Trust Badges */}
                <div className="text-center">
                  <div className="d-flex justify-content-center gap-4 text-muted small">
                    <span><i className="fas fa-shield-alt me-1"></i>Secure</span>
                    <span><i className="fas fa-truck me-1"></i>Free Shipping</span>
                    <span><i className="fas fa-undo me-1"></i>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '1rem' }}>
              <div className="card-body text-center">
                <p className="text-muted small mb-2">We Accept</p>
                <div className="d-flex justify-content-center gap-3">
                  <i className="fab fa-cc-visa fa-2x text-muted"></i>
                  <i className="fab fa-cc-mastercard fa-2x text-muted"></i>
                  <i className="fab fa-google-pay fa-2x text-muted"></i>
                  <i className="fab fa-cc-paypal fa-2x text-muted"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
