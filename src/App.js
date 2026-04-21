import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartContext } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import AgentChatWidget from './components/AgentChatWidget';
import MobileBottomNav from './components/MobileBottomNav';
import WhatsAppFloat from './components/WhatsAppFloat';


const LoadingScreen = ({ visible }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 99999,
    background: '#1a0f00',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    transition: 'opacity 0.7s ease',
  }}>
    {/* Perfume bottle silhouette */}
    <svg width="48" height="80" viewBox="0 0 48 80" fill="none" style={{ animation: 'loadingFloat 2s ease-in-out infinite' }}>
      <rect x="18" y="0" width="12" height="8" rx="3" fill="rgba(200,160,60,0.4)"/>
      <rect x="14" y="8" width="20" height="6" rx="2" fill="rgba(200,160,60,0.55)"/>
      <rect x="6" y="14" width="36" height="54" rx="8" fill="none" stroke="rgba(200,160,60,0.7)" strokeWidth="1.5"/>
      <rect x="10" y="18" width="28" height="46" rx="6" fill="rgba(200,160,60,0.06)"/>
      <line x1="6" y1="38" x2="42" y2="38" stroke="rgba(200,160,60,0.2)" strokeWidth="1"/>
      <text x="24" y="52" textAnchor="middle" fontFamily="serif" fontSize="9" fill="rgba(200,160,60,0.5)" letterSpacing="2">ELARA</text>
    </svg>
    <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '8px', letterSpacing: '8px', color: 'rgba(200,160,60,0.4)', textTransform: 'uppercase' }}>The Art of Scent</p>
    <style>{`@keyframes loadingFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
  </div>
);

function App() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t); }, []);

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
      <LoadingScreen visible={loading} />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
        <AgentChatWidget />
        <MobileBottomNav />
        <WhatsAppFloat />
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
