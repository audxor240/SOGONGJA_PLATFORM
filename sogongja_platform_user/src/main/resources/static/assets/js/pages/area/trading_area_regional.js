//상권
//1주소창, 2시도+시군구+읍면동선택창, 3+-현위치버튼, 4모바일리사이즈, 5상점마커

//지역 맵 기본 레벨
var mapDefaultLevel = 6;

// 기본 위치는 강남구 좌표

var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude),
        level: mapDefaultLevel
    };

var map = new kakao.maps.Map(mapContainer, mapOption),
    infowindow = new kakao.maps.InfoWindow({
        removable: false
    });
//현위치 설정
function setCenter() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
    map.setLevel(mapDefaultLevel);
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

// 지도 타입 정보(지적편집도)를 가지고 있을 객체입니다
var mapTypes = {
    useDistrict: kakao.maps.MapTypeId.USE_DISTRICT
};
// (지적편집도)체크 박스를 선택하면 호출되는 함수입니다
function setOverlayMapTypeId() {
    chkUseDistrict = document.getElementById('chkUseDistrict');
    // 지도 타입을 제거합니다
    for (var type in mapTypes) {
        map.removeOverlayMapTypeId(mapTypes[type]);
    }
    // 지적편집도정보 체크박스가 체크되어있으면 지도에 지적편집도정보 지도타입을 추가합니다
    if (chkUseDistrict.checked) {
        map.addOverlayMapTypeId(mapTypes.useDistrict);
    }
}

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("lat")) {
    if (navigator.geolocation) {
        // 현재 접속 사용자 위치 정보
        navigator.geolocation.getCurrentPosition(function (pos) {
            clientLatitude = pos.coords.latitude;
            clientLongitude = pos.coords.longitude;

            var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
            map.setCenter(moveLatLon);
        });
    }
}

//현위치 설정
function setCenter() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
    map.setLevel(mapDefaultLevel);
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

//지도 리사이즈 함수
function resizeMap() {
    var mapContainer = document.getElementById('map');
    mapContainer.style.width = window.innerWidth;//window.innerWidth : 브라우저 화면의 너비(viewport)
    mapContainer.style.height = window.innerHeight;//window.innerHeight : 브라우저 화면의 높이(viewport)
    map.relayout();//화면사이즈 재렌더링
}

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소 검색을 요청하는 함수입니다
function searchPlaces2() {
    var keyword = document.getElementById("keyword").value;
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
        alert("주소를 입력해주세요!");
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    geocoder.addressSearch(keyword, placesSearchCB);
}
// 주소 검색을 요청하는 함수입니다
function searchPlacesMobile() {
    var keyword = document.getElementById("keyword2").value;
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
        alert("주소를 입력해주세요!");
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    geocoder.addressSearch(keyword, placesSearchCB);
}
$('.dif').click(function (){
    $('.msearch_pop').addClass('on')
})
$('.search_pop_del').click(function (){
    $('.msearch_pop').removeClass('on')
})

// 주소로 좌표를 검색합니다
function placesSearchCB(result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
    }
}

// 현재 지도 중심좌표로 주소를 검색해서 지도 상단에 표시합니다
async function nowSpot() {
    await searchAddrFromCoords(map.getCenter(), await displayCenterInfo)
};
nowSpot();

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", async function () {
    await searchAddrFromCoords(map.getCenter(), await displayCenterInfo),
        await sleep(2000),
        // 선택박스에 시군구코드 기준으로 리스트뿌리기
        renderSigungu(),
        renderDong()
});

async function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    await geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
async function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {

        var infoDiv1 = document.getElementById("centerAddr1");
        var infoDiv2 = document.getElementById("centerAddr2");
        var infoDiv3 = document.getElementById("centerAddr3");

        for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === "H") {
                var nowCode = result[i].code;
                var sidoCode = nowCode.slice(0, 2);
                var sigunguCode = nowCode.slice(0, 4);

                infoDiv1.innerHTML = result[i].region_1depth_name;
                infoDiv1.className = sidoCode;
                infoDiv1.title = sidoCode;
                infoDiv2.innerHTML = result[i].region_2depth_name;
                infoDiv2.className = sigunguCode;
                infoDiv2.title = sigunguCode;
                infoDiv3.innerHTML = result[i].region_3depth_name;
                renderSido()
                renderSigungu()
                renderDong()
                break;
            }
        }

        var gu = $("#centerAddr2").text().trim();
        var guArr = gu.split(" ");

        if(guArr.length > 1){
            gu = guArr[0];
        }
        let data = {
            "type": "region",
            "gu": gu
        };
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        //해당 위치에 따라 커뮤니티 정보를 불러온다.
        $.ajax({
            type: "POST",
            url: "/trading-area/map/communityList",
            async: false,
            data: JSON.stringify(data),
            //contentType:"application/json; charset=utf-8",
            //dataType:"json",
            //data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            error: function (res) {
                let fragment = res.responseText
                $(".community_pop_list").replaceWith(fragment);
                //$("#dtsch_modal").show();
                //alert(res.responseJSON.message);
                return false;
            }
        }).done(function (fragment) {
            //여기로 안들어옴.....
            $(".community_pop_list").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //$(".loading_box").hide();

        });
    }
}

/*시도,시군구,행정동*/
/*시도,시군구,행정동*/
/*시도,시군구,행정동*/
//시도 시군구 클래스에 저장한 코드네임 조회
function sidoCodeSet() {
    var sidoCode = document.getElementById('centerAddr1').className;
    return sidoCode;
}
function sigunguCodeSet() {
    var sigunguCode = document.getElementById('centerAddr2').className;
    return sigunguCode;
}

