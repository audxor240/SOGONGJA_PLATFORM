// 맵 기본 레벨
var mapDefaultLevel = 6;

// 기본 위치는 서울시청
var clientLatitude = 37.506280990844225;
var clientLongitude = 127.04042161585487;
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude),
        level: mapDefaultLevel
    };

var map = new kakao.maps.Map(mapContainer, mapOption),
    infowindow = new kakao.maps.InfoWindow({
        removable: false
    });

if (navigator.geolocation) {
    // 현재 접속 사용자 위치 정보
    navigator.geolocation.getCurrentPosition(function (pos) {
        clientLatitude = pos.coords.latitude;
        clientLongitude = pos.coords.longitude;

        var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
        map.setCenter(moveLatLon);
    });
}


var lat = map.getCenter().getLat(),
    lng = map.getCenter().getLng(),
    zoom = map.getLevel(),
    x2 = map.getBounds().getNorthEast().getLat(),
    y2 = map.getBounds().getNorthEast().getLng(),
    x1 = map.getBounds().getSouthWest().getLat(),
    y1 = map.getBounds().getSouthWest().getLng();
var codeType1 = new Array();
var codeType3 = 1;
var datalat = {
    lat,
    lng,
    zoom,
    x1,
    x2,
    y1,
    y2,
    codeType1,
    codeType3
}

// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", changeMap)

async function changeMap() {
    resizeMap()
    var lat = map.getCenter().getLat(),
        lng = map.getCenter().getLng(),
        zoom = map.getLevel(),
        x2 = map.getBounds().getNorthEast().getLat(),
        y2 = map.getBounds().getNorthEast().getLng(),
        x1 = map.getBounds().getSouthWest().getLat(),
        y1 = map.getBounds().getSouthWest().getLng();
    var datalat = {
        lat,
        lng,
        zoom,
        x1,
        x2,
        y1,
        y2,
        codeType1
    }
    console.log("data재요청입니다!", datalat);

    ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {

        if (zoom < 4) {
            console.log("zoom 이 5이하시 shop 리스트 호출")
            ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
                console.log("상점 데이터 뿌려주기", result)
                storeSpread(result)
            });
        }
    });
}



// 다각형을 생성하고 지도에 표시합니다
for (var i = 0, len = areaJson.length; i < len; i++) {
    displayArea(areaJson[i]);
}

function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 다각형을 생상하고 이벤트를 등록하는 함수입니다
function displayArea(area) {

    var points = [];
    var path = [];
    $.each(area.path, function (index, item) {
        path.push(new kakao.maps.LatLng(item.latitude, item.longitude));
        points.push([item.latitude, item.longitude]);
    });

    var hole = [];
    $.each(area.hole, function (index, item) {
        hole.push(new kakao.maps.LatLng(item.latitude, item.longitude));
    });

    // 다각형을 생성합니다
    var polygon = new kakao.maps.Polygon({
        map: map, // 다각형을 표시할 지도 객체
        path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
        strokeWeight: area.stroke_weight,
        strokeColor: area.stroke_color,
        strokeOpacity: area.stroke_opacity,
        strokeStyle: area.stroke_style,
        fillColor: area.fill_color,
        fillOpacity: area.fill_opacity
    });

    var infos = area.info;

    for (var i = 0, len = infos.length; i < len; i++) {
        // console.log(infos[i])
    }

    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
    // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
        polygon.setOptions({
            fillColor: area.over_fill_color,
            fillOpacity: area.over_fill_opacity
        });
    });

    // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
    // kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
    //     // customOverlay.setPosition(mouseEvent.latLng);
    // });

    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
    // 커스텀 오버레이를 지도에서 제거합니다
    kakao.maps.event.addListener(polygon, 'mouseout', function () {
        polygon.setOptions({
            fillColor: area.fill_color,
            fillOpacity: area.fill_opacity
        });
        // customOverlay.setMap(null);
    });

    // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {

        var codeType3 = $('input[name="cate2"]:checked').val();
        var data = {
            emdCd: area.emd_cd,
            codeType3: codeType3
        }
        ajaxPostSyn('/trading-area/regional/details', data, function (result) {

            console.log("이게 데이터 갖고오는거임", result)

        });
    });

}

//centroid 알고리즘 (폴리곤 중심좌표 구하기 위함)
function centroid(point) {
    var i, j, len, p1, p2, f, area, x, y;
    var area = x = y = 0;
    for (i = 0, len = point.length, j = len - 1; i < len; j = i++) {
        p1 = point[i];
        p2 = point[j];
        f = p1[1] * p2[0] - p2[1] * p1[0];
        x += (p1[0] + p2[0]) * f;
        y += (p1[1] + p2[1]) * f;
        area += f * 3;
    }

    return new kakao.maps.LatLng(x / area, y / area);
}

// 인포윈도우 닫기 이벤트
$(document).on('click', '.customoverlay_close', function () {
    infowindow.setMap(null);
});

// 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'zoom_changed', function () {
    // 지도의 현재 레벨을 얻어옵니다
    var level = map.getLevel();
    $('.area_title').css('font-size', (mapDefaultLevel / level) + 'rem');
});

//ajax 요청하는 함수
function ajaxPostSyn(url, data, callback, showLoading) {
    // IE 기본값세팅
    showLoading = typeof showLoading !== 'undefined' ? showLoading : true;
    $.ajax({
        //async:true,
        url: contextPath + url,
        data: JSON.stringify(data),
        method: "POST",
        success: function (result) {
            console.log('result : ', result);
            if (callback) {
                callback(result);
            }
        },
        beforeSend: function () {
            if (showLoading) {
                $('.wrap-loading').removeClass('display-none');
            }
        },
        complete: function () {
            if (showLoading) {
                $('.wrap-loading').addClass('display-none');
            }
        },
        error: function (xhr, status, error) {
            console.error('error : ', error);
        }
    });
}