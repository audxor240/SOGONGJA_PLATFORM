//기본 위치는 서울시청 좌표
var clientLatitude = 37.5668260055;
var clientLongitude = 126.9786567859;
// 맵 기본 레벨
var mapDefaultLevel = 4;
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표 기본 위치는 서울시청
        level: mapDefaultLevel // 지도의 확대 레벨
    };

if (navigator.geolocation) {
    // 현재 접속 사용자 위치 정보
    navigator.geolocation.getCurrentPosition(function (pos) {
        clientLatitude = pos.coords.latitude;
        clientLongitude = pos.coords.longitude;
        var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
        map.setCenter(moveLatLon);
    });
}
//현위치 설정
function setCenter() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
    map.setLevel(mapDefaultLevel)
}

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 장소를 검색합니다
//searchPlaces();
// 주소 검색을 요청하는 함수입니다
function searchPlaces() {
    var keyword = document.getElementById('keyword').value;
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('주소를 입력해주세요!');
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    geocoder.addressSearch(keyword, placesSearchCB);
}

// 주소로 좌표를 검색합니다
function placesSearchCB(result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
        console.log(result);
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    }
    else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
};

// 현재 지도 중심좌표로 주소를 검색해서 지도 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);


// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', function () {
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

        var infoDiv1 = document.getElementById('centerAddr1');
        var infoDiv2 = document.getElementById('centerAddr2');
        var infoDiv3 = document.getElementById('centerAddr3');

        for (var i = 0; i < result.length; i++) {
            // 행정동의 region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv1.innerHTML = result[i].region_1depth_name;
                infoDiv2.innerHTML = result[i].region_2depth_name;
                infoDiv3.innerHTML = result[i].region_3depth_name;
                break;
            }
        }
    }
}

/*동동이 관련*/
// 음식 마커가 표시될 좌표 배열입니다
var coffeePositions = [
    {
        storeName: '고향생막걸리',
        largeCategory: '음식',
        mediumCategory: '유흥주점',
        smallcategory: '민속주점',
        latlng: new kakao.maps.LatLng(37.52807318, 127.0310125),
        subway: '3호선 압구정역',
        busStation: '현대아파트',
    },
    {
        storeName: '의정부부대찌개',
        largeCategory: '음식',
        mediumCategory: '한식',
        smallcategory: '부대찌개/섞어찌개',
        latlng: new kakao.maps.LatLng(37.50508236, 127.059382),
        subway: '2호선 삼성(무역센터)',
        busStation: '대치사거리',
    },
    {
        storeName: '바른치킨',
        largeCategory: '음식',
        mediumCategory: '닭/오리요리',
        smallcategory: '후라이드/양념치킨',
        latlng: new kakao.maps.LatLng(37.50355605, 127.0510543),
        subway: '분당선 선릉',
        busStation: '선릉역',
    },
];

// 숙박 마커가 표시될 좌표 배열입니다
var storePositions = [
    {
        storeName: '지엠에프서울파크',
        largeCategory: '숙박',
        mediumCategory: '모텔/여관/여인숙',
        smallcategory: '모텔/여관/여인숙',
        latlng: new kakao.maps.LatLng(37.49184194, 127.0310284),
        subway: '신분당선 강남',
        busStation: '역삼초등학교',
    },
    {
        storeName: '알로프트호텔서울강남',
        largeCategory: '숙박',
        mediumCategory: '호텔/콘도',
        smallcategory: '호텔/콘도',
        latlng: new kakao.maps.LatLng(37.52373138, 127.0556408),
        subway: '7호선 청담',
        busStation: '영동교입구.청담자이아파트',
    },
    {
        storeName: '토비스콘도',
        largeCategory: '숙박',
        mediumCategory: '호텔/콘도',
        smallcategory: '호텔/콘도',
        latlng: new kakao.maps.LatLng(37.4975672, 127.0447404),
        subway: '2호선 선릉',
        busStation: '동영문화센터',
    },
];

