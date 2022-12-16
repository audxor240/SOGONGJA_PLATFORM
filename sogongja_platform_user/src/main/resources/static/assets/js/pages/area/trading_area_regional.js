//상권
//1주소창, 2시도+시군구+읍면동선택창, 3+-현위치버튼, 4모바일리사이즈, 5상점마커

//지역 맵 기본 레벨
var mapDefaultLevel = 6;

// 기본 위치는 강남구 좌표

var mapContainer = document.getElementById('map'), mapOption = {
    center: new kakao.maps.LatLng(clientLatitude, clientLongitude), level: mapDefaultLevel
};

var map = new kakao.maps.Map(mapContainer, mapOption), infowindow = new kakao.maps.InfoWindow({
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

$('.dif').click(function () {
    $('.msearch_pop').addClass('on')
})
$('.search_pop_del').click(function () {
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
};nowSpot();

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", async function () {
    await searchAddrFromCoords(map.getCenter(), await displayCenterInfo), await sleep(2000), // 선택박스에 시군구코드 기준으로 리스트뿌리기
        renderSigungu(), renderDong()
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

        if (guArr.length > 1) {
            gu = guArr[0];
        }
        let data = {
            "type": "region", "gu": gu
        };
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        //해당 위치에 따라 커뮤니티 정보를 불러온다.
        $.ajax({
            type: "POST",
            url: "/trading-area/map/communityList",
            async: false,
            data: JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            //data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            }, error: function (res) {
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
var mainurl = `https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=`

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
        dong: el.name.split(" ")[3] != undefined ? el.name.split(" ")[2] + " " + el.name.split(" ")[3] : el.name.split(" ")[2]
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


//개별 시군구,행정동 리스트 클릭시에 자동 검색
function searchSidoDongPlaces() {
    if (!currCategory) {
        return;
    }
    geocoder.addressSearch(currCategory, placesSearchCB, {useMapBounds: true})
    sidoBox.className = '';
    sigunguBox.className = '';
    dongBox.className = '';
}

//시도 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSidoSearch(el) {
    var id = el.id, className = el.className;
    currCategory = id;
    searchSidoDongPlaces();
}

//시군구 행정동 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSearch(el) {
    var id = el.id, className = el.className;
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
    if ($('.addrlist>ul').hasClass("menu_selected") == true) {
        sidoBox.className = '';
        sigunguBox.className = '';
        dongBox.className = '';
    } else {
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
var lat = map.getCenter().getLat(), lng = map.getCenter().getLng(), zoom = map.getLevel(),
    x2 = map.getBounds().getNorthEast().getLat(), y2 = map.getBounds().getNorthEast().getLng(),
    x1 = map.getBounds().getSouthWest().getLat(), y1 = map.getBounds().getSouthWest().getLng();
var codeType1 = new Array();
var codeType3 = '1';
var polygons = [];//지역 폴리곤
var polygons1 = [];//클릭시 한겹레이어 폴리곤
var circles = [];//호버시 지역정보 동그라미
var clickcircles = [];//클릭시 지역정보 동그라미
var clickcInfoWins = [];//클릭시 지역정보 인포윈도

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
        QimageSrc = "/images/new/area/marker01.png", NimageSrc = "/images/new/area/marker02.png",
        LimageSrc = "/images/new/area/marker03.png", FimageSrc = "/images/new/area/marker04.png",
        DimageSrc = "/images/new/area/marker05.png", OimageSrc = "/images/new/area/marker06.png",
        PimageSrc = "/images/new/area/marker07.png", RimageSrc = "/images/new/area/marker08.png";
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
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize), marker = new kakao.maps.Marker({
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
    lat, lng, zoom, x1, x2, y1, y2, codeType1, codeType3
}

// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", changeMap)

async function changeMap() {
    resizeMap()
    lat = map.getCenter().getLat(), lng = map.getCenter().getLng(), zoom = map.getLevel(), x2 = map.getBounds().getNorthEast().getLat(), y2 = map.getBounds().getNorthEast().getLng(), x1 = map.getBounds().getSouthWest().getLat(), y1 = map.getBounds().getSouthWest().getLng();
    var datalat = {
        lat, lng, zoom, x1, x2, y1, y2, codeType1, codeType3
    }
    console.log("data재요청입니다!", datalat);

    if (zoom > 7) {//zoom 8 ~ 14
        //removeCircles(map);
        // $('.areaTap').css('display', 'none'); //상점수,인구수,탭
        $('.area_map').addClass('on')
    } else if (zoom >= 4 && zoom <= 7) { //zoom 4,5,6,7 일때
        // $('.areaTap').css('display', 'block'); //상점수,인구수,탭
        $('.area_map').removeClass('on')
        setMarkers(null)//상점삭제
        $('.category_wrap.region').css('display', 'none');//상점 카테고리 삭제
    } else {//zoom 3,2,1 일때
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
            var fran_store = Math.round(info[0].franc / info[0].stores * 100) + '%';//가맹점포
            var normal_store = Math.round((info[0].stores - info[0].franc) / info[0].stores * 100) + '%'; //일반점포

            var content = '<div class ="regionlabel">' + '<div class="regionbox">' + '<div class="store normal_store">' + "일반점포 " + normal_store + '</div>' + '<div class="store regionName">' + regionName + '</div>' + '<div class="store fran_store">' + "가맹점포 " + fran_store + '</div>' + '</div>' + '</div>';
            var content2 = '<div class="placeinfo">' + '<p class="title">' + regionName + "</p>" + '<div class="close" onclick="closeOverlay()" title="닫기"></div>' + '<span class="jibun2">총 상점수 : ' + "</span>" + '<span class="region">' + total + "개 점포" + "</span>" + "</div>" + '<div class="after"></div>';
        } else if (codeType3 === '2') {//인구수
            total = info[0].sum_popul;
            // content = info[0].sum_popul;
            var total_comma = total.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            var content = '<div class ="regionlabel">' + '<div class="regionbox">' + '<div class="popul regionName">' + regionName + '</div>' + '<div class="popul regionName">' + total_comma + '명' + '</div>' + '</div>' + '</div>';
            var content2 = '<div class="placeinfo">' + '<p class="title">' + regionName + "</p>" + '<div class="close" onclick="closeOverlay()" title="닫기"></div>' + '<span class="jibun2">총 인구수 : ' + "</span>" + '<span class="region">' + total_comma + '명' + "</span>" + "</div>" + '<div class="after"></div>';

        } else if (codeType3 === '3') {//임대시세
            total = info[0].rt_all;
            //  content = info[0].rt_all;
            var total_comma = total.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            var content = '<div class ="regionlabel">' + '<div class="regionbox">' + '<div class="rental regionName">' + regionName + '</div>' + '<div class="rental regionName">' + total_comma + '원' + '</div>' + '</div>' + '</div>';
            var content2 = '<div class="placeinfo">' + '<p class="title">' + regionName + "</p>" + '<div class="close" onclick="closeOverlay()" title="닫기"></div>' + '<span class="jibun2">총 임대시세 : ' + "</span>" + '<span class="region">' + total_comma + '원' + "</span>" + "</div>" + '<div class="after"></div>';
        }
    }

    //상점수 폴리곤 색상
    if (codeType3 === '1') {
        // 다각형을 생성합니다
        if (total > regionStandard[0][5]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.6
            });
        } else if (total > regionStandard[0][4]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.5
            });
        } else if (total > regionStandard[0][3]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.4
            });
        } else if (total > regionStandard[0][2]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.3
            });
        } else if (total > regionStandard[0][1]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#FF8D07',
                fillColor: '#FF8D07',
                fillOpacity: 0.2
            });
        } else {
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
        if (total > regionStandard[1][5]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.6
            });
        } else if (total > regionStandard[1][4]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.5
            });
        } else if (total > regionStandard[1][3]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.4
            });
        } else if (total > regionStandard[1][2]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.3
            });
        } else if (total > regionStandard[1][1]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#1540BF',
                fillColor: '#1540BF',
                fillOpacity: 0.2
            });
        } else {
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
        if (total > regionStandard[2][5]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.6
            });
        } else if (total > regionStandard[2][4]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.5
            });
        } else if (total > regionStandard[2][3]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.4
            });
        } else if (total > regionStandard[2][2]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.3
            });
        } else if (total > regionStandard[2][1]) {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.2
            });
        } else {
            var polygon = new kakao.maps.Polygon({
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: 2,
                strokeColor: '#DD4C79',
                fillColor: '#DD4C79',
                fillOpacity: 0.15
            });
        }
    } else {//조건없을때
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
                position: centroid(area.path), content: content
            });
            circles.push(circle);
            circle.setMap(map);
        }

        if (codeType3 === '1') {//상점수
            polygon.setOptions({
                fillColor: 'url(#store-gra)', fillOpacity: 0.9
            });
        } else if (codeType3 === '2') {
            polygon.setOptions({
                fillColor: '#1540BF', fillOpacity: 0.9
            });
        } else if (codeType3 === '3') {
            polygon.setOptions({
                fillColor: '#DD4C79', fillOpacity: 0.9
            });
        } else {
            polygon.setOptions({
                fillColor: area.over_fill_color, fillOpacity: area.over_fill_opacity
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
            if (total > regionStandard[0][5]) {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.8
                });
            } else if (total > regionStandard[0][4]) {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.65
                });
            } else if (total > regionStandard[0][3]) {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.5
                });
            } else if (total > regionStandard[0][2]) {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.35
                });
            } else if (total > regionStandard[0][1]) {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.2
                });
            } else {
                polygon.setOptions({
                    fillColor: '#FF8D07', fillOpacity: 0.15
                });
            }
        } else if (codeType3 === '2') {
            if (total > regionStandard[1][5]) {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.8
                });
            } else if (total > regionStandard[1][4]) {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.65
                });
            } else if (total > regionStandard[1][3]) {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.5
                });
            } else if (total > regionStandard[1][2]) {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.35
                });
            } else if (total > regionStandard[1][1]) {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.2
                });
            } else {
                polygon.setOptions({
                    fillColor: '#1540BF', fillOpacity: 0.15
                });
            }
        } else if (codeType3 === '3') {
            if (total > regionStandard[2][5]) {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.8
                });
            } else if (total > regionStandard[2][4]) {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.65
                });
            } else if (total > regionStandard[2][3]) {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.5
                });
            } else if (total > regionStandard[2][2]) {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.35
                });
            } else if (total > regionStandard[2][1]) {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.2
                });
            } else {
                polygon.setOptions({
                    fillColor: '#DD4C79', fillOpacity: 0.15
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
                position: centroid(area.path), content: content
            });
            clickcircles.push(clickcircle);
            clickcircle.setMap(map);

            var clickcInfoWin = new kakao.maps.CustomOverlay({
                position: centroid(area.path), content: content2, zIndex: 3, yAnchor: 1.2,
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

        } else if (codeType3 === '2') {//인구수
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                strokeOpacity: 1,
                fillColor: '#1540BF',
                fillOpacity: 0.8
            });
        } else if (codeType3 === '3') {//임대시세
            var polygon1 = new kakao.maps.Polygon({
                path: this.getPath(),
                strokeWeight: 3,
                strokeColor: '#fff',
                strokeOpacity: 1,
                fillColor: '#DD4C79',
                fillOpacity: 0.8
            });
        } else {
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
            emdCd: area.emd_cd, codeType3: codeType3
        }
        var getarea = (Math.round(polygon.getArea()) / 1000000).toFixed(2)//면적계산

        ajaxPostSyn('/trading-area/regional/details', data, function (result) {
            console.log("이게 데이터 갖고오는거임", result)
            if (result.length > 0) {
                //클릭시 위에 한겹 폴리곤 레이어 추가 + 사이드바
                if (codeType3 === '1') {
                    sideInfoStore(result, area, total)
                    // $('.tab_title>p>span').text( total);
                    // for (var i = 0; i < result.length; i++) {
                    // }
                } else if (codeType3 === '2') {
                    //  $('.tab_title>p>span').text( total);
                    sideInfoPopul(result, area, total, getarea)
                } else if (codeType3 === '3') {
                    sideInfoRental(result, area, total)
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
function sideInfoStore(result, area, total) {
    $('#sidebar').addClass('visible');
    if (area) {
        document.getElementById("sidebar").innerHTML = '<div id="sidebody">' + '<div class="sideinfo_fixed">' + '<div class="sideinfo">' + '<div class="areatitle iconPlus">' + area.area_name + '</div>' + '</div>' + '</div>' + '<div class="margintop"></div>' +

            '<div class="sideinfo">' + '<h4 class="sideinfoTitle">상점수</h4>' + '<div class="storegray iconPlus">' + '총 ' + total + '개 점포' + '</div>' + '</div>' +

            '<div class="sideinfo">' + '<h4 class="sideinfoTitle">업종별 상점수</h4>' + '<div class="mainSectors_wrap">' + '<ul class="mainSectors">' + '<li>' + '<input type="radio" name="region_maincate" value="all" id="all-region" onChange="changecate()" checked/>' + '<label For="all-region">전체</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="I" id="I-region" onChange="changecate()"/>' + '<label For="I-region">숙박·음식</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="S" id="S-region" onChange="changecate()"/>' + '<label For="S-region">수리·개인서비스</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="G" id="G-region" onChange="changecate()"/>' + '<label For="G-region">도·소매</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="R" id="R-region" onChange="changecate()"/>' + '<label For="R-region">예술·스포츠·여가</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="N" id="N-region" onChange="changecate()"/>' + '<label For="N-region">시설관리·임대</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="M" id="M-region" onChange="changecate()"/>' + '<label For="M-region">과학·기술</label>' + "</li>" + '<li>' + '<input type="radio" name="region_maincate" value="L" id="L-region" onChange="changecate()"/>' + '<label For="L-region">부동산</label>' + '</li>' + '<li>' + '<input type="radio" name="region_maincate" value="P" id="P-region" onChange="changecate()"/>' + '<label For="P-region">교육</label>' + '</li>' + '</ul>' + '</div>' + '<div class="storegray iconPlus storenum">' + '전체 점포' + '</div>' + '<div class="side_graph industry">' + '<canvas id="industry"></canvas>' + '<div id="colorCircle"></div>' + '</div>' + '</div>' + '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' + '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
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

        all = []
        I = []
        S = []
        G = []
        R = []
        N = []
        M = []
        L = []
        P = []

        var I9001sum = 0, I1914sum = 0, I1223sum = 0, I1002sum = 0, I1204sum = 0, I1903sum = 0, I1201sum = 0,
            I1913sum = 0, I2201sum = 0, I1102sum = 0, I2109sum = 0, I1005sum = 0;
        var S3102sum = 0, S1103sum = 0, S1101sum = 0, S9101sum = 0, S2102sum = 0, S6313sum = 0, S1201sum = 0,
            S1102sum = 0, S2103sum = 0, S2201sum = 0;
        var G5201sum = 0, G4401sum = 0, G3206sum = 0, G6102sum = 0, G5919sum = 0, G6101sum = 0, G4208sum = 0,
            G2110sum = 0, G1902sum = 0, G8301sum = 0, G4301sum = 0, G5906sum = 0, G9903sum = 0, G6403sum = 0,
            G6307sum = 0, G4104sum = 0, G2104sum = 0, G8107sum = 0, G5910sum = 0, G4105sum = 0, G2102sum = 0,
            G9102sum = 0, G8601sum = 0, G1201sum = 0, G2111sum = 0, G3101sum = 0, G1903sum = 0, G4102sum = 0,
            G3105sum = 0, G8108sum = 0, G8501sum = 0, G2124sum = 0, G8409sum = 0, G8102sum = 0, G8604sum = 0,
            G7103sum = 0;
        var R2202sum = 0, R2904sum = 0, R2203sum = 0, R1306sum = 0, R2105sum = 0, R1305sum = 0, R2201sum = 0,
            R1104sum = 0, R1319sum = 0, R1341sum = 0, R1309sum = 0;
        var N2904sum = 0, N2912sum = 0, N2101sum = 0, N2902sum = 0;
        var M1001sum = 0, M1002sum = 0, M3001sum = 0, M2003sum = 0, M9002sum = 0, M2002sum = 0, M1003sum = 0;
        var L2201sum = 0;
        var P6211sum = 0, P6901sum = 0, P6607sum = 0, P6304sum = 0;

        let Iarr = result.filter(shop => shop.division1 == "I")
        let Sarr = result.filter(shop => shop.division1 == "S")
        let Garr = result.filter(shop => shop.division1 == "G")
        let Rarr = result.filter(shop => shop.division1 == "R")
        let Narr = result.filter(shop => shop.division1 == "N")
        let Marr = result.filter(shop => shop.division1 == "M")
        let Larr = result.filter(shop => shop.division1 == "L")
        let Parr = result.filter(shop => shop.division1 == "P")

        for (var i = 0; i < Iarr.length; i++) {
            if (Iarr[i].com_cd2 == "I9001") {
                I9001sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1914") {
                I1914sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1223") {
                I1223sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1002") {
                I1002sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1204") {
                I1204sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1903") {
                I1903sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1201") {
                I1201sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1913") {
                I1913sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I2201") {
                I2201sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1102") {
                I1102sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I2109") {
                I2109sum += Iarr[i].ct_shop
            } else if (Iarr[i].com_cd2 == "I1005") {
                I1005sum += Iarr[i].ct_shop
            }
        }
        for (var i = 0; i < Sarr.length; i++) {
            if (Sarr[i].com_cd2 == "S3102") {
                S3102sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S1103") {
                S1103sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S1101") {
                S1101sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S9101") {
                S9101sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S2102") {
                S2102sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S6313") {
                S6313sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S1201") {
                S1201sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S1102") {
                S1102sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S2103") {
                S2103sum += Sarr[i].ct_shop
            } else if (Sarr[i].com_cd2 == "S2201") {
                S2201sum += Sarr[i].ct_shop
            }
        }
        for (var i = 0; i < Garr.length; i++) {
            if (Garr[i].com_cd2 == "G5201") {
                G5201sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4401") {
                G4401sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G3206") {
                G3206sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G6102") {
                G6102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G5919") {
                G5919sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G6101") {
                G6101sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4208") {
                G4208sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2110") {
                G2110sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G1902") {
                G1902sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8301") {
                G8301sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4301") {
                G4301sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G5906") {
                G5906sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G9903") {
                G9903sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G6403") {
                G6403sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G6307") {
                G6307sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4104") {
                G4104sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2104") {
                G2104sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8107") {
                G8107sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G5910") {
                G5910sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4105") {
                G4105sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2102") {
                G2102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8107") {
                G8107sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G5910") {
                G5910sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4105") {
                G4105sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2102") {
                G2102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G9102") {
                G9102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8601") {
                G8601sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G1201") {
                G1201sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2111") {
                G2111sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G3101") {
                G3101sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G1903") {
                G1903sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G4102") {
                G4102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G3105") {
                G3105sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8108") {
                G8108sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8501") {
                G8501sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G2124") {
                G2124sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8409") {
                G8409sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8102") {
                G8102sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G8604") {
                G8604sum += Garr[i].ct_shop
            } else if (Garr[i].com_cd2 == "G7103") {
                G7103sum += Garr[i].ct_shop
            }
        }
        for (var i = 0; i < Rarr.length; i++) {
            if (Rarr[i].com_cd2 == "R2202") {
                R2202sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R2904") {
                R2904sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R2203") {
                R2203sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1306") {
                R1306sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R2105") {
                R2105sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1305") {
                R1305sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R2201") {
                R2201sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1104") {
                R1104sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1319") {
                R1319sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1341") {
                R1341sum += Rarr[i].ct_shop
            } else if (Rarr[i].com_cd2 == "R1309") {
                R1309sum += Rarr[i].ct_shop
            }
        }
        for (var i = 0; i < Narr.length; i++) {
            if (Narr[i].com_cd2 == "N2904") {
                N2904sum += Narr[i].ct_shop
            } else if (Narr[i].com_cd2 == "N2912") {
                N2912sum += Narr[i].ct_shop
            } else if (Narr[i].com_cd2 == "N2101") {
                N2101sum += Narr[i].ct_shop
            } else if (Narr[i].com_cd2 == "N2902") {
                N2902sum += Narr[i].ct_shop
            }
        }
        for (var i = 0; i < Marr.length; i++) {
            if (Marr[i].com_cd2 == "M1001") {
                M1001sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M1002") {
                M1002sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M3001") {
                M3001sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M2003") {
                M2003sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M9002") {
                M9002sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M2002") {
                M2002sum += Marr[i].ct_shop
            } else if (Marr[i].com_cd2 == "M1003") {
                M1003sum += Marr[i].ct_shop
            }
        }
        for (var i = 0; i < Larr.length; i++) {
            if (Larr[i].com_cd2 == "L2201") {
                L2201sum += Larr[i].ct_shop
            }
        }
        for (var i = 0; i < Parr.length; i++) {
            if (Parr[i].com_cd2 == "P6211") {
                P6211sum += Parr[i].ct_shop
            } else if (Parr[i].com_cd2 == "P6901") {
                P6901sum += Parr[i].ct_shop
            } else if (Parr[i].com_cd2 == "P6607") {
                P6607sum += Parr[i].ct_shop
            } else if (Parr[i].com_cd2 == "P6304") {
                P6304sum += Parr[i].ct_shop
            }
        }
        let I9001 = {ct_shop: I9001sum, com_cd2: "I9001", com_nm: "고시원"},
            I1914 = {ct_shop: I1914sum, com_cd2: "I1914", com_nm: "분식전문점"},
            I1223 = {ct_shop: I1223sum, com_cd2: "I1223", com_nm: "양식전문점"},
            I1002 = {ct_shop: I1002sum, com_cd2: "I1002", com_nm: "여관"},
            I1204 = {ct_shop: I1204sum, com_cd2: "I1204", com_nm: "일식전문점"},
            I1903 = {ct_shop: I1903sum, com_cd2: "I1903", com_nm: "제과점"},
            I1201 = {ct_shop: I1201sum, com_cd2: "I1201", com_nm: "중식전문점"},
            I1913 = {ct_shop: I1913sum, com_cd2: "I1913", com_nm: "치킨전문점"};
        I.push(I9001, I1914, I1223, I1002, I1204, I1903, I1201, I1913)
        I = I.sort((a, b) => b.ct_shop - a.ct_shop);

        let S3102 = {ct_shop: S3102sum, com_cd2: "S3102", com_nm: "가전제품수리"},
            S1103 = {ct_shop: S1103sum, com_cd2: "S1103", com_nm: "네일숍"},
            S1101 = {ct_shop: S1101sum, com_cd2: "S1101", com_nm: "미용실"},
            S9101 = {ct_shop: S9101sum, com_cd2: "S9101", com_nm: "세탁소"},
            S2102 = {ct_shop: S2102sum, com_cd2: "S2102", com_nm: "자동차수리"},
            S6313 = {ct_shop: S6313sum, com_cd2: "S6313", com_nm: "자전거 및 기타운송장비"},
            S1201 = {ct_shop: S1201sum, com_cd2: "S1201", com_nm: "통신기기수리"},
            S1102 = {ct_shop: S1102sum, com_cd2: "S1102", com_nm: "피부관리실"},
            S2103 = {ct_shop: S2103sum, com_cd2: "S2103", com_nm: "자동차미용"},
            S2201 = {ct_shop: S2201sum, com_cd2: "S2201", com_nm: "모터사이클 및 부품"};
        S.push(S3102, S1103, S1101, S9101, S2102, S6313, S1201, S1102, S2103, S2201)
        S = S.sort((a, b) => b.ct_shop - a.ct_shop);

        let G5201 = {ct_shop: G5201sum, com_cd2: "G5201", com_nm: "가구"},
            G4401 = {ct_shop: G4401sum, com_cd2: "G4401", com_nm: "가방"},
            G3206 = {ct_shop: G3206sum, com_cd2: "G3206", com_nm: "가전제품"},
            G6102 = {ct_shop: G6102sum, com_cd2: "G6102", com_nm: "문구"},
            G5919 = {ct_shop: G5919sum, com_cd2: "G5919", com_nm: "복권방"},
            G6101 = {ct_shop: G6101sum, com_cd2: "G6101", com_nm: "서적"},
            G4208 = {ct_shop: G4208sum, com_cd2: "G4208", com_nm: "섬유제품"},
            G2110 = {ct_shop: G2110sum, com_cd2: "G2110", com_nm: "수산물판매"},
            G1902 = {ct_shop: G1902sum, com_cd2: "G1902", com_nm: "슈퍼마켓"},
            G8301 = {ct_shop: G8301sum, com_cd2: "G8301", com_nm: "시계및귀금속"},
            G4301 = {ct_shop: G4301sum, com_cd2: "G4301", com_nm: "신발"},
            G5906 = {ct_shop: G5906sum, com_cd2: "G5906", com_nm: "악기"},
            G9903 = {ct_shop: G9903sum, com_cd2: "G9903", com_nm: "안경"},
            G6403 = {ct_shop: G6403sum, com_cd2: "G6403", com_nm: "완구"},
            G6307 = {ct_shop: G6307sum, com_cd2: "G6307", com_nm: "운동/경기용품"},
            G4104 = {ct_shop: G4104sum, com_cd2: "G4104", com_nm: "유아의류"},
            G2104 = {ct_shop: G2104sum, com_cd2: "G2104", com_nm: "육류판매"},
            G8107 = {ct_shop: G8107sum, com_cd2: "G8107", com_nm: "의료기기"},
            G5910 = {ct_shop: G5910sum, com_cd2: "G5910", com_nm: "인테리어"},
            G4105 = {ct_shop: G4105sum, com_cd2: "G4105", com_nm: "일반의류"},
            G2102 = {ct_shop: G2102sum, com_cd2: "G2102", com_nm: "자동차부품"},
            G9102 = {ct_shop: G9102sum, com_cd2: "G9102", com_nm: "전자상거래업"},
            G8601 = {ct_shop: G8601sum, com_cd2: "G8601", com_nm: "중고가구"},
            G1201 = {ct_shop: G1201sum, com_cd2: "G1201", com_nm: "중고차판매"},
            G2111 = {ct_shop: G2111sum, com_cd2: "G2111", com_nm: "청과상"},
            G3101 = {ct_shop: G3101sum, com_cd2: "G3101", com_nm: "컴퓨터및주변장치판매"},
            G1903 = {ct_shop: G1903sum, com_cd2: "G1903", com_nm: "편의점"},
            G4102 = {ct_shop: G4102sum, com_cd2: "G4102", com_nm: "한복점"},
            G3105 = {ct_shop: G3105sum, com_cd2: "G3105", com_nm: "핸드폰"},
            G8108 = {ct_shop: G8108sum, com_cd2: "G8108", com_nm: "화장품"},
            G8501 = {ct_shop: G8501sum, com_cd2: "G8501", com_nm: "화초"},
            G2124 = {ct_shop: G2124sum, com_cd2: "G2124", com_nm: "반찬가게"},
            G8409 = {ct_shop: G8409sum, com_cd2: "G8409", com_nm: "예술품"},
            G8102 = {ct_shop: G8102sum, com_cd2: "G8102", com_nm: "의약품"},
            G8604 = {ct_shop: G8604sum, com_cd2: "G8604", com_nm: "재생용품 판매점"},
            G7103 = {ct_shop: G7103sum, com_cd2: "G7103", com_nm: "주유소"};
        G.push(G5201, G4401, G3206, G6102, G5919, G6101, G4208, G2110, G1902, G8301, G4301, G5906, G9903, G6403, G6307, G4104, G2104, G8107, G5910, G4105, G2102, G9102, G8601, G1201, G2111, G3101, G1903, G4102, G3105, G8108, G8501, G2124, G8409, G8102, G8604, G7103)
        G = G.sort((a, b) => b.ct_shop - a.ct_shop);

        let R2202 = {ct_shop: R2202sum, com_cd2: "R2202", com_nm: "PC방"},
            R2904 = {ct_shop: R2904sum, com_cd2: "R2904", com_nm: "기타오락장"},
            R2203 = {ct_shop: R2203sum, com_cd2: "R2203", com_nm: "노래방"},
            R1306 = {ct_shop: R1306sum, com_cd2: "R1306", com_nm: "당구장"},
            R2105 = {ct_shop: R2105sum, com_cd2: "R2105", com_nm: "독서실"},
            R1305 = {ct_shop: R1305sum, com_cd2: "R1305", com_nm: "볼링장"},
            R2201 = {ct_shop: R2201sum, com_cd2: "R2201", com_nm: "전자게임장"},
            R1104 = {ct_shop: R1104sum, com_cd2: "R1104", com_nm: "녹음실"},
            R1319 = {ct_shop: R1319sum, com_cd2: "R1319", com_nm: "스포츠클럽"},
            R1341 = {ct_shop: R1341sum, com_cd2: "R1341", com_nm: "스포츠 강습"},
            R1309 = {ct_shop: R1309sum, com_cd2: "R1309", com_nm: "골프연습장"};
        R.push(R2202, R2904, R2203, R1306, R2105, R1305, R2201, R1104, R1319, R1341, R1309)
        R = R.sort((a, b) => b.ct_shop - a.ct_shop);

        let N2904 = {ct_shop: N2904sum, com_cd2: "N2904", com_nm: "가정용품임대"},
            N2912 = {ct_shop: N2912sum, com_cd2: "N2912", com_nm: "의류임대"},
            N2101 = {ct_shop: N2101sum, com_cd2: "N2101", com_nm: "건축물청소"},
            N2902 = {ct_shop: N2902sum, com_cd2: "N2902", com_nm: "비디오/서적임대"};
        N.push(N2904, N2912, N2101, N2902)
        N = N.sort((a, b) => b.ct_shop - a.ct_shop);

        let M1001 = {ct_shop: M1001sum, com_cd2: "M1001", com_nm: "변호사사무소"},
            M1002 = {ct_shop: M1002sum, com_cd2: "M1002", com_nm: "변리사사무소"},
            M3001 = {ct_shop: M3001sum, com_cd2: "M3001", com_nm: "사진관"},
            M2003 = {ct_shop: M2003sum, com_cd2: "M2003", com_nm: "세무사사무소"},
            M9002 = {ct_shop: M9002sum, com_cd2: "M9002", com_nm: "통번역서비스"},
            M2002 = {ct_shop: M2002sum, com_cd2: "M2002", com_nm: "회계사사무소"},
            M1003 = {ct_shop: M1003sum, com_cd2: "M1003", com_nm: "기타법무서비스"};
        M.push(M1001, M1002, M3001, M2003, M9002, M2002, M1003)
        M = M.sort((a, b) => b.ct_shop - a.ct_shop);

        let L2201 = {ct_shop: L2201sum, com_cd2: "L2201", com_nm: "부동산중개업"};
        L.push(L2201)
        L = L.sort((a, b) => b.ct_shop - a.ct_shop);

        let P6211 = {ct_shop: P6211sum, com_cd2: "P6211", com_nm: "외국어학원"},
            P6901 = {ct_shop: P6901sum, com_cd2: "P6901", com_nm: "컴퓨터학원"},
            P6607 = {ct_shop: P6607sum, com_cd2: "P6607", com_nm: "예술학원"},
            P6304 = {ct_shop: P6304sum, com_cd2: "P6304", com_nm: "일반교습학원"};
        P.push(P6211, P6901, P6607, P6304)
        P = P.sort((a, b) => b.ct_shop - a.ct_shop);

        for (var i = 0; i < result.length; i++) {
            if(result[i].division1=='I'){
                storesI += result[i].ct_shop;
            }else if(result[i].division1=='S'){
                storesS += result[i].ct_shop;
            }else if(result[i].division1=='G'){
                storesG += result[i].ct_shop;
            }else if(result[i].division1=='R'){
                storesR += result[i].ct_shop;
            }else if(result[i].division1=='N'){
                storesN += result[i].ct_shop;
            }else if(result[i].division1=='M'){
                storesM += result[i].ct_shop;
            }else if(result[i].division1=='L'){
                storesL += result[i].ct_shop;
            }else if(result[i].division1=='P'){
                storesP += result[i].ct_shop;
            }
        }

        all = [storesI, storesS, storesG, storesR, storesN, storesM, storesL, storesP]
        industryRatioAll(all)
        // console.log("I일때 배열",I)
    }
}

var all = []
var I = []
var S = []
var G = []
var R = []
var N = []
var M = []
var L = []
var P = []

//상점수업종별 - 전체업종 파이그래프
function industryRatioAll(data) {
    var dataset = {
        label: "업종별 상점수",
        backgroundColor: ['#EE5545', '#DD4C79', '#A25AA1', '#4983C4', '#31C3D9', '#33CC94', '#70C14A', '#C2EE45'],//라벨별 컬러설정
        borderColor: '#fff',
        data: data
    }
    var labels = ['숙박·음식', '수리·개인서비스', '도·소매', '예술·스포츠·여가', '시설관리·임대', '과학·기술', '부동산', '교육'];
    var datasets = {datasets: [dataset], labels: labels};
    var config = {
        type: 'pie', data: datasets, //데이터 셋
        options: {
            responsive: true, maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom', fontColor: 'black', align: 'center', display: true, fullWidth: true, labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            }, tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label = labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label + " " + precentage + "% " + currentValue_comma + "개";
                    }
                }
            }, plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value', fontColor: 'black', fontSize: 15, precision: 2
                }

            },
        }
    }
    var canvas = document.getElementById('industry');
    var industry = new Chart(canvas, config);
}



