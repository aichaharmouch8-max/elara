import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { CartContext } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import AgentChatWidget from './components/AgentChatWidget';


function App() {
  const [cart, setCart] = useState([]);

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
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
