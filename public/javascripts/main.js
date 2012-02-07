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
          console.log("entering if statement");
          $( this ).val( "" );
          $( this ).css('color','black');
    } );  
    $( '.defaultText' ).blur( function () {
        if ( $( this ).val() === "" )
          $( this ).val( $( this ).attr( "alt" ) );
          $( this ).css('color','#ccc');
    } );

  
    // End placeholder code
   



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


function ajaxPosts( location ) {
  $.getJSON(
    '/get_posts',
    { location: location },
    function ( json ) {
      var posts = JSON.parse(json.posts);

    



         for ( var i = 0; i < posts.length; i++ )  { 
          $new_post = $( '.postbox' ).first().clone();
          $new_post.find(".post_title").html(posts[i].username);
          $new_post.find(".post_body").html(posts[ i ].content);
          $new_post.find('.post_id').val(posts[i]._id);
          //print elapsed time
          

          var d = posts[i].date;
          d = new Date(d);
         $new_post.attr('data-datetime',d );
           updateElapsed(".postbox",1000);
          
          $first_post=$('.postbox').first();
          $first_post.before( $new_post );
          $new_post.show();

 
    } 

           //var socket = io.connect( 'http://localhost/' );
            
           $('.postbox').last().css("border-bottom", "0px") ;
            console.log("css on last post is" + $('.postbox').last().css("border-bottom", "0px"));
            
            //socket.on('new_post_deleted')
             
     

      return false;
    }
  )
}

/**** WTG STOP ****/






function createPost( data ) {
  var now = new Date();
  console.log('entering create post method');
  // Clone an existing post, and set values of the new post
  $new_post = $( '.postbox' ).first().clone();
  $new_post.find( '.post_body' ).html( data.content );
  $new_post.find( '.post_title' ).html( data.username );
  $new_post.find( '.post_time' ).html("");
  //dealing with time
  $new_post.attr('data-datetime', now);
  updateElapsed(".postbox", 1000);

  // Hide the new post so we can slide it down nicely
  $new_post.css( 'display', 'none' ); 
  
  // Insert the new post in the page
  $first_post=$('.postbox').first();
  $first_post.before( $new_post );

  // Finally, slide in the new post, hide the new_post box,
  // and re-show the add a crush button
  //$( '#new_crush_box' ).hide();
  //$( '#new_crush_button' ).show();
  $new_post.slideDown( 'slow', function () {
  } );
}

// Create post using socket post
function socketPost( socket ) {
console.log("here's the socketpost method");
 
  if($("#new_post_body").val()!="Write Your Post Here."){
      
    var content = $( '#new_crush_box' ).find( 'textarea' ).val();
    var latitude= $('#lat').html();
    var longitude= $('#lon').html();
    var location = $('#locname').html();
    var username = $('#username').html()


  }
  else{
    jAlert("You've gotta write a post!", "Circa");
  }

  socket.emit( 'create_post', { content: content, latitude: latitude, longitude: longitude, location: location, username: username } );
  $('#new_post_body').val("Write Your Post Here.");
   $('#new_post_body').blur();


}

