import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { useProductStore } from '../store/products';

// Banner slides data - M3 Inspired Colors
const bannerSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80',
    title: 'New Arrivals',
    subtitle: 'Check out our latest collection of premium t-shirts',
    buttonText: 'Shop Now',
    bgColor: 'linear-gradient(135deg, #4169e1 0%, #3557c9 100%)',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&q=80',
    title: 'Custom Designs',
    subtitle: 'Create your own unique style with our customization tools',
    buttonText: 'Start Designing',
    bgColor: 'linear-gradient(135deg, #f77836 0%, #ff9966 100%)',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&q=80',
    title: 'Bulk Orders',
    subtitle: 'Special discounts on orders of 10+ items',
    buttonText: 'Get Quote',
    bgColor: 'linear-gradient(135deg, #565f71 0%, #6d7689 100%)',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
    title: 'Free Shipping',
    subtitle: 'On all orders above ₹999 across India',
    buttonText: 'Learn More',
    bgColor: 'linear-gradient(135deg, #2d8a6e 0%, #3da882 100%)',
  },
];

const Shop: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const { products } = useProductStore();

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const uniqueCategories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats;
  }, []);

  return (
    <div className="shop-page">
      {/* Banner Slideshow */}
      <div className="shop-banner position-relative overflow-hidden mb-5">
        <div 
          className="slides-container d-flex transition-transform"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {bannerSlides.map((slide) => (
            <div 
              key={slide.id}
              className="slide flex-shrink-0 w-100 position-relative"
              style={{ 
                minWidth: '100%',
                height: '350px',
                background: slide.bgColor,
              }}
            >
              <div className="container h-100">
                <div className="row h-100 align-items-center">
                  <div className="col-md-6 text-white">
                    <h2 className="display-5 fw-bold mb-3">{slide.title}</h2>
                    <p className="lead mb-4">{slide.subtitle}</p>
                    <button className="btn btn-light btn-lg rounded-pill px-4">
                      {slide.buttonText}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                  <div className="col-md-6 d-none d-md-block">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="img-fluid rounded-4 shadow-lg"
                      style={{ 
                        maxHeight: '280px', 
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow"
          onClick={prevSlide}
          style={{ width: '45px', height: '45px', zIndex: 10 }}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button 
          className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow"
          onClick={nextSlide}
          style={{ width: '45px', height: '45px', zIndex: 10 }}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Dots Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`btn p-0 rounded-circle ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              style={{ 
                width: currentSlide === index ? '30px' : '10px', 
                height: '10px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div className="container py-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2">
            Our Collection
          </span>
          <h1 className="fw-bold">Shop All Products</h1>
          <p className="text-muted">
            Discover our premium quality products ready for your custom designs
          </p>
        </div>

        <div className="row">
          {/* Mobile Filter Toggle */}
          <div className="d-lg-none mb-3">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className={`bi bi-${showFilters ? 'x' : 'funnel'} me-2`}></i>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`col-lg-3 ${showFilters ? '' : 'd-none d-lg-block'}`}>
            <div className="filters-sidebar bg-light rounded-3 p-4 sticky-lg-top" style={{ top: '80px' }}>
              <h5 className="fw-bold mb-4">
                <i className="bi bi-funnel me-2"></i>
                Filters
              </h5>

              {/* Search */}
              <div className="mb-4">
                <label className="form-label fw-medium">Search</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="form-label fw-medium">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat} className="text-capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="form-label fw-medium">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="form-label fw-medium">Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 2000]);
                  setSortBy('default');
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Results Info */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="text-muted mb-0">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="d-none d-md-block">
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-md-6 col-lg-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h5>No products found</h5>
                <p className="text-muted">
                  Try adjusting your filters or search query
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 2000]);
                    setSortBy('default');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
