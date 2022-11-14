

//기본 위치는 서울시청 좌표
var clientLatitude = 37.5668260055;
var clientLongitude = 126.9786567859;
// 맵 기본 레벨
var mapDefaultLevel = 10;
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
//시도 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickSidoSearch(el) {
    var id = el.id,
        className = el.className;
    currCategory = id;
    searchSidoDongPlaces();
}
// 시군구 행정동 카테고리를 클릭했을 때 호출되는 함수입니다
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

// // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
// function changeCategoryClass(el) {
//     var category = document.getElementById('dongBox'),
//         children = category.children,
//         i;
//     for (i = 0; i < children.length; i++) {
//         children[i].className = '';
//     }
//
//     if (el) {
//         el.className = 'on';
//     }
// }

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

// 마커 클러스터러를 생성합니다
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 3, // 클러스터 할 최소 지도 레벨
    calculator: [10, 30, 50], // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
    texts: getTexts, // texts는 ['삐약', '꼬꼬', '꼬끼오', '치멘'] 이렇게 배열로도 설정할 수 있다
    styles: [{ // calculator 각 사이 값 마다 적용될 스타일을 지정한다
        width : '30px', height : '30px',
        background: 'rgba(51, 204, 255, .8)',
        borderRadius: '15px',
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '31px'
    },
        {
            width : '40px', height : '40px',
            background: 'rgba(255, 153, 0, .8)',
            borderRadius: '20px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '41px'
        },
        {
            width : '50px', height : '50px',
            background: 'rgba(255, 51, 204, .8)',
            borderRadius: '25px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '51px'
        },
        {
            width : '60px', height : '60px',
            background: 'rgba(255, 80, 80, .8)',
            borderRadius: '30px',
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '61px'
        }
    ]
});

// 클러스터 내부에 삽입할 문자열 생성 함수입니다
function getTexts( count ) {

    // 한 클러스터 객체가 포함하는 마커의 개수에 따라 다른 텍스트 값을 표시합니다
    if(count < 1000) {
        return '삐약';
    } else if(count < 5000) {
        return '꼬꼬';
    } else if(count < 10000) {
        return '꼬끼오';
    } else {
        return '치멘';
    }
}

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

var Q = document.getElementById("Q");
var N = document.getElementById("N");
var L = document.getElementById("L");
var F = document.getElementById("F");
var D = document.getElementById("D");
var O = document.getElementById("O");
var P = document.getElementById("P");
var R = document.getElementById("R");

var Qmarkers = [],
    Nmarkers = [],
    Lmarkers = [],
    Fmarkers = [],
    Dmarkers = [],
    Omarkers = [],
    Pmarkers = [],
    Rmarkers = [];
//선택박스 체크시 각 카테고리의 마커 배열에 추가하는 함수 6개
//배열을 6개로 안나누고는 특정마커 제거가 안되서 배열자체를 6개로 나눴음
function a() {
    var bbb = newPositions.filter((v) => v.category_large_code == "Q");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = Q,
        cateMarker = Qmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
a();
function b() {
    var bbb = newPositions.filter((v) => v.category_large_code == "N");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = N,
        cateMarker = Nmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
b();
function c() {
    var bbb = newPositions.filter((v) => v.category_large_code == "L");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = L,
        cateMarker = Lmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
c();
function d() {
    var bbb = newPositions.filter((v) => v.category_large_code == "F");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = F,
        cateMarker = Fmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
d();
function e() {
    var bbb = newPositions.filter((v) => v.category_large_code == "D");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = D,
        cateMarker = Dmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
e();
function f() {
    var bbb = newPositions.filter((v) => v.category_large_code == "O");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = O,
        cateMarker = Omarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
f();

function g() {
    var bbb = newPositions.filter((v) => v.category_large_code == "P");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = P,
        cateMarker = Pmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
g();

function h() {
    var bbb = newPositions.filter((v) => v.category_large_code == "R");//카테고리 대분류 필터
    var imageSrc =
        "https://dummyimage.com/24x24/73ff00/0011ff"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = R,
        cateMarker = Rmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        }
        clusterer.addMarkers(cateMarker); //클러스터리에 해당 마커를 추가합니다.
    } else {
        clusterer.removeMarkers(cateMarker);//클러스터리에 해당 마커를 제거합니다.
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}
h();

function displayPlaces(marker, place, i) {
    // 마커와 검색결과 항목을 클릭 했을 때
    // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
    (function sdf(marker, place) {
        kakao.maps.event.addListener(marker, "click", function () {
            displayPlaceInfo(place);
        });
        kakao.maps.event.addListener(marker, "mouseover", function () {
            displayPlaceInfoHover(place);
        });
        kakao.maps.event.addListener(marker, "mouseout", function () {
            placeOverlay2.setMap(null);
        });
    })(marker, place[i]);
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(place, i, imageSrc) {
    var position = new kakao.maps.LatLng(place[i].x, place[i].y),
        imageSize = new kakao.maps.Size(8, 8), // 마커 이미지의 크기
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
        });
    return marker;
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
    customInfo(place);
    sideInfo(place);
    placeOverlay.setPosition(new kakao.maps.LatLng(place.x, place.y));
    placeOverlay.setMap(map);
}
// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfoHover(place) {
    customInfo2(place);
    placeOverlay2.setPosition(new kakao.maps.LatLng(place.x, place.y));
    placeOverlay2.setMap(map);
}

function content111(place) {
    var content = '<div class="placeinfo">' +
        '   <p class="title" >' +
        place.storeName +
        "</p>" +
        '<div class="close" onclick="closeOverlay()" title="닫기"></div>';
    content +=
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

    content +=
        "</div>" +
        '<div class="after"></div>';
    return content
}

//커스텀속에 인포
function customInfo(place) {
    var content1 = content111(place);
    contentNode1.innerHTML = content1;
}
//커스텀속에 인포
function customInfo2(place) {
    var content1 = content111(place);
    contentNode2.innerHTML = content1;
}
//사이드바 인포
function sideInfo(place) {
    if (place) {
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("sidebar").innerHTML =
            '<div class="close" onclick="closeOverlay()" title="닫기"></div>' +
            '<div class="sideinfo">' +
            '   <p class="title" >' +
            '<span class="storename">상점명 </span>' +
            place.storeName +
            "</p>" +
            '   <span title="' +
            place.road_address_name +
            '">' +
            '<span class="road_address_name">도로명주소 </span>' +
            place.road_address_name +
            "</span>" +
            '  <span class="jibun" title="' +
            place.address_name +
            '">(지번 : ' +
            place.address_name +
            ")</span>" +
            '   <p class="subway" >' +
            '<span class="subwayname">가까운 지하철역: </span>' +
            place.subway +
            "</p>" +
            '   <p class="busStation" >' +
            '<span class="busStationname">가까운 버스정류장: </span>' +
            place.busStation +
            "</p>" +
            '   <p class="issue" >' +
            '<span class="issuename">최근이슈 : <준비중> </span>' +
            "</p>" +
            "</div>" +
            '<div class="after"></div>';
    }
}

//오버레이닫음
function closeOverlay() {
    placeOverlay.setMap(null);
    document.getElementById("sidebar").style.display = "none";
}

$('.community_Btn').click(function() {
    $('.community_pop_wrap').toggleClass('on');
});

