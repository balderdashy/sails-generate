/**
 * Security settings
 *
 * These settings affect aspects of your app's security, such
 * as how it deals with cross-origin requests (CORS) and which
 * routes require a CSRF token to be included with the request.
 *
 * For an overview of Sails security, see:
 * http://sailsjs.com/documentation/concepts/security
 */

module.exports.security = {

  // cors: {

    /**
     * Cross-Origin Resource Sharing (CORS) Settings
     * (sails.config.cors)
     *
     * CORS is like a more modern version of JSONP-- it allows your application
     * to circumvent browsers' same-origin policy, so that the responses from
     * your Sails app hosted on one domain (e.g. example.com) can be received in
     * the client-side JavaScript code from a page you trust hosted on _some other_
     * domain (e.g. trustedsite.net).
     *
     * For additional options and more information, see:
     * http://sailsjs.com/anatomy/config/cors-js
     */

     /***************************************************************************
     *                                                                          *
     * Apply global CORS settings to all routes by default?                     *
     *                                                                          *
     ***************************************************************************/

     // allRoutes: false,

     /***************************************************************************
     *                                                                          *
     * Which 3rd party domains should be allowed access via CORS?  This can be  *
     * a comma-delimited list of hosts ('example.com,api.example.com,etc.net')  *
     * or '*', to allow all domains CORS access.                                *
     *                                                                          *
     ***************************************************************************/

     // allowOrigins: '*',

     /***************************************************************************
     *                                                                          *
     * Should Sails allow cookies for CORS requests?                            *
     * (When false, cookies are ignored.)                                       *
     *                                                                          *
     ***************************************************************************/

     // allowCredentials: false,

     /***************************************************************************
     *                                                                          *
     * Which request headers should be allowed to be accessed in actions when   *
     * CORS requests are received? This is only used in response to preflight   *
     * requests.                                                                *
     *                                                                          *
     ***************************************************************************/

     // allowRequestHeaders: 'content-type'

   // },

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

  // csrf: false

};
