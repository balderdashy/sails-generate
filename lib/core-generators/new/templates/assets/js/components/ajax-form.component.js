/**
 * Module dependencies
 */

// N/A


/**
 * <ajax-form>
 *
 * • If "action" is provided, then the "aterSubmit" event will be emitted,
 *   but the "submit" event will NOT be emitted.  And vice versa.
 *
 * • Also note that, if "action" is NOT provided, then `cloud-error` and
 *   "handle-parsing" props are ignored.
 *
 * @type {Component}
 */

parasails.registerComponent('ajaxForm', {

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠╣ ╠═╣║  ║╣
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╚  ╩ ╩╚═╝╚═╝
  props: ['syncing', 'action', 'handleParsing', 'cloudError'],

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Note:
  // Some of these props rely on the `.sync` modifier re-introduced in Vue 2.3.x.
  // For more info, see: https://vuejs.org/v2/guide/components.html#sync-Modifier
  //
  // Specifically, these special props are:
  // • syncing
  // • cloudError
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  //  ╔╦╗╔═╗╦═╗╦╔═╦ ╦╔═╗
  //  ║║║╠═╣╠╦╝╠╩╗║ ║╠═╝
  //  ╩ ╩╩ ╩╩╚═╩ ╩╚═╝╩
  template: `
  <form class="ajax-form" @submit.prevent="submit()">
    <slot name="default"></slot>
  </form>
  `,

  //  ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
    };
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {

  },

  mounted: function (){

  },

  beforeDestroy: function() {

  },

  //  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  //  ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  //  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  methods: {

    submit: async function () {
      // Prevent double-posting.
      if (this.syncing) { return; }

      if (!this.action) {
        this.$emit('submit');
      }
      else {
        if (!_.isFunction(this.handleParsing)) {
          throw new Error('If `action` is set, then `handle-parsing` should also be provided as a function!  For example: `:handle-parsing="handleParsingSomeForm"`.  This function should return a dictionary (plain JavaScript object) of "argins" -- that is, parsed form data, ready to be sent in a request to the server.');
        }

        if (!_.isString(this.action) || !_.isFunction(Cloud[_.camelCase(this.action)])) {
          throw new Error('If `action` is set, it should be the name of a method on the `Cloud` global.  For example: `action="login"` would make this form communicate using `Cloud.login()`.');
        }
        else if (!_.isFunction(Cloud[this.action])) {
          throw new Error('Unrecognized `action` in <ajax-form>.  Did you mean to type `action="'+_.camelCase(this.action)+'"`?  (<ajax-form> expects `action` to be provided in camlCase format.  In other words, write an action from "api/controllers/foo/bar/do-something" as "doSomething".)');
        }


        // Clear the userland "cloudError" prop.
        this.$emit('update:cloudError', '');


        // Run the provided "handle-parsing" logic.
        // > This clears out any pre-existing error messages, performs any additional client-side
        // > form validation checks, as well as any necessary data transformations to get the form
        // > data ready to be parsed as argins (and then eventually to be sent to the server.)
        var argins;
        try {
          argins = this.handleParsing();
        } catch (err) {
          // FUTURE: improve error message here w/ more context.
          throw err;
        }

        // If argins came back undefined, then avast.
        // (This means that parsing the form failed.)
        if (argins === undefined) {
          return;
        }

        if (!_.isObject(argins) || _.isArray(argins) || _.isFunction(argins)) {
          throw new Error('Invalid data returned from custom form parsing logic.  (Should return a dictionary of argins, like `{}`.)');
        }

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // FUTURE:
        // Parse and validate the provided data to ensure it's valid for this
        // cloud action.  (This also provides a basic level of client-side validation.)
        //
        // > See https://gist.github.com/mikermcneil/f0b7013998fd8c6f5c6aa79a7a9a298e
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

        // IWMIH, everything looks good.


        // Set syncing state to `true` on userland "syncing" prop.
        this.$emit('update:syncing', true);

        var didResponseIndicateFailure;
        var result = await Cloud[this.action](argins)
        .tolerate((err)=>{
          // When a cloud error occurs, tolerate it, but set the userland "cloudError" prop accordingly.
          this.$emit('update:cloudError', err.exit || 'error');
          didResponseIndicateFailure = true;
        });

        // Set syncing state to `false` on userland "syncing" prop.
        this.$emit('update:syncing', false);


        // If the server says we were successful, then emit the "after-submitting" event.
        if (!didResponseIndicateFailure) {
          this.$emit('after-submitting', result);
        }

      }

    },

  }

});
