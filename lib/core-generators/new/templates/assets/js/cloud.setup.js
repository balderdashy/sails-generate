/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"viewSignup":{"verb":"GET","url":"/signup"},"confirmEmail":{"verb":"GET","url":"/email/confirm"},"viewLogin":{"verb":"GET","url":"/login"},"viewForgotPassword":{"verb":"GET","url":"/password/forgot"},"viewNewPassword":{"verb":"GET","url":"/password/new"},"viewAccountOverview":{"verb":"GET","url":"/account"},"viewChangePassword":{"verb":"GET","url":"/account/password"},"viewEditProfile":{"verb":"GET","url":"/account/profile"},"logout":{"verb":"GET","url":"/api/v0/account/logout"},"updatePassword":{"verb":"PUT","url":"/api/v0/account/update-password"},"updateProfile":{"verb":"PUT","url":"/api/v0/account/update-profile"},"updateBillingCard":{"verb":"PUT","url":"/api/v0/account/update-billing-card"},"login":{"verb":"PUT","url":"/api/v0/entrance/login"},"signup":{"verb":"POST","url":"/api/v0/entrance/signup"},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v0/entrance/send-password-recovery-email"},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v0/entrance/update-password-and-login"},"deliverContactFormMessage":{"verb":"POST","url":"/api/v0/deliver-contact-form-message"}}
  /* eslint-enable */

});
