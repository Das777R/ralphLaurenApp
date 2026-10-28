import { useState } from "react";
import Field from "./Field";
import {
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";


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

export default PasswordField