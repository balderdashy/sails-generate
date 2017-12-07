module.exports = {


  friendlyName: 'Update profile',


  description: 'Update the profile for the logged-in user.',


  inputs: {

    fullName: {
      required: true,
      type: 'string'
    },

    emailAddress: {
      required: true,
      type: 'string'
    },

  },


  exits: {

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs, exits) {

    // TODO: Condense the code below

    // Determine whether the email address changed, or whether a pending change is being cancelled.
    var changeEmailAddress;
    var cancelPendingEmailChange;
    // If the logged-in user doesn't have an `emailChangeCandidate`, and the email passed in
    // does not match their current email address, then the email will be updated.
    if (!this.req.me.emailChangeCandidate && inputs.emailAddress.toLowerCase() !== this.req.me.emailAddress) {
      changeEmailAddress = true;
    }
    // Otherwise, if the logged-in user has an `emailChangeCandidate` already, and the email address
    // provided matches the user's current email address, then we are cancelling a pending change
    // and NOT changing the email address.
    else if (this.req.me.emailChangeCandidate && inputs.emailAddress.toLowerCase() === this.req.me.emailAddress) {
      cancelPendingEmailChange = true;
    }
    // Otherwise, if the logged-in user has an `emailChangeCandidate` already, and the email address
    // provided does not match the current `emailChangeCandidate`, then the email will be updated.
    else if (this.req.me.emailChangeCandidate && inputs.emailAddress.toLowerCase() !== this.req.me.emailChangeCandidate) {
      changeEmailAddress = true;
    }
    // Otherwise, the email will not be updated.
    else {
      changeEmailAddress = false;
    }

    // If the email address is changing, make sure it is not already being used.
    if (changeEmailAddress) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: inputs.emailAddress.toLowerCase() },
          { emailChangeCandidate: inputs.emailAddress.toLowerCase() }
        ]
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }

    // Always update the user's name
    var changes = {
      fullName: inputs.fullName
    };

    // If the email is being changed AND email settings are configured, re-confirmation is required.
    if (changeEmailAddress && sails.config.custom.verifyEmailAddresses) {
      changes.emailProofToken = await sails.stdlib('strings').random('url-friendly');
      changes.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
      changes.emailStatus = this.req.me.emailStatus === 'pending' ? 'pending' : 'changed';
      changes.emailChangeCandidate = inputs.emailAddress;

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // FUTURE: we may not want to bother with an `emailChangeCandidate` for pending users.
      // Since they never had a confirmed email to begin with so it's not really a regression.
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    } else if(cancelPendingEmailChange) {
      // Clear out the email change candidate.
      changes.emailChangeCandidate = '';
      // If the email status is 'changed', we know the previous email address was confirmed.
      if(this.req.me.emailStatus === 'changed') {
        changes.emailProofToken = '';
        changes.emailProofTokenExpiresAt = 0;
        changes.emailStatus = 'confirmed';
      }
      // Otherwise, the previous email address was not confirmed.
      else {
        changes.emailProofToken = await sails.stdlib('strings').random('url-friendly');
        changes.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
        changes.emailStatus = 'pending';
      }
    }
    // If the email is being changed and re-confirmation is NOT required, just update the email address.
    else if(changeEmailAddress) {
      changes.emailAddress = inputs.emailAddress;
    }

    await User.update({id: this.req.me.id }, changes);

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (changeEmailAddress && sails.config.custom.verifyEmailAddresses) {
      // TODO: tweak this check ^^
      await sails.helpers.sendTemplateEmail({
        to: inputs.emailAddress.toLowerCase(),
        subject: 'Your account has been updated',
        template: 'email-verify-new-email',
        templateData: {
          fullName: inputs.fullName,
          token: changes.emailProofToken
        }
      });
    }

    return exits.success();

  }


};
