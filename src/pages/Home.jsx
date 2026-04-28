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

/* ── Shared animation variants ── */
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
    tagline: 'She does not ask to be noticed. She insists. Saffron, Bulgarian rose, amber — the holy trinity of desire.',
    price: 39,
    available: true,
  },
  {
    id: 'oro',
    name: 'Oro',
    image: '/ELARAOROO.png',
    tagline: 'Rare golden woods. Luminous amber. A secret worn close to the skin, never told.',
    price: 79,
    available: false,
  },
  {
    id: 'nova',
    name: 'Rawan Noir',
    image: '/ELARAREINE.png',
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
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${hov ? 'rgba(255,200,80,0.4)' : 'rgba(201,169,110,0.08)'}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          boxShadow: hov
            ? '0 0 0 1px rgba(255,200,80,0.08), 0 32px 72px rgba(0,0,0,0.55)'
            : '0 8px 32px rgba(0,0,0,0.28)',
        }}
      >
        {/* Shimmer sweep — locked cards only */}
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

        {/* Product image */}
        <div className={`collection-card-img-wrap ${locked ? 'collection-card-img-locked' : 'collection-card-img-active'}`} style={{
          width: '100%', height: '280px',
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
              filter: locked ? 'blur(6px) brightness(0.28)' : 'none',
            }}
          />

          {/* Lock overlay — centered icon + tooltip on hover */}
          {locked && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                stroke="rgba(200,160,60,0.9)" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '8px',
                letterSpacing: '5px', color: 'rgba(200,160,60,0.7)',
                textTransform: 'uppercase',
              }}>Locked</span>

              {/* Hover tooltip */}
              <p style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: '11px', color: 'rgba(201,169,110,0.82)',
                marginTop: '10px', letterSpacing: '0.3px',
                opacity: hov ? 1 : 0,
                transform: hov ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                maxWidth: '200px', lineHeight: 1.6,
              }}>
                Join the waitlist to be<br/>the first to know
              </p>
            </div>
          )}

          {/* Hover Buy Now — available only */}
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

        {/* Text content */}
        <div className="collection-card-body" style={{ padding: '16px 24px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, boxSizing: 'border-box' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: '10px', color: 'rgba(250,246,239,0.26)',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '2px',
          }}>ELARA</p>
          <h3 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: '28px', fontStyle: 'italic',
            color: locked ? 'rgba(250,246,239,0.45)' : '#FAF6EF',
            lineHeight: 1, marginBottom: '6px',
          }}>{product.name}</h3>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '11px', letterSpacing: '3px',
            color: 'rgba(200,160,60,0.6)', marginBottom: '10px',
          }}>100ml · Eau de Parfum</p>
          <div style={{
            width: '32px', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.45), transparent)',
            marginBottom: '10px',
          }}/>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
            color: locked ? 'rgba(250,246,239,0.18)' : 'rgba(250,246,239,0.32)',
            lineHeight: 1.8, marginBottom: '12px', letterSpacing: '0.3px', flexGrow: 1,
          }}>{product.tagline}</p>
          {/* Size selector — Reine only */}
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
                        {size} · ${REINE_PRICES[size]}
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
              <div style={{
                height: '1px', marginTop: '14px', marginBottom: '10px',
                background: 'linear-gradient(to right, transparent, rgba(200,160,60,0.2), transparent)',
              }}/>
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
              fontFamily: "'Playfair Display', serif", fontSize: '12px',
              fontStyle: 'italic', letterSpacing: '1.5px', padding: '13px 0',
              color: 'rgba(200,160,60,0.45)',
              border: '1px solid rgba(200,160,60,0.15)',
              cursor: 'default',
            }}>Wait for the reveal</div>
          )}
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.45), transparent)',
          opacity: hov ? 0.9 : 0.18, transition: 'opacity 0.4s',
        }}/>
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
    const step = window.innerWidth * 0.90 + 8;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIdx(Math.min(Math.max(idx, 0), PRODUCTS.length - 1));
  };

  /* Swipe hint — nudge right then snap back on first load */
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
      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="carousel-track"
        onScroll={handleScroll}
        style={{ msOverflowStyle: 'none' }}
      >
        {PRODUCTS.map((product, i) => (
          <div
            key={product.id}
            className="carousel-card-slot"
          >
            <CollectionCard product={product} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
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

// REPLACE THIS WITH YOUR MAILCHIMP FORM ACTION URL
const MAILCHIMP_URL = 'https://your-list.us1.list-manage.com/subscribe/post?u=XXXXXXXXXXXXXXXXXXXXXXXX&amp;id=XXXXXXXXXX';

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


/* ── Founder Story ── */
const FounderStory = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '660px', margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          width: '48px', height: '1px', margin: '0 auto 44px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)',
        }}/>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
          color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: '44px',
        }}>About the Founder</p>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
          color: '#FAF6EF', lineHeight: 1.55, marginBottom: '40px',
          letterSpacing: '0.2px',
        }}>
          "I created ELARA because I believe scent is the most personal luxury you can own."
        </blockquote>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
          color: 'rgba(250,246,239,0.48)', lineHeight: 2.1, letterSpacing: '0.3px',
          marginBottom: '32px',
        }}>
          Growing up in Beirut, I was obsessed with my mother's perfume cabinet — French bottles wrapped in tissue, saved for occasions that never quite arrived. At fifteen, I broke the rule and wore every single one. ELARA is my answer to that girl. The belief that luxury should never wait.
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: '18px', color: 'rgba(201,168,76,0.8)', letterSpacing: '0.5px',
          marginBottom: '44px',
        }}>— Aicha</p>
        <div style={{
          width: '48px', height: '1px', margin: '0 auto',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
        }}/>
      </div>
    </section>
  );
};

