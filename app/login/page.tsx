"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setErr("Identifiants invalides");
      return;
    }
    router.push("/today");
    router.refresh();
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src="/assets/logo-full.png" alt="Atalian" className="login-logo" />
        <div className="pilote-tag" style={{ marginBottom: 18 }}>Pilote Data</div>
        <h1 className="login-h">Connexion</h1>
        <p className="login-sub">Cockpit chef de projet data</p>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {err && <div className="login-err">{err}</div>}
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
