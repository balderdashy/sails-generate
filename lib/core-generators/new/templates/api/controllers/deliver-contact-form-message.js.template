module.exports = {


  friendlyName: 'Deliver contact form message',


  description: 'Deliver a contact form message to the appropriate internal channel(s).',


  inputs: {

    emailAddress: {
      description: 'A return email address where we can respond, e.g. "hermione@hogwarts.edu".',
      type: 'string',
      required: true
    },

    topic: {
      description: 'The topic chosen from the contact form dropdown, e.g. "I want to buy stuff".',
      type: 'string',
      required: true
    },

    humanName: {
      description: 'The full name of the human sending this message, e.g. "Hermione Granger".',
      type: 'string',
      required: true
    },

    message: {
      description: 'The custom message, in plain text.',
      type: 'string',
      required: true
    },

  },


  exits: {

    success: {
      description: 'The message was sent successfully.'
    }

  },


  fn: async function(inputs, exits) {

    await sails.helpers.sendTemplateEmail({
      to: sails.config.custom.internalEmailAddress,
      subject: 'New Contact Form Message',
      template: 'internal/email-contact-form',
      layout: false,
      templateData: {
        contactName: inputs.humanName,
        contactEmail: inputs.emailAddress,
        topic: inputs.topic,
        message: inputs.message
      }
    });

    return exits.success();

  }


};
