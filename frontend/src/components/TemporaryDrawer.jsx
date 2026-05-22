import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    text: "All Students",
    path: "/students",
    icon: "👥",
    desc: "View all enrollments",
  },
  {
    text: "Pending Fees",
    path: "/pending",
    icon: "!",
    desc: "Outstanding payments",
  },
];

const S = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 1200,
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100dvh',
    maxHeight: '100dvh',
    width: 'min(280px, 88vw)',
    background: '#0f0f0f',
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '4px 0 32px rgba(0,0,0,0.3)',
  },
  drawerHeader: {
    padding: '24px 22px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoMark: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.5px',
    fontFamily: "'DM Mono', monospace",
    flexShrink: 0,
  },
  brandName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  brandSub: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    display: 'block',
    marginTop: '-1px',
  },
  nav: {
    flex: 1,
    padding: '20px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
    minHeight: 0,
  },
  navLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
    padding: '0 8px',
    marginBottom: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 12px',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  navItemDefault: {
    background: 'transparent',
  },
  navItemActive: {
    background: 'rgba(108,99,255,0.18)',
  },
  navItemHover: {
    background: 'rgba(255,255,255,0.06)',
  },
  navIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  navText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.1px',
  },
  navDesc: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
    margin: 0,
    fontFamily: "'DM Mono', monospace",
  },
  drawerFooter: {
    padding: '16px 14px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
    background: '#0f0f0f',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
  },
  footerText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.2)',
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.5px',
    margin: 0,
    padding: '0 8px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 12px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(224,82,82,0.08)',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.15s',
    textAlign: 'left',
  },
  logoutIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    background: 'rgba(224,82,82,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  logoutText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ff8080',
    margin: 0,
    letterSpacing: '-0.1px',
  },
  logoutDesc: {
    fontSize: '11px',
    color: 'rgba(255,128,128,0.45)',
    margin: 0,
    fontFamily: "'DM Mono', monospace",
  },
};

const iconBg = {
  '/students': 'rgba(108,99,255,0.2)',
  '/pending': 'rgba(224,82,82,0.2)',
};

const iconColor = {
  '/students': '#a09bff',
  '/pending': '#ff8080',
};

export default function TemporaryDrawer({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');

    setOpen(false);

    navigate('/login');
  };

  if (!open) return null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={S.backdrop} onClick={() => setOpen(false)} />

      <aside style={S.drawer}>
        {/* Header */}
        <Link
          to="/"
          style={{ ...S.drawerHeader, textDecoration: 'none', cursor: 'pointer' }}
          onClick={() => setOpen(false)}
        >
          <div style={S.logoMark}>S</div>
          <div>
            <span style={S.brandName}>Scholars</span>
            <span style={S.brandSub}>Student CRM</span>
          </div>
        </Link>

        {/* Nav */}
        <nav style={S.nav}>
          <p style={S.navLabel}>Navigation</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hovered === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...S.navItem,
                  ...(isActive ? S.navItemActive : isHovered ? S.navItemHover : S.navItemDefault),
                  borderLeft: isActive ? '2px solid #6c63ff' : '2px solid transparent',
                }}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setOpen(false)}
              >
                <div style={{
                  ...S.navIcon,
                  background: isActive ? iconBg[item.path] : 'rgba(255,255,255,0.06)',
                  color: isActive ? iconColor[item.path] : 'rgba(255,255,255,0.5)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{
                    ...S.navText,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontWeight: isActive ? '600' : '500',
                  }}>
                    {item.text}
                  </p>
                  <p style={S.navDesc}>{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={S.drawerFooter}>
          {/* Logout Button */}
          <button
            style={{
              ...S.logoutBtn,
              background: logoutHovered
                ? 'rgba(224,82,82,0.16)'
                : 'rgba(224,82,82,0.08)',
            }}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            onClick={handleLogout}
          >
            <div style={S.logoutIcon}>🚪</div>
            <div>
              <p style={S.logoutText}>Logout</p>
            </div>
          </button>

          <p style={S.footerText}>SCHOLARS CRM v1.0</p>
        </div>
      </aside>
    </>
  );
}
