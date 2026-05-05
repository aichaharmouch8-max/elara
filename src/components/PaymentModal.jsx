import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
  width: '100%',
  fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 300,
  background: focused ? 'rgba(201,164,21,0.06)' : 'rgba(245,238,217,0.03)',
  border: `1px solid ${hasError ? 'rgba(255,90,70,0.55)' : focused ? 'rgba(201,164,21,0.55)' : 'rgba(201,164,21,0.2)'}`,
  color: '#f5eed9', padding: '14px 16px', outline: 'none',
  transition: 'border-color 0.2s ease', boxSizing: 'border-box', borderRadius: '4px',
  WebkitAppearance: 'none', appearance: 'none',
});

const LABEL = {
  display: 'block', fontFamily: "'Jost', sans-serif", fontSize: '9px',
  letterSpacing: '3px', color: 'rgba(201,164,21,0.5)', textTransform: 'uppercase', marginBottom: '8px',
};

const SEC_LABEL = {
  fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '4px',
  color: 'rgba(201,164,21,0.5)', textTransform: 'uppercase', marginBottom: '12px',
};

const ErrMsg = ({ msg }) => msg ? (
  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', color: 'rgba(255,90,70,0.85)', marginTop: '4px', lineHeight: 1.4 }}>{msg}</p>
) : null;

// ── Sub-components ────────────────────────────────────────────────────────────

const Field = ({ label, type = 'text', value, onChange, placeholder, focused, onFocus, onBlur, as, optional, error }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={LABEL}>
      {label}
      {optional && <span style={{ opacity: 0.4, fontWeight: 300, letterSpacing: '1px', textTransform: 'none' }}> (optional)</span>}
    </label>
    {as === 'textarea' ? (
      <textarea value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder={placeholder} rows={2}
        style={{ ...inputStyle(focused, error), resize: 'none' }}
      />
    ) : (
      <input type={type} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder={placeholder} style={inputStyle(focused, error)}
      />
    )}
    <ErrMsg msg={error} />
  </div>
);

const PhoneField = ({ value, onChange, focused, onFocus, onBlur, error }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={LABEL}>Phone Number</label>
    <div style={{ display: 'flex', gap: '8px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        padding: '14px 12px', borderRadius: '4px',
        background: 'rgba(245,238,217,0.03)',
        border: `1px solid ${error ? 'rgba(255,90,70,0.55)' : 'rgba(201,164,21,0.2)'}`,
        fontFamily: "'Jost', sans-serif", fontSize: '13px', color: 'rgba(245,238,217,0.6)',
      }}>
        <span>🇱🇧</span>
        <span style={{ fontSize: '11px' }}>+961</span>
      </div>
      <input type="tel" value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur}
        placeholder="76 510 481"
        style={{ ...inputStyle(focused, error), flex: 1 }}
      />
    </div>
    <ErrMsg msg={error} />
  </div>
);

// Location button: 'idle' | 'loading' | 'success' | 'error'
const PinSvg = ({ color = 'currentColor' }) => (
  <svg width="11" height="14" viewBox="0 0 24 28" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);

const Spinner = () => (
  <span style={{
    width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', flexShrink: 0,
    border: '1.5px solid rgba(201,164,21,0.25)', borderTopColor: '#c9a415',
    animation: 'locSpin 0.7s linear infinite',
  }} />
);

const LOC_BTN = {
  idle:    { border: 'rgba(201,164,21,0.35)', color: 'rgba(201,164,21,0.9)',  label: 'Use My Location',  icon: <PinSvg /> },
  loading: { border: 'rgba(201,164,21,0.3)',  color: 'rgba(201,164,21,0.55)', label: 'Detecting…',       icon: <Spinner /> },
  success: { border: 'rgba(100,210,120,0.6)',  color: 'rgba(100,210,120,0.9)',  label: '✓ Location Found', icon: null },
  error:   { border: 'rgba(255,90,70,0.45)',   color: 'rgba(255,110,80,0.9)',   label: '✗  Try Again',     icon: <PinSvg color="rgba(255,110,80,0.9)" /> },
};

