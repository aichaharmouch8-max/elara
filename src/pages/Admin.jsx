import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const PASS = 'elara2024admin';

const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

// ── Login ─────────────────────────────────────────────────────────────────────

const LoginPage = ({ onAuth }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [hov, setHov] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === PASS) { onAuth(); }
    else { setErr('Incorrect password.'); setPw(''); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0a07',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(36px, 8vw, 56px)', letterSpacing: '0.35em',
        color: '#c9a415', textTransform: 'uppercase', margin: '0 0 8px',
      }}>Elara</p>
      <p style={{
        fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
        letterSpacing: '0.4em', color: 'rgba(201,164,21,0.45)',
        textTransform: 'uppercase', marginBottom: '48px',
      }}>Admin Portal</p>

      <form onSubmit={submit} style={{ width: '100%', maxWidth: '340px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block', fontFamily: "'Montserrat', sans-serif",
            fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase',
            color: 'rgba(201,164,21,0.5)', marginBottom: '8px',
          }}>Password</label>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(''); }}
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(245,238,217,0.03)',
              border: `1px solid ${err ? 'rgba(255,90,70,0.55)' : 'rgba(201,164,21,0.25)'}`,
              color: '#f5eed9', padding: '14px 16px',
              fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 300,
              outline: 'none', borderRadius: '2px',
            }}
          />
          {err && (
            <p style={{
              fontFamily: "'Jost', sans-serif", fontSize: '11px',
              color: 'rgba(255,90,70,0.85)', marginTop: '6px',
            }}>{err}</p>
          )}
        </div>

        <button
          type="submit"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: '100%', padding: '16px 0',
            background: hov ? '#c9a415' : 'transparent',
            color: hov ? '#0d0a07' : '#c9a415',
            border: '1px solid rgba(201,164,21,0.6)',
            fontFamily: "'Montserrat', sans-serif", fontSize: '9px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.3s ease',
            borderRadius: '1px', fontWeight: 500,
          }}
        >Enter</button>
      </form>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const COLS = [
  { key: 'created_at',    label: 'Date',          w: '140px' },
  { key: 'customer_name', label: 'Customer',       w: '140px' },
  { key: 'phone',         label: 'Phone',          w: '120px' },
  { key: 'product',       label: 'Product',        w: '120px' },
  { key: 'edition',       label: 'Edition',        w: '160px' },
  { key: 'price',         label: 'Price',          w: '70px'  },
  { key: 'payment',       label: 'Payment',        w: '120px' },
  { key: 'address',       label: 'Address',        w: '200px' },
  { key: 'gps_location',  label: 'GPS',            w: '60px'  },
];

