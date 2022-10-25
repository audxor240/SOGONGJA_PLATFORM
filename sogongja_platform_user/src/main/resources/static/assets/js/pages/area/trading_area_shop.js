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
    navigator.geolocation.getCurrentPosition(function (pos) {
        clientLatitude = pos.coords.latitude;
        clientLongitude = pos.coords.longitude;
        var moveLatLon = new kakao.maps.LatLng(
            clientLatitude,
            clientLongitude
        );
        map.setCenter(moveLatLon);
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

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 장소를 검색합니다
searchPlaces2();
// 주소 검색을 요청하는 함수입니다
function searchPlaces2() {
    var keyword = document.getElementById("keyword").value;
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
        // alert("주소를 입력해주세요!");
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    geocoder.addressSearch(keyword, placesSearchCB);
}

// 주소로 좌표를 검색합니다
function placesSearchCB(result, status) {
    // 정상적으로 검색이 완료됐으면
    console.log(result);
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
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", function () {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});
function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}
function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}
// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        console.log("좌표",result);
        var infoDiv1 = document.getElementById("centerAddr1");
        var infoDiv2 = document.getElementById("centerAddr2");
        var infoDiv3 = document.getElementById("centerAddr3");

        for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === "H") {
                infoDiv1.innerHTML = result[i].region_1depth_name;
                infoDiv2.innerHTML = result[i].region_2depth_name;
                infoDiv3.innerHTML = result[i].region_3depth_name;
                break;
            }
        }
    }
}

/*시도,시군구,행정동*/









/*동동이 관련*/

// 마커를 표시할 위치와 객체 배열입니다
var newPositions = [
    {
        storeName: "고향생막걸리",
        address_name: "서울특별시 강남구 신사동 615-1",
        road_address_name: "서울특별시 강남구 압구정로 216",
        largeCategory: "음식",
        mediumCategory: "유흥주점",
        smallcategory: "민속주점",
        category_large_code: "BK9",
        category_medium_code: "Q09",
        category_small_code: "Q09A04",
        x: 37.52807318,
        y: 127.0310125,
        subway: "3호선 압구정역",
        busStation: "현대아파트",
    },
    {
        storeName: "의정부부대찌개",
        address_name: "서울특별시 강남구 대치동 955-6",
        road_address_name: "서울특별시 강남구 역삼로83길 24",
        largeCategory: "음식",
        mediumCategory: "한식",
        smallcategory: "부대찌개/섞어찌개",
        category_large_code: "BK9",
        category_medium_code: "Q01",
        category_small_code: "Q01A07",
        x: 37.50508236,
        y: 127.059382,
        subway: "2호선 삼성(무역센터)",
        busStation: "대치사거리",
    },
    {
        storeName: "바른치킨",
        address_name: "서울특별시 강남구 대치동 889-72",
        road_address_name: "서울특별시 강남구 선릉로86길 17",
        largeCategory: "음식",
        mediumCategory: "닭/오리요리",
        smallcategory: "후라이드/양념치킨",
        category_large_code: "MT1",
        category_medium_code: "Q05",
        category_small_code: "Q05A08",
        x: 37.50355605,
        y: 127.0510543,
        subway: "분당선 선릉",
        busStation: "선릉역",
    },
    {
        storeName: "한성양꼬치",
        address_name: "서울특별시 강남구 역삼동 827-22",
        road_address_name: "서울특별시 강남구 강남대로78길 25",
        largeCategory: "음식",
        mediumCategory: "닭/오리요리",
        smallcategory: "꼬치구이전문점",
        category_large_code: "MT1",
        category_medium_code: "Q05",
        category_small_code: "Q05A08",
        x: 37.49542999,
        y: 127.0312535,
        subway: "신분당선 강남",
        busStation: "신분당선.강남역4번출구",
    },
    {
        storeName: "샤샤하우스",
        address_name: "서울특별시 강남구 역삼동 601-6",
        road_address_name: "서울특별시 강남구 봉은사로4길 6",
        largeCategory: "숙박",
        mediumCategory: "호텔/콘도",
        smallcategory: "호텔/콘도",
        category_large_code: "PM9",
        category_medium_code: "O01",
        category_small_code: "O01A01",
        x: 37.52373138,
        y: 127.0556408,
        subway: "9호선 신논현",
        busStation: "신논현역",
    },
    {
        storeName: "토비스콘도",
        address_name: "서울특별시 강남구 역삼동 773-3",
        road_address_name: "서울특별시 강남구 언주로 333",
        largeCategory: "숙박",
        mediumCategory: "호텔/콘도",
        smallcategory: "호텔/콘도",
        category_large_code: "PM9",
        category_medium_code: "O01",
        category_small_code: "O01A01",
        x: 37.4975672,
        y: 127.0447404,
        subway: "2호선 선릉",
        busStation: "동영문화센터",
    },
    {
        storeName: "헬로필라테스",
        address_name: "서울특별시 강남구 도곡동 552-7",
        road_address_name: "서울특별시 강남구 도곡로 148",
        largeCategory: "관광/여가/오락",
        mediumCategory: "요가/단전/마사지",
        smallcategory: "요가/단식",
        category_large_code: "OL7",
        category_medium_code: "N05",
        category_small_code: "N05A01",
        x: 37.4907137,
        y: 127.0363013,
        subway: "3호선 양재(서초구청)",
        busStation: "LPG가스충전소",
    },
    {
        storeName: "화지아트",
        address_name: "서울특별시 강남구 역삼동 832-7",
        road_address_name: "서울특별시 강남구 강남대로 320",
        largeCategory: "관광/여가/오락",
        mediumCategory: "연극/영화/극장",
        smallcategory: "연극/음악/예술관련기타",
        category_large_code: "CE7",
        category_medium_code: "N03",
        category_small_code: "N03A06",
        x: 37.49184194,
        y: 127.0310284,
        subway: "신분당선 강남",
        busStation: "역삼초등학교",
    },
    {
        storeName: "마담타이",
        address_name: "서울특별시 강남구 신사동 541-2",
        road_address_name: "서울특별시 강남구 논현로151길 55",
        largeCategory: "관광/여가/오락",
        mediumCategory: "요가/단전/마사지",
        smallcategory: "안마시술소",
        category_large_code: "CS2",
        category_medium_code: "N05",
        category_small_code: "N05A07",
        x: 37.51948856,
        y: 127.0236459,
        subway: "3호선 신사",
        busStation: "신사동고개",
    },
];

// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
    contentNode1 = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
    markersBK9 = [], // 마커를 담을 배열입니다
    markersMT1 = [], // 마커를 담을 배열입니다
    markersPM9 = [], // 마커를 담을 배열입니다
    markersOL7 = [], // 마커를 담을 배열입니다
    markersCE7 = [], // 마커를 담을 배열입니다
    markersCS2 = [], // 마커를 담을 배열입니다

    currCategory = ""; // 현재 선택된 카테고리를 가지고 있을 변수입니다

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
contentNode1.className = "placeinfo_wrap";
// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(contentNode1, "mousedown", kakao.maps.event.preventMap);
addEventHandle(contentNode1, "touchstart", kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode1);

// 각 카테고리에 클릭 이벤트를 등록합니다
//   addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent("on" + type, callback);
    }
}

// 카테고리 검색을 요청하는 함수입니다
//function searchPlaces() {
// if (!currCategory) {
//   return false;
// }
// 커스텀 오버레이를 숨깁니다
placeOverlay.setMap(null);
// 지도에 표시되고 있는 마커를 제거합니다
//removeMarker();
var categoryStore = [];
// for (var i = 0; i < newPositions.length; i++) {
//   if (currCategory == newPositions[i].category_large_code) {
//     categoryStore.push(newPositions[i]);
//   }
// }

var BK9 = document.getElementById("BK9");
var MT1 = document.getElementById("MT1");
var PM9 = document.getElementById("PM9");
var OL7 = document.getElementById("OL7");
var CE7 = document.getElementById("CE7");
var CS2 = document.getElementById("CS2");

var BK9markers = [],
    MT1markers = [],
    PM9markers = [],
    OL7markers = [],
    CE7markers = [],
    CS2markers = [];

