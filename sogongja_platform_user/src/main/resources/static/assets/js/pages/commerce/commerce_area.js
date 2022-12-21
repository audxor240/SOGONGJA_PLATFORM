var zoom, mapDefaultLevel = 5;
var clientLatitude = 37.49068266308499;
var clientLongitude = 127.05611940441852;
var x1, x2, y1, y2;
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표
        level: mapDefaultLevel // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

var mapWidth =  mapContainer.style.width;
var mapHeight =  mapContainer.style.height;
console.log("width : "  + mapWidth + ", height : " + mapHeight)
console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng()+ " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())

var circles = [];
var customOverlays = [];
var meter = 300;
var clicked = false;

kakao.maps.event.addListener(map, 'mousemove', function(mouseEvent) {
    if (!clicked) {
        for (var i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }

        var circle = new kakao.maps.Circle({
            center : mouseEvent.latLng,  // 원의 중심좌표 입니다
            radius: meter, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: '#75B8FA', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#CFE7FF', // 채우기 색깔입니다
            fillOpacity: 0.7  // 채우기 불투명도 입니다
        });

        circles.push(circle);
        circle.setMap(map);

    }
});

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    if (clicked) {
        clicked = false;

        for (var i = 0; i < customOverlays.length; i++) {
            customOverlays[i].setMap(null);
        }

        map.setCenter(mouseEvent.latLng);
        map.setLevel(zoom);

    } else {
        zoom = map.getLevel();
        console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng()+ " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())
        clicked = true;

        map.setCenter(mouseEvent.latLng);
        map.setLevel(3);

        x1 = map.getBounds().getSouthWest().getLat();
        x2 = map.getBounds().getNorthEast().getLat();
        y1 = map.getBounds().getSouthWest().getLng();
        y2 = map.getBounds().getNorthEast().getLng();
        var lat = map.getCenter().getLat();
        var lng = map.getCenter().getLng();

        var data = {
            x1, x2, y1, y2, lat, lng
        }

        $("input:checkbox[name='depth1']:checked").each(function(){

            if ($(this).val() === 'density') {
                ajaxPostSyn('/commerce/area-heatmap', data, function (result) {

                    console.log(result)
                    var content = '<div><img src="data:image/png;base64,'+ result.blob +'" alt="heatMap"></div>';

                    var customOverlay = new kakao.maps.CustomOverlay({
                        position: mouseEvent.latLng,
                        content: content
                    });
                    customOverlays.push(customOverlay)
                    customOverlay.setMap(map);
                })
            }

        })

    }
});

$("input:radio[name=meter]").click(function(){
    if($("input:radio[name=meter]:checked").val() ==='300'){
        meter = 300;
    }else{
        meter = 500;
    }
});


//ajax 요청하는 함수
function ajaxPostSyn(url, data, callback, showLoading) {
    // IE 기본값세팅
    showLoading = typeof showLoading !== 'undefined' ? showLoading : true;
    $.ajax({
        //async:true,
        url: contextPath + url, data: JSON.stringify(data), method: "POST", success: function (result) {
            console.log('result : ', result);
            if (callback) {
                callback(result);
            }
        }, beforeSend: function () {
            if (showLoading) {
                $('.wrap-loading').removeClass('display-none');
            }
        }, complete: function () {
            if (showLoading) {
                $('.wrap-loading').addClass('display-none');
            }
        }, error: function (xhr, status, error) {
            console.error('error : ', error);
        }
    });
}