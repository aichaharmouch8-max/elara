import { useState } from 'react';

const SocialBtn = ({ href, label, children }) => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '38px', height: '38px', borderRadius: '50%',
        border: `1px solid ${hov ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.35)'}`,
        color: hov ? 'rgba(200,160,60,1)' : 'rgba(200,160,60,0.7)',
        boxShadow: hov ? '0 0 12px rgba(200,160,60,0.4)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer style={{ background: 'transparent', margin: 0, padding: 0 }}>

      <div
        className="footer-lux-inner"
        style={{
          maxWidth: '860px', margin: '0 auto',
          padding: '48px 40px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
        }}
      >

        {/* Logo */}
        <div style={{ marginBottom: '10px' }}>
          <span
            className="footer-lux-brand"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: 300,
              letterSpacing: '10px',
              textTransform: 'uppercase',
            }}
          >
            ELARA
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic', fontSize: '13px',
          color: 'rgba(200,160,60,0.7)', letterSpacing: '3px',
          marginBottom: '20px',
        }}>The Art of Scent</p>



        {/* Social icons — Instagram, WhatsApp, TikTok */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
          <SocialBtn href="/" label="Instagram">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
          </SocialBtn>
          <SocialBtn href="https://wa.me/96176510481" label="WhatsApp">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </SocialBtn>
          <SocialBtn href="/" label="TikTok">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </SocialBtn>
        </div>

        {/* Gold separator */}
        <div style={{
          width: '100%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.24), transparent)',
          marginBottom: '16px',
        }}/>

        {/* Copyright */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontSize: '9px', fontWeight: 300,
          letterSpacing: '2px', color: 'rgba(250,246,239,0.16)',
        }}>
          © 2026 ELARA. All rights reserved.
        </p>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.12), transparent)' }}/>
    </footer>
  );
};

export default Footer;