//1.시도 리스트 조회
var mainurl =
    `https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=`
async function fetchSido() {
    let response = await fetch(mainurl + `*00000000`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}
async function fetchSigungu(code) {
    let response = await fetch(mainurl + `${code}` + `*000000` + `&is_ignore_zero=true`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}
//3행정동 리스트 조회
async function fetchDong(code) {
    let response = await fetch(mainurl + `${code}` + `*&is_ignore_zero=true`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}
//1-1시도 리스트 선택박스 렌더링
async function renderSido() {
    let sidos = await fetchSido();
    var sidoList = sidos.regcodes;
    let html = '';
    sidoList.forEach((sido) => {
        let htmlSegment = `<li title="${sido.name}" id="${sido.name}" value="${sido.code}" onclick="onClickSidoSearch(this)">
                            ${sido.name}
                        </li>`;
        html += htmlSegment;
    });
    sidoBox.innerHTML = html;
}
renderSido()

//2-1시군구 리스트 선택박스 렌더링
async function renderSigungu() {
    let code = await sidoCodeSet();
    let sidos = await fetchSigungu(code);
    var sidoList = sidos.regcodes;
    var name = [];
    let fiddong = sidoList.map((el, index, arr) => ({
        ...el, dong: el.name.split(" ", 2)[1]
    }));
    name = [...fiddong]
    //문자열에서 시도를 제거하고 시군구만 담고 innerhtml로 ul 리스트담음
    let html = '';
    name.forEach((sido) => {
        let htmlSegment = `<li title="${sido.name}" id="${sido.name}" value="${sido.code}" onclick="onClickSearch(this)">
                            ${sido.dong}
                        </li>`;
        html += htmlSegment;
    });
    sigunguBox.innerHTML = html;
}
renderSigungu()
function isdongTrue(el) {
    var dd = (el.name.split(" ", 4));
    if (dd.length === 4) {
        return true;
    }
}
//3-1행정동 리스트 선택박스 렌더링
async function renderDong() {
    let code = await sigunguCodeSet();
    let sidos = await fetchDong(code);
    var sidoList = sidos.regcodes;

    var name = [];
    let fiddong = sidoList.map((el, index, arr) => ({
        ...el,
        dong: el.name.split(" ")[3] != undefined?el.name.split(" ")[2]+" "+el.name.split(" ")[3]:el.name.split(" ")[2]
    }));
    name = [...fiddong]
    //문자열에서 시도,시군구를 제거하고 3번째 행정동만 담고/ 만약 4문단이면 3,4번째도 담음 innerhtml로 ul 리스트담음
    let html = '';
    name.forEach((sido) => {
        let htmlSegment = `<li title="${sido.name}" id="${sido.name}"
        value="${sido.code}" onclick="onClickSearch(this)">
                            ${sido.dong}
                        </li>`;
        html += htmlSegment;
    });
    dongBox.innerHTML = html;
}
renderDong()

//개별 시군구,행정동 리스트 클릭시에 자동 검색
function searchSidoDongPlaces() {
    if (!currCategory) {
        return;
    }
    geocoder.addressSearch(currCategory, placesSearchCB, { useMapBounds: true })
    sidoBox.className = '';
    sigunguBox.className = '';
    dongBox.className = '';
}

//시도 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSidoSearch(el) {
    var id = el.id,
        className = el.className;
    currCategory = id;
    searchSidoDongPlaces();
}

//시군구 행정동 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSearch(el) {
    var id = el.id,
        className = el.className;
    if (className === 'on') {
        currCategory = '';
    } else {
        currCategory = id;
        searchSidoDongPlaces();
    }
}
mapContainer.addEventListener("click", e => {
    sidoBox.className = '';
    sigunguBox.className = '';
    dongBox.className = '';
})


//시군구 선택박스 닫기 열기
var sidoBox = document.getElementById('sidoBox');
var sigunguBox = document.getElementById('sigunguBox');
var dongBox = document.getElementById('dongBox');

function changeSelectBox(type) {
    // 시도 카테고리가 클릭됐을 때
    if($('.addrlist>ul').hasClass("menu_selected") == true){
        sidoBox.className = '';
        sigunguBox.className = '';
        dongBox.className = '';
    }else {
        if (type === 'sido') {
        // 시도 카테고리를 선택된 스타일로 변경하고
        sidoBox.className = 'menu_selected';
        // 시군구과 읍면동 카테고리는 선택되지 않은 스타일로 바꿉니다
        sigunguBox.className = '';
        dongBox.className = '';
        } else if (type === 'sigungu') { // 시군구 카테고리가 클릭됐을 때
            // 시군구 카테고리를 선택된 스타일로 변경하고
            sidoBox.className = '';
            sigunguBox.className = 'menu_selected';
            dongBox.className = '';
        } else if (type === 'dong') { // 행정동 카테고리가 클릭됐을 때
            // 행정동 카테고리를 선택된 스타일로 변경하고
            sidoBox.className = '';
            sigunguBox.className = '';
            dongBox.className = 'menu_selected';
        }
    }
}

// 지도 중심을 부드럽게 이동시킵니다
function panTo(position) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = position;
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}


//상점공통마커
//상점공통마커
//상점공통마커
// 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
var lat = map.getCenter().getLat(),
    lng = map.getCenter().getLng(),
    zoom = map.getLevel(),
    x2 = map.getBounds().getNorthEast().getLat(),
    y2 = map.getBounds().getNorthEast().getLng(),
    x1 = map.getBounds().getSouthWest().getLat(),
    y1 = map.getBounds().getSouthWest().getLng();
