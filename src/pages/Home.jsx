import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';

const ShopNowBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link to="/shop"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-block',
        fontFamily: 'Raleway, sans-serif', fontSize: '9px',
        letterSpacing: '5px', textTransform: 'uppercase',
        padding: '12px 40px',
        background: hov ? 'rgba(200,160,60,1)' : 'transparent',
        color: hov ? '#0a0600' : 'rgba(200,160,60,1)',
        border: '1px solid rgba(200,160,60,0.7)',
        transition: 'all 0.35s ease',
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: hov ? '0 4px 24px rgba(200,160,60,0.2)' : 'none',
      }}
    >Shop Now</Link>
  );
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
};

/* ─────────────────────────────────────────
   COLLECTION SECTION
───────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'reine',
    name: 'Reine',
    image: '/ELARAREINE.png',
    tagline: 'She does not ask to be noticed. She insists. Saffron, Bulgarian rose, amber, the holy trinity of desire.',
    price: 39,
    available: true,
  },
  {
    id: 'oro',
    name: 'Oro',
    image: '/elaraoroo.png',
    tagline: 'Rare golden woods. Luminous amber. A secret worn close to the skin, never told.',
    price: 79,
    available: false,
  },
  {
    id: 'nova',
    name: 'Rawan Noir',
    image: '/elaraaaaa.png',
    tagline: 'Born after midnight. For the woman who lives her most interesting life after dark.',
    price: 79,
    available: false,
  },
];

const REINE_PRICES = { '50ml': 29, '100ml': 39 };

const CollectionCard = ({ product }) => {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [modal, setModal] = useState(false);
  const locked = !product.available;
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [displayPrice, setDisplayPrice] = useState(39);
  const [sizeTooltip, setSizeTooltip] = useState(null);
  const priceTimer = useRef(null);

  const animatePrice = useCallback((from, to) => {
    clearInterval(priceTimer.current);
    const steps = 10;
    let step = 0;
    priceTimer.current = setInterval(() => {
      step++;
      setDisplayPrice(Math.round(from + (to - from) * (step / steps)));
      if (step >= steps) clearInterval(priceTimer.current);
    }, 40);
  }, []);

  const handleSizeChange = (size) => {
    if (size === selectedSize) return;
    animatePrice(REINE_PRICES[selectedSize], REINE_PRICES[size]);
    setSelectedSize(size);
  };

  return (
    <>
      <style>{`
        @keyframes cardShimmer {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(320%)  skewX(-12deg); }
        }
      `}</style>

      <motion.div
        variants={cardVariant}
        whileHover={{ scale: 1.025, transition: { duration: 0.4, ease: 'easeOut' } }}
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        style={{
          background: '#0d0407',
          border: `1px solid ${hov ? 'rgba(201,168,76,0.3)' : 'rgba(120,20,40,0.2)'}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          boxShadow: hov
            ? '0 0 0 1px rgba(201,168,76,0.12), 0 32px 72px rgba(0,0,0,0.55)'
            : '0 0 60px rgba(100,10,30,0.15), 0 8px 32px rgba(0,0,0,0.28)',
        }}
      >
        {locked && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: '40%', height: '100%',
              background: 'linear-gradient(105deg, transparent 30%, rgba(201,169,110,0.07) 50%, transparent 70%)',
              animation: 'cardShimmer 5s ease-in-out infinite',
            }}/>
          </div>
        )}

        <div className={`collection-card-img-wrap ${locked ? 'collection-card-img-locked' : 'collection-card-img-active'}`} style={{
          width: '100%', height: '320px',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(to bottom, rgba(201,169,110,0.07) 0%, transparent 100%)',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center',
              display: 'block',
              transform: hov ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s ease',
              filter: 'none',
            }}
          />

          {locked && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
              background: 'linear-gradient(to top, rgba(4,2,0,0.72) 0%, transparent 100%)',
              padding: '28px 14px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '7px',
                letterSpacing: '5px', color: 'rgba(201,168,76,0.65)',
                textTransform: 'uppercase',
              }}>Coming Soon</span>
            </div>
          )}

          {!locked && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              opacity: hov ? 1 : 0,
              transform: hov ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              zIndex: 2,
            }}>
              <button
                onClick={() => setModal(true)}
                style={{
                  width: '100%',
                  fontFamily: 'Raleway, sans-serif', fontSize: '11px',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  padding: '14px 0', background: '#C8962A',
                  color: '#1C1510', border: 'none', cursor: 'pointer', fontWeight: 500,
                }}
              >Buy Now</button>
            </div>
          )}
        </div>

        <div className="collection-card-body" style={{ padding: '16px 24px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, boxSizing: 'border-box' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: '10px', color: 'rgba(250,246,239,0.26)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '2px',
          }}>ELARA</p>
          <h3 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: '28px', fontStyle: 'italic',
            color: '#FAF6EF',
            lineHeight: 1, marginBottom: '6px',
          }}>{product.name}</h3>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '11px', letterSpacing: '3px',
            color: 'rgba(200,160,60,0.6)', marginBottom: '10px',
          }}>100ml Eau de Parfum</p>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
            color: 'rgba(232,224,216,0.4)',
            lineHeight: 1.8, marginBottom: '12px', letterSpacing: '0.3px', flexGrow: 1,
          }}>{product.tagline}</p>

          {!locked && (
            <div style={{ width: '100%', marginBottom: '10px' }}>
              <p style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '4px',
                color: 'rgba(200,160,60,0.5)', textTransform: 'uppercase',
                textAlign: 'center', marginBottom: '10px',
              }}>Select Size</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['50ml', '100ml'].map((size) => {
                  const active = selectedSize === size;
                  return (
                    <div key={size} style={{ flex: 1, position: 'relative' }}>
                      {sizeTooltip === size && (
                        <div style={{
                          position: 'absolute',
                          top: size === '100ml' ? '-50px' : '-34px',
                          left: '50%', transform: 'translateX(-50%)',
                          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '1px',
                          color: 'rgba(200,160,60,0.95)',
                          background: 'rgba(15,8,0,0.96)',
                          border: '1px solid rgba(200,160,60,0.3)',
                          padding: '3px 8px', whiteSpace: 'nowrap',
                          pointerEvents: 'none', zIndex: 10,
                        }}>
                          {size === '50ml' ? 'Perfect for trying' : 'Our signature size'}
                        </div>
                      )}
                      <button
                        onClick={() => handleSizeChange(size)}
                        onMouseEnter={() => setSizeTooltip(size)}
                        onMouseLeave={() => setSizeTooltip(null)}
                        className="collection-size-btn"
                        style={{
                          width: '100%',
                          fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '1.5px',
                          textTransform: 'uppercase', padding: '7px 8px', minHeight: '44px',
                          background: active ? 'rgba(200,160,60,0.15)' : 'transparent',
                          border: `1px solid ${active ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.3)'}`,
                          color: active ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.6)',
                          borderRadius: '2px', cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box',
                        }}
                      >
                        {size} ${REINE_PRICES[size]}
                      </button>
                      <p style={{
                        fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '0.5px',
                        color: size === '100ml' ? 'rgba(200,160,60,0.7)' : 'rgba(250,246,239,0.28)',
                        textAlign: 'center', marginTop: '4px',
                      }}>
                        {size === '50ml' ? 'Entry size' : 'Save 26%'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!locked && (
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 300,
              color: '#C9A96E', marginBottom: '12px',
              transition: 'opacity 0.2s ease',
            }}>${displayPrice}</p>
          )}

          {!locked ? (
            <button
              onClick={() => setModal(true)}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              className="collection-buy-btn"
              style={{
                width: '100%', cursor: 'pointer',
                fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '3px',
                textTransform: 'uppercase', padding: '14px', textAlign: 'center',
                background: btnHov ? 'rgba(200,160,60,1)' : 'transparent',
                color: btnHov ? '#000' : 'rgba(200,160,60,1)',
                border: '1px solid rgba(200,160,60,0.8)',
                transition: 'all 0.35s ease',
                whiteSpace: 'nowrap',
              }}
            >Buy Now ${displayPrice}</button>
          ) : (
            <div style={{
              width: '100%', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '13px 0', cursor: 'default',
              border: '1px solid rgba(200,160,60,0.18)',
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
                fontSize: '15px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.5px',
              }}>Available Soon</span>
              <span style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '7px',
                letterSpacing: '4px', color: 'rgba(250,246,239,0.22)',
                textTransform: 'uppercase',
              }}>Notify me</span>
            </div>
          )}
        </div>
      </motion.div>

      {modal && <PaymentModal product={product} selectedSize={selectedSize} selectedPrice={REINE_PRICES[selectedSize]} onClose={() => setModal(false)} />}
    </>
  );
};

/* ─────────────────────────────────────────
   MOBILE SWIPE CAROUSEL
───────────────────────────────────────── */
const CollectionCarousel = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef(null);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = window.innerWidth * 0.92 + 16;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIdx(Math.min(Math.max(idx, 0), PRODUCTS.length - 1));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const t1 = setTimeout(() => {
      el.scrollLeft = 10;
      const t2 = setTimeout(() => {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(t2);
    }, 700);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div>
      <div
        ref={trackRef}
        className="carousel-track"
        onScroll={handleScroll}
        style={{ msOverflowStyle: 'none' }}
      >
        {PRODUCTS.map((product) => (
          <div key={product.id} className="carousel-card-slot">
            <CollectionCard product={product} />
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '8px', marginTop: '24px',
      }}>
        {PRODUCTS.map((_, i) => (
          <div key={i} style={{
            width:        i === activeIdx ? '24px' : '8px',
            height:       '8px',
            borderRadius: i === activeIdx ? '4px' : '50%',
            background:   i === activeIdx ? 'rgba(200,160,60,1)' : 'rgba(201,169,110,0.28)',
            transition: 'all 0.35s ease',
            flexShrink: 0,
          }}/>
        ))}
      </div>
    </div>
  );
};

const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ─────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────── */
const CombinedConnectSection = () => {
  const [waHov, setWaHov] = useState(false);
  const [secRef, secIn]   = useReveal(0.05);

  const fadeUp = (d = 0) => ({
    opacity: secIn ? 1 : 0,
    transform: secIn ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.9s ease ${d}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });

  return (
    <section
      id="connect"
      className="snap-section-auto connect-section"
      ref={secRef}
      style={{
        background: '#060606',
        padding: '120px 60px',
        textAlign: 'center',
      }}
    >
      <div id="contact" style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Label */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '6px',
          color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
          marginBottom: '20px',
          ...fadeUp(0.05),
        }}>Get in Touch</p>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1,
          marginBottom: '16px', letterSpacing: '-0.5px',
          ...fadeUp(0.1),
        }}>
          <span style={{ color: '#FAF6EF' }}>We'd Love to </span>
          <span style={{ fontStyle: 'italic', color: '#c9a84c' }}>Hear From You</span>
        </h2>

        {/* Subtext */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
          color: 'rgba(232,224,216,0.45)',
          marginBottom: '40px', letterSpacing: '0.3px', lineHeight: 1.7,
          maxWidth: '340px',
          ...fadeUp(0.15),
        }}>
          The fastest way to reach us is WhatsApp. We reply within minutes.
        </p>

        {/* WhatsApp CTA */}
        <div style={{ ...fadeUp(0.2) }}>
          <a
            href="https://wa.me/96176510481"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setWaHov(true)}
            onMouseLeave={() => setWaHov(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '280px', height: '54px', margin: '0 auto',
              background: waHov ? '#b8973d' : '#c9a84c',
              color: '#060606',
              fontFamily: 'Raleway, sans-serif', fontSize: '13px',
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: '2px',
              transition: 'background 0.3s ease',
              boxSizing: 'border-box', cursor: 'pointer',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>

          {/* Response time trust line */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
            fontSize: '10px', color: 'rgba(201,168,76,0.4)',
            textAlign: 'center', marginTop: '16px', letterSpacing: '0.3px',
          }}>Average response time: under 5 minutes</p>
        </div>

      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   WHY ELARA
───────────────────────────────────────── */
const WHY_ITEMS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 20 8 17 21 7 21 4 8 12 2"/>
        <line x1="4" y1="8" x2="20" y2="8"/>
        <polyline points="7 21 12 8 17 21"/>
      </svg>
    ),
    title: 'Niche Formula',
    body: 'Not a clone. Not inspired by anyone. A completely original scent crafted from scratch with premium raw ingredients.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 2h14"/>
        <path d="M5 22h14"/>
        <path d="M5.5 2L12 11l6.5-9"/>
        <path d="M5.5 22L12 13l6.5 9"/>
      </svg>
    ),
    title: '8–14 Hours On Skin',
    body: '20% fragrance oil concentration. Designed to last through your longest, most important moments.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
    ),
    title: 'Premium Ingredients',
    body: 'Bulgarian rose. Oud. Saffron. Sandalwood. Only the finest raw materials make it into every bottle.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Made to Be Remembered',
    body: 'A scent that stays — on your skin, in the room, in the memory of everyone who was there.',
  },
];