//상점수업종별 - 선택업종 파이그래프
function industryRatio(color) {
    console.log("dksehl?", color,color[0].ct_shop)

    var backco = [];
    for (var i = 0; i < color.length; i++) {
        backco.push(color[i].ct_shop);
    }
    var barColors = backco.map((value) => value > 200 ? 'rgba(255, 255, 255, 0.1)' : value > 100 ? 'rgba(255, 255, 255, 0.15)' : value > 50 ? 'rgba(255, 255, 255, 0.2)' : value > 20 ? 'rgba(255, 255, 255, 0.25)' : value > 10 ? 'rgba(255, 255, 255, 0.3)' : value > 5 ? 'rgba(255, 255, 255, 0.4)' : value > 3 ? 'rgba(255, 255, 255, 0.5)' : value > 1 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.7)');
    var dataset = {
        labels: color.map(o=>o.com_nm), backgroundColor: barColors, borderColor: '#fff', borderWidth: 0.3, data: color.map(o=>o.ct_shop),
    }
    var labels = color.map(o=>o.com_nm);
    var datasets = {datasets: [dataset], labels: labels}
    var config = {
        type: 'pie', data: datasets, //데이터 셋
        options: {
            responsive: true, maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom', fontColor: 'black', align: 'center', display: false, fullWidth: true, labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            }, tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label = labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label + " " + precentage + "% " + currentValue_comma + "개";
                    }
                }
            }, plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value', fontColor: 'black', fontSize: 15, precision: 2
                }

            }
        }
    }
    var canvas = document.getElementById('industry');
    var industry = new Chart(canvas, config);
}


