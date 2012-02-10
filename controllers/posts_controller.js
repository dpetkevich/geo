/*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;

var i =0; 
var namelist = ["Masterblaster1", "loserface2", "googlybear3", "wanger4" ];

var list1 = ["1","2","3","4","5","6","7","8","9","10"];
var list2 = ["a","b","c","d","e","f","g","h","i","j","k","l"];



module.exports.index = exports.list_posts = function( req, res ) {
console.log("req.cookies.uname is " + req.cookies.uname);
var passCookie= req.cookies.uname;
if (passCookie !== undefined)
	{
		
		Post.find( function ( err, posts ) {

			
		res.render( 'index.ejs', { title: 'Circa', posts: posts.reverse() } );
		
		
	} )
	}

else{
	console.log("passcookie statement initiated");
	name = namelist[0];
namelist.push(name);
for(var j=0; j<((namelist.length)-1); j++)
{
	namelist[j]=namelist[(j+1)];
	

};
namelist.pop();


if (i<namelist.length)
{
	i++;
}
else{
	
i=0;

}
	Post.find( function ( err, posts ) {
		console.log("name in the else statement is" + name);
		res.cookie('uname', name , { maxAge: 10000 });
		res.render( 'index.ejs', { title: 'Circa', posts: posts.reverse() } );
		
		
	} )
	

}



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
		
		
		res.render( 'admin.ejs', { title: 'Circa' } );

	} );

};



/**** WTG START ****/

module.exports.get_posts = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
	var loc = req.query.location;
	
console.log("i at the beginning of the function is " + i);


//"houdini", "wow", "user2", "user 3"


  	
	
  Post
  .where('location', loc)
  .run( function( err, posts ) {

  	
  	
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