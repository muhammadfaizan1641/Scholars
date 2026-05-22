import { useState, useEffect } from "react";
import AddStudentDialog from "./AddStudentDialog";
import LimitPopup from "../LimitPopup";

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    padding: "32px 24px",
    maxWidth: "840px",
    margin: "0 auto",
  },
  pageHeader: {
    marginBottom: "22px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f0f0f",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.5px",
  },
  planPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.4px",
  },
  planCard: {
    border: "1px solid #ebebeb",
    borderRadius: "14px",
    padding: "18px 20px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  proHero: {
    background: "#0f172a",
    borderColor: "#1e293b",
    boxShadow: "0 18px 50px rgba(15,23,42,0.22)",
  },
  planTitle: {
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 4px",
    color: "#0f0f0f",
  },
  planText: {
    fontSize: "13px",
    margin: 0,
    color: "#666",
    lineHeight: 1.55,
  },
  planButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#0f0f0f",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  proToolStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "18px",
  },
  proTool: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    color: "#dbeafe",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  proToolLabel: {
    fontSize: "10px",
    color: "#93c5fd",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'DM Mono', monospace",
    marginBottom: "5px",
  },
  proToolValue: {
    fontSize: "14px",
    fontWeight: "700",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: "12px",
    padding: "18px 20px",
  },
  statLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'DM Mono', monospace",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f0f0f",
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  statAccent: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    marginLeft: "8px",
    verticalAlign: "middle",
    marginBottom: "3px",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px",
  },
  section: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: "12px",
    padding: "20px 24px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 14px",
    fontFamily: "'DM Mono', monospace",
  },
  listRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f4f4f4",
    fontSize: "14px",
    color: "#333",
  },
  listRowLast: {
    borderBottom: "none",
  },
  listBadge: {
    background: "#f4f4f4",
    color: "#555",
    fontSize: "12px",
    fontWeight: "600",
    padding: "3px 10px",
    borderRadius: "20px",
    fontFamily: "'DM Mono', monospace",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "4px",
  },
  primaryBtn: {
    flex: 1,
    padding: "12px 20px",
    background: "#0f0f0f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "'DM Sans', sans-serif",
  },
  secondaryBtn: {
    flex: 1,
    padding: "12px 20px",
    background: "#fff",
    color: "#0f0f0f",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "'DM Sans', sans-serif",
  },
};

const defaultPlanInfo = {
  plan: "free",
  status: "free",
  isProActive: false,
  renewalRequired: false,
  startedAt: null,
  expiresAt: null,
  daysRemaining: 0,
  freeStudentLimit: 2,
};

