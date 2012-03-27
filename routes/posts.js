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

exports.index = function( req, res ) {
  console.log("req.cookies.uname is " + req.cookies.uname);
  var passCookie= req.cookies.uname;

  var name = req.cookies.uname;

  if(!name) {
    a = Math.floor(Math.random()*list1.length);
    b = Math.floor(Math.random()*list2.length);
    name = list1[a] + list2[a]
    res.cookie('uname', name, { maxAge: 5400000});
  }
  res.render( 'index.ejs');
};

/*
 * Handler to create new post
 */	

exports.create_post = function( data ) {

  socket = this;
	new Post( {
    content: data.content, 
    location: data.location, 
    place: data.place, 
    username: data.username
  }).save( function (err) {
		if ( err ) throw err;
    partial("_postbox.jade", function(err, data) {
      if (err) throw err;

      // Emit message to all other sockets
      socket.broadcast.emit( 'new_post_created', data );

      // Also emit message to the socket that created it
      socket.emit( 'new_post_created', data );
    })
		
    console.log("post created")
	});
};

exports.list_posts =function (req,res ){
		
  console.log("req.body in delete_post is " + req.body.post.id);
  Post.findOne( { _id: req.body.post.id}).remove( function (err, posts) {
		res.render( 'admin.ejs' );
	} );
};

/**** WTG START ****/

exports.get_posts = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
	var lat = req.query.lat;
  var lon = req.query.lon;
	

  Post.find({})
  //.where('location')
  //.near([lon, lat])
  //.maxDistance(1)
  .desc('date')
  .limit(25)
  .run( function( err, posts ) {
    html = "";
    for( p in posts) {
      console.log(posts[p].content)
      partial("_postbox.jade", {post: posts[p]}, function(err, data){
        if (err) throw err;
        html += data;
      })
    }
    res.send(html)
    //res.send( { posts: JSON.stringify( posts ) } );
  } ) 
};

exports.admin_get  = function( req, res ) {
 //console.log( "req params is" + req.body.room.name );

  var loc = req.query.location;
  Post
  .where('location', loc)
  .run( function( err, posts ) {
        res.send( { posts: JSON.stringify( posts ) } );
  } ) 
};

/**** WTG STOP ****/