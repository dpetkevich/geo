$(  document).ready( function () {
    
  //var socket = io.connect( 'http://circa.nodejitsu.com/' );
  var socket = io.connect( 'http://localhost/' );
  
  socket.on('ready', function(data){
    console.log("ready")
    console.log(data)
  })

  socket.on('new_post', function ( data ) {
    console.log(data)
    render_post(data, function(html) {
      $("#postlist").prepend(html)
    })
  } );
  socket.on('postlike', function(data) {
    post = $(".post[post-id='"+data.id+"']");
    if(post) {
      $(post).find(".likes").html(data.likes)
    }
  });
  socket.on('commentlike', function(data) {
    com = $(".comment[comment-id='"+data.id+"']");
    if(com) {
      $(com).find(".likes").html(data.likes)
    }
  });
  socket.on('newcomment', function(comment) {

    ctext = render_comment(comment, function(ctext) {
      post = $(".post[post-id='"+comment.post+"']");
      comments = $(post).parents(".postbox").find(".comments");
      console.log(ctext);
      $(comments[0]).append(ctext);

    });
  })

  var lat, lon;
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      $.get("/posts", {lat: lat, lon:lon}, function(data) {
        data = JSON.parse(data.posts)
        console.log(data)
        html = "";
        $.each(data, function(key, val) {
          html += render_post(val);
        })
        $("#postlist").fadeOut("fast", function() {
          $("#postlist").html(html).slideDown("fast");

          updateElapsed(".time", ".elapsed", 1000)
        })
      })
      $('#lat').html(lat);
      $('#lon').html(lon);
    }, function(err) {
      console.log("location error: ", err)
    });
  }
  else{
    // Handle error more elegantly
    alert('Your browser does not support the Geo-Location feature');
  }
  
  /* ============= EVENT HANDLERS ============= */


  $("#postlist").click(function(e) {
    t = e.target;
    if($(t).hasClass("post_like")) {
      $(t).hide();
      var id = $(t).parents(".post").attr("post-id");
      if($(t).hasClass("like")) {
        $(t).parent().children(".unlike").show();
        socket.emit("postlike", {id: id, action: "like"});
      }
      else if($(t).hasClass("unlike")) {
        $(t).parent().children(".like").show();
        socket.emit("postlike", {id: id, action: "unlike"});
      }
    }
    else if($(t).hasClass("comment_like")) {
      $(t).hide();
      var id = $(t).parents(".comment").attr("comment-id");
      if($(t).hasClass("like")) {
        $(t).parent().children(".unlike").show();
        socket.emit("commentlike", {id: id, action: "like"});
      }
      else if($(t).hasClass("unlike")) {
        $(t).parent().children(".like").show();
        socket.emit("commentlike", {id: id, action: "unlike"});
      }
    }
    else if($(t).hasClass("show_comments")) {
      $(t).parents(".postbox").children(".commentbox").slideToggle("fast");
    }
  });
  $("#postlist").keypress(function(e) {
    if(e.which == 13 && $(e.target).hasClass("comment_input")) {
      t = e.target;
      if($(t).val() != "") {
        post_id = $(t).parents(".postbox").children(".post").attr("post-id");

        socket.emit("newcomment", {post_id: post_id, content: $(t).val()})
        $(t).val("");

      }
    }
  });

  $('#new_post_body').keypress(function(e) {
    if (e.which == 13){ 
      e.preventDefault();
      socketPost( socket );
    }
  });
  /*
  $('#new_post_body').keypress(function(e) {
    if (e.which == 13){ 
      e.preventDefault();
      socketPost( socket );
    }
  });
*/
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

/* ============= FUNCTIONS =========== */

/* Renders a post from the post object */
function render_post(post, cb) {
  // The template into which we place our values
  var text = 
  '<div class="postbox">\
    <div class="post time" data-datetime="'+post.date+'" post-id="'+post._id+'">\
      <div class="post_user">'+post.username+'</div>\
      <div class="post_body">'+post.content+'</div>\
      <div class="elapsed post_time"></div>\
      <span class="like post_like">Like!</span>\
      <span class="unlike post_like">Unlike</span>\
      <div class="likes post_like">'+post.likes+'</div>\
      <a class="show_comments" href="#">Comments ('+post.comments.length+')</a>\
    </div>\
    <div class="commentbox"><div class="comments">';
    $.each(post.comments, function(key, comment) {
      console.log(comment)
      text += render_comment(comment)
    })
    text += '</div><input class=comment_input placeholder="Write a comment!" />'
    text += '</div></div>'

  if(typeof cb === "function") cb(text);
  else return text;

}

function render_comment(comment, cb) {
  text = 
  '<div class="comment time" data-datetime='+comment.date+' comment-id="'+comment._id+'"+>\
    <div class="comment_user">'+comment.username+'</div>\
    <div class="comment_content">'+comment.content+'</div>\
    <div class="elapsed comment_time"></div>\
    <span class="like comment_like">Like!</span>\
    <span class="unlike comment_like">Unlike</span>\
    <div class="likes comment_likes">'+comment.likes+'</div>\
  </div>';
  if (typeof cb === "function") cb(text);
  else return text;
}

/**** WTG START ****/
/*
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
*/
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
    var text = $( '#new_post_body' ).val();
    var lat= $('#lat').html();
    var lon= $('#lon').html();
    var place = $('#locname').html();
    var username = $('#username').html();
    socket.emit('create_post', {content: text, location: [lon, lat], place: place});
    $("#new_post_body").val("")
  }
}

