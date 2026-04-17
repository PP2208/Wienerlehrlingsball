import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("Bitte alle Felder ausfüllen.");
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Willkommen zurück.");
      navigate("/admin/dashboard");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Anmeldung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-jewel-base text-jewel-ink flex items-center justify-center px-6" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-jewel-gold/40">
            <Lock size={18} className="text-jewel-gold" />
          </div>
          <p className="overline mt-6">Administration</p>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl text-white">
            Wiener Lehrlingsball
          </h1>
          <p className="mt-3 text-sm text-jewel-muted">
            Interner Zugang
          </p>
        </div>

        <form onSubmit={submit} className="mt-12 space-y-8" data-testid="admin-login-form">
          <div className="luxury-underline">
            <label className="block text-[10px] uppercase tracking-[0.32em] text-white/50 mb-3">
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              data-testid="admin-username"
              className="w-full bg-transparent border-0 border-b border-white/20 text-white py-3 focus:outline-none focus:border-jewel-gold transition-colors"
            />
          </div>
          <div className="luxury-underline">
            <label className="block text-[10px] uppercase tracking-[0.32em] text-white/50 mb-3">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              data-testid="admin-password"
              className="w-full bg-transparent border-0 border-b border-white/20 text-white py-3 focus:outline-none focus:border-jewel-gold transition-colors"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              data-testid="admin-submit"
              className="btn-gold w-full justify-center disabled:opacity-60"
            >
              {loading ? "Anmelden…" : "Anmelden"}
            </button>
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.28em] text-white/40 hover:text-white/80 text-center"
            >
              Zurück zur Website
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
