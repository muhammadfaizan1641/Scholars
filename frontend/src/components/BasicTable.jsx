import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    padding: '28px 24px',
  },
  pageHeader: {
    marginBottom: '24px',
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
  filterRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
  },
  filterWrap: {
    position: 'relative',
  },
  filterIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#bbb',
    fontSize: '15px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 14px 10px 34px',
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
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e8e8e8',
    borderRadius: '9px',
    fontSize: '13px',
    color: '#333',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    background: '#fdfdfd',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: 'pointer',
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
  thead: {
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
  },
  th: {
    padding: '11px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '500',
    color: '#aaa',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
    whiteSpace: 'nowrap',
  },
  thRight: {
    textAlign: 'right',
  },
  tr: {
    borderBottom: '1px solid #f5f5f5',
    transition: 'background 0.12s',
  },
  td: {
    padding: '13px 16px',
    fontSize: '13.5px',
    color: '#333',
    verticalAlign: 'middle',
  },
  tdRight: {
    textAlign: 'right',
  },
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
    background: 'linear-gradient(135deg, #6c63ff22, #3ecfcf22)',
    border: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#6c63ff',
    flexShrink: 0,
    letterSpacing: '-0.3px',
  },
  nameText: {
    fontWeight: '600',
    color: '#1a1a2e',
    fontSize: '13.5px',
  },
  badge: {
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
    background: '#f0f9f4',
    color: '#2d8a5e',
  },
  batchBadge: {
    display: 'inline-block',
    padding: '2px 9px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    fontFamily: "'DM Mono', monospace",
    background: '#f2f1ff',
    color: '#5a52cc',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#bbb',
    fontSize: '14px',
  },
  countBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    background: '#f0f0f0',
    color: '#777',
    borderRadius: '20px',
    fontSize: '12px',
    fontFamily: "'DM Mono', monospace",
    marginLeft: '10px',
    fontWeight: '500',
    verticalAlign: 'middle',
  },
};

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusSearch, setFocusSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/students/",
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
        teacher: student.teacherName,
        batchStart: student.batchTiming?.startTime,
        batchEnd: student.batchTiming?.endTime,
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
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);

  const handleNameClick = (id) => navigate(`/student/${id}`);

  const teachers = [...new Set(rows.map((r) => r.teacher))];
  const batches = [...new Set(rows.map((r) => `${r.batchStart} - ${r.batchEnd}`))];

  const filteredRows = rows.filter((row) => {
    const searchMatch =
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.mobileNumber.includes(search);
    const teacherMatch = teacherFilter === "" || row.teacher === teacherFilter;
    const batchMatch = batchFilter === "" || `${row.batchStart} - ${row.batchEnd}` === batchFilter;
    return searchMatch && teacherMatch && batchMatch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .sch-input:focus { border-color: #6c63ff !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.08); }
        .sch-tr:hover { background: #fafafa; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>
            Students
            <span style={styles.countBadge}>{filteredRows.length}</span>
          </h1>
          <p style={styles.pageSubtitle}>ALL ENROLLMENTS</p>
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={styles.filterWrap}>
            <span style={styles.filterIcon}>⌕</span>
            <input
              className="sch-input"
              style={{
                ...styles.input,
                borderColor: focusSearch ? '#6c63ff' : '#e8e8e8',
                boxShadow: focusSearch ? '0 0 0 3px rgba(108,99,255,0.08)' : 'none',
              }}
              placeholder="Search by name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocusSearch(true)}
              onBlur={() => setFocusSearch(false)}
            />
          </div>

          <select
            className="sch-input"
            style={styles.select}
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
          >
            <option value="">All Teachers</option>
            {teachers.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>

          <select
            className="sch-input"
            style={styles.select}
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
          >
            <option value="">All Batches</option>
            {batches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Teacher</th>
                <th style={styles.th}>Batch</th>
                <th style={{ ...styles.th, ...styles.thRight }}>Fees</th>
                <th style={styles.th}>Joined</th>
                <th style={{ ...styles.th, ...styles.thRight }}>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.emptyState}>No students found</td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="sch-tr"
                    style={styles.tr}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <div style={styles.nameCell} onClick={() => handleNameClick(row.id)}>
                        <div style={styles.avatar}>{getInitials(row.name)}</div>
                        <span style={{
                          ...styles.nameText,
                          color: hoveredRow === row.id ? '#6c63ff' : '#1a1a2e',
                          textDecoration: hoveredRow === row.id ? 'underline' : 'none',
                        }}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>Cls {row.className}</span>
                    </td>
                    <td style={styles.td}>{row.teacher}</td>
                    <td style={styles.td}>
                      <span style={styles.batchBadge}>{row.batchStart} – {row.batchEnd}</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.tdRight }}>
                      <span style={styles.feesBadge}>Rs.{row.fees?.toLocaleString()}</span>
                    </td>
                    <td style={styles.td}>{row.dateOfJoining}</td>
                    <td style={{ ...styles.td, ...styles.tdRight, fontFamily: "'DM Mono', monospace", fontSize: '12.5px', color: '#777' }}>
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
