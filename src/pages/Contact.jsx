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
    borderBottom: `1px solid ${focused ? 'rgba(183,110,121,0.9)' : 'rgba(183,110,121,0.3)'}`,
    color: '#2c1810',
    fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 300,
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
        fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.2em',
        color: 'rgba(183,110,121,0.8)', textTransform: 'uppercase', marginBottom: '10px',
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
          color: 'rgba(183,110,121,1)', fontSize: '14px',
          pointerEvents: 'none',
        }}>✓</span>
      )}

      {/* Character counter */}
      {showCounter && (
        <div style={{
          textAlign: 'right', marginTop: '6px',
          fontFamily: "'Jost', sans-serif", fontSize: '11px',
          color: 'rgba(183,110,121,0.5)',
        }}>{value.length}/{maxLength || 500}</div>
      )}
    </div>
  );
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FAQ_ITEMS = [
  {
    q: 'How long does the perfume last?',
    a: 'Most of our fragrances last 8-14 hours depending on your skin type. Drier skin absorbs scent faster. Apply to pulse points and moisturized skin for best results.',
  },
  {
    q: 'Is this genuine perfume?',
    a: '100%. ELARA is our own original formula, not a clone, not inspired by. Every bottle is crafted with premium fragrance oil at 20% concentration.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes, we deliver across Lebanon. Orders are packed with care and shipped within 1-2 business days.',
  },
  {
    q: 'Can I return?',
    a: "If there's an issue with your order, WhatsApp us immediately. We'll make it right, no hassle.",
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid rgba(183,110,121,0.12)',
      padding: '0',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', gap: '16px',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'Jost', sans-serif", fontWeight: 300,
          fontSize: '16px', color: open ? '#b76e79' : '#2c1810',
          lineHeight: 1.5, letterSpacing: '0.02em',
          transition: 'color 0.3s ease',
        }}>{q}</span>
        <span style={{
          color: 'rgba(183,110,121,0.6)', fontSize: '18px', flexShrink: 0,
          transition: 'transform 0.3s ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          display: 'block', lineHeight: 1,
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? '200px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: '13px', fontWeight: 300,
          color: 'rgba(44,24,16,0.6)', lineHeight: 1.8, letterSpacing: '0.3px',
          paddingBottom: '20px', margin: 0,
        }}>{a}</p>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: 'transparent',
      padding: 'clamp(72px, 9vw, 110px) clamp(24px, 6vw, 80px)',
      borderTop: '1px solid rgba(183,110,121,0.1)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.2em',
          color: 'rgba(183,110,121,0.65)', textTransform: 'uppercase',
          textAlign: 'center', marginBottom: '20px',
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
        }}>Common Questions</p>
        <h2 style={{
          fontFamily: "'Tenor Sans', sans-serif", fontWeight: 400,
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#2c1810',
          textAlign: 'center', marginBottom: '52px', lineHeight: 1.3, letterSpacing: '0.08em',
          opacity: visible ? 1 : 0, transition: 'opacity 0.9s ease 0.1s',
        }}>
          Good questions deserve{' '}
          <span style={{ fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", color: '#b76e79' }}>honest answers.</span>
        </h2>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
          borderTop: '1px solid rgba(183,110,121,0.12)',
        }}>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
};


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
    <div style={{ background: '#f5f0e8', minHeight: '100vh' }}>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(183,110,121,0.35); }
        textarea { font-family: 'Jost', sans-serif; }
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
          background: 'transparent',
          paddingTop: '160px', paddingBottom: '40px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}
      >

        {/* GET IN TOUCH label */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '0.2em',
          color: '#b76e79', textTransform: 'uppercase',
          marginBottom: '20px',
          opacity: heroIn ? 1 : 0,
          transform: heroIn ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>Get in Touch</p>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Tenor Sans', sans-serif", fontWeight: 400,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          lineHeight: 1.2, letterSpacing: '0.1em', marginBottom: '36px',
          opacity: heroIn ? 1 : 0,
          transform: heroIn ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 1s ease 0.15s, transform 1s ease 0.15s',
        }}>
          <span style={{ color: '#2c1810' }}>We'd Love to</span><br/>
          <span style={{ fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", color: '#b76e79' }}>Hear From You</span>
        </h1>

      </section>

      {/* ══ FORM ══ */}
      <section
        ref={formRef}
        style={{
          background: 'transparent',
          padding: '30px clamp(24px, 6vw, 80px) 72px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Radial gold glow — item 6 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(183,110,121,0.06) 0%, transparent 72%)',
          pointerEvents: 'none',
        }}/>

        <div className="lux-contact-panel" style={{ maxWidth: '580px', margin: '0 auto', position: 'relative', boxSizing: 'border-box' }}>

          {/* WhatsApp direct line */}
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: '13px', fontWeight: 300,
            color: 'rgba(44,24,16,0.55)', textAlign: 'center',
            marginBottom: '30px', letterSpacing: '0.3px',
          }}>
            Or reach us directly on{' '}
            <a
              href="https://wa.me/96176510481"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'rgba(183,110,121,1)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(183,110,121,0.35)',
                paddingBottom: '1px',
                transition: 'color 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E8B84B'; e.currentTarget.style.borderColor = '#E8B84B'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(183,110,121,1)'; e.currentTarget.style.borderColor = 'rgba(183,110,121,0.35)'; }}
            >WhatsApp</a>
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: '20px', color: 'rgba(183,110,121,1)', lineHeight: 1.9,
                marginBottom: '8px',
              }}>
                Your message has been sent.
              </p>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: '13px', fontWeight: 300,
                color: 'rgba(44,24,16,0.5)', letterSpacing: '0.3px',
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
                fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300,
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
                className="lux-checkout-btn"
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  width: '100%',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 500,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '20px',
                  background: btnHov ? '#b76e79' : 'transparent',
                  color: btnHov ? '#0d0a07' : '#b76e79',
                  border: '1px solid rgba(183,110,121,0.65)',
                  borderRadius: '1px',
                  cursor: loading ? 'default' : 'pointer',
                  transition: 'all 0.35s ease',
                  opacity: loading ? 0.6 : 1,
                }}
              >{loading ? 'Sending...' : 'Send Message'}</button>
            </div>
          </form>
          )}
        </div>
      </section>

      <FaqSection />

    </div>
  );
};

export default Contact;
