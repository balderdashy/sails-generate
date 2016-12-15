/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * For more information on the blueprint API, check out:
 * http://sailsjs.com/docs/reference/blueprint-api
 *
 * For more information on the settings in this file, see:
 * http://sailsjs.com/config/blueprints
 *
 */

module.exports.blueprints = {
  /***************************************************************************
  *                                                                          *
  * Whether routes are automatically generated for every action in your app. *
  *                                                                          *
  ***************************************************************************/
  
  // actions: true,
  
  
  /***************************************************************************
  *                                                                          *
  * Whether automatic REST blueprints are enabled.                           *
  *                                                                          *
  ***************************************************************************/
  
  // rest: true,
  
  
  /***************************************************************************
  *                                                                          *
  * Whether CRUD shortcuts are enabled.                                      *
  * (These are enabled by default in development.)                           *
  *                                                                          *
  ***************************************************************************/
  
  // shortcuts: true,
  
  
  /***************************************************************************
  *                                                                          *
  * Optional mount path prefix for all blueprint routes on a controller.     *      
  *                                                                          *
  ***************************************************************************/

  // prefix: '',
  
  
  /***************************************************************************
  *                                                                          *
  * Optional mount path prefix for all REST blueprint routes on a controller *
  * (Will be joined to your `prefix` config.)                                *                  
  *                                                                          *
  ***************************************************************************/
  
  // restPrefix: '',
  
  
  /***************************************************************************
  *                                                                          *
  * Whether to use plural model names in blueprint routes                    *
  * (e.g. `/users` for the `User` model)                                     *
  *                                                                          *
  ***************************************************************************/

  // pluralize: false,
  
  
  /***************************************************************************
  *                                                                          *
  * Whether the blueprint actions should populate model fetches with data    *
  * from other models which are linked by associations.                      *
  *                                                                          *
  ***************************************************************************/

  // populate: true,
  
  
  /***************************************************************************
  *                                                                          *
  * Whether to subscribe the requesting socket in the `find` and `findOne`   *
  * blueprint actions to notifications about newly created records via the   *
  * blueprint API.                                                           *
  *                                                                          *
  ***************************************************************************/

  // autoWatch: true,
  
  
  /***************************************************************************
  *                                                                          *
  * The default number of records to show in the response from a "find"      *
  * action.                                                                  *
  *                                                                          *
  ***************************************************************************/

  // defaultLimit: 30

};
