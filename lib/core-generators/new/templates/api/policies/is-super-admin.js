/**
 * is-super-admin
 *
 * A simple policy that blocks requests from non-super-admins.
 */
module.exports = async function (req, res, next) {

  // First, check whether the request comes from a logged-in user
  if (!req.session.userId) {
    // In the future, you may want to use `res.notFound()` instead,
    // in order to hide the existence of the admin dashboard from overly-curious users.
    return res.forbidden();
  }

  var loggedInUser = await User.findOne({ id: req.session.userId });
  if(!loggedInUser.isSuperAdmin) {
    // (See note above.)
    return res.forbidden();
  }

  // If we made it here, the logged-in user is an admin.
  return next();
};