const LocationBtn = ({ state, onClick }) => {
  const cfg = LOC_BTN[state];
  return (
    <button type="button" onClick={onClick} disabled={state === 'loading'} style={{
      marginTop: '8px', display: 'flex', alignItems: 'center', gap: '7px',
      background: 'none', border: `1px solid ${cfg.border}`, borderRadius: '4px',
      padding: '10px 16px', cursor: state === 'loading' ? 'default' : 'pointer',
      fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '2px',
      textTransform: 'uppercase', color: cfg.color,
      transition: 'border-color 0.3s ease, color 0.3s ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      {cfg.icon}
      {cfg.label}
    </button>
  );
};

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

const MethodCard = ({ selected, onClick, icon, title, desc }) => (
  <button type="button" onClick={onClick} style={{
    flex: 1, cursor: 'pointer', textAlign: 'center',
    background: selected
      ? 'linear-gradient(160deg, rgba(201,164,21,0.13) 0%, rgba(201,164,21,0.06) 100%)'
      : 'rgba(245,238,217,0.02)',
    border: `1px solid ${selected ? 'rgba(201,164,21,0.65)' : 'rgba(201,164,21,0.16)'}`,
    borderRadius: '10px', padding: '24px 14px 20px',
    color: selected ? '#c9a415' : 'rgba(201,164,21,0.42)',
    transition: 'all 0.35s ease',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative',
    boxShadow: selected
      ? '0 0 0 1px rgba(201,164,21,0.12), 0 10px 36px rgba(201,164,21,0.14), inset 0 1px 0 rgba(201,164,21,0.1)'
      : '0 2px 10px rgba(0,0,0,0.14)',
  }}>
    {selected && (
      <div style={{
        position: 'absolute', top: '10px', right: '10px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#c9a415',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(201,164,21,0.4)',
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <polyline points="1 4 3.5 6.5 9 1" stroke="#0a0600" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )}

    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '50px', height: '50px', borderRadius: '50%',
      background: selected ? 'rgba(201,164,21,0.14)' : 'rgba(201,164,21,0.05)',
      border: `1px solid ${selected ? 'rgba(201,164,21,0.38)' : 'rgba(201,164,21,0.1)'}`,
      margin: '0 auto 14px',
      transition: 'all 0.35s ease',
    }}>{icon}</div>

    <p style={{
      fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '3px',
      textTransform: 'uppercase', marginBottom: '9px', fontWeight: 500,
      color: selected ? '#c9a415' : 'rgba(201,164,21,0.45)',
      transition: 'color 0.35s ease',
    }}>{title}</p>

    <p style={{
      fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '12.5px',
      color: selected ? 'rgba(245,238,217,0.6)' : 'rgba(245,238,217,0.18)',
      lineHeight: 1.65, transition: 'color 0.35s ease',
    }}>{desc}</p>
  </button>
);

const WishMoneyInfo = ({ price }) => {
  const [tip, setTip] = useState(false);
  const tipRef = useRef(null);
  useEffect(() => {
    if (!tip) return;
    const fn = (e) => { if (tipRef.current && !tipRef.current.contains(e.target)) setTip(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [tip]);
  return (
    <div style={{ background: 'rgba(201,164,21,0.06)', border: '1px solid rgba(201,164,21,0.2)', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '3px', color: 'rgba(201,164,21,0.6)', textTransform: 'uppercase', marginBottom: '6px' }}>Wish Money</p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '13px', fontWeight: 300, color: 'rgba(245,238,217,0.6)', lineHeight: 1.7 }}>
            Send via Wish Money app. We'll confirm your order and share payment details via WhatsApp.
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: 'rgba(201,164,21,0.55)', marginTop: '8px' }}>Amount due: ${price}</p>
        </div>
        <div ref={tipRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button type="button" onClick={() => setTip(t => !t)} style={{
            width: '22px', height: '22px', borderRadius: '50%',
            border: '1px solid rgba(201,164,21,0.35)', background: 'rgba(201,164,21,0.08)',
            color: 'rgba(201,164,21,0.7)', fontFamily: "'Jost', sans-serif",
            fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}>?</button>
          {tip && (
            <div style={{
              position: 'absolute', top: '28px', right: 0, zIndex: 10,
              background: 'rgba(10,8,4,0.98)', border: '1px solid rgba(201,164,21,0.3)',
              borderRadius: '6px', padding: '14px 16px', width: '220px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {[
                '1. Confirm your order below',
                '2. We send you payment details on WhatsApp',
                '3. Transfer the amount via Wish Money',
                '4. Your order ships once payment is confirmed',
              ].map((step, i) => (
                <p key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(245,238,217,0.65)', lineHeight: 1.7, marginBottom: i < 3 ? '6px' : 0 }}>{step}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Location helper ───────────────────────────────────────────────────────────

const getLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) { reject('Geolocation not supported'); return; }
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude, longitude, accuracy } }) => {
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
        );
        const data = await res.json();
        resolve({
          lat: latitude, lng: longitude,
          accuracy: Math.round(accuracy),
          address: data.display_name || '',
          city: data.address?.city || data.address?.town || data.address?.village || '',
          country: data.address?.country || '',
          mapsLink,
        });
      } catch {
        resolve({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy), address: '', mapsLink });
      }
    },
    (err) => {
      if (err.code === 1) reject('PERMISSION_DENIED');
      else if (err.code === 2) reject('POSITION_UNAVAILABLE');
      else reject('TIMEOUT');
    },
    { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
  );
});

// ── Main modal ────────────────────────────────────────────────────────────────

const PaymentModal = ({ product, selectedSize = '100ml', selectedPrice, signatureName = '', onClose }) => {
  const price = selectedPrice ?? product.price;

  // Form fields
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [street, setStreet] = useState('');
  const [floor, setFloor]   = useState('');
  const [notes, setNotes]   = useState('');
  const [method, setMethod] = useState(null);

  // Location
  const [locState, setLocState] = useState('loading'); // 'idle'|'loading'|'success'|'error'
  const [locData, setLocData]   = useState(null);
  const [locError, setLocError] = useState('');

  // UI state
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [focus, setFocus]           = useState({});
  const [btnHov, setBtnHov]         = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Auto-detect location in the background as soon as the modal opens
  useEffect(() => {
    handleDetectLocation(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const setF = (key, val) => setFocus(f => ({ ...f, [key]: val }));

  const handleDetectLocation = async () => {
    setLocState('loading');
    setLocError('');
    try {
      const data = await getLocation();
      setLocData(data);
      if (data.address) setStreet(data.address);
      setLocState('success');
      setErrors(e => ({ ...e, street: undefined }));
    } catch (err) {
      setLocState('error');
      if (err === 'PERMISSION_DENIED') {
        setLocError('Please enable location access in your browser settings, or enter your address manually.');
      } else {
        setLocError('Could not detect location. Please enter your address manually.');
      }
    }
  };

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 3)
      e.name = 'Please enter your full name (min 3 characters)';
    if (phone.replace(/\D/g, '').length < 8)
      e.phone = 'Please enter a valid phone number (min 8 digits)';
    if (!street.trim())
      e.street = 'Please detect your location or enter your address manually';
    if (!method)
      e.method = 'Please select a payment method';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const methodLabel = method === 'wish' ? 'Wish Money' : 'Cash on Delivery';

    console.log('Saving to Supabase...');
    const { data, error } = await supabase.from('Orders').insert({
      customer_name: name.trim(),
      phone: `+961 ${phone.trim()}`,
      product: product.name,
      edition: selectedSize === 'signature' ? 'Signature Edition (100ml)' : '100ml Eau de Parfum',
      price,
      payment: methodLabel,
      address: street.trim(),
      floor_apt: floor.trim() || null,
      gps_lat: locData?.lat ?? null,
      gps_lng: locData?.lng ?? null,
      gps_location: locData ? `https://maps.google.com/?q=${locData.lat},${locData.lng}` : null,
    });
    if (error) console.error('Supabase error:', error);
    else console.log('Saved!', data);

    // WhatsApp notification to delivery agent
    const lat = locData?.lat ?? '';
    const lng = locData?.lng ?? '';
    const mapsLink = lat && lng
      ? `https://maps.google.com/?q=${lat},${lng}`
      : 'Not provided';
    const edition = selectedSize === 'signature' ? 'Signature Edition (100ml)' : '100ml Eau de Parfum';
    const waMsg = [
      '🛍️ NEW ELARA ORDER',
      '',
      `👤 Customer: ${name.trim()}`,
      `📱 Phone: +961 ${phone.trim()}`,
      '',
      `🌸 Product: ${product.name}`,
      `📦 Edition: ${edition}`,
      `💰 Price: $${price}`,
      `💳 Payment: ${methodLabel}`,
      '',
      `📍 Address: ${street.trim()}${floor.trim() ? `, ${floor.trim()}` : ''}`,
      `🗺️ Location: ${mapsLink}`,
    ].join('\n');
    window.open(
      `https://wa.me/96176510481?text=${encodeURIComponent(waMsg)}`,
      '_blank',
      'noopener,noreferrer'
    );

    setSubmitting(false);
    setSubmitted(true);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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
        .elara-modal textarea::placeholder { color: rgba(245,238,217,0.25); }
        .elara-modal textarea { font-family: 'Jost', sans-serif; }
      `}</style>

      {/* Backdrop */}
      <div
        className="lux-modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100000,
          animation: 'modalFadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        className="elara-modal lux-modal-shell"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100001, pointerEvents: 'auto',
          width: '92vw', maxWidth: '440px',
          maxHeight: '88vh', overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '44px 28px 34px',
          boxSizing: 'border-box',
          animation: 'modalScaleIn 0.3s ease',
        }}
      >
        {/* Close */}
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(200,160,60,0.12)', color: 'rgba(200,160,60,1)',
          border: '1px solid rgba(200,160,60,0.3)', borderRadius: '50%',
          cursor: 'pointer', fontSize: '14px', lineHeight: 1,
          WebkitTapHighlightColor: 'transparent',
        }}>✕</button>

        {/* Brand wordmark */}
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', letterSpacing: '0.35em', color: 'rgba(201,164,21,0.4)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>ELARA</p>

        {submitted ? (
          /* ── Success screen ───────────────────────────────────────────────── */
          <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '1px solid rgba(201,164,21,0.45)',
              background: 'rgba(201,164,21,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '28px', fontStyle: 'italic', color: '#f5eed9', marginBottom: '12px', lineHeight: 1.2 }}>
              Order placed successfully.
            </h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgba(201,164,21,0.7)', lineHeight: 1.9, marginBottom: '28px', maxWidth: '260px', margin: '0 auto 28px' }}>
              Your order has been placed successfully. We will contact you shortly.
            </p>
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,21,0.22), transparent)', marginBottom: '20px' }}/>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '8px', letterSpacing: '5px', color: 'rgba(201,164,21,0.35)', textTransform: 'uppercase' }}>
              ELARA · Maison de Parfum
            </p>
          </div>
        ) : (
          /* ── Order form ───────────────────────────────────────────────────── */
          <form onSubmit={handleSubmit} noValidate>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '26px', fontStyle: 'italic', color: '#f5eed9', textAlign: 'center', lineHeight: 1.25, marginBottom: '6px' }}>
              Complete Your Order
            </h3>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgba(201,164,21,0.6)', letterSpacing: '1px', textAlign: 'center', marginBottom: selectedSize === 'signature' && signatureName.trim() ? '8px' : '28px' }}>
              {product.name} · {selectedSize === 'signature' ? 'Signature Edition' : '100ml'} · ${price}
            </p>
            {selectedSize === 'signature' && signatureName.trim() && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(201,164,21,0.5)', textAlign: 'center', marginBottom: '28px' }}>
                Engraving: "{signatureName.trim()}"
              </p>
            )}

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,21,0.25), transparent)', marginBottom: '24px' }}/>

            {/* ── Customer details ────────────────────────────────────────── */}
            <p style={SEC_LABEL}>Your Details</p>
            <Field
              label="Full Name" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name" focused={focus.name} error={errors.name}
              onFocus={() => setF('name', true)} onBlur={() => setF('name', false)}
            />
            <PhoneField
              value={phone} onChange={e => setPhone(e.target.value)}
              focused={focus.phone} error={errors.phone}
              onFocus={() => setF('phone', true)} onBlur={() => setF('phone', false)}
            />

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,21,0.18), transparent)', margin: '20px 0' }}/>

            {/* ── Delivery address ────────────────────────────────────────── */}
            <p style={SEC_LABEL}>Delivery Address</p>

            <div style={{ marginBottom: '16px' }}>
              <label style={LABEL}>Building / Street</label>
              <input
                type="text" value={street}
                onChange={e => { setStreet(e.target.value); if (errors.street) setErrors(prev => ({ ...prev, street: undefined })); }}
                onFocus={() => setF('street', true)} onBlur={() => setF('street', false)}
                placeholder="e.g. 12 Hamra Street, Beirut"
                style={inputStyle(focus.street, errors.street)}
              />
              <ErrMsg msg={errors.street} />
              <LocationBtn state={locState} onClick={handleDetectLocation} />
              {locState === 'success' && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '1px', color: 'rgba(100,210,120,0.85)', marginTop: '5px' }}>✓ Location detected</p>
              )}
              {locError && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: 'rgba(255,100,80,0.85)', marginTop: '6px', lineHeight: 1.5 }}>{locError}</p>
              )}
            </div>

            <Field
              label="Floor / Apartment" value={floor} onChange={e => setFloor(e.target.value)}
              placeholder="e.g. Floor 3, Apt 12" focused={focus.floor} optional
              onFocus={() => setF('floor', true)} onBlur={() => setF('floor', false)}
            />
            <Field
              label="Additional Notes" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Landmark, gate code, special instructions…"
              focused={focus.notes} optional as="textarea"
              onFocus={() => setF('notes', true)} onBlur={() => setF('notes', false)}
            />

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,21,0.18), transparent)', margin: '20px 0' }}/>

            {/* ── Payment method ───────────────────────────────────────────── */}
            <p style={SEC_LABEL}>Payment Method</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: errors.method ? '8px' : '28px' }}>
              <MethodCard
                selected={method === 'wish'}
                onClick={() => { setMethod('wish'); setErrors(e => ({ ...e, method: undefined })); }}
                icon={<WishMoneyIcon />}
                title="Wish Money"
                desc="Safe & instant digital transfer"
              />
              <MethodCard
                selected={method === 'cod'}
                onClick={() => { setMethod('cod'); setErrors(e => ({ ...e, method: undefined })); }}
                icon={<CodIcon />}
                title="Cash on Delivery"
                desc="Pay when your order arrives at your door — no risk"
              />
            </div>
            <ErrMsg msg={errors.method} />

            {method === 'wish' && (
              <div style={{ marginTop: errors.method ? '12px' : 0, marginBottom: '8px' }}>
                <WishMoneyInfo price={price} />
              </div>
            )}

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,21,0.18), transparent)', margin: '20px 0' }}/>

            {/* ── Security assurance ───────────────────────────────────────── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
              padding: '13px 16px', marginBottom: '16px',
              background: 'linear-gradient(135deg, rgba(201,164,21,0.07) 0%, rgba(201,164,21,0.03) 100%)',
              border: '1px solid rgba(201,164,21,0.18)',
              borderRadius: '8px',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="rgba(201,164,21,0.75)"/>
                <polyline points="9 12 11 14 15 10" stroke="rgba(201,164,21,0.75)"/>
              </svg>
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: '10px', letterSpacing: '2.5px',
                color: 'rgba(201,164,21,0.75)', textTransform: 'uppercase', fontWeight: 400,
              }}>Your order is 100% secure</span>
            </div>

            {/* ── Submit ───────────────────────────────────────────────────── */}
            <button
              type="submit"
              disabled={submitting}
              className="lux-checkout-btn discover-shimmer"
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                width: '100%', fontFamily: "'Montserrat', sans-serif", fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase', padding: '20px 0',
                background: submitting ? 'rgba(201,164,21,0.15)' : (btnHov ? '#c9a415' : 'transparent'),
                color: submitting ? 'rgba(201,164,21,0.5)' : (btnHov ? '#0d0a07' : '#c9a415'),
                border: '1px solid rgba(201,164,21,0.65)',
                borderRadius: '1px',
                cursor: submitting ? 'default' : 'pointer',
                transition: 'all 0.35s ease',
                fontWeight: 500, WebkitTapHighlightColor: 'transparent',
              }}
            >
              {submitting ? 'Getting your location…' : 'Confirm Order'}
            </button>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: '12px', color: 'rgba(201,164,21,0.3)',
              textAlign: 'center', marginTop: '14px', letterSpacing: '0.3px',
            }}>
              We'll confirm your order personally via WhatsApp.
            </p>
          </form>
        )}
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default PaymentModal;
