

//기본 위치는 서울시청 좌표
var clientLatitude = 37.506280990844225;
var clientLongitude = 127.04042161585487;
// 맵 기본 레벨
var mapDefaultLevel = 13;
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






var Qmarkers = [],
    Nmarkers = [],
    Lmarkers = [],
    Fmarkers = [],
    Dmarkers = [],
    Omarkers = [],
    Pmarkers = [],
    Rmarkers = [];

var areaJson = /*[[${areaJson}]]*/ [];
var researchShop = /*[[${researchShop}]]*/ [];

//ajax 요청하는 함수
function ajaxPostSyn(url, data, callback, showLoading) {
    // IE 기본값세팅
    showLoading = typeof showLoading !== 'undefined' ? showLoading : true;
    $.ajax({
        async:false,
        url: contextPath + url,
        data: JSON.stringify(data),
        method: "POST",
        success: function(result) {
            console.log('result : ', result);
            if (callback) {
                callback(result);
            }
        },
        beforeSend: function() {
            if (showLoading) {
                $('.wrap-loading').removeClass('display-none');
            }
        },
        complete: function() {
            if (showLoading) {
                $('.wrap-loading').addClass('display-none');
            }
        },
        error: function(xhr, status, error) {
            console.error('error : ', error);
        }
    });
}

// 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
var level = map.getLevel();// 지도의 현재 레벨을 얻어옵니다
var latlng = map.getCenter(); // 지도 중심좌표를 얻어옵니다
var message ='지도 레벨은 ' + level + ' 이고' + '변경된 지도 중심좌표는 ' + latlng.getLat() + ' 이고, ';
message += '경도는 ' + latlng.getLng() + ' 입니다';
console.log(message);

var lat = map.getCenter().getLat(),
    lng = map.getCenter().getLng(),
    zoom = map.getLevel(),
    x2=map.getBounds().getNorthEast().getLat(),
    y2=map.getBounds().getNorthEast().getLng(),
    x1=map.getBounds().getSouthWest().getLat(),
    y1=map.getBounds().getSouthWest().getLng();

var codeType1 = new Array();
//첫화면 처음에 카테고리 체크되어 있는 그대로 어레이 생성함 8개 다 들어감
$("input[name=cate]").prop("checked", true).each(function(index, item){
    codeType1.push($(item).val());
});
console.log( "체크 카테고리",codeType1 )

//재체크 및 해제체크 카테고리 배열 재반영 함수입니다. 현재 선택된 카테고리만 반영될겁니다.
$("input[name=cate]").click(function () {
    if ($(this).prop('checked')) {
        console.log($(this).val())
        if (!(codeType1.includes($(this).val()))) {//arr에 없으면 재체크니까 추가해
            codeType1.push($(this).val());
        }
        console.log("재체크 카테고리", codeType1);
    } else {
        console.log($(this))
        codeType1.forEach((item, index) => {
            if (item == $(this).val()) {
                codeType1.splice(index, 1);
            }
        })
        console.log("해제체크 카테고리", codeType1);
    }
})

var datalat={
    lat,
    lng,
    zoom,
    x1,
    x2,
    y1,
    y2,
    codeType1,
}
console.log("첫 data이겁니다!!", datalat);

// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'center_changed', changeMap);