/* ── Trust bar ── */
const TRUST_BAR_ITEMS = [
  'Secure Checkout',
  'Fast Delivery Across Lebanon',
  'Easy Returns',
  '100% Authentic Formula',
  'WhatsApp Support',
];

const TrustBar = () => (
  <div style={{
    background: 'rgba(201,168,76,0.08)',
    borderTop: '1px solid rgba(201,168,76,0.2)',
    borderBottom: '1px solid rgba(201,168,76,0.2)',
    padding: '18px clamp(24px, 6vw, 80px)',
  }}>
    <div className="trust-bar-inner" style={{
      maxWidth: '900px', margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
      {TRUST_BAR_ITEMS.flatMap((item, i) => {
        const nodes = [(
          <span key={item} style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '10px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.75)', whiteSpace: 'nowrap',
            padding: '6px 16px',
          }}>{item}</span>
        )];
        if (i < TRUST_BAR_ITEMS.length - 1) {
          nodes.push(
            <span key={`sep-${i}`} className="trust-bar-sep" style={{
              color: 'rgba(201,168,76,0.35)', fontSize: '10px', flexShrink: 0,
            }}>✦</span>
          );
        }
        return nodes;
      })}
    </div>
  </div>
);

const fieldStyleFn = (focused) => ({
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: `1px solid ${focused ? 'rgba(200,160,60,0.95)' : 'rgba(200,160,60,0.22)'}`,
  boxShadow: focused ? '0 1px 0 0 rgba(200,160,60,0.22)' : 'none',
  color: '#FAF6EF', fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px', fontWeight: 300, letterSpacing: '0.3px',
  padding: '14px 0', outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box', resize: 'none',
});

/* ── Ornamental divider ── */
const GoldDivider = ({ visible, delay = 0 }) => (
  <div style={{
    maxWidth: '680px', margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: '22px',
    opacity: visible ? 1 : 0,
    transition: `opacity 1.1s ease ${delay}s`,
  }}>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,160,60,0.5))' }} />
    <span className="connect-diamond">✦</span>
    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(200,160,60,0.5))' }} />
  </div>
);

