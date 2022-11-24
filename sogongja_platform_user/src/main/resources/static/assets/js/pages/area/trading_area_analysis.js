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



// 다각형 + 상권명을 생상하고 이벤트를 등록하는 함수입니다
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

//재체크 및 해제체크 카테고리 배열 재반영 함수입니다. 현재 선택된 카테고리만 반영될겁니다.
    if(zoom<4){
        $('#storelist').css('display', 'block');
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
    }else {
        $('#storelist').css('display', 'none');
    }

 if(zoom >= 10 && zoom <= 14){//zoom 10,11,12,13,14
        //상권명+상점수 커스텀 안찍음
     ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
         console.log("이게 상권데이터 갖고오는거임", result)
         areaJson = result;
               console.log(areaJson)
     });
    }else if (zoom >= 7 && zoom < 10) { //zoom  7,8,9  시군구 조회함
     //상권명+상점수 커스텀 지우기
        removePolygons(map)// 상권 삭제
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            areaJson = result;
                console.log(areaJson)
          });
 }else if (zoom == 6) { //zoom 6
     //상권명 상점수는 지우기
     removePolygons(map)//areajson에 쓰던 상권 삭제
     ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
         console.log("이게 상권데이터 갖고오는거임", result)
         areaJson = result;
         for (var i = 0, len = areaJson.length; i < len; i++) {
             displayArea(areaJson[i]);
         }
     });
    }else if(zoom >=4 && zoom < 6) { //zoom 4,5 일때
     //상권명 + 상점수(이건 5부터) 커스텀 찍음
        setMarkers(null)//상점삭제
        removePolygons(map)//areajson에 쓰던 상권 삭제
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            areaJson = result;
            for (var i = 0, len = areaJson.length; i < len; i++) {
                displayArea(areaJson[i]);
            }
        });
    } else { //level < 4, zoom 3,2,1 일때 상점 마커들 추가 찍어주기
        setMarkers(null)//상점삭제
        console.log("zoom 이 5이하시 shop 리스트 호출")
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점찍기
        });
    }
};

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


//상점수 개폐업수 추정매출 탭 설정시 상위값에 카운트 숫자 달라짐
function changeType1() {
    //탭에서 라디오 버튼 값을 가져온다.
    var type1 = $('input[name="areaTab"]:checked').val()
    if (type1 === 'stores') {//상점수탭
        // display block / none
    } else if (type1 === 'open') {//개업수

    } else if (type1 === 'close') {//폐업수

    } else if (type1 === 'sales') {//추정매출

    }
}


//업종선택 클릭시 필터창
$('.filterIcon').click(function (){
    $('.filterbox').toggleClass('on')
})
//개업수 폐업수 선택하면 리스트닫힘
$(".openclose_list").click(function (){
    $('.openclose_list').removeClass('on')
})
//개폐업수 탭 색상 변경
$('.openclose').click(function (){
    $('.openclose_list').toggleClass('on')
    if($('input[name="areaTab"]:checked').val()=="open"){
        $(".openclose").text("개업수");
        $(".openclose").addClass("on")
        //개업수 체크이면 text 개업수로 변경
    }else if($('input[name="areaTab"]:checked').val()=="close"){
        $(".openclose").text("폐업수")
        $(".openclose").addClass("on")
        //폐업수 체크이면 text 폐업수로 변경
    }else{        //개업수 폐업수 암것도 선택아니면 그냥 개폐업수 회색글씨
        $(".openclose").text("개폐업수")
        $(".openclose").removeClass("on")
        $(".openclose_list").removeClass("on")
    }
})

$('input[name="areaTab"]').click(function (){
    if($('input[name="areaTab"]:checked').val()=="sales"){//근데 추정매출이면 필터에 시간선택 보임
        $('.timeSelect').css('display', 'block');//시간선택 ul 보이기
    }
})



$('input[name="area_maincate"]').click(function (){
    if($('input[name="area_maincate"]:checked').val()=="all"){
//대분류가 all 전체업종 선택되있으면 중분류-전체 보여줘
        $('.midSectors').css('display', 'none')
        $('.all-mid-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="I"){
//1숙박·음식
        $('.midSectors').css('display', 'none')
        $('.all-I-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="S"){
//2수리·개인서비스
        $('.midSectors').css('display', 'none')
        $('.all-S-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="G"){
//3도·소매
        $('.midSectors').css('display', 'none')
        $('.all-G-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="R"){
//4예술·스포츠·여가
        $('.midSectors').css('display', 'none')
        $('.all-R-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="N"){
//5시설관리·임대
        $('.midSectors').css('display', 'none')
        $('.all-N-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="M"){
//6과학·기술
        $('.midSectors').css('display', 'none')
        $('.all-M-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="L"){
//7부동산
        $('.midSectors').css('display', 'none')
        $('.all-L-sector').css('display', 'block')
    }else if($('input[name="area_maincate"]:checked').val()=="P"){
//8교육
        $('.midSectors').css('display', 'none')
        $('.all-P-sector').css('display', 'block')
    }
})
