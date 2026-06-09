const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database/db');
const { requireLogin } = require('../middleware/auth');
const { verifyCsrf } = require('../middleware/csrf');
const { validateMenuForm, isPositiveInt, ALLOWED_CATEGORIES } = require('../middleware/validate');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Ainult pildifailid on lubatud (jpg, png, webp, gif)'));
    }
  },
});

// ── Login ────────────────────────────────────────────────────────────────────

router.get('/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('login', { error: null });
});

router.post('/login', verifyCsrf, (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) {
    return res.render('login', { error: 'E-post ja parool on kohustuslikud' });
  }
  if (email.length > 254 || password.length > 256) {
    return res.render('login', { error: 'Vale e-post või parool' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.render('login', { error: 'Vale e-post või parool' });
  }

  // Regenerate session to prevent session fixation
  req.session.regenerate((err) => {
    if (err) return res.render('login', { error: 'Viga sessiooni loomisel' });
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    res.redirect('/admin');
  });
});

router.post('/logout', requireLogin, verifyCsrf, (req, res) => {
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
  const items = db.prepare(`SELECT * FROM menu_items ORDER BY
    CASE category
      WHEN 'Eripakkumised' THEN 1
      WHEN 'Eelroad & Suupisted' THEN 2
      WHEN 'Ramen' THEN 3
      WHEN 'Kõrvale' THEN 4
      WHEN 'Magustoit' THEN 5
      WHEN 'Joogid' THEN 6
      ELSE 7 END, name`).all();
  res.render('menu/index', { items, admin: req.session.adminEmail });
});

// ── Menu — create ────────────────────────────────────────────────────────────

router.get('/menu/new', requireLogin, (req, res) => {
  res.render('menu/form', {
    item: null,
    error: null,
    admin: req.session.adminEmail,
    categories: ALLOWED_CATEGORIES,
  });
});

router.post('/menu/new', requireLogin, upload.single('image'), verifyCsrf, (req, res) => {
  const errors = validateMenuForm(req.body);

  if (errors.length > 0) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.render('menu/form', {
      item: req.body,
      error: errors[0],
      admin: req.session.adminEmail,
      categories: ALLOWED_CATEGORIES,
    });
  }

  const { name, category, description, price, spiciness, ingredients, allergens, is_new } = req.body;
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
  if (!isPositiveInt(req.params.id)) return res.redirect('/admin/menu');
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(parseInt(req.params.id));
  if (!item) return res.redirect('/admin/menu');
  res.render('menu/form', { item, error: null, admin: req.session.adminEmail, categories: ALLOWED_CATEGORIES });
});

router.post('/menu/:id/edit', requireLogin, upload.single('image'), verifyCsrf, (req, res) => {
  if (!isPositiveInt(req.params.id)) return res.redirect('/admin/menu');
  const id = parseInt(req.params.id);
  const errors = validateMenuForm(req.body);

  if (errors.length > 0) {
    if (req.file) fs.unlinkSync(req.file.path);
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    return res.render('menu/form', {
      item: { ...item, ...req.body, id },
      error: errors[0],
      admin: req.session.adminEmail,
      categories: ALLOWED_CATEGORIES,
    });
  }

  const { name, category, description, price, spiciness, ingredients, allergens, is_new } = req.body;

  let image;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    const old = db.prepare('SELECT image FROM menu_items WHERE id = ?').get(id);
    if (old?.image?.startsWith('/uploads/')) {
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

router.post('/menu/:id/delete', requireLogin, verifyCsrf, (req, res) => {
  if (!isPositiveInt(req.params.id)) return res.redirect('/admin/menu');
  const id = parseInt(req.params.id);
  const item = db.prepare('SELECT image FROM menu_items WHERE id = ?').get(id);
  if (item?.image?.startsWith('/uploads/')) {
    const imgPath = path.join(__dirname, '..', 'public', item.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
  res.redirect('/admin/menu');
});

// ── Contact messages ─────────────────────────────────────────────────────────

router.get('/messages', requireLogin, (req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY sent_at DESC').all();
  res.render('messages', { messages, admin: req.session.adminEmail });
});

router.post('/messages/:id/delete', requireLogin, verifyCsrf, (req, res) => {
  if (!isPositiveInt(req.params.id)) return res.redirect('/admin/messages');
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(parseInt(req.params.id));
  res.redirect('/admin/messages');
});

module.exports = router;
