const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superAdmin") {
    next();
  } else {
    req.flash("errors", ["Access denied"]);
    res.redirect("/login");
  }
};

const ensureUser = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "user" || req.user.role === "superAdmin")
  ) {
    next();
  } else {
    req.flash("errors", ["Access denied"]);
    res.redirect("/login");
  }
};

module.exports = {
  ensureAdmin,
  ensureUser,
};
