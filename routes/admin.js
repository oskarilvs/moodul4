const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database/db');
const { requireLogin } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Ainult pildifailid on lubatud'));
  },
});

// ── Login ────────────────────────────────────────────────────────────────────

router.get('/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.render('login', { error: 'Vale e-post või parool' });
  }

  req.session.adminId = admin.id;
  req.session.adminEmail = admin.email;
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ── Dashboard ────────────────────────────────────────────────────────────────

router.get('/', requireLogin, (req, res) => {
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;
  const msgCount = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
  const latest = db.prepare('SELECT * FROM contact_messages ORDER BY sent_at DESC LIMIT 5').all();
  res.render('dashboard', { menuCount, msgCount, latest, admin: req.session.adminEmail });
});

// ── Menu — list ──────────────────────────────────────────────────────────────

router.get('/menu', requireLogin, (req, res) => {
  const items = db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
  res.render('menu/index', { items, admin: req.session.adminEmail });
});

// ── Menu — create ────────────────────────────────────────────────────────────

router.get('/menu/new', requireLogin, (req, res) => {
  res.render('menu/form', { item: null, error: null, admin: req.session.adminEmail });
});

router.post('/menu/new', requireLogin, upload.single('image'), (req, res) => {
  const { name, category, description, price, spiciness, ingredients, allergens, is_new } = req.body;

  if (!name || !category || !price) {
    return res.render('menu/form', {
      item: { ...req.body },
      error: 'Nimi, kategooria ja hind on kohustuslikud',
      admin: req.session.adminEmail,
    });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : '';

  db.prepare(`
    INSERT INTO menu_items (name, category, description, price, spiciness, ingredients, allergens, image, is_new)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    category.trim(),
    (description || '').trim(),
    parseFloat(price),
    parseInt(spiciness) || 0,
    (ingredients || '').trim(),
    (allergens || '').trim(),
    image,
    is_new ? 1 : 0,
  );

  res.redirect('/admin/menu');
});

// ── Menu — edit ──────────────────────────────────────────────────────────────

router.get('/menu/:id/edit', requireLogin, (req, res) => {
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/admin/menu');
  res.render('menu/form', { item, error: null, admin: req.session.adminEmail });
});

router.post('/menu/:id/edit', requireLogin, upload.single('image'), (req, res) => {
  const { name, category, description, price, spiciness, ingredients, allergens, is_new } = req.body;
  const id = req.params.id;

  if (!name || !category || !price) {
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    return res.render('menu/form', {
      item: { ...item, ...req.body, id },
      error: 'Nimi, kategooria ja hind on kohustuslikud',
      admin: req.session.adminEmail,
    });
  }

  let image;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    const old = db.prepare('SELECT image FROM menu_items WHERE id = ?').get(id);
    if (old && old.image && old.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', 'public', old.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  } else {
    const current = db.prepare('SELECT image FROM menu_items WHERE id = ?').get(id);
    image = current ? current.image : '';
  }

  db.prepare(`
    UPDATE menu_items
    SET name=?, category=?, description=?, price=?, spiciness=?, ingredients=?, allergens=?, image=?, is_new=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    name.trim(),
    category.trim(),
    (description || '').trim(),
    parseFloat(price),
    parseInt(spiciness) || 0,
    (ingredients || '').trim(),
    (allergens || '').trim(),
    image,
    is_new ? 1 : 0,
    id,
  );

  res.redirect('/admin/menu');
});

// ── Menu — delete ────────────────────────────────────────────────────────────

router.post('/menu/:id/delete', requireLogin, (req, res) => {
  const item = db.prepare('SELECT image FROM menu_items WHERE id = ?').get(req.params.id);
  if (item && item.image && item.image.startsWith('/uploads/')) {
    const imgPath = path.join(__dirname, '..', 'public', item.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
  res.redirect('/admin/menu');
});

// ── Contact messages ─────────────────────────────────────────────────────────

router.get('/messages', requireLogin, (req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY sent_at DESC').all();
  res.render('messages', { messages, admin: req.session.adminEmail });
});

router.post('/messages/:id/delete', requireLogin, (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});

module.exports = router;