const WhyELARA = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} className="why-section" style={{
      background: '#060606',
      padding: 'clamp(80px, 8vw, 100px) clamp(24px, 8vw, 80px)',
      textAlign: 'center',
    }}>
      {/* Label */}
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
        color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', marginBottom: '20px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease',
      }}>Why Elara</p>

      {/* Headline */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', color: '#FAF6EF',
        lineHeight: 1.15, margin: '0 auto 20px', letterSpacing: '0.01em',
        opacity: visible ? 1 : 0, transition: 'opacity 0.85s ease 0.1s',
      }}>
        Every detail was made{' '}
        <span style={{ fontStyle: 'italic' }}>for you.</span>
      </h2>

      {/* Subtext */}
      <p className="why-subtext" style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: '12px',
        color: 'rgba(232,224,216,0.45)', letterSpacing: '0.4px', lineHeight: 1.9,
        maxWidth: '400px', margin: '0 auto 64px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.85s ease 0.2s',
      }}>
        From the first spray to the last trace — ELARA is built to be felt, remembered, and desired.
      </p>

      {/* Grid */}
      <div className="why-grid" style={{
        maxWidth: '1000px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 32px',
      }}>
        {WHY_ITEMS.map(({ icon, title, body }, i) => (
          <div key={title} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '16px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ease ${0.3 + i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.12}s`,
          }}>
            <div style={{ color: 'rgba(201,168,76,0.7)' }}>{icon}</div>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: '18px', color: '#FAF6EF', letterSpacing: '0.4px', margin: 0,
              lineHeight: 1.2,
            }}>{title}</h4>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
              color: 'rgba(232,224,216,0.5)', lineHeight: 1.85, letterSpacing: '0.3px',
              margin: 0, maxWidth: '210px',
            }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   IMMERSIVE QUOTE
