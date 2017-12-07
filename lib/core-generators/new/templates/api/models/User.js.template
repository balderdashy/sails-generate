/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'The hashed password used to log in.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    fullName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name',
      maxLength: 120,
      example: 'Microwave Jenny'
    },

    isSuperAdmin: {
      type: 'boolean'
    },

    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password. Expires after 1 use, or after a set amount of time has elapsed.'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the expiration time of this user\'s `passwordResetToken`.',
      example: 1502844074211
    },

    stripeCustomerId: {
      type: 'string',
      protect: true,
      description: 'For retrieving/updating the Stripe customer record associated with this user.'
    },

    hasBillingCard: {
      type: 'boolean',
      description: 'Whether this user is linked with a Stripe customer entry that has a default payment source (i.e. credit card).'
    },

    billingCardBrand: {
      type: 'string',
      example: 'Visa',
     description: 'The type of credit card stored as this user\'s default Stripe payment source.'
    },

    billingCardLast4: {
      type: 'string',
      example: '4242',
      description: 'The last for digits of the credit card stored as this user\'s default Stripe payment source.'
    },

    billingCardExpMonth: {
      type: 'string',
      example: '08',
      description: 'The expiration month of the credit card stored as this user\'s default Stripe payment source, formatted as MM.'
    },

    billingCardExpYear: {
      type: 'string',
      example: '2023',
      description: 'The expiration year of the credit card stored as this user\'s default Stripe payment source, formatted as YYYY.'
    },

    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },

    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the expiration time of this user\'s `emailProofToken`.',
      example: 1502844074211
    },

    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      defaultsTo: 'confirmed',
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription:
`Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "changeRequested"
email status until they click the link in the confirmation email.`
    },

    emailChangeCandidate: {
      type: 'string',
      description: 'The (unconfirmed) email address that an existing user wants to change to.'
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service'
    },


    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in.',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a

  },


};
