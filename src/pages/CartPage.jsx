import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CloseBtn = () => {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => navigate('/')}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Close cart"
      style={{
        background: hov ? 'rgba(183,110,121,0.06)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(183,110,121,0.55)' : 'rgba(183,110,121,0.22)'}`,
        borderRadius: '50%',
        width: '48px', height: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, background 0.3s ease',
        flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={hov ? 'rgba(183,110,121,1)' : 'rgba(183,110,121,0.65)'}
        strokeWidth="1" strokeLinecap="round"
        style={{ transition: 'stroke 0.3s ease' }}
      >
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQty } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div style={{
        background: '#f5f0e8', minHeight: '100vh', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 60px',
        textAlign: 'center',
      }}>
        {/* Refined bag icon */}
        <div className="cart-empty-state" style={{ maxWidth: '420px', width: '100%', padding: '56px 40px 48px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
          <CloseBtn />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Tenor Sans', sans-serif", fontWeight: 400,
          fontSize: 'clamp(30px, 6vw, 46px)',
          color: '#2c1810', lineHeight: 1.2, letterSpacing: '0.1em',
          marginBottom: '20px',
        }}>Your Collection Awaits</h1>

        {/* Scent line */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: '18px', fontWeight: 300,
          color: 'rgba(183,110,121,0.85)',
          letterSpacing: '0.3px', marginBottom: '10px',
        }}>You haven't chosen your scent yet.</p>

        {/* Story line */}
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300,
          color: 'rgba(44,24,16,0.5)', letterSpacing: '0.5px',
          lineHeight: 1.8, marginBottom: '40px',
        }}>Every great story begins with a single choice.</p>

        <ShopNowBtn />

        {/* Gold hairline */}
        <div style={{
          width: '40px', height: '1px',
          background: 'rgba(183,110,121,0.35)',
          marginTop: '40px', marginBottom: '16px',
        }} />

        {/* Brand mark */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.2em',
          color: 'rgba(183,110,121,0.3)', textTransform: 'uppercase',
        }}>ELARA · Maison de Parfum</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '112px' }}>
      <div className="cart-wrapper" style={{ maxWidth: '860px', margin: '0 auto', padding: '60px clamp(20px, 5vw, 48px) 140px' }}>
        {/* Header */}
        <div style={{ marginBottom: '72px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.2em',
              color: 'rgba(183,110,121,0.55)', textTransform: 'uppercase', marginBottom: '14px',
            }}>
              Your Selection
            </p>
            <h1 style={{
              fontFamily: "'Tenor Sans', sans-serif", fontWeight: 400,
              fontSize: 'clamp(40px, 6vw, 64px)', color: '#2c1810', lineHeight: 1.1, letterSpacing: '0.1em',
            }}>
              Cart
            </h1>
          </div>
          <CloseBtn />
        </div>

        <div>
          {/* ── Column headers ── */}
          <div className="cart-grid-header" style={{
            display: 'grid', gridTemplateColumns: '1fr 160px 120px',
            gap: '32px', paddingBottom: '16px',
            borderBottom: '1px solid rgba(157,90,99,0.2)',
            marginBottom: '8px',
          }}>
            {['Fragrance', 'Quantity', 'Total'].map(h => (
              <p key={h} style={{
                fontFamily: "'Jost', sans-serif", fontSize: '8px', letterSpacing: '4px',
                color: 'rgba(157,90,99,0.5)', textTransform: 'uppercase',
                textAlign: h === 'Total' ? 'right' : 'left',
              }}>
                {h}
              </p>
            ))}
          </div>

          {/* ── Line items ── */}
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={updateQty}
              onRemove={removeFromCart}
            />
          ))}

          {/* ── Summary ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '64px' }}>
            <div className="cart-summary cart-summary-lux" style={{ width: 'min(380px, 100%)', boxSizing: 'border-box' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(157,90,99,0.15)',
                marginBottom: '16px',
              }}>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.2em',
                  color: 'rgba(183,110,121,0.55)', textTransform: 'uppercase',
                }}>
                  Subtotal
                </span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '34px', fontWeight: 300, color: '#2c1810',
                }}>
                  ${subtotal}
                </span>
              </div>

              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300,
                color: 'rgba(44,24,16,0.5)', letterSpacing: '0.3px',
                lineHeight: 1.8, marginBottom: '32px',
              }}>
                Complimentary worldwide shipping on all orders.
                Delivered in signature ELARA packaging.
              </p>

              <CheckoutBtn />

              <Link to="/shop"
                style={{
                  display: 'block', textAlign: 'center', marginTop: '18px',
                  fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '3px',
                  color: 'rgba(183,110,121,0.35)', textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#b76e79'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(183,110,121,0.35)'}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Cart line item ── */
const CartItem = ({ item, onUpdate, onRemove }) => (
  <div
    className="cart-grid"
    style={{
      display: 'grid', gridTemplateColumns: '1fr 160px 120px',
      gap: '32px', alignItems: 'center',
      padding: '28px 0',
      borderBottom: '1px solid rgba(157,90,99,0.1)',
    }}
  >
    <div>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic',
        fontSize: '22px', color: '#2c1810', marginBottom: '4px',
      }}>
        {item.name}
      </p>
      <p style={{
        fontFamily: "'Montserrat', sans-serif", fontSize: '8px', letterSpacing: '0.18em',
        color: 'rgba(183,110,121,0.6)', textTransform: 'uppercase',
      }}>
        100ml Eau de Parfum
      </p>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <QtyBtn onClick={() => onUpdate(item.id, item.qty - 1)}>−</QtyBtn>
      <span style={{
        fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 300,
        color: '#2c1810', minWidth: '24px', textAlign: 'center',
      }}>
        {item.qty}
      </span>
      <QtyBtn onClick={() => onUpdate(item.id, item.qty + 1)}>+</QtyBtn>
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(183,110,121,0.3)', marginLeft: '4px',
          transition: 'color 0.25s', padding: '4px', display: 'flex',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(183,110,121,0.9)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(183,110,121,0.3)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div style={{ textAlign: 'right' }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '24px', fontWeight: 300, color: '#2c1810',
      }}>
        ${item.price * item.qty}
      </span>
    </div>
  </div>
);

const QtyBtn = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '30px', height: '30px',
        border: `1px solid ${hov ? 'rgba(183,110,121,0.7)' : 'rgba(183,110,121,0.2)'}`,
        background: hov ? 'rgba(183,110,121,0.08)' : 'transparent',
        cursor: 'pointer', color: '#2c1810',
        fontSize: '16px', fontWeight: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s ease',
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {children}
    </button>
  );
};

const CheckoutBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      className="lux-checkout-btn"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', fontFamily: "'Montserrat', sans-serif", fontSize: '9px',
        letterSpacing: '0.2em', textTransform: 'uppercase', padding: '22px',
        background: hov ? '#b76e79' : 'transparent',
        color: hov ? '#0d0a07' : '#b76e79',
        border: '1px solid rgba(183,110,121,0.65)',
        borderRadius: '1px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.35s ease',
      }}
    >
      Proceed to Checkout
    </button>
  );
};

const ShopNowBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link to="/shop" style={{ display: 'inline-block' }}>
      <button
        type="button"
        className="lux-checkout-btn"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '220px', fontFamily: "'Montserrat', sans-serif", fontSize: '9px',
          letterSpacing: '0.2em', textTransform: 'uppercase', padding: '18px 0',
          background: hov ? '#b76e79' : 'transparent',
          color: hov ? '#0d0a07' : '#b76e79',
          border: '1px solid rgba(183,110,121,0.65)',
          borderRadius: '1px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.35s ease',
        }}
      >
        Shop Now
      </button>
    </Link>
  );
};

export default CartPage;
