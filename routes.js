var posts_controller = require( './controllers/posts_controller.js' );

var routes = [

	{ method: "get", path: "/", handler: posts_controller.index },
	{ method: "post", path: "/", handler: posts_controller.create_post },
  	{ method: "get", path: "/get_posts", handler: posts_controller.get_posts }, // ADDED BY WTG
  	{ method: "get", path: "/admin!!5423", handler: posts_controller.admin_list },
  	{ method: "post", path: "/admin!!5423", handler: posts_controller.delete_post },
  	{ method: "get", path: "/get_admin_posts", handler: posts_controller.get_posts} 
 
]

module.exports = routes;
