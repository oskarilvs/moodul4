const crypto = require('crypto');

function csrfMiddleware(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

function verifyCsrf(req, res, next) {
  const token = req.body?._csrf;
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:3rem">
        <h1>403 — Kehtetu päring</h1>
        <p>CSRF kaitse: luba on aegunud. Palun laadi leht uuesti.</p>
        <a href="javascript:history.back()">← Tagasi</a>
      </body></html>
    `);
  }
  next();
}

module.exports = { csrfMiddleware, verifyCsrf };
