import { useState, useEffect } from "react";
import { useToast } from "./components/ToastProvider";

const RAZORPAY_KEY_ID = "rzp_test_SqOwNrPgKGEEo5";
const PRO_PRICE_INR = 29900;
const API_BASE = "https://scholars-b7nh.onrender.com/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const features = [
  { icon: "All", label: "Unlimited students" },
  { icon: "PDF", label: "Monthly reports" },
  { icon: "Rs", label: "Fees insights" },
  { icon: "Pro", label: "Priority tools" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  @keyframes lpBackdropFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes lpCardRise { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes lpSpin { to { transform: rotate(360deg); } }

  .lp-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 10, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: 24px;
    animation: lpBackdropFade 0.2s ease;
  }

  .lp-card {
    background: #ffffff;
    border: 1px solid #e8e4de;
    border-radius: 18px;
    width: 100%;
    max-width: 420px;
    overflow: hidden;
    animation: lpCardRise 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    font-family: 'DM Sans', sans-serif;
  }

  .lp-top-bar { height: 4px; background: linear-gradient(90deg, #6c63ff, #3ecfcf, #34d399); }
  .lp-body { padding: 28px; }
  .lp-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; gap: 12px; }
  .lp-icon-tile {
    width: 46px;
    height: 46px;
    background: #f2f1ff;
    border: 1px solid #dedbff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #5a52cc;
  }

  .lp-plan-badge {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7280;
    background: #f5f5f4;
    border: 1px solid #e7e5e4;
    border-radius: 20px;
    padding: 4px 11px;
    font-family: 'DM Mono', monospace;
    margin-left: auto;
  }

  .lp-close-btn {
    width: 30px;
    height: 30px;
    background: #f5f5f4;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-heading {
    font-family: 'Instrument Serif', serif;
    font-size: 26px;
    font-weight: 400;
    color: #111827;
    margin: 0 0 8px;
    line-height: 1.2;
  }

  .lp-desc { font-size: 13.5px; color: #6b7280; line-height: 1.65; margin: 0 0 22px; }
  .lp-desc strong { color: #111827; font-weight: 700; }

  .lp-price-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .lp-price-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #9ca3af;
    font-family: 'DM Mono', monospace;
    margin: 0 0 3px;
  }

  .lp-price-amount { font-size: 28px; font-weight: 700; color: #111827; line-height: 1; }
  .lp-price-per { font-size: 12px; color: #9ca3af; font-family: 'DM Mono', monospace; margin-left: 3px; }

  .lp-features { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 22px; }
  .lp-feat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 12px;
    color: #374151;
  }

  .lp-feat-icon {
    min-width: 24px;
    color: #5a52cc;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 700;
  }

  .lp-error {
    font-size: 12px;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 9px 12px;
    margin-bottom: 14px;
    font-family: 'DM Mono', monospace;
  }

  .lp-upgrade-btn, .lp-dismiss-btn {
    width: 100%;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
  }

  .lp-upgrade-btn {
    padding: 14px;
    background: #111827;
    color: #ffffff;
    border: none;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .lp-upgrade-btn:disabled { background: #6b7280; cursor: not-allowed; }
  .lp-dismiss-btn { padding: 12px; background: transparent; color: #6b7280; border: 1px solid #e5e7eb; font-size: 13px; font-weight: 500; }
  .lp-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: lpSpin 0.7s linear infinite; }
  .lp-trust { text-align: center; font-size: 11px; color: #9ca3af; font-family: 'DM Mono', monospace; margin: 16px 0 0; }

  @media (max-width: 520px) {
    .lp-overlay {
      align-items: flex-start;
      padding: 14px;
      overflow-y: auto;
    }

    .lp-card {
      border-radius: 14px;
      max-width: 100%;
    }

    .lp-body {
      padding: 22px 16px;
    }

    .lp-header-row {
      margin-bottom: 18px;
    }

    .lp-heading {
      font-size: 24px;
    }

    .lp-price-card,
    .lp-features {
      grid-template-columns: 1fr;
    }
  }
`;

export default function LimitPopup({
  onClose,
  onUpgradeSuccess,
  mode = "upgrade",
}) {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRenewal = mode === "renew";

  useEffect(() => {
    if (document.getElementById("lp-styles")) return;
    const style = document.createElement("style");
    style.id = "lp-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);

  const handleUpgrade = async () => {
    setError("");
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Razorpay could not be loaded. Please check your connection.");
      setLoading(false);
      return;
    }

    let order;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: PRO_PRICE_INR }),
      });
      if (!res.ok) throw new Error("Failed to create order. Please try again.");
      order = await res.json();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "Scholars Pro",
      description: isRenewal ? "Pro Plan Renewal" : "Pro Plan - Unlimited Students",
      order_id: order.id,
      theme: { color: "#111827" },

      handler: async (response) => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Payment verification failed.");
          showToast(
            isRenewal ? "Pro plan renewed successfully." : "Pro plan activated successfully.",
            "success",
          );
          await onUpgradeSuccess?.(data.planInfo);
          onClose();
        } catch {
          setError("Payment verification failed. Please contact support.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      setError(`Payment failed: ${resp.error.description}`);
    });
    rzp.open();
  };

  return (
    <div className="lp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lp-card">
        <div className="lp-top-bar" />
        <div className="lp-body">
          <div className="lp-header-row">
            <div className="lp-icon-tile">{isRenewal ? "R" : "P"}</div>
            <span className="lp-plan-badge">{isRenewal ? "Renew Pro" : "Free Plan"}</span>
            <button className="lp-close-btn" onClick={onClose} aria-label="Close">x</button>
          </div>

          <h2 className="lp-heading">
            {isRenewal ? "Renew your Pro plan" : "Student limit reached"}
          </h2>
          <p className="lp-desc">
            {isRenewal ? (
              <>
                Your <strong>30-day Pro access</strong> has ended. Renew to keep unlimited students and Pro dashboard tools active.
              </>
            ) : (
              <>
                You've used all <strong>2 students</strong> on your free plan. Upgrade to Pro for unlimited students and advanced tools.
              </>
            )}
          </p>

          <div className="lp-price-card">
            <div>
              <p className="lp-price-label">Pro plan</p>
              <span className="lp-price-amount">Rs.299</span>
              <span className="lp-price-per">/month</span>
            </div>
          </div>

          <div className="lp-features">
            {features.map((f) => (
              <div key={f.label} className="lp-feat-item">
                <span className="lp-feat-icon">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {error && <div className="lp-error">Warning: {error}</div>}

          <button className="lp-upgrade-btn" onClick={handleUpgrade} disabled={loading}>
            {loading ? (
              <>
                <span className="lp-spinner" />
                Processing...
              </>
            ) : (
              `${isRenewal ? "Renew" : "Upgrade"} Pro - Rs.299/mo`
            )}
          </button>

          <button className="lp-dismiss-btn" onClick={onClose}>Maybe later</button>
          <p className="lp-trust">Secure payment via Razorpay</p>
        </div>
      </div>
    </div>
  );
}
