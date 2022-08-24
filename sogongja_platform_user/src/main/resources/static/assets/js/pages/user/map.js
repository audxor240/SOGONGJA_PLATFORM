$(function(){
	$(".map_menu").click(function(){
		$(".right_hd").toggleClass("open");
	});
	// $(".map_tab_list > li").click(function(){
	// 	var count = $(this).index()+1;

	// 	$(".map_tab_list > li").removeClass("active");
	// 	$(this).addClass("active");

	// 	$(".tab_a").hide();
	// 	$(".tab_a"+count).show();
	// });
	$(".tab_style1 > .tab2 > li").click(function(){
		var count = $(this).index()+1;

		$(this).addClass("active").siblings().removeClass("active");

		$(this).parent(".tab2").siblings(".tab_b").hide();
		$(this).parent(".tab2").siblings(".tab_b"+count).show();
	});

	/*map*/
	var mapContainer = document.getElementById('map'),
	    mapOption = {
	        center: new kakao.maps.LatLng(37.51944874731815, 127.02115275566754),
	        level: 3
	    };
	var map = new kakao.maps.Map(mapContainer, mapOption),
		customOverlay = new kakao.maps.CustomOverlay({}),
		 infowindow = new kakao.maps.InfoWindow({removable: true});

	/*다각형*/
	var areas = [
	    {
	        name : '가로수길',
	        type : '골목상권',
	        path : [
				new kakao.maps.LatLng(37.520521174569836, 127.0222714391695),
				new kakao.maps.LatLng(37.52196898217671, 127.02204490062444),
				new kakao.maps.LatLng(37.522419474340886, 127.02197648485674),
				new kakao.maps.LatLng(37.522051199120945, 127.0226545672895),
				new kakao.maps.LatLng(37.5205839258311, 127.02287568112627),
				new kakao.maps.LatLng(37.520531313902374, 127.02228604422824)
	        ],
	        hole : [
				new kakao.maps.LatLng(37.5206275432441, 127.02233366749175),
				new kakao.maps.LatLng(37.520656230069854, 127.02271946965777),
				new kakao.maps.LatLng(37.52077097726252, 127.0228038638816),
				new kakao.maps.LatLng(37.52198625780217, 127.0225716928018),
				new kakao.maps.LatLng(37.52220116198762, 127.02213815522101),
				new kakao.maps.LatLng(37.52063473507089, 127.02234890265612)

	        ]
	    }, {
	        name : '스톤',
	        type : '골목상권',
	        path : [
				new kakao.maps.LatLng(37.51922782156972, 127.02107370851172),
				new kakao.maps.LatLng(37.51927742544349, 127.0211688221014),
				new kakao.maps.LatLng(37.51921232035243, 127.02121703035917),
				new kakao.maps.LatLng(37.51918028449313, 127.02110106995532),
				new kakao.maps.LatLng(37.51922782156972, 127.02107370851172)
	        ],
	        hole:null
	    }, {
	        name : '신사역',
	        type : '골목상권',
	        path : [
				new kakao.maps.LatLng(37.51672810956334, 127.018443967989),
				new kakao.maps.LatLng(37.51608802395498, 127.01925095559355),
				new kakao.maps.LatLng(37.516885371135594, 127.02110841844193),
				new kakao.maps.LatLng(37.51672535058545, 127.02141103879364),
				new kakao.maps.LatLng(37.515726593880146, 127.01862484452109),
				new kakao.maps.LatLng(37.51672810956334, 127.018443967989)
	        ],
	        hole : null
	    }, {
	        name : '넓은지역 테스트',
	        type : '골목상권',
	        path : [
				new kakao.maps.LatLng(37.52617260773177, 127.02844479133373),
				new kakao.maps.LatLng(37.523722040747906, 127.0432076692731),
				new kakao.maps.LatLng(37.520284304180954, 127.04200603967338),
				new kakao.maps.LatLng(37.51711872350694, 127.03037598176182),
				new kakao.maps.LatLng(37.52617260773177, 127.02844479133373)
	        ],
	        hole : null
	    }
	];

	// 다각형을 생성하고 지도에 표시합니다
	for (var i = 0, len = areas.length; i < len; i++) {
	    displayArea(areas[i]);
	}
	function priceToString(price) {
    	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	// 다각형을 생상하고 이벤트를 등록하는 함수입니다
	function displayArea(area) {
	    // 다각형을 생성합니다
	    var polygon = new kakao.maps.Polygon({
	        map: map, // 다각형을 표시할 지도 객체
	        path : (area.hole == null ? area.path : [area.path, area.hole]),
	        strokeWeight: 2,
	        strokeColor: '#000000',
	        strokeOpacity: 0.8,
	        fillColor: '#000',
	        fillOpacity: 0.36
	    });
	    kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
			    var content = '<div class="customoverlay map_tooltip"><h3>위례길<span>'+area.type+'</span></h3><div><ul><li><span>영역명</span><p>'+area.name+'</p></li><li><span>상권유형</span><p>'+area.type+'</p></li><li><span>면적(m²)</span><p>'+priceToString(Math.floor(polygon.getArea()))+'</p></li></ul></div></div>';

		       // infowindow.setContent(content);
		       infowindow.setPosition(mouseEvent.latLng);
		       // infowindow.setMap(map);

			var customOverlay = new kakao.maps.CustomOverlay({
			    map: map,
			    position: mouseEvent.latLng,
			    content: content,
			    yAnchor: 1
			});

   		 });

	// var content = '<div class="customoverlay">' +
	//     '  <a href="https://map.kakao.com/link/map/11394059" target="_blank">' +
	//     '    <span class="title">구의야구공원</span>' +
	//     '  </a>' +
	//     '</div>';

	// // 커스텀 오버레이가 표시될 위치입니다
	// var position = new kakao.maps.LatLng(37.51944874731815, 127.02115275566754);

	// 커스텀 오버레이를 생성합니다
		// for (var i = 0, len = areas.length; i < len; i++) {
		//     var content = '<div class="map_tooltip"><h3>위례길<span>'+areas[i].type+'</span></h3><div><ul><li><span>영역명</span><p>'+areas[i].name+'</p></li><li><span>상권유형</span><p>'+areas[i].type+'</p></li><li><span>면적(m²)</span><p>'+ priceToString(Math.floor(polygon.getArea()))+'</p></li></ul></div></div>';
		// 	var position = areas[i].path[1]

		// 	var customOverlay = new kakao.maps.CustomOverlay({
		// 	    position: position,
		// 	    content: content
		// 	});

		// 	customOverlay.setMap(map);
		// }
	}


	/*위치이동*/
	function setCenter() {
	    var moveLatLon = new kakao.maps.LatLng(37.51944874731815, 127.02115275566754);
	    map.setCenter(moveLatLon);
	}

	function panTo() {
	    var moveLatLon = new kakao.maps.LatLng(37.52123735593011, 127.03741409798876);
	    map.panTo(moveLatLon);
	}

	$("#setCenter").click(function(){
		setCenter();
	});

	$("#panTo").click(function(){
		panTo();
	});

	// var list = ["1","2","3","4"];
	//  var markers = {
 //        '1': {
 //            title: '가로수길',
 //            latlng: new kakao.maps.LatLng(37.522419474340886, 127.02197648485674)
 //        },
 //        '2': {
 //            title: '스톤',
 //            latlng: new kakao.maps.LatLng(37.51921232035243, 127.02121703035917)
 //        },
 //        '3': {
 //            title: '신사역',
 //            latlng: new kakao.maps.LatLng(37.516885371135594, 127.02110841844193)
 //        },
 //        '4': {
 //            title: '넓은지역 테스트',
 //            latlng: new kakao.maps.LatLng(37.523722040747906, 127.0432076692731)
 //        }
 //    };
 //   for(var i = 0; i<list.length; i++){
	// 	var info = markers[list[i]];
	// 	var marker = new kakao.maps.Marker({
	// 		map: map,
	// 		position: info.latlng,
	// 		opacity : 0
	// 	});
 //   }


});
// var mapContainer = document.getElementById('map'), // 지도를 표시할 div
//   mapOption = {
//         center: new kakao.maps.LatLng(37.54699, 127.09598), // 지도의 중심좌표
//         level: 4 // 지도의 확대 레벨
//     };

// var map = new kakao.maps.Map(mapContainer, mapOption);

// // 마커가 지도 위에 표시되도록 설정합니다

// // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
// var content = '<div class="customoverlay">' +
//     '  <a href="https://map.kakao.com/link/map/11394059" target="_blank">' +
//     '    <span class="title">구의야구공원</span>' +
//     '  </a>' +
//     '</div>';

// // 커스텀 오버레이가 표시될 위치입니다
// var position = new kakao.maps.LatLng(37.54699, 127.09598);

// // 커스텀 오버레이를 생성합니다
// var customOverlay = new kakao.maps.CustomOverlay({
//     map: map,
//     position: position,
//     content: content,
//     yAnchor: 1
// });