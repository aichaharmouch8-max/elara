import { useState } from 'react';
import { AgentChat, createAgentChat } from "@21st-sdk/react";
import { useChat } from "@ai-sdk/react";
import theme from "../theme.json";

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "http://localhost:3001/api/an-token",
});

const ChatPanel = ({ onClose }) => {
  const { messages, input, handleInputChange, handleSubmit, status, stop, error } =
    useChat({ chat });

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      width: '380px',
      height: '560px',
      zIndex: 9999,
      border: '1px solid rgba(200,150,42,0.25)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(200,150,42,0.06)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: '#0e0800',
        borderBottom: '1px solid rgba(200,150,42,0.15)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontSize: '8px',
            letterSpacing: '4px',
            color: '#C8962A',
            textTransform: 'uppercase',
            marginBottom: '3px',
          }}>ELARA</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '15px',
            fontWeight: 300,
            color: '#FAF6EF',
          }}>Fragrance Advisor</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(200,150,42,0.5)',
            fontSize: '18px',
            lineHeight: 1,
            padding: '4px',
            fontFamily: 'inherit',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C8962A'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,150,42,0.5)'}
        >×</button>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflow: 'hidden', background: '#120c02' }}>
        <AgentChat
          messages={messages}
          input={input}
          onInputChange={handleInputChange}
          onSend={() => handleSubmit()}
          status={status}
          onStop={stop}
          error={error ?? undefined}
          theme={theme}
          colorScheme="dark"
        />
      </div>
    </div>
  );
};

export default function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: hov ? '#E8B84B' : '#C8962A',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hov
            ? '0 8px 32px rgba(200,150,42,0.45)'
            : '0 4px 20px rgba(200,150,42,0.25)',
          transition: 'all 0.3s ease',
          transform: hov ? 'scale(1.08)' : 'scale(1)',
        }}
        aria-label="Open fragrance advisor"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a0f00" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}
