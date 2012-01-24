/*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;


module.exports.index = exports.list_posts = function( req, res ) {
  
	Post.find( function ( err, posts ) {
		res.render( 'index.ejs', { title: 'Circa', posts: posts.reverse() } );
		
	} )

};


/*
 * Handler to create new post
 */	

module.exports.create_post = function( data, socket ) {

	new Post( { title: data.title, content: data.content, latitude: data.latitude, longitude: data.longitude, location: data.location }
	 ).save( function (err) {
		
		if ( !err ) {
			console.log( 'Success!' );
			
			// Emit message to all other sockets
			socket.broadcast.emit( 'new_post_created', data );
			
			// Also emit message to the socket that created it
			socket.emit( 'new_post_created', data );
			
		} else {
			console.log( 'Had an error' + err );
		}
		

	} );

};

/**** WTG START ****/

module.exports.get_posts = function( req, res ) {
  console.log( util.inspect( req.query ) );

  var lat = Number(req.query.latitude);
  var lon = Number(req.query.longitude);

	var lattol = Number(.0000938609166667);
    var lontol = Number(.00009333233333322);
	console.log("lat1 is " + lat);
	console.log("lat-tol " + (lat-lattol));
		console.log("lat+tol " + (lat+tolerance));

  Post
  .where('latitude').gte(lat-lattol)
  .where('latitude').lte(lat+lattol)
  .where('longitude').gte(lon-lontol)
  .where('longitude').lte(lon+lontol)
  .run( function( err, posts ) {

    res.send( { posts: JSON.stringify( posts ) } );
    console.log("lat2 is " + lat);
  } ) 
};

/**** WTG STOP ****/