import React, { useState } from 'react';
import type { BulkOrderForm as BulkOrderFormType } from '../types';

const solutionCards = [
  {
    icon: 'fas fa-rocket',
    title: 'Startups and small brands',
    description: 'Launch merch drops, founder kits, and pilot collections without carrying inventory risk.',
    points: ['No strict minimums', 'Fast reorder support', 'White-label fulfillment'],
  },
  {
    icon: 'fas fa-users',
    title: 'Corporate and events',
    description: 'Outfit teams, conferences, offsites, and activations with consistent quality at scale.',
    points: ['Volume pricing', 'Dedicated coordination', 'Rush delivery options'],
  },
  {
    icon: 'fas fa-gift',
    title: 'Corporate gifting',
    description: 'Create gift-ready merchandise for clients, employees, and campaign milestones.',
    points: ['Gift packaging', 'Direct recipient shipping', 'Branding support'],
  },
  {
    icon: 'fas fa-store',
    title: 'Resellers and dropshippers',
    description: 'Use FunKustoms as a production partner while you focus on selling and growth.',
    points: ['White-label shipping', 'Order tracking flow', 'Wholesale-friendly pricing'],
  },
];

const accountBenefits = [
  'Dedicated account manager',
  'Priority production queue',
  'Custom pricing for volume',
  'Sample kits available',
  'Net payment terms for qualified accounts',
  'Brand compliance support',
];

const trustStats = [
  { value: '24h', label: 'Typical response window' },
  { value: '48h', label: 'Average quote turnaround' },
  { value: '1000+', label: 'Pieces handled for large runs' },
];

const processSteps = [
  {
    title: 'Share the brief',
    description: 'Tell us the product type, quantity, deadline, and any brand constraints.',
  },
  {
    title: 'Review the quote',
    description: 'We align on pricing, timeline, and production details before anything moves.',
  },
  {
    title: 'Approve and produce',
    description: 'Once approved, we queue your order and keep delivery expectations clear.',
  },
];

