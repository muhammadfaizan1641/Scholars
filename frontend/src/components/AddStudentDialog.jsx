import { useState } from "react";
import LimitPopup from "../LimitPopup";
import { useToast } from "./ToastProvider";

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  zIndex: 1300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backdropFilter: 'blur(4px)',
};

const dialog = {
  background: '#fff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  fontFamily: "'DM Sans', sans-serif",
  overflow: 'hidden',
};

const header = {
  padding: '24px 28px 20px',
  borderBottom: '1px solid #f0f0f0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#0f0f0f',
  margin: 0,
  letterSpacing: '-0.3px',
};

const subtitleStyle = {
  fontSize: '12px',
  color: '#aaa',
  marginTop: '3px',
  fontFamily: "'DM Mono', monospace",
  letterSpacing: '0.5px',
};

const closeBtn = {
  background: '#f5f5f5',
  border: 'none',
  borderRadius: '8px',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: '#555',
  flexShrink: 0,
  transition: 'background 0.15s',
};

const body = {
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  maxHeight: '60vh',
  overflowY: 'auto',
};

const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const fieldRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '500',
  color: '#888',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  fontFamily: "'DM Mono', monospace",
};

const errorText = {
  fontSize: '11px',
  color: '#d93025',
  fontFamily: "'DM Mono', monospace",
};

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#0f0f0f',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.15s',
  background: '#fdfdfd',
  width: '100%',
  boxSizing: 'border-box',
};

const footer = {
  padding: '16px 28px 24px',
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end',
};

const cancelBtn = {
  padding: '10px 20px',
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '9px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  color: '#555',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'all 0.15s',
};

const submitBtn = {
  padding: '10px 24px',
  background: '#0f0f0f',
  border: 'none',
  borderRadius: '9px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  color: '#fff',
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: '-0.1px',
  transition: 'all 0.15s',
};

const emptyStudent = {
  name: "",
  mobile: "",
  class: "",
  fees: "",
  joiningDate: "",
  teacherName: "",
  batchTiming: { startTime: "", endTime: "" }
};

