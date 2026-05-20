import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    maxWidth: "420px",
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
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f0f0f",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  subText: {
    fontSize: "13px",
    color: "#999",
    margin: "0 0 28px",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.3px",
  },
  fieldLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "500",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
    fontFamily: "'DM Mono', monospace",
  },
  field: {
    marginBottom: "16px",
  },
  inputWrap: {
    position: "relative",
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
    transition: "border-color 0.15s",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#bbb",
    fontSize: "11px",
    fontFamily: "'DM Mono', monospace",
    width: "38px",
    padding: "0",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  submitBtn: {
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
    marginTop: "8px",
    transition: "background 0.2s",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #fcd4d4",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#c0392b",
    marginBottom: "16px",
    fontFamily: "'DM Mono', monospace",
  },
  switchText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#999",
    marginTop: "20px",
    fontFamily: "'DM Mono', monospace",
  },
  switchLink: {
    color: "#0f0f0f",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    background: "none",
    border: "none",
    fontFamily: "'DM Mono', monospace",
    fontSize: "13px",
    padding: 0,
  },
  divider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "24px 0",
  },
  freePill: {
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
    background: "#3aaa6f",
    display: "inline-block",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState(null);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Email and password are required.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          const params = new URLSearchParams({ email: data.email || email });
          navigate(`/verify-email?${params.toString()}`);
          return;
        }

        return setError(data.message || "Invalid credentials.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Cannot connect to server. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #0f0f0f !important; background: #fff !important; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.card}>

          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>S</div>
            <div style={styles.logoTextWrap}>
              <span style={styles.logoText}>Scholars</span>
              <span style={styles.logoSub}>Student CRM</span>
            </div>
          </div>

          {/* Status pill */}
          <div style={styles.freePill}>
            <span style={styles.dot} />
            Secure Login
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subText}>SIGN IN TO YOUR ACCOUNT</p>

          {/* Error */}
          {error && <div style={styles.errorBox}>Warning: {error}</div>}

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Password</label>
            <div style={styles.inputWrap}>
              <input
                style={{ ...styles.input, paddingRight: "58px" }}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                style={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}
                type="button"
                aria-label="Toggle password visibility"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            style={{
              ...styles.submitBtn,
              background: loading ? "#444" : "#0f0f0f",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={styles.divider} />

          {/* Switch */}
          <p style={styles.switchText}>
            Don't have an account?{" "}
            <button style={styles.switchLink} onClick={() => navigate("/signup")}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
