module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in a "pending" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    fullName:  {
      required: true,
      type: 'string',
      example: 'Frida Kahlo de Rivera',
      description: 'The user\'s full name.',
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs, exits) {

    // Import dependencies
    var Stripe = require('machinepack-stripe');

    // Create a "Customer" for this user in the Stripe API.
    // (assuming billing feaures are enabled)
    var stripeCustomer;
    if (sails.config.custom.enableBillingFeatures) {
      stripeCustomer = await Stripe.createCustomer({
        description: inputs.fullName,
        email: inputs.emailAddress
      });
    }//ﬁ


    // Come up with a pseudorandom, probabilistically-unique token for use
    // in our initial account verification email.
    var emailProofToken = await sails.stdlib('strings').random({ style: 'url-friendly' });


    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create({
      emailAddress: inputs.emailAddress.toLowerCase(),
      password: await sails.stdlib('passwords').hashPassword({ password: inputs.password }),
      fullName: inputs.fullName,
      emailProofToken: sails.config.custom.enableEmailFeatures ? emailProofToken : undefined,
      emailProofTokenExpiresAt: sails.config.custom.enableEmailFeatures ? (Date.now() + sails.config.custom.emailProofTokenTTL) : undefined,
      stripeCustomerId: sails.config.custom.enableBillingFeatures ? stripeCustomer.id : undefined,
      emailStatus: sails.config.custom.enableEmailFeatures ? 'pending' : undefined,
      tosAcceptedByIp: this.req.ip// (https://sailsjs.com/documentation/reference/request-req/req-ip)<% if (verbose) {%>
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // ^Note that, for some use cases, this needs to be tracked to meet Stripe's KYC requirements.
      // For example:
      // https://stripe.com/docs/connect/updating-accounts#referencing-the-agreement
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -<% } %>
    })
    .intercept('E_UNIQUE', ()=>'emailAlreadyInUse')
    .intercept({name: 'UsageError'}, ()=>'invalid')
    .fetch();


    // --•
    // IWMIH (if we made it here), the user record was successfully created.

    // Store the user's new id in their session.<% if (verbose) {%>
    // > We can use this (`req.session.userId`) to authenticate this user's future
    // > requests-- i.e. to tell that they came from from a "logged in" user, and
    // > from _this_ user, in particular.  (That'll work until their session expires,
    // > we log them out, or they clear their cookies.)<% }%>
    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.enableEmailFeatures) {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail({
        to: inputs.emailAddress.toLowerCase(),
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: inputs.fullName,
          token: emailProofToken
        }
      });
    } else {
      sails.log.warn('Skipping new account email verification... (since email features are disabled)');
    }

    // Since everything went ok, trigger the success exit to send our 200 response.
    return exits.success();

  }

};
