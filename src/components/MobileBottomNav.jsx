import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const ShopIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const CartIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
  </svg>
);

const ContactIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const TABS = [
  { path: '/',        label: 'Home',    Icon: HomeIcon    },
  { path: '/shop',   label: 'Shop',    Icon: ShopIcon    },
  { path: '/cart',   label: 'Cart',    Icon: CartIcon    },
  { path: '/contact', label: 'Contact', Icon: ContactIcon },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { cart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: '60px',
      background: 'rgba(20,10,0,0.97)',
      borderTop: '1px solid rgba(200,160,60,0.15)',
      display: 'flex', alignItems: 'stretch',
      zIndex: 9000,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }} className="mobile-bottom-nav">
      {TABS.map(({ path, label, Icon }) => {
        const active = pathname === path;
        const isCart = path === '/cart';
        return (
          <Link key={path} to={path} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '3px',
            color: active ? 'rgba(200,160,60,1)' : 'rgba(250,246,239,0.35)',
            textDecoration: 'none', position: 'relative',
            transition: 'color 0.2s ease',
            WebkitTapHighlightColor: 'transparent',
          }}>
            {/* Active indicator line */}
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '25%', right: '25%',
                height: '2px',
                background: 'linear-gradient(to right, transparent, rgba(200,160,60,0.8), transparent)',
              }} />
            )}
            <div style={{ position: 'relative' }}>
              <Icon active={active} />
              {isCart && cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  background: 'rgba(200,160,60,1)', color: '#0a0600',
                  borderRadius: '50%', width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Raleway, sans-serif', fontSize: '9px', fontWeight: 700,
                  lineHeight: 1,
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span style={{
              fontFamily: 'Raleway, sans-serif', fontSize: '8px',
              letterSpacing: '1.5px', textTransform: 'uppercase',
            }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
