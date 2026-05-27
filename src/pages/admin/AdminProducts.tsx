import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/products';
import type { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalog</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 text-md-end">
              <span className="text-muted">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-card-body p-0">
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>
                      <div className="product-name-cell">
                        <span className="fw-medium">{product.name}</span>
                        <small className="text-muted d-block">ID: {product.id}</small>
                      </div>
                    </td>
                    <td className="text-capitalize">{product.category}</td>
                    <td>
                      <span className="fw-medium">₹{product.price}</span>
                      {product.originalPrice && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          ₹{product.originalPrice}
                        </small>
                      )}
                    </td>
                    <td>
                      {product.customizable ? (
                        <span className="badge bg-info">Customizable</span>
                      ) : (
                        <span className="badge bg-secondary">Ready-made</span>
                      )}
                      {product.trending && (
                        <span className="badge bg-danger ms-1">Trending</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingProduct(product)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-sm btn-outline-secondary"
                          title="View"
                          target="_blank"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={(product) => {
            if (editingProduct) {
              updateProduct(product.id, product);
            } else {
              addProduct(product);
            }
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Modal Component
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      price: 0,
      originalPrice: undefined,
      image: '',
      category: 'tshirt',
      colors: ['#000000', '#FFFFFF'],
      sizes: ['S', 'M', 'L', 'XL'],
      trending: false,
      customizable: false,
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Original Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="tshirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="mug">Mug</option>
                  <option value="phonecase">Phone Case</option>
                  <option value="poster">Poster</option>
                  <option value="sticker">Sticker</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label">Sizes (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.sizes?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Colors (hex codes, comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.colors?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()) })}
                />
              </div>
              <div className="col-12">
                <div className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="customizable"
                    checked={formData.customizable}
                    onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="customizable">
                    Customizable
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="trending"
                    checked={formData.trending}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="trending">
                    Trending
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
