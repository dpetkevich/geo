  /*
 * GET home page.
 */

var Post = require( '../models/post.js' );
var util = require( 'util' );
var tolerance = 0;

var adjectives = require( '../models/adj.js' );
var nouns = require( '../models/noun.js' );

/* ROUTES FROM ROUTER */


exports.index = function( req, res, socket ) { // All sockets in this session
  console.log("socket:")
  socket.emit('ready', {data: "hi"})
  console.log("emitted ready")
  var maxage = 60000*60*3; // 3 hours
  var name = req.cookies.uname;

  if(!name) {
    a = Math.floor(Math.random()*adjectives.length);
    b = Math.floor(Math.random()*nouns.length);
    name = adjectives[a] +"-"+ nouns[b]
    res.cookie('uname', name, { maxAge: maxage}); // 3 hours
  }
<<<<<<< HEAD
  res.render( 'index.jade');
=======
  res.render('index');
>>>>>>> 433f942ad199999cda226e5578463554860a72c4
};

/*
 * Handler to create new post
 */	

exports.create_post = function( data ) {
  
  socket = this;
  c = data.content;
  hashtags = c.match(/#[a-zA-z_]+\w*/g);
  console.log(c)
  console.log(hashtags)
	new Post( {
    content: c, 
    location: data.location, 
    place: data.place, 
    username: data.username
  }).save( function (err, post) {
    // Emit message to all other sockets
    socket.broadcast.emit( 'new_post', post );

    // Also emit message to the socket that created it
    socket.emit( 'new_post', post );
		console.log("new post", util.inspect(post, false, null))
	});
};

exports.list_posts =function (req,res ){
  Post.findOne( { _id: req.body.post.id}).remove( function (err, posts) {
		res.render( 'admin.ejs' );
	} );
};

/* SOCKET ROUTES */

exports.like = function(data) {
  socket = this;
  id = data.id || '';
  action = data.action || '';
  Post.findById(id, function(err, post) {
    if (err) throw err;
    if (action === "like") post.likes ++;
    else if (action === "unlike" && post.likes > 0) post.likes --;
    post.save(function(err) {
      if (err) throw err;
      socket.broadcast.emit("postlike", {id: id, likes: post.likes});
      socket.emit("postlike", {id: id, likes: post.likes})
    });
  })
}

exports.all = function( req, res ) {
  console.log( "req query is" + util.inspect( req.query ) );
	var lat = req.query.lat;
  var lon = req.query.lon;
  Post.find({})
  //.where('location')
  //.near([lon, lat])
  //.maxDistance(1)
  .desc('date')
  .limit(25)
  .populate("comments")
  .run( function( err, posts ) {

    res.send( { posts: JSON.stringify( posts ) } );
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