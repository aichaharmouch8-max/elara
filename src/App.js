import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { CartContext } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

import WhatsAppFloat from './components/WhatsAppFloat';

const Shop     = lazy(() => import('./pages/Shop'));
const Contact  = lazy(() => import('./pages/Contact'));
const CartPage = lazy(() => import('./pages/CartPage'));

const PageFallback = () => <div style={{ background: 'transparent', minHeight: '100vh' }} />;

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 1.5,
  delay: Math.random() * 3,
  dur: 3 + Math.random() * 3,
}));

const LoadingScreen = ({ visible }) => (
  <div className="app-loading-screen" style={{
    position: 'fixed', inset: 0, zIndex: 99999,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    transition: 'opacity 0.5s ease',
    overflow: 'clip',
  }}>

    {/* Particle dust */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
      {PARTICLES.map(p => (
        <circle
          key={p.id}
          cx={`${p.x}%`} cy={`${p.y}%`}
          r={p.size}
          fill="#c9a84c"
          style={{
            animation: `particleDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
            opacity: 0,
          }}
        />
      ))}
    </svg>

    {/* Content stack */}
    <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

      {/* Animated line — draws from center outward */}
      <div style={{
        width: '64px', height: '1px', marginBottom: '32px',
        background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
        animation: 'lineGrow 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s both',
        transformOrigin: 'center',
      }} />

      {/* ELARA wordmark */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        fontSize: 'clamp(44px, 10vw, 72px)',
        color: '#c9a84c',
        letterSpacing: '0.35em',
        margin: 0,
        lineHeight: 1,
        textTransform: 'uppercase',
        animation: 'wordmarkIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both',
      }}>Elara</p>

      {/* Tagline */}
      <p style={{
        fontFamily: 'Raleway, sans-serif',
        fontWeight: 300,
        fontSize: '8px',
        letterSpacing: '0.42em',
        color: 'rgba(201,168,76,0.55)',
        textTransform: 'uppercase',
        margin: '22px 0 0',
        animation: 'taglineIn 0.8s ease 1s both',
      }}>The Art of Scent</p>
    </div>

    <style>{`
      @keyframes lineGrow {
        from { transform: scaleX(0); opacity: 0; }
        to   { transform: scaleX(1); opacity: 1; }
      }
      @keyframes wordmarkIn {
        from { opacity: 0; letter-spacing: 0.55em; }
        to   { opacity: 1; letter-spacing: 0.35em; }
      }
      @keyframes taglineIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes particleDrift {
        from { opacity: 0; transform: translateY(0px); }
        to   { opacity: 0.35; transform: translateY(-14px); }
      }
    `}</style>
  </div>
);

const AppShell = () => {
  const { fading } = useLanguage();
  return (
    <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}>
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/shop"    element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart"    element={<CartPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCart(prev => prev.filter(item => item.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty }}>
      <LanguageProvider>
        <LoadingScreen visible={loading} />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </LanguageProvider>
    </CartContext.Provider>
  );
}

export default App;
