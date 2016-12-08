/**
 * Production environment settings
 * (sails.config.*)
 *
 * This file is a convenient way to specify configuration that should only be
 * used in your production environment, such as API keys and database credentials.
 * What you see below is a quick outline of the built-in settings you need to
 * to configure your Sails app for production use.
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
  * > If you are not using sessions, then just ignore/remove this section.   *
  *                                                                          *
  ***************************************************************************/
  session: {

    /***************************************************************************
    *                                                                          *
    * Production session store configuration.                                  *
    *                                                                          *
    ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *
    *                                                                          *
    * Many other Sails/Express/Connect-compatible session stores are available *
    * for install from NPM ('connect-mongo', 'connect-dynamodb', etc.)         *
    *                                                                          *
    * For a full list, see:                                                    *
    * http:// sailsjs.com/plugins/sessions                                     *
    *                                                                          *
    ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *
    *                                                                          *
    * For example:                                                             *
    *                                                                          *
    * Uncomment the following lines to set up a Redis session store that can   *
    * be shared across multiple Sails.js servers.                              *
    *                                                                          *
    * > Requires connect-redis (https://www.npmjs.com/package/connect-redis)   *
    * > (See http://bit.ly/redis-session-config for more information.)         *
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


  // TODO finish
  // • If you ARE using HTTPS, but behind a proxy/load balancer - for example,
  //   on a PaaS like Heroku - then you should still set `secure: true` above.
  //   But note that, for this to work, you will ALSO need to set another option
  //   called `sails.config.http.trustProxy` (see below).

  /**************************************************************************
  *                                                                          *
  * Set up Socket.io for a multi-server production deployment.               *
  *                                                                          *
  * Uncomment the following lines to tell Socket.io about a Redis server it  *
  * can use to deliver broadcasted socket messages, no matter which Sails    *
  * server they come from, or which Sails server the recipient client socket *
  * is connected to.                                                         *
  *                                                                          *
  * (http://sailsjs.com/docs/concepts/deployment/scaling)                    *
  *                                                                          *
  ***************************************************************************/
  sockets: {

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
  * (useful if you're deploying before you've cleaned up debug log msgs)    *
  *                                                                         *
  ***************************************************************************/
  log: {

    level: 'debug'

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
  * Overrides for any custom configuration specifically for your app.       *                                                                        *
  * (for example, production API keys)                                      *
  *                                                                         *
  ***************************************************************************/
  custom: {

    // mailgunApiKey: 'key-prodkeybd32301385130a0bafe030c',
    // stripeSecret: 'sk_prod_Nfgh82401348jaDa3lkZ0d9Hm',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking them in to version control, you might opt to
    // ||   set sensitive credentials like these using an environment variable.
    //
    // For example:
    // ```
    // sails_custom__mailgunApiKey=key-prodkeybd32301385130a0bafe030c
    // sails_custom__stripeSecret=sk_prod_Nfgh82401348jaDa3lkZ0d9Hm
    // ```
    //--------------------------------------------------------------------------

  },

};
