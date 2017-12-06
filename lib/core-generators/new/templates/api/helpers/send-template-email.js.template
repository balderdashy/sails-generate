module.exports = {


  friendlyName: 'Send template email',


  description: 'Send an email using a template.',


  extendedDescription:
`To ease testing and development, if the provided "to" email address ends in "@example.com",
then the email message will be written to the terminal instead of actually being sent.
(Thanks [@simonratner](https://github.com/simonratner)!)`,


  inputs: {

    template: {
      description: 'The relative path to an EJS template within our `views/emails/` folder -- WITHOUT the file extension.',
      extendedDescription:
`Use strings like "foo" or "foo/bar", but NEVER "foo/bar.ejs".  For example, "marketing/welcome" would send an email
using the "views/emails/marketing/welcome.ejs" template.`,
      example: 'reset-password',
      type: 'string',
      required: true
    },

    templateData: {
      description: 'A dictionary of data which will be accessible in the EJS template.',
      extendedDescription:
`Each key will be a local variable accessible in the template.  For instance, if you supply
a dictionary with a \`friends\` key, and \`friends\` is an array like \`[{name:"Chandra"}, {name:"Mary"}]\`),
then you will be able to access \`friends\` from the template:
\`\`\`
<ul><% for (friend of friends){ %>
  <li><%= friend.name %></li><% }); %></ul>
\`\`\`

This is EJS, so use \`<%= %>\` to inject the HTML-escaped content of a variable,
\`<%= %>\` to skip HTML-escaping and inject the data as-is, or \`<% %>\` to execute
some JavaScript code such as an \`if\` statement or \`for\` loop.`,
      type: {},
      defaultsTo: {}
    },

    to: {
      description: 'The email address of the primary recipient.',
      extendedDescription:
`If this is any address ending in "@example.com", then don't actually deliver the message.
Instead, just log it to the console.`,
      example: 'foo@bar.com',
      required: true
    },

    subject: {
      description: 'The subject of the email.',
      example: 'Hello there.',
      defaultsTo: ''
    },

    layout: {
      description:
      'Set to `false` to disable layouts altogether, or provide the path (relative '+
      'from `views/layouts/`) to an override email layout.',
      defaultsTo: 'layout-email',
      custom: (layout)=>layout===false || _.isString(layout)
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Email delivery report',
      outputDescription: 'A dictionary of information about what went down.',
      outputType: {
        loggedInsteadOfSending: 'boolean'
      }
    }

  },


  fn: async function(inputs, exits) {

    var path = require('path');
    var url = require('url');
    var util = require('util');

    // TODO: fix this up
    // // Check that all required Mailgun credentials are set up.
    // if (!sails.config.custom.enableEmailFeatures) {

    //   var errMsg = 'Cannot deliver password recovery email because:\n';
    //   if (!sails.config.custom.mailgunApiKey) {
    //     errMsg += ' • a Mailgun API key is missing from this app\'s configuration (`sails.config.custom.mailgunApiKey`)\n';
    //   }
    //   if (!sails.config.custom.mailgunDomain) {
    //     errMsg += ' • a Mailgun domain is missing from this app\'s configuration (`sails.config.custom.mailgunDomain`)\n';
    //   }

    //   errMsg += '\n'+
    //   'To enable password recovery emails, you\'ll need to add the missing config variables to your custom config in either '+
    //   '`config/custom.js` or `config.local.js`.'+
    //   '\n'+
    //   '(If you don\'t have a Mailgun domain or API key, you can sign up at https://mailgun.com to receive a sandbox domain and test API key.)';

    //   throw new Error(errMsg);
    // }

    // // Build a summary string for the incoming message.
    // var messageSummary =
    // 'From: ' + inputs.humanName + ' <' + inputs.emailAddress + '>\n\n' +
    // 'Topic: ' + inputs.topic + '\n\n' +
    // 'Message: \n\n' + inputs.message;


    // // Check that an internal recipient email address is configured,
    // // and that all required Mailgun credentials are set up.
    // if (!sails.config.custom.enableEmailFeatures) {

    //   var errMsg = 'Cannot deliver incoming message from contact form because:\n';
    //   if (!sails.config.custom.internalEmailAddress) {
    //     errMsg += ' • there is no internal email address configured for this app (`sails.config.custom.internalEmailAddress`)\n';
    //   }
    //   if (!sails.config.custom.mailgunApiKey) {
    //     errMsg += ' • a Mailgun API key is missing from this app\'s configuration (`sails.config.custom.mailgunApiKey`)\n';
    //   }
    //   if (!sails.config.custom.mailgunDomain) {
    //     errMsg += ' • a Mailgun domain is missing from this app\'s configuration (`sails.config.custom.mailgunDomain`)\n';
    //   }

    //   errMsg += '\n'+
    //   'To enable contact form emails, you\'ll need to add the missing config variables to your custom config in either '+
    //   '`config/custom.js` or `config.local.js`.'+
    //   '\n'+
    //   '(If you don\'t have a Mailgun domain or API key, you can sign up at https://mailgun.com to receive a sandbox domain and test API key.)';

    //   errMsg += '\n\n'+
    //   'Here is a summary of the incoming correspondence, just so we at least have it in our logs:\n'+
    //   '------------------\n'+
    //   messageSummary+'\n'+
    //   '------------------';
    //   return exits.error(new Error(errMsg));
    // }


    if (!_.startsWith(path.basename(inputs.template), 'email-')) {
      sails.log.warn(
        'The "template" that was passed in to `sendTemplateEmail()` does not begin with '+
        '"email-" -- but by convention, all email template files in `views/emails/` should '+
        'be namespaced in this way.  (This makes it easier to look up email templates by '+
        'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n'+
        'Continuing regardless...'
      );
    }

    if (_.startsWith(inputs.template, 'views/') || _.startsWith(inputs.template, 'emails/')) {
      throw new Error(
        'The "template" that was passed in to `sendTemplateEmail()` was prefixed with\n'+
        '`emails/` or `views/` -- but that part is supposed to be omitted.  Instead, please\n'+
        'just specify the path to the desired email template relative from `views/emails/`.\n'+
        'For example:\n'+
        '  template: \'email-reset-password\'\n'+
        'Or:\n'+
        '  template: \'admin/email-contact-form\'\n'+
        ' [?] If you\'re unsure or need advice, see https://sailsjs.com/support'
      );
    }//•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', inputs.template);
    var layout;
    if (inputs.layout) {
      layout = path.relative(path.dirname(emailTemplatePath), path.resolve('layouts/', inputs.layout));
    } else {
      layout = false;
    }

    // Compile HTML template.
    var htmlEmailContents = await sails.renderView(emailTemplatePath, _.extend({
      // Set special layout for emails.
      // > Note: We also could set `layout: false` to disable layouts altogether.
      layout: layout,
      // Provide access to core `url` package (for building links and image srcs, etc.)
      url: url,
      // Provide access to core `util` package (for dumping debug data in internal emails)
      util: util
    }, inputs.templateData))
    .intercept((err)=>{
      err.message =
      'Could not compile view template.\n'+
      '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
      'Details:\n'+
      err.message;
      return err;
    });

    // Sometimes only log info to the console about the email that WOULD have been sent.
    // Specifically, if the "To" email address is anything "@example.com".
    //
    // > This is used below when determining whether to actually send the email,
    // > for convenience during development, but also for safety.  (For example,
    // > a special-cased version of "user@example.com" is used by Trend Micro Mars
    // > scanner to "check apks for malware".)
    var isToAddressConsideredFake = Boolean(inputs.to.match(/@example\.com$/i));
    if (sails.config.environment === 'test' || isToAddressConsideredFake) {
      sails.log(
`Skipped sending email, either because the current \`sails.config.environment\`
is set to "test", or because the "To" email address looked fake.
But anyway, here is what WOULD have been sent:
-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-
To: ${inputs.to}
Subject: ${inputs.subject}

Body:
${htmlEmailContents}
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`);
    } else {
      // Otherwise actually send the email.
      await sails.stdlib('mailgun').sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        toEmail: inputs.to,
        subject: inputs.subject,
        testMode: false
      });
    }//ﬁ

    // All done!
    return exits.success({
      loggedInsteadOfSending: isToAddressConsideredFake
    });

  }

};
