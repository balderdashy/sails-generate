/**
 * <modal>
 *
 * @type {Component}
 */

parasails.registerComponent('modal', {

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠╣ ╠═╣║  ║╣
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╚  ╩ ╩╚═╝╚═╝
  props: [ 'large' ],

  //  ╔╦╗╔═╗╦═╗╦╔═╦ ╦╔═╗
  //  ║║║╠═╣╠╦╝╠╩╗║ ║╠═╝
  //  ╩ ╩╩ ╩╩╚═╩ ╩╚═╝╩
  template: `
  <transition name="modal" v-on:leave="leave" v-bind:css="false">
    <div class="modal fade clog-modal" tabindex="-1" role="dialog">
      <div class="petticoat"></div>
      <div class="modal-dialog custom-width" :class="large ? 'modal-lg' : ''" role="document">
        <div class="modal-content">
          <slot></slot>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
  </transition>
  `,

  //  ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      // Spinlock used for preventing trying to close the bootstrap modal more than once.
      // (in practice it doesn't seem to hurt anything if it tries to close more than once,
      // but still.... better safe than sorry!)
      _bsModalIsAnimatingOut: false
    };
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  mounted: function (){

    // Immediately call out to the bootstrap modal and tell it to show itself.
    $(this.$el).modal({
      // Set the modal backdrop to the 'static' option, which means it doesn't close the modal
      // when clicked.
      backdrop: 'static',
      show: true
    });

    // Attach listener for underlying custom modal closing event,
    // and when that happens, have Vue emit a custom "close" event.
    // (Note: This isn't just for convenience-- it's crucial that
    // the parent logic can use this event to update its scope.)
    var vm = this;
    $(this.$el).on('hide.bs.modal', ()=>{
      vm._bsModalIsAnimatingOut = true;
      vm.$emit('close');
    });//ƒ

    // Attach listener for underlying custom modal "opened" event,
    // and when that happens, have Vue emit our own custom "opened" event.
    // This is so we know when the entry animation has completed, allows
    // us to do cool things like auto-focus the first input in a form modal.
    $(this.$el).on('shown.bs.modal', ()=>{
      vm.$emit('opened');
      $(vm.$el).off('shown.bs.modal');
    });//ƒ

  },


  //  ╔═╗╦  ╦╔═╗╔╗╔╔╦╗╔═╗
  //  ║╣ ╚╗╔╝║╣ ║║║ ║ ╚═╗
  //  ╚═╝ ╚╝ ╚═╝╝╚╝ ╩ ╚═╝
  methods: {

    leave: function (el, done) {
      // console.log('fired "leave"');

      // If this shutting down was spawned by the bootstrap modal's built-in logic,
      // then we'll have already begun animating the modal shut.  So we check our
      // spinlock to make sure.  If it turns out that we HAVEN'T started that process
      // yet, then we go ahead and start it now.
      if (!this._bsModalIsAnimatingOut) {
        $(this.$el).modal('hide');
      }//ﬁ

      // When the bootstrap modal finishes animating into nothingness, unbind all
      // the DOM events used by bootstrap, and then call `done()`, which passes
      // control back to Vue and lets it finish the job (i.e. afterLeave).
      //
      // > Note that the other lifecycle callbacks like `destroyed` were actually
      // > fired LONG AGO.  This is confusing IMO, but the way it works, apparently.
      // >
      // > Also note that, since we're long past the `destroyed` point of the lifecycle
      // > here, we also can't call `.$emit()` anymore.  So for example, we wouldn't be
      // > able to emit a "fullyClosed" event, for example -- because by the time it'd
      // > be appropriate to emit the Vue event, our context for triggering it (i.e. the
      // > relevant instance of this component) will no longer be capable of emitting
      // > custom Vue events (presumably because it is no longer "reactive").
      // >
      // > For more info, see:
      // > https://github.com/vuejs/vue-router/issues/1302#issuecomment-291207073
      var vm = this;
      $(vm.$el).on('hidden.bs.modal', ()=>{
        $(vm.$el).off('hide.bs.modal');
        $(vm.$el).off('hidden.bs.modal');
        $(vm.$el).off('shown.bs.modal');
        done();
      });//_∏_

    },

  }

});
