/**
 * is-super-admin
 *
 * A simple policy that blocks requests from non-super-admins.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, next) {

  // First, check whether the request comes from a logged-in user
  if (!req.session.userId) {
    return res.unauthorized();
  }//•

  // Then look up that user's record in the database.
  var loggedInUser = await User.findOne({ id: req.session.userId });
  if(!loggedInUser) {
    return res.unauthorized();
  }//•

  // Once we've confirmed that, check that this user is a "super admin".
  if (!loggedInUser.isSuperAdmin) {
    return res.forbidden();
  }//•

  // IWMIH, we've got ourselves a "super admin".
  return next();

};
