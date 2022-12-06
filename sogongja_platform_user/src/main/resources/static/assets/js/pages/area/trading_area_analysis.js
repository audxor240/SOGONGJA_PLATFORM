//상권
//1주소창, 2시도+시군구+읍면동선택창, 3+-현위치버튼, 4모바일리사이즈, 5상점마커

//상권 맵 기본 레벨
var mapDefaultLevel = 5;
//상권 기본 위치는 강남구 좌표
var clientLatitude = 37.5045717035321;
var clientLongitude = 127.03184797874623;
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표 기본 위치는 서울시청
        level: mapDefaultLevel, // 지도의 확대 레벨
    };
// 상권 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

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
var infosForMidpart = new Array();

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

//상점뿌리기끝

//상권그리기 시작
// 다각형을 생성하고 지도에 표시합니다
var polygons = [];   //폴리곤 그려줄 path
var points = [];  //중심좌표 구하기 위한 지역구 좌표들
var countmarkers = []; //시군구시도 카운트마커 배열
var areanameMarkers = []; //상권이름 마커 배열
var roundmarkers = []; //상권이름 동그란 마커 호버배열
var clickmarkers = []; //상권이름 동그란 마커 클릭배열
console.log("첫상권", areaJson, areaJson.length)
//첫화면 맵크기 5일때 상권 로드
areaSpread(areaJson)
//    displayArea(areaJson);
for (var i = 0, len = areaJson.length; i < len; i++) {
    areanameSpread(areaJson[i]);// 상권이름그려줌
}
$('#storelist').css('display', 'none');//상점 카테고리 삭제


//상권뿌려줌
function areaSpread(area) {
    for (var i = 0; i < area.length; i++) {
        var polygon = displayArea(area[i]);//폴리곤 그림
        polygon.setMap(map);
        polygons.push(polygon)
        displayPath(polygon, area, i) //호버, 클릭, 사이드 바 함수 등록
    }
}

// 다각형 + 상권명을 생상하고 이벤트를 등록하는 함수입니다 맵크기 6~이하일때만 그림
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
    // 다각형을 생성합니다
    if (area.area_type == "D") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#2E750D',
            strokeOpacity: 1,
            fillColor: '#2E750D',
            fillOpacity: 0.4
        });
    } else if (area.area_type == "A") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#BF7116',
            strokeOpacity: 1,
            fillColor: '#BF7116',
            fillOpacity: 0.4
        });
    } else if (area.area_type == "U") {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#DD4C79',
            strokeOpacity: 1,
            fillColor: '#DD4C79',
            fillOpacity: 0.4
        });
    } else {
        var polygon = new kakao.maps.Polygon({
            path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
            strokeWeight: 2,
            strokeColor: '#1540BF',
            strokeOpacity: 1,
            fillColor: '#1540BF',
            fillOpacity: 0.4
        });
    }
    return polygon
}

function displayPath(polygon, area, i) {
    // 마커와 검색결과 항목을 호버, 호버아웃, 클릭 했을 때
    // 장소정보를 표출하도록 이벤트를 등록합니다
    (function sdf(polygon, area) {
        //클릭 시 마커인포+사이드바 보이고, 지도중심으로 이동
        kakao.maps.event.addListener(polygon, "click", function () {
            if (isAuthenticated) {
                areaInClick(area)
            }
            $('.filterbox').removeClass('on');
            var position = centroid(area.path);
            console.log(position.Ma)
            var data = {
                areaCd: area.area_cd,
                areaSeq: area.area_seq,
                lat : position.Ma,
                lng : position.La
            }
            ajaxPostSyn('/trading-area/analysis/details', data, function (result) {
                console.log("세부 요청요청", result)
                sideInfo(area, result)
            });
            var areaTab = $('input[name=areaTab]:checked').val();
            if (areaTab === "open") {//개업수
                $(".open-num").css('display', 'block');
                $(".open-num").siblings().css('display', 'none');
            } else if (areaTab === "close") {//폐업수
                $(".close-num").css('display', 'block');
                $(".close-num").siblings().css('display', 'none');
            } else if (areaTab === "sales") {//추정매출
                $(".sales-num").css('display', 'block');
                $(".sales-num").siblings().css('display', 'none');
            } else {//상점수 탭일때
                $(".store-num").css('display', 'block');
                $(".store-num").siblings().css('display', 'none');
            }
            $('.areahoverIn').addClass('on')
        });
        // 다각형에 mouseover 이벤트 : 폴리곤의 채움색을 변경
        kakao.maps.event.addListener(polygon, "mouseover", function () {
            //  areaInhoverFunc(area)
            polygon.setOptions({
                fillOpacity: 0.8
            });
        });
        // 다각형에 mouseout 이벤트 : 폴리곤의 채움색을 원래색으로 변경
        kakao.maps.event.addListener(polygon, "mouseout", function () {
            //   areaInhoverOut(area)
            polygon.setOptions({
                fillOpacity: 0.4
            });
        });
    })(polygon, area[i]);
}