var codeType1 = new Array();
var codeType3 = '1';
var polygons = [];//지역 폴리곤
var polygons1 = [];//클릭시 한겹레이어 폴리곤
var circles = [];//호버시 지역정보 동그라미
var clickcircles = [];//클릭시 지역정보 동그라미
var clickcInfoWins =[];//클릭시 지역정보 인포윈도

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
/*동동이 관련*/
/*동동이 관련*/
/*동동이 관련*/
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

        var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude),
            imageSize = new kakao.maps.Size(10, 10), // 마커 이미지의 크기
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
            });

    return marker;
}
//마커다시그림
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
//상점뿌리기끝


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
    lat = map.getCenter().getLat(),
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
        codeType1,
        codeType3
    }
    console.log("data재요청입니다!", datalat);

    if (zoom > 7) {//zoom 8 ~ 14
        //removeCircles(map);
        $('.areaTap').css('display', 'none');
        $('.area_map').addClass('on')
    } else if(zoom >= 4 && zoom <= 7){ //zoom 4,5,6,7 일때
        $('.areaTap').css('display', 'block');
        $('.area_map').removeClass('on')
        setMarkers(null)//상점삭제
        $('.category_wrap.region').css('display', 'none');//상점 카테고리 삭제
    }else {//zoom 3,2,1 일때
        setMarkers(null);//상점삭제
        $('.category_wrap.region').css('display', 'block');//상점 카테고리 추가
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점찍기
        });
    }

}

async function changeType() {
    resizeMap()
    removePolygons(map)//폴리곤삭제
    removeCircles(map);//호버삭제
    circles.splice(0);
    for (var i = 0; i < polygons1.length; i++) {//클릭 한겹 폴리곤 레이어 일단지움
        polygons1[i].setMap(null);
    }
    for (var i = 0; i < clickcircles.length; i++) {// 클릭-지역명 일단지움
        clickcircles[i].setMap(null);
    }
    for (var i = 0; i < clickcInfoWins.length; i++) {// 클릭-지역커스텀인포 일단지움
        clickcInfoWins[i].setMap(null);
    }

    codeType3 = $('input[name="cate2"]:checked').val();
    var datatype = {codeType3}

    ajaxPostSyn('/trading-area/regional/type', datatype, function (result) {
        console.log("라디오 변경 될때 circle 다시 찍어주기", result)
        areaJson = result;
        for (var i = 0, len = areaJson.length; i < len; i++) {
            displayArea(areaJson[i]);
        }
    });

}

$('.category_wrap.region').css('display', 'none');//첫화면 상점 카테고리 삭제
//첫화면 다각형을 생성하고 지도에 표시합니다
for (var i = 0, len = areaJson.length; i < len; i++) {
    displayArea(areaJson[i]);
}

function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function removePolygons() {
    for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
    }
}

