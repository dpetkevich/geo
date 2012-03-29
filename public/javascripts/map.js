 $( document ).ready( function() {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position)  {
        
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myOptions = {
        zoom: 17,
        center: latlng,
        mapTypeControl: false,
        disableDefaultUI: true,
        draggable: false,
        disableDoubleClickZoom: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
        var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
        });
        var circle = new google.maps.Circle({
        center: latlng,
        radius: 10,
        strokeColor: 000000,
        strokeWeight:1,
        visible: true,
        map: map
        });
        $(function() {
        $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "min",
        value: 0,
        min: 50,
        step: 50,
        max:150,
        value: 85,
        slide: function( event, ui ) {
        $('#amount').val(ui.value);
        circle.setRadius(ui.value);

        }
        });
        $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
        });
        });
        }
        else {
        alert("Geolocation doesn't work.");
        }
        } );