//사이드바 인포
function sideInfo(area, detail) {
    var info2 = area.info2;
    var stores = 0;
    var open = 0;
    var close = 0;
    var sales = 0;
    for (var i = 0; i < info2.length; i++) {
        stores += info2[i].stores;
        open += info2[i].open;
        close += info2[i].close;
        sales += info2[i].sales;
    }
    document.getElementById("sidebar").style.display = "block";
    if (area) {
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody" class="sidebody_area">' +
            '<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
            '<div class="sideinfo">' +
            area.area_name + ' ' + area.area_title +
            '</div>' +
            '<div class="sideinfo">' +
            '상점수 ' + stores +
            '</div>' +
            '<div class="sideinfo">' +
            '개폐업수 개업점포수' + open + '폐업점포수' + close +
            '</div>' +
            '<div class="sideinfo">' +
            '추정매출 매출이 가장 큰시간' + detail.picktime + '매출액' + sales +
            '</div>' +
            '<div class="sideinfo">' +
            '생활인구' +
            '</div>' +
            '<div class="sideinfo">' +
            '상존인구 길단위' + detail.st_popul + '건물단위' + detail.bd_popul +
            '</div>' +
            '<div class="sideinfo">' +
            '인구 유형별 비중 주거인구 ? ' +
            '</div>' +
            '<div class="sideinfo">' +
            '소비유형' +
            '</div>' +
            '<div class="sideinfo">' +
            '아파트 상권 단지수' + detail.ct_apt_com + ' 세대수' + detail.ct_apt_hou +
            '아파트 배후지 단지수' + detail.ct_napt_com + ' 세대수' + detail.ct_napt_hou +
            '</div>' +
            '<div class="sideinfo">' +
            '아파트' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">최근 이슈</h4>' +
            '<div class="issue">' +
            '<span>로그인이 필요합니다.</span>' +
            '<a>로그인/회원가입 하러가기</a>' +
            '</div>' +
            "</div>" +
            '<button class="analysisBtn">상권활성화 예측지수</button>' +
            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' +
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';
    }
}

//오버레이닫음
function closeOverlay() {
    for (var i = 0; i < clickmarkers.length; i++) {
        clickmarkers[i].setMap(null);
    }
    document.getElementById("sidebar").style.display = "none";
}