// 관광/여가/오락 마커가 표시될 좌표 배열입니다
var carparkPositions = [
    {
        storeName: '헬로필라테스',
        largeCategory: '관광/여가/오락',
        mediumCategory: '요가/단전/마사지',
        smallcategory: '요가/단식',
        latlng: new kakao.maps.LatLng(37.4907137, 127.0363013),
        subway: '3호선 양재(서초구청)',
        busStation: 'LPG가스충전소',
    },
    {
        storeName: '화지아트',
        largeCategory: '관광/여가/오락',
        mediumCategory: '연극/영화/극장',
        smallcategory: '연극/음악/예술관련기타',
        latlng: new kakao.maps.LatLng(37.49184194, 127.0310284),
        subway: '신분당선 강남',
        busStation: '역삼초등학교',
    },
    {
        storeName: '마담타이',
        largeCategory: '요가/단전/마사지',
        mediumCategory: '연극/영화/극장',
        smallcategory: '안마시술소',
        latlng: new kakao.maps.LatLng(37.51948856, 127.0236459),
        subway: '3호선 신사',
        busStation: '신사동고개',
    },
];

// // 커피숍 마커가 표시될 좌표 배열입니다
// var coffeePositions = [
//     new kakao.maps.LatLng(37.499590490909185, 127.0263723554437),
//     new kakao.maps.LatLng(37.499427948430814, 127.02794423197847),
//     new kakao.maps.LatLng(37.498553760499505, 127.02882598822454),
//     new kakao.maps.LatLng(37.497625593121384, 127.02935713582038),
//     new kakao.maps.LatLng(37.49646391248451, 127.02675574250912),
//     new kakao.maps.LatLng(37.49629291770947, 127.02587362608637),
//     new kakao.maps.LatLng(37.49754540521486, 127.02546694890695)
// ];

// // 편의점 마커가 표시될 좌표 배열입니다
// var storePositions = [
//     new kakao.maps.LatLng(37.497535461505684, 127.02948149502778),
//     new kakao.maps.LatLng(37.49671536281186, 127.03020491448352),
//     new kakao.maps.LatLng(37.496201943633714, 127.02959405469642),
//     new kakao.maps.LatLng(37.49640072567703, 127.02726459882308),
//     new kakao.maps.LatLng(37.49640098874988, 127.02609983175294),
//     new kakao.maps.LatLng(37.49932849491523, 127.02935780247945),
//     new kakao.maps.LatLng(37.49996818951873, 127.02943721562295)
// ];

// // 주차장 마커가 표시될 좌표 배열입니다
// var carparkPositions = [
//     new kakao.maps.LatLng(37.49966168796031, 127.03007039430118),
//     new kakao.maps.LatLng(37.499463762912974, 127.0288828824399),
//     new kakao.maps.LatLng(37.49896834100913, 127.02833986892401),
//     new kakao.maps.LatLng(37.49893267508434, 127.02673400572665),
//     new kakao.maps.LatLng(37.49872543597439, 127.02676785815386),
//     new kakao.maps.LatLng(37.49813096097184, 127.02591949495914),
//     new kakao.maps.LatLng(37.497680616783086, 127.02518427952202)
// ];

var markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/category.png';  // 마커이미지의 주소입니다. 스프라이트 이미지 입니다
coffeeMarkers = [], // 커피숍 마커 객체를 가지고 있을 배열입니다
    storeMarkers = [], // 편의점 마커 객체를 가지고 있을 배열입니다
    carparkMarkers = []; // 주차장 마커 객체를 가지고 있을 배열입니다


createCoffeeMarkers(); // 커피숍 마커를 생성하고 커피숍 마커 배열에 추가합니다
createStoreMarkers(); // 편의점 마커를 생성하고 편의점 마커 배열에 추가합니다
createCarparkMarkers(); // 주차장 마커를 생성하고 주차장 마커 배열에 추가합니다

changeMarker('coffee'); // 지도에 커피숍 마커가 보이도록 설정합니다


// 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
function createMarkerImage(src, size, options) {
    var markerImage = new kakao.maps.MarkerImage(src, size, options);
    return markerImage;
}

// 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
function createMarker(position, image) {
    var marker = new kakao.maps.Marker({
        position: position,
        image: image
    });

    return marker;
}
//     // 마커에 표시할 인포윈도우를 생성합니다
//    function createInfoWindow(content){
//     var infowindow = new kakao.maps.InfoWindow({
//         content: content // 인포윈도우에 표시할 내용
//     });
//     return infowindow;
// }

