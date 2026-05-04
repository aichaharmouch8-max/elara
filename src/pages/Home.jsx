import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

const ShopNowBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link to="/shop"
      className="discover-shimmer hero-shop-cta"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-block',
        fontFamily: 'Raleway, sans-serif', fontSize: '9px',
        letterSpacing: '5px', textTransform: 'uppercase',
        padding: '14px 44px',
        background: hov ? 'rgba(232,184,75,1)' : 'rgba(232,184,75,0.06)',
        color: hov ? '#0a0600' : 'rgba(232,216,178,1)',
        border: '1px solid rgba(232,184,75,0.55)',
        transition: 'all 0.35s ease',
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: hov ? '0 8px 40px rgba(200,160,60,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 18px 50px rgba(0,0,0,0.35)',
        borderRadius: '2px',
        position: 'relative',
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
    image: '/ELARAREINE.webp',
    tagline: 'Power. Seduction. Obsession. Saffron, Bulgarian rose and amber — crafted for the woman who leaves a mark.',
    price: 49,
    available: true,
    locked: false,
  },
  {
    id: 'oro',
    name: 'Oro',
    image: '/elaraoroo.webp',
    tagline: 'A fragrance that whispers what words cannot. Golden woods, luminous amber — your most intimate secret.',
    price: 79,
    available: false,
    locked: true,
  },
  {
    id: 'nova',
    name: 'Rawan Noir',
    image: '/ELARAREINE.webp',
    tagline: 'Darkness never looked this divine. For the woman the night was made for.',
    price: 79,
    available: false,
    locked: true,
  },
];

const REINE_PRICES = { '100ml': 49, 'signature': 69 };

const NotifyForm = ({ productName }) => {
  const [email, setEmail]   = useState('');
  const [focused, setFocused] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [done, setDone]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    window.open(
      `https://wa.me/96176510481?text=${encodeURIComponent(`Waitlist request — ${productName}: ${email} — ELARA`)}`,
      '_blank'
    );
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: '18px', color: 'rgba(201,168,76,0.9)', marginBottom: '4px',
      }}>You're on the list.</p>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '2px',
        color: 'rgba(250,246,239,0.3)', textTransform: 'uppercase',
      }}>We'll be in touch.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <style>{`.nf-input::placeholder{color:rgba(201,168,76,0.3);font-style:italic;font-family:'Cormorant Garamond',serif;}`}</style>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '5px',
        color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: '14px',
      }}>Launching Soon</p>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="your@email.com"
        required
        className="nf-input"
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'transparent', border: 'none',
          borderBottom: `1px solid ${focused ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.22)'}`,
          color: '#FAF6EF',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '15px', fontWeight: 300,
          padding: '10px 0', outline: 'none', textAlign: 'center',
          marginBottom: '14px',
          transition: 'border-color 0.3s ease',
        }}
      />
      <button
        type="submit"
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: '100%',
          fontFamily: 'Raleway, sans-serif', fontSize: '8px', fontWeight: 600,
          letterSpacing: '4px', textTransform: 'uppercase',
          padding: '14px',
          background: btnHov ? 'rgba(201,168,76,0.1)' : 'transparent',
          color: 'rgba(201,168,76,0.9)',
          border: '1px solid rgba(201,168,76,0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >Notify Me</button>
    </form>
  );
};