function changecate() {
    var maincate = $('input[name="region_maincate"]:checked').val() //대분류
    $('#industry').remove();//있던 차트 지우고
    $('.industry').append('<canvas id="industry"><canvas>');//차트id추가
    if (maincate == 'all') {
        industryRatioAll(all)
        $('.storenum').text("전체 업종")
        $('.industry>#colorCircle').removeClass()
    } else if (maincate == 'I') {
        console.log(I)
        industryRatio(I)
        $('.storenum').text("숙박·음식")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('I')
    } else if (maincate == 'S') {
        console.log(S)
        industryRatio(S)
        $('.storenum').text("수리·개인서비스")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('S')
    } else if (maincate == 'G') {
        console.log(G)
        industryRatio(G)
        $('.storenum').text("도·소매")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('G')
    } else if (maincate == 'R') {
        console.log(R)
        industryRatio(R)
        $('.storenum').text("예술·스포츠·여가")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('R')
    } else if (maincate == 'N') {
        console.log(N)
        industryRatio(N)
        $('.storenum').text("시설관리·임대")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('N')
    } else if (maincate == 'M') {
        console.log(M)
        industryRatio(M)
        $('.storenum').text("과학·기술")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('M')
    } else if (maincate == 'L') {
        console.log(L)
        industryRatio(L)
        $('.storenum').text("부동산")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('L')
    } else if (maincate == 'P') {
        console.log(P)
        industryRatio(P)
        $('.storenum').text("교육")
        $('.industry>#colorCircle').removeClass()
        $('.industry>#colorCircle').addClass('P')
    }
}


