import { useState } from "react";
import "./AdminAuth.css";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import PreviewPanel from "./components/PreviewPanel";

export default function AdminAuth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-card">
          <div className="auth-brand rounded-2">
            <div className="admin-logo-img">
             <img src="/icons/poloLogo.jpg" className="w-100 h-100 rounded-2 object-fit-contain" alt="" />
            </div>

            <div className="w-100">
              <div className="auth-brand-name text-wrap fs-sm-5 fs-1 mb-1 text-uppercase">Ralph <span className="rounded-2 px-2">Lauren</span></div>
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