/* ── Combined: Waitlist + Contact ── */
const CombinedConnectSection = () => {
  const [wEmail, setWEmail]     = useState('');
  const [wDone, setWDone]       = useState(false);
  const [wBusy, setWBusy]       = useState(false);
  const [wFocused, setWFocused] = useState(false);

  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [cDone, setCDone]   = useState(false);
  const [cBusy, setCBusy]   = useState(false);
  const [cError, setCError] = useState('');
  const [sendHov, setSendHov] = useState(false);
  const [waitHov, setWaitHov] = useState(false);

  const [secRef, secIn] = useReveal(0.05);

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!wEmail.trim()) return;
    setWBusy(true);
    try {
      await fetch(MAILCHIMP_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ EMAIL: wEmail, tags: 'waitlist', b_placeholder: '' }).toString(),
      });
    } catch (_) {}
    setWDone(true);
    setWBusy(false);
  };

  const handleContact = async (e) => {
    e.preventDefault();
    setCBusy(true);
    setCError('');
    try {
      await window.emailjs.send(
        'REPLACE WITH YOUR EMAILJS SERVICE ID',
        'REPLACE WITH YOUR EMAILJS TEMPLATE ID',
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
        'REPLACE WITH YOUR EMAILJS PUBLIC KEY'
      );
      setCDone(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (_) {
      setCError('Something went wrong. Please try again.');
    }
    setCBusy(false);
  };

  const fadeUp = (d = 0) => ({
    opacity: secIn ? 1 : 0,
    transform: secIn ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 1s ease ${d}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });

  return (
    <section
      id="connect"
      className="snap-section-auto"
      ref={secRef}
      style={{ background: '#0a0500', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(201,168,76,0.08)' }}
    >
      <style>{`
        .hc-input::placeholder { color: rgba(200,160,60,0.3); font-family: 'Cormorant Garamond', serif; }
        input[name="EMAIL"]::placeholder { color: rgba(200,160,60,0.3); font-family: 'Cormorant Garamond', serif; font-size: 16px; }
        textarea.hc-input { font-family: 'Cormorant Garamond', serif; }
        @keyframes diamondPulse {
          0%, 100% { text-shadow: 0 0 4px rgba(200,160,60,0.2); opacity: 0.6; }
          50%       { text-shadow: 0 0 18px rgba(200,160,60,0.65), 0 0 36px rgba(200,160,60,0.2); opacity: 1; }
        }
        .connect-diamond {
          color: rgba(200,160,60,0.85);
          font-size: 15px;
          line-height: 1;
          animation: diamondPulse 4s ease-in-out infinite;
          display: block;
          flex-shrink: 0;
        }
      `}</style>

      {/* ── TOP DIVIDER ── */}
      <GoldDivider visible={secIn} delay={0} />

      {/* ── WAITLIST BLOCK ── */}
      <div style={{ maxWidth: '680px', margin: '80px auto 0', textAlign: 'center', ...fadeUp(0.1) }}>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '8px',
          color: 'rgba(200,160,60,0.6)', textTransform: 'uppercase', marginBottom: '22px',
        }}>Exclusive Access</p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, marginBottom: '20px',
          letterSpacing: '-0.5px',
        }}>
          <span style={{ color: '#FAF6EF' }}>Be The First </span>
          <span style={{ fontStyle: 'italic', color: 'rgba(200,160,60,1)' }}>To Know</span>
        </h2>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
          color: 'rgba(250,246,239,0.38)', lineHeight: 2, marginBottom: '52px',
          letterSpacing: '0.5px', maxWidth: '420px', margin: '0 auto 52px',
        }}>
          Early access to new fragrances,<br />private events and exclusive offers.
        </p>

        {wDone ? (
          <div style={{ padding: '16px 0 8px' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '24px', color: '#C9A96E', lineHeight: 1.8,
            }}>
              Welcome to the ELARA inner circle.
            </p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 300,
              letterSpacing: '2px', color: 'rgba(200,160,60,0.45)', marginTop: '10px',
            }}>Watch your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleWaitlist} action={MAILCHIMP_URL} method="POST" target="_blank">
            <input type="text" name="b_placeholder" tabIndex="-1" defaultValue="" style={{ display: 'none' }} aria-hidden="true" readOnly />
            <div style={{ marginBottom: '0', textAlign: 'left' }}>
              <label style={{
                display: 'block', fontFamily: 'Raleway, sans-serif',
                fontSize: '8px', letterSpacing: '4px',
                color: 'rgba(200,160,60,0.5)', textTransform: 'uppercase', marginBottom: '10px',
              }}>Email Address</label>
              <input
                type="email" name="EMAIL" value={wEmail}
                onChange={e => setWEmail(e.target.value)}
                onFocus={() => setWFocused(true)} onBlur={() => setWFocused(false)}
                placeholder="your@email.com" required
                autoComplete="email"
                className="hc-input"
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  borderBottom: `1px solid ${wFocused ? 'rgba(200,160,60,0.95)' : 'rgba(200,160,60,0.22)'}`,
                  boxShadow: wFocused ? '0 1px 0 0 rgba(200,160,60,0.22)' : 'none',
                  color: '#FAF6EF', fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '16px', fontWeight: 300,
                  padding: '14px 0', outline: 'none', boxSizing: 'border-box',
                  marginBottom: '32px',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
              />
            </div>
            <button
              type="submit" disabled={wBusy}
              onMouseEnter={() => setWaitHov(true)}
              onMouseLeave={() => setWaitHov(false)}
              style={{
                width: '100%',
                fontFamily: 'Raleway, sans-serif', fontSize: '9px', fontWeight: 600,
                letterSpacing: '5px', textTransform: 'uppercase', padding: '18px',
                background: waitHov ? '#D4A93A' : 'rgba(200,160,60,1)',
                color: '#0a0600',
                border: 'none',
                cursor: wBusy ? 'default' : 'pointer',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                boxShadow: waitHov ? '0 4px 32px rgba(200,160,60,0.28)' : '0 2px 16px rgba(200,160,60,0.1)',
                opacity: wBusy ? 0.7 : 1,
              }}
            >{wBusy ? '...' : 'Join the Waitlist'}</button>
          </form>
        )}
      </div>

      {/* ── MIDDLE DIVIDER ── */}
      <div style={{ margin: '88px 0' }}>
        <GoldDivider visible={secIn} delay={0.15} />
      </div>

      {/* ── CONTACT BLOCK ── */}
      <div id="contact" style={{ maxWidth: '680px', margin: '0 auto', ...fadeUp(0.2) }}>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '8px',
          color: 'rgba(200,160,60,0.6)', textTransform: 'uppercase',
          textAlign: 'center', marginBottom: '22px',
        }}>Get in Touch</p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.1,
          textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.5px',
        }}>
          <span style={{ color: '#FAF6EF' }}>We'd Love to </span>
          <span style={{ fontStyle: 'italic', color: 'rgba(200,160,60,1)' }}>Hear From You</span>
        </h2>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
          color: 'rgba(250,246,239,0.32)', textAlign: 'center',
          marginBottom: '52px', letterSpacing: '0.4px', lineHeight: 2,
        }}>
          Or reach us directly on{' '}
          <a href="https://wa.me/96176510481" target="_blank" rel="noreferrer"
            style={{
              color: 'rgba(200,160,60,0.8)', fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontSize: '14px',
              borderBottom: '1px solid rgba(200,160,60,0.3)', paddingBottom: '1px',
              transition: 'color 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E8B84B'; e.currentTarget.style.borderColor = 'rgba(232,184,75,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,160,60,0.8)'; e.currentTarget.style.borderColor = 'rgba(200,160,60,0.3)'; }}
          >WhatsApp</a>
        </p>

        {cDone ? (
          <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '26px', color: 'rgba(200,160,60,1)', lineHeight: 1.8, marginBottom: '10px',
            }}>Your message has been sent.</p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 300,
              letterSpacing: '2px', color: 'rgba(250,246,239,0.35)',
            }}>We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContact}>
            {[
              { key: 'name',    label: 'Full Name',     placeholder: 'Your full name',             type: 'text',   autoComplete: 'name'  },
              { key: 'email',   label: 'Email Address', placeholder: 'your@email.com',             type: 'email',  autoComplete: 'email' },
              { key: 'subject', label: 'Subject',       placeholder: 'How can we help?',           type: 'text',   autoComplete: 'off'   },
              { key: 'message', label: 'Message',       placeholder: 'Write your message here…',   as: 'textarea', autoComplete: 'off'   },
            ].map(({ key, label, placeholder, type, as, autoComplete }) => (
              <FieldWithFocus
                key={key} name={key} label={label} placeholder={placeholder}
                type={type} as={as} value={form[key]}
                autoComplete={autoComplete}
                onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                fieldStyle={fieldStyleFn}
              />
            ))}
            {cError && (
              <p style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '11px',
                color: 'rgba(220,80,80,0.75)', marginBottom: '14px', letterSpacing: '0.3px',
              }}>{cError}</p>
            )}
            <button
              type="submit" disabled={cBusy}
              onMouseEnter={() => setSendHov(true)}
              onMouseLeave={() => setSendHov(false)}
              style={{
                width: '100%', fontFamily: 'Raleway, sans-serif',
                fontSize: '9px', fontWeight: 500, letterSpacing: '5px',
                textTransform: 'uppercase', padding: '18px',
                background: sendHov ? 'rgba(200,160,60,0.08)' : 'transparent',
                color: 'rgba(200,160,60,1)',
                border: `1px solid ${sendHov ? 'rgba(200,160,60,0.9)' : 'rgba(200,160,60,0.45)'}`,
                cursor: cBusy ? 'default' : 'pointer',
                transition: 'all 0.35s ease', opacity: cBusy ? 0.7 : 1,
                boxShadow: sendHov ? '0 0 28px rgba(200,160,60,0.12), inset 0 0 18px rgba(200,160,60,0.04)' : 'none',
                marginTop: '12px',
              }}
            >{cBusy ? 'Sending…' : 'Send Message'}</button>
          </form>
        )}
      </div>

      {/* ── BOTTOM DIVIDER ── */}
      <div style={{ margin: '88px 0 0' }}>
        <GoldDivider visible={secIn} delay={0.25} />
      </div>
    </section>
  );
};

