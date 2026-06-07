-- SHOYU & CO. — andmebaasi skeem
-- Versioon: 1.0
-- Loodud: 2026-06-07
--
-- Kasutamine:
--   sqlite3 database/shoyu.db < database/schema.sql
--
-- NB! See fail on dokumentatsioon. Tegelik skeem luuakse
-- automaatselt database/db.js kaudu serveri käivitamisel.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Admini kasutajad ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  password   TEXT    NOT NULL,           -- bcrypt räsi, mitte avatekst
  created_at TEXT    DEFAULT (datetime('now'))
);

-- ── Menüükirjed ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL,          -- Eripakkumised | Eelroad & Suupisted | Ramen | Kõrvale | Magustoit | Joogid
  description TEXT    NOT NULL DEFAULT '',
  price       REAL    NOT NULL DEFAULT 0,
  spiciness   INTEGER NOT NULL DEFAULT 0 CHECK (spiciness BETWEEN 0 AND 3),
  ingredients TEXT    NOT NULL DEFAULT '', -- komadega eraldatud loend
  allergens   TEXT    NOT NULL DEFAULT '', -- komadega eraldatud loend
  image       TEXT    NOT NULL DEFAULT '', -- /uploads/... või /media/...
  is_new      INTEGER NOT NULL DEFAULT 0 CHECK (is_new IN (0, 1)),
  created_at  TEXT    DEFAULT (datetime('now')),
  updated_at  TEXT    DEFAULT (datetime('now'))
);

-- ── Kontaktisõnumid ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  sent_at    TEXT DEFAULT (datetime('now'))
);
