/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API keys / db passwords) to this file!
 *
 * For more information on configuring your app using environments, visit:
 * http://sailsjs.com/docs/concepts/configuration#?environmentspecific-files-config-env
 *
 * And to read more about configuring your Sails app for production, check out:
 * http://sailsjs.com/docs/concepts/deployment
 */

module.exports = {


  /**************************************************************************
  *                                                                         *
  * Tell Sails what database(s) it should use in production.                *
  *                                                                         *
  * > See http://sailsjs.com/config/datastores for more info.               *
  *                                                                         *
  **************************************************************************/
  datastores: {

    default: {

      /***************************************************************************
      *                                                                          *
      * Configure your default, production database.                             *
      *                                                                          *
      * All supported adapters can be configured in roughly the same way: by     *
      * passing in a Sails/Waterline adapter (`adapter`), as well as a           *
      * connection URL (`url`).                                                  *
      *                                                                          *
      *                                                                                         *
      *  Database technology  | Adapter             | Connection URL                           *
      *  -------------------- | ------------------- | ---------------------------------------  *
      *  MySQL                | sails-mongo         | mysql://user:password@host:port/database *
      *  PostgreSQL           | sails-postgresql    | postgresql://             *
      *  MongoDB              | sails-mongo         | mongo://                  *
      *                                                                          *
      * > More database adapters:                                                *
      * > http://sailsjs.com/plugins/databases                                   *
      *                                                                          *
      *                                                                          *
      *                                                                          *
      * For example:                                                             *
      *                                                                          *
      * Install the MySQL adapter:                                               *
      *   npm install sails-mysql --save                                         *
      *                                                                          *
      * Then, uncomment the following lines to set up a production MySQL database:                                               *
      * Install the MySQL adapter:                                               *
      *                                                                          *
      ***************************************************************************/
      // adapter: require('sails-mysql'),
      // url: 'mysql://user:password@host:port/database'
      //--------------------------------------------------------------------------
      //  /\   To avoid checking it in to version control, you might opt to set
      //  ||   sensitive credentials like `url` using an environment variable.
      //
      //  For example:
      //  ```
      //  sails_datastores__default__url==mysql://admin:myc00lpAssw2D@db.example.com:3306/my_prod_db
      //  ```
      //--------------------------------------------------------------------------

      // adapter: require('sails-postgresql'),
      // url: 'postgresql://user:password@host:port/database'

      // * Uncomment the following lines to set up a production MySQL database      *
      // * that can be shared across multiple Sails.js servers.                     *

      /***************************************************************************
      *   protocol://user:password@host:port/database                            *
      ***************************************************************************/

      /***************************************************************************
      *                                                                          *
      * Install the MySQL adapter:                                               *
      *   npm install sails-mysql --save                                         *
      *                                                                          *
      *                                                                          *
      *                                                                          *
      * Or to use a different database:                                          *
      *                                                                          *
      * For MySQL:                                                               *
      *   npm install sails-mysql --save                                         *
      *   mysql://                                                                       *
      *                                                                          *
      * For PostgreSQL:                                                          *
      *   npm install sails-postgresql --save                                    *
      *                                                                          *
      * For MongoDB:                                                             *
      *   npm install sails-mongo --save                                         *
      *                                                                          *
      * More database adapters:                                                  *
      * http://sailsjs.com/plugins/databases                                     *
      *                                                                          *
      ***************************************************************************/


      /***************************************************************************
      *                                                                          *
      * MongoDB is the leading NoSQL database.                                   *
      * http://en.wikipedia.org/wiki/MongoDB                                     *
      *                                                                          *
      * Run: npm install sails-mongo                                             *
      *                                                                          *
      ***************************************************************************/
      // adapter: require('sails-mongo'),
      // user: 'DEV_MONGO_USER',                   //<< optional
      // password: 'DEV_MONGO_PASSWORD',           //<< optional
      // host: 'localhost',
      // port: 27017,
      // database: 'DEV_MONGO_DATABASE_NAME',


      /***************************************************************************
      *                                                                          *
      * PostgreSQL is an awesome relational database with powerful features.     *
      * http://en.wikipedia.org/wiki/PostgreSQL                                  *
      *                                                                          *
      * Run: npm install sails-postgresql                                        *
      *                                                                          *
      ***************************************************************************/
      // adapter: require('sails-postgresql'),
      //
      // user: 'DEV_POSTGRES_USER',                //<< optional
      // password: 'DEV_POSTGRES_PASSWORD',        //<< optional
      // host: 'localhost',
      // port: 5432,
      // database: 'DEV_POSTGRESQL_DATABASE_NAME', //<< optional


      /****************************************************************************
      *                                                                           *
      * For PostgreSQL:                                                           *
      *   npm install sails-postgresql --save                                     *
      *                                                                           *
      *   (and switch out `mysql://` for `postgresql://` in the URL)              *
      *                                                                           *
      ****************************************************************************/
      adapter: require('sails-postgresql'),
      url: 'postgresql://user:password@host:port/database',


      /****************************************************************************
      *                                                                           *
      * For MongoDB:                                                              *
      *   npm install sails-mongo                                                 *
      *                                                                           *
      * More database adapters:                                                   *
      *   http://sailsjs.com/plugins/databases                                    *
      *                                                                           *
      ****************************************************************************/

      /****************************************************************************
      *                                                                           *
      *   Database technology  | Adapter                      | URL prefix        *
      *   -------------------- | ---------------------------- | --------------    *
      *   MySQL                | require('sails-mongo')       | mysql://          *
      *   PostgreSQL           | require('sails-postgresql')  | postgresql://     *
      *   MongoDB              | require('sails-mongo')       | mongo://          *
      *                                                                           *
      * More database adapters:                                                   *
      *   http://sailsjs.com/plugins/databases                                    *
      *                                                                           *
      ****************************************************************************/

    }

  },



  models: {

    /**************************************************************************
    *                                                                         *
    * In Sails, the automigration strategy is always implicitly set to "safe" *
    * in production.  (This is just here as a reminder.)                      *
    *                                                                         *
    * http://sailsjs.com/docs/concepts/models-and-orm/model-settings#?migrate *
    *                                                                         *
    ***************************************************************************/
    migrate: 'safe',

  },



  /**************************************************************************
  *                                                                         *
  * Always disable "shortcut" blueprint routes.                             *
  * (you'll also want to disable any other blueprint routes that you are    *
  * not actually using)                                                     *
  *                                                                         *
  ***************************************************************************/
  blueprints: {
    shortcuts: false,
    // actions: false,
    // rest: false,
  },



  /***************************************************************************
  *                                                                          *
  * Configure how your app handles sessions in production.                   *
  *                                                                          *
  * (http://sailsjs.com/config/session)                                      *
  *                                                                          *
  * > If you have disabled the "session" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  session: {

    /***************************************************************************
    *                                                                          *
    * Production session store configuration.                                  *
    *                                                                          *
    * Uncomment the following lines to set up a production session store       *
    * package called "connect-redis" that will use Redis to share session      *
    * data across a cluster of multiple Sails/Node.js servers or processes.    *
    * (See http://bit.ly/redis-session-config for more info.)                  *
    *                                                                          *
    * > While "connect-redis" is a popular choice for Sails apps, many other   *
    * > compatible packages (like "connect-mongo") are available on NPM.       *
    * > (For a full list, see http://sailsjs.com/plugins/sessions)             *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'connect-redis',
    // url: 'redis://user:password@localhost:6379/dbname',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/sessions
    // ```
    //
    // If no `url` is set, a redis server running on localhost is expected.
    //--------------------------------------------------------------------------



    /***************************************************************************
    *                                                                          *
    * Production configuration for the session ID cookie.                      *
    *                                                                          *
    * For example, if you uncomment the lines below, session ID cookies will   *
    * only be sent over HTTPS, and will expire 24 hours after they are set.    *
    * Depending on your app's needs, you may also be able to leave these lines *
    * commented out, and simply rely on the implicit defaults.                 *
    *                                                                          *
    * For help, or to see all available options, check out:                    *
    * http://sailsjs.com/config/session#?the-session-id-cookie                 *
    *                                                                          *
    ***************************************************************************/
    cookie: {
      // maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    },

  },



  /**************************************************************************
  *                                                                          *
  * Set up Socket.io for your production environment.                        *
  *                                                                          *
  * (http://sailsjs.com/config/sockets)                                      *
  *                                                                          *
  * > If you have disabled the "sockets" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  sockets: {

    /***************************************************************************
    *                                                                          *
    * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
    * "origins" are allowed to open socket connections to your Sails app.      *
    *                                                                          *
    * > Replace "https://example.com" with the URL of your production server.  *
    * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
    *                                                                          *
    ***************************************************************************/
    // onlyAllowOrigins: [
    //   'https://example.com',        // << on the production server(s)
    //   'http://localhost:1337',      // << for doing `sails lift --prod` locally
    // ],


    /***************************************************************************
    *                                                                          *
    * If you are deploying a cluster of multiple servers and/or processes,     *
    * then uncomment the following lines.  This tells Socket.io about a Redis  *
    * server it can use to help it deliver broadcasted socket messages.        *
    *                                                                          *
    * (http://sailsjs.com/docs/concepts/deployment/scaling)                    *
    *                                                                          *
    ***************************************************************************/
    // adapter: 'socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/dbname',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/
    // ```
    //--------------------------------------------------------------------------

  },



  /**************************************************************************
  *                                                                         *
  * Set the log level to 'debug'.                                           *
  *                                                                         *
  * (http://sailsjs.com/config/log)                                         *
  *                                                                         *
  ***************************************************************************/
  log: {
    level: 'debug'
  },



  http: {

    /***************************************************************************
    *                                                                          *
    * The number of milliseconds to cache static assets in production.         *
    * These are any flat files like images, scripts, styleshseets, etc.        *
    * that are served by the static middleware.  By default, these files       *
    * are served from `.tmp/public`, a hidden folder compiled by Grunt.        *
    *                                                                          *
    ***************************************************************************/
    cache: 31557600000,// 365.25 days

    /***************************************************************************
    *                                                                          *
    * Proxy settings                                                           *
    *                                                                          *
    * If your app will be deployed behind a proxy/load balancer - for example, *
    * on a PaaS like Heroku - and you are using `req.ip`, `req.ips`,           *
    * `req.protocol`, `req.hostname`, or `sails.config.session.cookie.secure`, *
    * then uncomment the `trustProxy` setting below to tell Sails/Express      *
    * how to interpret X-Forwarded headers.                                    *
    *                                                                          *
    * (http://sailsjs.com/config/http)                                         *
    *                                                                          *
    ***************************************************************************/
    // trustProxy: true,

  },



  /**************************************************************************
  *                                                                         *
  * Lift the server on port 80.                                             *
  * (if deploying to a PaaS like Heroku or Deis, you may not need to worry  *
  *  about changing the port, because it is handled automatically)          *
  *                                                                         *
  ***************************************************************************/
  // port: 80,



  /**************************************************************************
  *                                                                         *
  * Overrides for any custom configuration specifically for your app.       *
  * (for example, production API keys)                                      *
  *                                                                         *
  ***************************************************************************/
  custom: {

    // mailgunApiKey: 'key-prod_fake_bd32301385130a0bafe030c',
    // stripeSecret: 'sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using an environment variable.
    //
    // For example:
    // ```
    // sails_custom__mailgunApiKey=key-prod_fake_bd32301385130a0bafe030c
    // sails_custom__stripeSecret=sk_prod__fake_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------

  },



};
