/*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;

var list1 = require( '../models/adj.js' );
var list2 = require( '../models/noun.js' );
//var i =0; 
//var namelist = ["Masterblaster1", "loserface2", "googlybear3", "wanger4" ];

//var list1 = ["1","2","3","4"];
//var list2 = ["a","b","c","d"];



module.exports.index = exports.list_posts = function( req, res ) {



console.log("req.cookies.uname iholas " + req.cookies.uname);
var passCookie= req.cookies.uname;
if (passCookie !== undefined)
	{
		
		Post.find( function ( err, posts ) {

			
		res.render( 'index.ejs', { posts: posts.reverse() } );
		
		
	} )
	}

else{
	console.log("passcookie statement initiated");
	var indexa = Math.floor(Math.random()*list1.length);
	var indexb = Math.floor(Math.random()*list2.length);

	console.log("list1lenght is " + list1.length);
	name = list1[indexa] + list2[indexb];
	console.log('name is ' + name)

	Post.find( function ( err, posts ) {
		console.log("name in the else statement is" + name);
		console.log('posts are ' + posts)
		res.cookie('uname', name , { maxAge: 5400000 });
		res.render( 'index.ejs', {  posts: posts.reverse() } );
		
		
	} )
	
	}

};





module.exports.admin_list = exports.list_posts = function( req, res ) {
  
	Post.find( function ( err, posts ) {
		res.render( 'admin.ejs', {  posts: posts.reverse() } );
		
	} )

};


/*
 * Handler to create new post
 */	

module.exports.create_post = function( data, socket ) {

	
console.log("here's the create post method");

	new Post( {  content: data.content, latitude: data.latitude, longitude: data.longitude, location: data.location, username: data.username}
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

module.exports.delete_post = exports.list_posts =function (req,res ){
		
console.log("req.body in delete_post is " + req.body.post.id);
 Post.findOne( { _id: req.body.post.id}).remove( function (err, posts) {
		
		
		res.render( 'admin.ejs' );

	} );

};



/**** WTG START ****/

module.exports.get_posts = function( req, res ) {
  console.log( "req query is" + req.query.location );
	var loc = req.query.location;
	
console.log("loc is" + loc)


//"houdini", "wow", "user2", "user 3"


  	
	
  Post
  .find({"location":loc})
  .sort('date')
  .exec( function( err, posts ) {
  	console.log('the posts are '+ JSON.stringify(posts))
    res.send( { posts: JSON.stringify( posts ) } );
  	}) 
};

module.exports.admin_get  = function( req, res ) {
 //console.log( "req params is" + req.body.room.name );

  var loc = req.query.location;


  Post
  .where('location', loc)
  .exec( function( err, posts ) {

  		
        res.send( { posts: JSON.stringify( posts ) } );
  } ) 
  
 
};



/**** WTG STOP ****/