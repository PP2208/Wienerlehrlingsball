import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Ticket } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Tickets = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!isValidEmail(v)) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    try {
      await subscribeNewsletter(v, "tickets");
      toast.success("Wir informieren dich, sobald Tickets verfügbar sind.");
      setEmail("");
    } catch {
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="tickets-page" className="min-h-[80vh] flex items-center">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="inline-flex items-center justify-center w-16 h-16 border border-jewel-gold/40"
        >
          <Ticket size={22} className="text-jewel-gold" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="overline mt-10"
        >
          Tickets · In Vorbereitung
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-6 font-serif text-4xl md:text-6xl leading-tight text-white"
        >
          Der Vorhang hebt sich – <span className="italic gold-text">bald</span>.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="gold-divider w-32 mx-auto mt-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-10 text-base md:text-lg text-jewel-silver leading-relaxed max-w-xl mx-auto"
        >
          Ticketkategorien, Preise und Saalplan werden rechtzeitig vor dem Ball
          bekanntgegeben. Hinterlass uns deine E-Mail und erhalte die
          Informationen als Erste*r.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          onSubmit={onSubscribe}
          className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-0 max-w-xl mx-auto"
          data-testid="tickets-form"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.at"
            data-testid="tickets-email"
            className="flex-1 bg-transparent border border-white/15 sm:border-r-0 px-5 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-jewel-gold/60 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="tickets-submit"
            className="bg-jewel-gold text-jewel-base hover:bg-white transition-colors duration-500 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-medium disabled:opacity-60"
          >
            {loading ? "Senden…" : "Benachrichtige mich"}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {[
            { t: "Kategorien", d: "Standard · Premium · Logenplätze" },
            { t: "Eröffnung", d: "Klassischer Walzer-Einzug der Lehrlinge" },
            { t: "Dress Code", d: "Abendgarderobe · Elegant" },
          ].map((c) => (
            <div key={c.t} className="border border-white/10 p-6 hover:border-jewel-gold/40 transition-colors">
              <p className="overline">{c.t}</p>
              <p className="mt-3 text-sm text-white/80">{c.d}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Tickets;
