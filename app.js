/**
 * Module dependencies.
 */

var express = require( 'express' )
  , routes = require( './routes.js' )
  , socket_listeners = require( './socket_listeners.js' )
  , mongoose = require( 'mongoose' );

var app = module.exports = express.createServer()
  , io = require( 'socket.io' ).listen( app );

 
  
var posts_controller = require( './controllers/posts_controller.js' );
//var RedisStore = require('connect-redis')(express);
// Configuration


app.configure(function () {
  app.set( 'views' , __dirname + '/views' );
  app.set( 'view engine', 'ejs' );
  app.use( express.bodyParser() );
  app.use(express.cookieParser());
  //app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use( express.methodOverride() );
  app.use( app.router );
  app.use( express.static(__dirname + '/public') );
});

app.configure( 'development', function () {
  console.log( 'development' );
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
	var mongoose_uri = 'mongodb://circa:circa@ds031657.mongolab.com:31657/circa_test';
	mongoose.connect( mongoose_uri );
} );

app.configure( 'production', function () {
  console.log( 'production' );
  app.use(express.errorHandler() ); 
	var mongoose_uri = 'mongodb://heroku_app2139216:sfu8ge6non27flbb19sp03pjcm@ds029287.mongolab.com:29287/heroku_app2139216';
	mongoose.connect( mongoose_uri );



} );

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
// Attach routes
for ( var i = 0; i < routes.length; i++ ) {
	var method = routes[ i ][ "method" ];
	var path = routes[ i ][ "path" ];
	var handler = routes[ i ][ "handler" ];

	app[ method ]( path, handler );
}

// Attach socket listeners
io.sockets.on( 'connection', function ( socket ) {
  
  for ( var i = 0; i < socket_listeners.length; i++ ) {
    
    var event = socket_listeners[ i ][ 'event' ];

    var handler = socket_listeners[ i ][ 'handler' ];
    
    socket.on( event, function ( data ) {
    
      handler( data, socket );
    
    } );
    
  }
  
} );


var port = process.env.PORT || 3000;

app.listen( port );
console.log( "Express server listening on port %d in %s mode", app.address().port, app.settings.env );