───────────────────────────────────────── */
const ImmersiveQuote = () => {
  const [ref, visible] = useReveal(0.2);
  return (
    <section ref={ref} className="immersive-quote-section" style={{
      background: '#060606',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 32px',
      borderTop: '1px solid rgba(120,20,40,0.3)',
      textAlign: 'center',
    }}>
      <blockquote style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
        fontSize: 'clamp(22px, 4vw, 36px)', color: '#f0ebe3',
        lineHeight: 1.7, maxWidth: '720px',
        marginBottom: '0', letterSpacing: '0.02em',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 1.3s ease, transform 1.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        "She didn't wear perfume.<br/>
        She wore ELARA.<br/>
        There is a difference."
      </blockquote>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '6px',
        color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
        marginTop: '24px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease 0.7s',
      }}>ELARA, Maison de Parfum</p>
    </section>
  );
};


/* ─────────────────────────────────────────
   FRAGRANCE PHILOSOPHY
───────────────────────────────────────── */
const PHILOSOPHY_ITEMS = [
  {
    number: '01',
    title: 'Scent is identity.',
    body: 'What you wear on your skin tells the world who you are before you speak a single word.',
  },
  {
    number: '02',
    title: 'Luxury is emotional.',
    body: 'True luxury is not about price. It is about the feeling it leaves behind, long after the moment has passed.',
  },
  {
    number: '03',
    title: 'Memory is the most powerful sense.',
    body: 'A single scent can take you back to a place, a person, a version of yourself you never want to forget.',
  },
];

