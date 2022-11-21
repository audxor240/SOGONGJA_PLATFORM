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

// console.log('areaJson : ', areaJson);
//
// var coords = new daum.maps.Coords(307506.045518573, 549572.690761664);
// var latlng = coords.toLatLng(); // daum.maps.LatLng 객체 반환
// console.log('latlng.toString()  : ', latlng.toString());

// 다각형을 생성하고 지도에 표시합니다
var polygons = [];

for (var i = 0, len = areaJson.length; i < len; i++) {
    displayArea(areaJson[i]);
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
        path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
        strokeWeight: area.stroke_weight,
        strokeColor: area.stroke_color,
        strokeOpacity: area.stroke_opacity,
        strokeStyle: area.stroke_style,
        fillColor: area.fill_color,
        fillOpacity: area.fill_opacity
    });

    var infos = area.info;
    var stores = 0;
    var open = 0;
    var close = 0;
    var sales = 0;
    for (var i = 0, len = infos.length; i < len; i++) {
        stores += infos[i].stores;
        open += infos[i].open;
        close += infos[i].close;
        sales += infos[i].sales;
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
        var content = '';
        content += '<div class="customoverlay map_tooltip">';
        content += '  <h3>' + area.area_title + '</h3>';
        content += '  <div class="close customoverlay_close" title="닫기"></div>';
        content += '  <div>';
        content += '    <ul>';
        content += '      <li class="stores"><span>점포수</span><p>' + stores + '</p></li>';
        content += '      <li class="open"><span>개업률</span><p>' + open + '</p></li>';
        content += '      <li class="close"><span>폐업률</span><p>' + close + '</p></li>';
        content += '      <li class="sales"><span>추정매출</span><p>' + sales + '</p></li>';
        content += '    </ul>';
        content += '  </div>';
        content += '</div>';

        infowindow.setContent(content);
        infowindow.setPosition(mouseEvent.latLng);
        infowindow.setMap(map);
    });


    polygon.setMap(map);
    polygons.push(polygon)
}


// // 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
// var lat = map.getCenter().getLat(),
//     lng = map.getCenter().getLng(),
//     zoom = map.getLevel(),
//     x2 = map.getBounds().getNorthEast().getLat(),
//     y2 = map.getBounds().getNorthEast().getLng(),
//     x1 = map.getBounds().getSouthWest().getLat(),
//     y1 = map.getBounds().getSouthWest().getLng();
// var codeType1 = new Array();
// var codeType2 = 'A';
//
// var datalat = {
//     lat,
//     lng,
//     zoom,
//     x1,
//     x2,
//     y1,
//     y2,
//     codeType1,
//     codeType2
// }
// console.log("첫 data이겁니다!!", datalat);
//
//
// // 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
// kakao.maps.event.addListener(map, "idle", changeMap)
//
// async function changeMap() {
//     var lat = map.getCenter().getLat(),
//         lng = map.getCenter().getLng(),
//         zoom = map.getLevel(),
//         x2 = map.getBounds().getNorthEast().getLat(),
//         y2 = map.getBounds().getNorthEast().getLng(),
//         x1 = map.getBounds().getSouthWest().getLat(),
//         y1 = map.getBounds().getSouthWest().getLng(),
//         codeType2 = $('input[name="cate2"]:checked').val();
//
//     var datalat = {
//         lat,
//         lng,
//         zoom,
//         x1,
//         x2,
//         y1,
//         y2,
//         codeType1,
//         codeType2
//     }
//     console.log("data재요청입니다!", datalat);
//     removePolygons(map)
//     ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
//
//         console.log("이게 데이터 갖고오는거임", result)
//         areaJson = result;
//         for (var i = 0, len = areaJson.length; i < len; i++) {
//             displayArea(areaJson[i]);
//         }
//     });
//
//     if (zoom < 6) {
//         console.log("zoom 이 5이하시 shop 리스트 호출")
//         ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
//             console.log("상점 데이터 뿌려주기", result)
//
//         });
//     }
// };
//
//
// function removePolygons(map) {
//     for (var i = 0; i < polygons.length; i++) {
//         polygons[i].setMap(null);
//     }
// }

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

function changeType1() {

    //라디오 버튼 값을 가져온다.
    var type1 = $('input[name="type1"]:checked').val()
    if (type1 === 'stores') {
        // display block / none
    } else if (type1 === 'open') {


    } else if (type1 === 'close') {


    } else if (type1 === 'sales') {


    }
}


//상점
//상점
//상점
// 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
var lat = map.getCenter().getLat(),
    lng = map.getCenter().getLng(),
    zoom = map.getLevel(),
    x2 = map.getBounds().getNorthEast().getLat(),
    y2 = map.getBounds().getNorthEast().getLng(),
    x1 = map.getBounds().getSouthWest().getLat(),
    y1 = map.getBounds().getSouthWest().getLng();
