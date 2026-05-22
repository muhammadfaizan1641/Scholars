import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    padding: '28px 24px',
  },
  pageHeader: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f0f0f',
    margin: '0 0 2px',
    letterSpacing: '-0.4px',
  },
  pageSubtitle: {
    fontSize: '12px',
    color: '#aaa',
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.8px',
  },
  alertPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    background: '#fff5f5',
    color: '#c0392b',
    border: '1px solid #f5c0c0',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Mono', monospace",
  },
  searchWrap: {
    position: 'relative',
    marginBottom: '20px',
  },
  searchIcon: {
    position: 'absolute',
    left: '13px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#bbb',
    fontSize: '15px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 36px',
    border: '1px solid #e8e8e8',
    borderRadius: '9px',
    fontSize: '13px',
    color: '#333',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    background: '#fdfdfd',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  tableWrap: {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '11px 18px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '500',
    color: '#aaa',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
    whiteSpace: 'nowrap',
  },
  thRight: { textAlign: 'right' },
  td: {
    padding: '13px 18px',
    fontSize: '13.5px',
    color: '#333',
    borderBottom: '1px solid #f5f5f5',
    verticalAlign: 'middle',
  },
  tdRight: { textAlign: 'right' },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: '#fff5f5',
    border: '1px solid #f5c0c0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#c0392b',
    flexShrink: 0,
    letterSpacing: '-0.3px',
  },
  classBadge: {
    display: 'inline-block',
    padding: '2px 9px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'DM Mono', monospace",
    background: '#f5f5f5',
    color: '#666',
  },
  feesBadge: {
    display: 'inline-block',
    padding: '2px 9px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Mono', monospace",
    background: '#fff5f5',
    color: '#c0392b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#bbb',
    fontSize: '14px',
  },
};

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

export default function PendingFeesTable() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusSearch, setFocusSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://scholars-b7nh.onrender.com/api/students/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      const formattedData = data.map((student) => ({
        id: student._id,
        name: student.name,
        className: student.className,
        fees: student.fees,
        dateOfJoining: student.joiningDate
          ? new Date(student.joiningDate).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "-",
        mobileNumber: student.mobile,
      }));

      setRows(formattedData);

    } catch (error) {
      console.error(error);
    }
  };

  fetchStudents();
}, []);

  const handleNameClick = (id) => navigate(`/student/${id}`);

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.className.toLowerCase().includes(search.toLowerCase()) ||
    row.mobileNumber.toString().includes(search)
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={S.page} className="app-page pending-page">
        <div style={S.pageHeader} className="page-header">
          <div>
            <h1 style={S.pageTitle}>Pending Fees</h1>
            <p style={S.pageSubtitle}>OUTSTANDING PAYMENTS</p>
          </div>
          <span style={S.alertPill}>Warning: {filteredRows.length} pending</span>
        </div>

        <div style={S.searchWrap}>
          <span style={S.searchIcon}>⌕</span>
          <input
            style={{
              ...S.searchInput,
              borderColor: focusSearch ? '#e05252' : '#e8e8e8',
              boxShadow: focusSearch ? '0 0 0 3px rgba(224,82,82,0.08)' : 'none',
            }}
            placeholder="Search by name, class or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocusSearch(true)}
            onBlur={() => setFocusSearch(false)}
          />
        </div>

        <div style={S.tableWrap} className="responsive-table-wrap">
          <table style={S.table} className="responsive-table pending-table">
            <thead>
              <tr>
                <th style={S.th}>Student</th>
                <th style={S.th}>Class</th>
                <th style={{ ...S.th, ...S.thRight }}>Fees Due</th>
                <th style={S.th}>Joined</th>
                <th style={{ ...S.th, ...S.thRight }}>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={S.emptyState}>
                    {search ? 'No results found' : '🎉 No pending fees'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ background: hoveredRow === row.id ? '#fafafa' : '#fff' }}
                  >
                    <td style={S.td}>
                      <div style={S.nameCell} onClick={() => handleNameClick(row.id)}>
                        <div style={S.avatar}>{getInitials(row.name)}</div>
                        <span style={{
                          fontWeight: '600',
                          fontSize: '13.5px',
                          color: hoveredRow === row.id ? '#c0392b' : '#1a1a2e',
                          textDecoration: hoveredRow === row.id ? 'underline' : 'none',
                        }}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td style={S.td}>
                      <span style={S.classBadge}>Cls {row.className}</span>
                    </td>
                    <td style={{ ...S.td, ...S.tdRight }}>
                      <span style={S.feesBadge}>Rs.{row.fees?.toLocaleString()}</span>
                    </td>
                    <td style={S.td}>{row.dateOfJoining}</td>
                    <td style={{ ...S.td, ...S.tdRight, fontFamily: "'DM Mono', monospace", fontSize: '12.5px', color: '#888' }}>
                      {row.mobileNumber}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