function removeCircles() {
    for (var i = 0; i < circles.length; i++) {
        circles[i].setMap(null);
    }
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

    var info = area.info;
    var total = 0;
    var content = '';
    if (info.length > 0) {
        var regionName = area.area_name //해당 지역명
        if (codeType3 === '1') {//상점수
            total = info[0].stores;//총상점수
            var fran_store = Math.round(info[0].franc / info[0].stores * 100) + '%' ;//가맹점포
            var normal_store = Math.round((info[0].stores - info[0].franc) / info[0].stores * 100) + '%'; //일반점포

            var content='<div class ="regionlabel">' +
                '<div class="regionbox">' +
                '<div class="store normal_store">' +
                "일반점포 " +
                normal_store +
                '</div>' +
                '<div class="store regionName">' +
                regionName +
                '</div>' +
                '<div class="store fran_store">' +
                "가맹점포 " +
                fran_store +
                '</div>' +
                '</div>' +
                '</div>';
            var content2 =
                '<div class="placeinfo">' +
                '<p class="title">' +
                regionName +
                "</p>" +
                '<div class="close" onclick="closeOverlay()" title="닫기"></div>'+
                '<span class="jibun2">총 상점수 : ' +
                "</span>"+
                '<span class="region">' +
                total +
                "개 점포"+
                "</span>" +
                "</div>" +
                '<div class="after"></div>';
        } else if (codeType3 === '2') {//인구수
            total = info[0].sum_popul;
           // content = info[0].sum_popul;
            var total_comma = total.toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var content='<div class ="regionlabel">' +
                '<div class="regionbox">' +
                '<div class="popul regionName">' +
                regionName +
                '</div>' +
                '<div class="popul regionName">' +
                total_comma +
                '명'+
                '</div>' +
                '</div>' +
                '</div>';
            var content2 =
                '<div class="placeinfo">' +
                '<p class="title">' +
                regionName +
                "</p>" +
                '<div class="close" onclick="closeOverlay()" title="닫기"></div>'+
                '<span class="jibun2">총 인구수 : ' +
                "</span>"+
                '<span class="region">' +
                total_comma +
                '명'+
                "</span>" +
                "</div>" +
                '<div class="after"></div>';

        } else if (codeType3 === '3') {//임대시세
            total = info[0].rt_all;
          //  content = info[0].rt_all;
            var total_comma = total.toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            var content='<div class ="regionlabel">' +
                    '<div class="regionbox">' +
                        '<div class="rental regionName">' +
                        regionName +
                        '</div>' +
                        '<div class="rental regionName">' +
                        total_comma +
                        '원'+
                        '</div>' +
                    '</div>' +
                '</div>';
            var content2 =
                '<div class="placeinfo">' +
                '<p class="title">' +
                regionName +
                "</p>" +
                '<div class="close" onclick="closeOverlay()" title="닫기"></div>'+
                '<span class="jibun2">총 임대시세 : ' +
                "</span>"+
                '<span class="region">' +
                total_comma +
                '원'+
                "</span>" +
                "</div>" +
                '<div class="after"></div>';
        }
    }

    //상점수 폴리곤 색상
    if (codeType3 === '1') {
        // 다각형을 생성합니다
        if(total>regionStandard[0][5]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.6
            });
        }else if(total>regionStandard[0][4]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.5
            });
        }else if(total>regionStandard[0][3]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.4
            });
        }else if(total>regionStandard[0][2]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.3
            });
        }else if(total>regionStandard[0][1]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.2
            });
        }else {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.15
            });
        }

    } else if (codeType3 === '2') {
        // 인구수 다각형을 생성합니다
        if(total>regionStandard[1][5]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.6
            });
        }else if(total>regionStandard[1][4]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.5
            });
        }else if(total>regionStandard[1][3]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.4
            });
        }else if(total>regionStandard[1][2]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.3
            });
        }else if(total>regionStandard[1][1]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.2
            });
        }else{
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.15
            });
        }

    } else if (codeType3 === '3') {
        // 주요이슈 다각형을 생성합니다
        if(total>regionStandard[2][5]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.6
            });
        }else if(total>regionStandard[2][4]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.5
            });
        }else if(total>regionStandard[2][3]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.4
            });
        }else if(total>regionStandard[2][2]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.3
            });
        }else if(total>regionStandard[2][1]){
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.2
            });
        }else{
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.15
            });
        }
    }else {//조건없을때
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
    }



    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
    // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
        if (zoom < 8) {//7,6,5,4,3,2,1  지역 호버시 지역 정보 글씨 보임
            var circle = new kakao.maps.CustomOverlay({
                position: centroid(area.path),
                content: content
            });
            circles.push(circle);
            circle.setMap(map);
        }

        if (codeType3 === '1') {//상점수
            polygon.setOptions({
                fillColor: 'url(#store-gra)',
                fillOpacity: 0.9
            });
        } else if (codeType3 === '2') {
            polygon.setOptions({
                fillColor: '#1540BF',
                fillOpacity: 0.9
            });
        } else if (codeType3 === '3') {
            polygon.setOptions({
                fillColor: '#DD4C79',
                fillOpacity: 0.9
            });
        }else {
            polygon.setOptions({
                fillColor: area.over_fill_color,
                fillOpacity: area.over_fill_opacity
            });
        }//폴리곤 채움색 변경


    });

    // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
    // kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
    //     // customOverlay.setPosition(mouseEvent.latLng);
    // });

    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
    // 커스텀 오버레이를 지도에서 제거합니다
    kakao.maps.event.addListener(polygon, 'mouseout', function () {
        removeCircles() //호버글씨 지움
        if (codeType3 === '1') {
            if(total>regionStandard[0][5]){
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.8
                });
            }else if(total>regionStandard[0][4]){
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.65
                });
            }else if(total>regionStandard[0][3]){
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.5
                });
            }else if(total>regionStandard[0][2]){
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.35
                });
            }else if(total>regionStandard[0][1]){
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.2
                });
            }else {
                polygon.setOptions({
                    fillColor: '#FF8D07',
                    fillOpacity: 0.15
                });
            }
        } else if (codeType3 === '2') {
            if(total>regionStandard[1][5]){
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.8
                });
            }else if(total>regionStandard[1][4]){
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.65
                });
            }else if(total>regionStandard[1][3]){
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.5
                });
            }else if(total>regionStandard[1][2]){
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.35
                });
            }else if(total>regionStandard[1][1]){
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.2
                });
            }else {
                polygon.setOptions({
                    fillColor: '#1540BF',
                    fillOpacity: 0.15
                });
            }
        } else if (codeType3 === '3') {
            if(total>regionStandard[2][5]){
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.8
                });
            }else if(total>regionStandard[2][4]){
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.65
                });
            }else if(total>regionStandard[2][3]){
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.5
                });
            }else if(total>regionStandard[2][2]){
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.35
                });
            }else if(total>regionStandard[2][1]){
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.2
                });
            }else{
                polygon.setOptions({
                    fillColor: '#DD4C79',
                    fillOpacity: 0.15
                });
            }
        }
        // customOverlay.setMap(null);
    });


    // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
    kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {


        closeOverlay()//클릭했을때 오버레이 싹다 닫음 사이드바+동그란지역정보+지역인포윈도

        if (zoom < 8) {//맵크기 8이하  : 클릭-커스텀인포(행정동별 정보) 추가
            var clickcircle = new kakao.maps.CustomOverlay({
                position: centroid(area.path),
                content: content
            });
            clickcircles.push(clickcircle);
            clickcircle.setMap(map);

            var clickcInfoWin = new kakao.maps.CustomOverlay({
                position: centroid(area.path),
                content: content2,
                zIndex: 3,
                yAnchor: 1.2,
            });
            clickcInfoWins.push(clickcInfoWin);
            clickcInfoWin.setMap(map);
        }


        var codeType3 = $('input[name="cate2"]:checked').val();// 3번 분기별 임대시세
        if (codeType3 === '1') {//상점수
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                strokeOpacity: 1,
                fillColor: 'url(#store-gra)',
                fillOpacity: 0.8
            });

        }else if(codeType3 === '2'){//인구수
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                strokeOpacity: 1,
                fillColor: '#1540BF',
                fillOpacity: 0.8
            });
        }else if(codeType3 === '3'){//임대시세
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                strokeOpacity: 1,
                fillColor: '#DD4C79',
                fillOpacity: 0.8
            });
        }else{
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                fillColor: 'url(#store-gra)',
                fillOpacity: 0.8
            });
        }
        polygon1.setMap(map);
        polygons1.push(polygon1)


        var data = {
            emdCd: area.emd_cd,
            codeType3: codeType3
        }
        var getarea = (Math.round(polygon.getArea())/1000000).toFixed(2)//면적계산

        ajaxPostSyn('/trading-area/regional/details', data, function (result) {
            console.log("이게 데이터 갖고오는거임", result)
            if (result.length > 0) {
                //클릭시 위에 한겹 폴리곤 레이어 추가 + 사이드바
                if (codeType3 === '1') {
                    sideInfoStore(result,area,total)
                    // $('.tab_title>p>span').text( total);
                    // for (var i = 0; i < result.length; i++) {
                    // }
                } else if (codeType3 === '2') {
                  //  $('.tab_title>p>span').text( total);
                    sideInfoPopul(result,area, total,getarea)
                } else if (codeType3 === '3') {
                    sideInfoRental(result,area, total)
                    // $('.tab_title>p>span').text( total);
                }
            }
        });
    });
    polygon.setMap(map);
    polygons.push(polygon);
}

