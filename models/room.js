var mongoose = require( 'mongoose' )
	, Schema = mongoose.Schema;
	
var roomSchema = new Schema( {
  name: String, 
  location: {
    lat : { type: Number, required: true }, 
    long : { type: Number, required: true }
  }
} );

module.exports = mongoose.model( 'Room', roomSchema );