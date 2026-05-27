import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'tshirt',
    name: 'T-Shirt',
    title: 'Classic White Tee',
    price: 'Rs 1,299',
    image: '/assets/product-tshirt.png',
    note: 'Premium cotton base',
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    title: 'Urban Black Hoodie',
    price: 'Rs 2,499',
    image: '/assets/product-hoodie.png',
    note: 'Cozy streetwear fit',
  },
  {
    id: 'phonecase',
    name: 'Phone Case',
    title: 'Custom Phone Case',
    price: 'Rs 999',
    image: '/assets/product-phonecase.png',
    note: 'Daily protection with style',
  },
  {
    id: 'mug',
    name: 'Mug',
    title: 'Morning Vibe Mug',
    price: 'Rs 799',
    image: '/assets/product-mug.png',
    note: 'Glossy print finish',
  },
  {
    id: 'sticker',
    name: 'Sticker',
    title: 'Sticker Pack',
    price: 'Rs 399',
    image: '/assets/product-stickers.png',
    note: 'Small drops, loud personality',
  },
];

const steps = [
  { icon: 'fas fa-layer-group', title: 'Choose a canvas', copy: 'Pick the base that fits the moment.' },
  { icon: 'fas fa-palette', title: 'Tune the vibe', copy: 'Color, text, mood, and placement stay in your hands.' },
  { icon: 'fas fa-truck-fast', title: 'Approve and ship', copy: 'Preview clearly, then let us print it right.' },
];

const featuredProducts = [
  { product: products[0], tag: 'Bestseller' },
  { product: products[1], tag: 'New drop' },
  { product: products[2], tag: 'Popular' },
  { product: products[3], tag: 'Gift pick' },
];

const creatorQuotes = [
  {
    quote: 'The preview made it easy to get our event tees right before placing a bigger order.',
    name: 'Rahul Mehta',
    role: 'Event Coordinator',
    initial: 'R',
  },
  {
    quote: 'My small merch drop looked polished without needing a complicated design setup.',
    name: 'Priya Sharma',
    role: 'Brand Founder',
    initial: 'P',
  },
  {
    quote: 'I could quickly test ideas for gifts and order the one that actually felt personal.',
    name: 'Ananya Iyer',
    role: 'Independent Artist',
    initial: 'A',
  },
];

