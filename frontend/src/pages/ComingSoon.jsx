import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGate } from "@/context/GateContext";
import { subscribeNewsletter } from "@/lib/api";

const BG_URL =
  "https://static.prod-images.emergentagent.com/jobs/76086d28-fd1d-4395-8afc-d23c04585e99/images/20e38b7c57aec78e48488ecf70811ac99a1ace628f18596f7ec9ea98a088d312.png";

const isSecretLike = (value) => /^[A-Za-z0-9_-]{4,40}$/.test(value);
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { tryUnlock } = useGate();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    // Silent gate: if secret is entered, unlock and redirect.
    if (!value.includes("@") && isSecretLike(value)) {
      if (tryUnlock(value)) {
        navigate("/home");
        return;
      }
    }

    if (!isValidEmail(value)) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setLoading(true);
    try {
      await subscribeNewsletter(value, "coming_soon");
      toast.success("Wir informieren dich, sobald es Neuigkeiten gibt.");
      setEmail("");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Etwas ist schiefgelaufen. Bitte versuche es erneut.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-jewel-base text-jewel-ink flex items-center justify-center"
      data-testid="coming-soon-page"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-jewel-base/80 via-jewel-base/70 to-jewel-base" />
      <div className="absolute inset-0 radial-gold opacity-80" />
      <div className="noise" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl px-6 md:px-10 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="overline"
        >
          Wien · 2027
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25 }}
          className="mt-8 font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.05] text-white"
        >
          Wiener <span className="italic gold-text">Lehrlingsball</span>
          <br />
          <span className="text-white/90">2027</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.6 }}
          className="gold-divider w-40 mx-auto mt-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 text-base sm:text-lg text-jewel-silver max-w-xl mx-auto leading-relaxed font-light"
        >
          Ein Ball. Eine Generation. Ein neues Kapitel.
          <br />
          <span className="text-jewel-muted">
            Wir arbeiten an einem Abend, der Wiens junge Talente ins Rampenlicht stellt.
          </span>
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95 }}
          onSubmit={handleSubmit}
          className="mt-14 mx-auto max-w-md"
          data-testid="coming-soon-form"
        >
          <label
            htmlFor="cs-email"
            className="block text-[10px] uppercase tracking-[0.32em] text-jewel-gold mb-4"
          >
            Bleib informiert
          </label>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:border sm:border-white/15 sm:hover:border-jewel-gold/40 transition-colors duration-500">
            <input
              id="cs-email"
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.at"
              data-testid="coming-soon-email-input"
              className="flex-1 bg-transparent border border-white/15 sm:border-0 px-5 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-jewel-gold/50"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="coming-soon-submit"
              className="bg-jewel-gold text-jewel-base hover:bg-white hover:text-jewel-base transition-colors duration-500 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-medium disabled:opacity-60"
            >
              {loading ? "Senden…" : "Informiert mich"}
            </button>
          </div>
          <p className="mt-5 text-[11px] text-white/40 tracking-wide">
            Mit deiner Anmeldung erhältst du exklusive Updates zum Ball 2027.
          </p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-24 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.32em] text-white/40"
        >
          <span>Coming Soon</span>
          <span className="w-6 h-px bg-white/20" />
          <span>Wien · Österreich</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
