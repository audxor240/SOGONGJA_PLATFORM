//상권 맵 기본 레벨
var mapDefaultLevel = 5;
//상권 기본 위치는 강남구 좌표
var clientLatitude = 37.5045717035321;
var clientLongitude = 127.03184797874623;
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표 기본 위치는 서울시청
        level: mapDefaultLevel, // 지도의 확대 레벨
    };
// 상권 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 다각형을 생성하고 지도에 표시합니다
var polygons = [];   //폴리곤 그려줄 path
var points = [];  //중심좌표 구하기 위한 지역구 좌표들
var countmarkers = []; //시군구시도 카운트마커 배열
var areanameMarkers = []; //상권이름 마커 배열
console.log("첫상권", areaJson, areaJson.length)
//첫화면 상권로드
for (var i = 0, len = areaJson.length; i < len; i++) {
    displayArea(areaJson[i]);
}
$('#storelist').css('display', 'none');//상점 카테고리 삭제


var areaCustomOverlay = new kakao.maps.CustomOverlay({zIndex: 1})
areaContentNode = document.createElement("div");// 상권 사이드바 의 컨텐츠 엘리먼트 입니다
// 상권 사이드바 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
areaContentNode.className = "areainfo_wrap";
// 상권 사이드바 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(areaContentNode, "mousedown", kakao.maps.event.preventMap);
addEventHandle(areaContentNode, "touchstart", kakao.maps.event.preventMap);
// 상권 사이드바 커스텀 오버레이 컨텐츠를 설정합니다
areaCustomOverlay.setContent(areaContentNode);
// 상권 사이드바 커스텀 오버레이를 숨깁니다
areaCustomOverlay.setMap(null);//상권 사이드바 첫화면 일단지워


// 다각형 + 상권명을 생상하고 이벤트를 등록하는 함수입니다 맵크기 6~이하일때만 그림
function displayArea(area) {
    var points = [];
    var path = [];
    $.each(area.path, function (index, item) {
        path.push(new kakao.maps.LatLng(item.latitude, item.longitude));
        points.push([item.latitude, item.longitude]);
    });
    var hole = [];
    $.each(area.hole, function(index, item) {
        hole.push(new kakao.maps.LatLng(item.latitude, item.longitude));
    });
    //상점수,개폐업,추정매출
    var info = area.info




    // 다각형을 생성합니다
    if (area.area_type == "D") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#2E750D',
            strokeOpacity: 1,
            fillColor: '#2E750D',
            fillOpacity: 0.4
        });
        var content =
            '<div class="areaIn color2E750D">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div>' +
            '<p class="store-num">' +
            "상점수" +
            '</p>' +
            '<p class="open-num">' +
            "개업수" +
            '</p>' +
            '<p class="close-num">' +
            "폐업수" +
            '</p>' +
            '<p class="sales-num">' +
            "추정매출수" +
            '</p>' +
            '</div>' +
            '</div>';
    } else if (area.area_type == "A") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#BF7116',
            strokeOpacity: 1,
            fillColor: '#BF7116',
            fillOpacity: 0.4
        });
        var content =
            '<div class="areaIn colorBF7116">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div>' +
            '<p class="store-num">' +
            "상점수" +
            '</p>' +
            '<p class="open-num">' +
            "개업수" +
            '</p>' +
            '<p class="close-num">' +
            "폐업수" +
            '</p>' +
            '<p class="sales-num">' +
            "추정매출수" +
            '</p>' +
            '</div>' +
            '</div>';
    } else if (area.area_type == "U") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#DD4C79',
            strokeOpacity: 1,
            fillColor: '#DD4C79',
            fillOpacity: 0.4
        });
        var content =
            '<div class="areaIn colorDD4C79">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div>' +
            '<p class="store-num">' +
            "상점수" +
            '</p>' +
            '<p class="open-num">' +
            "개업수" +
            '</p>' +
            '<p class="close-num">' +
            "폐업수" +
            '</p>' +
            '<p class="sales-num">' +
            "추정매출수" +
            '</p>' +
            '</div>' +
            '</div>';
    } else {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#1540BF',
            strokeOpacity: 1,
            fillColor: '#1540BF',
            fillOpacity: 0.4
        });
        var content =
            '<div class="areaIn color1540BF>' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div>' +
                '<p class="store-num">' +
                "상점수" +
                '</p>' +
                '<p class="open-num">' +
                "개업수" +
                '</p>' +
                '<p class="close-num">' +
                "폐업수" +
                '</p>' +
                '<p class="sales-num">' +
                "추정매출수" +
                '</p>' +
            '</div>' +
            '</div>';
    }

    polygon.setMap(map);
    polygons.push(polygon)
    // 커스텀 상권이름 마커를 생성합니다
    var position = centroid(area.path)
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content
    });
