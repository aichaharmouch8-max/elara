import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const inputStyle = (focused) => ({
  width: '100%',
  fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
  background: focused ? 'rgba(201,169,110,0.06)' : 'rgba(250,246,239,0.03)',
  border: `1px solid ${focused ? 'rgba(201,169,110,0.55)' : 'rgba(201,169,110,0.2)'}`,
  color: '#FAF6EF', padding: '14px 16px', outline: 'none',
  transition: 'border-color 0.2s ease', boxSizing: 'border-box', borderRadius: '4px',
  WebkitAppearance: 'none', appearance: 'none',
});

const Field = ({ label, type = 'text', value, onChange, placeholder, focused, onFocus, onBlur, as }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block', fontFamily: 'Raleway, sans-serif', fontSize: '9px',
      letterSpacing: '3px', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', marginBottom: '8px',
    }}>{label}</label>
    {as === 'textarea' ? (
      <textarea value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder={placeholder} required rows={3}
        style={{ ...inputStyle(focused), resize: 'none' }}
      />
    ) : (
      <input type={type} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder={placeholder} required style={inputStyle(focused)}
      />
    )}
  </div>
);

const WishMoneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const CodIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
    <path d="M12 12H3"/><circle cx="17" cy="12" r="4"/><path d="M17 10v2l1 1"/>
  </svg>
);

const MethodCard = ({ selected, onClick, icon, title, subtitle }) => (
  <button type="button" onClick={onClick} style={{
    flex: 1, cursor: 'pointer', textAlign: 'center',
    background: selected ? 'rgba(201,169,110,0.1)' : 'rgba(250,246,239,0.02)',
    border: `1px solid ${selected ? 'rgba(201,169,110,0.6)' : 'rgba(201,169,110,0.18)'}`,
    borderRadius: '6px', padding: '20px 12px',
    color: selected ? '#C9A96E' : 'rgba(201,169,110,0.45)',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    pointerEvents: 'auto',
  }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>{icon}</div>
    <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px', color: selected ? '#C9A96E' : 'rgba(201,169,110,0.45)' }}>{title}</p>
    <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '11px', color: selected ? 'rgba(250,246,239,0.5)' : 'rgba(250,246,239,0.2)' }}>{subtitle}</p>
  </button>
);

const LocationField = ({ location, setLocation, focused, onFocus, onBlur, locLoading, locError, locSuccess, fetchLocation }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <label style={{
        fontFamily: 'Raleway, sans-serif', fontSize: '9px',
        letterSpacing: '3px', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase',
      }}>Delivery Address</label>
      {locSuccess && (
        <span style={{ color: 'rgba(200,160,60,1)', fontSize: '13px', lineHeight: 1 }}>✓</span>
      )}
    </div>
    <textarea value={location} onChange={e => { setLocation(e.target.value); }}
      onFocus={onFocus} onBlur={onBlur}
      placeholder="Type your address or tap 'Use My Location'…"
      rows={2} style={{ ...inputStyle(focused), resize: 'none' }}
    />
    <button type="button" onClick={fetchLocation} disabled={locLoading} style={{
      marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px',
      background: 'none', border: '1px solid rgba(201,169,110,0.35)', borderRadius: '4px',
      padding: '10px 16px', cursor: locLoading ? 'default' : 'pointer',
      fontFamily: 'Raleway, sans-serif', fontSize: '10px', letterSpacing: '2px',
      textTransform: 'uppercase', color: 'rgba(201,169,110,0.9)',
      opacity: locLoading ? 0.6 : 1, WebkitTapHighlightColor: 'transparent',
    }}>
      {locLoading ? (
        <>
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            border: '1.5px solid rgba(201,169,110,0.3)', borderTopColor: '#C9A96E',
            display: 'inline-block', animation: 'locSpin 0.7s linear infinite',
          }}/>
          Detecting...
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
          {locSuccess ? '✓ Use My Location' : 'Use My Location'}
        </>
      )}
    </button>
    {locError && (
      <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: 'rgba(255,120,80,0.8)', marginTop: '6px' }}>
        {locError}
      </p>
    )}
  </div>
);

