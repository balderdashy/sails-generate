/**
 * Production environment settings
 * (sails.config.*)
 *
 * This file is a convenient way to specify configuration that should only be
 * used in your production environment, such as API keys and database credentials.
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add any private/sensitive data to this file!
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
  * Configure your default production database.                             *
  * (see `config/datastores.js`).                                           *
  *                                                                         *
  ***************************************************************************/
  datastores: {

    default: {

      /**************************************************************************
      *                                                                          *
      * For example:                                                             *
      *                                                                          *
      * Uncomment the following lines to set up a production MySQL database that *
      * can be shared across multiple Sails.js servers.                          *
      *                                                                          *
      * > Requires sails-mysql (https://www.npmjs.com/package/sails-mysql)       *
      * > (See http://sailsjs.com/config/datastores for more information.)       *
      *                                                                          *
      ***************************************************************************/
      // adapter: require('sails-mysql'),
      // url: 'mysql://user:password@localhost:3306/dbname'
      //--------------------------------------------------------------------------
      //  /\   To avoid checking it in to version control, you might opt to set
      //  ||   sensitive credentials like `url` using an environment variable.
      //
      //  For example:
      //  ```
      //  sails_datastores__default__url==mysql://admin:myc00lpAssw2D@db.example.com:3306/my_prod_db
      //  ```
      //--------------------------------------------------------------------------

    }

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
    // actions: true,
    // rest: true,
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
