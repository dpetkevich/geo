var posts_controller = require( './controllers/posts_controller.js' );

var socket_listeners = [

  { event: 'create_post', handler: posts_controller.create_post },
  { event: 'delete_post', handler: posts_controller.delete_post }

];

module.exports = socket_listeners;