//탭바뀌면 사이드바+그래프마커윈도우 닫음
$('input[name="cate2"]').click(function () {
    closeOverlay()
})


//클릭했을때 오버레이 싹다 닫음 사이드바+동그란지역정보+지역인포윈도
function closeOverlay() {
    for (var i = 0; i < polygons1.length; i++) {//한겹 폴리곤 레이어 일단지움
        polygons1[i].setMap(null);
    }
    for (var i = 0; i < clickcircles.length; i++) {// 클릭-지역정보 동그라미 일단지움
        clickcircles[i].setMap(null);
    }
    for (var i = 0; i < clickcInfoWins.length; i++) {// 클릭-지역커스텀인포 일단지움
        clickcInfoWins[i].setMap(null);
    }
    $('#sidebar').removeClass('visible');
}

//사이드바 숨기기
function sideNoneVisible() {
    $('#sidebody').addClass('visible_none');
    $('#sidebar').addClass('on');
}

//사이드바 보이기
function sideVisible() {
    $('#sidebody').removeClass('visible_none');
    $('#sidebar').removeClass('on');
}

//상점수탭 사이드바 인포
function sideInfoStore(result,area,total) {
    $('#sidebar').addClass('visible');
    if (area) {
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody">' +
            '<div class="sideinfo_fixed">' +
            '<div class="sideinfo">' +
            '<div class="areatitle iconPlus">' +
            area.area_name +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="margintop"></div>'+

            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">상점수</h4>'+
            '<div class="storegray iconPlus">' +
            '총 '+total + '개 점포'+
            '</div>' +
            '</div>' +

            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">업종별 상점수</h4>' +
                '<div class="mainSectors_wrap">'+
                    '<ul class="mainSectors">'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="all" id="all-region" onChange="changecate()" checked/>'+
                            '<label For="all-region">전체</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="I" id="I-region" onChange="changecate()"/>'+
                            '<label For="I-region">숙박·음식</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="S" id="S-region" onChange="changecate()"/>'+
                            '<label For="S-region">수리·개인서비스</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="G" id="G-region" onChange="changecate()"/>'+
                            '<label For="G-region">도·소매</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="R" id="R-region" onChange="changecate()"/>'+
                            '<label For="R-region">예술·스포츠·여가</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="N" id="N-region" onChange="changecate()"/>'+
                            '<label For="N-region">시설관리·임대</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="M" id="M-region" onChange="changecate()"/>'+
                            '<label For="M-region">과학·기술</label>'+
                        "</li>"+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="L" id="L-region" onChange="changecate()"/>'+
                            '<label For="L-region">부동산</label>'+
                        '</li>'+
                        '<li>'+
                            '<input type="radio" name="region_maincate" value="P" id="P-region" onChange="changecate()"/>'+
                            '<label For="P-region">교육</label>'+
                        '</li>'+
                    '</ul>'+
                '</div>'+
            '<div class="storegray iconPlus storenum">' +
            '전체 점포'+
            '</div>' +
            '<div class="side_graph industry">' +
                '<canvas id="industry"></canvas>'+
                '<div id="colorCircle"></div>'+
            '</div>'+
            '</div>' +
            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' +
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
        if (window.innerWidth < 767) {
            $('#sidebody').addClass('visible_none');
            $('#sidebar').addClass('on');
        }
        var storesI = 0;//숙박음식 상점수
        var storesS = 0;//수리개인 상점수
        var storesG = 0;//도소매 상점수
        var storesR = 0;//예술스포츠 상점수
        var storesN = 0;//시설임대 상점수
        var storesM = 0;//과학기술 상점수
        var storesL = 0;//부동산 상점수
        var storesP = 0;//교육 상점수

       all=[]
        I=[]
        S=[]
        G=[]
        R=[]
        N=[]
        M=[]
        L=[]
        P=[]
        labelI=[]
        labelS=[]
        labelG=[]
        labelR=[]
        labelN=[]
        labelM=[]
        labelL=[]
        labelP=[]
        for (var i = 0; i < result.length; i++) {
            if(result[i].division1=='I'){
                storesI += result[i].ct_shop;
                I.push(result[i].ct_shop)
                labelI.push(result[i].com_nm)
            }else if(result[i].division1=='S'){
                storesS += result[i].ct_shop;
                S.push(result[i].ct_shop)
                labelS.push(result[i].com_nm)
            }else if(result[i].division1=='G'){
                storesG += result[i].ct_shop;
                G.push(result[i].ct_shop)
                labelG.push(result[i].com_nm)
            }else if(result[i].division1=='R'){
                storesR += result[i].ct_shop;
                R.push(result[i].ct_shop)
                labelR.push(result[i].com_nm)
            }else if(result[i].division1=='N'){
                storesN += result[i].ct_shop;
                N.push(result[i].ct_shop)
                labelN.push(result[i].com_nm)
            }else if(result[i].division1=='M'){
                storesM += result[i].ct_shop;
                M.push(result[i].ct_shop)
                labelM.push(result[i].com_nm)
            }else if(result[i].division1=='L'){
                storesL += result[i].ct_shop;
                L.push(result[i].ct_shop)
                labelL.push(result[i].com_nm)
            }else if(result[i].division1=='P'){
                storesP += result[i].ct_shop;
                P.push(result[i].ct_shop)
                labelP.push(result[i].com_nm)
            }
        }
        all=[storesI,storesS,storesG,storesR,storesN,storesM,storesL,storesP]
        industryRatioAll(all)
    }
}
var all=[]
var I=[]
var S=[]
var G=[]
var R=[]
var N=[]
var M=[]
var L=[]
var P=[]
var labelI=[]
var labelS=[]
var labelG=[]
var labelR=[]
var labelN=[]
var labelM=[]
var labelL=[]
var labelP=[]

