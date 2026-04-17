import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, MapPin } from "lucide-react";
import { submitContact } from "@/lib/api";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Kontakt = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Bitte gib deinen Namen an.");
    if (!isValidEmail(form.email)) return toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (!form.message.trim()) return toast.error("Bitte schreibe eine kurze Nachricht.");

    setLoading(true);
    try {
      await submitContact({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
      toast.success("Wir informieren dich, sobald es Neuigkeiten gibt.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="kontakt-page" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="lg:col-span-5"
        >
          <p className="overline">Kontakt</p>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl leading-tight text-white">
            Schreib <span className="italic gold-text">uns</span>.
          </h1>
          <p className="mt-8 text-base md:text-lg text-jewel-silver leading-relaxed">
            Ob Kooperation, Presseanfrage oder eine Idee, wie wir den Abend
            gemeinsam gestalten können – wir freuen uns auf deine Nachricht.
          </p>

          <div className="gold-divider w-24 my-10" />

          <ul className="space-y-5 text-sm">
            <li className="flex items-start gap-4">
              <Mail size={16} className="text-jewel-gold mt-0.5" />
              <div>
                <p className="overline">E-Mail</p>
                <a
                  href="mailto:Kontakt@wienerlehrlingsball.at"
                  className="mt-2 block text-white hover:text-jewel-gold transition-colors"
                  data-testid="kontakt-email-link"
                >
                  Kontakt@wienerlehrlingsball.at
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin size={16} className="text-jewel-gold mt-0.5" />
              <div>
                <p className="overline">Ort</p>
                <p className="mt-2 text-white">Wien · Österreich</p>
              </div>
            </li>
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          onSubmit={onSubmit}
          className="lg:col-span-7 space-y-10"
          data-testid="kontakt-form"
        >
          <div className="luxury-underline">
            <label className="block text-[10px] uppercase tracking-[0.32em] text-white/50 mb-3">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Dein Name"
              data-testid="kontakt-name"
              className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 focus:outline-none focus:border-jewel-gold transition-colors"
            />
          </div>
          <div className="luxury-underline">
            <label className="block text-[10px] uppercase tracking-[0.32em] text-white/50 mb-3">
              E-Mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="deine@email.at"
              data-testid="kontakt-email"
              className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 focus:outline-none focus:border-jewel-gold transition-colors"
            />
          </div>
          <div className="luxury-underline">
            <label className="block text-[10px] uppercase tracking-[0.32em] text-white/50 mb-3">
              Nachricht
            </label>
            <textarea
              value={form.message}
              onChange={set("message")}
              placeholder="Deine Nachricht an uns…"
              rows={5}
              data-testid="kontakt-message"
              className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 focus:outline-none focus:border-jewel-gold transition-colors resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              data-testid="kontakt-submit"
              className="btn-gold disabled:opacity-60"
            >
              {loading ? "Senden…" : "Nachricht senden"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Kontakt;
