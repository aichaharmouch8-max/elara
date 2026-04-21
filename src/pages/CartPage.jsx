import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQty } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ background: '#FAF6EF', minHeight: '100vh', paddingTop: '112px' }}>
      <div className="cart-wrapper" style={{ maxWidth: '860px', margin: '0 auto', padding: '60px clamp(20px, 5vw, 48px) 140px' }}>
        {/* Header */}
        <div style={{ marginBottom: '72px' }}>
          <p style={{
            fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '6px',
            color: '#C8962A', textTransform: 'uppercase', marginBottom: '14px',
          }}>
            Your Selection
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
            fontSize: 'clamp(56px, 7vw, 80px)', color: '#1C1510', lineHeight: 1,
          }}>
            Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              border: '1px solid rgba(200,150,42,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.3" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 300,
              fontSize: '28px', fontStyle: 'italic', color: '#1C1510', marginBottom: '12px',
            }}>
              Your cart is empty
            </p>
            <p style={{
              fontFamily: 'Raleway', fontSize: '12px', fontWeight: 300,
              color: '#8A7A6A', letterSpacing: '0.5px', marginBottom: '48px',
            }}>
              Discover our collection and add a fragrance
            </p>
            <ShopNowBtn />
          </div>
        ) : (
          <div>
            {/* ── Column headers ── */}
            <div className="cart-grid-header" style={{
              display: 'grid', gridTemplateColumns: '1fr 160px 120px',
              gap: '32px', paddingBottom: '16px',
              borderBottom: '1px solid rgba(200,150,42,0.2)',
              marginBottom: '8px',
            }}>
              {['Fragrance', 'Quantity', 'Total'].map(h => (
                <p key={h} style={{
                  fontFamily: 'Raleway', fontSize: '8px', letterSpacing: '4px',
                  color: 'rgba(200,150,42,0.6)', textTransform: 'uppercase',
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
              <div className="cart-summary" style={{ width: '360px' }}>
                {/* Subtotal */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(200,150,42,0.15)',
                  marginBottom: '16px',
                }}>
                  <span style={{
                    fontFamily: 'Raleway', fontSize: '9px', letterSpacing: '4px',
                    color: '#8A7A6A', textTransform: 'uppercase',
                  }}>
                    Subtotal
                  </span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '34px', fontWeight: 300, color: '#1C1510',
                  }}>
                    ${subtotal}
                  </span>
                </div>

                <p style={{
                  fontFamily: 'Raleway', fontSize: '11px', fontWeight: 300,
                  color: 'rgba(28,21,16,0.38)', letterSpacing: '0.3px',
                  lineHeight: 1.8, marginBottom: '32px',
                }}>
                  Complimentary worldwide shipping on all orders.
                  Delivered in signature ELARA packaging.
                </p>

                <CheckoutBtn />

                <Link to="/shop"
                  style={{
                    display: 'block', textAlign: 'center', marginTop: '18px',
                    fontFamily: 'Raleway', fontSize: '10px', letterSpacing: '3px',
                    color: 'rgba(28,21,16,0.38)', textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C8962A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,21,16,0.38)'}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Cart line item ── */
const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div
      className="cart-grid"
      style={{
        display: 'grid', gridTemplateColumns: '1fr 160px 120px',
        gap: '32px', alignItems: 'center',
        padding: '28px 0',
        borderBottom: '1px solid rgba(200,150,42,0.12)',
        transition: 'background 0.2s',
      }}
    >
      {/* Name */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 300,
              fontSize: '22px', color: '#1C1510', marginBottom: '4px',
            }}>
              {item.name}
            </p>
            <p style={{
              fontFamily: 'Raleway', fontSize: '10px', letterSpacing: '2px',
              color: '#C8962A', opacity: 0.8,
            }}>
              100ml Eau de Parfum
            </p>
          </div>
        </div>
      </div>

      {/* Qty controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <QtyBtn onClick={() => onUpdate(item.id, item.qty - 1)}>−</QtyBtn>
        <span style={{
          fontFamily: 'Raleway', fontSize: '14px', fontWeight: 300,
          color: '#1C1510', minWidth: '24px', textAlign: 'center',
        }}>
          {item.qty}
        </span>
        <QtyBtn onClick={() => onUpdate(item.id, item.qty + 1)}>+</QtyBtn>
        <button
          onClick={() => onRemove(item.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(28,21,16,0.28)', marginLeft: '4px',
            transition: 'color 0.25s', padding: '4px', display: 'flex',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C8962A'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(28,21,16,0.28)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '24px', fontWeight: 300, color: '#1C1510',
        }}>
          ${item.price * item.qty}
        </span>
      </div>
    </div>
  );
};

const QtyBtn = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '30px', height: '30px',
        border: `1px solid ${hov ? '#C8962A' : 'rgba(200,150,42,0.28)'}`,
        background: hov ? 'rgba(200,150,42,0.08)' : 'transparent',
        cursor: 'pointer', color: '#1C1510',
        fontSize: '16px', fontWeight: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s ease',
        fontFamily: 'Raleway',
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
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', fontFamily: 'Raleway', fontSize: '11px',
        letterSpacing: '4px', textTransform: 'uppercase', padding: '20px',
        background: hov ? '#C8962A' : '#1C1510',
        color: '#FAF6EF',
        border: `1px solid ${hov ? '#C8962A' : '#1C1510'}`,
        cursor: 'pointer', transition: 'all 0.4s ease',
      }}
    >
      Proceed to Checkout
    </button>
  );
};

const ShopNowBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link to="/shop">
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          fontFamily: 'Raleway', fontSize: '10px', letterSpacing: '4px',
          textTransform: 'uppercase', padding: '16px 48px',
          background: hov ? '#C8962A' : '#1C1510',
          color: '#FAF6EF',
          border: `1px solid ${hov ? '#C8962A' : '#1C1510'}`,
          cursor: 'pointer', transition: 'all 0.35s ease',
        }}
      >
        Shop Now
      </button>
    </Link>
  );
};

export default CartPage;
