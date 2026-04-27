import { useState, useCallback, useRef } from 'react';
import PaymentModal from '../components/PaymentModal';
import useInView from '../hooks/useInView';

const REINE_PRICES = { '50ml': 29, '100ml': 39 };

const PRODUCTS = [
  {
    id: 'reine',
    name: 'Reine',
    image: '/ELARAREINE.png',
    price: 39,
    size: '100ml Eau de Parfum',
    notes: ['Saffron', 'Bulgarian Rose', 'Amber', 'White Musk'],
    topNotes:   ['Saffron', 'Pink Pepper'],
    heartNotes: ['Bulgarian Rose', 'Jasmine'],
    baseNotes:  ['Amber', 'White Musk', 'Sandalwood'],
    description: 'She opens with a thread of Iranian saffron — warm, ceremonial, impossibly rare. She surrenders into the deepest Bulgarian rose, harvested at the exact hour of bloom. She closes in amber and white musk: skin-close, irreplaceable. Reine is not just worn. She is inhabited.',
    perfectFor: 'Date nights. Formal occasions. Mornings you want to never forget.',
    locked: false,
    bestseller: true,
    reviews: [
      { name: 'Lara M.',  rating: 5, text: 'Absolutely stunning. The saffron opening is warm and unique — it dries down beautifully into something I can only describe as skin-like.' },
      { name: 'Dani K.',  rating: 5, text: 'I get compliments every single time I wear this. The longevity is incredible. Worth every penny.' },
      { name: 'Sarah B.', rating: 5, text: 'Elegant and long-lasting. The rose heart is exquisite — not too sweet, perfectly balanced with the amber base.' },
    ],
  },
  {
    id: 'oro',
    name: 'Oro',
    image: '/ELARAOROO.png',
    price: 79,
    size: '100ml Eau de Parfum',
    notes: ['?', '?', '?', '?'],
    topNotes: null, heartNotes: null, baseNotes: null,
    description: 'Gold does not beg to be noticed. Oro opens like afternoon light on ancient stone — rare golden woods, a citrus brightness, then an amber heart that lingers long after you have left the room. Unveiled 2026.',
    locked: true,
    bestseller: false,
    reviews: [],
  },
  {
    id: 'nova',
    name: 'Rawan Noir',
    image: '/ELARAREINE.png',
    price: 79,
    size: '100ml Eau de Parfum',
    notes: ['?', '?', '?', '?'],
    topNotes: null, heartNotes: null, baseNotes: null,
    description: 'Born from the silence after a storm. Midnight jasmine in full bloom, clean vetiver rooted deep in dark earth, and stardust that drifts long after the music ends. For the woman who is most herself after dark.',
    locked: true,
    bestseller: false,
    reviews: [],
  },
];

const Shop = () => {
  const [gridRef, gridIn] = useInView(0.05);

  return (
    <div style={{ background: '#1a0f00', minHeight: '100vh' }}>
      {/* ── Page header ── */}
      <div className="shop-header" style={{
        background: 'linear-gradient(148deg, #0e0800 0%, #1a0f00 100%)',
        padding: '184px clamp(20px, 6vw, 80px) 100px',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(200,150,42,0.1)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <p style={{
            fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '6px',
            color: '#C8962A', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            The Collection
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: 'clamp(52px, 7vw, 88px)', lineHeight: 1,
            color: '#FAF6EF',
          }}>
            Our <span style={{ fontStyle: 'italic', color: '#E8B84B' }}>Fragrances</span>
          </h1>
          <p style={{
            fontFamily: 'Raleway', fontSize: '13px', fontWeight: 300,
            color: 'rgba(250,246,239,0.42)', marginTop: '20px',
            letterSpacing: '0.5px', lineHeight: 2,
          }}>
            Three compositions. One obsession.
          </p>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div ref={gridRef} className="shop-products" style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '100px clamp(20px, 6vw, 80px) 120px',
      }}>
        <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} inView={gridIn} delay={i * 0.14} />
          ))}
        </div>
      </div>

      <ReviewsSection />
    </div>
  );
};

