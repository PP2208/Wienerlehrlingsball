# PRD · Wiener Lehrlingsball 2027

## Original problem statement (Summary)
Moderne, elegante Event-Website für den „Wiener Lehrlingsball 2027". Vorgeschaltete „Coming Soon"-Landing Page mit Newsletter-Anmeldung. Zugang zur vollständigen Website über geheime Eingabe `LBALL2027` im E-Mail-Feld. Dahinter: Startseite, Infos, Tickets, Kontakt. Admin-Bereich für Newsletter-/Kontakt-Verwaltung.

## User personas
- **Besucher (Coming-Soon)**: junge Menschen, Lehrlinge, Interessierte, die früh informiert werden möchten.
- **Redaktion / Intern**: trägt `LBALL2027` ein, um das Full-Site-Preview aufzurufen.
- **Admin**: verwaltet Newsletter- und Kontaktdaten.

## Architecture
- **Backend**: FastAPI + Motor (MongoDB). JWT Admin-Auth mit bcrypt. Collections: `newsletter_subscribers` (unique email), `contact_messages`, `admin_users`.
- **Frontend**: React 19 + Tailwind + Framer Motion + Sonner Toasts. BrowserRouter mit Routes `/`, `/home`, `/infos`, `/tickets`, `/kontakt`, `/admin`, `/admin/dashboard`.
- **Gate**: `GateContext` + `localStorage['lball_gate_granted']`.
- **Admin-Auth**: `AuthContext` + `localStorage['lball_admin_token']` (JWT 8 h).
- **Design**: Dark Luxury (Archetype „Jewel"). Midnight `#050810`, Gold `#D1A954`, Silber `#C0C0C0`.

## Core requirements (static)
1. Coming-Soon mit Newsletter + stiller Gate-Eingabe.
2. Vollständige Website hinter Gate.
3. Admin-Dashboard mit Listen, CSV-Export, Löschen.
4. Nur Deutsch, lizenzfreie Bilder, responsive.

## What's been implemented (2026-04)
- ✅ Backend Endpoints: `/api/newsletter`, `/api/contact`, `/api/admin/login`, `/api/admin/me`, `/api/admin/newsletter`, `/api/admin/contacts`, `/api/admin/*/export` (CSV), `DELETE /api/admin/*/{id}`.
- ✅ Admin-Seeding on startup (bcrypt hash rebuilt from env).
- ✅ MongoDB Unique-Index auf Newsletter-E-Mail.
- ✅ Coming-Soon-Seite mit Hero-Bild, Fade-In, Silent-Unlock via `LBALL2027`.
- ✅ Startseite (Hero, Intro, Teaser, Newsletter-CTA), Infos (3 Säulen + Manifesto), Tickets (Platzhalter + Benachrichtigungs-Form), Kontakt (Formular + E-Mail-Platzhalter `Kontakt@wienerlehrlingsball.at`).
- ✅ Admin-Login + Admin-Dashboard (Stats, Tabs, CSV-Export, Löschen).
- ✅ Alle interaktiven Elemente mit `data-testid`.
- ✅ Testing-Agent: 19/19 Backend + alle Frontend-Flows grün.

## Backlog (P0 / P1 / P2)
### P1
- Termin, Ort, Uhrzeit des Balls einpflegen, sobald bekannt.
- Programm/Zeitablauf auf Infos-Seite.
- Ticketkategorien + Shop-Anbindung (z. B. Stripe) wenn Verkauf startet.

### P2
- Sprach-Umschaltung (DE/EN).
- Instagram-/Pressekit-Links.
- Sponsoren-/Partner-Bereich.
- DSGVO-konforme Einwilligung + Double-Opt-In (Resend/Mailchimp).
- Brute-Force-Lockout für Admin-Login.
- Admin: Rollen, Passwort-Reset, mehrere Benutzer.

## Next tasks
- Inhalte (Termin, Location, Sponsoren, Fotos vom Event) einpflegen, sobald verfügbar.
- Ticket-Shop-Integration, wenn Vorverkauf startet.
