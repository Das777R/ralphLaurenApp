import { Spinner } from "react-bootstrap";
import { useState } from "react";
import {
  FiMail,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../../../../api/api";
import Field from "./Field";
import PasswordField from "./PasswordField";



const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

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

export default LoginForm