// var areatab = $('input[name="areaTab"]')
// areatab.addEventListener('click', function(event){
//
// });
function contentFunc(area) {
    //요상한 그래프 인포윈도우입니다.
    var infos = area.info
    console.log("요것이 상권인포", infos)
    //상점수 개점수 폐점수 추정매출6개 //업종분류
    var stores = 0;//상점수
    var open = 0;//개업수
    var close = 0;//폐업수

    var sum_00_06 = 0;//00_06추정매출
    var sum_06_11 = 0;//06_11추정매출
    var sum_11_14 = 0;//11_14추정매출
    var sum_14_17 = 0;//14_17추정매출
    var sum_17_21 = 0;//17_21추정매출
    var sum_21_24 = 0;//21_24추정매출
    var sum_all = 0;//all추정매출

    var maincate = $('input[name="area_maincate"]:checked').val() //대분류
    var midcate = $('input[name="area_midcate"]:checked').val() //중분류
    console.log('enter contentFunc 대분류: ' + maincate + ' 중분류 : ' + midcate)

    if (maincate == "all") {//전체 업종 선택이면 전체내리고 희안한 그래프 뜨는거고
        console.log("대분류 전체")
        for (var i = 0; i < infos.length; i++) {
            stores += infos[i].ct_shop;
            open += infos[i].ct_open;
            close += infos[i].ct_close;

            sum_00_06 += infos[i].sum_00_06;
            sum_06_11 += infos[i].sum_06_11;
            sum_11_14 += infos[i].sum_11_14;
            sum_14_17 += infos[i].sum_14_17;
            sum_17_21 += infos[i].sum_17_21;
            sum_21_24 += infos[i].sum_21_24;
        }
        document.getElementById("SUM_00_06").value = sum_00_06;
        document.getElementById("SUM_06_11").value = sum_06_11;
        document.getElementById("SUM_11_14").value = sum_11_14;
        document.getElementById("SUM_14_17").value = sum_14_17;
        document.getElementById("SUM_17_21").value = sum_17_21;
        document.getElementById("SUM_21_24").value = sum_21_24;

        const query = 'input[name="timecate"]:checked';
        const selectedEls = document.querySelectorAll(query);
        selectedEls.forEach((el) => {
            console.log(el.id)
            sum_all += parseInt(el.value);
        });
        document.getElementById("resultsum").value = sum_all;
        var sum_all_comma = sum_all.toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        var areaTab = $('input[name=areaTab]:checked').val();
        var info2 = area.info2
        var mainpart = '';
        var ranking = '';
        infosForMidpart = infos;
        if (areaTab === "open") {//개업수
            info2 = info2.sort((a, b) => b.open - a.open);
            for (var i = 0; i < info2.length; i++) {
                if(info2[i].code=="I"){
                    var sectorname = "숙박·음식";
                }else if(info2[i].code=="S"){
                    var sectorname = "수리·개인서비스";
                }else if(info2[i].code=="G"){
                    var sectorname = "도·소매";
                }else if(info2[i].code=="R"){
                    var sectorname = "예술·스포츠·여가";
                }else if(info2[i].code=="N"){
                    var sectorname = "시설관리·임대";
                }else if(info2[i].code=="M"){
                    var sectorname = "과학·기술";
                }else if(info2[i].code=="L"){
                    var sectorname = "부동산";
                }else if(info2[i].code=="P"){
                    var sectorname = "교육";
                }
                mainpart += `<li class="graphlist` + (i+1)+ ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].open + `</span></li>`
                ranking += `<span class="` + info2[i].code + `">` + sectorname +'<div class="right"> '+ info2[i].open +'개 '+ (i+1)+`위</div></span>`
            }
        } else if (areaTab === "close") {//폐업수
            info2 = info2.sort((a, b) => b.close - a.close);
            for (var i = 0; i < info2.length; i++) {
                if(info2[i].code=="I"){
                    var sectorname = "숙박·음식";
                }else if(info2[i].code=="S"){
                    var sectorname = "수리·개인서비스";
                }else if(info2[i].code=="G"){
                    var sectorname = "도·소매";
                }else if(info2[i].code=="R"){
                    var sectorname = "예술·스포츠·여가";
                }else if(info2[i].code=="N"){
                    var sectorname = "시설관리·임대";
                }else if(info2[i].code=="M"){
                    var sectorname = "과학·기술";
                }else if(info2[i].code=="L"){
                    var sectorname = "부동산";
                }else if(info2[i].code=="P"){
                    var sectorname = "교육";
                }
                mainpart += `<li class="graphlist` + (i+1)+ ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].close + `</span></li>`
                ranking += `<span class="` + info2[i].code + `">` + sectorname +'<div class="right"> '+ info2[i].close +'개 '+ (i+1)+`위</div></span>`
            }
        } else if (areaTab === "sales") {//추정매출
            for (var i = 0; i < info2.length; i++) {
                var tempSales = 0;
                $("input[name='timecate']:checked").each(function(e){
                    var tempTimeId = $(this).attr('id');
                    if (tempTimeId === 'SUM_00_06') {
                        tempSales += info2[i].sum_00_06;
                    } else if (tempTimeId === 'SUM_06_11') {
                        tempSales += info2[i].sum_06_11;
                    } else if (tempTimeId === 'SUM_11_14') {
                        tempSales += info2[i].sum_11_14;
                    } else if (tempTimeId === 'SUM_14_17') {
                        tempSales += info2[i].sum_14_17;
                    } else if (tempTimeId === 'SUM_17_21') {
                        tempSales += info2[i].sum_17_21;
                    } else if (tempTimeId === 'SUM_21_24') {
                        tempSales += info2[i].sum_21_24;
                    }
                })
                info2[i].sales = tempSales;
            }
            info2 = info2.sort((a, b) => b.sales - a.sales);
            for (var i = 0; i < info2.length; i++) {
                if(info2[i].code=="I"){
                    var sectorname = "숙박·음식";
                }else if(info2[i].code=="S"){
                    var sectorname = "수리·개인서비스";
                }else if(info2[i].code=="G"){
                    var sectorname = "도·소매";
                }else if(info2[i].code=="R"){
                    var sectorname = "예술·스포츠·여가";
                }else if(info2[i].code=="N"){
                    var sectorname = "시설관리·임대";
                }else if(info2[i].code=="M"){
                    var sectorname = "과학·기술";
                }else if(info2[i].code=="L"){
                    var sectorname = "부동산";
                }else if(info2[i].code=="P"){
                    var sectorname = "교육";
                }
                mainpart += `<li class="graphlist` + (i+1)+ ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].sales + `</span></li>`
                ranking += `<span class="` + info2[i].code + `">` + sectorname +'<div class="right"> '+ info2[i].sales +'원 '+ (i+1)+`위</div></span>`
            }
        } else {//상점수 탭일때
            info2 = info2.sort((a, b) => b.stores - a.stores);
            for (var i = 0; i < info2.length; i++) {
                if(info2[i].code=="I"){
                  var sectorname = "숙박·음식";
                }else if(info2[i].code=="S"){
                    var sectorname = "수리·개인서비스";
                }else if(info2[i].code=="G"){
                    var sectorname = "도·소매";
                }else if(info2[i].code=="R"){
                    var sectorname = "예술·스포츠·여가";
                }else if(info2[i].code=="N"){
                    var sectorname = "시설관리·임대";
                }else if(info2[i].code=="M"){
                    var sectorname = "과학·기술";
                }else if(info2[i].code=="L"){
                    var sectorname = "부동산";
                }else if(info2[i].code=="P"){
                    var sectorname = "교육";
                }
                mainpart += `<li class="graphlist` + (i+1)+ ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].stores + `</span></li>`
                ranking += `<span class="` + info2[i].code + `">` + sectorname +'<div class="right"> '+ info2[i].stores +'개 '+ (i+1)+`위</div></span>`
            }
        }
        console.log(mainpart)

        //대분류전체 콘텐트
        var content =
            '<div class="areahoverIn">' +
                '<p class="areacenter">' +
                area.area_name +
                '</p>' +
                '<div class="areanum">' +
                    '<p class="store-num num">' +
                    stores +
                    "개 점포" +
                    '</p>' +
                    '<p class="open-num num">' +
                    open +
                    "개 점포" +
                    '</p>' +
                    '<p class="close-num num">' +
                    close +
                    "개 점포" +
                    '</p>' +
                    '<p class="sales-num num">' +
                    sum_all_comma +
                    "원" +
                    '</p>' +
                '</div>' +
                '<ul class="graphmenu">'+
                mainpart +
                ' </ul>'+
            '<div class="placeinfo2">' +
                '<div class="title" >' +
                '전체업종 순위'+
                "</div>" +
                '<div class="close" onclick="closeOverlay()" title="닫기"></div>'+
            '<div class="ranking_list scroll" >' +
            ranking+
            "</div>" +
                '<div class="after"></div>'+
                "</div>" +
            '</div>'
        ;

    } else {// 여기는 단일마커임
        if (midcate.includes('all')) {
            console.log("대분류 분류 중분류 전체")
            for (var i = 0; i < infos.length; i++) {
                if (maincate === infos[i].code) {
                    stores += infos[i].ct_shop;
                    open += infos[i].ct_open;
                    close += infos[i].ct_close;

                    sum_00_06 += infos[i].sum_00_06;
                    sum_06_11 += infos[i].sum_06_11;
                    sum_11_14 += infos[i].sum_11_14;
                    sum_14_17 += infos[i].sum_14_17;
                    sum_17_21 += infos[i].sum_17_21;
                    sum_21_24 += infos[i].sum_21_24;
                }
            }
        } else {
            console.log("대분류 분류 중분류 분류")
            for (var i = 0; i < infos.length; i++) {
                if (midcate === infos[i].com_cd2) {
                    stores += infos[i].ct_shop;
                    open += infos[i].ct_open;
                    close += infos[i].ct_close;

                    sum_00_06 += infos[i].sum_00_06;
                    sum_06_11 += infos[i].sum_06_11;
                    sum_11_14 += infos[i].sum_11_14;
                    sum_14_17 += infos[i].sum_14_17;
                    sum_17_21 += infos[i].sum_17_21;
                    sum_21_24 += infos[i].sum_21_24;
                }
            }
        }

        document.getElementById("SUM_00_06").value = sum_00_06;
        document.getElementById("SUM_06_11").value = sum_06_11;
        document.getElementById("SUM_11_14").value = sum_11_14;
        document.getElementById("SUM_14_17").value = sum_14_17;
        document.getElementById("SUM_17_21").value = sum_17_21;
        document.getElementById("SUM_21_24").value = sum_21_24;
        const query = 'input[name="timecate"]:checked';
        const selectedEls = document.querySelectorAll(query);
        selectedEls.forEach((el) => {
            console.log(el.id)
            sum_all += parseInt(el.value);
        });
        document.getElementById("resultsum").value = sum_all;
        var sum_all_comma = sum_all.toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        var content =
            '<div class="areahoverIn">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div class="areanum">' +
            '<p class="store-num num">' +
            stores +
            "개 점포" +
            '</p>' +
            '<p class="open-num num">' +
            open +
            "개 점포" +
            '</p>' +
            '<p class="close-num num">' +
            close +
            "개 점포" +
            '</p>' +
            '<p class="sales-num num">' +
            sum_all_comma +
            "원" +
            '</p>' +
            '</div>' +
            '</div>';
    }
    return content;
}