const FieldWithFocus = ({ name, label, placeholder, type = 'text', as, value, onChange, fieldStyle, style, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '36px', ...style }}>
      <label style={{
        display: 'block', fontFamily: 'Raleway, sans-serif',
        fontSize: '8px', letterSpacing: '4px',
        color: 'rgba(200,160,60,0.5)', textTransform: 'uppercase', marginBottom: '10px',
      }}>{label}</label>
      {as === 'textarea' ? (
        <textarea
          name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}
          autoComplete={autoComplete || 'off'}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="hc-input"
          style={{ ...fieldStyle(focused), display: 'block' }}
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          autoComplete={autoComplete || (type === 'email' ? 'email' : 'off')}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="hc-input"
          style={fieldStyle(focused)}
        />
      )}
    </div>
  );
};

/* ── Why ELARA ── */
const WHY_ITEMS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: 'Niche Formula',
    body: 'Not a clone. Not inspired by. A completely original formula crafted in Lebanon.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Long Lasting',
    body: '8 to 14 hours on skin. Our formulas are built to stay with you, not just on you.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Made in Lebanon',
    body: 'Every bottle of ELARA is created in Beirut, with love and obsession.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Real Support',
    body: "Questions? We're on WhatsApp. Real answers from real people, always.",
  },
];

