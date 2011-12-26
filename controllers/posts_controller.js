/*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;


module.exports.index = exports.list_posts = function( req, res ) {
  
	Post.find( function ( err, posts ) {
		res.render( 'index.ejs', { title: 'CrushFlow', posts: posts.reverse() } );
		
	} )

};


/*
 * Handler to create new post
 */	

module.exports.create_post = function( data, socket ) {

	new Post( { title: data.title, content: data.content, latitude: data.latitude, longitude: data.longitude }
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
console.log( util.inspect( req ) );

  	var lat = req.body.latitude;
	var lon = req.body.longitude;
	var tolerance = 100;
	console.log("lat1 is " + lat);
  Post
  .where('latitude').lte(0)
  //.lte(lat+tolerance)
  //.where('longtiude').gte(lon-tolerance).lte(lon+tolerance)
  .run( function( err, posts ) {

    res.send( { posts: JSON.stringify( posts ) } );
    console.log("lat2 is " + lat);
  } ) 
};

/**** WTG STOP ****/