function areaInClick(area) {
    for (var i = 0; i < clickmarkers.length; i++) {
        clickmarkers[i].setMap(null);
    }//동그란마커 지우고
    var content = contentFunc(area)
    var position = centroid(area.path);
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        zIndex: 100
    });
    // 동그란 마커를 배열에 추가합니다
    clickmarkers.push(customOverlay);
    //  동그란 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);
}

function areaInhoverFunc(area) {
    var content = contentFunc(area);
    var position = centroid(area.path);
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });
    // 동그란 마커를 배열에 추가합니다
    roundmarkers.push(customOverlay);
    //  동그란 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);
}

function areaInhoverOut() {
    for (var i = 0; i < roundmarkers.length; i++) {
        roundmarkers[i].setMap(null);
    }
}


function areanameSpread(area) {
    // 커스텀 상권이름 마커를 생성합니다
    var infos = area.info
    console.log("요것이 상권인포", infos)
//상점수 개점수 폐점수 추정매출6개 //업종분류
    var stores = 0;//상점수
    var open = 0;//개업수
    var close = 0;//폐업수

    var sum_00_06 = 0;//00_06추정매출
    var sum_06_11 = 0;//06_11추정매출
    var sum_11_14 = 0;//11_14추정매출
    var sum_14_17 = 0;//14_17추정매출
    var sum_17_21 = 0;//17_21추정매출
    var sum_21_24 = 0;//21_24추정매출
    var sum_all = 0;//all추정매출

    var maincate = $('input[name="area_maincate"]:checked').val() //대분류
    var midcate = $('input[name="area_midcate"]:checked').val() //중분류
    console.log("대분류 : " + maincate + " 중분류 : " + midcate)
    if (maincate == "all") {//전체 업종 선택이면 전체내리고
        console.log("대분류 전체")
        for (var i = 0; i < infos.length; i++) {

            stores += infos[i].ct_shop;
            open += infos[i].ct_open;
            close += infos[i].ct_close;

            sum_00_06 += infos[i].sum_00_06;
            sum_06_11 += infos[i].sum_06_11;
            sum_11_14 += infos[i].sum_11_14;
            sum_14_17 += infos[i].sum_14_17;
            sum_17_21 += infos[i].sum_17_21;
            sum_21_24 += infos[i].sum_21_24;

        }
    } else {
        if (midcate.includes('all')) {
            console.log("대분류 분류 중분류 전체")

            for (var i = 0; i < infos.length; i++) {
                if (maincate === infos[i].code) {
                    stores += infos[i].ct_shop;
                    open += infos[i].ct_open;
                    close += infos[i].ct_close;

                    sum_00_06 += infos[i].sum_00_06;
                    sum_06_11 += infos[i].sum_06_11;
                    sum_11_14 += infos[i].sum_11_14;
                    sum_14_17 += infos[i].sum_14_17;
                    sum_17_21 += infos[i].sum_17_21;
                    sum_21_24 += infos[i].sum_21_24;

                }
            }
        } else {
            console.log("대분류 분류 중분류 분류")

            for (var i = 0; i < infos.length; i++) {
                if (midcate === infos[i].com_cd2) {
                    stores += infos[i].ct_shop;
                    open += infos[i].ct_open;
                    close += infos[i].ct_close;

                    sum_00_06 += infos[i].sum_00_06;
                    sum_06_11 += infos[i].sum_06_11;
                    sum_11_14 += infos[i].sum_11_14;
                    sum_14_17 += infos[i].sum_14_17;
                    sum_17_21 += infos[i].sum_17_21;
                    sum_21_24 += infos[i].sum_21_24;
                }
            }
        }
    }
    document.getElementById("SUM_00_06").value = sum_00_06;
    document.getElementById("SUM_06_11").value = sum_06_11;
    document.getElementById("SUM_11_14").value = sum_11_14;
    document.getElementById("SUM_14_17").value = sum_14_17;
    document.getElementById("SUM_17_21").value = sum_17_21;
    document.getElementById("SUM_21_24").value = sum_21_24;

    const query = 'input[name="timecate"]:checked';
    const selectedEls = document.querySelectorAll(query);
    selectedEls.forEach((el) => {
        console.log(el.id)
        sum_all += parseInt(el.value);
    });
    document.getElementById("resultsum").value = sum_all;

    // for (var i = 0; i < infos.length; i++) {
    //     if (maincate == "all") {//전체 업종 선택이면 전체내리고 희안한 그래프 뜨는거고
    //             stores += infos[i].ct_shop;
    //             open += infos[i].ct_open;
    //             close += infos[i].ct_close;
    //
    //             sum_00_06 += infos[i].sum_00_06;
    //             sum_06_11 += infos[i].sum_06_11;
    //             sum_11_14 += infos[i].sum_11_14;
    //             sum_14_17 += infos[i].sum_14_17;
    //             sum_17_21 += infos[i].sum_17_21;
    //             sum_21_24 += infos[i].sum_21_24;
    //
    //         document.getElementById("SUM_00_06").value = sum_00_06;
    //         document.getElementById("SUM_06_11").value = sum_06_11;
    //         document.getElementById("SUM_11_14").value = sum_11_14;
    //         document.getElementById("SUM_14_17").value = sum_14_17;
    //         document.getElementById("SUM_17_21").value = sum_17_21;
    //         document.getElementById("SUM_21_24").value = sum_21_24;
    //
    //         const query = 'input[name="timecate"]:checked';
    //         const selectedEls = document.querySelectorAll(query);
    //         selectedEls.forEach((el) =>{
    //             sum_all += parseInt(el.value);
    //         });
    //         document.getElementById("resultsum").value = sum_all;
    //     } else {// 그게 아니면 단일그래프가 떠야한다
    //
    //         // //그 안에서 분류
    //         // if (midcate == infos[i].com_cd2) {//단일업종 전체아니고 1가지일때
    //         //
    //         //     // 모든합계 var store =
    //         // } else {//단일업종 전체일때
    //         //
    //         // }
    //     }
    // }
    // var sum_all = sum_00_06 + sum_06_11 + sum_11_14 + sum_14_17 + sum_17_21 + sum_21_24//all추정매출
    console.log("상점수", stores, '개폐점수', open, close, "추정매출총합과 6가지", sum_all, sum_00_06, sum_06_11, sum_11_14, sum_14_17, sum_17_21, sum_21_24)//전체임
    var sum_all_comma = sum_all.toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    if (area.area_type == "D") {
        var content =
            '<div class="areaIn color2E750D" >' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div class="areanum">' +
            '<p class="store-num num">' +
            stores +
            "개 점포" +
            '</p>' +
            '<p class="open-num num">' +
            open +
            "개 점포" +
            '</p>' +
            '<p class="close-num num">' +
            close +
            "개 점포" +
            '</p>' +
            '<p class="sales-num num">' +
            sum_all_comma +
            "원" +
            '</p>' +
            '</div>' +
            '</div>';
    } else if (area.area_type == "A") {
        var content =
            '<div class="areaIn colorBF7116">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div class="areanum">' +
            '<p class="store-num num">' +
            stores +
            "개 점포" +
            '</p>' +
            '<p class="open-num num">' +
            open +
            "개 점포" +
            '</p>' +
            '<p class="close-num num">' +
            close +
            "개 점포" +
            '</p>' +
            '<p class="sales-num num">' +
            sum_all_comma +
            "원" +
            '</p>' +
            '</div>' +
            '</div>';
    } else if (area.area_type == "U") {
        var content =
            '<div class="areaIn colorDD4C79">' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div class="areanum">' +
            '<p class="store-num num">' +
            stores +
            "개 점포" +
            '</p>' +
            '<p class="open-num num">' +
            open +
            "개 점포" +
            '</p>' +
            '<p class="close-num num">' +
            close +
            "개 점포" +
            '</p>' +
            '<p class="sales-num num">' +
            sum_all_comma +
            "원" +
            '</p>' +
            '</div>' +
            '</div>';
    } else if (area.area_type == "R") {
        var content =
            '<div class="areaIn color1540BF>' +
            '<p class="areacenter">' +
            area.area_name +
            '</p>' +
            '<div class="areanum">' +
            '<p class="store-num num">' +
            stores +
            "개 점포" +
            '</p>' +
            '<p class="open-num num">' +
            open +
            "개 점포" +
            '</p>' +
            '<p class="close-num num">' +
            close +
            "개 점포" +
            '</p>' +
            '<p class="sales-num num">' +
            sum_all_comma +
            "원" +
            '</p>' +
            '</div>' +
            '</div>';
    } else {
        var content = ""
    }
    console.log(content)
    var position = centroid(area.path);
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });
// 생성된 마커를 배열에 추가합니다
    areanameMarkers.push(customOverlay);