const WhyELARA = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
        color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: '20px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>Why ELARA</p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FAF6EF',
        marginBottom: '64px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 0.1s',
      }}>
        The difference you'll{' '}
        <span style={{ fontStyle: 'italic', color: 'rgba(201,168,76,1)' }}>feel on skin.</span>
      </h2>
      <div className="why-grid" style={{
        maxWidth: '1000px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px 32px',
      }}>
        {WHY_ITEMS.map(({ icon, title, body }, i) => (
          <div key={title} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '16px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.9s ease ${i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
          }}>
            <div style={{ color: 'rgba(201,168,76,0.65)' }}>{icon}</div>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: '20px', color: '#FAF6EF', letterSpacing: '0.5px', margin: 0,
            }}>{title}</h4>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
              color: 'rgba(250,246,239,0.38)', lineHeight: 2, letterSpacing: '0.3px',
              margin: 0, maxWidth: '200px',
            }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────
   CINEMATIC OPENING
───────────────────────────────────────── */
const CinematicOpening = () => {
  const [ref, visible] = useReveal(0.2);
  return (
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      textAlign: 'center',
      borderTop: '1px solid rgba(201,168,76,0.08)',
    }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(32px, 5vw, 48px)', color: '#FAF6EF',
        lineHeight: 1.35, letterSpacing: '0.02em',
        marginBottom: '40px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 1.1s ease, transform 1.1s cubic-bezier(0.16,1,0.3,1)',
      }}>
        Some fragrances are worn.<br/>
        <span style={{ fontStyle: 'italic', color: '#E8B84B' }}>Others are remembered.</span>
      </h2>

      <div style={{
        height: '1px', maxWidth: '120px', margin: '0 auto 40px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
        transformOrigin: 'center',
        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        opacity: visible ? 1 : 0,
        transition: 'transform 1.4s cubic-bezier(0.4,0,0.2,1) 0.4s, opacity 0.8s ease 0.4s',
      }}/>

      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 300,
        color: 'rgba(250,246,239,0.48)', lineHeight: 1.9,
        maxWidth: '640px', margin: '0 auto',
        letterSpacing: '0.4px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 1s ease 0.85s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.85s',
      }}>
        ELARA was not created to compete. It was created to linger — in rooms, in memories, in the minds of everyone you've ever left behind.
      </p>
    </section>
  );
};

