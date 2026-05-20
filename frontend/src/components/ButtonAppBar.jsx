import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TemporaryDrawer from './TemporaryDrawer';

const styles = {
  appBar: {
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    background: '#0f0f0f',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '60px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    transition: 'background 0.2s',
  },
  menuLine: {
    display: 'block',
    width: '20px',
    height: '1.5px',
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '2px',
    transition: 'all 0.3s',
  },
  brandWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoMark: {
    width: '30px',
    height: '30px',
    background: 'linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px',
    fontFamily: "'DM Mono', monospace",
    flexShrink: 0,
  },
  brandName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '-0.2px',
  },
  brandSub: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    display: 'block',
    marginTop: '-1px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loginBtn: {
    padding: '7px 18px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.2px',
    transition: 'all 0.2s',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    background: '#3ecfcf',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
};

export default function ButtonAppBar() {
  useLocation();
  const [open, setOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      <header style={styles.appBar}>
        <div style={styles.toolbar}>
          <div style={styles.left}>
            {isLoggedIn && (
              <button
                style={{
                  ...styles.menuBtn,
                  background: menuHover ? 'rgba(255,255,255,0.07)' : 'none',
                }}
                onMouseEnter={() => setMenuHover(true)}
                onMouseLeave={() => setMenuHover(false)}
                onClick={() => setOpen(!open)}
                aria-label="Open menu"
              >
                <span style={{ ...styles.menuLine }} />
                <span style={{ ...styles.menuLine, width: menuHover ? '14px' : '20px' }} />
                <span style={{ ...styles.menuLine, width: menuHover ? '17px' : '20px' }} />
              </button>
            )}

            <Link to="/" style={{ ...styles.brandWrapper, textDecoration: 'none' }}>
              <div style={styles.logoMark}>S</div>
              <div>
                <span style={styles.brandName}>Scholars</span>
                <span style={styles.brandSub}>Student CRM</span>
              </div>
            </Link>
          </div>

          {/* <div style={styles.right}>
            <div style={styles.statusDot} title="System online" />
            <button
              style={{
                ...styles.loginBtn,
                background: loginHover ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
                borderColor: loginHover ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)',
              }}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
            >
              Login
            </button>
          </div> */}
        </div>
      </header>

      {isLoggedIn && <TemporaryDrawer open={open} setOpen={setOpen} />}
    </>
  );
}
