module.exports = {


  friendlyName: 'Update billing card',


  description: 'Update the credit card for the logged-in user.',


  inputs: {

    stripeToken: {
      description: 'The single-use Stripe Checkout token identifier representing the user\'s payment source (i.e. credit card.)',
      example: 'tok_199k3qEXw14QdSnRwmsK99MH',
      type: 'string',
      required: true,
      moreInfoUrl: 'https://stripe.com/docs/stripe.js#card-createToken',
      whereToGet: { description: 'Stripe.js token is provided to the front-end code by Stripe after completing the checkout flow.' }
    },

    billingCardLast4: {
      required: true,
      type: 'string',
      example: '4242',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardBrand: {
      required: true,
      type: 'string',
      example: 'visa',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardExpMonth: {
      required: true,
      type: 'string',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardExpYear: {
      required: true,
      type: 'string',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

  },


  fn: async function (inputs, exits) {
    // Import dependencies
    var Stripe = require('machinepack-stripe');

    // Update the Stripe customer for this user.
    await Stripe.updateCustomer({
      source: inputs.stripeToken,
      customer: this.req.me.stripeCustomerId,
      apiKey: sails.config.custom.stripeSecret,
    });

    // Update the card info we have stored for this user.
    // > Remember, never store complete card numbers-- only the last 4 digits + expiration!
    // > Storing (or even receiving) complete, unencrypted card numbers would require PCI
    // > compliance in the U.S.
    await User.update({ id: this.req.me.id }, {
      billingCardBrand: inputs.billingCardBrand,
      billingCardLast4: inputs.billingCardLast4,
      billingCardExpMonth: ''+inputs.billingCardExpMonth,
      billingCardExpYear: ''+inputs.billingCardExpYear,
    });

    return exits.success();
  }


};
