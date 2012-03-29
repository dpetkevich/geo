/**
 * Module dependencies.
 */

var express = require( 'express' )
  , mongoose = require( 'mongoose' );

// App
var app = module.exports = express.createServer()
  , io = require( 'socket.io' ).listen( app );

// Import routes

var routes = require( './routes/index.js' )
  , posts = require('./routes/posts.js')
  , comments = require('./routes/comments.js')
  , sockets = require('./routes/sockets.js')
  , admin = require('./routes/admin.js')

app.configure(function () {
  app.set( 'views' , __dirname + '/views' );
  app.set( 'view engine', 'jade' );
  app.use( express.bodyParser() );
  app.use(express.cookieParser());
  //app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use( express.methodOverride() );
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use( app.router );
  app.use( express.static(__dirname + '/public') );
});

app.configure( 'development', function () {
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
	var mongoose_uri = 'mongodb://circa:circa@ds031657.mongolab.com:31657/circa_test';
	mongoose.connect( mongoose_uri );
} );

app.configure( 'production', function () {
  app.use(express.errorHandler() ); 
  var mongoose_uri = 'mongodb://circa:circa@ds031657.mongolab.com:31657/circa_test';
	//var mongoose_uri = 'mongodb://circa:LoriaB50@ds031637.mongolab.com:31637/circa';
	mongoose.connect( mongoose_uri );
} );


// Routes

app.get("/", posts.index);
app.get("/posts", posts.get_posts);
app.get("/admin!!5423", admin.index)
app.get("/get_admin_posts", posts.get_posts)

app.post("/", posts.create_post)
app.post("/like", posts.like);
app.post("/admin!!5432", admin.delete)


// Attach socket listeners
io.sockets.on( 'connection', function ( socket ) {
    socket.on('create_post', posts.create_post);
    socket.on('postlike', posts.like)
    socket.on('commentlike', comments.like)
    socket.on('newcomment', comments.create)
} );


var port = process.env.PORT || 3000;

app.listen( port );
console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
