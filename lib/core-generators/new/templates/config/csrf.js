/**
 * Cross-Site Request Forgery Protection Settings
 * (sails.config.csrf)
 *
 * When CSRF protection is enabled in your Sails app, all non-GET requests to the server
 * must be accompanied by a special "CSRF token", which can be included as either the
 * '_csrf' parameter or the 'X-CSRF-Token' header.
 *
 * CSRF tokens are like limited-edition swag.  While a session tells the server that a user
 * "is who they say they are", a csrf token tells the server they "were where they say they were".
 *
 * Using tokens protects your Sails app against cross-site request forgery (or CSRF) attacks.
 * A would-be attacker needs not only a user's session cookie, but also this limited-time,
 * secret CSRF token, which is refreshed/granted when the user visits a URL on your app's domain.
 *
 * This allows us to have certainty that our users' requests haven't been hijacked,
 * and that the requests they're making are intentional and legitimate.
 *
 * This token has a short-lived expiration timeline, and must be acquired by either:
 *
 * (a) For modern, view-driven hybrid apps that submit forms with AJAX:
 *     Use the `exposeLocalsToBrowser` partial to provide access to the token from
 *     your client-side JavaScript, e.g.:
 *     ```
 *     <%- exposeLocalsToBrowser() %>
 *     <script>
 *       $.post({
 *         foo: 'bar',
 *         _csrf: window.SAILS_LOCALS._csrf
 *       })
 *     </script>
 *     ```
 *
 * (b) For single-page apps with static HTML:
 *     Fetch the token by sending a GET request to the route where you mounted
 *     the `security.grantCsrfToken`.  It will respond with JSON, e.g.:
 *     ```
 *     { _csrf: 'ajg4JD(JGdajhLJALHDa' }
 *     ```
 *
 * (c) For traditional HTML form submissions:
 *     Render the token directly into a hidden form input element in your HTML, e.g.:
 *     ```
 *     <form>
 *       <input type="hidden" name="_csrf" value="<%= _csrf %>" />
 *     </form>
 *     ```
 *
 * Enabling this option requires managing the token in your front-end app.
 * In traditional form submissions, this can be easily accomplished by sending along the
 * CSRF token as a hidden input in your `<form>`.  Better yet, include the CSRF token as
 * a request param or header when you send AJAX requests.  To do that, you can either fetch
 * the token by sending a request to the route where you mounted `security.grantCsrfToken`,
 * or better yet, harvest the token from view locals using the `exposeLocalsToBrowser` partial.
 *
 * For additional options and more information, see:
 * http://sailsjs.com/anatomy/config/csrf-js
 */

/****************************************************************************
*                                                                           *
* By default, Sails' built-in CSRF protection is disabled to facilitate     *
* rapid development.  But be warned!  If your Sails app will be accessed by *
* web browsers, you should _always_ enable CSRF protection before deploying *
* to production.                                                            *
*                                                                           *
* To enable CSRF protection with usual settings, set this to `true`.        *
* Or for more flexibility, specify a dictionary with any of the properties  *
* described in the Sails reference documentation (see link above).          *
*                                                                           *
****************************************************************************/

// module.exports.csrf = false;
