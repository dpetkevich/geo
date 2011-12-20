$(  document).ready( function () {
    
    var socket = io.connect( 'http://localhost' );
    socket.on( 'new_post_created', function ( data ) {
      createPost( data );
    } );
    
    // Atttach click handler to #new_crush_button
    $( '#new_crush_button' ).click( insertNewPost );
    
    // Attach click handler to #submit_post button
    $( '#submit_post' ).click( function () {
      socketPost( socket );
    } );
    
    
    // This code handles the default placeholder text
    $( '.defaultText' ).focus( function () {
        if ( $( this ).val() === $( this ).attr( "alt" ) )
        	$( this ).val( "" );
    } );  
    $( '.defaultText' ).blur( function () {
        if ( $( this ).val() === "" )
        	$( this ).val( $( this ).attr( "alt" ) );
    } );
    // End placeholder code
    

    
});

// Hide new post button and show insert post form
function insertNewPost() {
	$( '#new_crush_box' ).show();
	$( '#new_crush_button' ).hide();
}

function createPost( data ) {
	
	// Clone an existing post, and set values of the new post
  $new_post = $( '.postbox' ).first().clone();
  $new_post.find( '.post_title' ).html( data.title );
  $new_post.find( '.post_body' ).html( data.content );
  $new_post.find( '.post_time' ).html( 'just now.' );

	// Hide the new post so we can slide it down nicely
	$new_post.css( 'display', 'none' );	
	
  // Insert the new post in the page
  $( '#new_crush_box' ).after( $new_post );

  // Finally, slide in the new post, hide the new_post box,
 	// and re-show the add a crush button
	$( '#new_crush_box' ).hide();
	$( '#new_crush_button' ).show();
	$new_post.slideDown( 'slow', function () {
	} );
}

// Create post using socket post
function socketPost( socket ) {
  var title = $( '#new_crush_box' ).find( 'input' ).val();
  var content = $( '#new_crush_box' ).find( 'textarea' ).val();

  socket.emit( 'create_post', { title: title, content: content } );
}