// 생성된 마커를 배열에 추가합니다
    areanameMarkers.push(customOverlay);
// 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);

    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
    kakao.maps.event.addListener(customOverlay, 'mouseover', function (mouseEvent) {
        polygon.setOptions({
            fillOpacity: 0.8
        });
    });
    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
    kakao.maps.event.addListener(polygon, 'mouseout', function () {
        polygon.setOptions({
            fillOpacity: 0.4
        });
    });
    // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
        // 클릭 시 상권그래프 인포 + 사이드바 생성
        // if 전체 업종
        // else 그 외 업종
    });

}


// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", changeMap)

//지도중심 이동 시,
async function changeMap() {
    resizeMap()//중심 바뀌면 맵크기 조절함 모바일사이즈 됐을때
    var lat = map.getCenter().getLat(),
        lng = map.getCenter().getLng(),
        zoom = map.getLevel(),
        x2 = map.getBounds().getNorthEast().getLat(),
        y2 = map.getBounds().getNorthEast().getLng(),
        x1 = map.getBounds().getSouthWest().getLat(),
        y1 = map.getBounds().getSouthWest().getLng();
    codeType2 = $('input[name="cate2"]:checked').val();
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

    if (zoom >= 6 && zoom <= 14) {//zoom 6 ~ 14
        //시도,시군구 단위 자체 마커
        removePolygons(map)// 상권 삭제
        $('.areaTap').css('display', 'none');
        $('#filter').css('display', 'none');
        for (var i = 0; i < countmarkers.length; i++) {
            countmarkers[i].setMap(null);//시군구, 시도마커 비우고
        }
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            resultSpread(result)//다시그려
        });
    } else if (zoom >= 4 && zoom < 6) { //zoom 4,5 일때
        //상권패스  +커스텀마커: 상권명 + 상점수
        //          + 클릭 시 그래프★★★
        for (var i = 0; i < countmarkers.length; i++) {
            countmarkers[i].setMap(null);//시군구 마커 비우고
        }
        setMarkers(null)//상점삭제
        $('#storelist').css('display', 'none');//상점 카테고리 삭제

        //5~ 상점수,개폐업수,추정매출 탭 보이기 + 필터 보이기
        removePolygons(map)//areajson에 쓰던 상권 삭제하고
        for (var i = 0; i < areanameMarkers.length; i++) {
            areanameMarkers[i].setMap(null);//상권이름 마커 비우고
        }
        $('.areaTap').css('display', 'block');
        $('#filter').css('display', 'block');
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            for (var i = 0, len = result.length; i < len; i++) {
                displayArea(result[i]);//상권 패스 다시 그려줌
            }
        });
    } else { //level < 4, zoom 3,2,1 일때
        // 상점 마커들 추가로 찍어주기
        setMarkers(null)
        $('#storelist').css('display', 'block');
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
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점 찍기
        });
    }
};
//changeMap 끝
//changeMap 끝


//맵 6이상 시도,행정동 카운트를 표시하는 마커
function resultSpread(thing) {
    thing.forEach((thing) => {
        if (thing.emdcd == '11') {
            var name = '서울시'
        } else if (thing.emdcd == '11110') {
            var name = "종로구"
        } else if (thing.emdcd == '11140') {
            var name = "중구"
        } else if (thing.emdcd == '11170') {
            var name = "용산구"
        } else if (thing.emdcd == '11200') {
            var name = "성동구"
        } else if (thing.emdcd == '11215') {
            var name = "광진구"
        } else if (thing.emdcd == '11230') {
            var name = "동대문구"
        } else if (thing.emdcd == '11260') {
            var name = "중랑구"
        } else if (thing.emdcd == '11290') {
            var name = "성북구"
        } else if (thing.emdcd == '11305') {
            var name = "강북구"
        } else if (thing.emdcd == '11320') {
            var name = "도봉구"
        } else if (thing.emdcd == '11350') {
            var name = "노원구"
        } else if (thing.emdcd == '11380') {
            var name = "은평구"
        } else if (thing.emdcd == '11410') {
            var name = "서대문구"
        } else if (thing.emdcd == '11440') {
            var name = "마포구"
        } else if (thing.emdcd == '11470') {
            var name = "양천구"
        } else if (thing.emdcd == '11500') {
            var name = "강서구"
        } else if (thing.emdcd == '11530') {
            var name = "구로구"
        } else if (thing.emdcd == '11545') {
            var name = "금천구"
        } else if (thing.emdcd == '11560') {
            var name = "영등포구"
        } else if (thing.emdcd == '11590') {
            var name = "동작구"
        } else if (thing.emdcd == '11620') {
            var name = "관악구"
        } else if (thing.emdcd == '11650') {
            var name = "서초구"
        } else if (thing.emdcd == '11680') {
            var name = "강남구"
        } else if (thing.emdcd == '11710') {
            var name = "송파구"
        } else if (thing.emdcd == '11740') {
            var name = "강동구"
        } else {
            var name = ''
        }
        geocoder.addressSearch(name, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                // 결과값으로 받은 위치를 마커로 표시합니다
                var content = '<div class ="countlabel">' +
                    '<div class="countsidobox">' +
                    '<div class="center">' +
                    name +
                    '</div><div class="right">' +
                    thing.count +
                    '</div></div></div>';
                var marker = new kakao.maps.CustomOverlay({
                    position: coords,
                    content: content
                });
                // 생성된 마커를 배열에 추가합니다
                countmarkers.push(marker);
                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
            }
        });
    })
}