function a() {
    var bk9 = newPositions.filter((v) => v.category_large_code == "BK9");
    var bk9_length = bk9.length;
    //console.log("은행", bk9, bk9_length);
    if (BK9.checked) {
        BK9markers.push(...bk9);
        displayBK9Places(BK9markers);
    } else {
        BK9markers.forEach((item, index) => {
            if (item.category_large_code == "BK9") {
                BK9markers.splice(index, bk9_length);
                removeBK9Marker();
            }
        });
    }
}
a();
function b() {
    var mt1 = newPositions.filter((v) => v.category_large_code == "MT1");
    var mt1_length = mt1.length;
    //console.log("마트", mt1, mt1_length);
    if (MT1.checked) {
        MT1markers.push(...mt1);
        displayMT1Places(MT1markers);
    } else {
        MT1markers.forEach((item, index) => {
            if (item.category_large_code == "MT1") {
                MT1markers.splice(index, mt1_length);
                removeMT1Marker();
            }
        });
    }
}
b();
function c() {
    var pm9 = newPositions.filter((v) => v.category_large_code == "PM9");
    var pm9_length = pm9.length;
    //console.log("약국", pm9, pm9_length);
    if (PM9.checked) {
        PM9markers.push(...pm9);
        displayPM9Places(PM9markers);
    } else {
        PM9markers.forEach((item, index) => {
            if (item.category_large_code == "PM9") {
                PM9markers.splice(index, pm9_length);
                removePM9Marker();
            }
        });
    }
}
c();
function d() {
    var ol7 = newPositions.filter((v) => v.category_large_code == "OL7");
    var ol7_length = ol7.length;
    //console.log("주유소", ol7, ol7_length);
    if (OL7.checked) {
        OL7markers.push(...ol7);
        displayOL7Places(OL7markers);
    } else {
        OL7markers.forEach((item, index) => {
            if (item.category_large_code == "OL7") {
                OL7markers.splice(index, ol7_length);
                removeOL7Marker();
            }
        });
    }
}
d();
function e() {
    var ce7 = newPositions.filter((v) => v.category_large_code == "CE7");
    var ce7_length = ce7.length;
    //console.log("카페", ce7, ce7_length);
    if (CE7.checked) {
        CE7markers.push(...ce7);
        displayCE7Places(CE7markers);
    } else {
        CE7markers.forEach((item, index) => {
            if (item.category_large_code == "CE7") {
                CE7markers.splice(index, ce7_length);
                removeCE7Marker();
            }
        });
    }
}
e();
function f() {
    var cs2 = newPositions.filter((v) => v.category_large_code == "CS2");
    var cs2_length = cs2.length;
    //console.log("편의점", cs2, cs2_length);
    if (CS2.checked) {
        CS2markers.push(...cs2);
        displayCS2Places(CS2markers);
    } else {
        CS2markers.forEach((item, index) => {
            if (item.category_large_code == "CS2") {
                CS2markers.splice(index, cs2_length);
                removeCS2Marker();
            }
        });
    }
}
f();



// ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true});
//(배열,지금cate ID)
// console.log("(은행배열)", BK9markers);
// console.log("(마트배열)", MT1markers);
// console.log("(약국배열)", PM9markers);
// console.log("(주유배열)", OL7markers);
// console.log("(까페배열)", CE7markers);
// console.log("(편의배열)", CS2markers);

//마커등록 각각 6종류 하는거임
// displayBK9Places(BK9markers);
// displayMT1Places(MT1markers);
// displayPM9Places(PM9markers);
// displayOL7Places(OL7markers);
// displayCE7Places(CE7markers);
// displayCS2Places(CS2markers);
//}

