//상점
//1주소창, 2시도+시군구+읍면동선택창, 3+-현위치버튼, 4모바일리사이즈, 5상점마커

// 상점 맵 기본 레벨
var mapDefaultLevel = 3;

//기본 위치는 강남구 좌표
var clientLatitude = 37.50936634322016;
var clientLongitude = 127.04210852530369;
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

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

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

// 좌표로 행정동 주소 정보를 요청합니다
async function searchAddrFromCoords(coords, callback) {
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
            "type": "shop",
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

// 이동할 위도 경도 위치를 생성합니다
function panTo(position) {
    var moveLatLon = position;
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}

//상점공통마커
// 첫접속 시 현좌표 위경도, 줌레벨, x1,x2, y1,y2 값 담기 data 설정
// var lat = map.getCenter().getLat(),
//     lng = map.getCenter().getLng(),
//     zoom = map.getLevel(),
//     x2 = map.getBounds().getNorthEast().getLat(),
//     y2 = map.getBounds().getNorthEast().getLng(),
//     x1 = map.getBounds().getSouthWest().getLat(),
//     y1 = map.getBounds().getSouthWest().getLng();
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


/*동동이 관련*/
/*동동이 관련*/
/*동동이 관련*/
// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

//첫접속시 상점 로드함
storeSpread(researchShop) // 그리고 다시 찍어

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
        if (zoom >= 4 && zoom <= 14) {
            // 마커+사이드바 를 닫아요
            placeOverlay.setMap(null);
            $('#sidebar').removeClass('visible');
            //document.getElementById("sidebar").style.display = "none";
            setMarkers(null)//마커들을 싹 비워
            if (result.length > 0) {
                resultSpread(result)//그리고 다시찍어
            }
        } else {
            //level < 4, 지도 확대가 3,2,1 일때 상점 마커들 찍어주기
            setMarkers(null)//마커를비우고
            if (result.length > 0) {
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
        displayPlaces(marker,thing, i)//마커와 검색결과 항목을 클릭호버이벤트
        markers.push(marker);//지정 마커들을 해당 배열에 등록합니다.
        marker.setMap(map);  // 마커가 지도 위에 표시되도록 설정합니다
    }
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(place, i, imageSrc) {
    //if mapsize width 모바일일때 마커 크기 20으로
    if (window.innerWidth < 767) {
        var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude),
            imageSize = new kakao.maps.Size(20, 20), // 마커 이미지의 크기
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
            marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
            });
    } else {
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

//마커다시그림
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//시도,행정동 카운트를 표시하는 마커
function resultSpread(thing) {
    if(thing.code=="11620685"){
        thing.name=="신사동"
    }else if(thing.code=="1168011200"){
        thing.name=="자곡동"
    }else if(thing.code=="11680521"){
        thing.name=="율현동"
    }else if(thing.code=="11680545"){
        thing.name=="압구정동"
    }else if(thing.code=="11680565"){
        thing.name=="청담동"
    }else if(thing.code=="11680580"){
        thing.name=="삼성1동"
    }else if(thing.code=="11680600"){
        thing.name=="대치1동"
    }else if(thing.code=="11680640"){
        thing.name=="역삼1동"
    }else if(thing.code=="11680655"){
        thing.name=="도곡1동"
    }else if(thing.code=="11680660"){
        thing.name=="개포1동"
    }else if(thing.code=="11680700"){
        thing.name=="세곡동"
    }else if(thing.code=="11680545"){
        thing.name=="일원1동"
    }else if(thing.code=="11680545"){
        thing.name=="수서동"
    }else{
        thing.name=="서울시"
    }

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

//마커오버레이 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent("on" + type, callback);
    }
}

// 커스텀 오버레이를 숨깁니다
placeOverlay.setMap(null);//클릭 시 보여줄 마커인포+사이드바
placeOverlay2.setMap(null);//호버 시 보여줄 마커인포

