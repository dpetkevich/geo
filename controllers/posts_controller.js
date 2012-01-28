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

module.exports.admin_list = exports.list_posts = function( req, res ) {
  
	Post.find( function ( err, posts ) {
		res.render( 'admin.ejs', { title: 'Circa', posts: posts.reverse() } );
		
	} )

};


/*
 * Handler to create new post
 */	

module.exports.create_post = function( data, socket ) {

	


	new Post( { title: data.title, content: data.content, latitude: data.latitude, longitude: data.longitude, location: data.location, username: username }
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
var i =0; 
var namelist = ["1", "2", "3", "4" ];
module.exports.get_posts = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
	var loc = req.query.location;
	
console.log("i at the beginning of the function is " + i);


//"houdini", "wow", "user2", "user 3"
name = namelist[0];
namelist.push(name);
console.log ("array before loop is  " + namelist);
for(var j=0; j<((namelist.length)-1); j++)
{
	namelist[j]=namelist[(j+1)];
	console.log("index j is " + namelist[j]);
	console.log("index j+1 is" + namelist[(j+1)]);

};
namelist.pop();
console.log ("array after loop is " + namelist);

if (i<namelist.length)
{
	i++;
}
else{
	
i=0;

}

  	
	
  Post
  .where('location', loc)
  .run( function( err, posts ) {

  	console.log("name is " + name);
  	res.cookie('uname', name , { maxAge: 5000 });
    res.send( { posts: JSON.stringify( posts ) } );
  } ) 
};

module.exports.admin_get  = function( req, res ) {
 //console.log( "req params is" + req.body.room.name );

  var loc = req.query.location;


  Post
  .where('location', loc)
  .run( function( err, posts ) {

  		
        res.send( { posts: JSON.stringify( posts ) } );
  } ) 
  
 
};



/**** WTG STOP ****/