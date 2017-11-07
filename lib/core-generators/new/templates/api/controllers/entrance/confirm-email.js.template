module.exports = {


  friendlyName: 'Confirm email',


  description: 'Confirm a new user\'s email address, or an existing user\'s request for an email address change.',


  inputs: {
    token: {
      description: 'The confirmation token from the email.',
      example: '4-32fad81jdaf$329'
    }
  },


  exits: {

    success: {
      responseType: 'redirect'
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },

    alreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
      viewTemplatePath: '500',
    }

  },


  fn: async function (inputs, exits) {

    // Import the Stripe machinepack.
    var Stripe = require('machinepack-stripe');

    // If no token was provided, this is automatically invalid.
    if (!inputs.token) {
      return exits.invalidOrExpiredToken();
    }//•

    // Get the user with the matching email token.
    var user = await User.findOne({ emailProofToken: inputs.token });

    // If no such user exists, or their token is expired, bail.
    if (!user || parseInt(user.emailProofTokenExpiresAt) <= Date.now()) { return exits.invalidOrExpiredToken(); }

    // Last line of defense -- make sure no one else has this email (this should never happen).
    if (await User.findOne({ emailAddress: user.emailChangeCandidate })) {
      return exits.alreadyInUse();
    }

    // If the user's email status is `confirmed`, they shouldn't have a token.
    if (user.emailStatus === 'confirmed') {
      throw new Error('Consistency violation: user #' + user.id + ' has email status `confirmed`, but has an email proof token!');
    }

    var changingEmail = (user.emailStatus === 'changed');

    // Update the user.
    await User.update({ id: user.id }, {
      emailStatus: 'confirmed',
      emailChangeCandidate: '',
      emailProofToken: '',
      emailProofTokenExpiresAt: 0,
      emailAddress: changingEmail ? user.emailChangeCandidate : undefined
    });

    // Log the user in.
    // Store the user's id in their session, in case they aren't already logged in.
    this.req.session.userId = user.id;

    // If this was a change to an existing user's email...
    if (user.emailStatus === 'changed') {

      if (!user.emailChangeCandidate){
        throw new Error('Consistency violation: Could not update Stripe customer because `user.emailChangeCandidate` ("'+user.emailChangeCandidate+'") is missing.');
      }
      // If Stripe credentials are configured, either update this user's Stripe customer account,
      // or, if there is no Stripe customer for this user, create one.
      // (This could happen if Stripe credentials were not configured at the time this user was created.)
      if(sails.config.custom.enableBillingFeatures  && user.stripeCustomerId) {
        await Stripe.updateCustomer({
          apiKey: sails.config.custom.stripeSecret,
          customer: user.stripeCustomerId,
          email: user.emailChangeCandidate
        });
      }
      else if (sails.config.custom.enableBillingFeatures) {
        var stripeCustomer = await Stripe.createCustomer({
          description: inputs.fullName,
          email: inputs.emailAddress
        });
        await User.update({ id: user.id }, {
          stripeCustomerId: stripeCustomer.id,
        });
      }

      // Redirect the user to the "my account" page so they can see
      // their updated email address.
      return exits.success('/account');

    }//ﬁ

    // Otherwise this is a new user confirming their email for the first time, so
    // just redirect to the "email confirmed" success page.
    return exits.success('/email/confirmed');

  }


};
