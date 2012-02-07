$(  document).ready( function () {
    
    //var socket = io.connect( 'http://simple-night-1895.herokuapp.com/' );
  
   
      $( '#radio input' ).click( function () {
        submitRoom();
        $('.postbox').hide();
        var loc = $('#locname').html();
        console.log("loca is " + loc);

        ajaxPosts( loc );
      } );

      
});

//function radiopush(){
  //var val = $("input:radio[name=room[name]]:checked").val();
   //$('#locname').html($('#sizeSmall').val());
   //console.log(" val is " + val);
  // $('#locname').html(val);

//}
function submitRoom(){
  var selected =$("input:radio[name=room[name]]:checked");
  var val =selected.val();
  console.log('selected val is' + val);
selected.attr('checked','checked');
console.log("attribute is " + selected.attr('checked'));
   $('#locname').html(val);
     $('#new_post_title').val("Where are you in " + $("#locname").html() + "?");


}




