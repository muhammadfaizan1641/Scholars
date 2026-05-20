import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(null);

const tone = {
  success: {
    border: "#bbf7d0",
    bg: "#f0fdf4",
    text: "#166534",
    label: "Success",
  },
  error: {
    border: "#fecaca",
    bg: "#fef2f2",
    text: "#991b1b",
    label: "Error",
  },
  info: {
    border: "#dbeafe",
    bg: "#eff6ff",
    text: "#1e40af",
    label: "Info",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = { id, message, type };

      setToasts((items) => [...items, toast].slice(-4));
      timers.current[id] = setTimeout(() => removeToast(id), 3500);
    },
    [removeToast],
  );

  useEffect(() => {
    const handler = (event) => {
      showToast(event.detail?.message || "", event.detail?.type || "info");
    };

    window.addEventListener("app-toast", handler);
    return () => {
      window.removeEventListener("app-toast", handler);
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 3000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "min(360px, calc(100vw - 36px))",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const colors = tone[toast.type] || tone.info;
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "auto",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                borderRadius: 10,
                padding: "12px 14px",
                boxShadow: "0 16px 40px rgba(15,15,15,0.12)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      fontFamily: "'DM Mono', monospace",
                      marginBottom: 3,
                    }}
                  >
                    {colors.label}
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.45, fontWeight: 600 }}>
                    {toast.message}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: colors.text,
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                    padding: 0,
                  }}
                  aria-label="Close notification"
                >
                  x
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    return (message, type = "info") => {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
    };
  }
  return showToast;
}