// 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);



}


// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "idle", changeMap)

//지도중심 이동 시,
async function changeMap() {
    resizeMap()//중심 바뀌면 맵크기 조절함 모바일사이즈 됐을때
    var lat = map.getCenter().getLat(),
        lng = map.getCenter().getLng(),
        zoom = map.getLevel(),
        x2 = map.getBounds().getNorthEast().getLat(),
        y2 = map.getBounds().getNorthEast().getLng(),
        x1 = map.getBounds().getSouthWest().getLat(),
        y1 = map.getBounds().getSouthWest().getLng();
    codeType2 = $('input[name="cate2"]:checked').val();
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

    if (zoom >= 6 && zoom <= 14) {//zoom 6 ~ 14
        //시도,시군구 단위 자체 마커
        removePolygons(map)// 상권 삭제
        for (var i = 0; i < clickmarkers.length; i++) {
            clickmarkers[i].setMap(null);
        }
        for (var i = 0; i < areanameMarkers.length; i++) {
            areanameMarkers[i].setMap(null);//상권이름 마커 비우고
        }
        $('.areaTap').css('display', 'none');
        $('#filter').css('display', 'none');
        for (var i = 0; i < countmarkers.length; i++) {
            countmarkers[i].setMap(null);//시군구, 시도마커 비우고
        }
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            resultSpread(result)//다시그려
        });
    } else if (zoom >= 4 && zoom < 6) { //zoom 4,5 일때
        //상권패스  +커스텀마커: 상권명 + 상점수
        //          + 클릭 시 그래프★★★
        for (var i = 0; i < countmarkers.length; i++) {
            countmarkers[i].setMap(null);//시군구 마커 비우고
        }
        setMarkers(null)//상점삭제
        $('#storelist').css('display', 'none');//상점 카테고리 삭제

        //5~ 상점수,개폐업수,추정매출 탭 보이기 + 필터 보이기
        removePolygons(map)//areajson에 쓰던 상권 삭제하고
        for (var i = 0; i < areanameMarkers.length; i++) {
            areanameMarkers[i].setMap(null);//상권이름 마커 비우고
        }
        $('.areaTap').css('display', 'block');
        $('#filter').css('display', 'block');
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            console.log("이게 상권데이터 갖고오는거임", result)
            areaJson = result;
            areaSpread(areaJson);//상권 패스 다시 그려줌
            for (var i = 0, len = areaJson.length; i < len; i++) {
                areanameSpread(areaJson[i]);// 상권이름그려줌
            }
        });
    } else { //level < 4, zoom 3,2,1 일때
        // 상점 마커들 추가로 찍어주기
        setMarkers(null)
        $('#storelist').css('display', 'block');
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점 찍기
        });
    }
};
//changeMap 끝
//changeMap 끝