//인구수탭 사이드바 인포
function sideInfoPopul(result, area, total, getarea) {
    var total_comma = total.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    var density = Math.round(total / getarea);
    console.log("Math.round", total, getarea, density)
    $('#sidebar').addClass('visible');
    if (area && result) {
        household = []
        household = [{house: result[0].house_1, idx: 1}, {house: result[0].house_2, idx: 2}, {
            house: result[0].house_3, idx: 3
        }, {house: result[0].house_4, idx: 4}, {house: result[0].house_5, idx: 5}, {
            house: result[0].house_6, idx: 6
        }, {house: result[0].house_7, idx: 7},]
        household = household.sort((a, b) => b.house - a.house);
        console.log("가구원수", household)
        var houseli = "";
        for (var i = 0; i < household.length; i++) {
            houseli += `<li class="h` + household[i].idx + `"><p class="housetype">` + household[i].idx + `인가구</p><p class="housenum">` + household[i].house + `명</p></li>`
        }
        document.getElementById("sidebar").innerHTML = '<div id="sidebody">' + '<div class="sideinfo_fixed">' + '<div class="sideinfo">' + '<div class="areatitle iconPlus">' + area.area_name + '</div>' + '</div>' + '</div>' + '<div class="margintop"></div>' + '<div class="sideinfo float">' + '<h4 class="sideinfoTitle">인구수</h4>' + '<div class="storegray iconPlus">' + '총 ' + total_comma + '명' + '</div>' + '</div>' + '<div class="sideinfo float">' + '<h4 class="sideinfoTitle">면적</h4>' + '<div class="crop_black_20dp iconPlus">' + '총 ' + getarea + '㎢' + '</div>' + '</div>' + '<div class="sideinfo float">' + '<h4 class="sideinfoTitle">인구밀도</h4>' + '<div class="groups_gray_20dp iconPlus">' + density + '인/㎢' + '</div>' + '</div>' + '<div class="greyspan"></div>' + '<div class="sideinfo">' + '<h4 class="sideinfoTitle">대표자 연령대별 사업체</h4>' + '<div class="side_graph">' + '<canvas id="business"></canvas>' + '</div>' + '</div>' + '<div class="sideinfo">' + '<h4 class="sideinfoTitle">가구원수별 가구수</h4>' + '<ul class="short2">' + houseli + '</ul>' + '</div>' + '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div>' + '</div>' + '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
        if (window.innerWidth < 767) {
            $('#sidebody').addClass('visible_none');
            $('#sidebar').addClass('on');
        }
        businessRatio(result[0].ct_shop_u20s, result[0].ct_shop_30s, result[0].ct_shop_40s, result[0].ct_shop_50s, result[0].ct_shop_o60s)


    }
}