const timeOptions = Array.from({ length: 73 }, (_, index) => {
  const totalMinutes = 5 * 60 + index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";
  const label = `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
  return { value, label };
});

function validateStudent(student) {
  const errors = {};
  const name = student.name.trim();
  const mobile = student.mobile.trim();
  const className = student.class.trim();
  const fees = Number(student.fees);
  const teacherName = student.teacherName.trim();
  const { startTime, endTime } = student.batchTiming;

  if (!name) errors.name = "Name required hai.";
  else if (name.length < 2) errors.name = "Name kam se kam 2 letters ka hona chahiye.";
  else if (!/^[a-zA-Z\s.'-]+$/.test(name)) errors.name = "Name me sirf letters use karo.";

  if (!mobile) errors.mobile = "Mobile number required hai.";
  else if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Valid 10 digit Indian mobile number daalo.";

  if (!className) errors.class = "Class required hai.";
  else if (className.length > 20) errors.class = "Class value thodi short rakho.";

  if (!student.fees) errors.fees = "Fees required hai.";
  else if (!Number.isFinite(fees) || fees <= 0) errors.fees = "Fees 0 se zyada honi chahiye.";

  if (!student.joiningDate) errors.joiningDate = "Joining date required hai.";
  else if (new Date(student.joiningDate) > new Date()) errors.joiningDate = "Future joining date allowed nahi hai.";

  if (!teacherName) errors.teacherName = "Teacher name required hai.";
  else if (!/^[a-zA-Z\s.'-]+$/.test(teacherName)) errors.teacherName = "Teacher name me sirf letters use karo.";

  if (!startTime) errors.startTime = "Start time select karo.";
  if (!endTime) errors.endTime = "End time select karo.";
  if (startTime && endTime && startTime >= endTime) {
    errors.endTime = "End time start time ke baad hona chahiye.";
  }

  return errors;
}

export default function AddStudentDialog({ open, handleClose, refreshDashboard }) {
  const showToast = useToast();
  const [student, setStudent] = useState(emptyStudent);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitMode, setLimitMode] = useState("upgrade");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTime" || name === "endTime") {
      setStudent({ ...student, batchTiming: { ...student.batchTiming, [name]: value } });
    } else {
      setStudent({ ...student, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateStudent(student);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showToast("Please student details sahi se fill karo.", "error");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const studentData = {
        name: student.name,
        className: student.class,
        mobile: student.mobile,
        fees: Number(student.fees),
        joiningDate: student.joiningDate,
        teacherName: student.teacherName,
        batchTiming: {
          startTime: student.batchTiming.startTime,
          endTime: student.batchTiming.endTime,
        },
      };

      const response = await fetch("http://localhost:5000/api/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (response.status === 403 && data.upgradeRequired) {
        handleClose();
        setLimitMode(data.renewalRequired ? "renew" : "upgrade");
        setShowLimitPopup(true);
        return;
      }

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        showToast(data.message || "Student add nahi ho paya.", "error");
        return;
      }

      setStudent(emptyStudent);
      setErrors({});
      handleClose();
      showToast("Student added successfully.", "success");
      refreshDashboard?.();

    } catch (error) {
      console.error(error);
      showToast("Server se connect nahi ho paya.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...inputStyle,
    borderColor: errors[name] ? '#d93025' : focusedField === name ? '#6c63ff' : '#e8e8e8',
    boxShadow: errors[name]
      ? '0 0 0 3px rgba(217,48,37,0.08)'
      : focusedField === name
        ? '0 0 0 3px rgba(108,99,255,0.08)'
        : 'none',
  });

  if (!open && !showLimitPopup) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0.4;
          cursor: pointer;
        }
        .scholar-scroll::-webkit-scrollbar { width: 4px; }
        .scholar-scroll::-webkit-scrollbar-track { background: transparent; }
        .scholar-scroll::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }
      `}</style>

      {showLimitPopup && (
        <LimitPopup
          mode={limitMode}
          onClose={() => setShowLimitPopup(false)}
          onUpgradeSuccess={() => {
            setShowLimitPopup(false);
            showToast("Pro plan active ho gaya. Ab unlimited students add kar sakte ho.", "success");
            refreshDashboard?.();
          }}
        />
      )}

      {/* Normal Add Student Dialog */}
      {open && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
          <div style={dialog}>
            <div style={header}>
              <div>
                <h2 style={titleStyle}>Add Student</h2>
                <p style={subtitleStyle}>NEW ENROLLMENT</p>
              </div>
              <button style={closeBtn} onClick={handleClose}>x</button>
            </div>

            <div style={body} className="scholar-scroll">
              <div style={fieldGroup}>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={getInputStyle('name')}
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={student.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.name && <span style={errorText}>{errors.name}</span>}
              </div>

              <div style={fieldRow}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Mobile</label>
                  <input
                    style={getInputStyle('mobile')}
                    name="mobile"
                    placeholder="9876543210"
                    value={student.mobile}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                    onFocus={() => setFocusedField('mobile')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.mobile && <span style={errorText}>{errors.mobile}</span>}
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Class</label>
                  <input
                    style={getInputStyle('class')}
                    name="class"
                    placeholder="e.g. 10"
                    value={student.class}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('class')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.class && <span style={errorText}>{errors.class}</span>}
                </div>
              </div>

              <div style={fieldRow}>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Fees (Rs.)</label>
                  <input
                    style={getInputStyle('fees')}
                    name="fees"
                    type="number"
                    placeholder="0"
                    value={student.fees}
                    onChange={handleChange}
                    min="1"
                    onFocus={() => setFocusedField('fees')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.fees && <span style={errorText}>{errors.fees}</span>}
                </div>
                <div style={fieldGroup}>
                  <label style={labelStyle}>Joining Date</label>
                  <input
                    style={getInputStyle('joiningDate')}
                    name="joiningDate"
                    type="date"
                    value={student.joiningDate}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('joiningDate')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.joiningDate && <span style={errorText}>{errors.joiningDate}</span>}
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Teacher Name</label>
                <input
                  style={getInputStyle('teacherName')}
                  name="teacherName"
                  placeholder="e.g. Rahul Gupta"
                  value={student.teacherName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('teacherName')}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.teacherName && <span style={errorText}>{errors.teacherName}</span>}
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Batch Timing</label>
                <div style={fieldRow}>
                  <select
                    style={getInputStyle('startTime')}
                    name="startTime"
                    value={student.batchTiming.startTime}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('startTime')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">Start time</option>
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                  </select>
                  <select
                    style={getInputStyle('endTime')}
                    name="endTime"
                    value={student.batchTiming.endTime}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('endTime')}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">End time</option>
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                  </select>
                </div>
                {(errors.startTime || errors.endTime) && (
                  <span style={errorText}>{errors.startTime || errors.endTime}</span>
                )}
              </div>
            </div>

            <div style={footer}>
              <button style={cancelBtn} onClick={handleClose}>Cancel</button>
              <button
                style={{ ...submitBtn, opacity: loading ? 0.65 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Student ->'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