//상점수업종별 - 전체업종 파이그래프
function industryRatioAll(data){
    var dataset = {
        label: "업종별 상점수",
        backgroundColor: ['#EE5545','#DD4C79','#A25AA1','#4983C4','#31C3D9','#33CC94','#70C14A','#C2EE45'],//라벨별 컬러설정
        borderColor: '#fff',
        data: data
    }
    var labels=['숙박·음식','수리·개인서비스','도·소매','예술·스포츠·여가','시설관리·임대','과학·기술','부동산','교육'];
    var datasets = { datasets:[dataset], labels:labels };
    var config = {
        type: 'pie',
        data: datasets, //데이터 셋
        options: {
            responsive: true,
            maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom',
                fontColor: 'black',
                align: 'center',
                display: true,
                fullWidth: true,
                labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label= labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label +" "+ precentage + "% "+ currentValue_comma + "개" ;
                    }
                }
            },
            plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value',
                    fontColor: 'black',
                    fontSize: 15,
                    precision: 2
                }

            },
        }
    }
    var canvas=document.getElementById('industry');
    var industry = new Chart(canvas,config);
}


function industryRatio(color,label){
    console.log("dksehl?",color)
    var barColors = color.map((value) =>
        value > 1000 ? 'rgba(255, 255, 255, 0.1)' :
            value > 100 ? 'rgba(255, 255, 255, 0.15)' :
                value > 50 ? 'rgba(255, 255, 255, 0.2)' :
                    value > 20 ? 'rgba(255, 255, 255, 0.25)' :
                        value > 10 ? 'rgba(255, 255, 255, 0.3)' :
                            value > 5 ? 'rgba(255, 255, 255, 0.4)' :
                                value > 3 ? 'rgba(255, 255, 255, 0.5)' :
                                    value > 1 ? 'rgba(255, 255, 255, 0.6)' :
                                        'rgba(255, 255, 255, 0.7)');
    var dataset = {
        labels: label,
        backgroundColor: barColors,
        borderColor: '#fff',
        borderWidth: 0.3,
        data: color,
    }
    var labels=label;
    var datasets={ datasets:[dataset], labels:labels }
    var config = {
        type: 'pie',
        data: datasets, //데이터 셋
        options: {
            responsive: true,
            maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom',
                fontColor: 'black',
                align: 'center',
                display: false,
                fullWidth: true,
                labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label= labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label +" "+ precentage + "% "+ currentValue_comma + "개" ;
                    }
                }
            },
            plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value',
                    fontColor: 'black',
                    fontSize: 15,
                    precision: 2
                }

            }
        }
    }
    var canvas=document.getElementById('industry');
    var industry = new Chart(canvas,config);
}



function changecate(){
    var maincate = $('input[name="region_maincate"]:checked').val() //대분류
    $('#industry').remove();//있던 차트 지우고
    $('.industry').append('<canvas id="industry"><canvas>');//차트id추가
    if(maincate=='all'){
        industryRatioAll(all)
        $('.storenum').text("전체 업종")
        $('.industry>#colorCircle').removeClass()
    }else if(maincate=='I'){
        industryRatio(I,labelI)
        $('.storenum').text("숙박·음식")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('I')
    }else if(maincate=='S'){
        industryRatio(S,labelS)
        $('.storenum').text("수리·개인서비스")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('S')
    }else if(maincate=='G'){
        industryRatio(G,labelG)
        $('.storenum').text("도·소매")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('G')
    }else if(maincate=='R'){
        industryRatio(R,labelR)
        $('.storenum').text("예술·스포츠·여가")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('R')
    }else if(maincate=='N'){
        industryRatio(N,labelN)
        $('.storenum').text("시설관리·임대")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('N')
    }else if(maincate=='M'){
        industryRatio(M,labelM)
        $('.storenum').text("과학·기술")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('M')
    }else if(maincate=='L'){
        industryRatio(L,labelL)
        $('.storenum').text("부동산")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('L')
    }else if(maincate=='P'){
        industryRatio(P,labelP)
        $('.storenum').text("교육")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('P')
    }
}


