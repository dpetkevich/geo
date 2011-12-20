var posts_controller = require( './controllers/posts_controller.js' );

var routes = [

	{ method: "get", path: "/", handler: posts_controller.index },
	{ method: "post", path: "/", handler: posts_controller.create_post }

]

module.exports = routes;
