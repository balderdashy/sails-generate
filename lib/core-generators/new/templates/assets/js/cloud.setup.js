/**
 * Module dependencies
 */

// N/A


/**
 * cloud.setup.js
 *
 * Configuration for the global SDK (`Cloud`).
 *
 * > Above all,the purpose of this file is to provide endpoint definitions,
 * > each of which corresponds with one particular route+action on the server.
 */

Cloud.setup({

  methods: {
    logout:                    'POST  /api/v0.0/account/logout',
    updatePassword:            'PUT   /api/v0.0/account/update-password',
    updateProfile:             'PUT   /api/v0.0/account/update-profile',
    updateBillingCard:         'PUT   /api/v0.0/account/update-billing-card',
    login:                     'PUT   /api/v0.0/entry/login',
    signup:                    'POST  /api/v0.0/entry/signup',
    sendPasswordRecoveryEmail: 'POST  /api/v0.0/entry/send-password-recovery-email',
    updatePasswordAndLogin:    'POST  /api/v0.0/entry/update-password-and-login',
    contact:                   'POST  /api/v0.0/misc/contact',
  }

});
