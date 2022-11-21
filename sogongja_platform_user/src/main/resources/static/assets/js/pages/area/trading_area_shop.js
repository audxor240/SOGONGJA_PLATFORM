//기본 위치는 서울시청 좌표
var clientLatitude = 37.506280990844225;
var clientLongitude = 127.04042161585487;
// 맵 기본 레벨
var mapDefaultLevel = 3;
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

function resizeMap() {//지도 리사이즈 함수
    var mapContainer = document.getElementById('map');
    mapContainer.style.width = window.innerWidth;//window.innerWidth : 브라우저 화면의 너비(viewport)
    mapContainer.style.height = window.innerHeight;//window.innerHeight : 브라우저 화면의 높이(viewport)
    map.relayout();//화면사이즈 재렌더링
}


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
    let fiddong = sidoList.map((el, index, arr) => arr.find(isdongTrue)
        ? ({ ...el, dong: el.name.split(" ", 4)[2] + " " + el.name.split(" ", 4)[3] })
        : ({ ...el, dong: el.name.split(" ", 4)[2] })
    );
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

//시군구행정동 카테고리를 클릭했을 때 호출되는 함수입니다
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

//시군구 선택박스 닫기 열기
var sidoBox = document.getElementById('sidoBox');
var sigunguBox = document.getElementById('sigunguBox');
var dongBox = document.getElementById('dongBox');

function changeSelectBox(type) {
    // 시도 카테고리가 클릭됐을 때
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

mapContainer.addEventListener("click", e => {
    sidoBox.className = '';
    sigunguBox.className = '';
    dongBox.className = '';
})





/*동동이 관련*/
/*동동이 관련*/
/*동동이 관련*/
var areaJson = /*[[${areaJson}]]*/ [];
var researchShop = /*[[${researchShop}]]*/ [];

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
            //console.log('result : ', result);
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

// 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
var lat = map.getCenter().getLat(),
    lng = map.getCenter().getLng(),
    zoom = map.getLevel(),
    x2 = map.getBounds().getNorthEast().getLat(),
    y2 = map.getBounds().getNorthEast().getLng(),
    x1 = map.getBounds().getSouthWest().getLat(),
    y1 = map.getBounds().getSouthWest().getLng();
var codeType1 = new Array();
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

    var datalat = {
        lat,
        lng,
        zoom,
        x1,
        x2,
        y1,
        y2,
        codeType1
    }
    console.log("data재요청입니다!", datalat);
    ajaxPostSyn('/trading-area/shop/details', datalat, function (result) {
        console.log("이게 상점데이터 갖고오는거임", result)
        // if (result.result_code === 200) {
        // } else {
        //     alert("2222")
        // return false;
        // }
        if (zoom >= 4 && zoom <= 14) {
            //10<level<14 일때, 시도 카운트 마커로 찍어주기
            // 마커+사이드바 를 닫아요
            placeOverlay.setMap(null);
            document.getElementById("sidebar").style.display = "none";
            setMarkers(null)//마커들을 싹 비워
            if(result.length>0) {
                resultSpread(result)//그리고 다시찍어
            }
        } else {
            //level < 4, 지도 확대가 3,2,1 일때 상점 마커들 찍어주기
            setMarkers(null)//마커를비우고
            if(result.length>0) {
                storeSpread(result)//다시찍어
            }
        }
    });
};

function storeSpread(thing) {
    var imageSrc = "", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        QimageSrc = "/images/new/area/marker01.png",
        NimageSrc = "/images/new/area/marker02.png",
        LimageSrc = "/images/new/area/marker03.png",
        FimageSrc = "/images/new/area/marker04.png",
        DimageSrc = "/images/new/area/marker05.png",
        OimageSrc = "/images/new/area/marker06.png",
        PimageSrc = "/images/new/area/marker07.png",
        RimageSrc = "/images/new/area/marker08.png" ;
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
               var imageSrc =PimageSrc
           } else if (thing[i].code_type1 == "R") {
               var imageSrc =RimageSrc
           } else {
               var imageSrc ="/images/new/area/marker01.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
           }
        // 지도에 마커를 생성합니다
        var marker = addMarker(thing, i, imageSrc);//위치,이미지를 마커에 등록
        displayPlaces(marker, thing, i)//호버,클릭,사이드바 함수 등록
        markers.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        marker.setMap(map);  // 마커가 지도 위에 표시되도록 설정합니다
    }
}

//시도,행정동 카운트를 표시하는 마커
function resultSpread(thing) {
    thing.forEach((loco) => {
        geocoder.addressSearch(loco.name, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                // 결과값으로 받은 위치를 마커로 표시합니다
                var content = '<div class ="countlabel"><div class="countsidobox">' +
                    '<div class="center">' +
                    loco.name +
                    '</div><div class="right">' +
                    loco.count +
                    '</div></div></div>';
                var marker = addlocoMarker(coords, content)
            }
        });
    })
}

// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

