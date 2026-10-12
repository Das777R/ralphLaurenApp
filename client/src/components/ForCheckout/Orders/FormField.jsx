function FormField({ label, name, type, placeholder, value, onChange, maxLength }) {
  return (
    <div className="mb-3 mt-4">
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        type={type}
        className="form-control form-address-input"
        id={name}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    </div>
  );
}

export default FormField;