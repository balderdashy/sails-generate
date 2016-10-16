/**
 * Production environment settings
 * (sails.config.*)
 *
 * This file is a convenient way to check in shared settings for a production
 * environment, such as API keys or remote database passwords.
 *
 * > If you're using a version control solution for your Sails app, this
 * > file will be committed to your repository unless you add it to your
 * > .gitignore file.  If your repository will be publicly viewable, don't
 * > add any private data to this file!
 *
 * For more information on configuring your app using environments, visit:
 * http://sailsjs.com/docs/concepts/configuration#?environmentspecific-files-config-env
 *
 * For a reference of misc. top-level settings not covered by other config files, see:
 * http://sailsjs.com/docs/reference/configuration/sails-config
 *
 * And to read more about configuring your Sails app for production, check out:
 * http://sailsjs.com/docs/concepts/deployment
 */

module.exports = {

  // Any configuration settings may be overridden below, including custom
  // configuration specifically for your app (e.g. Stripe, Mailgun, Twitter, etc.)

  /***************************************************************************
   *                                                                         *
   * Set the default database datastore for models in the production         *
   * environment (see `config/datastore.js` and `config/models.js` )         *
   *                                                                         *
   ***************************************************************************/

  // models: {
  //   datastore: 'someMysqlServer'
  // },

  /***************************************************************************
   *                                                                         *
   * Set the port in the production environment to 80                        *
   * (if deploying to a PaaS like Heroku or Deis, you may not need to worry  *
   *  about changing the port, because it is handled automatically)          *
   *                                                                         *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   *                                                                         *
   * Set the log level in production environment to 'error'                  *
   *                                                                         *
   ***************************************************************************/

  // log: {
  //   level: 'error'
  // }

};
