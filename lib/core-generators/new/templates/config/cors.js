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

module.exports.cors = {

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

  // allow3rdPartyOrigins: '*',

  /***************************************************************************
  *                                                                          *
  * Should Sails allow cookies for CORS requests?                            *
  * (When false, cookies are ignored.)                                       *
  *                                                                          *
  ***************************************************************************/

  // credentials: false,

  /***************************************************************************
  *                                                                          *
  * Which request headers should be allowed to be accessed in actions when   *
  * CORS requests are received? This is only used in response to preflight   *
  * requests.                                                                *
  *                                                                          *
  ***************************************************************************/

  // allowRequestHeaders: 'content-type',

};