//맵 6이상 시도,행정동 카운트를 표시하는 마커
function resultSpread(thing) {
    thing.forEach((thing) => {
        if (thing.emdcd == '11') {
            var name = '서울시'
        } else if (thing.emdcd == '11110') {
            var name = "종로구"
        } else if (thing.emdcd == '11140') {
            var name = "중구"
        } else if (thing.emdcd == '11170') {
            var name = "용산구"
        } else if (thing.emdcd == '11200') {
            var name = "성동구"
        } else if (thing.emdcd == '11215') {
            var name = "광진구"
        } else if (thing.emdcd == '11230') {
            var name = "동대문구"
        } else if (thing.emdcd == '11260') {
            var name = "중랑구"
        } else if (thing.emdcd == '11290') {
            var name = "성북구"
        } else if (thing.emdcd == '11305') {
            var name = "강북구"
        } else if (thing.emdcd == '11320') {
            var name = "도봉구"
        } else if (thing.emdcd == '11350') {
            var name = "노원구"
        } else if (thing.emdcd == '11380') {
            var name = "은평구"
        } else if (thing.emdcd == '11410') {
            var name = "서대문구"
        } else if (thing.emdcd == '11440') {
            var name = "마포구"
        } else if (thing.emdcd == '11470') {
            var name = "양천구"
        } else if (thing.emdcd == '11500') {
            var name = "강서구"
        } else if (thing.emdcd == '11530') {
            var name = "구로구"
        } else if (thing.emdcd == '11545') {
            var name = "금천구"
        } else if (thing.emdcd == '11560') {
            var name = "영등포구"
        } else if (thing.emdcd == '11590') {
            var name = "동작구"
        } else if (thing.emdcd == '11620') {
            var name = "관악구"
        } else if (thing.emdcd == '11650') {
            var name = "서초구"
        } else if (thing.emdcd == '11680') {
            var name = "강남구"
        } else if (thing.emdcd == '11710') {
            var name = "송파구"
        } else if (thing.emdcd == '11740') {
            var name = "강동구"
        } else {
            var name = ''
        }
        geocoder.addressSearch(name, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                // 결과값으로 받은 위치를 마커로 표시합니다
                var content = '<div class ="countlabel">' +
                    '<div class="countsidobox">' +
                    '<div class="center">' +
                    name +
                    '</div><div class="right">' +
                    thing.count +
                    '</div></div></div>';
                var marker = new kakao.maps.CustomOverlay({
                    position: coords,
                    content: content
                });
                // 생성된 마커를 배열에 추가합니다
                countmarkers.push(marker);
                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
            }
        });
    })
}

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


