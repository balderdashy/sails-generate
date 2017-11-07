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
    logout:                    'POST  /api/v0/account/logout',
    updatePassword:            'PUT   /api/v0/account/update-password',
    updateProfile:             'PUT   /api/v0/account/update-profile',
    updateBillingCard:         'PUT   /api/v0/account/update-billing-card',
    login:                     'PUT   /api/v0/entrance/login',
    signup:                    'POST  /api/v0/entrance/signup',
    sendPasswordRecoveryEmail: 'POST  /api/v0/entrance/send-password-recovery-email',
    updatePasswordAndLogin:    'POST  /api/v0/entrance/update-password-and-login',
    contact:                   'POST  /api/v0/misc/contact',
  }

});
