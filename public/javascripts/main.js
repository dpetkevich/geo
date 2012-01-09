$(  document).ready( function () {
    
    //var socket = io.connect( 'http://simple-night-1895.herokuapp.com/' );
    var socket = io.connect( 'http://localhost/' );

    socket.on( 'new_post_created', function ( data ) {
      createPost( data );
    } );
    
    // Atttach click handler to #new_crush_button
    //$( '#new_crush_button' ).click( insertNewPost );
    
    // Attach click handler to #submit_post button
      $( '#submit_post' ).click( function () {
        socketPost( socket );
      } );

     $('#new_post_title').keypress(function(e)
      {
          if (e.keyCode == 13)
          {
                  socketPost( socket );
          }
      });
    $('#new_post_body').keypress(function(e)
      {
          if (e.keyCode == 13)
          {
                  socketPost( socket );
          }
      });
    
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
   

  /*if (navigator.geolocation) {
       
        navigator.geolocation.getCurrentPosition(function(position) {
         var clat = position.coords.latitude;
         var clon = position.coords.longitude;
         var tolerance = .00000001;
         $('#tol').html(tolerance);
         $( '#lat').html(position.coords.latitude);
         $( '#lon').html(position.coords.longitude);

      });
        
      } else {
        alert("I'm sorry, but geolocation services are not supported by your browser.");
      } */

      if(navigator.geolocation) {
        getCurrentPosition();
}
else{
alert('Your browser does not support the Geo-Location feature');
}
});



function showPosition(position){
var lat = position.coords.latitude;
var lon = position.coords.longitude;
$('#lat').html(position.coords.latitude);
$( '#lon').html(position.coords.longitude);
}
 
function errorMan(){
alert('Oops; There seems to be some problem');
}
 
function getCurrentPosition(){
if(navigator.geolocation) {
navigator.geolocation.getCurrentPosition(showPosition, errorMan);
}
else{
alert('Your browser does not support the Geo-Location feature');
}
}

/**** WTG START ****/

function ajaxPosts( latitude, longitude ) {
  $.getJSON(
    '/get_posts',
    { latitude: latitude, longitude: longitude },
    function ( json ) {
      var posts = JSON.parse(json.posts);
      console.log( posts );
      console.log (longitude);
      console.log (latitude);
    



         for ( var i = 0; i < posts.length; i++ )  { 
          $new_post = $( '.postbox' ).first().clone();
          $new_post.find('.post_title').html(posts[ i ].title);
          $new_post.find(".post_body").html(posts[ i ].content);
          $new_post.find( '.post_time' ).html(posts[i].date);
     
          $( '#new_crush_box' ).after( $new_post );
          $new_post.show();

          //$new_post.find(".post_time").html(posts[ i ].date_display());
         }  
         // $new_post.css( 'display', 'none' ); 

      return false;
    }
  )
}

/**** WTG STOP ****/







// Hide new post button and show insert post form
function insertNewPost() {
	$( '#new_crush_box' ).show();
	$( '#new_crush_button' ).hide();
}

function createPost( data ) {
  var currentTime = new Date();
	var time = currentTime.getHours()+":"+ currentTime.getMinutes();
	// Clone an existing post, and set values of the new post
  
if($("#new_post_body").val()!="Write Your Post Here."){
    
  $new_post = $( '.postbox' ).first().clone();

 
  $new_post.find( '.post_title' ).html( data.title );

  
  $new_post.find( '.post_body' ).html( data.content );
  $new_post.find( '.post_time' ).html( time);

	// Hide the new post so we can slide it down nicely
	$new_post.css( 'display', 'none' );	
	
  // Insert the new post in the page
  $( '#new_crush_box' ).after( $new_post );

  // Finally, slide in the new post, hide the new_post box,
 	// and re-show the add a crush button
//	$( '#new_crush_box' ).hide();
	//$( '#new_crush_button' ).show();
	$new_post.slideDown( 'slow', function () {
	} );
}
  
  
    
 
}

// Create post using socket post
function socketPost( socket ) {
  console.log($( '#new_crush_box' ).find( 'input' ).val());
 
  if($("#new_post_body").val()!="Write Your Post Here."){
      

    if($('#new_post_title').val().substring(0,16)!="Where are you in"){
     console.log('for loop works');
    console.log($('#new_post_title').val().substring(0,15));
    var title = $( '#new_crush_box' ).find( 'input' ).val();
    var content = $( '#new_crush_box' ).find( 'textarea' ).val();
    var latitude= $('#lat').html();
    var longitude= $('#lon').html();

      }
    else{
    
    var title = "Somewhere in " + $('#new_post_title').val().substring(17,($('#new_post_title').val().length)-1);
    var content = $( '#new_crush_box' ).find( 'textarea' ).val();
    var latitude= $('#lat').html();
    var longitude= $('#lon').html();


    }
      
  }
  else{
    alert("You've gotta write a post!");
  }

  socket.emit( 'create_post', { title: title, content: content, latitude: latitude, longitude: longitude } );
}