const LABEL_STYLE = {
  fontFamily: 'Raleway, sans-serif', fontSize: '9px', letterSpacing: '4px',
  color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', marginBottom: '12px',
};

const PaymentModal = ({ product, selectedSize = '100ml', selectedPrice, onClose }) => {
  const price = selectedPrice ?? product.price;
  const [method, setMethod]         = useState(null);
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [location, setLocation]     = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]     = useState('');
  const [locSuccess, setLocSuccess] = useState(false);
  const [locCoords, setLocCoords]   = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [btnHov, setBtnHov]         = useState(false);
  const [focus, setFocus]           = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const setF = (key, val) => setFocus(f => ({ ...f, [key]: val }));

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Your browser doesn't support location, please type manually");
      return;
    }
    setLocLoading(true);
    setLocError('');
    setLocSuccess(false);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          setLocCoords({ lat, lng: lon });
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
              { headers: { 'Accept': 'application/json', 'Accept-Language': 'en' } }
            );
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            const addr = data.address || {};
            const parts = [
              addr.house_number,
              addr.road,
              addr.city || addr.town || addr.village,
              addr.country,
            ].filter(Boolean);
            setLocation(parts.length ? parts.join(', ') : data.display_name);
            setLocSuccess(true);
          } catch {
            setLocation(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
            setLocSuccess(true);
          }
          setLocLoading(false);
        },
        (error) => {
          setLocLoading(false);
          if (error.code === 1) {
            setLocError('Please allow location access when your phone asks');
          } else {
            setLocError('Could not detect location, please type manually');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } catch {
      setLocLoading(false);
      setLocError('Could not get your location, please type manually');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const methodLabel = method === 'wish' ? 'Wish Money' : 'Cash on Delivery';
    const loc = location.trim() || 'Not provided';
    const lines = [
      '🛍️ New Order - ELARA',
      '─────────────────',
      `👤 Name: ${name.trim()}`,
      `📞 Phone: ${phone.trim()}`,
      `📍 Address: ${loc}`,
    ];
    if (locCoords) {
      lines.push(`🗺️ Location: https://maps.google.com/?q=${locCoords.lat},${locCoords.lng}`);
    }
    lines.push(`💰 Amount: $${price}`);
    lines.push(`📦 Size: ${selectedSize}`);
    lines.push(`💳 Payment: ${methodLabel}`);
    lines.push('─────────────────');
    window.open(`https://wa.me/96176510481?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  const sharedFields = (
    <>
      <Field label="Full Name" value={name} onChange={e => setName(e.target.value)}
        placeholder="Your full name" focused={focus.name}
        onFocus={() => setF('name', true)} onBlur={() => setF('name', false)} />
      <Field label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
        placeholder="+961 __ ___ ___" focused={focus.phone}
        onFocus={() => setF('phone', true)} onBlur={() => setF('phone', false)} />
      <LocationField location={location} setLocation={setLocation} focused={focus.location}
        onFocus={() => setF('location', true)} onBlur={() => setF('location', false)}
        locLoading={locLoading} locError={locError} locSuccess={locSuccess} fetchLocation={fetchLocation} />
    </>
  );

  const content = (
    <>
      <style>{`
        @keyframes modalFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes modalScaleIn {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.95); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes locSpin { to { transform:rotate(360deg); } }
        .elara-modal input::placeholder,
        .elara-modal textarea::placeholder { color: rgba(250,246,239,0.25); }
        .elara-modal textarea { font-family: Raleway, sans-serif; }
      `}</style>

      {/* Full-screen backdrop — dismiss on click outside */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        zIndex: 100000,
        background: 'rgba(0,0,0,0.85)',
        animation: 'modalFadeIn 0.3s ease',
      }} />

      {/* Modal box — above backdrop, never clipped by cursor layers */}
      <div
        className="elara-modal"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100001,
          pointerEvents: 'auto',
          width: '92vw', maxWidth: '420px',
          maxHeight: '80vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#1a0f00',
          border: '1px solid rgba(200,160,60,0.4)',
          borderRadius: '12px',
          padding: '40px 24px 30px',
          boxSizing: 'border-box',
          animation: 'modalScaleIn 0.3s ease',
        }}
      >
        {/* Close button — inside modal, top-right corner */}
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(200,160,60,0.12)', color: 'rgba(200,160,60,1)',
          border: '1px solid rgba(200,160,60,0.3)', borderRadius: '50%',
          cursor: 'pointer', fontSize: '14px', lineHeight: 1,
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: 'auto',
        }}>✕</button>

        {/* Brand */}
        <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '7px', color: 'rgba(201,169,110,0.4)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>ELARA</p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(201,169,110,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#C9A96E', fontSize: '24px' }}>✓</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300, fontSize: '28px', fontStyle: 'italic', color: '#FAF6EF', marginBottom: '16px', lineHeight: 1.25 }}>Order Placed</h3>
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.22), transparent)', marginBottom: '20px' }}/>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300, color: 'rgba(250,246,239,0.5)', lineHeight: 2, marginBottom: '12px' }}>
              Your order has been received!<br/>
              We will contact you shortly to{' '}
              <span style={{ color: '#C9A96E', fontStyle: 'italic' }}>confirm delivery</span>.
            </p>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', color: 'rgba(201,169,110,0.4)' }}>Closing automatically…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300, fontSize: '26px', fontStyle: 'italic', color: '#FAF6EF', textAlign: 'center', lineHeight: 1.25, marginBottom: '6px' }}>Complete Your Order</h3>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300, color: 'rgba(201,169,110,0.6)', letterSpacing: '1px', textAlign: 'center', marginBottom: '28px' }}>
              {product.name} · {selectedSize} · ${price}
            </p>

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)', marginBottom: '24px' }}/>

            <p style={LABEL_STYLE}>Choose Payment Method</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <MethodCard selected={method === 'wish'} onClick={() => setMethod('wish')} icon={<WishMoneyIcon />} title="Wish Money"       subtitle="Digital transfer" />
              <MethodCard selected={method === 'cod'}  onClick={() => setMethod('cod')}  icon={<CodIcon />}       title="Cash on Delivery" subtitle="Pay on arrival"   />
            </div>

            {method === 'wish' && (
              <div>
                <p style={LABEL_STYLE}>Step 01 — Send Payment</p>
                <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300, color: 'rgba(250,246,239,0.6)', lineHeight: 1.7 }}>
                    Send payment via <span style={{ color: '#C9A96E', fontStyle: 'italic' }}>Wish Money</span> — we will send you the details after you confirm your order.
                  </p>
                  <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 300, color: 'rgba(250,246,239,0.35)', marginTop: '8px' }}>Amount: ${price}</p>
                </div>
                <p style={LABEL_STYLE}>Step 02 — Your Details</p>
                {sharedFields}
              </div>
            )}

            {method === 'cod' && (
              <div>
                <p style={LABEL_STYLE}>Delivery Details</p>
                {sharedFields}
              </div>
            )}

            {method && (
              <>
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.18), transparent)', margin: '20px 0' }}/>
                <button
                  type="submit"
                  onMouseEnter={() => setBtnHov(true)}
                  onMouseLeave={() => setBtnHov(false)}
                  style={{
                    width: '100%', fontFamily: 'Raleway, sans-serif', fontSize: '10px',
                    letterSpacing: '5px', textTransform: 'uppercase', padding: '18px 0',
                    background: btnHov ? '#C9A96E' : 'rgba(201,169,110,0.1)',
                    color: btnHov ? '#1C1510' : '#C9A96E',
                    border: `1px solid ${btnHov ? '#C9A96E' : 'rgba(201,169,110,0.4)'}`,
                    borderRadius: '4px', cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                    fontWeight: 500, WebkitTapHighlightColor: 'transparent',
                  }}
                >Confirm Order</button>
              </>
            )}
          </form>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default PaymentModal;
