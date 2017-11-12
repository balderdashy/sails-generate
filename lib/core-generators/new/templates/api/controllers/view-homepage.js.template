module.exports = {


  friendlyName: 'View homepage',
  // TODO: Switch to a different route for logged-in homepage to make this a clearer, simpler default starting point.


  description: 'Display the appropriate homepage, depending on login status.',


  exits: {

    loggedIn: {
      statusCode: 200,
      description: 'Requesting user is logged in, so show the internal welcome page.',
      viewTemplatePath: 'pages/dashboard/welcome.ejs',
    },

    notLoggedIn: {
      statusCode: 200,
      description: 'Requesting user is a guest, so show the public landing page.',
      viewTemplatePath: 'pages/homepage.ejs'
    }

  },


  fn: async function (inputs, exits) {

    if (this.req.me) {
      return exits.loggedIn();
    }

    return exits.notLoggedIn();

  }


};
