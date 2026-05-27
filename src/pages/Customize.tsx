import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDesignStore, useCartStore, useUserStore } from '../store';
import PricingBreakdown from '../components/ui/PricingBreakdown';
import { categories, sizePrices, tshirtColors } from '../data/products';
import { customizationsAPI } from '../services/api';

// Constants for the canvas
const OUTER_CANVAS_WIDTH = 22; // inches
const OUTER_CANVAS_HEIGHT = 36; // inches
const SCALE = 15; // pixels per inch for display
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const Customize: React.FC = () => {
  const { designData, setDesignData, calculatePricing, resetDesign } = useDesignStore();
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const [pricing, setPricing] = useState(calculatePricing());
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outerCanvasPixelWidth = OUTER_CANVAS_WIDTH * SCALE;
  const outerCanvasPixelHeight = OUTER_CANVAS_HEIGHT * SCALE;

  // Calculate pricing when design data changes
  useEffect(() => {
    setPricing(calculatePricing());
  }, [designData.designWidth, designData.designHeight, designData.size, designData.tshirtPrice, calculatePricing]);

  const handleFileUpload = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds 25MB limit. Please choose a smaller file.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setImageAspectRatio(aspectRatio);
        
        // Set initial design size (8x8 inches or proportional)
        const initialWidth = 8;
        const initialHeight = initialWidth / aspectRatio;
        
        setDesignData({
          image: e.target?.result as string,
          designWidth: initialWidth,
          designHeight: initialHeight,
          positionX: (OUTER_CANVAS_WIDTH - initialWidth) / 2,
          positionY: (OUTER_CANVAS_HEIGHT - initialHeight) / 2,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [setDesignData]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Mouse handlers for dragging the design
  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    
    if (handle) {
      setIsResizing(true);
      setActiveHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const deltaX = (e.clientX - dragStart.x) / SCALE;
    const deltaY = (e.clientY - dragStart.y) / SCALE;

    if (isDragging) {
      const newX = Math.max(0, Math.min(OUTER_CANVAS_WIDTH - designData.designWidth, designData.positionX + deltaX));
      const newY = Math.max(0, Math.min(OUTER_CANVAS_HEIGHT - designData.designHeight, designData.positionY + deltaY));
      
      setDesignData({
        positionX: newX,
        positionY: newY,
      });
    } else if (isResizing && activeHandle) {
      let newWidth = designData.designWidth;
      let newHeight = designData.designHeight;
      let newX = designData.positionX;
      let newY = designData.positionY;

      // Maintain aspect ratio
      if (activeHandle.includes('e')) {
        newWidth = Math.max(1, designData.designWidth + deltaX);
        newHeight = newWidth / imageAspectRatio;
      } else if (activeHandle.includes('w')) {
        const widthDelta = -deltaX;
        newWidth = Math.max(1, designData.designWidth + widthDelta);
        newHeight = newWidth / imageAspectRatio;
        newX = designData.positionX - widthDelta;
      }
      
      if (activeHandle.includes('s')) {
        newHeight = Math.max(1, designData.designHeight + deltaY);
        newWidth = newHeight * imageAspectRatio;
      } else if (activeHandle.includes('n')) {
        const heightDelta = -deltaY;
        newHeight = Math.max(1, designData.designHeight + heightDelta);
        newWidth = newHeight * imageAspectRatio;
        newY = designData.positionY - heightDelta;
      }

      // Constrain to canvas
      newWidth = Math.min(newWidth, OUTER_CANVAS_WIDTH - newX);
      newHeight = Math.min(newHeight, OUTER_CANVAS_HEIGHT - newY);
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      setDesignData({
        designWidth: newWidth,
        designHeight: newHeight,
        positionX: newX,
        positionY: newY,
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, designData, activeHandle, imageAspectRatio, setDesignData]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setActiveHandle(null);
  }, []);

  // Download composite image
  const handleDownload = useCallback(() => {
    if (!designData.image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = outerCanvasPixelWidth * 2;
    canvas.height = outerCanvasPixelHeight * 2;

    // Draw mockup background
    ctx.fillStyle = designData.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw design
    const img = new Image();
    img.onload = () => {
      const x = designData.positionX * SCALE * 2;
      const y = designData.positionY * SCALE * 2;
      const width = designData.designWidth * SCALE * 2;
      const height = designData.designHeight * SCALE * 2;
      
      ctx.drawImage(img, x, y, width, height);

      // Download
      const link = document.createElement('a');
      link.download = 'funkustoms-design.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = designData.image;
  }, [designData, outerCanvasPixelWidth, outerCanvasPixelHeight]);

  // Share via WhatsApp
  const handleWhatsAppShare = useCallback(() => {
    const message = encodeURIComponent(
      `Check out my custom design on FunKustoms!\n\n` +
      `Size: ${designData.size}\n` +
      `Design: ${designData.designWidth.toFixed(1)}" × ${designData.designHeight.toFixed(1)}"\n` +
      `Total: ₹${pricing?.totalPrice.toFixed(2) || '0'}\n\n` +
      `https://funkustoms.com`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }, [designData, pricing]);

  // Add custom design to cart
  const handleAddToCart = useCallback(async () => {
    if (!designData.image || !pricing) return;
    
    const customItem = {
      id: Date.now(), // Unique ID for custom design
      name: `Custom T-Shirt (${designData.size})`,
      price: Math.round(pricing.totalPrice),
      quantity: 1,
      image: designData.image,
      size: designData.size,
      color: designData.color,
    };
    
    addItem(customItem);

    try {
      await customizationsAPI.create({
        userId: user?.id || 'guest',
        customerName: user?.name || 'Guest Customer',
        title: `Custom ${designData.size} T-Shirt Design`,
        description: `${designData.printing} print on ${designData.color} tee`,
        image: designData.image,
        design: JSON.stringify({
          size: designData.size,
          color: designData.color,
          printing: designData.printing,
          dimensions: {
            width: designData.designWidth,
            height: designData.designHeight,
          },
          position: {
            x: designData.positionX,
            y: designData.positionY,
          },
        }),
        quantity: 1,
        estimatedPrice: Math.round(pricing.totalPrice),
        status: 'submitted',
      });
    } catch {
      // Keep UX working; the design still remains in cart even if API call fails.
    }

    alert('Custom design added to cart!');
  }, [designData, pricing, addItem, user]);

  return (
    <div className="customize-page py-5">
      <div className="container-fluid px-4">
        <div className="text-center mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2">
            Design Studio
          </span>
          <h1 className="fw-bold">Customize Your Product</h1>
          <p className="text-muted">Upload your design and create something unique</p>
        </div>

        <div className="row g-4">
          {/* Left Panel - Options */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  <i className="bi bi-gear me-2"></i>
                  Options
                </h5>

                {/* Category Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Product Category</label>
                  <div className="category-grid">
                    {categories.slice(0, 6).map((cat) => (
                      <div
                        key={cat.id}
                        className={`category-option p-2 rounded text-center cursor-pointer ${
                          cat.id === 'tshirt' ? 'border-primary border-2' : 'border'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="rounded mb-1"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <small className="d-block text-truncate">{cat.name}</small>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium">T-Shirt Size</label>
                  <select
                    className="form-select"
                    value={designData.size}
                    onChange={(e) => {
                      const selectedSize = sizePrices.find(s => s.size === e.target.value);
                      setDesignData({
                        size: e.target.value,
                        tshirtPrice: selectedSize?.price || 200,
                      });
                    }}
                  >
                    {sizePrices.map((sp) => (
                      <option key={sp.size} value={sp.size}>
                        {sp.size} - ₹{sp.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium">T-Shirt Color</label>
                  <div className="color-palette d-flex flex-wrap gap-2">
                    {tshirtColors.map((color) => (
                      <div
                        key={color.hex}
                        className={`color-swatch rounded-circle ${
                          designData.color === color.hex ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{
                          backgroundColor: color.hex,
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          border: color.hex === '#FFFFFF' ? '2px solid #ddd' : 
                                  designData.color === color.hex ? '3px solid var(--bs-primary)' : '2px solid transparent',
                        }}
                        title={color.name}
                        onClick={() => setDesignData({ color: color.hex })}
                      />
                    ))}
                  </div>
                </div>

                {/* Printing Method */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Printing Method</label>
                  <select
                    className="form-select"
                    value={designData.printing}
                    onChange={(e) => setDesignData({ printing: e.target.value })}
                  >
                    <option value="dtg">DTG (Direct to Garment)</option>
                    <option value="screen">Screen Printing</option>
                    <option value="sublimation">Sublimation</option>
                    <option value="vinyl">Vinyl Transfer</option>
                  </select>
                </div>

                {/* View Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium">View</label>
                  <div className="btn-group w-100">
                    <button
                      className={`btn ${designData.view === 'front' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDesignData({ view: 'front' })}
                    >
                      Front
                    </button>
                    <button
                      className={`btn ${designData.view === 'back' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDesignData({ view: 'back' })}
                    >
                      Back
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={resetDesign}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset Design
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-easel me-2"></i>
                    Preview Canvas
                  </h5>
                  <span className="badge bg-secondary">
                    {OUTER_CANVAS_WIDTH}" × {OUTER_CANVAS_HEIGHT}"
                  </span>
                </div>

                {/* Canvas Area */}
                <div
                  ref={canvasRef}
                  className="canvas-container mx-auto position-relative"
                  style={{
                    width: `${outerCanvasPixelWidth}px`,
                    height: `${outerCanvasPixelHeight}px`,
                    backgroundColor: designData.color,
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {!designData.image ? (
                    <div
                      className="upload-zone d-flex flex-column align-items-center justify-content-center h-100 text-muted"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-cloud-arrow-up fs-1 mb-3"></i>
                      <h5>Drag & Drop Your Design</h5>
                      <p className="small">or click to browse</p>
                      <span className="badge bg-light text-dark">Max 25MB</span>
                    </div>
                  ) : (
                    <div
                      className="design-element position-absolute"
                      style={{
                        left: `${designData.positionX * SCALE}px`,
                        top: `${designData.positionY * SCALE}px`,
                        width: `${designData.designWidth * SCALE}px`,
                        height: `${designData.designHeight * SCALE}px`,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => handleMouseDown(e)}
                    >
                      <img
                        src={designData.image}
                        alt="Design"
                        className="w-100 h-100"
                        style={{ objectFit: 'contain', pointerEvents: 'none' }}
                        draggable={false}
                      />
                      
                      {/* Resize Handles */}
                      {['nw', 'ne', 'sw', 'se'].map((handle) => (
                        <div
                          key={handle}
                          className={`resize-handle resize-${handle}`}
                          style={{
                            position: 'absolute',
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'var(--bs-primary)',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: `${handle}-resize`,
                            ...(handle.includes('n') ? { top: '-6px' } : { bottom: '-6px' }),
                            ...(handle.includes('w') ? { left: '-6px' } : { right: '-6px' }),
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown(e, handle);
                          }}
                        />
                      ))}
                      
                      {/* Border */}
                      <div
                        className="position-absolute w-100 h-100"
                        style={{
                          top: 0,
                          left: 0,
                          border: '2px dashed var(--bs-primary)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Design Info */}
                {designData.image && (
                  <div className="design-info mt-3 p-3 bg-light rounded">
                    <div className="row text-center">
                      <div className="col">
                        <small className="text-muted d-block">Width</small>
                        <strong>{designData.designWidth.toFixed(1)}"</strong>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Height</small>
                        <strong>{designData.designHeight.toFixed(1)}"</strong>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Area</small>
                        <strong>{(designData.designWidth * designData.designHeight).toFixed(1)} sq.in</strong>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Position</small>
                        <strong>({designData.positionX.toFixed(1)}", {designData.positionY.toFixed(1)}")</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileInputChange}
                />
                <button
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-upload me-2"></i>
                  {designData.image ? 'Change Design' : 'Upload Design'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Pricing & Actions */}
          <div className="col-lg-3">
            {/* Pricing */}
            {pricing && designData.image && (
              <PricingBreakdown pricing={pricing} />
            )}

            {/* Actions */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="bi bi-lightning me-2"></i>
                  Actions
                </h5>

                <button
                  className="btn btn-primary w-100 mb-2"
                  disabled={!designData.image}
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>

                <button
                  className="btn btn-outline-primary w-100 mb-2"
                  disabled={!designData.image}
                  onClick={handleDownload}
                >
                  <i className="bi bi-download me-2"></i>
                  Download Preview
                </button>

                <button
                  className="btn btn-success w-100 mb-2"
                  disabled={!designData.image}
                  onClick={handleWhatsAppShare}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Share on WhatsApp
                </button>

                <button
                  className="btn btn-outline-secondary w-100"
                  disabled={!designData.image}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Email Quote
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="card border-0 bg-light mt-4">
              <div className="card-body">
                <h6 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Tips
                </h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Drag the design to position it</li>
                  <li>Use corner handles to resize</li>
                  <li>Aspect ratio is locked for quality</li>
                  <li>Design cost: ₹1 per sq. inch</li>
                  <li>Max file size: 25MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
