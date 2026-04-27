import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navLinks = [
  ['/',        'Home'   ],
  ['/shop',    'Shop'   ],
  ['/contact', 'Contact'],
];

const Navbar = () => {
  const [scrolled,  setScrolled ] = useState(false);
  const [menuOpen,  setMenuOpen ] = useState(false);
  const { cart } = useCart();
  const location  = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navBg     = scrolled ? 'rgba(8,4,1,0.6)' : 'rgba(8,4,1,0.4)';
  const navBorder = scrolled ? 'rgba(201,168,76,0.28)' : 'rgba(201,168,76,0.15)';

  return (
    <>
      <nav
        className="navbar-root"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 9999,
          height: '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 56px',
          background: 'rgba(8,4,1,0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          transition: 'background 0.5s ease',
          boxSizing: 'border-box',
        }}
      >
        {/* Wordmark */}
        <Link to="/" style={{ textDecoration: 'none', zIndex: 1 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: '1.25rem',
            letterSpacing: '0.38em',
            color: '#c9a84c',
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
                  fontFamily: 'Raleway, sans-serif',
                  fontSize: '9px',
                  fontWeight: 400,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#FAF6EF',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right — cart + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

          {/* Cart icon */}
          <Link
            to="/cart"
            className="nav-link-lux"
            style={{ color: '#FAF6EF', position: 'relative', display: 'flex' }}
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
                background: '#c9a84c', color: '#0d0700',
                fontSize: '8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Raleway, sans-serif',
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
              width: '22px', height: '1px', background: '#c9a84c', display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none',
            }}/>
            <span style={{
              width: '14px', height: '1px', background: 'rgba(201,168,76,0.6)', display: 'block',
              transition: 'opacity 0.3s ease, width 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}/>
            <span style={{
              width: '22px', height: '1px', background: '#c9a84c', display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none',
            }}/>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(8,4,0,0.92)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '48px', zIndex: 999,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        {/* Decorative top line */}
        <div style={{ width: '32px', height: '1px', background: 'rgba(201,168,76,0.35)' }}/>

        {navLinks.map(([path, label]) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.45em', textTransform: 'uppercase',
                color: active ? '#c9a84c' : 'rgba(250,246,239,0.55)',
                borderBottom: active ? '1px solid rgba(201,168,76,0.45)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.3s',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          );
        })}

        <div style={{ width: '32px', height: '1px', background: 'rgba(201,168,76,0.2)' }}/>

        <Link to="/cart" onClick={() => setMenuOpen(false)} style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '8px',
          letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.4)', textDecoration: 'none',
        }}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ''}
        </Link>
      </div>
    </>
  );
};

export default Navbar;
