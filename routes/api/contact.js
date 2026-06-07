const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { db } = require('../../database/db');
const { validateContactForm, escapeHtml } = require('../../middleware/validate');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const errors = validateContactForm({ name, email, subject, message });

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = (subject || '').trim();
  const cleanMessage = message.trim();

  db.prepare(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
  ).run(cleanName, cleanEmail, cleanSubject, cleanMessage);

  if (process.env.MAIL_USER && process.env.MAIL_PASS) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"SHOYU & CO." <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        replyTo: cleanEmail,
        subject: cleanSubject ? `[SHOYU] ${cleanSubject}` : '[SHOYU] Uus kontaktisõnum',
        html: `
          <h2>Uus sõnum kontaktivormist</h2>
          <table cellpadding="6">
            <tr><td><strong>Nimi:</strong></td><td>${escapeHtml(cleanName)}</td></tr>
            <tr><td><strong>E-post:</strong></td><td>${escapeHtml(cleanEmail)}</td></tr>
            <tr><td><strong>Teema:</strong></td><td>${escapeHtml(cleanSubject) || '—'}</td></tr>
          </table>
          <h3>Sõnum:</h3>
          <p style="white-space:pre-wrap">${escapeHtml(cleanMessage)}</p>
        `,
      });
    } catch (err) {
      console.error('E-posti saatmine ebaõnnestus:', err.message);
    }
  }

  res.json({ success: true, message: 'Sõnum saadetud! Võtame teiega peagi ühendust.' });
});

module.exports = router;
