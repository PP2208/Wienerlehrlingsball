import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Download, LogOut, Mail, MessageSquare, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "contacts", label: "Kontaktanfragen", icon: MessageSquare },
];

const AdminDashboard = () => {
  const { authHeader, logout, API, admin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("newsletter");
  const [newsletter, setNewsletter] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nl, ct] = await Promise.all([
        axios.get(`${API}/admin/newsletter`, { headers: authHeader() }),
        axios.get(`${API}/admin/contacts`, { headers: authHeader() }),
      ]);
      setNewsletter(nl.data);
      setContacts(ct.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      toast.error("Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [API, authHeader, logout, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const exportCsv = async (kind) => {
    try {
      const res = await axios.get(`${API}/admin/${kind}/export`, {
        headers: authHeader(),
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export fehlgeschlagen.");
    }
  };

  const removeEntry = async (kind, id) => {
    if (!window.confirm("Eintrag wirklich löschen?")) return;
    try {
      await axios.delete(`${API}/admin/${kind}/${id}`, { headers: authHeader() });
      toast.success("Eintrag gelöscht.");
      load();
    } catch {
      toast.error("Löschen fehlgeschlagen.");
    }
  };

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString("de-AT");
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-jewel-base text-jewel-ink" data-testid="admin-dashboard">
      <header className="border-b border-white/10 bg-jewel-base/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
          <div>
            <p className="overline">Administration</p>
            <h1 className="font-serif text-xl md:text-2xl text-white">
              Lehrlingsball <span className="text-jewel-gold">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.28em] text-white/50">
              {admin?.username}
            </span>
            <button
              onClick={load}
              data-testid="admin-refresh"
              className="p-2 border border-white/10 hover:border-jewel-gold/40 text-white/70 hover:text-jewel-gold transition-colors"
              title="Aktualisieren"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleLogout}
              data-testid="admin-logout"
              className="inline-flex items-center gap-2 border border-white/10 hover:border-jewel-gold/40 text-white/70 hover:text-jewel-gold px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition-colors"
            >
              <LogOut size={14} /> Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-14">
        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-white/10 p-6 hover:border-jewel-gold/30 transition-colors">
            <p className="overline">Newsletter</p>
            <p className="mt-3 font-serif text-4xl text-jewel-gold">{newsletter.length}</p>
            <p className="mt-2 text-xs text-white/50">Abonnent*innen</p>
          </div>
          <div className="border border-white/10 p-6 hover:border-jewel-gold/30 transition-colors">
            <p className="overline">Kontaktanfragen</p>
            <p className="mt-3 font-serif text-4xl text-jewel-gold">{contacts.length}</p>
            <p className="mt-2 text-xs text-white/50">Gesamt</p>
          </div>
          <div className="border border-white/10 p-6 hover:border-jewel-gold/30 transition-colors">
            <p className="overline">Letzte Aktivität</p>
            <p className="mt-3 font-serif text-xl text-white">
              {newsletter[0]?.created_at ? fmt(newsletter[0].created_at) : "—"}
            </p>
            <p className="mt-2 text-xs text-white/50">Letzte Newsletter-Anmeldung</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center justify-between border-b border-white/10 mb-8">
          <div className="flex gap-8">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-testid={`admin-tab-${t.id}`}
                  className={`inline-flex items-center gap-2 pb-4 text-[11px] uppercase tracking-[0.28em] border-b-2 transition-colors ${
                    active
                      ? "text-jewel-gold border-jewel-gold"
                      : "text-white/60 border-transparent hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => exportCsv(tab)}
            data-testid="admin-export"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/70 hover:text-jewel-gold transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* content */}
        {loading ? (
          <p className="text-sm text-white/50">Lade Daten…</p>
        ) : tab === "newsletter" ? (
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02]">
                <tr className="text-left text-[10px] uppercase tracking-[0.28em] text-white/50">
                  <th className="px-5 py-4">E-Mail</th>
                  <th className="px-5 py-4">Quelle</th>
                  <th className="px-5 py-4">Zeit</th>
                  <th className="px-5 py-4 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {newsletter.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-white/40">
                      Noch keine Einträge.
                    </td>
                  </tr>
                ) : (
                  newsletter.map((n) => (
                    <tr key={n.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-white">{n.email}</td>
                      <td className="px-5 py-4 text-white/60">{n.source}</td>
                      <td className="px-5 py-4 text-white/60">{fmt(n.created_at)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => removeEntry("newsletter", n.id)}
                          className="text-white/50 hover:text-jewel-gold transition-colors"
                          data-testid={`admin-delete-newsletter-${n.id}`}
                          title="Löschen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-sm text-white/40">Noch keine Anfragen.</p>
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="border border-white/10 p-6 hover:border-jewel-gold/20 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg text-white">{c.name}</p>
                      <a href={`mailto:${c.email}`} className="text-xs text-jewel-gold hover:underline">
                        {c.email}
                      </a>
                      <p className="mt-3 text-sm text-white/80 whitespace-pre-wrap">{c.message}</p>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-white/40">
                        {fmt(c.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeEntry("contacts", c.id)}
                      className="text-white/40 hover:text-jewel-gold transition-colors"
                      data-testid={`admin-delete-contact-${c.id}`}
                      title="Löschen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