//업종선택 클릭시 필터창
$('.filterIcon').click(function () {
    $('.filterbox').addClass('on')
})
$('.close_filter').click(function () {
    $('.filterbox').removeClass('on')
})
//개폐업수 클릭시 개업or폐업수선택
$(".openclose").click(function () {
    $('.openclose_list').toggleClass('on')
})
//개업수 폐업수 선택하면 리스트 닫힘
$(".openclose_list").click(function () {
    $('.openclose_list').removeClass('on')
})


//개폐업수 탭 색상 변경
function changeAreaTab() {
    var areaTab = $('input[name=areaTab]:checked').val();
    document.getElementById("sidebar").style.display = "none";
    for (var i = 0; i < clickmarkers.length; i++) {
        clickmarkers[i].setMap(null);
    }
    if (areaTab === "open") {//개업수
        $(".openclose").text("개업수");
        $(".openclose").addClass("on")
        //개업수 체크이면 text 개업수로 변경
        $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
        //개업수 카운트 디스플레이 block
        $(".open-num").css('display', 'block');
        $(".open-num").siblings().css('display', 'none');
    } else if (areaTab === "close") {//폐업수
        $(".openclose").text("폐업수")
        $(".openclose").addClass("on")
        //폐업수 체크이면 text 폐업수로 변경
        $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
        //폐업수 카운트 디스플레이 block
        $(".close-num").css('display', 'block');
        $(".close-num").siblings().css('display', 'none');
    } else if (areaTab === "sales") {//추정매출
        $(".openclose").text("개폐업수")
        $(".openclose").removeClass("on")
        $(".openclose_list").removeClass("on")
        //개업수 폐업수 선택아니면 개폐업수
        $('.timeSelect_wrap').css('display', 'block');//시간선택 ul 보이기
        //추정매출 카운트 디스플레이
        $(".sales-num").css('display', 'block');
        $(".sales-num").siblings().css('display', 'none');
    } else {//상점수 탭일때
        $(".openclose").text("개폐업수")
        $(".openclose").removeClass("on")
        $(".openclose_list").removeClass("on")
        //개업수 폐업수 선택아니면 개폐업수
        $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
        //상점수 카운트 디스플레이
        $(".store-num").css('display', 'block');
        $(".store-num").siblings().css('display', 'none');
    }
}