// 시도,행정동 카운트용 커스텀마커를 생성하고 지도위에 표시하는 함수입니다
function addlocoMarker(position, content) {
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

function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({zIndex: 1}),
    placeOverlay2 = new kakao.maps.CustomOverlay({zIndex: 1}),
    contentNode1 = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
    contentNode2 = document.createElement("div"), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다

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
placeOverlay.setMap(null);//클릭 시 마커+사이드바
placeOverlay2.setMap(null);//호버 시 마커만

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(place, i, imageSrc) {
    //if mapsize width 모바일일때 마커 크기 20으로
    if(window.innerWidth < 767){
        var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude),
            imageSize = new kakao.maps.Size(20, 20), // 마커 이미지의 크기
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
            });
}else {
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

function displayPlaces(marker, place, i) {
    var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude);
    // var datatrans = { shopSeq : place[i].shopSeq }
    // console.log("trans데이터", datatrans)
    // 마커와 검색결과 항목을 클릭 했을 때
    // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
    (function sdf(marker, place) {
        //클릭 시 마커+사이드바 보이고, 지도중심으로 이동
        kakao.maps.event.addListener(marker, "click", function () {
            displayPlaceInfo(place);
            panTo(position)
        });
        //호버 시 마커만 보임
        kakao.maps.event.addListener(marker, "mouseover", function () {
            displayPlaceInfoHover(place);
        });
        kakao.maps.event.addListener(marker, "mouseout", function () {
            placeOverlay2.setMap(null);
        });
    })(marker, place[i]);
}
function panTo(position) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = position;

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}
// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
    customInfo(place);//클릭 시 마커
    sideInfo(place);//사이드바
    placeOverlay.setPosition(new kakao.maps.LatLng(place.latitude, place.longitude));
    placeOverlay.setMap(map);
}

// 호버한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfoHover(place) {
    customInfo2(place);//호버시 마커
    placeOverlay2.setPosition(new kakao.maps.LatLng(place.latitude, place.longitude));
    placeOverlay2.setMap(map);
}

function content111(place) {//마커 호버 or 클릭 시 표시될 정보 도로명주소,상점명
    var content =
        '<div class="placeinfo">' +
        '   <p class="title" >' +
        place.shop_nm +
        "</p>" +
        '<div class="close" onclick="closeOverlay()" title="닫기"></div>';
        content +=
        '    <span title="' +
        place.addr +
        '">' +
        place.addr +
        "</span>" +
        '  <span class="jibun" title="' +
        place.st_addr +
        '">(지번 : ' +
        place.st_addr +
        ")</span>";

    content +=
        "</div>" +
        '<div class="after"></div>';
    return content
}

//클릭 커스텀속에 정보 내려줌
function customInfo(place) {
    var content1 = content111(place);
    contentNode1.innerHTML = content1;
}

//호버 커스텀속에 정보 내려줌
function customInfo2(place) {
    var content1 = content111(place);
    contentNode2.innerHTML = content1;
}

//사이드바 인포
function sideInfo(place) {
    var datatrans = { shopSeq : place.shop_seq }
    console.log("trans데이터", datatrans,place.shop_seq )
    ajaxPostSyn('/trading-area/shop/pubTrans', datatrans, function (resultsubway) {
        console.log("이게trans데이터 갖고오는거임", resultsubway)
    })
    //거리계산함수
//     var polyline=new kakao.maps.Polyline({
//         /* map:map, */
//         path : [
//             new kakao.maps.LatLng(mlon,mlat),//상점위치
//             new kakao.maps.LatLng(vlon,vlat)//지하철,버스 역 위치
//         ],
//         strokeWeight: 2,
//         strokeColor: '#FF00FF',
//         strokeOpacity: 0.8,
//         strokeStyle: 'dashed'
//     });
// //return getTimeHTML(polyline.getLength());//미터단위로 길이 반환;
//     console.log("길이"+polyline.getLength());

    if (place) {
        document.getElementById("sidebar").style.display = "block";
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody">' +
            '<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>'+
            '<div class="sideinfo">' +
                '<h4 class="sideinfoTitle">상점 정보</h4>' +
                '<div class="location iconPlus">' +
                place.addr +
                '</div>' +
                '<div class="storegray iconPlus">' +
                place.shop_nm +
                '</div>' +
            "</div>" +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">업종 정보</h4>' +
            '<div class="listCtegory">' +
            '<span class="lCategory">' +
            place.nm_type1 +
            '</span>' +
            '<span class="lCategory">' +
            place.nm_type2 +
            '</span>' +
            '<span class="mCategory">' +
            place.nm_type3 +
            '</span>' +
            '</div>' +
            "</div>" +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">주변 정보</h4>' +
            '<div class="subway iconPlus">지하철역' +
            '<span class="position_name">' +
            place.sub_sta_nm +
            '</span>' +
            '<span class="distance">거리</span>' +
            '</div>' +
            '<div class="bus iconPlus">버스' +
            '<span class="position_name">' +
            place.bus_sta_nm +
            '</span>' +
            '<span class="distance">거리</span>' +
            '</div>' +
            "</div>" +

            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">최근 이슈</h4>' +
            '<div class="issue">' +
            '<span>로그인이 필요합니다.</span>' +
            '<a>로그인/회원가입 하러가기</a>' +
            '</div>' +
            "</div>" +

            '<button class="analysisBtn">상권활성화 예측지수</button>' +
            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>'+
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
    }
}

//오버레이닫음
function closeOverlay() {
    placeOverlay.setMap(null);
    document.getElementById("sidebar").style.display = "none";
}
//사이드바 숨기기
function sideNoneVisible() {
    document.getElementById("sidebody").style.display = "none";
    $('#sidebar').addClass('on');
}
//사이드바 보이기
function sideVisible() {
    document.getElementById("sidebody").style.display = "block";
    $('#sidebar').removeClass('on');
}

$('.community_Btn').click(function () {
    $('.community_pop_wrap').toggleClass('on');
});

$('.community_main_li').click(function () {
    $(this).children('.detail_community').addClass('on');
});
$('.backbtn').click(function () {
    $('.detail_community').removeClass('on');
});

$('.addresswidth').click(function (){
    $('.searchInput').toggleClass('on');
})

