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

export default Field