const CollectionCard = ({ product }) => {
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const [modal, setModal] = useState(false);
  const locked = !product.available;
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [displayPrice, setDisplayPrice] = useState(49);
  const [signatureName, setSignatureName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const priceTimer = useRef(null);

  const animatePrice = useCallback((from, to) => {
    clearInterval(priceTimer.current);
    const steps = 10; let step = 0;
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
      <motion.div
        variants={cardVariant}
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        style={{
          background: '#07050200',
          border: `1px solid ${hov ? 'rgba(201,168,76,0.32)' : 'rgba(201,168,76,0.13)'}`,
          display: 'flex', flexDirection: 'column',
          width: '100%', minHeight: '720px',
          transition: 'border-color 0.55s ease, box-shadow 0.55s ease',
          boxShadow: hov
            ? '0 0 0 1px rgba(201,168,76,0.08), 0 40px 100px rgba(0,0,0,0.6)'
            : '0 2px 20px rgba(0,0,0,0.18)',
        }}
      >
        {/* ── Image area — no overlapping buttons ── */}
        <div style={{
          width: '100%', height: '300px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '44px 32px 28px', boxSizing: 'border-box',
          position: 'relative',
        }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              height: '220px', width: 'auto',
              objectFit: 'contain',
              filter: locked ? 'brightness(0.65)' : 'none',
              transform: hov && !locked ? 'scale(1.04) translateY(-6px)' : 'scale(1) translateY(0)',
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease',
              display: 'block',
            }}
          />
          {locked && (
            <p style={{
              position: 'absolute', bottom: '14px', left: 0, right: 0,
              fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '5px',
              color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase', textAlign: 'center',
            }}>Launching Soon</p>
          )}
        </div>

        {/* ── Text + CTA body ── */}
        <div style={{
          padding: '32px 32px 40px', flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          boxSizing: 'border-box',
        }}>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '6px',
            color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginBottom: '14px',
          }}>ELARA</p>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: '34px', fontStyle: 'italic',
            color: '#FAF6EF', lineHeight: 1.05, marginBottom: '10px', letterSpacing: '-0.2px',
          }}>{product.name}</h3>

          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '3px',
            color: 'rgba(201,168,76,0.38)', textTransform: 'uppercase', marginBottom: '22px',
          }}>Eau de Parfum · 100ml</p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.8, marginBottom: '28px', letterSpacing: '0.15px',
            maxWidth: '260px',
          }}>{product.tagline}</p>

          {/* Push CTA to bottom */}
          <div style={{ flex: 1 }} />

          {/* ── UNLOCKED: edition + price + buy ── */}
          {!locked && (
            <>
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <p style={{
                  fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '4px',
                  color: 'rgba(200,160,60,0.4)', textTransform: 'uppercase', marginBottom: '10px',
                }}>Select Edition</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { key: '100ml', topLine: '100ML · $49', subLine: 'Eau de Parfum', exclusive: false },
                    { key: 'signature', topLine: 'SIGNATURE', subLine: 'Name in Gold · $69', exclusive: true },
                  ].map(({ key, topLine, subLine, exclusive }) => {
                    const active = selectedSize === key;
                    return (
                      <div key={key} style={{ flex: 1, position: 'relative' }}>
                        <button
                          onClick={() => handleSizeChange(key)}
                          style={{
                            width: '100%', position: 'relative',
                            fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '1.5px',
                            textTransform: 'uppercase', padding: '10px 6px 8px', minHeight: '52px',
                            background: active ? 'rgba(200,160,60,0.08)' : 'transparent',
                            border: `1px solid ${active ? 'rgba(200,160,60,0.9)' : 'rgba(200,160,60,0.22)'}`,
                            color: active ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.45)',
                            cursor: 'pointer', transition: 'all 0.3s ease', boxSizing: 'border-box',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                          }}
                        >
                          {exclusive && (
                            <span style={{
                              position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                              fontFamily: 'Raleway, sans-serif', fontSize: '6px', letterSpacing: '2px',
                              background: active ? '#C9A84C' : '#07050200',
                              color: active ? '#060606' : 'rgba(200,160,60,0.6)',
                              border: `1px solid ${active ? '#C9A84C' : 'rgba(200,160,60,0.3)'}`,
                              padding: '2px 6px', whiteSpace: 'nowrap', transition: 'all 0.3s ease',
                            }}>✦ EXCL</span>
                          )}
                          <span>{topLine}</span>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                            fontSize: '10px', letterSpacing: '0.3px', textTransform: 'none',
                            color: active ? 'rgba(200,160,60,0.7)' : 'rgba(200,160,60,0.28)',
                            fontWeight: 300, transition: 'color 0.3s ease',
                          }}>{subLine}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {selectedSize === 'signature' && (
                  <div style={{ marginTop: '12px' }}>
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
                          fontSize: '14px', fontWeight: 300,
                          background: nameFocused ? 'rgba(201,168,76,0.05)' : 'transparent',
                          border: `1px solid ${nameFocused ? 'rgba(201,168,76,0.65)' : 'rgba(201,168,76,0.22)'}`,
                          color: '#FAF6EF', padding: '10px 38px 10px 12px',
                          outline: 'none', transition: 'border-color 0.2s ease, background 0.2s ease',
                          WebkitAppearance: 'none',
                        }}
                      />
                      <span style={{
                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                        fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '1px',
                        color: signatureName.length >= 18 ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.28)',
                        transition: 'color 0.2s ease',
                      }}>{signatureName.length}/20</span>
                    </div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                      fontSize: '10px', color: 'rgba(201,168,76,0.38)',
                      marginTop: '6px', lineHeight: 1.6, textAlign: 'center',
                    }}>Each bottle is hand-personalized before dispatch.</p>
                  </div>
                )}
              </div>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 300,
                color: '#C9A96E', marginBottom: '14px',
              }}>${displayPrice}</p>

              <button
                onClick={() => setModal(true)}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  width: '100%', cursor: 'pointer',
                  fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '5px',
                  textTransform: 'uppercase', padding: '16px', textAlign: 'center',
                  background: btnHov ? '#C9A84C' : 'transparent',
                  color: btnHov ? '#060606' : 'rgba(201,168,76,0.85)',
                  border: '1px solid rgba(201,168,76,0.5)',
                  transition: 'all 0.4s ease',
                }}
              >{selectedSize === 'signature' ? 'Order — Personalized' : `Buy Now · $${displayPrice}`}</button>
            </>
          )}

          {/* ── LOCKED: email notify form ── */}
          {locked && <NotifyForm productName={product.name} />}
        </div>
      </motion.div>

      {modal && <PaymentModal product={product} selectedSize={selectedSize} selectedPrice={REINE_PRICES[selectedSize]} signatureName={selectedSize === 'signature' ? signatureName : ''} onClose={() => setModal(false)} />}
    </>
  );
};