var household = []


//사업체연령대
function businessRatio(n1, n2, n3, n4, n5) {
    var dataset = {
        label: "소비유형", backgroundColor: ['#70C14A', '#33CC94', '#31C3D9', '#4983C4', '#A25AA1'],//라벨별 컬러설정
        borderColor: '#fff', data: [n1, n2, n3, n4, n5]
    }
    var labels = ['20대 이하', '30대', '40대', '50대', '60대 이상'];
    var datasets = {datasets: [dataset], labels: labels}
    var config = {
        type: 'pie', data: datasets, //데이터 셋
        options: {
            responsive: true, maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                position: 'bottom', fontColor: 'black', align: 'center', display: true, fullWidth: true, labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            }, tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var label = labels[tooltipItem.index]
                        var currentValue = dataset.data[tooltipItem.index];
                        var currentValue_comma = currentValue.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label + " " + precentage + "% " + currentValue_comma + "개";
                    }
                }
            }, plugins: {
                labels: {//두번째 script태그를 설정하면 각 항목에다가 원하는 데이터 라벨링을 할 수 있다.
                    render: 'value', fontColor: 'black', fontSize: 15, precision: 2
                }

            }
        }
    }
    var canvas = document.getElementById('business');
    var business = new Chart(canvas, config);
}