const BulkOrders: React.FC = () => {
  const [formData, setFormData] = useState<BulkOrderFormType>({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    productType: '',
    deadline: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const isRushOrder = daysDiff < 2;

    const formattedDeadline = deadlineDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const message = isRushOrder
      ? `*[URGENT] RUSH ORDER INQUIRY*\n` +
        `================================\n\n` +
        `>>> *DEADLINE: ${formattedDeadline}* <<<\n` +
        `_Less than 2 days - Priority Required!_\n\n` +
        `================================\n\n` +
        `*Customer Details*\n` +
        `- Name: ${formData.name}\n` +
        `- Company: ${formData.company || 'N/A'}\n` +
        `- Email: ${formData.email}\n` +
        `- Phone: ${formData.phone || 'N/A'}\n\n` +
        `*Order Details*\n` +
        `- Type: ${formData.productType || 'Not specified'}\n` +
        `- Quantity: ${formData.quantity || 'Not specified'}\n\n` +
        `*Project Notes*\n` +
        `${formData.notes || 'No additional details'}`
      : `*NEW BULK ORDER INQUIRY*\n` +
        `================================\n\n` +
        `*Customer Details*\n` +
        `- Name: ${formData.name}\n` +
        `- Company: ${formData.company || 'N/A'}\n` +
        `- Email: ${formData.email}\n` +
        `- Phone: ${formData.phone || 'N/A'}\n\n` +
        `*Order Details*\n` +
        `- Type: ${formData.productType || 'Not specified'}\n` +
        `- Quantity: ${formData.quantity || 'Not specified'}\n\n` +
        `*Deadline: ${formattedDeadline}*\n\n` +
        `*Project Notes*\n` +
        `${formData.notes || 'No additional details'}`;

    const whatsappNumber = '918237603202';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bulk-orders-page bulk-success-page">
        <div className="container py-5">
          <div className="bulk-success-shell">
            <div className="success-animation mb-4">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="section-title mb-3">Inquiry sent</h2>
            <p className="section-subtitle mb-4">
              Your bulk order brief is on its way. Our team will review the request and follow up with the next steps and pricing details.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  quantity: '',
                  productType: '',
                  deadline: '',
                  notes: '',
                });
              }}
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bulk-orders-page">
      <section className="bulk-hero-section">
        <div className="container py-5">
          <div className="bulk-hero-grid">
            <div>
              <span className="bulk-kicker">Bulk and business orders</span>
              <h1 className="bulk-hero-title">Merchandise solutions for teams, brands, events, and resellers.</h1>
              <p className="bulk-hero-copy">
                FunKustoms helps you move from idea to delivered product with clearer timelines, responsive support,
                and production guidance that works for serious order volumes.
              </p>

              <div className="bulk-hero-actions">
                <a href="#bulk-quote" className="btn btn-primary btn-lg">
                  Contact Sales
                  <i className="fas fa-arrow-right ms-2"></i>
                </a>
                <a href="tel:+918237603202" className="btn btn-outline-primary btn-lg">
                  Call Business Team
                </a>
              </div>

              <div className="bulk-stats-row">
                {trustStats.map((stat) => (
                  <div className="bulk-stat-box" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bulk-hero-panel">
              <div className="bulk-panel-badge">Trusted order flow</div>
              <h3>What business buyers usually need</h3>
              <div className="bulk-panel-list">
                <div className="bulk-panel-item">
                  <i className="fas fa-check"></i>
                  <span>Reliable delivery windows for events and launches</span>
                </div>
                <div className="bulk-panel-item">
                  <i className="fas fa-check"></i>
                  <span>Brand consistency across larger print runs</span>
                </div>
                <div className="bulk-panel-item">
                  <i className="fas fa-check"></i>
                  <span>Support with packaging, gifting, and partner fulfillment</span>
                </div>
              </div>

              <div className="bulk-process-strip">
                {processSteps.map((step, index) => (
                  <div className="bulk-process-item" key={step.title}>
                    <span>{`0${index + 1}`}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bulk-solutions-section">
        <div className="container py-5">
          <div className="bulk-section-heading">
            <span className="bulk-kicker">Who we support</span>
            <h2 className="section-title mb-3">Built for the different ways businesses order custom products.</h2>
            <p className="section-subtitle">
              Whether you are testing a merch line or coordinating a large event, the workflow should still feel clear and manageable.
            </p>
          </div>

          <div className="row g-4">
            {solutionCards.map((card) => (
              <div className="col-md-6" key={card.title}>
                <article className="bulk-solution-card h-100">
                  <div className="bulk-solution-icon">
                    <i className={card.icon}></i>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <ul className="bulk-check-list">
                    {card.points.map((point) => (
                      <li key={point}>
                        <i className="fas fa-check"></i>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bulk-benefits-section">
        <div className="container py-5">
          <div className="bulk-benefits-shell">
            <div>
              <span className="bulk-kicker bulk-kicker-light">Business account benefits</span>
              <h2 className="section-title text-white mb-3">Extra support where higher-volume orders usually get tricky.</h2>
            </div>

            <div className="bulk-benefit-grid">
              {accountBenefits.map((benefit) => (
                <div className="bulk-benefit-item" key={benefit}>
                  <i className="fas fa-check-circle"></i>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="bulk-quote" className="bulk-quote-section">
        <div className="container py-5">
          <div className="row g-5 align-items-start">
            <div className="col-lg-7">
              <div className="bulk-form-shell">
                <span className="bulk-kicker">Request a quote</span>
                <h2 className="section-title mb-3">Tell us what you need and we will shape the best path forward.</h2>
                <p className="text-muted mb-4">
                  The more detail you share, the faster we can give you accurate pricing and delivery guidance.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="bulk-name" className="form-label">Your Name <span className="text-danger">*</span></label>
                      <input
                        id="bulk-name"
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bulk-company" className="form-label">Company Name</label>
                      <input
                        id="bulk-company"
                        type="text"
                        className="form-control"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bulk-email" className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        id="bulk-email"
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bulk-phone" className="form-label">Phone</label>
                      <input
                        id="bulk-phone"
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bulk-type" className="form-label">Order Type</label>
                      <select
                        id="bulk-type"
                        className="form-select"
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select type</option>
                        <option value="t-shirts">T-Shirts</option>
                        <option value="polo-shirts">Polo Shirts</option>
                        <option value="hoodies">Hoodies</option>
                        <option value="sweatshirts">Sweatshirts</option>
                        <option value="caps">Caps and Hats</option>
                        <option value="bags">Tote Bags</option>
                        <option value="mugs">Mugs</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bulk-quantity" className="form-label">Estimated Quantity</label>
                      <select
                        id="bulk-quantity"
                        className="form-select"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      >
                        <option value="">Select quantity</option>
                        <option value="1-10">1-10 pieces</option>
                        <option value="10-50">10-50 pieces</option>
                        <option value="50-99">50-99 pieces</option>
                        <option value="100-249">100-249 pieces</option>
                        <option value="250-499">250-499 pieces</option>
                        <option value="500-999">500-999 pieces</option>
                        <option value="1000+">1000+ pieces</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="bulk-deadline" className="form-label">Delivery Deadline <span className="text-danger">*</span></label>
                      <input
                        id="bulk-deadline"
                        type="date"
                        className="form-control"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="bulk-notes" className="form-label">Tell us about your project</label>
                      <textarea
                        id="bulk-notes"
                        className="form-control"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Products, design notes, shipping expectations, packaging needs, or anything else we should know."
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn bulk-submit-btn btn-lg w-100"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Sending inquiry...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send via WhatsApp
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="bulk-contact-stack">
                <div className="bulk-contact-card">
                  <span className="bulk-kicker">Prefer to talk?</span>
                  <h3>Business team contact</h3>
                  <p>
                    Reach out directly if you need help deciding quantities, timelines, or the right products for your use case.
                  </p>

                  <div className="bulk-contact-item">
                    <div className="bulk-contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <strong>Call Us</strong>
                      <span>Mon-Sat, 10AM-7PM IST</span>
                      <a href="tel:+918237603202">+91 82376 03202</a>
                    </div>
                  </div>

                  <div className="bulk-contact-item">
                    <div className="bulk-contact-icon bulk-contact-icon-email">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <strong>Email Us</strong>
                      <span>Replies within 24 hours</span>
                      <a href="mailto:business@funkustoms.com">business@funkustoms.com</a>
                    </div>
                  </div>
                </div>

                <div className="bulk-aside-card">
                  <h4>Before you order</h4>
                  <ul className="bulk-check-list">
                    <li><i className="fas fa-check"></i><span>Sample kits available for quality review</span></li>
                    <li><i className="fas fa-check"></i><span>Direct shipping and packaging support for gifting</span></li>
                    <li><i className="fas fa-check"></i><span>Rush orders can be flagged directly in the inquiry</span></li>
                  </ul>
                  <button className="btn btn-outline-primary mt-3">Request Sample Kit</button>
                </div>

                <div className="bulk-aside-card bulk-aside-card-muted">
                  <h4>What helps us quote faster</h4>
                  <div className="bulk-mini-step">
                    <span>01</span>
                    <p>Approximate quantity range</p>
                  </div>
                  <div className="bulk-mini-step">
                    <span>02</span>
                    <p>Expected deadline or event date</p>
                  </div>
                  <div className="bulk-mini-step">
                    <span>03</span>
                    <p>Product shortlist and branding notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrders;