// BK9
// BK9
// BK9지도에 마커를 표출하는 함수입니다
function displayBK9Places(place) {
    //console.log("BK9place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
//console.log("마커맞주?", markersBK9);
// 지도 위에 표시되고 있는 BK9마커를 모두 제거합니다
function removeBK9Marker() {
    for (var i = 0; i < markersBK9.length; i++) {
        markersBK9[i].setMap(null);
    }
    markersBK9 = [];
}

// MT1
// MT1
// MT1지도에 마커를 표출하는 함수입니다
function displayMT1Places(place) {
    //  console.log("MT1place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
//console.log("마커맞주?", markersMT1);
// 지도 위에 표시되고 있는 MT1마커를 모두 제거합니다
function removeMT1Marker() {
    for (var i = 0; i < markersMT1.length; i++) {
        markersMT1[i].setMap(null);
    }
    markersMT1 = [];
}


// PM9
// PM9
// PM9지도에 마커를 표출하는 함수입니다
function displayPM9Places(place) {
    // console.log("PM9place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
//console.log("마커맞주?", markersPM9);
// 지도 위에 표시되고 있는 PM9마커를 모두 제거합니다
function removePM9Marker() {
    for (var i = 0; i < markersPM9.length; i++) {
        markersPM9[i].setMap(null);
    }
    markersPM9 = [];
}


// OL7
// OL7
// OL7지도에 마커를 표출하는 함수입니다
function displayOL7Places(place) {
    //  console.log("OL7place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
// console.log("마커맞주?", markersOL7);
// 지도 위에 표시되고 있는 OL7마커를 모두 제거합니다
function removeOL7Marker() {
    for (var i = 0; i < markersOL7.length; i++) {
        markersOL7[i].setMap(null);
    }
    markersOL7 = [];
}

// CE7
// CE7
// CE7지도에 마커를 표출하는 함수입니다
function displayCE7Places(place) {
    // console.log("CE7place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
// console.log("마커맞주?", markersCE7);
// 지도 위에 표시되고 있는 CE7마커를 모두 제거합니다
function removeCE7Marker() {
    for (var i = 0; i < markersCE7.length; i++) {
        markersCE7[i].setMap(null);
    }
    markersCE7 = [];
}

// CS2
// CS2
// CS2지도에 마커를 표출하는 함수입니다
function displayCS2Places(place) {
    // console.log("CS2place로 받았는데", place);
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
        // 마커에 표시할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({
            content:
                '<div class="infoWin">'+
                '<h5 style="font-size:16px;">'+
                place[i].storeName +
                '</h5>'  +
                '<div class="info_text">'+
                '<div class="storegray iconPlus" style="font-size:16px;">'+
                place[i].address_name +
                '</div>'  +
                '</div>'  +
                ')</div>' // 인포윈도우에 표시할 내용
        });
        infoBBB(map, marker, infowindow);
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
// console.log("마커맞주?", markersCS2);
// 지도 위에 표시되고 있는 CS2마커를 모두 제거합니다
function removeCS2Marker() {
    for (var i = 0; i < markersCS2.length; i++) {
        markersCS2[i].setMap(null);
    }
    markersCS2 = [];
}



// 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
// 이벤트 리스너로는 클로저를 만들어 등록합니다
// for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다

function infoBBB(map, marker, infowindow) {
    kakao.maps.event.addListener(
        marker,
        "mouseover",
        makeOverListener(map, marker, infowindow)
    );
    kakao.maps.event.addListener(
        marker,
        "mouseout",
        makeOutListener(infowindow)
    );
}
// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

// function searchDetailAddrFromCoords(coords, callback) {
//   // 좌표로 법정동 상세 주소 정보를 요청합니다
//   geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
// }


// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
    // console.log("place인포박스받아야함", place);

    // var content1 =
    //     '<div class="placeinfo">' +
    //     '   <p class="title" >' +
    //     place.storeName +
    //     "</p>"+
    //     '<div class="close" onclick="closeOverlay()" title="닫기">x</div>';
    // content1 +=
    //     '    <span title="' +
    //     place.road_address_name +
    //     '">' +
    //     place.road_address_name +
    //     "</span>" +
    //     '  <span class="jibun" title="' +
    //     place.address_name +
    //     '">(지번 : ' +
    //     place.address_name +
    //     ")</span>";
    //
    // content1 +=
    //     "</div>" +
    //     '<div class="after"></div>';
    // contentNode1.innerHTML = content1;

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
    placeOverlay.setPosition(new kakao.maps.LatLng(place.x, place.y));
    placeOverlay.setMap(map);
}

function closeOverlay() {
    placeOverlay.setMap(null);
    document.getElementById("sidebar").style.display = "none";
}