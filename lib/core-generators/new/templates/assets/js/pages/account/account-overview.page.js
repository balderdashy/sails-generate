parasails.registerPage('account-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    me: { /* ... */ },

    isBillingEnabled: false,

    hasBillingCard: false,

    // Syncing/loading states for this page.
    syncingUpdateCard: false,
    syncingRemoveCard: false,

    // Form data
    formData: { /* … */ },

    // For tracking error submitting the Stripe checkout form.
    stripeError: false,

    // Server error state for the form
    cloudError: '',

    // For the Stripe checkout window
    checkoutHandler: undefined,

    // For the confirmation modal:
    removeCardModalVisible: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function (){
    _.extend(this, window.SAILS_LOCALS);

    this.isBillingEnabled = !!this.stripePublishableKey;

    // Determine whether there is billing info for this user.
    this.hasBillingCard = (
      this.me.billingCardBrand &&
      this.me.billingCardLast4 &&
      this.me.billingCardExpMonth &&
      this.me.billingCardExpYear
    );

    // Initialize the stripe checkout handler, if billing is configured for this app.
    // (This uses the publishable key was passed down in the view locals.)
    if(this.isBillingEnabled) {
      this.checkoutHandler = StripeCheckout.configure({
        key: this.stripePublishableKey
      });
    }

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    clickStripeCheckoutButton: function() {
      // Prevent double-posting if it's still loading.
      if(this.syncingUpdateCard) { return; }

      // Clear out error states.
      this.stripeError = false;
      this.cloudError = false;

      // Open Stripe checkout.
      this.checkoutHandler.open({
        name: 'NEW_APP_NAME',
        description: 'Link your credit card.',
        panelLabel: 'Save card',
        email: this.me.emailAddress,
        locale: 'auto',
        zipCode: true,
        allowRememberMe: false,

        // After payment info has been successfully added:
        token: async (stripeData)=> {
          // If there were any issues such that a Stripe token couldn't be obtained,
          // then just immediately set our stripe error flag and avast (don't proceed
          // any further.)
          if(!stripeData.id) {
            this.stripeError = true;
            return;
          }

          // Normalize billing card info from Stripe.
          var billingCardLast4 = stripeData.card.last4;
          var billingCardBrand = stripeData.card.brand;
          var billingCardExpMonth = String(stripeData.card.exp_month);
          var billingCardExpYear = String(stripeData.card.exp_year);

          // Update the card info for this user.
          this.syncingUpdateCard = true;
          await Cloud.updateBillingCard({
            stripeToken: stripeData.id,
            billingCardLast4,
            billingCardBrand,
            billingCardExpMonth,
            billingCardExpYear
          }).tolerate((err)=>{
            this.cloudError = true;
          })
          this.syncingUpdateCard = false;

          // Upon success, update billing info in the UI.
          if (!this.cloudError) {
            Object.assign(this.me, {
              billingCardLast4,
              billingCardBrand,
              billingCardExpMonth,
              billingCardExpYear
            });
            this.hasBillingCard = true;
          }

        }//Œ

      });
    },

    clickRemoveCardButton: function() {
      this.removeCardModalVisible = true;
    },

    closeRemoveCardModal: function() {
      this.removeCardModalVisible = false;
      this.cloudError = false;
    },

    submittedRemoveCardForm: function() {

      // Update billing info on success.
      this.me.billingCardLast4 = undefined;
      this.me.billingCardBrand = undefined;
      this.me.billingCardExpMonth = undefined;
      this.me.billingCardExpYear = undefined;
      this.hasBillingCard = false;

      // Close the modal and clear it out.
      this.closeRemoveCardModal();

    },

    handleParsingRemoveCardForm: function() {
      return {
        // Set to empty string to indicate the default payment source
        // for this customer is being completely removed.
        stripeToken: ''
      };
    },

  }
});
