import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import AppSnackbar from "../components/common/AppSnackbar";

const STYLE_TAG_ID = "stayboard-login-styles";

const STYLES = `
@property --aurora-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes sb-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sb-card-slide { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes sb-rotate-border { to { --aurora-angle: 360deg; } }
@keyframes sb-spin { to { transform: rotate(360deg); } }

.sb-root {
  min-height: 100vh;
  width: 100%;
  background: #010a03;
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}
.sb-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.sb-left, .sb-right { position: relative; z-index: 3; }
.sb-left { width: 50%; display: flex; flex-direction: column; justify-content: center; padding: 4rem 3rem; }
.sb-right { width: 50%; display: flex; align-items: center; justify-content: center; padding: 2.5rem; }

.sb-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 3.5rem; opacity: 0; animation: sb-up 0.8s 0.2s forwards; }
.sb-logo-txt { font-size: 12px; letter-spacing: 0.3em; color: #69f0ae; font-weight: 600; text-transform: uppercase; }

.sb-hero { font-family: 'Playfair Display', serif; font-size: 70px; line-height: 0.92; color: #e8f5e9; letter-spacing: -2px; }
.sb-hero .it { font-style: italic; color: #69f0ae; }
.sb-hero .outline { -webkit-text-stroke: 1.5px #e8f5e9; color: transparent; }
.sb-h1 { opacity: 0; animation: sb-up 0.9s 0.4s forwards; }
.sb-h2 { opacity: 0; animation: sb-up 0.9s 0.55s forwards; }
.sb-h3 { opacity: 0; animation: sb-up 0.9s 0.7s forwards; }

.sb-sub { margin-top: 1.8rem; font-size: 13px; color: #4caf5080; font-weight: 200; line-height: 1.8; max-width: 260px; opacity: 0; animation: sb-up 0.8s 0.9s forwards; }

.sb-float-cards { display: flex; gap: 10px; margin-top: 2.5rem; opacity: 0; animation: sb-up 0.8s 1.1s forwards; }
.sb-fc { background: rgba(105,240,174,0.05); border: 1px solid #69f0ae20; padding: 12px 16px; flex: 1; position: relative; overflow: hidden; }
.sb-fc::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #69f0ae60, transparent); }
.sb-fc-val { font-family: 'Playfair Display', serif; font-size: 26px; color: #69f0ae; line-height: 1; }
.sb-fc-lbl { font-size: 9px; letter-spacing: 0.15em; color: #2e7d32; text-transform: uppercase; margin-top: 4px; }

.sb-card {
  width: 100%;
  max-width: 480px;
  background: rgba(2,15,4,0.85);
  border: 1px solid #69f0ae15;
  padding: 3rem 2.8rem;
  position: relative;
  opacity: 0;
  animation: sb-card-slide 1s cubic-bezier(0.16,1,0.3,1) 0.5s forwards;
  backdrop-filter: blur(30px);
}
.sb-aurora-border {
  position: absolute; inset: 0;
  background: conic-gradient(from var(--aurora-angle, 0deg), transparent 80%, #69f0ae 90%, transparent 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
  pointer-events: none;
  animation: sb-rotate-border 4s linear infinite;
}

.sb-step-dots { display: flex; gap: 6px; margin-bottom: 1.8rem; }
.sb-dot { width: 6px; height: 6px; border-radius: 50%; background: #1b5e20; }
.sb-dot.active { background: #69f0ae; width: 20px; border-radius: 3px; }

.sb-ch { font-size: 11px; letter-spacing: 0.22em; color: #69f0ae; text-transform: uppercase; margin-bottom: 10px; font-weight: 600; }
.sb-ct { font-family: 'Playfair Display', serif; font-size: 40px; color: #e8f5e9; line-height: 1.1; margin-bottom: 2.4rem; }
.sb-ct em { font-style: italic; color: #69f0ae; }

.sb-field { margin-bottom: 1.5rem; }
.sb-fl { font-size: 11px; letter-spacing: 0.22em; color: #69f0ae; text-transform: uppercase; display: block; margin-bottom: 10px; font-weight: 600; }
.sb-fi {
  display: flex; align-items: center; gap: 14px;
  padding: 4px 18px;
  background: rgba(0,0,0,0.4);
  border-bottom: 1px solid #4caf5080;
  transition: border-color 0.3s;
  position: relative;
}
.sb-fi::after {
  content: ''; position: absolute; bottom: -1px; left: 0; width: 0; height: 2px;
  background: #69f0ae;
  transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
}
.sb-fi:focus-within { border-bottom-color: #69f0ae; }
.sb-fi:focus-within::after { width: 100%; }
.sb-fi .sb-fi-ico {
  color: #69f0ae;
  font-size: 24px;
  flex-shrink: 0;
  transition: color 0.3s, transform 0.3s;
  display: flex;
  background: rgba(105,240,174,0.12);
  padding: 8px;
  border-radius: 8px;
}
.sb-fi:focus-within .sb-fi-ico { color: #b9f6ca; background: rgba(105,240,174,0.22); }
.sb-fi input {
  flex: 1; background: transparent; border: none;
  padding: 18px 0;
  font-family: 'Jost', sans-serif; font-size: 16px;
  color: #e8f5e9; outline: none; caret-color: #69f0ae;
}
.sb-fi input::placeholder { color: #4caf5080; }
.sb-fi input:-webkit-autofill,
.sb-fi input:-webkit-autofill:hover,
.sb-fi input:-webkit-autofill:focus,
.sb-fi input:-webkit-autofill:active {
  -webkit-text-fill-color: #e8f5e9 !important;
  -webkit-box-shadow: 0 0 0 1000px rgba(0,0,0,0.4) inset !important;
  box-shadow: 0 0 0 1000px rgba(0,0,0,0.4) inset !important;
  caret-color: #69f0ae !important;
  transition: background-color 9999s ease-in-out 0s;
}
.sb-fi .sb-eye { cursor: pointer; flex-shrink: 0; color: #4caf50; display: flex; font-size: 22px; padding: 6px; }
.sb-fi .sb-eye:hover { color: #69f0ae; }

.sb-opts { display: flex; justify-content: space-between; align-items: center; margin: 10px 0 1.8rem; }
.sb-tog { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; background: none; border: none; padding: 0; }
.sb-tog-track { width: 28px; height: 15px; background: #0d2e0d; border: 1px solid #1b5e2060; border-radius: 10px; position: relative; transition: background 0.3s, border-color 0.3s; }
.sb-tog-track.on { background: #1b5e20; border-color: #4caf50; }
.sb-tog-thumb { position: absolute; top: 2px; left: 2px; width: 9px; height: 9px; border-radius: 50%; background: #2e7d32; transition: all 0.3s; }
.sb-tog-track.on .sb-tog-thumb { left: 15px; background: #69f0ae; }
.sb-tog-lbl { font-size: 11px; color: #388e3c; }
.sb-fgt { font-size: 11px; color: #2e7d32; text-decoration: none; background: none; border: none; cursor: pointer; padding: 0; font-family: 'Jost', sans-serif; }
.sb-fgt:hover { color: #69f0ae; }

.sb-btn {
  width: 100%; padding: 18px; border: none; cursor: pointer;
  background: transparent; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  color: #e8f5e9; font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase;
}
.sb-btn:disabled { cursor: not-allowed; opacity: 0.7; }
.sb-btn-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #1b5e20, #2e7d32, #1b5e20);
  background-size: 200%;
  transition: background-position 0.5s;
}
.sb-btn:hover:not(:disabled) .sb-btn-bg { background-position: right center; }
.sb-btn-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(105,240,174,0.25) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0s;
}
.sb-btn:hover:not(:disabled) .sb-btn-shimmer { transform: translateX(100%); transition: transform 0.5s; }
.sb-btn-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
.sb-btn:active:not(:disabled) { transform: scale(0.99); }
.sb-btn-spin { animation: sb-spin 0.8s linear infinite; display: flex; }

.sb-sep { display: flex; align-items: center; gap: 10px; margin: 1.2rem 0; }
.sb-sep hr { flex: 1; border: none; border-top: 1px solid #1b5e2025; }
.sb-sep span { font-size: 9px; color: #1b5e20; letter-spacing: 0.12em; }

.sb-btn2 {
  width: 100%; padding: 12px; background: transparent; color: #4caf50;
  border: 1px solid #1b5e2040;
  font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;
}
.sb-btn2:hover { border-color: #4caf50; color: #69f0ae; background: rgba(105,240,174,0.03); }

.sb-badges { display: flex; gap: 8px; margin-top: 1.4rem; justify-content: center; flex-wrap: wrap; }
.sb-badge { font-size: 9px; letter-spacing: 0.1em; color: #2e7d32; display: flex; align-items: center; gap: 4px; }
.sb-badge::before { content: '\\2726'; font-size: 7px; color: #4caf50; }

.sb-mode {
  position: absolute; top: 16px; right: 16px; z-index: 4;
  color: #69f0ae;
  border: 1px solid #69f0ae40;
  border-radius: 8px;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
}
.sb-mode:hover { background: rgba(105,240,174,0.08); border-color: #69f0ae; }

@media (max-width: 960px) {
  .sb-root { flex-direction: column; }
  .sb-left, .sb-right { width: 100%; }
  .sb-left { padding: 3rem 2rem 1rem; }
  .sb-right { padding: 2rem; }
  .sb-hero { font-size: 50px; }
  .sb-logo-row { margin-bottom: 1.5rem; }
}
`;

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_TAG_ID;
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