const ProductCard = ({ product, inView, delay }) => {
  const [hov, setHov] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [displayPrice, setDisplayPrice] = useState(39);
  const [hoveredSize, setHoveredSize] = useState(null);
  const timerRef = useRef(null);

  const animatePrice = useCallback((from, to) => {
    clearInterval(timerRef.current);
    const steps = 10;
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      setDisplayPrice(Math.round(from + (to - from) * (step / steps)));
      if (step >= steps) clearInterval(timerRef.current);
    }, 40);
  }, []);

  const handleSizeChange = (size) => {
    if (size === selectedSize) return;
    animatePrice(REINE_PRICES[selectedSize], REINE_PRICES[size]);
    setSelectedSize(size);
  };

  return (
    <>
      {modal && <PaymentModal product={product} selectedSize={selectedSize} selectedPrice={REINE_PRICES[selectedSize]} onClose={() => setModal(false)} />}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(52px)',
          transition: `opacity 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
          ...(product.id === 'reine' && { maxWidth: '360px', margin: '0 auto' }),
        }}
      >
        <div className="shop-card" style={{
          background: 'linear-gradient(160deg, #1A1108 0%, #221710 100%)',
          border: `1px solid ${hov ? 'rgba(200,150,42,0.35)' : 'rgba(200,150,42,0.1)'}`,
          transform: hov ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: hov
            ? '0 36px 88px rgba(0,0,0,0.55), 0 0 36px rgba(200,150,42,0.08)'
            : '0 4px 32px rgba(0,0,0,0.3)',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease, border-color 0.4s ease',
          overflow: 'hidden',
        }}>
          {/* Bestseller badge */}
          {product.bestseller && (
            <div style={{
              position: 'absolute', top: '14px', left: '14px', zIndex: 2,
              fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
              textTransform: 'uppercase', padding: '5px 10px',
              background: 'rgba(200,150,42,1)', color: '#0a0600',
            }}>Fan Favourite</div>
          )}

          {/* Image area */}
          <div className={`shop-card-img-area ${product.locked ? 'shop-card-img-locked' : 'shop-card-img-active'}`} style={{
            height: '260px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: product.locked
              ? 'linear-gradient(148deg, #0e0800 0%, #1a0f00 100%)'
              : 'linear-gradient(145deg, #1a0f00 0%, #261500 100%)',
          }}>
            {product.locked ? (
              <>
                {/* Blurred image ghost */}
                <img
                  src={product.image}
                  alt=""
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'contain', objectPosition: 'center',
                    opacity: 0.07, filter: 'blur(8px) brightness(0.5)',
                  }}
                />
                {/* Lock overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '16px',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="0.9" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <p style={{
                    fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '5px',
                    color: 'rgba(200,150,42,0.48)', textTransform: 'uppercase',
                  }}>Coming Soon</p>
                </div>
              </>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'contain', objectPosition: 'center',
                  transform: hov ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
              />
            )}
          </div>

          {/* Info */}
          <div className="shop-card-info" style={{ padding: '24px 28px 28px' }}>
            <p style={{
              fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '6px',
              color: '#C8962A', textTransform: 'uppercase', marginBottom: '14px',
              fontWeight: 200, opacity: 0.65,
            }}>
              {product.size}
            </p>

            <h3 style={{ marginBottom: product.locked ? '14px' : '22px', lineHeight: 1 }}>
              <span style={{
                display: 'block',
                fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '9px',
                fontWeight: 300, textTransform: 'uppercase',
                color: 'rgba(250,246,239,0.32)', marginBottom: '6px',
              }}>ELARA</span>
              <span style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic', fontWeight: 300,
                fontSize: '34px', lineHeight: 1,
                color: product.locked ? 'rgba(250,246,239,0.35)' : '#FAF6EF',
              }}>
                <span style={{ color: product.locked ? 'rgba(200,150,42,0.4)' : '#C8962A' }}>
                  {product.name}
                </span>
              </span>
            </h3>

            {/* ── Size selector (Reine only) ── */}
            {!product.locked && (
              <div style={{ marginBottom: '28px' }}>

                {/* SELECT SIZE — its own line, nothing near it */}
                <p style={{
                  fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '6px',
                  color: 'rgba(200,160,60,0.4)', textTransform: 'uppercase',
                  textAlign: 'center', marginBottom: '20px', fontWeight: 300,
                }}>Select Size</p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '14px' }}>
                  {['50ml', '100ml'].map((size) => {
                    const active  = selectedSize === size;
                    const hovered = hoveredSize === size;
                    return (
                      <div key={size} style={{ flex: 1 }}>

                        {/* position:relative wrapper so badge is anchored to button */}
                        <div style={{ position: 'relative' }}>


                          <button
                            onClick={() => handleSizeChange(size)}
                            onMouseEnter={() => setHoveredSize(size)}
                            onMouseLeave={() => setHoveredSize(null)}
                            style={{
                              width: '100%',
                              fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '3.5px',
                              textTransform: 'uppercase', padding: '15px 10px',
                              minHeight: '50px',
                              background: active
                                ? 'linear-gradient(135deg, rgba(200,160,60,0.13) 0%, rgba(200,160,60,0.05) 100%)'
                                : 'transparent',
                              border: `1px solid ${
                                active  ? 'rgba(200,160,60,0.95)' :
                                hovered ? 'rgba(200,160,60,0.55)' :
                                          'rgba(200,160,60,0.2)'
                              }`,
                              color: active  ? 'rgba(200,160,60,1)'  :
                                     hovered ? 'rgba(200,160,60,0.8)' :
                                               'rgba(200,160,60,0.45)',
                              borderRadius: '1px', cursor: 'pointer',
                              boxShadow: active
                                ? '0 0 28px rgba(200,160,60,0.09), inset 0 0 18px rgba(200,160,60,0.04)'
                                : hovered ? '0 0 16px rgba(200,160,60,0.06)' : 'none',
                              transition: 'border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
                            }}
                          >
                            {size.toUpperCase()} · ${REINE_PRICES[size]}
                          </button>
                        </div>

                        {/* Sub-label */}
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: 'italic', fontWeight: 300, fontSize: '12px',
                          color: size === '100ml' ? 'rgba(200,160,60,0.58)' : 'rgba(250,246,239,0.2)',
                          textAlign: 'center', marginTop: '8px', letterSpacing: '0.3px',
                        }}>
                          {size === '50ml' ? 'Entry size' : 'Save 26%'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Gold separator */}
                <div style={{
                  height: '1px', marginTop: '24px',
                  background: 'linear-gradient(to right, transparent, rgba(200,160,60,0.18), transparent)',
                }}/>
              </div>
            )}

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: '14px', color: 'rgba(250,246,239,0.38)',
              lineHeight: 2.05, marginBottom: product.perfectFor ? '16px' : '24px', letterSpacing: '0.2px',
            }}>
              {product.description}
            </p>

            {product.perfectFor && (
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '3px',
                  textTransform: 'uppercase', color: 'rgba(200,160,60,0.4)',
                  display: 'block', marginBottom: '5px',
                }}>Perfect for</span>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
                  fontSize: '13px', color: 'rgba(200,160,60,0.65)',
                  lineHeight: 1.8, letterSpacing: '0.3px', margin: 0,
                }}>{product.perfectFor}</p>
              </div>
            )}

            {/* Fragrance Notes */}
            {product.topNotes ? (
              <div style={{ marginBottom: '28px' }}>
                {[
                  { tier: 'Top Notes',   notes: product.topNotes   },
                  { tier: 'Heart Notes', notes: product.heartNotes  },
                  { tier: 'Base Notes',  notes: product.baseNotes   },
                ].map(({ tier, notes }) => (
                  <div key={tier} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
                      color: 'rgba(200,150,42,0.45)', textTransform: 'uppercase',
                      minWidth: '72px', flexShrink: 0,
                    }}>{tier}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {notes.map((n, i) => (
                        <span key={i} style={{
                          fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '0.8px',
                          padding: '3px 10px',
                          color: 'rgba(200,150,42,0.85)',
                          border: '1px solid rgba(200,150,42,0.2)',
                          background: 'rgba(200,150,42,0.04)',
                        }}>{n}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {product.notes.map((note, i) => (
                  <span key={i} style={{
                    fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '1px',
                    padding: '4px 10px',
                    color: 'rgba(200,150,42,0.3)',
                    border: '1px solid rgba(200,150,42,0.1)',
                    background: 'transparent',
                  }}>{note}</span>
                ))}
              </div>
            )}

            {/* Price + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '34px', fontWeight: 300,
                color: product.locked ? 'rgba(250,246,239,0.2)' : '#C9A96E',
                letterSpacing: '1px',
                transition: 'opacity 0.2s ease',
              }}>
                ${product.locked ? product.price : displayPrice}
              </span>

              {!product.locked ? (
                <BuyNowBtn onClick={() => setModal(true)} price={displayPrice} />
              ) : (
                <span style={{
                  fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '3px',
                  color: 'rgba(200,150,42,0.32)', textTransform: 'uppercase',
                }}>
                  Locked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BuyNowBtn = ({ onClick, price }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '4px',
        textTransform: 'uppercase', padding: '13px 22px',
        background: hov ? '#C8962A' : 'transparent',
        color: hov ? '#1a0f00' : '#C8962A',
        border: '1px solid rgba(200,150,42,0.7)',
        cursor: 'pointer',
        transition: 'all 0.35s ease',
        whiteSpace: 'nowrap',
      }}
    >
      Buy Now{price ? ` $${price}` : ''}
    </button>
  );
};

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span key={n} style={{ color: n <= rating ? 'rgba(200,150,42,1)' : 'rgba(200,150,42,0.2)', fontSize: '12px' }}>★</span>
    ))}
  </div>
);

const ReviewsSection = () => {
  const reviews = PRODUCTS.flatMap(p =>
    p.reviews.map(r => ({ ...r, product: p.name }))
  );
  if (!reviews.length) return null;

  return (
    <div style={{
      borderTop: '1px solid rgba(200,150,42,0.1)',
      padding: '80px clamp(20px, 6vw, 80px) 100px',
      maxWidth: '1100px', margin: '0 auto',
    }}>
      <p style={{
        fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '6px',
        color: 'rgba(200,150,42,0.55)', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center',
      }}>What They Say</p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FAF6EF',
        textAlign: 'center', marginBottom: '56px', lineHeight: 1.2,
      }}>
        Customer <span style={{ fontStyle: 'italic', color: 'rgba(200,150,42,1)' }}>Reviews</span>
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))',
        gap: '24px',
      }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            background: 'linear-gradient(160deg, #1A1108 0%, #1e1308 100%)',
            border: '1px solid rgba(200,150,42,0.1)',
            padding: '28px 28px 24px',
          }}>
            <StarRating rating={r.rating} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '15px', fontWeight: 300, color: 'rgba(250,246,239,0.7)',
              lineHeight: 1.85, margin: '14px 0 18px',
            }}>"{r.text}"</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '2px',
                color: 'rgba(250,246,239,0.45)', textTransform: 'uppercase',
              }}>{r.name}</span>
              <span style={{
                fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '2px',
                color: 'rgba(200,150,42,0.45)', textTransform: 'uppercase',
              }}>{r.product}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
