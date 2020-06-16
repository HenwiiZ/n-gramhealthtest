$(document).ready(function() {
    var key = 'AIzaSyAaF3mu3LTpI-OU_wikP8py8bVfYNowCII';
    var curLat;
    var curLng;
    var recomSet = [];
    var map;
    var panorama;
    var directionsService ;
    var directionsRenderer ;

    //Get current location
    var initLoc = function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(location) {
                console.log(location);
                curLat = parseFloat(location.coords.latitude);
                curLng = parseFloat(location.coords.longitude);
                initialize(curLat, curLng);
            });
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }   
    }

    //Google Map API initialization
    var mapInit = function(callback) {
        $.ajax({
            //Adding parameter 'language' to set language
            url: 'https://maps.googleapis.com/maps/api/js?key=' + key + '&region=US&language=en',            
            type: 'GET',
            crossDomain : true,
            async: true,
            dataType: 'jsonp',
            success: function(data) {
                callback(data);
            },
            error: function(err) {
                console.log(err);
            }
        })
    };

    function initialize(curLat, curLng) {
        var fenway = {lat: curLat, lng: curLng};
        console.log(fenway);
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        map = new google.maps.Map(document.getElementById('map'), {
          center: fenway,
          zoom: 14
        });
        directionsRenderer.setMap(map);
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), {
              position: fenway,
              pov: {
                heading: 34,
                pitch: 10
              }
            });
        map.setStreetView(panorama);
    };
    mapInit(initLoc);

    var setMap = function(mapId, panoId, pos) {
        var map = new google.maps.Map(document.getElementById(mapId), {
            center: pos,
            zoom: 14
        });
        var panorama = new google.maps.StreetViewPanorama(
            document.getElementById(panoId), {
              position: pos,
              pov: {
                heading: 34,
                pitch: 10
              }
        });
        map.setStreetView(panorama);
        return map;
    }

    var calcRoute = function(map, originAddr, destinationAddr) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        var request = {
            origin: originAddr,
            destination: destinationAddr,
            travelMode: 'WALKING'
        }
        directionsService.route(request, function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } 
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }


    /*
    Track yourself module
    Description: When the button is pressed, the map show locate your current location
    */
    $('.btn.btn-dark.mb-2.fas.fa-compass.fa-2x').click(function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(location) {
                var lat = parseFloat(location.coords.latitude);
                var lng = parseFloat(location.coords.longitude);
                var pos = {
                    lat: lat,
                    lng: lng
                };
                setMap('map', 'pano', pos);
                $.ajax({ 
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ', ' + lng + '&key=' + key + '&language=en',            
                    type: 'GET',
                    crossDomain : true,
                    async: false,
                    dataType: 'JSON',
                    success: function(data) {
                        var address = data.results[0].formatted_address;
                        $('#origin').val(address);
                        $('#place').val(address);             
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })  
            });
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }        
    })


    $('#confirm').click(function() {
        var set = $('form').serializeArray();
        var origin = [];
        var destination = [];
        originAddr = set[0].value;
        destinationAddr = set[1].value;
        destination = destinationAddr.split(' ');

        var destinationURL = 'https://maps.googleapis.com/maps/api/geocode/json?language=en&address='
        for(var i = 0; i < destination.length; i++) {
            destinationURL = destinationURL + destination[i] + '+';
        }
        destinationURL = destinationURL.substring(0, destinationURL.length - 1);
        destinationURL = destinationURL + '&key=' + key;

        $.ajax({
            //Adding parameter 'language' to set language
            url: destinationURL,            
            type: 'GET',
            crossDomain : true,
            async: false,
            dataType: 'JSON',
            success: function(data) {
                var results = data.results;
                console.log(data);
                var lat = results[0].geometry.location.lat;
                var lng = results[0].geometry.location.lng;
                destinationPos = {
                    lat: lat,
                    lng: lng
                }
                var map = setMap('map', 'pano', destinationPos);
                calcRoute(map, originAddr, destinationAddr);
            },
            error: function(err) {
                console.log(err);
            }
        })       
    });


    // Tab2
    $('#confirm2').click(function() {
        console.log($('#place').val());
        console.log($('#range').val());
        var range = $('#range').val() * 400;

        destinationAddr = $('#place').val();
        destination = destinationAddr.split(' ');

        var destinationURL = 'https://maps.googleapis.com/maps/api/geocode/json?language=en&address='
        for(var i = 0; i < destination.length; i++) {
            destinationURL = destinationURL + destination[i] + '+';
        }
        destinationURL = destinationURL.substring(0, destinationURL.length - 1);
        destinationURL = destinationURL + '&key=' + key;

        $.ajax({
            //Adding parameter 'language' to set language
            url: destinationURL,            
            type: 'GET',
            crossDomain : true,
            async: false,
            dataType: 'JSON',
            success: function(data) {
                var results = data.results;
                console.log(data);
                var lat = results[0].geometry.location.lat;
                var lng = results[0].geometry.location.lng;
                destinationPos = {
                    lat: lat,
                    lng: lng
                }
                var map = setMap('map2', 'pano2', destinationPos);
                recommend(lat, lng, range);
            },
            error: function(err) {
                console.log(err);
            }
        })        
    })

    var recommend = function(lat, lng, range) {
        console.log(lat);
        console.log(lng);
        url = 'https://www.triposo.com/api/20200405/poi.json?annotate=distance:' + lat + ',' + lng +'&account=GXZTJEM7&token=30yhgebkre1hisqd696bhfquhxpifv5u&tag_labels=sightseeing&distance=<' + range;
        $.ajax({
            //Adding parameter 'language' to set language
            url: url,            
            type: 'GET',
            crossDomain : true,
            async: false,
            dataType: 'JSON',
            success: function(data) {
                data = data.results;
                recomSet = data;
                console.log(data);
                $('li').remove('.slide');
                $('div').remove('.carousel-item');
                // console.log($('#carousel-inner').html());
                // $('#carousel-indicators').append('<li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>');
                $('#carousel-inner').append('<div class="carousel-item active" style="width: 100%; height: 150%;"><div style="width: 100%; height: 150%;"><img src="https://image.shutterstock.com/image-vector/recommend-icon-thumb-emblem-pink-260nw-1569013396.jpg"  class="d-block" alt="0" style="display: block; margin: 0 auto; width: 100%; height: 300px;"></div><div class="carousel-caption d-none d-md-block" ><h5">Point of Interest Recommendation</h5><p></p></div></div>')
                // console.log($('#carousel-inner').html());
                for(var i = 1; i <= data.length; i++) {
                    var id = data[i - 1].name;
                    var lat = data[i - 1].coordinates.latitude.toFixed(2);
                    var lng = data[i - 1].coordinates.longitude.toFixed(2);
                    var dist = data[i - 1].distance;
                    var img = data[i - 1].images[0].source_url;
                    console.log(data[i - 1].images[0].source_url);
                    $('#carousel-indicators').append('<li class="slide" data-target="#carouselExampleCaptions" data-slide-to="' + i + '"></li>');
                    $('#carousel-inner').append('<div class="carousel-item" style="width: 100%; height: 150%;"><div style="width: 100%; height: 150%;"><img src="' + img +'" class="d-block" alt="' + i + '" style="display: block; margin: 0 auto; width: 100%; height: 300px;"></div><div class="carousel-caption d-none d-md-block"><h5 id="' + id + '">' + id + '</h5><p>Distance: ' + dist + 'm</p></div></div>');
                }
                console.log('hi');
                
            },
            error: function(err) {
                console.log(err);
            }
        })
    }

    $(function(){
        $(document).click(function(e) {
            if($(e.target).is('h5')) {
                var id = $(e.target).attr('id');
                $('#search-box').val(id);
                $('#destination').val(id);
                var lat;
                var lng;
                var pos = {};
                for(var i = 0; i < recomSet.length; i++) {
                    if(id == recomSet[i].name) {
                        lat = recomSet[i].coordinates.latitude;
                        lng = recomSet[i].coordinates.longitude;
                        pos = {
                            lat: lat,
                            lng: lng
                        }
                        break;
                    }
                }
                setMap('map2', 'pano2', pos);
            }
        })
     
    });



    $('#search-btn').click(function() {
        var keyword = $('#search-box').val();
        var words = [];
        words = keyword.split(' ');
        var url = 'https://www.youtube.com/results?search_query='
        for(var i = 0; i < words.length; i++) {
            url = url + words[i] + '+';
        }
        url = url.substring(0, url.length - 1);
        window.open(url, "_blank");
    })

    $('#help11').click(function() {
        $('#guide1').modal('show');
    })
    $('#help22').click(function() {
        $('#guide2').modal('show');
    })

})

