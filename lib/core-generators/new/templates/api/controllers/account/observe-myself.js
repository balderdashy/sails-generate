module.exports = {


  friendlyName: 'Observe myself',


  description: 'Subscribe to the logged-in user so that you receive socket broadcasts such as login notifications.',


  exits: {

    success: {
      description: 'The requesting socket is now subscribed to socket broadcasts about the logged-in user.',
    },

  },


  fn: async function ({}) {

    if (!this.req.isSocket) {
      throw new Error('This action is designed for use with the virtual request interpreter (over sockets, not traditional HTTP).');
    }

    User.subscribe(this.req, [ this.req.me.id ]);

  }


};