// 커피숍 마커를 생성하고 커피숍 마커 배열에 추가하는 함수입니다
function createCoffeeMarkers() {

    for (var i = 0; i < coffeePositions.length; i++) {
        console.log('dd', coffeePositions)
        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {
                spriteOrigin: new kakao.maps.Point(10, 0),
                spriteSize: new kakao.maps.Size(36, 98)
            };

        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),
            marker = createMarker(coffeePositions[i].latlng, markerImage);
        // infowindow=createInfoWindow(coffeePositions[i].content)

        // 생성된 마커를 커피숍 마커 배열에 추가합니다
        coffeeMarkers.push(marker);
    }
}

// 커피숍 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCoffeeMarkers(map) {
    for (var i = 0; i < coffeeMarkers.length; i++) {
        coffeeMarkers[i].setMap(map);
    }
}

// 편의점 마커를 생성하고 편의점 마커 배열에 추가하는 함수입니다
function createStoreMarkers() {
    for (var i = 0; i < storePositions.length; i++) {
        //console.log('이건아니지', storePositions)
        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {
                spriteOrigin: new kakao.maps.Point(10, 36),
                spriteSize: new kakao.maps.Size(36, 98)
            };

        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),
            marker = createMarker(storePositions[i].latlng, markerImage);

        // 생성된 마커를 편의점 마커 배열에 추가합니다
        storeMarkers.push(marker);
    }
}

// 편의점 마커들의 지도 표시 여부를 설정하는 함수입니다
function setStoreMarkers(map) {
    for (var i = 0; i < storeMarkers.length; i++) {
        storeMarkers[i].setMap(map);
    }
}

// 주차장 마커를 생성하고 주차장 마커 배열에 추가하는 함수입니다
function createCarparkMarkers() {
    for (var i = 0; i < carparkPositions.length; i++) {

        var imageSize = new kakao.maps.Size(22, 26),
            imageOptions = {
                spriteOrigin: new kakao.maps.Point(10, 72),
                spriteSize: new kakao.maps.Size(36, 98)
            };

        // 마커이미지와 마커를 생성합니다
        var markerImage = createMarkerImage(markerImageSrc, imageSize, imageOptions),
            marker = createMarker(carparkPositions[i].latlng, markerImage);

        // 생성된 마커를 주차장 마커 배열에 추가합니다
        carparkMarkers.push(marker);
    }
}

// 주차장 마커들의 지도 표시 여부를 설정하는 함수입니다
function setCarparkMarkers(map) {
    for (var i = 0; i < carparkMarkers.length; i++) {
        carparkMarkers[i].setMap(map);
    }
}

// 카테고리를 클릭했을 때 type에 따라 카테고리의 스타일과 지도에 표시되는 마커를 변경합니다
function changeMarker(type){

    var coffeeMenu = document.getElementById('coffeeMenu');
    var storeMenu = document.getElementById('storeMenu');
    var carparkMenu = document.getElementById('carparkMenu');

    // 커피숍 카테고리가 클릭됐을 때
    if (type === 'coffee') {

        // 커피숍 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = 'menu_selected';

        // 편의점과 주차장 카테고리는 선택되지 않은 스타일로 바꿉니다
        storeMenu.className = '';
        carparkMenu.className = '';

        // 커피숍 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(map);
        setStoreMarkers(null);
        setCarparkMarkers(null);

    } else if (type === 'store') { // 편의점 카테고리가 클릭됐을 때

        // 편의점 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = '';
        storeMenu.className = 'menu_selected';
        carparkMenu.className = '';

        // 편의점 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(null);
        setStoreMarkers(map);
        setCarparkMarkers(null);

    } else if (type === 'carpark') { // 주차장 카테고리가 클릭됐을 때

        // 주차장 카테고리를 선택된 스타일로 변경하고
        coffeeMenu.className = '';
        storeMenu.className = '';
        carparkMenu.className = 'menu_selected';

        // 주차장 마커들만 지도에 표시하도록 설정합니다
        setCoffeeMarkers(null);
        setStoreMarkers(null);
        setCarparkMarkers(map);
    }
}