var codeType1 = new Array();
var codeType2 = 'A';


//첫화면 처음에 카테고리 체크되어 있는 그대로 어레이 생성함 8개 다 들어감
$("input[name=cate]").prop("checked", true).each(function (index, item) {
    codeType1.push($(item).val());
});
//재체크 및 해제체크 카테고리 배열 재반영 함수입니다. 현재 선택된 카테고리만 반영될겁니다.
$("input[name=cate]").click(function () {
    if ($(this).prop('checked')) {
        console.log($(this).val())
        if (!(codeType1.includes($(this).val()))) {//arr에 없으면 재체크니까 추가해
            codeType1.push($(this).val());
        }
    } else {
        console.log($(this))
        codeType1.forEach((item, index) => {
            if (item == $(this).val()) {
                codeType1.splice(index, 1);
            }
        })
    }
})

var datalat = {
    lat,
    lng,
    zoom,
    x1,
    x2,
    y1,
    y2,
    codeType1,
    codeType2
}

//시간딜레이 함수
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function firstFunc() {
    await sleep(300),
        changeMap();
};
firstFunc();


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
        codeType2 = $('input[name="cate2"]:checked').val();
        console.log(":::::" + codeType2)
    var datalat = {
        lat,
        lng,
        zoom,
        x1,
        x2,
        y1,
        y2,
        codeType1,
        codeType2
    }
    console.log("data재요청입니다!", datalat);
    removePolygons(map)
    ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {

        console.log("이게 데이터 갖고오는거임", result)
        areaJson = result;
        for (var i = 0, len = areaJson.length; i < len; i++) {
            displayArea(areaJson[i]);
        }
    });
    setMarkers(null)
    if (zoom < 4) {
        console.log("zoom 이 5이하시 shop 리스트 호출")
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)
        });
    }
};

function removePolygons(map) {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
    }
}

function changeType1() {

    //라디오 버튼 값을 가져온다.
    var type1 = $('input[name="type1"]:checked').val()
    if (type1 === 'stores') {
        // display block / none
    } else if (type1 === 'open') {


    } else if (type1 === 'close') {


    } else if (type1 === 'sales') {


    }
}
// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

function storeSpread(thing) {
    var imageSrc = "", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        QimageSrc = "/images/new/area/marker01.png",
        NimageSrc = "/images/new/area/marker02.png",
        LimageSrc = "/images/new/area/marker03.png",
        FimageSrc = "/images/new/area/marker04.png",
        DimageSrc = "/images/new/area/marker05.png",
        OimageSrc = "/images/new/area/marker06.png",
        PimageSrc = "/images/new/area/marker07.png",
        RimageSrc = "/images/new/area/marker08.png";
    for (var i = 0; i < thing.length; i++) {
        if (thing[i].code_type1 == "Q") {
            var imageSrc = QimageSrc
        } else if (thing[i].code_type1 == "N") {
            var imageSrc = NimageSrc
        } else if (thing[i].code_type1 == "L") {
            var imageSrc = LimageSrc
        } else if (thing[i].code_type1 == "F") {
            var imageSrc = FimageSrc
        } else if (thing[i].code_type1 == "D") {
            var imageSrc = DimageSrc
        } else if (thing[i].code_type1 == "O") {
            var imageSrc = OimageSrc
        } else if (thing[i].code_type1 == "P") {
            var imageSrc = PimageSrc
        } else if (thing[i].code_type1 == "R") {
            var imageSrc = RimageSrc
        } else {
            var imageSrc = "/images/new/area/marker01.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
        }
        // 지도에 마커를 생성합니다
        var marker = addMarker(thing, i, imageSrc);//위치,이미지를 마커에 등록
        markers.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        marker.setMap(map);  // 마커가 지도 위에 표시되도록 설정합니다
    }
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(place, i, imageSrc) {
    //if mapsize width 모바일일때 마커 크기 20으로
    if (window.innerWidth < 767) {
        var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude),
            imageSize = new kakao.maps.Size(20, 20), // 마커 이미지의 크기
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
            });
    } else {
        var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude),
            imageSize = new kakao.maps.Size(10, 10), // 마커 이미지의 크기
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
            });
    }

    return marker;
}

//마커다시그림
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function resizeMap() {//지도 리사이즈 함수
    var mapContainer = document.getElementById('map');
    mapContainer.style.width = window.innerWidth;//window.innerWidth : 브라우저 화면의 너비(viewport)
    mapContainer.style.height = window.innerHeight;//window.innerHeight : 브라우저 화면의 높이(viewport)
    map.relayout();//화면사이즈 재렌더링
}