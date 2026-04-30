import { useState, useCallback, useRef } from 'react';
import PaymentModal from '../components/PaymentModal';
import useInView from '../hooks/useInView';

const REINE_PRICES = { '100ml': 49, 'signature': 69 };

const PRODUCTS = [
  {
    id: 'reine',
    name: 'Reine',
    image: '/ELARAREINE.webp',
    price: 39,
    size: '100ml Eau de Parfum',
    emotionalHook: 'Worn by the woman who never needs to raise her voice.',
    smellsLike: "Expensive skin. A warm room. Someone you can't stop thinking about.",
    scentJourney: 'Opens with saffron and Bulgarian rose, bold, unapologetic. Settles into amber and white musk, intimate, addictive.',
    topNotes: ['Saffron', 'Pink Pepper'],
    heartNotes: ['Bulgarian Rose', 'Jasmine'],
    baseNotes: ['Amber', 'White Musk', 'Sandalwood'],
    longevity: '8-12 hours',
    projection: 'Strong sillage, enters before you do',
    occasion: 'Evening events, important meetings, first impressions',
    season: 'Autumn, Winter',
    concentration: 'Eau de Parfum, 20% fragrance oil',
    locked: false,
    bestseller: true,
    reviews: [
      { name: 'Lara M.',  rating: 5, text: 'Absolutely stunning. The saffron opening is warm and unique. It dries down beautifully into something I can only describe as skin-like.' },
      { name: 'Dani K.',  rating: 5, text: 'I get compliments every single time I wear this. The longevity is incredible. Worth every penny.' },
      { name: 'Sarah B.', rating: 5, text: 'Elegant and long-lasting. The rose heart is exquisite, not too sweet, perfectly balanced with the amber base.' },
    ],
  },
  {
    id: 'oro',
    name: 'Oro',
    image: '/elaraoroo.webp',
    price: 79,
    size: '100ml Eau de Parfum',
    emotionalHook: 'For the person who walks in and owns the room without trying.',
    smellsLike: "Gold. Success. The confidence you feel when you're exactly where you're supposed to be.",
    scentJourney: 'Bright citrus and spice at first breath. Rich oud and vanilla at second glance. Impossible to ignore.',
    topNotes: ['Bergamot', 'Cardamom'],
    heartNotes: ['Oud', 'Rose'],
    baseNotes: ['Vanilla', 'Amber', 'Cedarwood'],
    longevity: '10-14 hours',
    projection: 'Commanding, leaves a trail',
    occasion: 'Day to evening, power moves, luxury events',
    season: 'All seasons',
    concentration: 'Eau de Parfum, 20% fragrance oil',
    locked: true,
    bestseller: false,
    reviews: [],
  },
  {
    id: 'nova',
    name: 'Rawan Noir',
    image: '/ELARAREINE.webp',
    price: 79,
    size: '100ml Eau de Parfum',
    emotionalHook: 'Born from the silence after a storm.',
    smellsLike: 'Dark florals at midnight. Smoky skin. Mystery you can wear.',
    scentJourney: 'Opens dark and dramatic with black rose and oud. Slowly softens into sandalwood and musk, haunting, unforgettable.',
    topNotes: ['Black Rose', 'Saffron'],
    heartNotes: ['Oud', 'Dark Jasmine'],
    baseNotes: ['Sandalwood', 'Musk', 'Amber'],
    longevity: '12+ hours',
    projection: 'Intimate but intense, stays on skin for days',
    occasion: 'Evenings, escapes, the hours that belong only to you',
    season: 'Autumn, Winter, Night',
    concentration: 'Eau de Parfum, 20% fragrance oil',
    locked: true,
    bestseller: false,
    reviews: [],
  },
];

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const WindIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
);

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const LeafIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 22"/>
    <path d="M17 8c0 6-5 10-13 14"/>
  </svg>
);

const MetaItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(200,150,42,0.45)' }}>
      {icon}
      <span style={{
        fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '2px',
        textTransform: 'uppercase', color: 'rgba(200,150,42,0.45)',
      }}>{label}</span>
    </div>
    <p style={{
      fontFamily: 'Raleway', fontSize: '10px', fontWeight: 300,
      color: 'rgba(250,246,239,0.42)', lineHeight: 1.45, margin: 0,
      letterSpacing: '0.2px',
    }}>{value}</p>
  </div>
);

const BuyNowBtn = ({ onClick, label = 'Buy Now' }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '4px',
        textTransform: 'uppercase', padding: '14px 28px',
        background: hov ? '#E8B84B' : '#c9a84c',
        color: '#0d0700',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        whiteSpace: 'nowrap',
        fontWeight: 600,
        boxShadow: hov ? '0 4px 20px rgba(200,150,42,0.35)' : 'none',
      }}
    >{label}</button>
  );
};

const ProductCard = ({ product, inView, delay }) => {
  const [hov, setHov] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [displayPrice, setDisplayPrice] = useState(49);
  const [hoveredSize, setHoveredSize] = useState(null);
  const [notifyHov, setNotifyHov] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
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
      {modal && <PaymentModal product={product} selectedSize={selectedSize} selectedPrice={REINE_PRICES[selectedSize]} signatureName={selectedSize === 'signature' ? signatureName : ''} onClose={() => setModal(false)} />}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(52px)',
          transition: `opacity 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      >
        <div className="shop-card" style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${hov ? 'rgba(200,150,42,0.35)' : 'rgba(200,150,42,0.1)'}`,
          transform: hov ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: hov
            ? '0 36px 88px rgba(0,0,0,0.55), 0 0 36px rgba(200,150,42,0.08)'
            : '0 4px 32px rgba(0,0,0,0.3)',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease, border-color 0.4s ease',
          position: 'relative',
        }}>

          {/* Image area — overflow:hidden scoped here, not on card */}
          <div className={`shop-card-img-area ${product.locked ? 'shop-card-img-locked' : 'shop-card-img-active'}`} style={{
            height: '280px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
          }}>
            {product.bestseller && (
              <div style={{
                position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
                textTransform: 'uppercase', padding: '5px 10px',
                background: 'rgba(200,150,42,1)', color: '#0a0600',
              }}>Fan Favourite</div>
            )}

            <img
              src={product.image} alt={product.name}
              loading="lazy"
              width="280"
              height="280"
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain', objectPosition: 'center',
                transform: hov ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                padding: '20px', boxSizing: 'border-box',
              }}
            />

            {/* Lock overlay — image area only */}
            {product.locked && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 4,
                background: 'rgba(6,6,6,0.6)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(201,168,76,0.85)" strokeWidth="1" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <p style={{
                  fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '5px',
                  color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: 0,
                }}>Coming Soon</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="shop-card-info" style={{ padding: '24px 28px 24px' }}>

            {/* Concentration */}
            <p style={{
              fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
              color: 'rgba(200,150,42,0.6)',
              textTransform: 'uppercase', marginBottom: '14px',
            }}>{product.concentration}</p>

            {/* Name */}
            <h3 style={{ marginBottom: '16px', lineHeight: 1 }}>
              <span style={{
                display: 'block', fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '9px',
                fontWeight: 300, textTransform: 'uppercase',
                color: 'rgba(250,246,239,0.32)', marginBottom: '6px',
              }}>ELARA</span>
              <span style={{
                display: 'block', fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic', fontWeight: 300, fontSize: '34px', lineHeight: 1,
                color: '#C8962A',
              }}>{product.name}</span>
            </h3>

            {/* Emotional hook */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
              fontSize: '16px', color: 'rgba(250,246,239,0.7)',
              lineHeight: 1.65, marginBottom: '18px', letterSpacing: '0.2px',
            }}>{product.emotionalHook}</p>

            {/* Gold hairline */}
            <div style={{
              height: '1px', marginBottom: '18px',
              background: 'linear-gradient(to right, rgba(200,150,42,0.3), transparent)',
            }}/>

            {/* Smells like */}
            <div style={{ marginBottom: '14px' }}>
              <span style={{
                fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(200,150,42,0.45)',
                display: 'block', marginBottom: '6px',
              }}>Smells like</span>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
                fontSize: '15px', color: 'rgba(200,150,42,0.85)',
                lineHeight: 1.65, letterSpacing: '0.2px', margin: 0,
              }}>{product.smellsLike}</p>
            </div>

            {/* Scent journey */}
            <p style={{
              fontFamily: 'Raleway', fontSize: '11px', fontWeight: 300,
              color: 'rgba(250,246,239,0.3)',
              lineHeight: 2.05, marginBottom: '22px', letterSpacing: '0.3px',
            }}>{product.scentJourney}</p>

            {/* Notes tiers */}
            <div style={{ marginBottom: '22px' }}>
              {[
                { tier: 'Top',   notes: product.topNotes   },
                { tier: 'Heart', notes: product.heartNotes },
                { tier: 'Base',  notes: product.baseNotes  },
              ].map(({ tier, notes }) => (
                <div key={tier} style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '3px',
                    color: 'rgba(200,150,42,0.4)', textTransform: 'uppercase',
                    minWidth: '40px', flexShrink: 0,
                  }}>{tier}</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {notes.map((n, i) => (
                      <span key={i} style={{
                        fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '0.8px',
                        padding: '3px 8px',
                        color: 'rgba(200,150,42,0.8)',
                        border: '1px solid rgba(200,150,42,0.2)',
                        background: 'rgba(200,150,42,0.04)',
                      }}>{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Meta grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '16px 12px', marginBottom: '24px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(200,150,42,0.08)',
            }}>
              <MetaItem icon={<ClockIcon />} label="Longevity" value={product.longevity} />
              <MetaItem icon={<WindIcon />}  label="Projection" value={product.projection} />
              <MetaItem icon={<StarIcon />}  label="Occasion" value={product.occasion} />
              <MetaItem icon={<LeafIcon />}  label="Season" value={product.season} />
            </div>

            {/* Size selector — Reine only */}
            {!product.locked && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '6px',
                  color: 'rgba(200,160,60,0.4)', textTransform: 'uppercase',
                  textAlign: 'center', marginBottom: '16px', fontWeight: 300,
                }}>Select Edition</p>
                <div style={{ display: 'flex', gap: '14px' }}>
                  {/* 100ML card */}
                  {[
                    { key: '100ml', topLine: '100ML · $49', subLine: 'Eau de Parfum', exclusive: false },
                    { key: 'signature', topLine: 'SIGNATURE EDITION', subLine: 'Your Name in Gold · $69', exclusive: true },
                  ].map(({ key, topLine, subLine, exclusive }) => {
                    const active  = selectedSize === key;
                    const hovered = hoveredSize === key;
                    return (
                      <div key={key} style={{ flex: 1 }}>
                        <button
                          onClick={() => handleSizeChange(key)}
                          onMouseEnter={() => setHoveredSize(key)}
                          onMouseLeave={() => setHoveredSize(null)}
                          style={{
                            width: '100%', position: 'relative',
                            fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '2.5px',
                            textTransform: 'uppercase', padding: '16px 10px 14px',
                            minHeight: '64px',
                            background: active
                              ? 'linear-gradient(135deg, rgba(200,160,60,0.13) 0%, rgba(200,160,60,0.05) 100%)'
                              : 'transparent',
                            border: `1px solid ${
                              active  ? 'rgba(200,160,60,0.95)' :
                              hovered ? 'rgba(200,160,60,0.55)' :
                                        'rgba(200,160,60,0.2)'
                            }`,
                            boxShadow: active && exclusive ? '0 0 18px rgba(200,160,60,0.18)' : 'none',
                            color: active  ? 'rgba(200,160,60,1)'  :
                                   hovered ? 'rgba(200,160,60,0.8)' :
                                             'rgba(200,160,60,0.45)',
                            borderRadius: '1px', cursor: 'pointer',
                            transition: 'border-color 0.3s ease, color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                          }}
                        >
                          {exclusive && (
                            <span style={{
                              position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)',
                              fontFamily: 'Raleway', fontSize: '6px', letterSpacing: '3px',
                              background: active ? '#C9A84C' : 'rgba(6,6,6,1)',
                              color: active ? '#060606' : 'rgba(200,160,60,0.7)',
                              border: `1px solid ${active ? '#C9A84C' : 'rgba(200,160,60,0.4)'}`,
                              padding: '2px 8px', whiteSpace: 'nowrap',
                              transition: 'all 0.3s ease',
                            }}>✦ EXCLUSIVE</span>
                          )}
                          <span style={{ fontSize: '8px', letterSpacing: '2.5px' }}>{topLine}</span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                            fontSize: '11px', letterSpacing: '0.5px', textTransform: 'none',
                            color: active ? 'rgba(200,160,60,0.75)' : 'rgba(200,160,60,0.3)',
                            fontWeight: 300, transition: 'color 0.3s ease',
                          }}>{subLine}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Signature name input */}
                {selectedSize === 'signature' && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={signatureName}
                        onChange={e => setSignatureName(e.target.value.slice(0, 20))}
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => setNameFocused(false)}
                        placeholder="Your name to engrave…"
                        maxLength={20}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                          fontSize: '15px', fontWeight: 300,
                          background: nameFocused ? 'rgba(201,168,76,0.06)' : 'rgba(250,246,239,0.02)',
                          border: `1px solid ${nameFocused ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.3)'}`,
                          color: '#FAF6EF', padding: '12px 40px 12px 14px',
                          outline: 'none', borderRadius: '1px',
                          transition: 'border-color 0.2s ease, background 0.2s ease',
                          WebkitAppearance: 'none',
                        }}
                      />
                      <span style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '1px',
                        color: signatureName.length >= 18 ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.3)',
                        transition: 'color 0.2s ease',
                      }}>{signatureName.length}/20</span>
                    </div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                      fontSize: '11px', color: 'rgba(201,168,76,0.45)',
                      marginTop: '10px', lineHeight: 1.6, textAlign: 'center',
                    }}>Each bottle is hand-personalized and quality checked before dispatch.</p>
                  </div>
                )}

                {/* Urgency signal */}
                <p style={{
                  fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '2.5px',
                  color: 'rgba(201,168,76,0.35)', textTransform: 'uppercase',
                  textAlign: 'center', marginTop: '14px',
                }}>✦ Limited personalized slots available each week</p>
              </div>
            )}

            {/* Buy area */}
            {!product.locked ? (
              <div className="shop-buy-area" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(200,150,42,0.1)',
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '32px', fontWeight: 300,
                  color: '#C9A96E', letterSpacing: '1px',
                  transition: 'opacity 0.2s ease',
                }}>${displayPrice}</span>
                <BuyNowBtn
                  onClick={() => setModal(true)}
                  label={selectedSize === 'signature' ? 'Order — Personalized' : 'Buy Now'}
                />
              </div>
            ) : (
              <div
                onMouseEnter={() => setNotifyHov(true)}
                onMouseLeave={() => setNotifyHov(false)}
                style={{
                  width: '100%', padding: '16px 0', textAlign: 'center',
                  borderTop: '1px solid rgba(201,168,76,0.12)',
                  border: `1px solid ${notifyHov ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.2)'}`,
                  transition: 'border-color 0.3s ease',
                  display: 'flex', flexDirection: 'column', gap: '5px',
                  cursor: 'default', background: 'transparent',
                }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
                  fontSize: '15px', color: 'rgba(232,224,216,0.8)', letterSpacing: '0.5px',
                }}>Available Soon</span>
                <span style={{
                  fontFamily: 'Raleway', fontSize: '7px', letterSpacing: '4px',
                  color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
                }}>Notify Me</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
            background: 'rgba(255,255,255,0.03)',
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

const Shop = () => {
  const [gridRef, gridIn] = useInView(0.05);

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      {/* ── Page header ── */}
      <div className="shop-header" style={{
        background: '#060606',
        padding: '120px clamp(20px, 6vw, 80px) 60px',
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

export default Shop;