//인구수탭 사이드바 인포
function sideInfoPopul(result,area, total, getarea) {
    var total_comma = total.toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    var density = Math.round(total / getarea ) ;
    console.log("Math.round",total,getarea,density)
    $('#sidebar').addClass('visible');
    if (area&&result) {
        household = []
        household=[
            {house:result[0].house_1,idx:1},
            {house:result[0].house_2,idx:2},
            {house:result[0].house_3,idx:3},
            {house:result[0].house_4,idx:4},
            {house:result[0].house_5,idx:5},
            {house:result[0].house_6,idx:6},
            {house:result[0].house_7,idx:7},
        ]
        household = household.sort((a, b) => b.house - a.house);
        console.log("가구원수",household)
        var houseli = "";
        for (var i = 0; i < household.length; i++) {
            houseli += `<li class="h`+ household[i].idx +`"><p class="housetype">`+ household[i].idx +`인가구</p><p class="housenum">`+ household[i].house +`명</p></li>`
        }
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody">' +
            '<div class="sideinfo_fixed">' +
            '<div class="sideinfo">' +
            '<div class="areatitle iconPlus">' +
            area.area_name +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="margintop"></div>'+
            '<div class="sideinfo float">' +
            '<h4 class="sideinfoTitle">인구수</h4>'+
            '<div class="storegray iconPlus">' +
            '총 '+total_comma + '명'+
            '</div>' +
            '</div>' +
            '<div class="sideinfo float">' +
            '<h4 class="sideinfoTitle">면적</h4>'+
            '<div class="crop_black_20dp iconPlus">' +
            '총 '+getarea + '㎢'+
            '</div>' +
            '</div>' +
            '<div class="sideinfo float">' +
            '<h4 class="sideinfoTitle">인구밀도</h4>'+
            '<div class="groups_gray_20dp iconPlus">' +
            density + '인/㎢'+
            '</div>' +
            '</div>' +
            '<div class="greyspan"></div>'+
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">대표자 연령대별 사업체</h4>'+
                '<div class="side_graph">' +
                    '<canvas id="business"></canvas>'+
                '</div>'+
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">가구원수별 가구수</h4>'+
                '<ul class="short2">' +
                    houseli +
                '</ul>'+
            '</div>' +
                '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div>' +
            '</div>' +
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
        if (window.innerWidth < 767) {
            $('#sidebody').addClass('visible_none');
            $('#sidebar').addClass('on');
        }
        businessRatio(result[0].ct_shop_u20s,result[0].ct_shop_30s,result[0].ct_shop_40s,result[0].ct_shop_50s,result[0].ct_shop_o60s)


    }
}
var household =[]


//사업체연령대
function businessRatio(n1,n2,n3,n4,n5){
    var dataset = {
        label: "소비유형",
        backgroundColor: ['#70C14A','#33CC94','#31C3D9','#4983C4','#A25AA1'],//라벨별 컬러설정
        borderColor: '#fff',
        data: [n1,n2,n3,n4,n5]
    }
    var labels=['20대 이하','30대','40대','50대','60대 이상'];
    var datasets={ datasets:[dataset], labels:labels }
    var config = {
        type: 'pie',
        data: datasets, //데이터 셋
        options: {
            responsive: true,
            maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom',
                fontColor: 'black',
                align: 'center',
                display: true,
                fullWidth: true,
                labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label= labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label +" "+ precentage + "% "+ currentValue_comma + "개" ;
                    }
                }
            },
            plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value',
                    fontColor: 'black',
                    fontSize: 15,
                    precision: 2
                }

            }
        }
    }
    var canvas=document.getElementById('business');
    var business = new Chart(canvas,config);
}

//가구원 순위 1위,2위,3위 클라스표시




//(주요이슈)임대시세탭 사이드바 인포
function sideInfoRental(result,area, total) {
    var total_comma = total.toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    $('#sidebar').addClass('visible');
    if (area&&result) {
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody">' +
            '<div class="sideinfo_fixed">' +
            '<div class="sideinfo">' +
            '<div class="areatitle iconPlus">' +
                area.area_name +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="margintop"></div>'+

            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">분기별 임대시세</h4>'+
            '<select name="chartYear" id="chartYear" onChange="updateChartType()">'+
            '<option value="2021">2021년</option>'+
            '<option value="2020">2020년</option>'+
            '<option value="2019">2019년</option>'+
            '<option value="2018">2018년</option>'+
            '<option value="2017">2017년</option>'+
            '</select>'+
                '<div class="side_graph short speedChart">' +
                '<canvas id="speedChart"></canvas>'+
                '</div>'+
            '</div>' +

            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">SNS 검색어</h4>'+
            '<div class="storegray iconPlus">' +
            'Sometrend api'+
            '</div>' +
            '<div class="side_graph">' +
            '<canvas></canvas>'+
            '</div>'+
            '</div>' +

            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' +
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
        if (window.innerWidth < 767) {
            $('#sidebody').addClass('visible_none');
            $('#sidebar').addClass('on');
        }
        data20171f = [];
        data20181f = [];
        data20191f = [];
        data20201f = [];
        data20211f = [];
        data2017other = [];
        data2018other = [];
        data2019other = [];
        data2020other = [];
        data2021other = [];

        for (var i = 0; i < result.length; i++) {
            var year = result[i].year
            if (year == 2017) {
                data20171f.push(result[i].rt_1f)
                data2017other.push(result[i].rt_other)
            } else if (year == 2018) {
                data20181f.push(result[i].rt_1f)
                data2018other.push(result[i].rt_other)
            } else if (year == 2019) {
                data20191f.push(result[i].rt_1f)
                data2019other.push(result[i].rt_other)
            } else if (year == 2020) {
                data20201f.push(result[i].rt_1f)
                data2020other.push(result[i].rt_other)
            } else if (year == 2021) {
                data20211f.push(result[i].rt_1f)
                data2021other.push(result[i].rt_other)
            }
        }
        multichart(data20171f,data2017other)
    }
}
var data20171f = [];
var data20181f = [];
var data20191f = [];
var data20201f = [];
var data20211f = [];
var data2017other = [];
var data2018other = [];
var data2019other = [];
var data2020other = [];
var data2021other = [];

