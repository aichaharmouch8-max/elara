import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [scrolled,  setScrolled ] = useState(false);
  const [menuOpen,  setMenuOpen ] = useState(false);
  const { cart } = useCart();
  const location  = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const isHome = location.pathname === '/';
  const frosted = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navBg        = scrolled ? 'rgba(26, 15, 0, 0.97)' : 'transparent';
  const navBorder    = frosted  ? '1px solid rgba(200, 150, 42, 0.28)' : '1px solid rgba(200, 150, 42, 0.22)';
  const linkColor    = '#FAF6EF';
  const hamburgerColor = 'rgba(200,160,60,1)';

  const navLinks = [
    ['/',        'Home'   ],
    ['/shop',    'Shop'   ],
    ['/contact', 'Contact'],
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: '0', left: 0, right: 0, zIndex: 1000,
        height: '76px', width: '100%', maxWidth: '100%', overflowX: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 64px',
        background: navBg,
        backdropFilter:       frosted ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: frosted ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: navBorder,
        transition: 'background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <span style={{ color: 'rgba(200,160,60,1)', fontFamily: 'serif', letterSpacing: '6px', fontSize: '1.4rem', fontWeight: '400' }}>
            ELARA
          </span>
        </Link>

        {/* Centre links — desktop only */}
        <div className="nav-links" style={{
          display: 'flex', gap: '80px', alignItems: 'center',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          {navLinks.map(([path, label]) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '10px', fontWeight: 400,
                letterSpacing: '4px', textTransform: 'uppercase',
                color: linkColor, opacity: active ? 1 : 0.55,
                paddingBottom: '3px',
                borderBottom: active ? '1px solid #C8962A' : '1px solid transparent',
                transition: 'opacity 0.3s, border-color 0.3s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.55'; }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right — cart + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

          {/* Cart icon */}
          <Link to="/cart"
            style={{ position: 'relative', color: linkColor, opacity: 0.8, transition: 'opacity 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-7px', right: '-9px',
                width: '17px', height: '17px', borderRadius: '50%',
                background: '#C8962A', color: '#FAF6EF',
                fontSize: '8px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Raleway, sans-serif', letterSpacing: 0,
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only (shown via CSS class) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              flexDirection: 'column', gap: '5px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
              zIndex: 1001,
            }}
          >
            <span style={{
              width: '22px', height: '1px', background: hamburgerColor, display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none',
            }}/>
            <span style={{
              width: '22px', height: '1px', background: hamburgerColor, display: 'block',
              transition: 'opacity 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }}/>
            <span style={{
              width: '22px', height: '1px', background: hamburgerColor, display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none',
            }}/>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div style={{
        position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0,
        background: 'rgba(12, 6, 0, 0.98)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '52px', zIndex: 998,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'all' : 'none',
        transition: 'opacity 0.35s ease',
      }}>
        {navLinks.map(([path, label]) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path} to={path}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 300,
                letterSpacing: '8px', textTransform: 'uppercase',
                color: active ? '#C9A96E' : 'rgba(250,246,239,0.7)',
                borderBottom: active ? '1px solid rgba(201,169,110,0.5)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.3s',
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* Decorative line */}
        <div style={{ width: '40px', height: '1px', background: 'rgba(201,169,110,0.3)', marginTop: '8px' }}/>

        <Link to="/cart" onClick={() => setMenuOpen(false)} style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '5px',
          textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)',
        }}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ''}
        </Link>
      </div>
    </>
  );
};

export default Navbar;