const FragrancePhilosophy = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} className="philosophy-section" style={{
      background: '#0f0508',
      padding: '80px 60px',
      borderTop: '1px solid rgba(120,20,40,0.3)',
    }}>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '6px',
        color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: '40px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease',
      }}>Our Philosophy</p>

      <div className="philosophy-grid" style={{
        maxWidth: '1000px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0 clamp(32px, 5vw, 64px)',
      }}>
        {PHILOSOPHY_ITEMS.map(({ number, title, body }, i) => (
          <div key={number} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.7s ease ${i * 0.4}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.4}s`,
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '14px', color: '#c9a84c', lineHeight: 1, margin: 0,
            }}>{number}</p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
              fontSize: '20px', color: '#FAF6EF',
              margin: '8px 0 0', lineHeight: 1.3,
            }}>{title}</h3>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
              color: '#e8e0d8', lineHeight: 1.6, margin: '8px 0 0', letterSpacing: '0.2px',
            }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   EXCLUSIVE ACCESS / WAITLIST
───────────────────────────────────────── */
const ExclusiveAccess = () => {
  const [email, setEmail]     = useState('');
  const [focused, setFocused] = useState(false);
  const [done, setDone]       = useState(false);
  const [btnHov, setBtnHov]   = useState(false);
  const [ref, visible]        = useReveal(0.15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  const fadeUp = (d = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.9s ease ${d}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });

  return (
    <section
      ref={ref}
      className="exclusive-access-section"
      style={{
        background: '#060606',
        padding: '100px 40px',
        borderTop: '1px solid rgba(120,20,40,0.3)',
        textAlign: 'center',
      }}
    >
      <style>{`
        .ea-input::placeholder { color: rgba(201,168,76,0.3); font-family: 'Cormorant Garamond', serif; font-style: italic; }
      `}</style>

      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
          color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
          marginBottom: '22px', ...fadeUp(0),
        }}>Exclusive Access</p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.15,
          marginBottom: '18px', letterSpacing: '-0.3px',
          ...fadeUp(0.1),
        }}>
          <span style={{ color: '#FAF6EF' }}>Be The First </span>
          <span style={{ fontStyle: 'italic', color: '#c9a84c' }}>To Know</span>
        </h2>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
          color: 'rgba(232,224,216,0.42)', letterSpacing: '0.4px', lineHeight: 2,
          marginBottom: '48px', ...fadeUp(0.2),
        }}>
          Early access to new fragrances, private events and exclusive offers.
        </p>

        {done ? (
          <div style={{ ...fadeUp(0) }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '26px', color: 'rgba(201,168,76,0.9)', lineHeight: 1.8,
              marginBottom: '8px',
            }}>You're on the list.</p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 300,
              letterSpacing: '2px', color: 'rgba(250,246,239,0.3)',
            }}>We'll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ ...fadeUp(0.3) }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="ea-input"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: `1px solid ${focused ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.22)'}`,
                color: '#FAF6EF', fontFamily: "'Cormorant Garamond', serif",
                fontSize: '17px', fontWeight: 300, letterSpacing: '0.3px',
                padding: '14px 0', outline: 'none', textAlign: 'center',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box', marginBottom: '28px',
              }}
            />
            <button
              type="submit"
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                width: '100%', fontFamily: 'Raleway, sans-serif',
                fontSize: '9px', fontWeight: 600, letterSpacing: '5px',
                textTransform: 'uppercase', padding: '18px',
                background: btnHov ? '#E8B84B' : '#c9a84c',
                color: '#0a0600', border: 'none', cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
            >Join the Waitlist</button>
          </form>
        )}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   SIDE NAV DOTS
