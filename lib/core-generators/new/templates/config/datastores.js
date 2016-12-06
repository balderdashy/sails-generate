/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 * For more information on configuring datastores, check out:
 * http://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /*****************************************************************************
  *                                                                            *
  * Your app's default datastore.                                              *
  *                                                                            *
  * > Note: If you're using version control, it's a good idea to avoid pushing *
  * > sensitive credentials like your personal passwords, keys, or API tokens  *
  * > up to your source code repository.  Instead, consider using another      *
  * > strategy.  For more info, see:                                           *
  * >                                                                          *
  * > For more info, see:                                                      *
  * > • http://sailsjs.com/docs/concepts/configuration                         *
  *                                                                            *
  *****************************************************************************/

  default: {

    /***************************************************************************
    *                                                                          *
    * Sails apps read and write to local disk by default, using a built-in     *
    * database adapter called `sails-disk`.                                    *
    *                                                                          *
    * This feature is purely for convenience during development.               *
    * (`sails-disk` is not designed for use in a production environment.)      *
    *                                                                          *
    * If you'd rather develop against a real database, check out the other     *
    * If you'd rather develop against a real database, check out the other     *
    *                                                                          *
    ***************************************************************************/
    // adapter: <<BUILT-IN SAILS-DISK>>,


    /***************************************************************************
    *                                                                          *
    * To develop using a MySQL database     *
    * MySQL is the world's most popular relational database.                   *
    * http://en.wikipedia.org/wiki/MySQL                                       *
    *                                                                          *
    * Run: npm install sails-mysql --save                                      *
    *                                                                          *
    ***************************************************************************/
    // adapter: require('sails-mysql'),
    // host: 'localhost',
    // user: 'YOUR_MYSQL_USER', //optional
    // password: 'YOUR_MYSQL_PASSWORD', //optional
    // database: 'YOUR_MYSQL_DB' //optional


    /***************************************************************************
    *                                                                          *
    * MongoDB is the leading NoSQL database.                                   *
    * http://en.wikipedia.org/wiki/MongoDB                                     *
    *                                                                          *
    * Run: npm install sails-mongo                                             *
    *                                                                          *
    ***************************************************************************/
    // adapter: require('sails-mongo'),
    // host: 'localhost',
    // port: 27017,
    // user: 'username', //optional
    // password: 'password', //optional
    // database: 'your_mongo_db_name_here' //optional

    /***************************************************************************
    *                                                                          *
    * PostgreSQL is another officially supported relational database.          *
    * http://en.wikipedia.org/wiki/PostgreSQL                                  *
    *                                                                          *
    * Run: npm install sails-postgresql                                        *
    *                                                                          *
    ***************************************************************************/
    // adapter: require('sails-postgresql'),
    // host: 'localhost',
    // user: 'YOUR_POSTGRES_USER', // optional
    // password: 'YOUR_POSTGRES_PASSWORD', // optional
    // database: 'YOUR_POSTGRES_DB' //optional


    /*****************************************************************************************
    *                                                                                        *
    * More adapters:                                                                         *
    *                                                                                        *
    * http://sailsjs.com/docs/concepts/extending-sails/adapters/available-adapters           *
    *                                                                                        *
    ******************************************************************************************/

  }


};
