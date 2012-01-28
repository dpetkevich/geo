var mongoose = require( 'mongoose' )
	, Schema = mongoose.Schema;
	
var postSchema = new Schema( {
		title		: String
	,	content	: String
	,   latitude : { type: Number, default: 5 }
	,	longitude : { type: Number, default: 5 }
	,	date    : { type: Date, default: Date.now }
	, 	location : String
	, 	username : String
	//,	display_date : { type: String, default: "Sometime"}

} );

postSchema.methods.date_display = function ( cb ) {
	var date = this.date.getDate();
	var month = this.date.getMonth() + 1;
	var year = this.date.getFullYear();
	var dateString = month + "/" + date + "/" + year;
	return dateString;
};
module.exports = mongoose.model( 'Post', postSchema );