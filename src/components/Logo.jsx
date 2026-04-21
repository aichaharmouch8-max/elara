import { useState } from 'react';

const Logo = ({ light = true, height = 36 }) => {
  const [err, setErr] = useState(false);

  const textStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    fontWeight: 400,
    letterSpacing: '16px',
    color: light ? '#FAF6EF' : '#1C1510',
    textTransform: 'uppercase',
    display: 'inline-block',
    lineHeight: 1,
  };

  if (err) return <span style={textStyle}>ELARA</span>;

  return (
    <img
      src="/logo.png"
      alt="ELARA"
      height={height}
      style={{ objectFit: 'contain', display: 'block', filter: light ? 'brightness(0) invert(1)' : 'none' }}
      onError={() => setErr(true)}
    />
  );
};

export default Logo;