function updateChartType(){
    console.log("1층외배열",data20171f, data2017other)
      $('#speedChart').remove();//있던 차트 지우고
    $('.speedChart').append('<canvas id="speedChart"><canvas>');//차트id추가

    var year = $('select[name="chartYear"]').val()
    console.log(year)

    if (year == 2017) {
        multichart(data20171f,data2017other)
    } else if (year == 2018) {
        multichart(data20181f,data2018other)
    } else if (year == 2019) {
        multichart(data20191f,data2019other)
    } else if (year == 2020) {
        multichart(data20201f,data2020other)
    } else if (year == 2021) {
        multichart(data20211f,data2021other)
    }

}

function multichart(data1,data2){
    var speedCanvas = document.getElementById("speedChart");
    var dataFirst = {
        label: "임대시세 1층",
        data: data1,
        lineTension: 0,
        fill: false,
        borderColor: '#1540bf'
    };
    var dataSecond = {
        label: "임대시세 1층 외",
        data: data2,
        lineTension: 0,
        fill: false,
        borderColor: '#709bff'
    };
    var speedData = {
        labels: ["1분기", "2분기", "3분기", "4분기"],
        datasets: [dataFirst, dataSecond]
    };
    var chartOptions = {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 40,
                backgroundColor: '#94b4ff',
                fontColor: 'black'
            }
        },
        title: {
            display: true,
            text: '(단위:천원)',
            position: 'right',
        }
    };
    var lineChart = new Chart(speedCanvas, {
        type: 'line',
        data: speedData,
        options: chartOptions
    });
}









//중심좌표구하는함수
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
// // 인포윈도우 닫기 이벤트
// $(document).on('click', '.customoverlay_close', function () {
//     infowindow.setMap(null);
// });

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
function closeCommnunity(){
    $('.community_pop_wrap').removeClass('on')
}
$('.community_Btn').click(function () {
    $('.community_pop_wrap').toggleClass('on');
});
$('.m_scroll_btn').click(function () {
    $('.community_pop_wrap').removeClass('on');
});
/*
$('.community_main').click(function () {
    let communitySeq = $(this).find("#communitySeq").val();
    if (communitySeq === undefined) {
        $('.detail_community').removeClass('on');
        return false;
    }

    var data = {
        communitySeq: communitySeq
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/trading-area/reply",
        async: false,
        data: JSON.stringify(data),
        //contentType:"application/json; charset=utf-8",
        dataType:"text",
        //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        error: function (res) {
            console.log("error")
            return false;
        }
    }).done(function (fragment) {
        console.log(fragment)
        $(".reply_list").replaceWith(fragment);
        $(".reply_list").show();
        //$(".loading_box").hide();

    });
    $(this).next('.detail_community').addClass('on');
});

$('.backbtn').click(function () {
    $('.detail_community').removeClass('on');
});

$('.reply_btn').click(function () {

    let communitySeq = $(this).parent("#reply_add").find("[name=communitySeq]").val();
    let comment = $(this).parent("#reply_add").find("[name=comment]").val();
    console.log("communitySeq ::: "+communitySeq);
    var data = {
        communitySeq: communitySeq,
        comment: comment
    }

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/trading-area/reply/add",
        async: false,
        data: JSON.stringify(data),
        //contentType:"application/json; charset=utf-8",
        dataType:"text",
        //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (fragment) {
            console.log("fragment >>> "+fragment);
            $(".reply_list").replaceWith(fragment);
            $(".reply_list").show();
            //$(".loading_box").hide();
        },
        error: function (res) {
            return false;
        }
    }).done(function (fragment) {
        $('input[name=comment]').val("");
    });



});
*/

function getReply(communitySeq,obj){

    if (communitySeq === undefined) {
        $('.detail_community').removeClass('on');
        // location.href = "/community/" + $('input[name=communitySeq]').val() + "?type=shop";
        return false;
    }

    var data = {
        communitySeq: communitySeq,
        type: "region"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/trading-area/reply",
        async: false,
        data: JSON.stringify(data),
        //contentType:"application/json; charset=utf-8",
        dataType:"text",
        //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        error: function (res) {
            console.log("error")
            // let fragment = res.responseText
            // $(".reply_list").replaceWith(fragment);
            // $(".reply_list").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {

        //여기로 안들어옴.....
        $(".reply_list").replaceWith(fragment);
        $(".reply_list").show();
        //$(".loading_box").hide();

    });
    //$('.detail_community').addClass('on');
    $(obj).next('.detail_community').addClass('on');
}

function addReply(communitySeq,obj){

    //let comment = $("[name=comment]").val();
    let comment = $(obj).parent("#reply_add").find("[name=comment]").val();

    if(comment == ""){
        alert("댓글을 입력해주세요.");
        return false;
    }

    var data = {
        communitySeq: communitySeq,
        comment: comment,
        type:"region"
    }

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/trading-area/reply/add",
        async: false,
        data: JSON.stringify(data),
        //contentType:"application/json; charset=utf-8",
        dataType:"text",
        //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (fragment) {

            $(".reply_list").replaceWith(fragment);
            $(".reply_list").show();
            //$(".loading_box").hide();
        },
        error: function (res) {
            return false;
        }
    }).done(function (fragment) {
        $('input[name=comment]').val("");
    });
}

function backbtn(){
    $('.detail_community').removeClass('on');
}