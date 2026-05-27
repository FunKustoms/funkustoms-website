import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useUserStore } from '../store';
import { ordersAPI } from '../services/api';
import type { Order } from '../types';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PaymentForm {
  method: 'card' | 'upi' | 'cod' | 'netbanking';
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  upiId: string;
}

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, addOrder } = useUserStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
  });

  const subtotal = getTotalPrice();
  const gst = Math.round(subtotal * 0.05);
  const shipping = 0;
  const total = subtotal + gst + shipping;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order ID
    const newOrderId = `FK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
    setOrderId(newOrderId);

    const localOrder: Order = {
      id: Date.now().toString(),
      orderNumber: newOrderId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
      })),
      total: total,
      shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.pincode}`,
    };

    addOrder(localOrder);

    try {
      await ordersAPI.create({
        userId: user?.id || 'guest',
        orderNumber: newOrderId,
        customerName: `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
        customerEmail: shippingForm.email,
        customerPhone: shippingForm.phone,
        shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.pincode}`,
        products: items.map((item) => ({
          productId: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        status: 'pending',
        paymentStatus: 'pending',
      });
    } catch {
      // Keep local order so user flow still works even if API is temporarily unavailable.
    }

    // Clear cart
    clearCart();

    setIsProcessing(false);
    setOrderPlaced(true);
  };

  // Empty cart redirect
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center py-5">
              <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '80px' }}></i>
              <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">Add some items to your cart before checking out.</p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                <i className="fas fa-store me-2"></i>Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order Success
  if (orderPlaced) {
    return (
      <div className="checkout-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center py-5">
              <div className="success-checkmark mb-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: '#d4edda',
                    color: '#28a745'
                  }}
                >
                  <i className="fas fa-check" style={{ fontSize: '60px' }}></i>
                </div>
              </div>
              <h2 className="fw-bold mb-3" style={{ color: '#28a745' }}>Order Placed Successfully!</h2>
              <p className="text-muted mb-2">Thank you for your order.</p>
              <p className="mb-4">
                <span className="text-muted">Order ID: </span>
                <span className="fw-bold">{orderId}</span>
              </p>
              <p className="text-muted small mb-4">
                We've sent a confirmation email to <strong>{shippingForm.email}</strong>
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/profile" className="btn btn-primary">
                  <i className="fas fa-box me-2"></i>Track Order
                </Link>
                <Link to="/shop" className="btn btn-outline-secondary">
                  <i className="fas fa-store me-2"></i>Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page py-5">
      <div className="container">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="section-title mb-3">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 1 ? 'text-white' : 'text-muted'}`}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundColor: step >= 1 ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: 'bold'
                }}
              >
                {step > 1 ? <i className="fas fa-check"></i> : '1'}
              </div>
              <span className={`small ${step >= 1 ? 'fw-semibold' : 'text-muted'}`}>Shipping</span>
              
              <div className="mx-2" style={{ width: '60px', height: '2px', backgroundColor: step >= 2 ? 'var(--accent)' : 'var(--muted)' }}></div>
              
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 2 ? 'text-white' : 'text-muted'}`}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundColor: step >= 2 ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: 'bold'
                }}
              >
                {step > 2 ? <i className="fas fa-check"></i> : '2'}
              </div>
              <span className={`small ${step >= 2 ? 'fw-semibold' : 'text-muted'}`}>Payment</span>
              
              <div className="mx-2" style={{ width: '60px', height: '2px', backgroundColor: step >= 3 ? 'var(--accent)' : 'var(--muted)' }}></div>
              
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center ${step >= 3 ? 'text-white' : 'text-muted'}`}
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  backgroundColor: step >= 3 ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: 'bold'
                }}
              >
                3
              </div>
              <span className={`small ${step >= 3 ? 'fw-semibold' : 'text-muted'}`}>Review</span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-truck me-2" style={{ color: 'var(--accent)' }}></i>
                    Shipping Information
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleShippingSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={shippingForm.firstName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={shippingForm.lastName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Phone <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={shippingForm.phone}
                          onChange={handleShippingChange}
                          required
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Address <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={shippingForm.address}
                          onChange={handleShippingChange}
                          required
                          placeholder="House/Flat No., Street, Landmark"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">City <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={shippingForm.city}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">State <span className="text-danger">*</span></label>
                        <select
                          className="form-select"
                          name="state"
                          value={shippingForm.state}
                          onChange={handleShippingChange}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">PIN Code <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={shippingForm.pincode}
                          onChange={handleShippingChange}
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          placeholder="000000"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={shippingForm.country}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <Link to="/cart" className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left me-2"></i>Back to Cart
                      </Link>
                      <button type="submit" className="btn" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                        Continue to Payment<i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-credit-card me-2" style={{ color: 'var(--accent)' }}></i>
                    Payment Method
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePaymentSubmit}>
                    {/* Payment Options */}
                    <div className="mb-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div 
                            className={`card h-100 cursor-pointer ${paymentForm.method === 'card' ? 'border-2' : ''}`}
                            style={{ 
                              borderColor: paymentForm.method === 'card' ? 'var(--accent)' : 'var(--border)',
                              cursor: 'pointer',
                              borderRadius: '0.75rem'
                            }}
                            onClick={() => setPaymentForm((prev) => ({ ...prev, method: 'card' }))}
                          >
                            <div className="card-body d-flex align-items-center gap-3">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                checked={paymentForm.method === 'card'}
                                onChange={() => setPaymentForm((prev) => ({ ...prev, method: 'card' }))}
                              />
                              <div>
                                <i className="fas fa-credit-card fa-2x mb-2" style={{ color: 'var(--accent)' }}></i>
                                <h6 className="mb-0 fw-bold">Credit / Debit Card</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div 
                            className={`card h-100 ${paymentForm.method === 'upi' ? 'border-2' : ''}`}
                            style={{ 
                              borderColor: paymentForm.method === 'upi' ? 'var(--accent)' : 'var(--border)',
                              cursor: 'pointer',
                              borderRadius: '0.75rem'
                            }}
                            onClick={() => setPaymentForm((prev) => ({ ...prev, method: 'upi' }))}
                          >
                            <div className="card-body d-flex align-items-center gap-3">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                checked={paymentForm.method === 'upi'}
                                onChange={() => setPaymentForm((prev) => ({ ...prev, method: 'upi' }))}
                              />
                              <div>
                                <i className="fab fa-google-pay fa-2x mb-2" style={{ color: 'var(--accent)' }}></i>
                                <h6 className="mb-0 fw-bold">UPI / Google Pay</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div 
                            className={`card h-100 ${paymentForm.method === 'netbanking' ? 'border-2' : ''}`}
                            style={{ 
                              borderColor: paymentForm.method === 'netbanking' ? 'var(--accent)' : 'var(--border)',
                              cursor: 'pointer',
                              borderRadius: '0.75rem'
                            }}
                            onClick={() => setPaymentForm((prev) => ({ ...prev, method: 'netbanking' }))}
                          >
                            <div className="card-body d-flex align-items-center gap-3">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                checked={paymentForm.method === 'netbanking'}
                                onChange={() => setPaymentForm((prev) => ({ ...prev, method: 'netbanking' }))}
                              />
                              <div>
                                <i className="fas fa-university fa-2x mb-2" style={{ color: 'var(--accent)' }}></i>
                                <h6 className="mb-0 fw-bold">Net Banking</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div 
                            className={`card h-100 ${paymentForm.method === 'cod' ? 'border-2' : ''}`}
                            style={{ 
                              borderColor: paymentForm.method === 'cod' ? 'var(--accent)' : 'var(--border)',
                              cursor: 'pointer',
                              borderRadius: '0.75rem'
                            }}
                            onClick={() => setPaymentForm((prev) => ({ ...prev, method: 'cod' }))}
                          >
                            <div className="card-body d-flex align-items-center gap-3">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                checked={paymentForm.method === 'cod'}
                                onChange={() => setPaymentForm((prev) => ({ ...prev, method: 'cod' }))}
                              />
                              <div>
                                <i className="fas fa-money-bill-wave fa-2x mb-2" style={{ color: 'var(--accent)' }}></i>
                                <h6 className="mb-0 fw-bold">Cash on Delivery</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    {paymentForm.method === 'card' && (
                      <div className="card mb-4" style={{ borderRadius: '0.75rem', borderColor: 'var(--border)' }}>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label fw-semibold">Card Number</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardNumber"
                                value={paymentForm.cardNumber}
                                onChange={handlePaymentChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-semibold">Name on Card</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardName"
                                value={paymentForm.cardName}
                                onChange={handlePaymentChange}
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">Expiry Date</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardExpiry"
                                value={paymentForm.cardExpiry}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">CVV</label>
                              <input
                                type="password"
                                className="form-control"
                                name="cardCvv"
                                value={paymentForm.cardCvv}
                                onChange={handlePaymentChange}
                                placeholder="***"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Details */}
                    {paymentForm.method === 'upi' && (
                      <div className="card mb-4" style={{ borderRadius: '0.75rem', borderColor: 'var(--border)' }}>
                        <div className="card-body">
                          <label className="form-label fw-semibold">UPI ID</label>
                          <input
                            type="text"
                            className="form-control"
                            name="upiId"
                            value={paymentForm.upiId}
                            onChange={handlePaymentChange}
                            placeholder="yourname@upi"
                          />
                        </div>
                      </div>
                    )}

                    {/* COD Notice */}
                    {paymentForm.method === 'cod' && (
                      <div className="alert alert-warning mb-4">
                        <i className="fas fa-info-circle me-2"></i>
                        Cash on Delivery is available. Please keep exact change ready at the time of delivery.
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                        <i className="fas fa-arrow-left me-2"></i>Back to Shipping
                      </button>
                      <button type="submit" className="btn" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                        Review Order<i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                  <h5 className="fw-bold mb-0">
                    <i className="fas fa-clipboard-check me-2" style={{ color: 'var(--accent)' }}></i>
                    Review Your Order
                  </h5>
                </div>
                <div className="card-body">
                  {/* Shipping Address */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Shipping Address</h6>
                      <button className="btn btn-link btn-sm p-0" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="mb-1 fw-semibold">{shippingForm.firstName} {shippingForm.lastName}</p>
                      <p className="mb-1 small">{shippingForm.address}</p>
                      <p className="mb-1 small">{shippingForm.city}, {shippingForm.state} - {shippingForm.pincode}</p>
                      <p className="mb-0 small text-muted">
                        <i className="fas fa-phone me-1"></i>{shippingForm.phone}
                        <span className="mx-2">|</span>
                        <i className="fas fa-envelope me-1"></i>{shippingForm.email}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Payment Method</h6>
                      <button className="btn btn-link btn-sm p-0" onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="mb-0">
                        {paymentForm.method === 'card' && <><i className="fas fa-credit-card me-2"></i>Credit/Debit Card ending in ****{paymentForm.cardNumber.slice(-4)}</>}
                        {paymentForm.method === 'upi' && <><i className="fab fa-google-pay me-2"></i>UPI - {paymentForm.upiId}</>}
                        {paymentForm.method === 'netbanking' && <><i className="fas fa-university me-2"></i>Net Banking</>}
                        {paymentForm.method === 'cod' && <><i className="fas fa-money-bill-wave me-2"></i>Cash on Delivery</>}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Order Items ({items.length})</h6>
                    {items.map((item) => (
                      <div key={item.id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                        <div 
                          className="rounded overflow-hidden bg-light"
                          style={{ width: '60px', height: '60px', flexShrink: 0 }}
                        >
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Product';
                            }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-semibold small">{item.name}</h6>
                          <p className="mb-0 text-muted small">
                            {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="fw-bold">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(2)}>
                      <i className="fas fa-arrow-left me-2"></i>Back to Payment
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-lg"
                      style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock me-2"></i>Place Order • ₹{total}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', position: 'sticky', top: '100px' }}>
              <div className="card-header bg-white border-bottom py-3" style={{ borderRadius: '1rem 1rem 0 0' }}>
                <h5 className="fw-bold mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                {/* Items Preview */}
                <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-2 mb-2">
                      <div 
                        className="rounded overflow-hidden bg-light position-relative"
                        style={{ width: '50px', height: '50px', flexShrink: 0 }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=P';
                          }}
                        />
                        <span 
                          className="position-absolute top-0 end-0 badge rounded-pill bg-dark"
                          style={{ fontSize: '0.65rem', transform: 'translate(25%, -25%)' }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 small fw-semibold text-truncate" style={{ maxWidth: '150px' }}>{item.name}</p>
                      </div>
                      <div className="small fw-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold">₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">GST (5%)</span>
                  <span className="fw-semibold">₹{gst}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-4" style={{ color: 'var(--accent)' }}>₹{total}</span>
                </div>

                {/* Security Badge */}
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-2">
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure checkout powered by SSL encryption
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <i className="fab fa-cc-visa fa-lg text-muted"></i>
                    <i className="fab fa-cc-mastercard fa-lg text-muted"></i>
                    <i className="fab fa-google-pay fa-lg text-muted"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
