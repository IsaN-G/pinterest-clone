# 🎨 **Inspiration Board** – Pinterest-ähnliche Inspirations-App

**Eine moderne, schöne Web-App zum Sammeln, Speichern und Teilen von visuellen Inspirationen**  
(Tattoo, Mode, Kosmetik, Sport, Natur, Kunst, Essen, Reisen u.v.m.)

---

## ✨ Features

- ✅ **Komplettes Auth-System** (Login / Registrierung / Logout)
- ✅ **Geschützte Routes** mit Next.js Middleware
- ✅ **Pinterest-Style Grid** mit Masonry-Layout
- ✅ **Upload-Funktion** über Cloudinary (Bilder + Videos)
- ✅ **Favoriten / "Merken"** (wie Pinterest-Speichern)
- ✅ **Detail-Modal** mit ähnlichen Pins
- ✅ **Eigene Pins löschen** (nur eigene)
- ✅ **Kategorien-Filter** + Live-Suche
- ✅ **Glassmorphism-Design** mit sanften Farbverläufen und Schatten
- ✅ **Responsive** (funktioniert perfekt auf Handy & Desktop)
- ✅ **Test-User** bereits angelegt (für Recruiter / Demo)

---

## 🧪 Test-User (bereits registriert)

| E-Mail                | Passwort   |
|-----------------------|------------|
| `testuser@gmail.com`  | `testuser` |

**Du musst keinen neuen Account anlegen** – einfach mit diesen Daten einloggen.

---

## 🛠 Technologie-Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Glassmorphism
- **Datenbank**: PostgreSQL + Sequelize ORM
- **Auth**: Server Actions + HTTP-Only Cookies
- **Bilder/Videos**: Cloudinary
- **Passwort-Hashing**: bcryptjs
- **Fonts**: Geist (Sans + Mono)

---

## 📁 Wichtige Dateien & Ordner

| Datei / Ordner               | Inhalt |
|-----------------------------|--------|
| `middleware.ts`             | Auth-Schutz (Login/Logout-Routing) |
| `actions/authActions.ts`    | Login, Register, Logout (Server Actions) |
| `actions/inspirationActions.ts` | Pins erstellen, löschen, Favoriten |
| `app/page.tsx`              | Hauptseite (Server Component) |
| `components/ClientPage.tsx` | Interaktive Client-Komponente (Grid, Modal, Upload) |
| `lib/db.ts`                 | Sequelize Setup + Model-Verknüpfungen |
| `models/User.ts`            | User-Modell |
| `models/Inspiration.ts`     | Inspiration/Pin-Modell |
| `app/globals.css`           | Tailwind + Mesh-Gradient |

---

## 🚀 Lokales Setup (Schritt für Schritt)

1. **Repository klonen**
   ```bash
   git clone <dein-repo-url>
   cd inspiration-board


2. **Abhängigkeiten installieren** 
   ```bash
bun install

3. **Umgebungsvariablen anlegen**
Erstelle eine Datei .env.local im Root-Ordner:
# Datenbank (PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/inspiration_db
# Cloudinary (für Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dein_cloud_name
# (API-Key & Secret sind nur serverseitig nötig, wenn du den Preset nutzt)
Tipp: Wenn du Railway / Neon / Supabase nutzt, einfach den Connection-String eintragen.

4. **Datenbank synchronisieren**
Beim ersten Start wird automatisch sequelize.sync({ alter: true }) ausgeführt (nur im Dev-Modus).

5. **Entwicklungs-Server starten**
   ```bash
bun run dev
App läuft unter: http://localhost:3000


## 📸 Wie die App funktioniert

1. Login mit dem Test-User
2. Pins anschauen (Grid oder „Entdecken“-Modus)
3. Pin anklicken → großes Modal mit Download, Merken, Löschen (bei eigenen Pins)
4. Neuen Pin erstellen → über das violette „+“ in der Sidebar
5. Favoriten → „Merken“-Button (erscheint unter „Gespeichert“)
6. Logout → über das Logout-Icon unten in der Sidebar


## 🔧 Mögliche Anpassungen

- Cloudinary Upload Preset in ClientPage.tsx (Zeile mit my_preset_123)
- Kategorien in ClientPage.tsx (Array CATEGORIES)
- Farben / Logo in ClientPage.tsx und globals.css
- Test-User in der Datenbank löschen / ändern (falls gewünscht)


## 📌 Hinweise für Recruiter / Tester

- Test-User ist bereits angelegt → du kannst sofort loslegen.
- Alle Daten werden in der PostgreSQL-Datenbank gespeichert.
- Uploads laufen über Cloudinary (funktioniert sofort,wennNEXT_PUBLIC_CLOUDINARY_CLOUD_NAME gesetzt ist).
- Die App ist bewusst optisch hochwertig gestaltet (Glass-Effekt, sanfte Animationen, moderne Typografie).  