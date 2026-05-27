import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/products';
import ProductCard from '../components/ui/ProductCard';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, getProductById } = useProductStore();

  const product = getProductById(parseInt(id || '0'));
  const relatedProducts = products.filter((p) => p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="product-page py-5">
        <div className="container text-center">
          <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '80px' }}></i>
          <h2 className="fw-bold mt-3">Product Not Found</h2>
          <p className="text-muted">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-page py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Product Image */}
          <div className="col-lg-6">
            <div className="product-gallery">
              <div className="main-image position-relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded-3 shadow-sm w-100"
                  style={{ objectFit: 'cover', aspectRatio: '1/1' }}
                />
                {product.trending && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-3">
                    Trending
                  </span>
                )}
                {discount > 0 && (
                  <span className="badge bg-success position-absolute top-0 end-0 m-3">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-6">
            <span className="badge bg-secondary text-capitalize mb-2">
              {product.category}
            </span>
            <h1 className="fw-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </div>
              <span className="text-muted">(4.5) · 128 reviews</span>
            </div>

            {/* Price */}
            <div className="price-section mb-4">
              <span className="fs-2 fw-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-3 fs-4">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted mb-4">{product.description}</p>

            {/* Colors */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2">Colors</h6>
              <div className="d-flex gap-2 flex-wrap">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-option rounded-circle"
                    style={{
                      backgroundColor: color,
                      width: '40px',
                      height: '40px',
                      border: color === '#FFFFFF' ? '2px solid #ddd' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2">Sizes</h6>
              <div className="d-flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="btn btn-outline-dark size-btn"
                    style={{ minWidth: '50px' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2">Quantity</h6>
              <div className="input-group" style={{ maxWidth: '150px' }}>
                <button className="btn btn-outline-secondary">-</button>
                <input
                  type="number"
                  className="form-control text-center"
                  value="1"
                  readOnly
                />
                <button className="btn btn-outline-secondary">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 mb-4">
              <Link
                to={`/customize?product=${product.id}`}
                className="btn btn-primary btn-lg flex-grow-1"
              >
                <i className="bi bi-palette me-2"></i>
                Customize & Order
              </Link>
              <button className="btn btn-outline-primary btn-lg">
                <i className="bi bi-heart"></i>
              </button>
            </div>

            {/* Features */}
            <div className="features-list">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>Premium quality materials</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>High-resolution printing</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>Free shipping on orders over ₹999</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs mt-5">
          <ul className="nav nav-tabs" id="productTabs">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#description"
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#specifications"
              >
                Specifications
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#reviews"
              >
                Reviews
              </button>
            </li>
          </ul>
          <div className="tab-content p-4 bg-light rounded-bottom">
            <div className="tab-pane fade show active" id="description">
              <h5 className="fw-bold mb-3">Product Description</h5>
              <p className="text-muted">
                {product.description} This product is made from 100% premium cotton,
                ensuring comfort and durability. The fabric is pre-shrunk and
                maintains its shape and color even after multiple washes. Perfect for
                custom printing with our advanced DTG technology.
              </p>
              <ul className="text-muted">
                <li>100% Premium Cotton</li>
                <li>Pre-shrunk fabric</li>
                <li>Reinforced stitching</li>
                <li>Soft hand feel</li>
                <li>Ideal for custom printing</li>
              </ul>
            </div>
            <div className="tab-pane fade" id="specifications">
              <h5 className="fw-bold mb-3">Specifications</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="fw-medium">Material</td>
                    <td>100% Cotton</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Weight</td>
                    <td>180 GSM</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Fit</td>
                    <td>Regular Fit</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Care</td>
                    <td>Machine washable, tumble dry low</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Print Area</td>
                    <td>Front: 12" x 14", Back: 12" x 16"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tab-pane fade" id="reviews">
              <h5 className="fw-bold mb-3">Customer Reviews</h5>
              <p className="text-muted">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="related-products mt-5">
          <h3 className="fw-bold mb-4">You May Also Like</h3>
          <div className="row g-4">
            {relatedProducts.map((p) => (
              <div key={p.id} className="col-md-6 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;