//폴리곤지우기
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


//업종선택 클릭시 필터창
$('.filterIcon').click(function () {
    $('.filterbox').toggleClass('on')
})
//개폐업수 클릭시 개업or폐업수선택
$(".openclose").click(function () {
    $('.openclose_list').toggleClass('on')
})
//개업수 폐업수 선택하면 리스트 닫힘
$(".openclose_list").click(function () {
    $('.openclose_list').removeClass('on')
})
//개폐업수 탭 색상 변경
$('input[name="areaTab"]').click(function () {
    if ($('input[name="areaTab"]:checked').val() == "open") {//개업수
        $(".openclose").text("개업수");
        $(".openclose").addClass("on")
        //개업수 체크이면 text 개업수로 변경
        $('.timeSelect').css('display', 'none');//시간선택 ul 가리기
        //개업수 카운트 디스플레이 block
        $(".open-num").css('display', 'block');
        $(".open-num").siblings().css('display', 'none');
    } else if ($('input[name="areaTab"]:checked').val() == "close") {//폐업수
        $(".openclose").text("폐업수")
        $(".openclose").addClass("on")
        //폐업수 체크이면 text 폐업수로 변경
        $('.timeSelect').css('display', 'none');//시간선택 ul 가리기
        //폐업수 카운트 디스플레이 block
        $(".close-num").css('display', 'block');
        $(".close-num").siblings().css('display', 'none');
    } else if ($('input[name="areaTab"]:checked').val() == "sales") {//추정매출
        $(".openclose").text("개폐업수")
        $(".openclose").removeClass("on")
        $(".openclose_list").removeClass("on")
        //개업수 폐업수 선택아니면 개폐업수
        $('.timeSelect').css('display', 'block');//시간선택 ul 보이기
        //추정매출 카운트 디스플레이
        $(".sales-num").css('display', 'block');
        $(".sales-num").siblings().css('display', 'none');
    } else {//상점수 탭일때
        $(".openclose").text("개폐업수")
        $(".openclose").removeClass("on")
        $(".openclose_list").removeClass("on")
        //개업수 폐업수 선택아니면 개폐업수
        $('.timeSelect').css('display', 'none');//시간선택 ul 가리기
        //상점수 카운트 디스플레이
        $(".store-num").css('display', 'block');
        $(".store-num").siblings().css('display', 'none');
    }
})
$('input[name="area_maincate"]').click(function () {
    if ($('input[name="area_maincate"]:checked').val() == "all") {
//대분류가 all 전체업종 선택되있으면 중분류-전체 보여줘
        $('.midSectors').css('display', 'none')
        $('.all-mid-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "I") {
//1숙박·음식
        $('.midSectors').css('display', 'none')
        $('.all-I-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "S") {
//2수리·개인서비스
        $('.midSectors').css('display', 'none')
        $('.all-S-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "G") {
//3도·소매
        $('.midSectors').css('display', 'none')
        $('.all-G-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "R") {
//4예술·스포츠·여가
        $('.midSectors').css('display', 'none')
        $('.all-R-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "N") {
//5시설관리·임대
        $('.midSectors').css('display', 'none')
        $('.all-N-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "M") {
//6과학·기술
        $('.midSectors').css('display', 'none')
        $('.all-M-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "L") {
//7부동산
        $('.midSectors').css('display', 'none')
        $('.all-L-sector').css('display', 'block')
    } else if ($('input[name="area_maincate"]:checked').val() == "P") {
//8교육
        $('.midSectors').css('display', 'none')
        $('.all-P-sector').css('display', 'block')
    }
})