/* ─────────────────────────────────────────
   MOBILE SWIPE CAROUSEL
───────────────────────────────────────── */
const CollectionCarousel = () => {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);

  // Edition selector state (for unlocked card)
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [displayPrice, setDisplayPrice] = useState(49);
  const [signatureName, setSignatureName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const priceTimer = useRef(null);

  const goTo = (index) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrent(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

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
    <div style={{ width: '100%' }}>
      <style>{`.carousel-track::-webkit-scrollbar{display:none}`}</style>

      {/* TRACK — native CSS scroll-snap, zero JS friction */}
      <div
        ref={trackRef}
        className="carousel-track"
        style={{
          display: 'flex',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {PRODUCTS.map((product, index) => (
          <div key={index} style={{ minWidth: '100%', scrollSnapAlign: 'start', padding: '0 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>

            {/* CARD */}
            <div style={{
              width: '100%',
              height: '100%',
              background: '#080603',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: '2px',
              padding: '28px 20px 32px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

              {/* IMAGE */}
              <div style={{
                width: '100%',
                height: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                position: 'relative',
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ height: '190px', width: 'auto', objectFit: 'contain' }}
                />
                {product.locked && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.4)' }} />
                )}
              </div>

              {/* PRODUCT INFO */}
              <p style={{ width: '100%', fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '0.2em', color: '#c9a84c', textAlign: 'center', marginBottom: '6px' }}>ELARA</p>
              <h3 style={{ width: '100%', fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#fff', textAlign: 'center', marginBottom: '6px' }}>{product.name}</h3>
              <p style={{ width: '100%', fontFamily: 'Raleway, sans-serif', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '16px' }}>100ML · EAU DE PARFUM</p>
              <p style={{ width: '100%', fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: 500, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.8, marginBottom: '24px' }}>{product.tagline}</p>

              {/* UNLOCKED: SELECT EDITION + BUY */}
              {!product.locked && (
                <>
                  <div style={{ width: '100%', marginBottom: '12px', marginTop: 'auto' }}>
                    <p style={{
                      fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '4px',
                      color: 'rgba(200,160,60,0.45)', textTransform: 'uppercase',
                      textAlign: 'center', marginBottom: '10px',
                    }}>Select Edition</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { key: '100ml', topLine: '100ML · $49', subLine: 'Eau de Parfum', exclusive: false },
                        { key: 'signature', topLine: 'SIGNATURE', subLine: 'Name in Gold · $69', exclusive: true },
                      ].map(({ key, topLine, subLine, exclusive }) => {
                        const active = selectedSize === key;
                        return (
                          <div key={key} style={{ flex: 1, position: 'relative' }}>
                            <button
                              onClick={() => handleSizeChange(key)}
                              style={{
                                width: '100%', position: 'relative',
                                fontFamily: 'Raleway, sans-serif', fontSize: '12px', letterSpacing: '1.5px',
                                textTransform: 'uppercase', padding: '10px 6px 8px', minHeight: '52px',
                                background: active
                                  ? 'linear-gradient(135deg, rgba(200,160,60,0.13) 0%, rgba(200,160,60,0.05) 100%)'
                                  : 'transparent',
                                border: `1px solid ${active ? 'rgba(200,160,60,0.95)' : 'rgba(200,160,60,0.25)'}`,
                                color: active ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.5)',
                                borderRadius: '2px', cursor: 'pointer',
                                transition: 'all 0.3s ease', boxSizing: 'border-box',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                              }}
                            >
                              {exclusive && (
                                <span style={{
                                  position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                                  fontFamily: 'Raleway, sans-serif', fontSize: '6px', letterSpacing: '2px',
                                  background: active ? '#C9A84C' : '#0a0602',
                                  color: active ? '#060606' : 'rgba(200,160,60,0.65)',
                                  border: `1px solid ${active ? '#C9A84C' : 'rgba(200,160,60,0.35)'}`,
                                  padding: '2px 6px', whiteSpace: 'nowrap',
                                  transition: 'all 0.3s ease',
                                }}>✦ EXCL</span>
                              )}
                              <span>{topLine}</span>
                              <span style={{
                                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                                fontSize: '10px', letterSpacing: '0.3px', textTransform: 'none',
                                color: active ? 'rgba(200,160,60,0.7)' : 'rgba(200,160,60,0.3)',
                                fontWeight: 300, transition: 'color 0.3s ease',
                              }}>{subLine}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {selectedSize === 'signature' && (
                      <div style={{ marginTop: '10px' }}>
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
                              fontSize: '14px', fontWeight: 300,
                              background: nameFocused ? 'rgba(201,168,76,0.06)' : 'rgba(250,246,239,0.02)',
                              border: `1px solid ${nameFocused ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.25)'}`,
                              color: '#FAF6EF', padding: '10px 38px 10px 12px',
                              outline: 'none', borderRadius: '2px',
                              transition: 'border-color 0.2s ease, background 0.2s ease',
                              WebkitAppearance: 'none',
                            }}
                          />
                          <span style={{
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                            fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '1px',
                            color: signatureName.length >= 18 ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.3)',
                            transition: 'color 0.2s ease',
                          }}>{signatureName.length}/20</span>
                        </div>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                          fontSize: '10px', color: 'rgba(201,168,76,0.4)',
                          marginTop: '7px', lineHeight: 1.6, textAlign: 'center',
                        }}>Each bottle is hand-personalized before dispatch.</p>
                      </div>
                    )}

                    <p style={{
                      fontFamily: 'Raleway, sans-serif', fontSize: '7px', letterSpacing: '2px',
                      color: 'rgba(201,168,76,0.25)', textTransform: 'uppercase',
                      textAlign: 'center', marginTop: '8px',
                    }}>✦ Limited personalized slots available each week</p>
                  </div>

                  <p style={{
                    width: '100%', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300,
                    color: '#C9A96E', marginBottom: '10px', textAlign: 'center',
                    transition: 'opacity 0.2s ease',
                  }}>${displayPrice}</p>

                  <button
                    onClick={() => { setModal(true); setModalProduct(product); }}
                    style={{
                      width: '100%', cursor: 'pointer',
                      fontFamily: 'Raleway, sans-serif', fontSize: '12px', letterSpacing: '3px',
                      textTransform: 'uppercase', padding: '14px', textAlign: 'center',
                      background: '#c9a84c', color: '#060606',
                      border: '1px solid rgba(200,160,60,0.7)',
                      transition: 'all 0.35s ease', whiteSpace: 'nowrap',
                    }}
                  >{selectedSize === 'signature' ? 'Order — Personalized' : `Buy Now $${displayPrice}`}</button>
                </>
              )}

              {/* LOCKED: email notify form */}
              {product.locked && (
                <div style={{ marginTop: 'auto', width: '100%' }}>
                  <NotifyForm productName={product.name} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
        {PRODUCTS.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: i === current ? '24px' : '6px',
            height: '6px',
            borderRadius: i === current ? '3px' : '50%',
            background: i === current ? '#c9a84c' : 'rgba(201,168,76,0.25)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {modal && modalProduct && (
        <PaymentModal
          product={modalProduct}
          selectedSize={selectedSize}
          selectedPrice={REINE_PRICES[selectedSize]}
          signatureName={selectedSize === 'signature' ? signatureName : ''}
          onClose={() => setModal(false)}
        />
      )}
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
      background: 'transparent',
      padding: '60px clamp(24px, 6vw, 60px)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '7px',
        color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', marginBottom: '40px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease',
      }}>Why Elara</p>

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
            transition: `opacity 0.9s ease ${0.1 + i * 0.12}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s`,
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
        padding: '60px 40px 80px',
        borderTop: '1px solid rgba(201,168,76,0.12)',
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
  const isMobile = useIsMobile();

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <SideNavDots />

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="hero" className="hero-section snap-section" style={{
        height: '100vh',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '76px',
        paddingBottom: '0',
      }}>
        <img
          src="/elaraaaaa.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
          className="hero-bg-img"
          style={{
            position: 'absolute',
            inset: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'right bottom',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

<div className="hero-overlay-left hero-atmosphere-overlay" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.58) 40%, rgba(0,0,0,0.12) 58%, transparent 100%)',
        }}/>
        <div className="hero-vignette" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 24%, transparent 70%, rgba(0,0,0,0.58) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(115deg, rgba(201,168,76,0.04) 0%, transparent 42%, transparent 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 38%)',
        }}/>

        <div className="hero-inner" style={{ pointerEvents: 'none', zIndex: 3 }}>
          <div className="hero-text-col" style={{ flex: '0 0 auto', width: '42%', maxWidth: '520px', paddingLeft: '50px', paddingTop: '80px', boxSizing: 'border-box', pointerEvents: 'auto' }}>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
              style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}
            >
              <span style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '9px',
                letterSpacing: '8px', color: '#EED79A', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Maison de Parfum
              </span>
              <motion.div
                aria-hidden
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                style={{
                  width: '140px',
                  height: '1px',
                  transformOrigin: 'left center',
                  background: 'linear-gradient(90deg, rgba(255,224,150,0.95) 0%, rgba(232,184,75,0.45) 70%, transparent 100%)',
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
              style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 300,
                lineHeight: 1.08, color: '#FAF6EF', marginBottom: '36px',
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', display: 'block' }}
              >
                Wear the
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: 'clamp(2.4rem, 8vw, 5rem)',
                  fontStyle: 'italic',
                  display: 'block',
                  backgroundImage: 'linear-gradient(132deg, #fff2c8 6%, #e8b84b 38%, #b8892e 94%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: '#E8B84B',
                  WebkitTextFillColor: 'transparent',
                  paddingRight: '0.02em',
                }}
              >
                Unspeakable
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
              style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
                color: 'rgba(235,226,216,0.78)', letterSpacing: '0.55px', lineHeight: 2.05,
                maxWidth: '380px', marginBottom: '40px',
                textWrap: 'balance',
              }}
            >
              For the woman who enters a room before she does.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.82 }}
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
        background: 'transparent',
        padding: '60px clamp(20px, 4vw, 40px) 80px',
        width: '100%',
        maxWidth: '100%',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {isMobile ? (
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <p style={{ fontFamily: 'Raleway', fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,200,80,0.7)', textTransform: 'uppercase', marginBottom: '20px' }}>
                Eau de Parfum
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 300,
                fontSize: 'clamp(40px, 5vw, 62px)', color: '#FAF6EF',
              }}>
                The <span style={{ fontStyle: 'italic', color: '#C9A96E' }}>Collection</span>
              </h2>
            </div>
          ) : (
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
          )}
        </div>

        <div className="collection-mobile-carousel">
          <CollectionCarousel />
        </div>

        {!isMobile && (
          <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              {PRODUCTS.map((product) => (
                <motion.div key={product.id} variants={cardVariant} style={{ display: 'flex', width: '100%' }}>
                  <CollectionCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </section>

      {/* ══════════════════ WHY ELARA ══════════════════ */}
      <WhyELARA />

      {/* ══════════════════ EXCLUSIVE ACCESS ══════════════════ */}
      <ExclusiveAccess />

    </div>
  );
};

export default Home;
