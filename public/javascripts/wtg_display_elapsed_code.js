function updateElapsed( selector, interval ) {
  // Sets an interval to update time elapsed for updates and the like
  
  if ( typeof interval === "undefined" ) {
    interval = 16000; // Default to updating every 16 seconds
  }
  
  var sI = setInterval( function() {
  	  var toUpdate = $( selector );
  
  	  var now = new Date();
  	  var obj;
  	  var created;
  	  var elapsed;
  	  for ( var i = 0; i < toUpdate.length; i++ ) {
        obj = toUpdate[ i ];
        created = $( obj ).attr( 'data-datetime' );
        created = new Date( created );
        elapsed = now - created;
        $( obj ).find( '.elapsed' ).html( displayElapsed( elapsed ) );
  	  }
	  }, interval );
    
}

function displayElapsed( elapsed ) {
  
  var minute = 60000; // 60000 milliseconds in a minute
  var hour = 60 * minute;
  var day = 24 * hour;
  var week = 7 * day;
  var month = 30 * day;
  var year = 365 * day;
  
  if ( elapsed < 10000 )
    // If within the last 10 seconds, say "just now..."

    return "just now...";
  
  else if ( elapsed < minute ) {
    var seconds = Math.round( elapsed / 1000 );
    
    if ( seconds === 1 ) {
      return "circa 1 second ago";
    } else {
      return "circa " + seconds + " seconds ago";
    }

  } else if ( elapsed < minute * 59.5 ) { // 59.5 minutes
    
    var minutes = Math.round( elapsed / minute );
    
    if ( minutes === 1 ) {
      return "circa 1 minute ago";
    } else {
      return "circa " + minutes + " minutes ago";
    }
    
    
  } else if ( elapsed < hour * 23.5 ) {  // 23.5 hours
    
    var hours = Math.round( elapsed / hour );
    
    if ( hours === 1 ) {
      return "circa 1 hour ago";
    } else {
      return "circa " + hours + " hours ago";
    }
    
  } else if ( elapsed < day * 13.5 ) {  // 13.5 days
    
    var days = Math.round( elapsed / day );
    
    if ( days === 1 ) {
      return "circa 1 day ago";
    } else {
      return "circa " + days + " days ago";
    }
  
  } else if ( elapsed < week * 3.5 ) {  // 3.5 weeks
    
    var weeks = Math.round( elapsed / week );
    
    if ( weeks === 1 ) {
      return "circa 1 week ago";
    } else {
      return "circa " + weeks + " weeks ago";
    }
  
  } else if ( elapsed < month * 11.5 ) {  // 11.5 months

    var months = Math.round( elapsed / month );
    
    if ( months === 1 ) {
      return "circa 1 month ago";
    } else {
      return "circa " + months + " months ago";
    }
    
  } else {

    var years = Math.round( elapsed / year );

    if ( years === 1 ) {
      return "circa 1 year ago";
    } else {
      return "circa " + years + " years ago";
    }
    
  }
    
}







