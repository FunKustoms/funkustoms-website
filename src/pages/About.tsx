import React from 'react';
import { Link } from 'react-router-dom';

const storyPillars = [
  {
    icon: 'fas fa-fingerprint',
    title: 'Built for self-expression',
    description: 'Every product starts with your personality, not a one-size-fits-all template.',
  },
  {
    icon: 'fas fa-wand-magic-sparkles',
    title: 'Creative without friction',
    description: 'The experience is simple enough for first-timers and flexible enough for creators.',
  },
  {
    icon: 'fas fa-box-open',
    title: 'Real products, real quality',
    description: 'Premium materials, transparent pricing, and prints that feel worth keeping.',
  },
];

const creationFlow = [
  {
    step: '01',
    title: 'Pick your base',
    description: 'Start with tees, hoodies, mugs, stickers, phone cases, and more.',
  },
  {
    step: '02',
    title: 'Make it yours',
    description: 'Upload artwork, add text, move things around, and preview it in real time.',
  },
  {
    step: '03',
    title: 'We craft and ship',
    description: 'Once you approve the design, we print with care and send it out fast.',
  },
];

const valuePoints = [
  {
    icon: 'fas fa-bolt',
    tone: 'about-value-fast',
    title: 'Fast production',
    description: 'Most orders move into production quickly, so your idea does not sit in a queue forever.',
  },
  {
    icon: 'fas fa-shield-alt',
    tone: 'about-value-safe',
    title: 'Quality promise',
    description: "If something misses the mark, we'll work to make it right instead of hiding behind policy.",
  },
  {
    icon: 'fas fa-tags',
    tone: 'about-value-clear',
    title: 'Clear pricing',
    description: 'No surprise personalization fees or confusing add-ons at the last step.',
  },
  {
    icon: 'fas fa-leaf',
    tone: 'about-value-earth',
    title: 'Thoughtful materials',
    description: 'We care about durable products, cleaner printing choices, and designs people keep longer.',
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="container py-5">
          <div className="about-hero-shell">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="about-kicker mb-3">
                  <i className="fas fa-sparkles"></i>
                  <span>About FunKustoms</span>
                </div>

                <h1 className="about-hero-title mb-4">
                  We make custom products feel
                  <span className="text-gradient-accent"> personal, playful, and premium.</span>
                </h1>

                <p className="about-hero-copy mb-4">
                  FunKustoms exists for people who want more than generic merch. We believe customization
                  should feel expressive from the first click to the final unboxing.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                  <Link to="/customize" className="btn btn-hero">
                    Start Your Design
                    <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                  <Link to="/shop" className="btn btn-outline-primary btn-lg">
                    Explore Products
                  </Link>
                </div>

                <div className="about-hero-trust">
                  <div className="about-trust-item">
                    <strong>Creator-first flow</strong>
                    <span>Made for ideas, not templates.</span>
                  </div>
                  <div className="about-trust-item">
                    <strong>Transparent process</strong>
                    <span>Preview clearly, order confidently.</span>
                  </div>
                  <div className="about-trust-item">
                    <strong>Fast turnaround</strong>
                    <span>Designed to move at your pace.</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="about-hero-visual">
                  <div className="about-orbit about-orbit-one"></div>
                  <div className="about-orbit about-orbit-two"></div>
                  <div className="about-visual-card about-visual-card-top">
                    <span>Identity-led design</span>
                  </div>
                  <div className="about-visual-card about-visual-card-bottom">
                    <span>Premium print energy</span>
                  </div>
                  <img
                    src="/assets/Iris and Chroma Illustration/iris and chroma happy.png"
                    alt="Iris and Chroma from FunKustoms"
                    className="img-fluid about-hero-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-manifesto-section">
        <div className="container py-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className="about-manifesto-intro h-100">
                <p className="about-section-label">Why we started</p>
                <h2 className="section-title mb-4">Customization should adapt to people, not the other way around.</h2>
                <p className="section-subtitle text-start mx-0 mb-0">
                  Most print platforms begin with limitations. FunKustoms begins with possibility. We built the brand
                  to help people translate moods, memories, jokes, aesthetics, and ideas into products that actually
                  feel like theirs.
                </p>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row g-4">
                {storyPillars.map((pillar) => (
                  <div className="col-md-4" key={pillar.title}>
                    <article className="about-story-card h-100">
                      <div className="about-story-icon">
                        <i className={pillar.icon}></i>
                      </div>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats-section">
        <div className="container py-5">
          <div className="about-stats-band">
            <div>
              <p className="about-section-label mb-2">What drives us</p>
              <h2 className="section-title mb-0">A creative brand with production discipline.</h2>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-6 col-lg-3">
                <div className="about-stat-card">
                  <h3>01</h3>
                  <p>Brand mission</p>
                  <span>Help every order feel unmistakably yours.</span>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="about-stat-card">
                  <h3>24h</h3>
                  <p>Fast-moving workflow</p>
                  <span>Quick production for ready-to-go designs.</span>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="about-stat-card">
                  <h3>0</h3>
                  <p>Hidden nonsense</p>
                  <span>No forced templates, no surprise pricing games.</span>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="about-stat-card">
                  <h3>100%</h3>
                  <p>Creative ownership</p>
                  <span>Your taste leads the process from start to finish.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-founder-section">
        <div className="container py-5">
          <div className="about-founder-shell">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5 text-center">
                <div className="about-founder-portrait-wrap">
                  <div className="about-founder-glow"></div>
                  <img
                    src="/assets/Iris and Chroma Illustration/Iris Profile.png"
                    alt="Iris exploring designs"
                    className="img-fluid about-founder-portrait"
                  />
                </div>
              </div>

              <div className="col-lg-7">
                <p className="about-section-label">Founder's note</p>
                <h2 className="section-title mb-4 about-founder-title-hover">FunKustoms was built to move with your imagination.</h2>

                <div className="about-founder-copy">
                  <p>
                    I kept seeing the same pattern everywhere: people had original ideas, but the tools around them
                    felt rigid, generic, or unnecessarily complicated.
                  </p>
                  <p>
                    I wanted to build something that worked in reverse. Instead of asking people to squeeze themselves
                    into a brand system, I wanted the brand to flex around their style, energy, and intent.
                  </p>
                  <p>
                    The chameleon became the perfect symbol for that philosophy. The foundation stays strong, but the
                    expression changes every time. That is exactly how we think custom products should work.
                  </p>
                </div>

                <div className="about-founder-signoff">
                  <strong>Adarsh Chanabhat</strong>
                  <span>Founder, FunKustoms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-process-section">
        <div className="container py-5">
          <div className="text-center mb-5">
            <p className="about-section-label">How it flows</p>
            <h2 className="section-title mb-3">A customization experience that stays simple all the way through.</h2>
            <p className="section-subtitle">
              We keep the process clear so your energy goes into the design, not into figuring out the interface.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {creationFlow.map((item) => (
              <div className="col-lg-4" key={item.step}>
                <article className="about-process-card h-100">
                  <span className="about-process-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </div>
            ))}
          </div>

          <div className="about-creator-panel">
            <div className="row g-4 align-items-center">
              <div className="col-lg-5 text-center">
                <img
                  src="/assets/Iris and Chroma Illustration/chroma profile.png"
                  alt="Chroma helping creators design custom products"
                  className="img-fluid about-creator-image"
                />
              </div>
              <div className="col-lg-7">
                <h3 className="about-panel-title mb-4">Made for creators, gift-givers, side hustlers, and teams.</h3>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="about-mini-point">
                      <i className="fas fa-image"></i>
                      <div>
                        <strong>Upload your own art</strong>
                        <span>Bring photos, graphics, logos, or text-led ideas.</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="about-mini-point">
                      <i className="fas fa-eye"></i>
                      <div>
                        <strong>Preview before you commit</strong>
                        <span>See the design placement and feel more certain before ordering.</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="about-mini-point">
                      <i className="fas fa-rocket"></i>
                      <div>
                        <strong>Move quickly</strong>
                        <span>Useful for personal drops, events, gifts, and brand merch.</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="about-mini-point">
                      <i className="fas fa-heart"></i>
                      <div>
                        <strong>Keep it fun</strong>
                        <span>The process is polished, but it never loses personality.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container py-5">
          <div className="text-center mb-5">
            <p className="about-section-label">Why FunKustoms</p>
            <h2 className="section-title mb-3">What you can expect when you build with us.</h2>
            <p className="section-subtitle">A custom brand should feel expressive on the surface and dependable underneath.</p>
          </div>

          <div className="row g-4">
            {valuePoints.map((value) => (
              <div className="col-md-6" key={value.title}>
                <article className="about-value-card h-100">
                  <div className={`about-value-icon ${value.tone}`}>
                    <i className={value.icon}></i>
                  </div>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container py-5">
          <div className="about-cta-box text-center">
            <p className="about-section-label about-section-label-light">Ready to create</p>
            <h2 className="cta-title text-white mb-4">Bring your style into the real world.</h2>
            <p className="cta-subtitle text-white mb-4">
              Start with one idea, one product, or one small experiment. We built FunKustoms to help that idea become something tangible.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/customize" className="btn btn-light btn-lg">
                Start Customizing
                <i className="fas fa-arrow-right ms-2"></i>
              </Link>
              <Link to="/bulk-orders" className="btn btn-outline-light btn-lg">
                Plan a Bulk Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
