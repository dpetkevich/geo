$(  document).ready( function () {
    
  //var socket = io.connect( 'http://simple-night-1895.herokuapp.com/' );
  var socket = io.connect( 'http://localhost/' );
  socket.on( 'new_post_created', function ( data ) {
    console.log("event got")
    if($('#locname').html()===data.place){
      createPost( data );
    }
  } );

  if(navigator.geolocation) {
    getCurrentPosition();
  }
  else{
    alert('Your browser does not support the Geo-Location feature');
  }


  /* EVENT HANDLERS ============= */
  // Atttach click handler to #new_crush_button
  //$( '#new_crush_button' ).click( insertNewPost );

  // Attach click handler to #submit_post button
  $( '#submit_post' ).click( function () {
    socketPost( socket );
  } );

  $('#new_post_title').keypress(function(e) {
    if (e.which == 13) socketPost( socket );
  });
  $('#new_post_body').keypress(function(e) {
    if (e.which == 13) socketPost( socket );
  });
  //exp button
  $('#explanation' ).mouseover( function () {
    $(this).fadeOut(500);
    $('#exphover').fadeIn(500);
    $('#join').hide();
  });
      
  $( '#exphover' ).mouseout( function () {
    $(this).fadeOut(100);
    $('#explanation').fadeIn(100);
    $('#join').show();
  });  

  // question button
  $( '#qmark' ).mouseover( function () {
    $(this).hide()
    $('#locerror').show();
  });
      
   $( '#locerror' ).mouseout( function () {
    $(this).hide();
    $('#qmark').show();
  });  

  
  $( '#legal' ).click( function () {
    alert('Circa does not have permission to use the yale name.')
  });

  $( '#join' ).click( function () {
      jAlert('We need good people, especially a tech lead. Email circacampus@gmail.com.', "Join circa!")
  });
   
  $('.postbox').last().css("border-bottom", "0px") ;

});

/* FUNCTIONS ====== */

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
  $.getJSON( '/get_posts', { location: location }, function ( json ) {
    var posts = JSON.parse(json.posts);
    console.log(posts);
    posts=posts.reverse();

    //$('.postbox').slice(1).remove();

    for ( var i = 0; i <25; i++ )  { 
      $new_post = $( '#tpostbox' ).clone();
      $new_post.find(".post_title").html(posts[i].username);
      $new_post.find(".post_body").html(posts[ i ].content);
      $new_post.find('.post_id').val(posts[i]._id);
      //print elapsed time
      
      var d = posts[i].date;
      d = new Date(d);
      $new_post.attr('data-datetime',d );
      updateElapsed(".postbox",1000);
      
      $last_post=$('.postbox').last();
      $last_post.before( $new_post );
      $new_post.show();
    } 
           //var socket = io.connect( 'http://localhost/' );
            console.log("css on last post is" + $('.postbox').last().css("border-bottom", "0px"));
            
            //socket.on('new_post_deleted')
      return false;
    }
  )
}

/**** WTG STOP ****/

var c =0;

function createPost( data ) {
  var now = new Date();
  console.log('entering create post method');
 
  // Clone an existing post, and set values of the new post

  $new_post = $( '#tpostbox' ).clone();
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
  $new_post.slideDown( 'slow')

  $('.postbox').css('margin-top','0px');
  $('.postbox').css('padding','10px');
  $('.postbox').css('text-align','left');
  $('.postbox').css('color','#000');
  $('.postbox').css('height','auto');

  c++;
  $('title').html('Circa (' + c + ')');
  
  $( 'body' ).mousemove( function () {
    $('title').html('Circa');
    c=0;
    }
  );
  //setTimeout("$('title').html('Circa:Yale');",60000);
}

// Create post using socket post
function socketPost( socket ) {
 
  if($("#new_post_body").val()!==""){
    var content = $( '#new_crush_box' ).find( 'textarea' ).val();
    var latitude= $('#lat').html();
    var longitude= $('#lon').html();
    var location = $('#locname').html();
    var username = $('#username').html()
    socket.emit( 'create_post', {
      content: content, 
      location: { lat: latitude, long: longitude }, 
      place: location, 
      username: username
    });
  }
  else{
    jAlert("You've gotta write a post!", "Circa");
  }
}