/* ─────────────────────────────────────────
   ORIGIN STORY
───────────────────────────────────────── */
const OriginStory = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
    }}>
      <div className="origin-grid" style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
      }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.2s ease 0.1s',
          position: 'relative', overflow: 'hidden',
          aspectRatio: '3/4',
        }}>
          <img
            src="/elaraaaaa.png" alt="ELARA"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top', display: 'block',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(8,4,0,0.55) 0%, rgba(8,4,0,0.2) 100%)',
          }}/>
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 1s ease 0.3s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s',
        }}>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
            color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: '24px',
          }}>The Story</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#FAF6EF',
            lineHeight: 1.25, marginBottom: '32px',
          }}>
            Born from a desire to make luxury{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(201,168,76,0.9)' }}>feel personal.</span>
          </h2>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
            color: 'rgba(250,246,239,0.52)', lineHeight: 1.9, marginBottom: '22px',
            letterSpacing: '0.3px',
          }}>
            ELARA began in Lebanon — a country that has always known how to turn hardship into beauty. We believed that a truly exceptional fragrance should not belong only to fashion capitals or luxury malls. It should belong to anyone who understands that scent is the most intimate thing you can wear.
          </p>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
            color: 'rgba(250,246,239,0.38)', lineHeight: 1.9, marginBottom: '36px',
            letterSpacing: '0.3px',
          }}>
            Every bottle of ELARA is a quiet rebellion. Against the ordinary. Against the forgettable. Against everything that blends in.
          </p>
          <div style={{
            width: '48px', height: '1px',
            background: 'linear-gradient(90deg, rgba(201,168,76,0.6), transparent)',
          }}/>
        </div>
      </div>
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
    body: 'True luxury is not about price. It is about the feeling it leaves behind — long after the moment has passed.',
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
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
    }}>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
        color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: '72px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease',
      }}>Our Philosophy</p>

      <div className="philosophy-grid" style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {PHILOSOPHY_ITEMS.map(({ number, title, body }, i) => (
          <div key={number} style={{
            padding: '0 clamp(24px, 4vw, 56px)',
            borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.15)' : 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.9s ease ${i * 0.15}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`,
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '40px', color: 'rgba(201,168,76,0.28)',
              marginBottom: '22px', lineHeight: 1,
            }}>{number}</p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#FAF6EF',
              marginBottom: '16px', lineHeight: 1.3,
            }}>{title}</h3>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
              color: 'rgba(250,246,239,0.4)', lineHeight: 1.9, letterSpacing: '0.3px',
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
    <section ref={ref} style={{
      background: '#0a0500',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
      textAlign: 'center',
    }}>
      <blockquote style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
        fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', color: '#FAF6EF',
        lineHeight: 1.6, maxWidth: '760px',
        marginBottom: '32px', letterSpacing: '0.02em',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 1.3s ease, transform 1.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        "She didn't wear perfume.<br/>
        She wore ELARA.<br/>
        There is a difference."
      </blockquote>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '6px',
        color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease 0.7s',
      }}>— ELARA, Maison de Parfum</p>
    </section>
  );
};


