

//기본 위치는 서울시청 좌표
var clientLatitude = 37.5668260055;
var clientLongitude = 126.9786567859;
// 맵 기본 레벨
var mapDefaultLevel = 4;
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표 기본 위치는 서울시청
        level: mapDefaultLevel, // 지도의 확대 레벨
    };

if (navigator.geolocation) {
    // 현재 접속 사용자 위치 정보
    navigator.geolocation.getCurrentPosition(async function (pos) {
        clientLatitude = pos.coords.latitude;
        clientLongitude = pos.coords.longitude;
        var moveLatLon = new kakao.maps.LatLng(
            clientLatitude,
            clientLongitude
        );
        await map.setCenter(moveLatLon);
    });
}
//현위치 설정
function setCenter() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
    map.setLevel(mapDefaultLevel);
}

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
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
async function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    await geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
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
                break;
            }
        }
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
//시간딜레이 함수
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
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
        let htmlSegment = `<li title="${sido.name}" id="${sido.name}" value="${sido.code}" onclick="onClickSearch(this)">
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
    let fiddong = sidoList.map((el, index, arr) => arr.find(isdongTrue)
        ? ({ ...el, dong: el.name.split(" ", 4)[2] + " " + el.name.split(" ", 4)[3] })
        : ({ ...el, dong: el.name.split(" ", 4)[2] })
    );
    name = [...fiddong]

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

//개별 시군구 리스트 클릭시에 자동 검색
function searchSidoDongPlaces() {
    if (!currCategory) {
        return;
    }
    geocoder.addressSearch(currCategory, placesSearchCB, { useMapBounds: true })
}

// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSearch(el) {
    var id = el.id,
        className = el.className;

    if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
    } else {
        currCategory = id;
        changeCategoryClass(el);
        searchSidoDongPlaces();
    }
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
    var category = document.getElementById('dongBox'),
        children = category.children,
        i;
    for (i = 0; i < children.length; i++) {
        children[i].className = '';
    }

    if (el) {
        el.className = 'on';
    }
}

//시군구 선택박스 닫기 열기
var sidoBox = document.getElementById('sidoBox');
var sigunguBox = document.getElementById('sigunguBox');
var dongBox = document.getElementById('dongBox');

function changeSelectBox(type) {
    // 시도 카테고리가 클릭됐을 때
    if (type === 'sido') {
        // 커피숍 카테고리를 선택된 스타일로 변경하고
        sidoBox.className = 'menu_selected';
        // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
        sigunguBox.className = '';
        dongBox.className = '';
    } else if (type === 'sigungu') { // 편의점 카테고리가 클릭됐을 때
        // 편의점 카테고리를 선택된 스타일로 변경하고
        sidoBox.className = '';
        sigunguBox.className = 'menu_selected';
        dongBox.className = '';
    } else if (type === 'dong') { // 주차장 카테고리가 클릭됐을 때
        // 주차장 카테고리를 선택된 스타일로 변경하고
        sidoBox.className = '';
        sigunguBox.className = '';
        dongBox.className = 'menu_selected';
    }
}

const closeBtn = document.querySelector('body')
mapContainer.addEventListener("click", e => {
    sidoBox.className = '';
    sigunguBox.className = '';
    dongBox.className = '';
})

/*동동이 관련*/
/*동동이 관련*/
/*동동이 관련*/

var newPositions = [];
for(var i =0; i < researchShop.length;i++){
    var resaerchData = researchShop[i];
    var data = new Object() ;
    data.storeName = resaerchData.shop_nm ;
    data.address_name = resaerchData.addr ;
    data.road_address_name = resaerchData.st_addr ;
    data.largeCategory = resaerchData.nm_type1 ;
    data.mediumCategory = resaerchData.nm_type2 ;
    data.smallcategory = resaerchData.nm_type3 ;
    data.category_large_code = resaerchData.code_type1;
    data.category_medium_code = resaerchData.code_type2 ;
    data.category_small_code = resaerchData.code_type3 ;
    data.x = resaerchData.latitude ;
    data.y = resaerchData.longitude ;
    data.subway = resaerchData.sub_station ;
    data.busStation = resaerchData.bus_station ;

    newPositions.push(data);
}
console.log("newPositions :: "+JSON.stringify(newPositions));



// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
    placeOverlay2 = new kakao.maps.CustomOverlay({ zIndex: 1 }),
    contentNode1 = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
    contentNode2 = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다

    markersBK9 = [], // 마커를 담을 배열입니다 1. Q음식
    markersMT1 = [], // 마커를 담을 배열입니다 2. N관광여가오락
    markersPM9 = [], // 마커를 담을 배열입니다 3. L=부동산
    markersOL7 = [], // 마커를 담을 배열입니다 4. F=생활서비스
    markersCE7 = [], // 마커를 담을 배열입니다 5. D=소매
    markersCS2 = [], // 마커를 담을 배열입니다 6. O=숙박
    markersP = [], // 마커를 담을 배열입니다 7. P=스포츠
    markersR = [], // 마커를 담을 배열입니다 8. R=학문교육
    currCategory = ""; // 현재 선택된 카테고리를 가지고 있을 변수입니다

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
contentNode1.className = "placeinfo_wrap";
contentNode2.className = "placeinfo_wrap";
// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(contentNode1, "mousedown", kakao.maps.event.preventMap);
addEventHandle(contentNode1, "touchstart", kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode1);
placeOverlay2.setContent(contentNode2);

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent("on" + type, callback);
    }
}


// 커스텀 오버레이를 숨깁니다
placeOverlay.setMap(null);

var BK9 = document.getElementById("BK9");
var MT1 = document.getElementById("MT1");
var PM9 = document.getElementById("PM9");
var OL7 = document.getElementById("OL7");
var CE7 = document.getElementById("CE7");
var CS2 = document.getElementById("CS2");
var P = document.getElementById("P");
var R = document.getElementById("R");

var BK9markers = [],
    MT1markers = [],
    PM9markers = [],
    OL7markers = [],
    CE7markers = [],
    CS2markers = [],
    Pmarkers = [],
    Rmarkers = [];
function a() {//1. Q=음식
    var bk9 = newPositions.filter((v) => v.category_large_code == "Q");
    var bk9_length = bk9.length;
    if (BK9.checked) {
        BK9markers.push(...bk9);
        displayBK9Places(BK9markers);
    } else {
        BK9markers.forEach((item, index) => {
                removeBK9Marker();
        });
    }
}
a();
function b() {//2. N=관광여가오락
    var mt1 = newPositions.filter((v) => v.category_large_code == "N");
    var mt1_length = mt1.length;
    if (MT1.checked) {
        MT1markers.push(...mt1);
        displayMT1Places(MT1markers);
    } else {
        MT1markers.forEach((item, index) => {
                removeMT1Marker();
        });
    }
}
b();
function c() { //3. L=부동산
    var pm9 = newPositions.filter((v) => v.category_large_code == "L");
    var pm9_length = pm9.length;
    if (PM9.checked) {
        PM9markers.push(...pm9);
        displayPM9Places(PM9markers);
    } else {
        PM9markers.forEach((item, index) => {
                removePM9Marker();
        });
    }
}
c();
function d() {//4. F=생활서비스
    var ol7 = newPositions.filter((v) => v.category_large_code == "F");
    var ol7_length = ol7.length;
    if (OL7.checked) {
        OL7markers.push(...ol7);
        displayOL7Places(OL7markers);
    } else {
        OL7markers.forEach((item, index) => {
                removeOL7Marker();
        });
    }
}
d();
function e() {//5. D=소매
    var ce7 = newPositions.filter((v) => v.category_large_code == "D");
    var ce7_length = ce7.length;
    if (CE7.checked) {
        CE7markers.push(...ce7);
        displayCE7Places(CE7markers);
    } else {
        CE7markers.forEach((item, index) => {
                removeCE7Marker();
        });
    }
}
e();
function f() {//6. O=숙박
    var cs2 = newPositions.filter((v) => v.category_large_code == "O");
    var cs2_length = cs2.length;
    if (CS2.checked) {
        CS2markers.push(...cs2);
        displayCS2Places(CS2markers);
    } else {
        CS2markers.forEach((item, index) => {
                removeCS2Marker();
        });
    }
}
f();

function g() {
    var p = newPositions.filter((v) => v.category_large_code == "P");
    var p_length = p.length;

    if (P.checked) {
        Pmarkers.push(...p);
        displayPPlaces(Pmarkers);
    } else {
        Pmarkers.forEach((item, index) => {
            removePMarker();
        });
    }
}
g();

function h() {
    var r = newPositions.filter((v) => v.category_large_code == "R");
    var r_length = r.length;

    if (R.checked) {
        Rmarkers.push(...r);
        displayPPlaces(Rmarkers);
    } else {
        Rmarkers.forEach((item, index) => {
            removeRMarker();
        });
    }
}
h();




// 1. Q=음식
// BK9
// BK9지도에 마커를 표출하는 함수입니다
function displayBK9Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addBK9Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);
    }
}
// BK9마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addBK9Marker(position) {
    var imageSrc =
            "/images/new/area/marker01.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersBK9.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 BK9마커를 모두 제거합니다
function removeBK9Marker() {
    for (var i = 0; i < markersBK9.length; i++) {
        markersBK9[i].setMap(null);
    }
    markersBK9 = [];
}

// 2. N관광여가오락
// MT1
// MT1지도에 마커를 표출하는 함수입니다
function displayMT1Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addMT1Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);
    }
}
// MT1마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMT1Marker(position) {
    var imageSrc =
            "/images/new/area/marker02.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersMT1.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 MT1마커를 모두 제거합니다
function removeMT1Marker() {
    for (var i = 0; i < markersMT1.length; i++) {
        markersMT1[i].setMap(null);
    }
    markersMT1 = [];
}


// 3. L=부동산
// PM9
// PM9지도에 마커를 표출하는 함수입니다
function displayPM9Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addPM9Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);
    }
}
// PM9마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addPM9Marker(position) {
    var imageSrc =
            "/images/new/area/marker03.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersPM9.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 PM9마커를 모두 제거합니다
function removePM9Marker() {
    for (var i = 0; i < markersPM9.length; i++) {
        markersPM9[i].setMap(null);
    }
    markersPM9 = [];
}


// 4. F=생활서비스
// OL7
// OL7지도에 마커를 표출하는 함수입니다
function displayOL7Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addOL7Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);
    }
}
// OL7마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addOL7Marker(position) {
    var imageSrc =
            "/images/new/area/marker04.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersOL7.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 OL7마커를 모두 제거합니다
function removeOL7Marker() {
    for (var i = 0; i < markersOL7.length; i++) {
        markersOL7[i].setMap(null);
    }
    markersOL7 = [];
}

// 5. D=소매
// CE7
// CE7지도에 마커를 표출하는 함수입니다
function displayCE7Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addCE7Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );
        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);
    }
}
// CE7마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addCE7Marker(position) {
    var imageSrc =
            "/images/new/area/marker05.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersCE7.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 CE7마커를 모두 제거합니다
function removeCE7Marker() {
    for (var i = 0; i < markersCE7.length; i++) {
        markersCE7[i].setMap(null);
    }
    markersCE7 = [];
}

// 6. O=숙박
// CS2
// CS2지도에 마커를 표출하는 함수입니다
function displayCS2Places(place) {
    for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = addCS2Marker(
            new kakao.maps.LatLng(place[i].x, place[i].y)
        );

        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);

    }
}
// CS2마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addCS2Marker(position) {
    var imageSrc =
            "/images/new/area/marker06.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersCS2.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}
// 지도 위에 표시되고 있는 CS2마커를 모두 제거합니다
function removeCS2Marker() {
    for (var i = 0; i < markersCS2.length; i++) {
        markersCS2[i].setMap(null);
    }
    markersCS2 = [];
}

// 777P
// P
// P지도에 마커를 표출하는 함수입니다
function displayPPlaces(place) {
    for (var i = 0; i < place.length; i++) {
        var position = new kakao.maps.LatLng(place[i].x, place[i].y);
        // 마커를 생성하고 지도에 표시합니다
        var marker = addPMarker(position);


        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);

    }
}
//P마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addPMarker(position) {
    var imageSrc =
            "https://dummyimage.com/24x24/ff6200/0011ff", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersP.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}

// 지도 위에 표시되고 있는 CS2마커를 모두 제거합니다
function removePMarker() {
    for (var i = 0; i < markersP.length; i++) {
        markersP[i].setMap(null);
    }
    markersP = [];
}



// 888R
// R
// R지도에 마커를 표출하는 함수입니다
function displayRPlaces(place) {
    for (var i = 0; i < place.length; i++) {
        var position = new kakao.maps.LatLng(place[i].x, place[i].y);
        // 마커를 생성하고 지도에 표시합니다
        var marker = addRMarker(position);


        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        (function sdf(marker, place) {
            kakao.maps.event.addListener(marker, "click", function () {
                displayPlaceInfo(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoversdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseover", function () {
                displayPlaceInfoHover(place);
            });
        })(marker, place[i]);

        // 마커에 mouseover 이벤트를 등록합니다
        (function hoverOutsdf(marker, place) {
            kakao.maps.event.addListener(marker, "mouseout", function () {
                placeOverlay2.setMap(null);
            });
        })(marker, place[i]);

    }
}
//P마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addRMarker(position) {
    var imageSrc =
            "https://dummyimage.com/24x24/ff6200/0011ff", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(24, 24), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markersR.push(marker); // 배열에 생성된 마커를 추가합니다
    return marker;
}

// 지도 위에 표시되고 있는 CS2마커를 모두 제거합니다
function removeRMarker() {
    for (var i = 0; i < markersR.length; i++) {
        markersR[i].setMap(null);
    }
    markersR = [];
}




// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
    customInfo(place);
    sideInfo(place);
    placeOverlay.setPosition(new kakao.maps.LatLng(place.x, place.y));
    placeOverlay.setMap(map);
}
// 호버한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfoHover(place) {
    customInfo2(place);
    placeOverlay2.setPosition(new kakao.maps.LatLng(place.x, place.y));
    placeOverlay2.setMap(map);
}

//커스텀속에 인포
function customInfo(place){
    var content1 =
        '<div class="placeinfo">' +
        '   <p class="title" >' +
        place.storeName +
        "</p>"+
        '<div class="close" onclick="closeOverlay()" title="닫기"></div>';
    content1 +=
        '    <span title="' +
        place.road_address_name +
        '">' +
        place.road_address_name +
        "</span>" +
        '  <span class="jibun" title="' +
        place.address_name +
        '">(지번 : ' +
        place.address_name +
        ")</span>";

    content1 +=
        "</div>" +
        '<div class="after"></div>';
    contentNode1.innerHTML = content1;
}
//커스텀속에 인포
function customInfo2(place){
    var content1 =
        '<div class="placeinfo">' +
        '   <p class="title" >' +
        place.storeName +
        "</p>"+
        '<div class="close" onclick="closeOverlay()" title="닫기"></div>';
    content1 +=
        '    <span title="' +
        place.road_address_name +
        '">' +
        place.road_address_name +
        "</span>" +
        '  <span class="jibun" title="' +
        place.address_name +
        '">(지번 : ' +
        place.address_name +
        ")</span>";

    content1 +=
        "</div>" +
        '<div class="after"></div>';
    contentNode2.innerHTML = content1;
}

function sideInfo(place){
    if (place) {
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("sidebar").innerHTML =

            '<div class="sideinfo">'+
            '<h4 class="sideinfoTitle">상점 정보</h4>'+
            '<div class="location iconPlus">' +
            place.road_address_name +
            '</div>'+
            '<div class="storegray iconPlus">' +
            place.storeName +
            '</div>'+
            "</div>"+

            '<div class="sideinfo">'+
            '<h4 class="sideinfoTitle">업종 정보</h4>'+
            '<div class="listCtegory">' +
            '<span class="lCategory">' +
            place.largeCategory +
            '</span>'+
            '<span class="mCategory">' +
            place.mediumCategory +
            '</span>'+
            '</div>'+
            "</div>"+

            '<div class="sideinfo">'+
            '<h4 class="sideinfoTitle">주변 정보</h4>' +
            '<div class="subway iconPlus">지하철역' +
            '<span class="position_name">' +
            place.subway +
            '</span>'+
            '<span class="distance">거리</span>' +
            '</div>'+
            '<div class="bus iconPlus">버스' +
            '<span class="position_name">' +
            place.busStation +
            '</span>'+
            '<span class="distance">거리</span>'+
            '</div>'+
            '<div class="street iconPlus">도로' +
            place.busStation +
            '<span class="distance">거리</span>'+
            '</div>'+
            "</div>"+

            '<div class="sideinfo">'+
            '<h4 class="sideinfoTitle">최근 이슈</h4>'+
            '<div class="issue">' +
            '<span>로그인이 필요합니다.</span>'+
            '<a>로그인/회원가입 하러가기</a>'+
            '</div>'+
            "</div>"+

            '<button class="analysisBtn">상권활성화 예측지수</button>'+

            '<div class="toggle_side" onclick="closeOverlay()" title="닫기"></div>';

    }
}


//오버레이 닫음
function closeOverlay() {
    placeOverlay.setMap(null);
    document.getElementById("sidebar").style.display = "none";
}

$('.community_Btn').click(function() {
    $('.community_pop_wrap').toggleClass('on');
});

