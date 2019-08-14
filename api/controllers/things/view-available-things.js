module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function () {

    var url = require('url');

    var me = await User.findOne({
      id: this.req.me.id
    }).populate('friends');

    var friendIds = _.map(me.friends, 'id');

    let things = await Thing.find({
      or: [
        { owner: this.req.me.id },
        { owner: { in: friendIds} }
      ]
    });

    _.each(things, (thing) => {
      thing.imageSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/things/' + thing.id);
      delete thing.imageUploadFd;
      delete thing.imageUploadMime;
    });
    // Respond with view.
    return {things, currentSection: 'things'};

  }


};
