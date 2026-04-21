import { useState, useEffect, useRef } from 'react';

/* ─── Scroll-in hook ─── */
const useReveal = (threshold = 0.15) => {
  const ref  = useRef(null);
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

/* ─── Underline field ─── */
const Field = ({
  label, name, type = 'text', value, onChange,
  placeholder, as, rows, autoComplete,
  showCheck = false, maxLength, showCounter = false,
}) => {
  const [focused, setFocused] = useState(false);
  const base = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focused ? 'rgba(200,160,60,0.9)' : 'rgba(200,160,60,0.3)'}`,
    color: '#FAF6EF',
    fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 300,
    letterSpacing: '0.4px',
    padding: '16px 0',
    paddingRight: showCheck ? '24px' : '0',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    resize: 'none',
  };
  return (
    <div style={{ marginBottom: '24px', position: 'relative' }}>
      <label style={{
        display: 'block',
        fontFamily: 'Raleway, sans-serif', fontSize: '12px', letterSpacing: '3px',
        color: 'rgba(200,160,60,0.8)', textTransform: 'uppercase', marginBottom: '10px',
      }}>{label}</label>

      {as === 'textarea' ? (
        <textarea
          name={name} value={value} onChange={onChange}
          placeholder={placeholder} rows={rows || 5}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base}
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base}
        />
      )}

      {/* Email validation checkmark */}
      {showCheck && (
        <span style={{
          position: 'absolute', right: 0, bottom: '16px',
          color: 'rgba(200,160,60,1)', fontSize: '14px',
          pointerEvents: 'none',
        }}>✓</span>
      )}

      {/* Character counter */}
      {showCounter && (
        <div style={{
          textAlign: 'right', marginTop: '6px',
          fontFamily: 'Raleway, sans-serif', fontSize: '11px',
          color: 'rgba(200,160,60,0.5)',
        }}>{value.length}/{maxLength || 500}</div>
      )}
    </div>
  );
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* ─────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'REPLACE WITH YOUR EMAILJS PUBLIC KEY';
const EMAILJS_SERVICE_ID  = 'REPLACE WITH YOUR EMAILJS SERVICE ID';
const EMAILJS_TEMPLATE_ID = 'REPLACE WITH YOUR EMAILJS TEMPLATE ID';

const Contact = () => {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const [btnHov, setBtnHov]   = useState(false);

  const emailValid = EMAIL_RE.test(form.email);

  const [heroRef, heroIn] = useReveal(0.1);
  const [formRef, formIn] = useReveal(0.1);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (_) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#1a0f00', minHeight: '100vh' }}>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(200,160,60,0.35); }
        textarea { font-family: Raleway, sans-serif; }
        @media (max-width: 768px) {
          .contact-send-btn {
            position: sticky !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 100 !important;
            margin-top: 8px !important;
          }
          .contact-send-btn button {
            width: 100% !important;
            box-shadow: 0 -6px 24px rgba(0,0,0,0.5) !important;
          }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section
        ref={heroRef}
        style={{
          background: '#1a0f00',
          paddingTop: '160px', paddingBottom: '40px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}
      >

        {/* GET IN TOUCH label */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '11px', letterSpacing: '6px',
          color: 'rgba(200,160,60,1)', textTransform: 'uppercase',
          marginBottom: '20px',
          opacity: heroIn ? 1 : 0,
          transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>Get in Touch</p>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 300,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 1.12, marginBottom: '36px',
          opacity: heroIn ? 1 : 0,
          transform: heroIn ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1s ease 0.15s, transform 1s ease 0.15s',
        }}>
          <span style={{ color: '#FAF6EF' }}>We'd Love to</span><br/>
          <span style={{ fontStyle: 'italic', color: 'rgba(200,160,60,1)' }}>Hear From You</span>
        </h1>

      </section>

      {/* ══ FORM ══ */}
      <section
        ref={formRef}
        style={{
          background: '#1a0f00',
          padding: '30px clamp(24px, 6vw, 80px) 50px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Radial gold glow — item 6 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(200,160,60,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative' }}>

          {/* WhatsApp direct line */}
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
            color: 'rgba(255,255,255,0.5)', textAlign: 'center',
            marginBottom: '30px', letterSpacing: '0.3px',
          }}>
            Or reach us directly on{' '}
            <a
              href="https://wa.me/96176510481"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'rgba(200,160,60,1)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(200,160,60,0.35)',
                paddingBottom: '1px',
                transition: 'color 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E8B84B'; e.currentTarget.style.borderColor = '#E8B84B'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,160,60,1)'; e.currentTarget.style.borderColor = 'rgba(200,160,60,0.35)'; }}
            >WhatsApp</a>
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: '20px', color: 'rgba(200,160,60,1)', lineHeight: 1.9,
                marginBottom: '8px',
              }}>
                Your message has been sent.
              </p>
              <p style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '13px', fontWeight: 300,
                color: 'rgba(250,246,239,0.4)', letterSpacing: '0.3px',
              }}>
                We will get back to you shortly.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            {['name', 'email', 'subject', 'message'].map((key, i) => (
              <div key={key} style={{
                opacity: formIn ? 1 : 0,
                transform: formIn ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}>
                <Field
                  label={
                    key === 'name'    ? 'Full Name' :
                    key === 'email'   ? 'Email Address' :
                    key === 'subject' ? 'Subject' : 'Message'
                  }
                  name={key}
                  type={key === 'email' ? 'email' : 'text'}
                  value={form[key]}
                  onChange={handle}
                  placeholder={
                    key === 'name'    ? 'Your full name' :
                    key === 'email'   ? 'your@email.com' :
                    key === 'subject' ? 'How can we help?' :
                    'Write your message here...'
                  }
                  as={key === 'message' ? 'textarea' : undefined}
                  rows={key === 'message' ? 5 : undefined}
                  autoComplete={
                    key === 'name'  ? 'name' :
                    key === 'email' ? 'email' : 'off'
                  }
                  showCheck={key === 'email' && emailValid}
                  maxLength={key === 'message' ? 500 : undefined}
                  showCounter={key === 'message'}
                />
              </div>
            ))}

            {error && (
              <p style={{
                fontFamily: 'Raleway, sans-serif', fontSize: '12px', fontWeight: 300,
                color: 'rgba(220,80,80,0.85)', marginBottom: '16px', letterSpacing: '0.3px',
              }}>{error}</p>
            )}

            <div
              className="contact-send-btn"
              style={{
                opacity: formIn ? 1 : 0,
                transform: formIn ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
              }}
            >
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  width: '100%',
                  fontFamily: 'Raleway, sans-serif', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '4px', textTransform: 'uppercase',
                  padding: '18px',
                  background: 'rgba(200,160,60,1)',
                  color: '#1a0f00',
                  border: 'none', cursor: loading ? 'default' : 'pointer',
                  transition: 'all 0.35s ease',
                  boxShadow: btnHov ? '0 0 30px rgba(200,160,60,0.35)' : 'none',
                  filter: btnHov ? 'brightness(1.1)' : 'brightness(1)',
                  opacity: loading ? 0.7 : 1,
                }}
              >{loading ? 'Sending...' : 'Send Message'}</button>
            </div>
          </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Contact;
