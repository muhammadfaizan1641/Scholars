const S = {
  card: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '14px',
    padding: '20px',
    maxWidth: '320px',
    margin: '8px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  cardHover: {
    borderColor: '#d0cdff',
    boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6c63ff22, #3ecfcf22)',
    border: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '700',
    color: '#6c63ff',
    letterSpacing: '-0.5px',
    flexShrink: 0,
  },
  name: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f0f0f',
    margin: '0 0 3px',
    letterSpacing: '-0.2px',
  },
  classBadge: {
    display: 'inline-block',
    padding: '2px 9px',
    background: '#f2f1ff',
    color: '#5a52cc',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    fontFamily: "'DM Mono', monospace",
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '0 0 14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#bbb',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
  },
  value: {
    fontSize: '13px',
    color: '#333',
    fontWeight: '500',
  },
  feesValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f0f0f',
    fontFamily: "'DM Mono', monospace",
  },
};

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

import { useState } from "react";

const StudentCard = ({ name, studentClass, fee, mobile, joiningDate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div
        style={{ ...S.card, ...(hovered ? S.cardHover : {}) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={S.top}>
          <div style={S.avatar}>{getInitials(name)}</div>
          <div>
            <p style={S.name}>{name}</p>
            <span style={S.classBadge}>Class {studentClass}</span>
          </div>
        </div>

        <hr style={S.divider} />

        <div style={S.grid}>
          <div style={S.item}>
            <span style={S.label}>Monthly Fee</span>
            <span style={S.feesValue}>Rs.{fee?.toLocaleString()}</span>
          </div>
          <div style={S.item}>
            <span style={S.label}>Mobile</span>
            <span style={{ ...S.value, fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>{mobile}</span>
          </div>
          <div style={{ ...S.item, gridColumn: '1 / -1' }}>
            <span style={S.label}>Joined On</span>
            <span style={S.value}>{joiningDate}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCard;
