var posts_controller = require( './controllers/posts_controller.js' );

var routes = [

	{ method: "get", path: "/", handler: posts_controller.index },
	{ method: "post", path: "/", handler: posts_controller.create_post },
  { method: "get", path: "/get_posts", handler: posts_controller.get_posts } // ADDED BY WTG

]

module.exports = routes;
