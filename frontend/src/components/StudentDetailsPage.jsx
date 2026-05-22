import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "./ToastProvider";

const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    padding: '32px 24px',
    maxWidth: '760px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#555',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '28px',
    transition: 'all 0.15s',
  },
  profileCard: {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '16px',
  },
  profileTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6c63ff22, #3ecfcf22)',
    border: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#6c63ff',
    letterSpacing: '-0.5px',
    flexShrink: 0,
  },
  studentName: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f0f0f',
    margin: '0 0 4px',
    letterSpacing: '-0.4px',
  },
  classBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    background: '#f2f1ff',
    color: '#5a52cc',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'DM Mono', monospace",
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  infoLabel: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#bbb',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
  },
  infoValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  editInput: {
    padding: '9px 13px',
    border: '1px solid #6c63ff',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0f0f0f',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(108,99,255,0.08)',
    background: '#fdfdfd',
    width: '100%',
    boxSizing: 'border-box',
  },
  editRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btnGreen: {
    padding: '10px 20px',
    background: '#f0f9f4',
    color: '#2d8a5e',
    border: '1px solid #c3e6d4',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  btnPrimary: {
    padding: '10px 20px',
    background: '#0f0f0f',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  btnOutline: {
    padding: '10px 20px',
    background: '#fff',
    color: '#0f0f0f',
    border: '1px solid #e0e0e0',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  btnRed: {
    padding: '10px 20px',
    background: '#fff5f5',
    color: '#c0392b',
    border: '1px solid #f5c0c0',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginLeft: 'auto',
    transition: 'all 0.15s',
  },
  tableCard: {
    background: '#fff',
    border: '1px solid #ebebeb',
    borderRadius: '16px',
    overflow: 'hidden',
    marginTop: '16px',
  },
  tableHeader: {
    padding: '18px 24px 14px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableTitle: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: "'DM Mono', monospace",
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '500',
    color: '#bbb',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '13px 20px',
    fontSize: '13.5px',
    color: '#333',
    borderBottom: '1px solid #f5f5f5',
  },
  paidBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    background: '#f0f9f4',
    color: '#2d8a5e',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Mono', monospace",
  },
  pendingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    background: '#fff5f5',
    color: '#c0392b',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Mono', monospace",
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    color: '#aaa',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    gap: '10px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '20px 0',
  },
};

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', maxWidth: '360px', width: '90%', fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: '15px', color: '#0f0f0f', margin: '0 0 20px', fontWeight: '500' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button style={S.btnOutline} onClick={onCancel}>Cancel</button>
          <button style={{ ...S.btnRed, marginLeft: 0 }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [fees, setFees] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchStudent = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://scholars-b7nh.onrender.com/api/students/details/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setStudent(data);
    setTeacherName(data.teacherName || "");
    setFees(data.fees || "");
    setStartTime(data.batchTiming?.startTime || "");
    setEndTime(data.batchTiming?.endTime || "");

    setLoading(false);

  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

  useEffect(() => { fetchStudent(); }, [id]);

  const collectFees = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://scholars-b7nh.onrender.com/api/students/collect-fees/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  showToast(data.message || "Fees collected successfully.", res.ok ? "success" : "error");
  fetchStudent();
};

const updateStudent = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://scholars-b7nh.onrender.com/api/students/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        teacherName,
        fees,
        batchTiming: {
          startTime,
          endTime,
        },
      }),
    }
  );

  const data = await res.json();

  showToast(data.message || "Student updated successfully.", res.ok ? "success" : "error");

  setEditMode(false);

  fetchStudent();
};

