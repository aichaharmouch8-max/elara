import { useState } from 'react';

const WhatsAppFloat = () => {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="https://wa.me/96176510481"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="lux-wa-chip"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        background: hov ? 'linear-gradient(145deg,#e4c56a,#b8892e)' : 'linear-gradient(145deg,#d4af37,#a67c29)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        boxShadow: hov
          ? '0 6px 28px rgba(201,164,21,0.5)'
          : '0 4px 20px rgba(201,164,21,0.3)',
        transform: hov ? 'scale(1.05)' : 'scale(1)',
        transition: 'background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        WebkitTapHighlightColor: 'transparent',
        textDecoration: 'none',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <path
          fillRule="evenodd" clipRule="evenodd"
          d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.828 6.5L4 29l7.701-1.809A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22a10.95 10.95 0 01-5.576-1.52l-.4-.238-4.572 1.073 1.103-4.463-.26-.418A10.954 10.954 0 015 15C5 8.925 9.925 4 16 4s11 4.925 11 11-4.925 11-11 11zm6.03-8.14c-.33-.165-1.95-.96-2.253-1.07-.303-.11-.523-.165-.743.165-.22.33-.852 1.07-1.044 1.29-.192.22-.385.247-.715.082-.33-.165-1.393-.513-2.654-1.637-.98-.874-1.642-1.952-1.834-2.282-.192-.33-.02-.508.144-.672.148-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.744-1.793-1.019-2.455-.268-.644-.54-.557-.743-.568l-.632-.011c-.22 0-.578.082-.88.413-.303.33-1.155 1.13-1.155 2.756s1.182 3.196 1.346 3.416c.165.22 2.326 3.553 5.637 4.984.788.34 1.403.543 1.882.695.79.252 1.51.216 2.079.131.634-.094 1.95-.797 2.225-1.567.275-.77.275-1.43.192-1.567-.082-.138-.302-.22-.633-.385z"
          fill="#ffffff"
        />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
