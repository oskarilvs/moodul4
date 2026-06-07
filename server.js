require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { ensureAdmin } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

ensureAdmin();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'shoyu-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
  }),
);

app.use('/admin', require('./routes/admin'));
app.use('/api/menu', require('./routes/api/menu'));
app.use('/api/contact', require('./routes/api/contact'));

app.get('/', (_req, res) => res.redirect('/admin'));

app.use((req, res) => {
  res.status(404).send(`
    <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
      <h1>404 — Lehte ei leitud</h1>
      <p><a href="/admin">Admin paneelile</a></p>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`\nSHOYU & CO. server töötab: http://localhost:${PORT}`);
  console.log(`Admin paneel:              http://localhost:${PORT}/admin`);
  console.log(`REST API:                  http://localhost:${PORT}/api/menu\n`);
});
