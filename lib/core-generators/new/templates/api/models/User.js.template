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
      maxLength: 200
      // e.g. "carol.reyna@microsoft.com"
    },

    password: {
      type: 'string',
      required: true,
      protect: true,
      // e.g. "2$28a8eabna301089103-13948134nad"
    },

    fullName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name',
      maxLength: 120
     // e.g. 'Microwave Jenny',
    },

    isSuperAdmin: {
      type: 'boolean'
    },

    passwordResetToken: {
      type: 'string'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
    },

    stripeCustomerId: {
      type: 'string',
      protect: true
    },

    billingCardBrand: {
      type: 'string',
      example: 'Visa'
    },

    billingCardLast4: {
      type: 'string',
      example: '4242'
    },

    billingCardExpMonth: {
      type: 'number',
      example: 11
    },

    billingCardExpYear: {
      type: 'number',
      example: 2023
    },

    emailProofToken: {
      type: 'string'
    },

    emailProofTokenExpiresAt: {
      type: 'number',
    },

    emailStatus: {
      type: 'string',
      isIn: ['pending', 'changed', 'confirmed'],
      defaultsTo: 'confirmed'
      // The confirmation status of the user's email.  Users created via invites already have "confirmed" addresses,
      // since they need to click an email link in order to complete signup (because they don't have passwords yet).
      // New users created via the signup form have "pending" emails until they click the confirmation email.
      // Existing users who want to change their email address have "changed" email status until they click
      // the  confirmation email.
    },

    emailChangeCandidate: {
      type: 'string'
      // The (unconfirmed) email address that an existing user wants to change to.
    },

    tosAcceptedByIp: {
      type: 'string',
      // The IP (ipv4) address of the request that accepted the terms of service
    },


    lastSeenAt: {
      type: 'number',
      description: 'The moment at which this user most recently interacted with the backend while logged in.',
      // e.g. 1502844074211
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
