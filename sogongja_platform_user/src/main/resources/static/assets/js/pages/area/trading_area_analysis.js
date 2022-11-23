// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);
// 다각형을 생성하고 지도에 표시합니다
var polygons = [];       //폴리곤 그려줄 path
var points = [];        //중심좌표 구하기 위한 지역구 좌표들
var countmarkers=[]; //상점수 개업수 폐업수 추정매출 카운트마커 배열
console.log("첫상권",areaJson,areaJson.length)
//첫화면 상권로드
for (var i = 0, len = areaJson.length; i < len; i++) {
    displayArea(areaJson[i]);
}

var areaCustomOverlay = new kakao.maps.CustomOverlay({zIndex: 1})
areaContentNode = document.createElement("div");// 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
areaContentNode.className = "areainfo_wrap";
// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(areaContentNode, "mousedown", kakao.maps.event.preventMap);
addEventHandle(areaContentNode, "touchstart", kakao.maps.event.preventMap);
// 커스텀 오버레이 컨텐츠를 설정합니다
areaCustomOverlay.setContent(areaContentNode);
// 커스텀 오버레이를 숨깁니다
areaCustomOverlay.setMap(null);//첫화면 일단지워

//상점수 탭바뀜처리 펑션 RETURN으로필요
function setAreaContent(area, stores){
    var content =
        '<div class ="arealabel">' +
        '<div class="countsidobox">' +
        '<div class="center">' +
        area.area_name +
        '</div>' +
        '<div class="right">' +
        stores +//상점수일때
        '</div>' +
        '</div>' +
        '</div>';
    return content
}



// 다각형을 생상하고 이벤트를 등록하는 함수입니다
function displayArea(area) {
    var points = [];
    var path = [];
    $.each(area.path, function (index, item) {
        path.push(new kakao.maps.LatLng(item.latitude, item.longitude));
        points.push([item.latitude, item.longitude]);
    });

    // 다각형을 생성합니다

        if(area.area_type=="D"){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#2E750D',
                strokeOpacity:1,
                fillColor: '#2E750D',
                fillOpacity: 0.4
            });
        }else if(area.area_type=="A"){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#BF7116',
                strokeOpacity:1,
                fillColor: '#BF7116',
                fillOpacity: 0.4
            });
        }else if(area.area_type=="U"){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                strokeOpacity:1,
                fillColor: '#DD4C79',
                fillOpacity: 0.4
            });
    }else{
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                strokeOpacity:1,
                fillColor: '#1540BF',
                fillOpacity: 0.4
            });
    }


    var infos = area.info;
    var stores = 0;//상점수
    var open = 0;//개업수
    var close = 0;//폐업수
    var sales = 0;//추정매출
    for (var i = 0, len = infos.length; i < len; i++) {
        stores += infos[i].stores;
        open += infos[i].open;
        close += infos[i].close;
        sales += infos[i].sales;
    }
    var position = centroid(area.path)

    // 결과값으로 받은 위치를 마커로 표시합니다
    var content =
        '<div class="areaIn">' +
        '<p class="areacenter">' +
        area.area_name +
        '</p><p class="arearight">' +
        stores +
        '</p></div>';
    // 커스텀 마커를 생성합니다
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content
    });
    // 생성된 마커를 배열에 추가합니다
    countmarkers.push(customOverlay);
    // 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);



    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
    // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
        polygon.setOptions({
            fillOpacity: 0.8
        });
        // if(zoom<7){//zoom 14~7
        //     // 커스텀 마커를 생성합니다
        //     areaCustomOverlay.setPosition(centroid(area.path));
        //     areaCustomOverlay.setMap(map);
        //     areaContentNode.innerHTML = setAreaContent(area, stores)
        // }
    });

    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
    // 커스텀 오버레이를 지도에서 제거합니다
    kakao.maps.event.addListener(polygon, 'mouseout', function () {
        polygon.setOptions({
            fillOpacity: 0.4
        });
    });

    // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
        var infowindow = new kakao.maps.InfoWindow({
            removable: false
        });
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
        infowindow.setPosition(centroid(area.path));
        infowindow.setMap(map);
    });

    polygon.setMap(map);
    polygons.push(polygon)
}

//상점수,개폐업수,추정매출 카운트를 표시하는 마커
function countSpread(thing) {

        // 결과값으로 받은 위치를 마커로 표시합니다
        var content = '<div class ="countlabel">' +
            '<div class="countsidobox">' +
            '<div class="center">' +
            thing.name +
            '</div><div class="right">' +
            loco.count +
            '</div></div></div>';
        // 커스텀 마커를 생성합니다
        var customOverlay = new kakao.maps.CustomOverlay({
            position: position,
            content: content
        });
        // 생성된 마커를 배열에 추가합니다
        markers.push(customOverlay);
        // 마커가 지도 위에 표시되도록 설정합니다
        customOverlay.setMap(map);

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
if(zoom<4){
    $('.category_wrap.storelist').css('display', 'block');
    console.log("상점 카테 보임")
    //줌 4이하일때만 동작 html에서도 ★★★줌4 이상 이면 안보이게 하든가 해야될듯
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
}


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

// //시간딜레이 함수
// function sleep(ms) {
//     return new Promise((r) => setTimeout(r, ms));
// }
//
// //첫화면 지도 로드되면 3초뒤에 실행시킴
// async function firstFunc() {
//     await sleep(300),
//         changeMap();
// };
// firstFunc();


// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", changeMap)
//지도중심 이동 시, zoom>6 상권 로드 /zoom<6 areajson = 상권 /zoom<4 상점 로드.
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


    if(zoom > 8 && zoom <= 14){//zoom 9,10,11,12,13,14
        //그냥 서울에 1개 찍자.

    }else if (zoom >= 7 && zoom <= 8) { //zoom 7,8,9 계속 재 조회함
        removePolygons(map)//areajㅁson에 쓰던 상권 삭제
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            areaJson = result;
            for (var i = 0, len = areaJson.length; i < len; i++) {
                displayArea(areaJson[i]);
            }
        });
    }else if(zoom>=4 && zoom<7) { //zoom 4,5,6 일때 areajson 쓰고 조회안함
        setMarkers(null)//상점삭제
        removePolygons(map)//areajson에 쓰던 상권 삭제
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            areaJson = result;
            for (var i = 0, len = areaJson.length; i < len; i++) {
                displayArea(areaJson[i]);
            }
        });
    } else { //level < 4, zoom 3,2,1 일때 상점 마커들 찍어주기
        setMarkers(null)//상점삭제
        console.log("zoom 이 5이하시 shop 리스트 호출")
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점찍기
        });
    }
};

function removePolygons(map) {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
    }
}
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


//탭 설정시 상위값에 카운트 숫자 달라짐
function changeType1() {
    //탭에서 라디오 버튼 값을 가져온다.
    var type1 = $('input[name="type1"]:checked').val()
    if (type1 === 'stores') {//상점수탭
        // display block / none
    } else if (type1 === 'open') {//개업수


    } else if (type1 === 'close') {//폐업수


    } else if (type1 === 'sales') {//추정매출


    }
}


//상점뿌리기함수 이거 trading_area_common에 못넣나??
//상점뿌리기
//상점뿌리기
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

//상점뿌리기함수 이거 trading_area_common에 못넣나??
//상점뿌리기
//상점뿌리기끝


// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", async function () {
    await searchAddrFromCoords(map.getCenter(), await displayCenterInfo),
        console.log("위치변경")
    await sleep(2000),
        // 선택박스에 시군구코드 기준으로 리스트뿌리기
        renderSigungu(),
        renderDong()
});