const Dashboard = ({ orders, loading, lastRefresh, onRefresh, onLogout }) => {
  const [hovRow, setHovRow] = useState(null);
  const [hovLogout, setHovLogout] = useState(false);
  const [hovRefresh, setHovRefresh] = useState(false);

  const cellStyle = (i, isLast) => ({
    padding: '14px 16px',
    borderBottom: isLast ? 'none' : '1px solid rgba(201,164,21,0.06)',
    fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300,
    color: 'rgba(245,238,217,0.75)', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
    maxWidth: COLS[i]?.w,
    background: hovRow === i ? 'rgba(201,164,21,0.04)' : 'transparent',
    transition: 'background 0.2s ease',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a07', color: '#f5eed9' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(201,164,21,0.12)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: '22px', letterSpacing: '0.3em', color: '#c9a415',
          }}>Elara</span>
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
            letterSpacing: '0.35em', color: 'rgba(201,164,21,0.4)', textTransform: 'uppercase',
          }}>Orders</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {lastRefresh && (
            <span style={{
              fontFamily: "'Jost', sans-serif", fontSize: '10px',
              color: 'rgba(201,164,21,0.3)', letterSpacing: '0.5px',
            }}>
              Updated {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            onMouseEnter={() => setHovRefresh(true)}
            onMouseLeave={() => setHovRefresh(false)}
            style={{
              background: 'none', border: '1px solid rgba(201,164,21,0.3)',
              color: hovRefresh ? '#c9a415' : 'rgba(201,164,21,0.5)',
              fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '8px 16px', cursor: loading ? 'default' : 'pointer',
              transition: 'color 0.2s ease, border-color 0.2s ease',
              borderRadius: '1px',
            }}
          >{loading ? 'Loading…' : 'Refresh'}</button>

          <button
            onClick={onLogout}
            onMouseEnter={() => setHovLogout(true)}
            onMouseLeave={() => setHovLogout(false)}
            style={{
              background: hovLogout ? 'rgba(255,90,70,0.1)' : 'none',
              border: '1px solid rgba(255,90,70,0.35)',
              color: 'rgba(255,110,80,0.7)',
              fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '8px 16px', cursor: 'pointer',
              transition: 'all 0.2s ease', borderRadius: '1px',
            }}
          >Logout</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(201,164,21,0.08)' }}>
        <span style={{
          fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 300,
          color: 'rgba(201,164,21,0.55)', letterSpacing: '1px',
        }}>
          {loading ? 'Loading orders…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', padding: '0 32px 48px' }}>
        {!loading && orders.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: '20px', color: 'rgba(201,164,21,0.3)',
          }}>No orders yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px', marginTop: '8px' }}>
            <thead>
              <tr>
                {COLS.map(col => (
                  <th key={col.key} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontFamily: "'Montserrat', sans-serif", fontSize: '7px',
                    letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: 'rgba(201,164,21,0.5)',
                    borderBottom: '1px solid rgba(201,164,21,0.15)',
                    whiteSpace: 'nowrap', width: col.w,
                  }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id ?? i}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{ background: hovRow === i ? 'rgba(201,164,21,0.03)' : 'transparent' }}
                >
                  <td style={cellStyle(0, i === orders.length - 1)}>{fmt(order.created_at)}</td>
                  <td style={{ ...cellStyle(1, i === orders.length - 1), color: '#f5eed9', fontWeight: 400 }}>{order.customer_name || '—'}</td>
                  <td style={cellStyle(2, i === orders.length - 1)}>{order.phone || '—'}</td>
                  <td style={cellStyle(3, i === orders.length - 1)}>{order.product || '—'}</td>
                  <td style={cellStyle(4, i === orders.length - 1)}>{order.edition || '—'}</td>
                  <td style={{ ...cellStyle(5, i === orders.length - 1), color: '#c9a415' }}>${order.price ?? '—'}</td>
                  <td style={cellStyle(6, i === orders.length - 1)}>{order.payment || '—'}</td>
                  <td style={{ ...cellStyle(7, i === orders.length - 1), maxWidth: '200px' }} title={order.address}>{order.address || '—'}</td>
                  <td style={cellStyle(8, i === orders.length - 1)}>
                    {order.gps_location ? (
                      <a
                        href={order.gps_location}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#c9a415', textDecoration: 'none',
                          fontFamily: "'Montserrat', sans-serif", fontSize: '8px',
                          letterSpacing: '0.15em', textTransform: 'uppercase',
                          borderBottom: '1px solid rgba(201,164,21,0.35)',
                          paddingBottom: '1px',
                        }}
                      >Map</a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const Admin = () => {
  const [authed, setAuthed]         = useState(false);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) {
      setOrders(data || []);
      setLastRefresh(new Date());
    } else {
      console.error('Admin fetch error:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [authed, fetchOrders]);

  if (!authed) return <LoginPage onAuth={() => setAuthed(true)} />;

  return (
    <Dashboard
      orders={orders}
      loading={loading}
      lastRefresh={lastRefresh}
      onRefresh={fetchOrders}
      onLogout={() => setAuthed(false)}
    />
  );
};

export default Admin;
