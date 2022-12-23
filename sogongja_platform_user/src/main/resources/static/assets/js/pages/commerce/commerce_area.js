var zoom, mapDefaultLevel = 5;
var clientLatitude = 37.49068266308499;
var clientLongitude = 127.05611940441852;

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

var shops = [];
for (var i = 0; i < shopList.length; i++) {
    var position = new kakao.maps.LatLng(shopList[i].latitude, shopList[i].longitude);
    var imageSize = new kakao.maps.Size(5, 5); // 마커 이미지의 크기
    var markerImage = new kakao.maps.MarkerImage("/images/new/area/marker01.png", imageSize);
    var marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
    });
    shops.push(marker);
    marker.setMap(map);
}


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

var ractangles = [];
var grids = [];

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    if (clicked) {
        clicked = false;
        map.setZoomable(true);

        for (var i = 0; i < customOverlays.length; i++) {
            customOverlays[i].setMap(null);
        }

        for (var i = 0; i < ractangles.length; i++) {
            ractangles[i].setMap(null);
        }

        for (var i = 0; i < grids.length; i++) {
            grids[i].setMap(null);
        }

        map.setCenter(mouseEvent.latLng);
        map.setLevel(zoom);

    } else {
        map.setZoomable(false);
        zoom = map.getLevel();
        console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng()+ " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())
        clicked = true;

        map.setCenter(mouseEvent.latLng);
        map.setLevel(4);

        // x1 = map.getBounds().getSouthWest().getLat();
        // x2 = map.getBounds().getNorthEast().getLat();
        // y1 = map.getBounds().getSouthWest().getLng();
        // y2 = map.getBounds().getNorthEast().getLng();
        var lat = map.getCenter().getLat();
        var lng = map.getCenter().getLng();

        $("input:checkbox[name='depth1']:checked").each(function(){

            if ($(this).val() === 'density') {
                var density_scope = [];

                // $("input:checkbox[name='depth2_density']:checked").each(function(){
                //     density_scope.push("'" + $(this).val() + "'")
                // })
                // var scope = density_scope.join();

                var scope = "'F'";

                var data = {
                    lat, lng, meter, scope
                };

                ajaxPostSyn('/commerce/area-heatmap', data, function (result) {

                    console.log(result)

                    var content = '<div><img src="data:image/png;base64,' + result.blob + '" alt="heatMap"></div>';

                    var customOverlay = new kakao.maps.CustomOverlay({
                        position: new kakao.maps.LatLng(result.x2, result.y1),
                        content: content
                    });
                    customOverlays.push(customOverlay)
                    customOverlay.setMap(map);


                    var sw = new kakao.maps.LatLng(result.x1, result.y2), // 사각형 영역의 남서쪽 좌표
                        ne = new kakao.maps.LatLng(result.x2, result.y1); // 사각형 영역의 북동쪽 좌표
                    var rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
                    var rectangle = new kakao.maps.Rectangle({
                        bounds: rectangleBounds, // 그려질 사각형의 영역정보입니다
                        strokeWeight: 4, // 선의 두께입니다
                        strokeColor: '#FF3DE5', // 선의 색깔입니다
                        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                        strokeStyle: 'shortdashdot', // 선의 스타일입니다
                        fillColor: '#FF8AEF', // 채우기 색깔입니다
                        fillOpacity: 0 // 채우기 불투명도 입니다
                    });
                    ractangles.push(rectangle)
                    rectangle.setMap(map);
                });
            } else if ($(this).val() === 'land') {

                var latInterval = 0.000909 * (meter/100);
                var lngInterval = 0.001125 * (meter/100);
                var x1 = lat - latInterval;
                var x2 = lat + latInterval;
                var y1 = lng - lngInterval;
                var y2 = lng + lngInterval;

                var data = {
                    lat, lng, meter, x1, x2, y1, y2
                };

                $("input:checkbox[name='depth2_land']:checked").each(function(){
                    if ($(this).val() === 'gradient') {

                        ajaxPostSyn('/commerce/area-gradient', data, function (result) {
                            for (var i = 0; i < result.grid.length; i++) {
                                var check = false;

                                for (var j = 0; j < result.grid[i].path.length; j++) {

                                    var line = new kakao.maps.Polyline();

                                    var path = [ new kakao.maps.LatLng(result.grid[i].path[j].latitude, result.grid[i].path[j].longitude), new kakao.maps.LatLng(lat, lng) ];
                                    line.setPath(path);

                                    // 마커와 원의 중심 사이의 거리
                                    var dist = line.getLength();

                                    // 이 거리가 원의 반지름보다 작거나 같다면
                                    if (dist <= meter) {
                                        check = true;
                                        break;
                                    }
                                }

                                if (check) {
                                    var points = [];
                                    $.each(result.grid[i].path, function (index, item) {
                                        points.push(new kakao.maps.LatLng(item.latitude, item.longitude));
                                    })

                                    var grid = new kakao.maps.Polygon({
                                        path: points, // 그려질 다각형의 좌표 배열입니다
                                        strokeWeight: 3, // 선의 두께입니다
                                        strokeColor: '#39DE2A', // 선의 색깔입니다
                                        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                        strokeStyle: 'longdash', // 선의 스타일입니다
                                        fillColor: '#A2FF99', // 채우기 색깔입니다
                                        fillOpacity: 0.7 // 채우기 불투명도 입니다
                                    });

                                    grid.setMap(map);
                                    grids.push(grid)

                                }

                            }

                        })
                    }
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

//폴리곤 중심좌표임
function centroid(points) {
    var i, j, len, p1, p2, f, area, x, y;
    area = x = y = 0;
    for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];
        f = p1.longitude * p2.latitude - p2.longitude * p1.latitude;
        x += (p1.latitude + p2.latitude) * f;
        y += (p1.longitude + p2.longitude) * f;
        area += f * 3;
    }
    return new kakao.maps.LatLng(x / area, y / area)
}


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


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 지오코딩
