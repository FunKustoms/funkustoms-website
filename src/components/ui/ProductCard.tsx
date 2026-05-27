import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0],
    });
  };

  return (
    <div className="card product-card h-100 border-0 shadow-sm">
      <Link to={`/product/${product.id}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden">
          <img
            src={product.image}
            className="card-img-top product-image"
            alt={product.name}
            loading="lazy"
          />
          {product.trending && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              Trending
            </span>
          )}
          {discount > 0 && (
            <span className="badge bg-success position-absolute top-0 end-0 m-2">
              {discount}% OFF
            </span>
          )}
          {product.customizable && (
            <span className="badge bg-info position-absolute bottom-0 start-0 m-2">
              <i className="bi bi-palette me-1"></i>Customizable
            </span>
          )}
        </div>
        <div className="card-body">
          <span className="badge bg-secondary mb-2 text-capitalize">
            {product.category}
          </span>
          <h5 className="card-title mb-1 text-dark">{product.name}</h5>
          <div className="d-flex align-items-center mb-2">
            <div className="color-options">
              {product.colors.slice(0, 4).map((color, index) => (
                <span
                  key={index}
                  className="color-dot"
                  style={{
                    backgroundColor: color,
                    border: color === '#FFFFFF' ? '1px solid #ddd' : 'none',
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-muted small ms-1">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="text-primary fw-bold fs-5">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="card-footer bg-white border-0 pt-0">
        {product.customizable ? (
          <div className="d-flex gap-2">
            <Link
              to={`/customize?product=${product.id}`}
              className="btn btn-primary flex-grow-1"
            >
              <i className="bi bi-palette me-1"></i> Customize
            </Link>
            <button
              className="btn btn-outline-primary flex-grow-1"
              onClick={handleAddToCart}
              title="Add to cart"
            >
              <i className="bi bi-cart-plus me-1"></i> Add to Cart
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary w-100"
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus me-1"></i> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
