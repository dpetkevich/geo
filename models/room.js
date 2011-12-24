var mongoose = require( 'mongoose' )
	, Schema = mongoose.Schema;
	
var roomSchema = new Schema( {
		name		: String
	,   latitude : { type: Number, default: 5 }
	,	longitude : { type: Number, default: 5 }
} );





module.exports = mongoose.model( 'Room', roomSchema );