───────────────────────────────────────── */
const SECTIONS = [
  { id: 'hero',       label: 'Hero' },
  { id: 'collection', label: 'Collection' },
  { id: 'connect',    label: 'Connect' },
];

const SideNavDots = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="side-nav-dots" aria-label="Page sections">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          className={`side-nav-dot${active === id ? ' active' : ''}`}
          onClick={() => scrollTo(id)}
          title={label}
          aria-label={`Go to ${label}`}
        />
      ))}
    </nav>
  );
};

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
const Home = () => {
  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <SideNavDots />

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="hero" className="hero-section snap-section" style={{
        height: '100vh',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'clip',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '76px',
        paddingBottom: '0',
      }}>
        <img
          src="/elaraaaaa.png"
          alt=""
          aria-hidden="true"
          className="hero-bg-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: 'calc(100% + 20px)',
            top: '-10px',
            objectFit: 'cover',
            objectPosition: '70% 60%',
            zIndex: 0,
            pointerEvents: 'none',
            animation: 'heroBgFloat 5s ease-in-out infinite',
          }}
        />
        <div className="hero-overlay-left" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}/>
        <div className="hero-vignette" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 72%, rgba(0,0,0,0.55) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(to top, rgba(80,5,20,0.4) 0%, transparent 40%)',
        }}/>

        <div className="hero-inner" style={{ pointerEvents: 'none' }}>
          <div className="hero-text-col" style={{ flex: '0 0 auto', width: '42%', maxWidth: '520px', paddingLeft: '50px', paddingTop: '80px', boxSizing: 'border-box', pointerEvents: 'auto' }}>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              style={{ marginBottom: '28px' }}
            >
              <span style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '9px',
                letterSpacing: '7px', color: '#E8B84B', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Maison de Parfum
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 300,
                lineHeight: 1.1, color: '#FAF6EF', marginBottom: '36px',
              }}
            >
              <span style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', display: 'block' }}>Wear the</span>
              <span style={{ fontSize: 'clamp(2.4rem, 8vw, 5rem)', fontStyle: 'italic', color: '#E8B84B', display: 'block' }}>Unspeakable</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.45 }}
              style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
                color: 'rgba(232,224,216,0.72)', letterSpacing: '0.6px', lineHeight: 2.1,
                maxWidth: '370px', marginBottom: '40px',
              }}
            >
              For the woman who enters a room before she does.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.75 }}
            >
              <ShopNowBtn />
            </motion.div>

          </div>
        </div>

        <div
          className="hero-bottom-line"
          style={{
            display: 'none',
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px', background: 'rgba(200,160,60,0.2)',
            zIndex: 2,
          }}
        />
      </section>

      {/* ══════════════════ COLLECTION ══════════════════ */}
      <section id="collection" className="collection-section snap-section-auto" style={{
        background: '#060606',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
        borderTop: '1px solid rgba(120,20,40,0.3)',
        width: '100%',
        maxWidth: '100%',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <p style={{ fontFamily: 'Raleway', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,200,80,0.7)', textTransform: 'uppercase', marginBottom: '20px' }}>
              Eau de Parfum
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 300,
              fontSize: 'clamp(40px, 5vw, 62px)', color: '#FAF6EF',
            }}>
              The <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>Collection</span>
            </h2>
          </motion.div>
        </div>

        <div className="collection-mobile-carousel">
          <CollectionCarousel />
        </div>

        <div className="collection-desktop-pyramid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="collection-container"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div variants={cardVariant} className="collection-card-top" style={{ width: 'min(480px, 100%)', marginBottom: '24px' }}>
              <CollectionCard product={PRODUCTS[0]} />
            </motion.div>
            <div className="collection-card-row-wrap" style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div variants={cardVariant} className="collection-card-row" style={{ width: 'min(480px, 100%)' }}>
                <CollectionCard product={PRODUCTS[1]} />
              </motion.div>
              <motion.div variants={cardVariant} className="collection-card-row" style={{ width: 'min(480px, 100%)' }}>
                <CollectionCard product={PRODUCTS[2]} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ PHILOSOPHY ══════════════════ */}
      <FragrancePhilosophy />

      {/* ══════════════════ WHY ELARA ══════════════════ */}
      <WhyELARA />

      {/* ══════════════════ IMMERSIVE QUOTE ══════════════════ */}
      <ImmersiveQuote />

      {/* ══════════════════ EXCLUSIVE ACCESS ══════════════════ */}
      <ExclusiveAccess />

      {/* ══════════════════ CONTACT ══════════════════ */}
      <CombinedConnectSection />

    </div>
  );
};

export default Home;
