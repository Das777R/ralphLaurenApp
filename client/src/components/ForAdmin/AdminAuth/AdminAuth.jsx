import { useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiShoppingBag,
  FiTrendingUp,
  FiKey,
} from "react-icons/fi";
import api from "../../../api/api";
import "./AdminAuth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

/* ---------- Reusable field ---------- */
function Field({ icon: Icon, label, error, right, ...inputProps }) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={inputProps.id}>
        {label}
      </label>
      <div className={`auth-input-wrap ${error ? "has-error" : ""}`}>
        <Icon className="auth-input-icon" size={16} />
        <input className="auth-input" {...inputProps} />
        {right}
      </div>
      {error && <div className="auth-field-error">{error}</div>}
    </div>
  );
}

function PasswordField({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      icon={FiLock}
      type={show ? "text" : "password"}
      error={error}
      right={
        <button
          type="button"
          className="auth-eye"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      }
      {...props}
    />
  );
}

/* ---------- Login ---------- */
function LoginForm({ defaultEmail, notice, onAuthenticated, onSwitch }) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (loading || !validate()) return;

    try {
      setLoading(true);
      setServerError("");
      // withCredentials lets the browser store the httpOnly refresh cookie
      const res = await api.post(
        "/admin/auth/login",
        { email: email.trim(), password },
        { withCredentials: true }
      );
      const { user, accessToken } = res.data.data;

      // AdminLayout stores the token and does the redirect
      const ok = onAuthenticated?.({ user, accessToken });
      if (ok === false) setServerError("This account does not have admin access.");
    } catch (err) {
      setServerError(getErrMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-sub">Sign in to manage your store.</p>

      {notice && (
        <div className="auth-alert auth-alert-success">
          <FiCheckCircle size={16} /> {notice}
        </div>
      )}
      {serverError && (
        <div className="auth-alert auth-alert-error">
          <FiAlertCircle size={16} /> {serverError}
        </div>
      )}

      <Field
        id="login-email"
        icon={FiMail}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="admin@store.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <PasswordField
        id="login-password"
        label="Password"
        autoComplete="current-password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            Sign in <FiArrowRight size={16} />
          </>
        )}
      </button>

      <p className="auth-switch">
        Need an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitch}>
          Create account
        </button>
      </p>
    </form>
  );
}

/* ---------- Signup ---------- */
function SignupForm({ onCreated, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    if (confirm !== password) e.confirm = "Passwords do not match.";
    if (!inviteCode.trim()) e.inviteCode = "Invite code is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (loading || !validate()) return;

    try {
      setLoading(true);
      setServerError("");
      await api.post("/admin/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        inviteCode: inviteCode.trim(),
      });
      onCreated(email.trim()); // signup returns no token, so send the user to login
    } catch (err) {
      setServerError(getErrMessage(err, "Could not create the account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="auth-title">Create account</h1>
      <p className="auth-sub">Sign up to get started with your admin account.</p>

      {serverError && (
        <div className="auth-alert auth-alert-error">
          <FiAlertCircle size={16} /> {serverError}
        </div>
      )}

      <Field
        id="signup-name"
        icon={FiUser}
        label="Full name"
        autoComplete="name"
        placeholder="Ronald"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <Field
        id="signup-email"
        icon={FiMail}
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="admin@store.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <PasswordField
        id="signup-password"
        label="Password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <PasswordField
        id="signup-confirm"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      <Field
        id="signup-invite"
        icon={FiKey}
        label="Invite code"
        autoComplete="off"
        placeholder="Enter admin invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        error={errors.inviteCode}
      />

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            Create account <FiArrowRight size={16} />
          </>
        )}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="auth-link" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ---------- Right-hand preview panel ---------- */
function PreviewPanel() {
  return (
    <aside className="auth-preview">
      <span className="auth-pill">Marketing &amp; Sales</span>
      <h2 className="auth-preview-title">Run your store from one clean dashboard.</h2>
      <p className="auth-preview-sub">
        Products, orders and customers in one place, with the numbers that matter up front.
      </p>

      <div className="auth-mini-grid">
        <div className="auth-mini-card">
          <div className="auth-mini-label">
            <FiShoppingBag size={14} /> TOTAL ORDER
          </div>
          <div className="auth-mini-value">6,432</div>
          <span className="auth-chip auth-chip-up">
            <FiTrendingUp size={12} /> 12%
          </span>
          <span className="auth-mini-note">vs last month</span>
        </div>

        <div className="auth-mini-card">
          <div className="auth-mini-label">
            <FiTrendingUp size={14} /> TOTAL SALES
          </div>
          <div className="auth-mini-value">₹12.5L</div>
          <span className="auth-chip auth-chip-up">
            <FiTrendingUp size={12} /> 1.8%
          </span>
          <span className="auth-mini-note">vs last month</span>
        </div>
      </div>

      <div className="auth-bars" aria-hidden="true">
        <div style={{ height: "100%" }} className="auth-bar auth-bar-dark" />
        <div style={{ height: "48%" }} className="auth-bar auth-bar-mid" />
        <div style={{ height: "30%" }} className="auth-bar auth-bar-light" />
      </div>
    </aside>
  );
}

/* ---------- Page ---------- */
export default function AdminAuth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">N</div>
            <div>
              <div className="auth-brand-name">Nexadash</div>
              <div className="auth-brand-sub">Marketing &amp; Sales</div>
            </div>
          </div>

          {mode === "login" ? (
            <LoginForm
              defaultEmail={prefillEmail}
              notice={notice}
              onAuthenticated={onAuthenticated}
              onSwitch={() => {
                setNotice("");
                setMode("signup");
              }}
            />
          ) : (
            <SignupForm
              onCreated={(email) => {
                setPrefillEmail(email);
                setNotice("Account created. Sign in to continue.");
                setMode("login");
              }}
              onSwitch={() => setMode("login")}
            />
          )}
        </section>

        <PreviewPanel />
      </div>
    </div>
  );
}