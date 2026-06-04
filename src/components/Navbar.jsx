import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const LangToggle = () => {
  const { lang, toggle } = useLanguage();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Toggle language"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px 2px', display: 'flex', alignItems: 'center', gap: '2px',
        fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '1px',
        opacity: hov ? 1 : 0.75, transition: 'opacity 0.3s ease',
      }}
    >
      <span style={{ color: lang === 'en' ? '#b76e79' : 'rgba(183,110,121,0.38)', transition: 'color 0.3s ease' }}>EN</span>
      <span style={{ color: 'rgba(183,110,121,0.25)', margin: '0 1px' }}>|</span>
      <span style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: '11px', color: lang === 'ar' ? '#b76e79' : 'rgba(183,110,121,0.38)', transition: 'color 0.3s ease' }}>عر</span>
    </button>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { t } = useLanguage();
  const location  = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    ['/',        t.navHome   ],
    ['/shop',    t.navShop   ],
    ['/contact', t.navContact],
  ];

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav
        className="navbar-root lux-navbar-glass"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid transparent',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Wordmark */}
        <Link to="/" style={{ textDecoration: 'none', zIndex: 1 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: '1.25rem',
            letterSpacing: '0.38em',
            color: '#b76e79',
            textTransform: 'uppercase',
          }}>
            Elara
          </span>
        </Link>

        {/* Centre links — desktop */}
        <div className="nav-links" style={{
          display: 'flex', gap: '72px', alignItems: 'center',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          {navLinks.map(([path, label]) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`nav-link-lux${active ? ' lux-active' : ''}`}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#2c1810',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right — lang + cart + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <LangToggle />

          {/* Cart icon */}
          <Link
            to="/cart"
            className="nav-link-lux"
            style={{ color: '#2c1810', position: 'relative', display: 'flex' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#b76e79', color: '#0d0a07',
                fontSize: '8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px',
              zIndex: 1001,
            }}
          >
            <span style={{
              width: '22px', height: '1px', background: '#b76e79', display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none',
            }}/>
            <span style={{
              width: '14px', height: '1px', background: 'rgba(183,110,121,0.6)', display: 'block',
              transition: 'opacity 0.3s ease, width 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}/>
            <span style={{
              width: '22px', height: '1px', background: '#b76e79', display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none',
            }}/>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(245,240,232,0.98)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '48px', zIndex: 999,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {/* Decorative top line */}
        <div style={{ width: '32px', height: '1px', background: 'rgba(183,110,121,0.35)' }}/>

        {navLinks.map(([path, label]) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.45em', textTransform: 'uppercase',
                color: active ? '#b76e79' : 'rgba(44,24,16,0.65)',
                borderBottom: active ? '1px solid rgba(183,110,121,0.45)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.3s',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          );
        })}

        <div style={{ width: '32px', height: '1px', background: 'rgba(183,110,121,0.2)' }}/>

        <Link to="/cart" onClick={() => setMenuOpen(false)} style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(183,110,121,0.4)', textDecoration: 'none',
        }}>
          {t.navCart}{cartCount > 0 ? ` (${cartCount})` : ''}
        </Link>

        <LangToggle />
      </div>
    </>
  );
};

export default Navbar;