const Home: React.FC = () => {
  return (
    <div className="home-page home-remix">
      <section className="home-studio-hero" id="home">
        <div className="home-studio-background" aria-hidden="true"></div>
        <div className="container">
          <div className="home-studio-grid">
            <div className="home-studio-copy">
              <div className="hero-badge home-studio-badge">
                <i className="fas fa-sparkles"></i>
                <span>Print-on-demand made playful</span>
              </div>

              <h1 className="home-studio-title">FunKustoms</h1>
              <p className="home-studio-subtitle">
                Build custom products that feel like your taste, your joke, your brand, or your gift idea. Try a quick design direction below and jump straight into customizing.
              </p>

              <div className="home-studio-actions">
                <Link to="/customize?product=tshirt" className="btn btn-hero">
                  Customize This
                  <i className="fas fa-arrow-right ms-2"></i>
                </Link>
                <Link to="/shop" className="btn btn-outline-primary btn-lg">
                  Browse Products
                </Link>
              </div>

              <div className="home-proof-strip" aria-label="FunKustoms benefits">
                <span><i className="fas fa-check"></i> No design minimums</span>
                <span><i className="fas fa-check"></i> Clear previews</span>
                <span><i className="fas fa-check"></i> Fast production</span>
              </div>
            </div>

            <div className="home-chroma-hero">
              <div className="mascot-container" data-mascot="chroma">
                <div className="mascot-glow"></div>
                <img
                  src="/assets/chameleon-male.png"
                  alt="Chroma, the FunKustoms mascot"
                  className="mascot-image animate-float img-fluid home-chroma-image"
                />
                <div className="mascot-tooltip">Design it<br />your way!<br />I'm Chroma.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-canvas-section" id="categories">
        <div className="container">
          <div className="home-section-heading">
            <span className="home-section-kicker">Choose your canvas</span>
            <h2 className="section-title">Start with a product that already has personality.</h2>
            <p className="section-subtitle">
              Hover the tiles, pick a direction, and jump into a product that is ready for your artwork.
            </p>
          </div>

          <div className="home-canvas-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/customize?product=${product.id}`}
                className="home-canvas-tile"
                style={{ '--tile-accent': product.id === 'tshirt' ? '#f77836' : '#4169e1' } as React.CSSProperties}
              >
                <span className="home-canvas-arrow"><i className="fas fa-arrow-right"></i></span>
                <img src={product.image} alt={product.name} />
                <strong>{product.name}</strong>
                <span>{product.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process-section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <span className="home-section-kicker">How it works</span>
              <h2 className="section-title mb-3">Three quick moves from idea to doorstep.</h2>
              <p className="section-subtitle text-start mx-0">
                The process keeps creative control visible, simple, and easy to trust.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="home-step-track">
                {steps.map((step, index) => (
                  <div className="home-step-card" key={step.title}>
                    <span className="home-step-count">0{index + 1}</span>
                    <i className={step.icon}></i>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-products-section" id="customize">
        <div className="container">
          <div className="home-products-header">
            <div>
              <span className="home-section-kicker">Popular starting points</span>
              <h2 className="section-title">Featured products ready for your spin.</h2>
            </div>
            <Link to="/shop" className="btn btn-outline-primary">View All Products</Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map(({ product, tag }) => (
              <div className="col-sm-6 col-lg-3" key={product.id}>
                <article className="home-product-card h-100">
                  <div className="home-product-image">
                    <span>{tag}</span>
                    <button className="home-favorite-button" type="button" aria-label={`Favorite ${product.title}`}>
                      <i className="fas fa-heart"></i>
                    </button>
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="home-product-body">
                    <h3>{product.title}</h3>
                    <p>{product.note}</p>
                    <div className="home-product-footer">
                      <strong>{product.price}</strong>
                      <Link to={`/customize?product=${product.id}`} aria-label={`Customize ${product.title}`}>
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-values-section" id="values">
        <div className="container">
          <div className="home-values-layout">
            <div>
              <span className="home-section-kicker">Why creators come back</span>
              <h2 className="section-title mb-3">Custom should feel fun on the surface and dependable underneath.</h2>
              <p className="section-subtitle text-start mx-0 mb-4">
                FunKustoms keeps the playful parts playful and the production parts steady.
              </p>

              <div className="home-value-list">
                <div className="home-value-item">
                  <i className="fas fa-bolt"></i>
                  <div>
                    <strong>Fast production</strong>
                    <span>Most ready designs move quickly into print.</span>
                  </div>
                </div>
                <div className="home-value-item">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <strong>Quality guarantee</strong>
                    <span>If a print misses the mark, we work to make it right.</span>
                  </div>
                </div>
                <div className="home-value-item">
                  <i className="fas fa-tags"></i>
                  <div>
                    <strong>Transparent pricing</strong>
                    <span>No surprise personalization fees waiting at checkout.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-mascot-panel mascot-container" data-mascot="iris">
              <div className="mascot-glow"></div>
              <img
                src="/assets/chameleon-female.png"
                alt="Iris, the FunKustoms creative mascot"
                className="img-fluid animate-float-gentle"
              />
              <div className="home-mascot-note home-iris-dialogue">
                <strong>Iris says</strong>
                <span>Your product should still feel like you after it leaves the screen.</span>
              </div>
              <div className="mascot-tooltip home-iris-section-tooltip">
                I'm Iris.<br />Let's explore<br />styles that feel<br />like you.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-social-section">
        <div className="container">
          <div className="home-stats-row">
            <div><strong>10K+</strong><span>Designs printed</span></div>
            <div><strong>500+</strong><span>Happy creators</span></div>
            <div><strong>99%</strong><span>Satisfaction rate</span></div>
            <div><strong>48hr</strong><span>Avg. turnaround</span></div>
          </div>

          <div className="home-quote-grid">
            {creatorQuotes.map((quote) => (
              <article className="home-quote-card" key={quote.name}>
                <div className="home-stars" aria-label="Five star review">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"{quote.quote}"</p>
                <div className="home-quote-person">
                  <span>{quote.initial}</span>
                  <div>
                    <strong>{quote.name}</strong>
                    <small>{quote.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container">
          <div className="home-final-cta-inner">
            <div>
              <span className="home-section-kicker">Ready to create?</span>
              <h2 className="cta-title text-white mb-3">Turn one good idea into something people can wear, hold, gift, or keep.</h2>
              <p className="cta-subtitle text-white mx-0">
                Start with the product you picked above or browse the full catalog for more canvases.
              </p>
            </div>
            <div className="home-final-actions">
              <Link to="/customize?product=tshirt" className="btn btn-light btn-lg">
                Start Customizing
                <i className="fas fa-arrow-right ms-2"></i>
              </Link>
              <Link to="/bulk-orders" className="btn btn-outline-light btn-lg">
                Plan Bulk Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