const deleteStudent = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://scholars-b7nh.onrender.com/api/students/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  showToast(data.message || "Student deleted successfully.", res.ok ? "success" : "error");

  navigate("/students");
};

  if (loading) {
    return (
      <div style={S.spinner}>
        <div style={{ width: '18px', height: '18px', border: '2px solid #eee', borderTop: '2px solid #6c63ff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        Loading student...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this student? This action cannot be undone."
          onConfirm={() => { setShowConfirm(false); deleteStudent(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div style={S.page} className="app-page student-details-page">
        <button style={S.backBtn} onClick={() => navigate(-1)}>← Back</button>

        {/* Profile card */}
        <div style={S.profileCard} className="profile-card">
          <div style={S.profileTop} className="profile-top">
            <div style={S.profileLeft} className="profile-left">
              <div style={S.avatar}>{getInitials(student.name)}</div>
              <div>
                <h1 style={S.studentName}>{student.name}</h1>
                <span style={S.classBadge}>Class {student.className}</span>
              </div>
            </div>
          </div>

          <div style={S.infoGrid} className="info-grid">
            {/* Teacher */}
            <div style={S.infoItem}>
              <span style={S.infoLabel}>Teacher</span>
              {editMode ? (
                <input style={S.editInput} value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Teacher name" />
              ) : (
                <span style={S.infoValue}>{student.teacherName}</span>
              )}
            </div>

            {/* Mobile */}
            <div style={S.infoItem}>
              <span style={S.infoLabel}>Mobile</span>
              <span style={{ ...S.infoValue, fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>{student.mobile}</span>
            </div>

            {/* Batch timing */}
            <div style={S.infoItem}>
              <span style={S.infoLabel}>Batch Timing</span>
              {editMode ? (
                <div style={S.editRow} className="edit-row">
                  <input style={S.editInput} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  <input style={S.editInput} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              ) : (
                <span style={{ ...S.infoValue, fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>
                  {student.batchTiming?.startTime} – {student.batchTiming?.endTime}
                </span>
              )}
            </div>

            {/* Joining date */}
            <div style={S.infoItem}>
              <span style={S.infoLabel}>Joined On</span>
              <span style={S.infoValue}>
                {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </span>
            </div>

            {/* Fees */}
            <div style={S.infoItem}>
              <span style={S.infoLabel}>Monthly Fees</span>
              {editMode ? (
                <input style={S.editInput} type="number" value={fees} onChange={e => setFees(e.target.value)} placeholder="Amount" />
              ) : (
                <span style={{ ...S.infoValue, fontSize: '18px', fontWeight: '700', color: '#0f0f0f' }}>Rs.{student.fees?.toLocaleString()}</span>
              )}
            </div>
          </div>

          <hr style={S.divider} />

          {/* Action buttons */}
          <div style={S.actionRow} className="detail-actions">
            <button style={S.btnGreen} onClick={collectFees}>Collect Fees</button>

            {!editMode && (
              <button style={S.btnOutline} onClick={() => setEditMode(true)}>Edit Details</button>
            )}

            {editMode && (
              <>
                <button style={S.btnPrimary} onClick={updateStudent}>Save Changes</button>
                <button style={S.btnOutline} onClick={() => setEditMode(false)}>Cancel</button>
              </>
            )}

            <button style={S.btnRed} onClick={() => setShowConfirm(true)}>Delete Student</button>
          </div>
        </div>

        {/* Fees history */}
        <div style={S.tableCard} className="responsive-table-wrap detail-table-card">
          <div style={S.tableHeader}>
            <p style={S.tableTitle}>Fees History</p>
            <span style={{ fontSize: '12px', color: '#bbb', fontFamily: "'DM Mono', monospace" }}>
              {student.feesHistory?.filter(f => f.paid).length || 0} / {student.feesHistory?.length || 0} paid
            </span>
          </div>
          <table style={S.table} className="responsive-table detail-table">
            <thead>
              <tr>
                <th style={S.th}>Month</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {student.feesHistory?.length > 0 ? (
                student.feesHistory.map((fee, i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, fontWeight: '500' }}>{fee.month}</td>
                    <td style={S.td}>
                      {fee.paid
                        ? <span style={S.paidBadge}>● Paid</span>
                        : <span style={S.pendingBadge}>● Pending</span>}
                    </td>
                    <td style={{ ...S.td, fontFamily: "'DM Mono', monospace", fontSize: '12.5px', color: '#888' }}>
                      {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ ...S.td, textAlign: 'center', color: '#bbb', padding: '36px' }}>No fees record found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
