var posts_controller = require( './controllers/posts_controller.js' );

var socket_listeners = [

  { event: 'create_post', handler: posts_controller.create_post }
 

];

module.exports = socket_listeners;