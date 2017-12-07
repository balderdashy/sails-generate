/**
 * openStripeCheckout()
 *
 * Open the Stripe Checkout modal dialog and resolve when it is closed.
 *
 * -----------------------------------------------------------------
 * @param {String} stripePublishableKey
 * @param {String} billingEmailAddress
 * -----------------------------------------------------------------
 * @returns {Dictionary}
 *          e.g.
 *          {
 *            stripeToken: '…',
 *            billingCardLast4: '…',
 *            billingCardBrand: '…',
 *            billingCardExpMonth: '…',
 *            billingCardExpYear: '…'
 *          }
 */

parasails.registerUtility('openStripeCheckout', async function openStripeCheckout(stripePublishableKey, billingEmailAddress) {

  // Cache (& use cached) "checkout handler" globally on the page so that we
  // don't end up configuring it more than once (i.e. so Stripe.js doesn't
  // complain).
  var CACHE_KEY = '_cachedStripeCheckoutHandler';
  if (!window[CACHE_KEY]) {
    window[CACHE_KEY] = StripeCheckout.configure({
      key: stripePublishableKey
    });
  }
  var checkoutHandler = window[CACHE_KEY];


  // Build a Promise & send it back as our "thenable" (AsyncFunction's return value).
  // (this is necessary b/c we're wrapping an api that isn't `await`-compatible)
  return new Promise(function(resolve, reject){
    try {
      // Open Stripe checkout.
      checkoutHandler.open({
        name: 'NEW_APP_NAME',
        description: 'Link your credit card.',
        panelLabel: 'Save card',
        email: billingEmailAddress,
        locale: 'auto',
        zipCode: true,
        allowRememberMe: false,
        token: (stripeData)=> {
          // After payment info has been successfully added...
          if(!stripeData.id) {
            // If there was an uexpected issue such that a Stripe token couldn't be obtained,
            // then just immediately set our Stripe error flag and reject with a special
            // error.  (This should never happen, because Stripe.js should just throw instead
            // in this case.  Still, we handle it here, just in case.)
            let err = new Error('Could not obtain Stripe token.');
            err.code = 'E_COULD_NOT_OBTAIN_STRIPE_TOKEN';
            reject(err);
          } else {
            // Normalize token and billing card info from Stripe and resolve:
            let stripeToken = stripeData.id;
            let billingCardLast4 = stripeData.card.last4;
            let billingCardBrand = stripeData.card.brand;
            let billingCardExpMonth = String(stripeData.card.exp_month);
            let billingCardExpYear = String(stripeData.card.exp_year);

            resolve({
              stripeToken,
              billingCardLast4,
              billingCardBrand,
              billingCardExpMonth,
              billingCardExpYear
            });
          }//ﬁ
        }//Œ
      });//_∏_
    } catch (err) {
      reject(err);
    }
  });//_∏_

});
