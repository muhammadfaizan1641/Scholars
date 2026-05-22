import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const API_BASE = "https://scholars-b7nh.onrender.com/api";

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: "16px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "440px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoMark: {
    width: "34px",
    height: "34px",
    background: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Mono', monospace",
    fontWeight: "700",
    fontSize: "13px",
    color: "#fff",
    letterSpacing: "-0.5px",
    flexShrink: 0,
  },
  logoTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f0f0f",
    letterSpacing: "-0.3px",
    lineHeight: 1,
  },
  logoSub: {
    fontSize: "10px",
    color: "#aaa",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#f4f4f4",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    color: "#888",
    fontFamily: "'DM Mono', monospace",
    marginBottom: "20px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#6c63ff",
    display: "inline-block",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f0f0f",
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  text: {
    fontSize: "13px",
    color: "#777",
    margin: "0 0 22px",
    lineHeight: 1.6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e4e4e4",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f0f0f",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  otpInput: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #e4e4e4",
    borderRadius: "10px",
    fontSize: "20px",
    color: "#0f0f0f",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
    marginBottom: "12px",
    textAlign: "center",
    letterSpacing: "6px",
    fontWeight: "700",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#0f0f0f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.1px",
  },
  secondaryButton: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#0f0f0f",
    border: "1px solid #e4e4e4",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "10px",
  },
  message: {
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "16px",
    fontFamily: "'DM Mono', monospace",
    wordBreak: "break-word",
  },
};

function messageStyle(type) {
  if (type === "success") {
    return { ...styles.message, background: "#f0faf5", border: "1px solid #b2e4cb", color: "#1e7a4a" };
  }

  if (type === "error") {
    return { ...styles.message, background: "#fff5f5", border: "1px solid #fcd4d4", color: "#c0392b" };
  }

  return { ...styles.message, background: "#f9f9ff", border: "1px solid #e8e6ff", color: "#6c63ff" };
}

export default function VerifyEmail() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get("email") || "";
  const didVerifyToken = useRef(false);
  const isEmailLocked = Boolean(initialEmail);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(token ? "loading" : "idle");
  const [message, setMessage] = useState("");

  const pageCopy = useMemo(() => {
    if (token && status === "success") {
      return {
        pill: "EMAIL VERIFIED",
        heading: "Email verified",
        text: "Your Scholars account is active now. You can sign in and continue.",
      };
    }

    if (token) {
      return {
        pill: "VERIFYING",
        heading: "Verifying your email",
        text: "Please wait while we confirm your email verification link.",
      };
    }

    return {
      pill: "CHECK YOUR INBOX",
      heading: "Verify your email",
      text: "We sent a 6 digit OTP to your email. Enter it here to activate your Scholars account.",
    };
  }, [status, token]);

  useEffect(() => {
    if (!token) return;
    if (didVerifyToken.current) return;
    didVerifyToken.current = true;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Verification failed.");

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Verification link invalid ya expire ho gaya hai.");
      }
    };

    verifyEmail();
  }, [token]);

  const resendVerification = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not resend verification email.");

      setStatus("info");
      setMessage(data.message || "Verification OTP sent.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not resend verification email.");
    }
  };

  const verifyOtp = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed.");

      setStatus("success");
      setMessage(data.message || "Email verified successfully.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "OTP invalid ya expire ho gaya hai.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #0f0f0f !important; background: #fff !important; }
      `}</style>

      <div style={styles.page} className="auth-page">
        <div style={styles.card} className="auth-card verify-card">
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>S</div>
            <div style={styles.logoTextWrap}>
              <span style={styles.logoText}>Scholars</span>
              <span style={styles.logoSub}>Student CRM</span>
            </div>
          </div>

          <div style={styles.pill}>
            <span style={styles.dot} />
            {pageCopy.pill}
          </div>

          <h1 style={styles.heading}>{pageCopy.heading}</h1>
          <p style={styles.text}>{pageCopy.text}</p>

          {status === "loading" && <div style={messageStyle("info")}>Processing...</div>}
          {message && <div style={messageStyle(status === "success" ? "success" : status === "error" ? "error" : "info")}>{message}</div>}

          {!token && (
            <>
              <input
                style={{
                  ...styles.input,
                  color: isEmailLocked ? "#777" : styles.input.color,
                  cursor: isEmailLocked ? "not-allowed" : "text",
                }}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  if (!isEmailLocked) setEmail(e.target.value);
                }}
                readOnly={isEmailLocked}
                aria-readonly={isEmailLocked}
              />
              <input
                style={styles.otpInput}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button
                style={{ ...styles.button, marginBottom: "10px" }}
                onClick={verifyOtp}
                disabled={status === "loading" || otp.length !== 6}
              >
                {status === "loading" ? "Verifying..." : "Verify OTP"}
              </button>
              <button style={styles.button} onClick={resendVerification} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Resend OTP"}
              </button>
            </>
          )}

          <button style={styles.secondaryButton} onClick={() => navigate("/login")}>
            Back to Sign In
          </button>
        </div>
      </div>
    </>
  );
}