function useCountUp(target, suffix, duration, delay) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const timer = setTimeout(() => {
      const startTs = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - startTs) / duration);
        setVal(Math.floor(target * t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return `${val}${suffix}`;
}

function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const waves = Array.from({ length: 5 }, (_, i) => ({
      y: canvas.height * (0.2 + i * 0.15),
      spd: 0.3 + i * 0.1,
      amp: 30 + i * 15,
      phase: (i * Math.PI) / 2.5,
      hue: 120 + i * 15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waves.forEach((w) => {
        const grd = ctx.createLinearGradient(0, w.y - w.amp, 0, w.y + w.amp + 60);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(0.4, `hsla(${w.hue}, 80%, 35%, 0.12)`);
        grd.addColorStop(0.6, `hsla(${w.hue}, 90%, 50%, 0.08)`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            w.y +
            Math.sin(x * 0.008 + t * w.spd + w.phase) * w.amp +
            Math.sin(x * 0.02 + t * 0.5) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();
      });
      t += 0.015;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      resize();
      waves.forEach((w, i) => {
        w.y = canvas.height * (0.2 + i * 0.15);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="sb-canvas" />;
}

const LoginPage = ({ mode, onToggleMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle"); // idle | loading | success
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  useEffect(() => {
    ensureStyles();
  }, []);

  const hotelsLive = useCountUp(12000, "+", 1400, 700);
  const bookings = useCountUp(847, "", 1200, 700);
  const countries = useCountUp(47, "+", 1000, 700);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitState("loading");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(
        "https://user.hotelswitchboard.com/api/v1/Login/getclientuserlogindetails",
        formData
      );

      if (String(response?.data?.status_code) === "1") {
        try {
          localStorage.setItem("hotelPms.auth", JSON.stringify(response.data));
        } catch (storageError) {
          console.error("Failed to persist auth response:", storageError);
        }
        setSubmitState("success");
        setTimeout(() => navigate("/onboarding"), 600);
        return;
      }

      setSnackbarMessage(response?.data?.message || "Invalid username or password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitState("idle");
      setSubmitting(false);
    } catch (error) {
      console.error("Login API error:", error);
      setSnackbarMessage("Unable to login. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitState("idle");
      setSubmitting(false);
    }
  };

  return (
    <Box className="sb-root">
      <AuroraCanvas />

      <IconButton
        onClick={onToggleMode}
        aria-label="Toggle light or dark mode"
        className="sb-mode"
        size="small"
      >
        {mode === "light" ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
      </IconButton>

      <div className="sb-left">
        <div className="sb-logo-row">
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 36 36" width="36" height="36">
              <polygon
                points="18,2 34,10 34,26 18,34 2,26 2,10"
                fill="none"
                stroke="#69f0ae"
                strokeWidth="1.5"
              />
              <polygon
                points="18,8 28,13 28,23 18,28 8,23 8,13"
                fill="#69f0ae15"
                stroke="#4caf5060"
                strokeWidth="0.5"
              />
              <text x="18" y="22" textAnchor="middle" fill="#69f0ae" fontSize="10" fontFamily="serif">
                S
              </text>
            </svg>
          </div>
          <div className="sb-logo-txt">Smart Onboarding</div>
        </div>

        <div className="sb-hero">
          <div className="sb-h1">
            Manage <span className="it">Everything</span>
          </div>
          <div className="sb-h2">
            <span className="outline">Effortlessly</span>
          </div>
        </div>

        <p className="sb-sub">
          Elevate every stay. Manage every detail. One elegant platform built for world-class hospitality.
        </p>

        <div className="sb-float-cards">
          <div className="sb-fc">
            <div className="sb-fc-val">{hotelsLive}</div>
            <div className="sb-fc-lbl">Hotels live</div>
          </div>
          <div className="sb-fc">
            <div className="sb-fc-val">{bookings}</div>
            <div className="sb-fc-lbl">Bookings/hr</div>
          </div>
          <div className="sb-fc">
            <div className="sb-fc-val">{countries}</div>
            <div className="sb-fc-lbl">Countries</div>
          </div>
        </div>
      </div>

      <div className="sb-right">
        <form className="sb-card" onSubmit={handleSubmit} noValidate>
          <div className="sb-aurora-border" />

          <div className="sb-step-dots">
            <div className="sb-dot active" />
            <div className="sb-dot" />
            <div className="sb-dot" />
          </div>

          <div className="sb-ch">Property Access Portal</div>
          <div className="sb-ct">
            Run Your Hotel Your <em>Way.</em>
          </div>

          <div className="sb-field">
            <span className="sb-fl">Email</span>
            <div className="sb-fi">
              <span className="sb-fi-ico">
                <MailOutlineIcon fontSize="inherit" />
              </span>
              <input
                type="email"
                placeholder="you@property.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="sb-field">
            <span className="sb-fl">Password</span>
            <div className="sb-fi">
              <span className="sb-fi-ico">
                <LockOutlinedIcon fontSize="inherit" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <span
                className="sb-eye"
                role="button"
                tabIndex={0}
                onClick={() => setShowPassword((s) => !s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword((s) => !s);
                  }
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </span>
            </div>
          </div>

          <button type="submit" className="sb-btn" disabled={submitting} style={{ marginTop: "1rem" }}>
            <div className="sb-btn-bg" />
            <div className="sb-btn-shimmer" />
            <span className="sb-btn-content">
              <span>
                {submitState === "loading"
                  ? "Verifying..."
                  : submitState === "success"
                  ? "Welcome back!"
                  : "Enter Dashboard"}
              </span>
              {submitState === "loading" ? (
                <span className="sb-btn-spin">
                  <AutorenewIcon fontSize="small" />
                </span>
              ) : submitState === "success" ? (
                <CheckIcon fontSize="small" />
              ) : (
                <ArrowOutwardIcon fontSize="small" />
              )}
            </span>
          </button>
        </form>
      </div>

      <AppSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default LoginPage;
