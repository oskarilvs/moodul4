const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { db } = require('../../database/db');

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

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nimi, e-post ja sõnum on kohustuslikud' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Vigane e-posti aadress' });
  }

  db.prepare(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
  ).run(name.trim(), email.trim(), (subject || '').trim(), message.trim());

  if (process.env.MAIL_USER && process.env.MAIL_PASS) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"${name}" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        replyTo: email,
        subject: subject ? `[SHOYU] ${subject}` : '[SHOYU] Uus kontaktisõnum',
        html: `
          <h2>Uus sõnum kontaktivormist</h2>
          <table>
            <tr><td><strong>Nimi:</strong></td><td>${name}</td></tr>
            <tr><td><strong>E-post:</strong></td><td>${email}</td></tr>
            <tr><td><strong>Teema:</strong></td><td>${subject || '—'}</td></tr>
          </table>
          <h3>Sõnum:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (err) {
      console.error('E-posti saatmine ebaõnnestus:', err.message);
    }
  }

  res.json({ success: true, message: 'Sõnum saadetud! Võtame teiega peagi ühendust.' });
});

module.exports = router;
