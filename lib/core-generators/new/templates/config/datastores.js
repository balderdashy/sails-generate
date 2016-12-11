/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * http://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, uncomment an option below.       *
  * Otherwise, just leave the default datastore as-is, without an "adapter". *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    /***************************************************************************
    *                                                                          *
    * MySQL is the world's most popular relational database.                   *
    * http://en.wikipedia.org/wiki/MySQL                                       *
    *                                                                          *
    * Run: npm install sails-mysql                                             *
    *                                                                          *
    ***************************************************************************/
    // adapter: require('sails-mysql'),
    // user: 'DEV_MYSQL_USER',                   //<< optional
    // password: 'DEV_MYSQL_PASSWORD',           //<< optional
    // host: 'localhost',
    // port: 3306,
    // database: 'DEV_MYSQL_DATABASE_NAME',


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
    * More adapters:                                                            *
    *                                                                           *
    * http://sailsjs.com/plugins/databases                                      *
    *                                                                           *
    ****************************************************************************/

  },


};