function displayPlaces(marker, place, i) {
    var position = new kakao.maps.LatLng(place[i].latitude, place[i].longitude);
    // 마커와 검색결과 항목을 클릭 했을 때 장소정보를 표출하도록 클릭 이벤트를 등록합니다
    (function sdf(marker, place) {
        //클릭 시 마커인포+사이드바 보이고, 지도중심으로 이동
        kakao.maps.event.addListener(marker, "click", function () {
            displayPlaceInfo(place);
            panTo(position)
        });
        //호버 시 마커인포만 보임
        kakao.maps.event.addListener(marker, "mouseover", function () {
            displayPlaceInfoHover(place);
        });
        //마우스 나가면 마커인포사라짐
        kakao.maps.event.addListener(marker, "mouseout", function () {
            placeOverlay2.setMap(null);
        });
    })(marker, place[i]);
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo(place) {
    customInfo(place);//클릭 시 마커인포
    sideInfo(place);//사이드바
    $('#sidebar').removeClass('on');
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
    $('#sidebar').addClass('visible');
    //document.getElementById("sidebar").style.display = "block";
    if (place) {
        var datatrans = {shopSeq: place.shop_seq}//지하철버스좌표 post 조회하기
        ajaxPostSyn('/trading-area/shop/pubTrans', datatrans, function (resultsubway) {
            //거리계산함수
            var buspolyline = new kakao.maps.Polyline({
                /* map:map, */
                path: [
                    new kakao.maps.LatLng(place.longitude, place.latitude),// 상점 위치
                    new kakao.maps.LatLng(resultsubway.buslng, resultsubway.buslat)//지하철,버스 역 위치
                ]
            });
            var subwaypolyline = new kakao.maps.Polyline({
                /* map:map, */
                path: [
                    new kakao.maps.LatLng(place.longitude, place.latitude),// 상점 위치
                    new kakao.maps.LatLng(resultsubway.sublng, resultsubway.sublat)//지하철,버스 역 위치
                ]
            });
            var text = "";
            if (resultsubway.buslng > 0) {//빈값아니면 거리 계산
                var buspos = buspolyline.getLength().toFixed(2);
                var subpos = subwaypolyline.getLength().toFixed(2)

                text +=
                    '<div id="sidebody">' +
                    //'<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
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
                    '<span class="distance">' +
                    subpos +
                    'm</span>' +
                    '</div>' +
                    '<div class="bus iconPlus">버스' +
                    '<span class="position_name">' +
                    place.bus_sta_nm +
                    '</span>' +
                    '<span class="distance">' +
                    buspos +
                    'm</span>' +
                    '</div>' +
                    "</div>";

                    if($("#loginCheck").val() == undefined) {
                            text +=
                            '<div class="sideinfo">' +
                                '<h4 class="sideinfoTitle">최근 이슈</h4>' +
                                '<div class="issue">' +
                                '<span>로그인이 필요합니다.</span>' +
                                '<a href="/login">로그인/회원가입 하러가기</a>' +
                                '</div>' +
                            "</div>";
                    }

                    text +=
                        '<button class="analysisBtn" onclick="location.href=`/trading-area/analysis?lat=' + place.latitude +'&lng='+ place.longitude +'&x1=' + (map.getBounds().getSouthWest().getLat() - 0.025) +'&x2=' + (map.getBounds().getNorthEast().getLat() + 0.025) +'&y1=' + (map.getBounds().getSouthWest().getLng() - 0.025) +'&y2=' + (map.getBounds().getNorthEast().getLng() + 0.025 ) +'`">상권활성화 예측지수</button>' +
                        '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div>' +
                    '</div>' +
                    '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
            } else {
                    text +=
                    '<div id="sidebody">' +
                    //'<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
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
                    '<span class="distance">' +
                    '</span>' +
                    '</div>' +
                    '<div class="bus iconPlus">버스' +
                    '<span class="position_name">' +
                    place.bus_sta_nm +
                    '</span>' +
                    '<span class="distance">' +
                    '</span>' +
                    '</div>' +
                    "</div>";

                    if($("#loginCheck").val() == undefined) {
                        text +=
                        '<div class="sideinfo">' +
                            '<h4 class="sideinfoTitle">최근 이슈</h4>' +
                            '<div class="issue">' +
                                '<span>로그인이 필요합니다.</span>' +
                                '<a href="/login">로그인/회원가입 하러가기</a>' +
                            '</div>' +
                        "</div>";
                    }

                    text +=
                        '<button class="analysisBtn" onclick="location.href=`/trading-area/analysis?lat=' + place.latitude +'&lng='+ place.longitude +'&x1=' + (map.getBounds().getSouthWest().getLat() - 0.025) +'&x2=' + (map.getBounds().getNorthEast().getLat() + 0.025) +'&y1=' + (map.getBounds().getSouthWest().getLng() - 0.025) +'&y2=' + (map.getBounds().getNorthEast().getLng() + 0.025 ) +'`">상권활성화 예측지수</button>' +
                    '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' +
                    '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
            }

            document.getElementById("sidebar").innerHTML = text;
            if (window.innerWidth < 767) {
                $('#sidebody').addClass('visible_none');
                $('#sidebar').addClass('on');
            }
        })
    }
}

//오버레이닫음
function closeOverlay() {
    placeOverlay.setMap(null);
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

$('.community_Btn').click(function () {
    $('.community_pop_wrap').toggleClass('on');
});
function closeCommnunity(){
    $('.community_pop_wrap').removeClass('on')
}

$('.m_scroll_btn').click(function () {
    $('.community_pop_wrap').removeClass('on');
});
/*$('.community_main').click(function () {

    let communitySeq = $(this).find("#communitySeq").val();
    if (communitySeq === undefined) {
        $('.detail_community').removeClass('on');
        // location.href = "/community/" + $('input[name=communitySeq]').val() + "?type=shop";
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
            // let fragment = res.responseText
            // $(".reply_list").replaceWith(fragment);
            // $(".reply_list").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        console.log(fragment)

        //여기로 안들어옴.....
        $(".reply_list").replaceWith(fragment);
        $(".reply_list").show();
        //$(".loading_box").hide();

    });
    $(this).next('.detail_community').addClass('on');

});*/

/*$('.backbtn').click(function () {
    $('.detail_community').removeClass('on');
});*/

$('.addresswidth').click(function () {
    $('.searchInput').toggleClass('on');
})

/*$('.reply_btn').click(function () {

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



});*/

function getReply(communitySeq,obj){

    if (communitySeq === undefined) {
        $('.detail_community').removeClass('on');
        // location.href = "/community/" + $('input[name=communitySeq]').val() + "?type=shop";
        return false;
    }

    var data = {
        communitySeq: communitySeq,
        type: "shop"
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
        console.log(fragment)

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
        type:"shop"
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
}

function backbtn(){
    $('.detail_community').removeClass('on');
}
