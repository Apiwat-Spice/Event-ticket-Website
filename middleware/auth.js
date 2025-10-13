module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

module.exports.isOrganizer = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'organizer') {
    return res.status(403).send('ต้องเป็นผู้จัดงานเท่านั้น');
  }
  next();
};
