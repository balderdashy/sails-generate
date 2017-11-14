module.exports = {


  friendlyName: 'View new password',


  description: 'Display "New password" page.',


  inputs: {

    token: {
      description: 'The password reset token from the email.',
      example: '4-32fad81jdaf$329'
    }

  },


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/new-password'
    }

  },


  fn: async function (inputs, exits) {

    // TODO: Come back and clean this up!

    // FUTURE: Instead of this, if password reset token is missing, display an error page explaining that the link is bad.
    if (!inputs.token) {
      sails.log.warn('Attempting to view new password (recovery) page, but no reset password token included in request!  Displaying error page...');
      throw new Error('No reset password token (see above warning in logs)');
    }//•

    // FUTURE: Check token to be sure that it is valid, and if not, display an error page that the link is expired.

    // Grab token input and include it in view locals
    return exits.success({
      token: inputs.token
    });

  }


};