/* ─────────────────────────────────────────
   EMOTIONAL CLOSING
───────────────────────────────────────── */
const EmotionalClosing = () => {
  const [hov, setHov] = useState(false);
  const [ref, visible] = useReveal(0.2);
  return (
    <section ref={ref} style={{
      background: '#0a0500',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
      textAlign: 'center',
      borderTop: '1px solid rgba(201,168,76,0.08)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#FAF6EF',
          lineHeight: 1.3, marginBottom: '20px',
        }}>
          You already know what you want to feel like.
        </h2>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 300,
          color: 'rgba(250,246,239,0.45)', lineHeight: 1.9, marginBottom: '48px',
          letterSpacing: '0.4px',
        }}>
          ELARA is simply the scent that gets you there.
        </p>
        <Link
          to="/shop"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display: 'inline-block',
            fontFamily: 'Raleway, sans-serif', fontSize: '9px',
            letterSpacing: '5px', textTransform: 'uppercase',
            padding: '16px 48px',
            background: hov ? 'rgba(201,168,76,1)' : 'transparent',
            color: hov ? '#0a0600' : 'rgba(201,168,76,1)',
            border: '1px solid rgba(201,168,76,0.7)',
            transition: 'all 0.35s ease',
            textDecoration: 'none',
            boxShadow: hov ? '0 4px 28px rgba(201,168,76,0.2)' : 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >Explore the Collection</Link>
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
    <div style={{ background: '#0a0500', minHeight: '100vh' }}>
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

        {/* Full-bleed bottle photo — background layer with float animation */}
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

        {/* Left-to-right gradient — darkens text side, clears on bottle side */}
        <div className="hero-overlay-left" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}/>

        {/* Top + bottom vignette */}
        <div className="hero-vignette" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 72%, rgba(0,0,0,0.55) 100%)',
        }}/>

        {/* Text content — left side, on top */}
        <div className="hero-inner" style={{ pointerEvents: 'none' }}>
          <div className="hero-text-col" style={{ flex: '0 0 auto', width: '42%', maxWidth: '520px', paddingLeft: '50px', paddingTop: '80px', boxSizing: 'border-box', pointerEvents: 'auto' }}>

            {/* Eyebrow */}
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

            {/* Heading */}
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

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.45 }}
              style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
                color: 'rgba(250,246,239,0.62)', letterSpacing: '0.6px', lineHeight: 2.1,
                maxWidth: '370px', marginBottom: '40px',
              }}
            >
              A scent so rare, silence speaks first.<br/>
              For the woman who enters a room before she does.
              <br/>
              <span style={{ fontSize: '11px', color: 'rgba(200,160,60,0.55)', letterSpacing: '1px' }}>
                Crafted in Lebanon · Delivered to your door
              </span>
            </motion.p>

            {/* Shop Now CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.75 }}
            >
              <ShopNowBtn />
            </motion.div>

          </div>
        </div>

        {/* Bottom separator — hidden on desktop via CSS */}
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

      {/* ══════════════════ CINEMATIC OPENING ══════════════════ */}
      <CinematicOpening />

      {/* ══════════════════ FOUNDER STORY ══════════════════ */}
      <FounderStory />

      {/* ══════════════════ COLLECTION ══════════════════ */}
      <section id="collection" className="collection-section snap-section-auto" style={{
        background: '#0a0500',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        width: '100%',
        maxWidth: '100%',
      }}>

        {/* Section header — shared */}
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, maxWidth: '72px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,200,80,0.5))' }}/>
              <p style={{ fontFamily: 'Raleway', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,200,80,0.7)', textTransform: 'uppercase' }}>
                Eau de Parfum
              </p>
              <div style={{ flex: 1, maxWidth: '72px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,200,80,0.5))' }}/>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 300,
              fontSize: 'clamp(40px, 5vw, 62px)', color: '#FAF6EF',
            }}>
              The <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>Collection</span>
            </h2>
          </motion.div>
        </div>

        {/* ── Mobile swipe carousel ── */}
        <div className="collection-mobile-carousel">
          <CollectionCarousel />
        </div>

        {/* ── Desktop pyramid ── */}
        <div className="collection-desktop-pyramid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="collection-container"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Reine — top, centered */}
            <motion.div variants={cardVariant} className="collection-card-top" style={{ width: 'min(340px, 100%)', marginBottom: '24px' }}>
              <CollectionCard product={PRODUCTS[0]} />
            </motion.div>

            {/* Oro + Nova — bottom row */}
            <div className="collection-card-row-wrap" style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div variants={cardVariant} className="collection-card-row" style={{ width: 'min(340px, 100%)' }}>
                <CollectionCard product={PRODUCTS[1]} />
              </motion.div>
              <motion.div variants={cardVariant} className="collection-card-row" style={{ width: 'min(340px, 100%)' }}>
                <CollectionCard product={PRODUCTS[2]} />
              </motion.div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* ══════════════════ FRAGRANCE PHILOSOPHY ══════════════════ */}
      <FragrancePhilosophy />

      {/* ══════════════════ IMMERSIVE QUOTE ══════════════════ */}
      <ImmersiveQuote />

      {/* ══════════════════ TRUST BAR ══════════════════ */}
      <TrustBar />

      {/* ══════════════════ ORIGIN STORY ══════════════════ */}
      <OriginStory />

      {/* ══════════════════ WHY ELARA ══════════════════ */}
      <WhyELARA />

      {/* ══════════════════ EMOTIONAL CLOSING ══════════════════ */}
      <EmotionalClosing />

      {/* ══════════════════ CONNECT + CONTACT ══════════════════ */}
      <CombinedConnectSection />

    </div>
  );
};

export default Home;
