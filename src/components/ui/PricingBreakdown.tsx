import React from 'react';
import type { PricingBreakdown as PricingBreakdownType } from '../../types';

interface PricingBreakdownProps {
  pricing: PricingBreakdownType;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ pricing }) => {
  return (
    <div className="pricing-breakdown card bg-light border-0">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="fas fa-receipt me-2"></i>
          Price Breakdown
        </h5>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">T-shirt Base Price:</span>
          <span className="fw-medium">₹{pricing.tshirtCost.toFixed(2)}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">
            Design Area ({pricing.designArea.toFixed(1)} sq.in × ₹1):
          </span>
          <span className="fw-medium">₹{pricing.rawDesignCost.toFixed(2)}</span>
        </div>
        
        {pricing.roundedOffAmount !== 0 && (
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Rounded Off:</span>
            <span className={`fw-medium ${pricing.roundedOffAmount > 0 ? 'text-danger' : 'text-success'}`}>
              {pricing.roundedOffAmount > 0 ? '+' : ''}₹{pricing.roundedOffAmount.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Design Cost (Rounded):</span>
          <span className="fw-medium">₹{pricing.roundedDesignCost.toFixed(2)}</span>
        </div>
        
        <hr />
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Subtotal:</span>
          <span className="fw-medium">₹{pricing.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">GST (5%):</span>
          <span className="fw-medium">₹{pricing.gst.toFixed(2)}</span>
        </div>
        
        <hr />
        
        <div className="d-flex justify-content-between">
          <span className="fw-bold fs-5">Total:</span>
          <span className="fw-bold fs-5 text-primary">₹{pricing.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;
