/**
 * Datastores
 * (sails.config.datastores)
 *
 * Datastores are like "saved settings" for your adapters.
 *
 * What's the difference between a datastore and an adapter, you might ask?
 * An adapter like `sails-mysql` is generic and stateless.  In order for it
 * to communicate between your Sails app and a particular database, it needs
 * some additional configuration.  A `datastore` is that additional information.
 *
 * The default datastore for your app is configured in `config/models.js`. Of
 * course, a datastore can be (and usually is) shared by multiple models.  And
 * unless otherwise specified, all of your models will share the default datastore.
 * But if necessary, any model definition can override this by specifying a
 * `datastore` property that references the name of one of a configured datastore
 * (like the ones below.)
 *
 * > Note: If you're using version control, it's a good idea to avoid pushing
 * > sensitive credentials like passwords, keys, API tokens up to your source code
 * > repository.  Instead, consider using another strategy like environment variables
 * > or the `config/local.js` file.
 *
 * For more information on configuring your datastores, check out:
 * http://sailsjs.com/docs/reference/configuration/sails-config-datastores
 */

module.exports.datastores = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  /***************************************************************************
  *                                                                          *
  * MySQL is the world's most popular relational database.                   *
  * http://en.wikipedia.org/wiki/MySQL                                       *
  *                                                                          *
  * Run: npm install sails-mysql                                             *
  *                                                                          *
  ***************************************************************************/
  // someMysqlServer: {
  //   adapter: 'sails-mysql',
  //   host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_MYSQL_USER', //optional
  //   password: 'YOUR_MYSQL_PASSWORD', //optional
  //   database: 'YOUR_MYSQL_DB' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * MongoDB is the leading NoSQL database.                                   *
  * http://en.wikipedia.org/wiki/MongoDB                                     *
  *                                                                          *
  * Run: npm install sails-mongo                                             *
  *                                                                          *
  ***************************************************************************/
  // someMongodbServer: {
  //   adapter: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: 'username', //optional
  //   password: 'password', //optional
  //   database: 'your_mongo_db_name_here' //optional
  // },

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  ***************************************************************************/
  // somePostgresqlServer: {
  //   adapter: 'sails-postgresql',
  //   host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
  //   user: 'YOUR_POSTGRES_USER', // optional
  //   password: 'YOUR_POSTGRES_PASSWORD', // optional
  //   database: 'YOUR_POSTGRES_DB' //optional
  // }


  /*****************************************************************************************
  *                                                                                        *
  * More adapters:                                                                         *
  *                                                                                        *
  * http://sailsjs.com/docs/concepts/extending-sails/adapters/available-adapters  *
  *                                                                                        *
  ******************************************************************************************/


};