// $('input[name="areaTab"]').click(function () {
//     var areaTab = $('input[name=areaTab]:checked').val();
//     console.log("zzzz : " + areaTab)
//     document.getElementById("sidebar").style.display = "none";
//     for (var i = 0; i < clickmarkers.length; i++) {
//         clickmarkers[i].setMap(null);
//     }
//     if (areaTab === "open") {//개업수
//         $(".openclose").text("개업수");
//         $(".openclose").addClass("on")
//         //개업수 체크이면 text 개업수로 변경
//         $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
//         //개업수 카운트 디스플레이 block
//         $(".open-num").css('display', 'block');
//         $(".open-num").siblings().css('display', 'none');
//     } else if (areaTab === "close") {//폐업수
//         $(".openclose").text("폐업수")
//         $(".openclose").addClass("on")
//         //폐업수 체크이면 text 폐업수로 변경
//         $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
//         //폐업수 카운트 디스플레이 block
//         $(".close-num").css('display', 'block');
//         $(".close-num").siblings().css('display', 'none');
//     } else if (areaTab === "sales") {//추정매출
//         $(".openclose").text("개폐업수")
//         $(".openclose").removeClass("on")
//         $(".openclose_list").removeClass("on")
//         //개업수 폐업수 선택아니면 개폐업수
//         $('.timeSelect_wrap').css('display', 'block');//시간선택 ul 보이기
//         //추정매출 카운트 디스플레이
//         $(".sales-num").css('display', 'block');
//         $(".sales-num").siblings().css('display', 'none');
//     } else {//상점수 탭일때
//         $(".openclose").text("개폐업수")
//         $(".openclose").removeClass("on")
//         $(".openclose_list").removeClass("on")
//         //개업수 폐업수 선택아니면 개폐업수
//         $('.timeSelect_wrap').css('display', 'none');//시간선택 ul 가리기
//         //상점수 카운트 디스플레이
//         $(".store-num").css('display', 'block');
//         $(".store-num").siblings().css('display', 'none');
//     }
// })

$('.midSecBox').css('display', 'none');
$('.fileter_sub_title.mid_title').css('display', 'none');
$('input[name="area_maincate"]').click(function () {
    if ($('input[name="area_maincate"]:checked').val() == "all") {
//대분류가 all 전체업종 선택되있으면 중분류-전체 보여줘
        $('.midSectors').removeClass("on")
        $('.all-mid-sector').addClass("on")
        $('.midSecBox').css('display', 'none');
        $('.fileter_sub_title.mid_title').css('display', 'none');
    } else {
        $('.midSecBox').css('display', 'block');
        $('.fileter_sub_title.mid_title').css('display', 'block');
        if ($('input[name="area_maincate"]:checked').val() == "I") {
//1숙박·음식
            $('.midSectors').removeClass("on")
            $('.all-I-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "S") {
//2수리·개인서비스
            $('.midSectors').removeClass("on")
            $('.all-S-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "G") {
//3도·소매
            $('.midSectors').removeClass("on")
            $('.all-G-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "R") {
//4예술·스포츠·여가
            $('.midSectors').removeClass("on")
            $('.all-R-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "N") {
//5시설관리·임대
            $('.midSectors').removeClass("on")
            $('.all-N-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "M") {
//6과학·기술
            $('.midSectors').removeClass("on")
            $('.all-M-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "L") {
//7부동산
            $('.midSectors').removeClass("on")
            $('.all-L-sector').addClass("on")
        } else if ($('input[name="area_maincate"]:checked').val() == "P") {
//8교육
            $('.midSectors').removeClass("on")
            $('.all-P-sector').addClass("on")
        }
    }
})

$('input[name="area_maincate"]').click(function () {
    var temp = 'all-' + $(this).val() + '-sector';
    $("input:radio[id=" + temp + "]").prop("checked", true);
})


$('input[name="timecate"], input[name="area_maincate"], input[name="area_midcate"]').click(function () {
    for (var i = 0; i < areanameMarkers.length; i++) {
        areanameMarkers[i].setMap(null);//상권이름 마커 비우고
    }
    for (var i = 0, len = areaJson.length; i < len; i++) {
        areanameSpread(areaJson[i]);
    }
})

function showMidPart(code) {
    console.log('code : ' + code);
    var tempArr = new Array();
    for (var i = 0; i < infosForMidpart.length; i++) {
        if (infosForMidpart[i].code === code) {
            tempArr.push(infosForMidpart[i]);
        }
    }

    var areaTab = $('input[name=areaTab]:checked').val();
    if (areaTab === "open") {//개업수
        tempArr = tempArr.sort((a, b) => b.ct_open - a.ct_open);
    } else if (areaTab === "close") {//폐업수
        tempArr = tempArr.sort((a, b) => b.cd_close - a.cd_close);

    } else if (areaTab === "sales") {//추정매출
        for (var i = 0; i < tempArr.length; i++) {
            var tempSales = 0;
            $("input[name='timecate']:checked").each(function(e){
                var tempTimeId = $(this).attr('id');
                if (tempTimeId === 'SUM_00_06') {
                    tempSales += tempArr[i].sum_00_06;
                } else if (tempTimeId === 'SUM_06_11') {
                    tempSales += tempArr[i].sum_06_11;
                } else if (tempTimeId === 'SUM_11_14') {
                    tempSales += tempArr[i].sum_11_14;
                } else if (tempTimeId === 'SUM_14_17') {
                    tempSales += tempArr[i].sum_14_17;
                } else if (tempTimeId === 'SUM_17_21') {
                    tempSales += tempArr[i].sum_17_21;
                } else if (tempTimeId === 'SUM_21_24') {
                    tempSales += tempArr[i].sum_21_24;
                }
            })
            tempArr[i].sales = tempSales;
        }
        tempArr = tempArr.sort((a, b) => b.sales - a.sales);
    } else {//상점수 탭일때
        tempArr = tempArr.sort((a, b) => b.ct_shop - a.ct_shop);
    }

    for (var i = 0; i < tempArr.length; i++) {
        console.log(tempArr[i])
    }


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