function changeMap() {
    var lat = map.getCenter().getLat(),
        lng = map.getCenter().getLng(),
        zoom = map.getLevel(),
        x2=map.getBounds().getNorthEast().getLat(),
        y2=map.getBounds().getNorthEast().getLng(),
        x1=map.getBounds().getSouthWest().getLat(),
        y1=map.getBounds().getSouthWest().getLng();

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
        // console.log('result : ', result);
        console.log("이게 데이터 갖고오는거임", result)

        // if (result.result_code === 200) {
        //     console.log(result)
        // } else {
        //     alert("2222")
        // return false;
        // }


    if (zoom >= 10 && zoom <= 14) {
        //10<level<14 일때, 시도 카운트 마커로 찍어주기
        console.log("10<level<14 일때, 시도 카운트 마커로 찍어주기")
        //각 체크사항8가지 넣어야함
        geocoder.addressSearch(`${result.name}`, function(addressResult, status) {

            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {

                var coords = new kakao.maps.LatLng(addressResult[0].y, addressResult[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

            }
        });
    }
    else if (zoom >= 7 && zoom <= 9) {
        //7<level<9 일때, 시군구 카운트 마커로 찍기
        console.log("//7<level<9 일때, 시군구 카운트 마커로 찍기")
        //각 체크사항8가지 넣어야함
    }
    else if (zoom >= 4 && zoom <= 7) {
        //4<level<7 일때, 행정동 카운트 마커로 찍기
        console.log("//4<level<7 일때, 행정동 카운트 마커로 찍기")
        //각 체크사항8가지 넣어야함

        //상점 마커들 먼저 지워주기
        // Qmarkers.forEach((va) => {
        //     va.setMap(null);
        // })
        // Nmarkers.forEach((va) => {
        //     va.setMap(null);
        // })

        var Qmarkers = [],
            Nmarkers = [],
            Lmarkers = [],
            Fmarkers = [],
            Dmarkers = [],
            Omarkers = [],
            Pmarkers = [],
            Rmarkers = [];

    }else {
        //level < 4, 지도 확대가 3,2,1 일때 상점 마커들 찍어주기
        console.log("//level < 4, 지도 확대가 3,2,1 일때 상점 마커들 찍어주기")
    }


        });
};



// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
    placeOverlay2 = new kakao.maps.CustomOverlay({ zIndex: 1 }),
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
placeOverlay.setMap(null);

var Q = document.getElementById("Q");
var N = document.getElementById("N");
var L = document.getElementById("L");
var F = document.getElementById("F");
var D = document.getElementById("D");
var O = document.getElementById("O");
var P = document.getElementById("P");
var R = document.getElementById("R");


//선택박스 체크시 각 카테고리의 마커 배열에 추가하는 함수 6개
//배열을 6개로 안나누고는 특정마커 제거가 안되서 배열자체를 6개로 나눴음
function a() {
    var bbb = newPositions.filter((v) => v.category_large_code == "Q");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker01.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = Q,
        cateMarker = Qmarkers;
    if (cateName.checked) {

        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else {
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function b() {
    var bbb = newPositions.filter((v) => v.category_large_code == "N");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker02.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = N,
        cateMarker = Nmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else {
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function c() {
    var bbb = newPositions.filter((v) => v.category_large_code == "L");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker03.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = L,
        cateMarker = Lmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else {
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function d() {
    var bbb = newPositions.filter((v) => v.category_large_code == "F");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker04.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = F,
        cateMarker = Fmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else {
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function e() {
    var bbb = newPositions.filter((v) => v.category_large_code == "D");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker05.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = D,
        cateMarker = Dmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else { // 체크 아니면 마커 지우기
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function f() {
    var bbb = newPositions.filter((v) => v.category_large_code == "O");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker06.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = O,
        cateMarker = Omarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else { // 체크 아니면 마커 지우기
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function g() {
    var bbb = newPositions.filter((v) => v.category_large_code == "P");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker07.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = P,
        cateMarker = Pmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else { // 체크 아니면 마커 지우기
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}

function h() {
    var bbb = newPositions.filter((v) => v.category_large_code == "R");//카테고리 대분류 필터
    var imageSrc =
        "/images/new/area/marker08.png"; // 마커 이미지 url, 스프라이트 이미지를 씁니다
    var cateName = R,
        cateMarker = Rmarkers;
    if (cateName.checked) {
        for (var i = 0; i < bbb.length; i++) {
            // 지도에 마커를 생성합니다
            var marker = addMarker(bbb, i, imageSrc)//위치,이미지를 마커에 등록
            displayPlaces(marker, bbb, i)//호버,클릭,사이드바 함수 등록
            cateMarker.push(marker);//지정 마커들을 해당 배열에 등록합니다.
            marker.setMap(map);
        }
    } else { // 체크 아니면 마커 지우기
        cateMarker.forEach((va) => {
            va.setMap(null);
        })
        cateMarker = [];//해당 마커 배열을 제거합니다.
    }
}


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
    var content =
        '<div class="placeinfo">' +
        '   <p class="title" >' +
        place.storeName +
        "</p>"+
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

//오버레이닫음
function closeOverlay() {
    placeOverlay.setMap(null);
    document.getElementById("sidebar").style.display = "none";
}

$('.community_Btn').click(function() {
    $('.community_pop_wrap').toggleClass('on');
});

