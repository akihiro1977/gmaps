/**
*	GoogleMapsを表示する（API V3版）
*	
*	@author Akihiro Koyanagi
*	@version 1.0.0
*	
*	@example
*	<div data-address="東京スカイツリー"></div>
*	<div data-address="35.667480, 139.727275"></div>
*	<div data-address="福岡市中央区大名2丁目4−22" data-html="#akasaka"></div>
*	<div style="display:none;" id="akasaka"><h4>福岡市中央区大名2丁目4−22</h4><p>スタバがあるよ</p></div>
*	
*	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&region=JP&key=YOUR_API_KEY&signed_in=false&sensor=FALSE"></script>
*	<script>
*	$(function(){
*		gMaps.markerIcon = {
*			url: '../img/map-icon.png'
*		};
*		gMaps.mapOptions.styles[0].stylers = [
*												   { hue: "#00FF99" },
*												   { saturation: -40 }
*												   ];
*		gMaps.init($("[data-address]"));
*	});
*	</script>
*	
**/

var gMaps = {
	// vars
	geocoder: null,
	// markerIconは必要に応じて上書き
	markerIcon: null,
	/*
	markerIcon: {
		url: '../img/map-icon.png',
		anchor: {
			x: 16,
			y: 37
		}
	},
	*/
	mapOptions: {
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		overviewMapControl: true,
		scrollwheel: false,
		styles: [{
			stylers: []
		}]
		/* stylesは必要に応じて上書き
		styles: [{
			stylers: [
				{ hue: "#0066FF" },
				{ gamma: 1.0 },
				{ saturation: -30 }
			]}
		]
		*/
	},
	
	// function
	init: function($elm){
		gMaps.geocoder = new google.maps.Geocoder();
		
		$elm.each(function(){
			
			(function($this, address){
				
				if (address.match(/(\d+\.\d+)[,\s]+(\d+\.\d+)/)){
					// 緯度経度から表示
					gMaps._showGMap({
						lat: RegExp.$1,
						lng: RegExp.$2,
						$elm: $this,
						html: $this.data("html")
					});

				} else {
					// 住所やランドマークから表示
					gMaps.geocoder.geocode( { 'address': address }, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							
							var ll = results[0].geometry.location;
							
							gMaps._showGMap({
								lat: ll.lat(),
								lng: ll.lng(),
								$elm: $this,
								html: $this.data("html")
							});
							
						} else {
							alert("Geocode was not successful for the following reason: " + status);
						}
					});
				}
				
			})($(this), $(this).data("address"));
			
		});
	},
	/*
		args = {
			lat,
			lng,
			$elm,
			html
		}
	*/
	_showGMap: function(args){
		
		var ll = new google.maps.LatLng(args.lat, args.lng);
		
		var options = gMaps.mapOptions;
		options.center = ll;
		var map = new google.maps.Map(args.$elm[0], options);
		
		var marker = new google.maps.Marker({
			map: map,
			position: ll,
			icon: gMaps.markerIcon
		});
		
		if (args.html){
			var infowindow = new google.maps.InfoWindow({
				content: $(args.html).html()
			});
			infowindow.open(map,marker);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});
		}
		
		google.maps.event.addListener(map, 'tilesloaded', function(){
			// img { max-width:100% } でGoogleMapsのコントロールが表示されなくなる問題に対応
			$("img", args.$elm).css({ "max-width": "initial" });
		});
	}
};