//가구원 순위 1위,2위,3위 클라스표시


//(주요이슈)임대시세탭 사이드바 인포
function sideInfoRental(result, area, total) {
    var total_comma = total.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    $('#sidebar').addClass('visible');
    if (area && result) {
        document.getElementById("sidebar").innerHTML = '<div id="sidebody">' + '<div class="sideinfo_fixed">' + '<div class="sideinfo">' + '<div class="areatitle iconPlus">' + area.area_name + '</div>' + '</div>' + '</div>' + '<div class="margintop"></div>' +

            '<div class="sideinfo">' + '<h4 class="sideinfoTitle">분기별 임대시세</h4>' + '<select name="chartYear" id="chartYear" onChange="updateChartType()">' + '<option value="2021">2021년</option>' + '<option value="2020">2020년</option>' + '<option value="2019">2019년</option>' + '<option value="2018">2018년</option>' + '<option value="2017">2017년</option>' + '</select>' + '<div class="side_graph short speedChart">' + '<canvas id="speedChart"></canvas>' + '</div>' + '</div>' +

            '<div class="sideinfo">' + '<h4 class="sideinfoTitle">SNS 검색어</h4>' + '<div class="side_graph cloud">' + '</div>' + '</div>' +

            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' + '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
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
        multichart(data20171f, data2017other)
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

function updateChartType() {
    console.log("1층외배열", data20171f, data2017other)
    $('#speedChart').remove();//있던 차트 지우고
    $('.speedChart').append('<canvas id="speedChart"><canvas>');//차트id추가

    var year = $('select[name="chartYear"]').val()
    console.log(year)

    if (year == 2017) {
        multichart(data20171f, data2017other)
    } else if (year == 2018) {
        multichart(data20181f, data2018other)
    } else if (year == 2019) {
        multichart(data20191f, data2019other)
    } else if (year == 2020) {
        multichart(data20201f, data2020other)
    } else if (year == 2021) {
        multichart(data20211f, data2021other)
    }

}

function multichart(data1, data2) {
    var speedCanvas = document.getElementById("speedChart");
    var dataFirst = {
        label: "임대시세 1층", data: data1, lineTension: 0, fill: false, borderColor: '#1540bf'
    };
    var dataSecond = {
        label: "임대시세 1층 외", data: data2, lineTension: 0, fill: false, borderColor: '#709bff'
    };
    var speedData = {
        labels: ["1분기", "2분기", "3분기", "4분기"], datasets: [dataFirst, dataSecond]
    };
    var chartOptions = {
        maintainAspectRatio: false, legend: {
            display: true, position: 'bottom', labels: {
                boxWidth: 40, backgroundColor: '#94b4ff', fontColor: 'black'
            }
        }, title: {
            display: true, text: '(단위:천원)', position: 'right',
        }
    };
    var lineChart = new Chart(speedCanvas, {
        type: 'line', data: speedData, options: chartOptions
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

function closeCommnunity() {
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

function getReply(communitySeq, obj) {

    if (communitySeq === undefined) {
        $('.detail_community').removeClass('on');
        // location.href = "/community/" + $('input[name=communitySeq]').val() + "?type=shop";
        return false;
    }

    var data = {
        communitySeq: communitySeq, type: "region"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST", url: "/trading-area/reply", async: false, data: JSON.stringify(data), //contentType:"application/json; charset=utf-8",
        dataType: "text", //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        }, error: function (res) {
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

function addReply(communitySeq, obj) {

    //let comment = $("[name=comment]").val();
    let comment = $(obj).parent("#reply_add").find("[name=comment]").val();

    if (comment == "") {
        alert("댓글을 입력해주세요.");
        return false;
    }

    var data = {
        communitySeq: communitySeq, comment: comment, type: "region"
    }

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST", url: "/trading-area/reply/add", async: false, data: JSON.stringify(data), //contentType:"application/json; charset=utf-8",
        dataType: "text", //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        }, success: function (fragment) {

            $(".reply_list").replaceWith(fragment);
            $(".reply_list").show();
            //$(".loading_box").hide();
        }, error: function (res) {
            return false;
        }
    }).done(function (fragment) {
        $('input[name=comment]').val("");
    });
}

function backbtn() {
    $('.detail_community').removeClass('on');
}