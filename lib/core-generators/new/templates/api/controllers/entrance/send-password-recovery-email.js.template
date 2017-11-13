module.exports = {


  friendlyName: 'Send password recovery email',


  description: 'Send a password recovery notification to the user with the specified email address.',


  inputs: {

    emailAddress: {
      description: 'The email address of the alleged user who wants to recover their password.',
      example: 'rydahl@example.com',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'The email address matched a user in the database, and an email was probably sent.'
    },

  },


  fn: async function (inputs, exits) {

    // Check that all required Mailgun credentials are set up.
    if (!sails.config.custom.enableEmailFeatures) {

      var errMsg = 'Cannot deliver password recovery email because:\n';
      if (!sails.config.custom.mailgunApiKey) {
        errMsg += ' • a Mailgun API key is missing from this app\'s configuration (`sails.config.custom.mailgunApiKey`)\n';
      }
      if (!sails.config.custom.mailgunDomain) {
        errMsg += ' • a Mailgun domain is missing from this app\'s configuration (`sails.config.custom.mailgunDomain`)\n';
      }

      errMsg += '\n'+
      'To enable password recovery emails, you\'ll need to add the missing config variables to your custom config in either '+
      '`config/custom.js` or `config.local.js`.'+
      '\n'+
      '(If you don\'t have a Mailgun domain or API key, you can sign up at https://mailgun.com to receive a sandbox domain and test API key.)';

      return exits.error(new Error(errMsg));
    }
    // --•

    // Find the record for this user.
    var userRecord = await User.findOne({ emailAddress: inputs.emailAddress });
    if (!userRecord) {
      // Pretend it worked.
      return exits.success();
    }

    // Generate a reset token
    // https://github.com/substack/node-password-reset/blob/master/index.js
    var buf = new Buffer(16);
    for(var i = 0; i < buf.length; i++) {
      buf[i] = Math.floor(Math.random() * 256);
    }

    var token = encodeURI(buf.toString('base64'));

    // Store the token on the user record
    // (This allows us to look up the user when the link from the email is clicked.)
    await User.update({ id: userRecord.id }).set({
      passwordResetToken: token
    });

    // Send email
    await sails.helpers.sendTemplateEmail({
      to: inputs.emailAddress,
      subject: 'Password reset instructions',
      template: 'email-reset-password',
      templateData: {
        fullName: userRecord.fullName,
        token: token
      }
    });

    return exits.success();

  }


};