function formatDate(date) {
  if (!date) return "Not active";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PlanStatusCard({ planInfo, totalStudents, onUpgrade }) {
  const isPro = planInfo.isProActive;
  const isExpired = planInfo.status === "expired";
  const freeLimit = planInfo.freeStudentLimit || 2;

  const cardTone = isPro
    ? styles.proHero
    : isExpired
      ? { background: "#fff5f5", borderColor: "#f5c0c0" }
      : { background: "#f9f9ff", borderColor: "#e0ddff" };

  const pillTone = isPro
    ? { background: "#38bdf8", color: "#082f49" }
    : isExpired
      ? { background: "#fee2e2", color: "#991b1b" }
      : { background: "#ede9fe", color: "#5b21b6" };

  const title = isPro
    ? "Pro Dashboard Unlocked"
    : isExpired
      ? "Pro plan expired"
      : "Free dashboard";

  const description = isPro
    ? `Unlimited students enabled. Your Pro plan expires on ${formatDate(planInfo.expiresAt)} (${planInfo.daysRemaining} day${planInfo.daysRemaining === 1 ? "" : "s"} left).`
    : isExpired
      ? "Your 30-day Pro access has ended. Renew to unlock unlimited students again."
      : `${totalStudents}/${freeLimit} free student slots used. Upgrade to Pro for unlimited students and reports.`;

  return (
    <div style={{ ...styles.planCard, ...cardTone }} className="dashboard-plan-card">
      <div>
        <div style={{ ...styles.planPill, ...pillTone }}>
          {isPro ? "PRO ACTIVE" : isExpired ? "RENEWAL DUE" : "FREE"}
        </div>
        <h2
          style={{
            ...styles.planTitle,
            marginTop: "12px",
            color: isPro ? "#ffffff" : "#0f0f0f",
            fontSize: isPro ? "19px" : "15px",
          }}
        >
          {title}
        </h2>
        <p style={{ ...styles.planText, color: isPro ? "#cbd5e1" : "#666" }}>{description}</p>
      </div>
      {!isPro && (
        <button style={styles.planButton} onClick={onUpgrade}>
          {isExpired ? "Renew Pro" : "Upgrade Pro"}
        </button>
      )}
    </div>
  );
}

export default function DashboardCard() {
  const [open, setOpen] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalFees: 0,
    pendingFees: 0,
    classData: [],
    teacherData: [],
    planInfo: defaultPlanInfo,
  });

  const downloadPDF = () => {
    const token = localStorage.getItem("token");
    window.open(`https://scholars-b7nh.onrender.com/api/students/download-pdf?token=${token}`, "_blank");
  };

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://scholars-b7nh.onrender.com/api/students/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const formattedClassData = Object.keys(data.classWiseStudents || {}).map((cls) => ({
        class: cls,
        count: data.classWiseStudents[cls],
      }));

      const formattedTeacherData = Object.keys(data.teacherEarnings || {}).map((teacher) => ({
        teacher,
        earning: data.teacherEarnings[teacher],
      }));

      setDashboardData({
        totalStudents: data.totalStudents || 0,
        totalFees: data.totalFees || 0,
        pendingFees: data.pendingFees || 0,
        classData: formattedClassData,
        teacherData: formattedTeacherData,
        planInfo: data.planInfo || defaultPlanInfo,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const popupMode = dashboardData.planInfo.status === "expired" ? "renew" : "upgrade";
  const isProDashboard = dashboardData.planInfo.isProActive;

  const handlePlanSuccess = async (planInfo) => {
    if (planInfo) {
      setDashboardData((current) => ({
        ...current,
        planInfo: {
          ...current.planInfo,
          ...planInfo,
          renewalRequired: false,
          freeStudentLimit: current.planInfo.freeStudentLimit || 2,
        },
      }));
    }

    await fetchDashboard();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @media (max-width: 720px) {
          .dashboard-page { padding: 22px 14px !important; }
          .dashboard-stats, .dashboard-sections, .pro-tool-strip { grid-template-columns: 1fr !important; }
          .dashboard-actions { flex-direction: column; }
          .dashboard-plan-card { align-items: stretch !important; }
          .dashboard-plan-card button { width: 100%; }
        }
      `}</style>

      <div
        style={{
          ...styles.page,
          maxWidth: isProDashboard ? "960px" : "840px",
        }}
        className="dashboard-page app-page"
      >
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>{isProDashboard ? "Pro Dashboard" : "Dashboard"}</h1>
            <p style={styles.pageSubtitle}>
              {isProDashboard ? "UNLIMITED STUDENT CRM" : "STUDENT OVERVIEW"}
            </p>
          </div>
          <span
            style={{
              ...styles.planPill,
              background: dashboardData.planInfo.isProActive ? "#dcfce7" : "#f4f4f5",
              color: dashboardData.planInfo.isProActive ? "#166534" : "#52525b",
            }}
          >
            {dashboardData.planInfo.isProActive ? "PRO USER" : "FREE USER"}
          </span>
        </div>

        <PlanStatusCard
          planInfo={dashboardData.planInfo}
          totalStudents={dashboardData.totalStudents}
          onUpgrade={() => setShowPlanPopup(true)}
        />

        {isProDashboard && (
          <div style={styles.proToolStrip} className="pro-tool-strip">
            <div style={styles.proTool}>
              <div style={styles.proToolLabel}>Plan Access</div>
              <div style={styles.proToolValue}>Unlimited Students</div>
            </div>
            <div style={styles.proTool}>
              <div style={styles.proToolLabel}>Renewal</div>
              <div style={styles.proToolValue}>
                {dashboardData.planInfo.daysRemaining} day
                {dashboardData.planInfo.daysRemaining === 1 ? "" : "s"} left
              </div>
            </div>
            <div style={styles.proTool}>
              <div style={styles.proToolLabel}>Reports</div>
              <div style={styles.proToolValue}>PDF Export Enabled</div>
            </div>
          </div>
        )}

        <div style={styles.statsGrid} className="dashboard-stats">
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Students</span>
            <span style={styles.statValue}>
              {dashboardData.totalStudents}
              <span style={{ ...styles.statAccent, background: "#6c63ff" }} />
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Fees</span>
            <span style={{ ...styles.statValue, fontSize: "22px" }}>
              Rs.{dashboardData.totalFees.toLocaleString("en-IN")}
            </span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Pending</span>
            <span
              style={{
                ...styles.statValue,
                fontSize: "22px",
                color: dashboardData.pendingFees > 0 ? "#e05252" : "#3aaa6f",
              }}
            >
              Rs.{dashboardData.pendingFees.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div style={styles.sectionGrid} className="dashboard-sections">
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Class-wise Students</p>
            {dashboardData.classData.length === 0 ? (
              <p style={{ color: "#bbb", fontSize: "13px", margin: 0 }}>No data available</p>
            ) : (
              dashboardData.classData.map((cls, i) => (
                <div
                  key={cls.class}
                  style={{
                    ...styles.listRow,
                    ...(i === dashboardData.classData.length - 1 ? styles.listRowLast : {}),
                  }}
                >
                  <span>Class {cls.class}</span>
                  <span style={styles.listBadge}>{cls.count}</span>
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>
              {dashboardData.planInfo.isProActive ? "Pro Earnings View" : "Teacher Earnings"}
            </p>
            {dashboardData.teacherData.length === 0 ? (
              <p style={{ color: "#bbb", fontSize: "13px", margin: 0 }}>No data available</p>
            ) : (
              dashboardData.teacherData.map((t, i) => (
                <div
                  key={t.teacher}
                  style={{
                    ...styles.listRow,
                    ...(i === dashboardData.teacherData.length - 1 ? styles.listRowLast : {}),
                  }}
                >
                  <span>{t.teacher}</span>
                  <span
                    style={{
                      ...styles.listBadge,
                      background: "#f0f9f4",
                      color: "#2d8a5e",
                    }}
                  >
                    Rs.{t.earning.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.actionRow} className="dashboard-actions">
          <button
            style={{
              ...styles.primaryBtn,
              background: hoveredBtn === "add" ? "#2a2a2a" : "#0f0f0f",
            }}
            onMouseEnter={() => setHoveredBtn("add")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => setOpen(true)}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
            Add Student
          </button>
          <button
            style={{
              ...styles.secondaryBtn,
              background: hoveredBtn === "pdf" ? "#f7f7f7" : "#fff",
            }}
            onMouseEnter={() => setHoveredBtn("pdf")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={downloadPDF}
          >
            Download Report
          </button>
        </div>

        <AddStudentDialog
          open={open}
          handleClose={() => setOpen(false)}
          refreshDashboard={fetchDashboard}
        />

        {showPlanPopup && (
          <LimitPopup
            mode={popupMode}
            onClose={() => setShowPlanPopup(false)}
            onUpgradeSuccess={handlePlanSuccess}
          />
        )}
      </div>
    </>
  );
}
