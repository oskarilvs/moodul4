function requireLogin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
}

module.exports = { requireLogin };
