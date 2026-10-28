import { Spinner } from "react-bootstrap";
import { useState } from "react";
import {
  FiMail,
  FiUser,
  FiArrowRight,
  FiAlertCircle,

  FiKey,
} from "react-icons/fi";
import api from "../../../../api/api";
import Field from "./Field";
import PasswordField from "./PasswordField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

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

export default SignupForm