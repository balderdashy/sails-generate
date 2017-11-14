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

    // Build a summary string for the incoming message.
    var messageSummary =
    'From: ' + inputs.humanName + ' <' + inputs.emailAddress + '>\n\n' +
    'Topic: ' + inputs.topic + '\n\n' +
    'Message: \n\n' + inputs.message;


    // Check that an internal recipient email address is configured,
    // and that all required Mailgun credentials are set up.
    if (!sails.config.custom.enableEmailFeatures) {

      var errMsg = 'Cannot deliver incoming message from contact form because:\n';
      if (!sails.config.custom.internalEmailAddress) {
        errMsg += ' • there is no internal email address configured for this app (`sails.config.custom.internalEmailAddress`)\n';
      }
      if (!sails.config.custom.mailgunApiKey) {
        errMsg += ' • a Mailgun API key is missing from this app\'s configuration (`sails.config.custom.mailgunApiKey`)\n';
      }
      if (!sails.config.custom.mailgunDomain) {
        errMsg += ' • a Mailgun domain is missing from this app\'s configuration (`sails.config.custom.mailgunDomain`)\n';
      }

      errMsg += '\n'+
      'To enable contact form emails, you\'ll need to add the missing config variables to your custom config in either '+
      '`config/custom.js` or `config.local.js`.'+
      '\n'+
      '(If you don\'t have a Mailgun domain or API key, you can sign up at https://mailgun.com to receive a sandbox domain and test API key.)';

      errMsg += '\n\n'+
      'Here is a summary of the incoming correspondence, just so we at least have it in our logs:\n'+
      '------------------\n'+
      messageSummary+'\n'+
      '------------------';
      return exits.error(new Error(errMsg));
    }
    // --•


    //  ╔═╗╔═╗╔╗╔╔╦╗  ┌─┐┌─┐┌┐┌┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌┬┐┌─┐┬┬
    //  ╚═╗║╣ ║║║ ║║  │  │ ││││ │ ├─┤│   │   ├┤ │││├─┤││
    //  ╚═╝╚═╝╝╚╝═╩╝  └─┘└─┘┘└┘ ┴ ┴ ┴└─┘ ┴   └─┘┴ ┴┴ ┴┴┴─┘
    await sails.helpers.sendTemplateEmail({
      to: sails.config.custom.internalEmailAddress,
      subject: 'New Contact Form Message',
      template: 'admin/email-contact-form',
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
