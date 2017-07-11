module.exports = {
  auth_required: function(req, res, next) {
    if (req.token === undefined) {
      return res.status(401).json({ error: 'Unauthorized'});
    }
    next();
  },
  admin_required: function(req, res, next) {
    if (req.user === undefined) {
      return res.status(401).json({ error: 'Unauthorized'});
    }

    var user_is_admin = req.user.roles.find(function(role) {
      return role.name.toLowerCase() === 'admin';
    });

    if (!user_is_admin) {
      return res.status(401).json({ error: 'Unauthorized'});
    }

    next();
  }
};
