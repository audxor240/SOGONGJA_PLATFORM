//상권
//1주소창, 2시도+시군구+읍면동선택창, 3+-현위치버튼, 4모바일리사이즈, 5상점마커

//상권 맵 기본 레벨
var mapDefaultLevel = 5;
//상권 기본 위치는 강남구 좌표

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표 기본 위치는 서울시청
        level: mapDefaultLevel, // 지도의 확대 레벨
    };
// 상권 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);


const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("lat")) {
    // 현재 접속 사용자 위치 정보
    navigator.geolocation.getCurrentPosition(function (pos) {
        $('.wrap-loading').removeClass('display-none');
        clientLatitude = pos.coords.latitude;
        clientLongitude = pos.coords.longitude;
        // var moveLatLon = new kakao.maps.LatLng(
        //     clientLatitude,
        //     clientLongitude
        // );
        // await map.setCenter(moveLatLon);
        location.href = "/trading-area/analysis?lat=" + clientLatitude + "&lng=" + clientLongitude + "&x1=" + (clientLatitude - 0.02) + "&x2=" + (clientLatitude + 0.02) + "&y1=" + (clientLongitude - 0.02) + "&y2=" + (clientLongitude + 0.02);
    }, function () {});
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
        if(sido.dong!=undefined){
            let htmlSegment = `<li title="${sido.name}" id="${sido.name}"
            value="${sido.code}" onclick="onClickSearch(this)">
                            ${sido.dong}
                        </li>`;
            html += htmlSegment;
        }
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
var infosForMidpart = new Array();

//첫화면 처음에 카테고리 체크되어 있는 그대로 어레이 생성함 8개 다 들어감
$("input[name=cate]").prop("checked", true).each(function (index, item) {
    codeType1.push($(item).val());
});
//재체크 및 해제체크 카테고리 배열 재반영 함수입니다. 현재 선택된 카테고리만 반영될겁니다.
$("input[name=cate]").click(function () {
    if ($(this).prop('checked')) {
        if (!(codeType1.includes($(this).val()))) {//arr에 없으면 재체크니까 추가해
            codeType1.push($(this).val());
        }
    } else {
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
//console.log("첫상권", areaJson, areaJson.length)
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
            closeOverlay()//사이드바 + 마커 일단지워
            if (isAuthenticated) {
                areaInClick(area)//그래프마커윈도우는 로긴시에만 보임
            }
            $('.filterbox').removeClass('on');
            var position = centroid(area.path);
            var data = {
                areaCd: area.area_cd,
                areaSeq: area.area_seq,
                lat : position.Ma,
                lng : position.La
            }
            ajaxPostSyn('/trading-area/analysis/details', data, function (result) {
                //console.log("세부 요청요청", result)
                sideInfo(area, result)//사이드바 표출
            });
            changeAreaTab()
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
    $('#sidebar').addClass('visible');
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

    var sales_comma = sales.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var liv_popul_comma = detail.liv_popul.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var st_popul_comma = detail.st_popul.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var bd_popul_comma = detail.bd_popul.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var ct_apt_com = detail.ct_apt_com.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var ct_apt_hou = detail.ct_apt_hou.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var ct_napt_com = detail.ct_napt_com.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var ct_napt_hou = detail.ct_napt_hou.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var r_popul = detail.r_popul.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var w_popul = detail.w_popul.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    stores = stores.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    open = open.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    close = close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if(detail.r_popul > detail.w_popul){
        var compare = ">";
    }else if(detail.r_popul == detail.w_popul){
        var compare = "=";
    }else {
        var compare = "<";
    }

    if (area) {
        var position = centroid(area.path);
        document.getElementById("sidebar").innerHTML =
            '<div id="sidebody">' +
            // '<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
            '<div class="sideinfo_fixed">' +
            '<div class="sideinfo">' +
            '<div class="areatitle iconPlus">' +
            area.area_name + ' ' + area.area_title +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="margintop"></div>'+
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">상점수</h4>'+
            '<div class="storegray iconPlus">' +
            stores + '개'+
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">개폐업수</h4>'+
            '<div class="storegray iconPlus">' +
            "개업점포수 "+
            '<span class="distance">' +
            open +'개'+
            '</span>' +
            '</div>' +
            '<div class="storeclose iconPlus">' +
            '폐업점포수 ' +
            '<span class="distance">' +
            close +'개'+
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">추정매출</h4>'+
            '<div class="schedule_gray_20dp iconPlus">' +
            '매출이 가장 큰 시간 ' +
            '<span class="distance">' +
            detail.picktime +
            '</span>' +
            '</div>' +
            '<div class="payments_gray_20dp iconPlus">' +
            '매출액 ' +
            '<span class="distance">' +
            sales_comma + '원'+
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">생활인구</h4>'+
            '<div class="groups_gray_20dp iconPlus">' +
            '총 생활인구수 ' +
            '<span class="distance">' +
            liv_popul_comma +'명'+
            '</span>' +
            '</div>' +
            '<div class="side_graph gender">' +
            '<canvas id="genderChart"></canvas>'+
            '</div>'+

            '<ul class="agetabs" id="agetab">'+
            '<li>' +
            '<input type ="radio" name="agetab" value="10" id="age_10" onchange="agetab()" checked>' +
            '<label for="age_10">10대</label>' +
            '</li>'+
            '<li>' +
            '<input type ="radio" name="agetab" value="20" id="age_20" onchange="agetab()">' +
            '<label for="age_20">20대</label>' +
            '</li>'+
            '<li>' +
            '<input type ="radio" name="agetab" value="30" id="age_30" onchange="agetab()">' +
            '<label for="age_30">30대</label>' +
            '</li>'+
            '<li>' +
            '<input type ="radio" name="agetab" value="40" id="age_40" onchange="agetab()">' +
            '<label for="age_40">40대</label>' +
            '</li>'+
            '<li>' +
            '<input type ="radio" name="agetab" value="50" id="age_50" onchange="agetab()">' +
            '<label for="age_50">50대</label>' +
            '</li>'+
            '<li>' +
            '<input type ="radio" name="agetab" value="60" id="age_60" onchange="agetab()">' +
            '<label for="age_60">60대</label>' +
            '</li>'+
            '</ul>'+
            '<div class="groups_gray_20dp iconPlus">' +
            '주중 시간대별 생활인구수' +
            '</div>' +
            '<div class="side_graph living_wd short">' +
            '<canvas id="livingweekday"></canvas>'+
            '</div>'+
            '<div class="groups_gray_20dp iconPlus">' +
            '주말 시간대별 생활인구수' +
            '</div>' +
            '<div class="side_graph living_we short">' +
            '<canvas id="livingweekend"></canvas>'+
            '</div>'+
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">상존인구</h4>'+
            '<div class="person_gray_20dp iconPlus">' +
            '길 단위 ' +
            '<span class="distance">' +
            st_popul_comma  +'명'+
            '</span>' +
            '</div>' +
            '<div class="groups_gray_20dp iconPlus">' +
            '건물 단위 ' +
            '<span class="distance">' +
            bd_popul_comma +'명'+
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">인구 유형별 비중 주거인구</h4>'+
            '<div class="groups_gray_20dp iconPlus">' +
            '주거인구 ' +
            '<span class="distance">' +
            r_popul  +'명 '+
            '</span>' +
            compare +
            ' 직장인구 ' +
            '<span class="distance">' +
            w_popul  +'명'+
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">소비 유형</h4>'+
            '<div class="side_graph">' +
            '<canvas id="consumption"></canvas>'+
            '</div>'+
            '</div>' +
            '<div class="sideinfo">' +
            '<h4 class="sideinfoTitle">아파트</h4>'+
            '<ul id="apttabs" class="tabs">'+
            '<li class="tab_1 current" onclick="apttab1()" data-tab="tab-1">상권</li>'+
            '<li class="tab_2 alley_only" onclick="apttab2()" data-tab="tab-2">배후지</li>'+
            '</ul>'+
            '<div id="tab_1" class="tab-content current">'+
            '<div class="person_gray_20dp iconPlus">' +
            '단지 수 ' +
            '<span class="distance">' +
            ct_apt_com +'세대'+
            '</span>' +
            '</div>' +
            '<div class="person_gray_20dp iconPlus">' +
            '세대 수 ' +
            '<span class="distance">' +
            ct_apt_hou +'명'+
            '</span>' +
            '</div>' +
            '</div>' +
            '<div id="tab_2" class="tab-content">'+
            '<div class="person_gray_20dp iconPlus">' +
            '단지 수 ' +
            '<span class="distance">' +
            ct_napt_com +'세대'+
            '</span>' +
            '</div>' +
            '<div class="person_gray_20dp iconPlus">' +
            '세대 수 ' +
            '<span class="distance">' +
            ct_napt_hou +'명'+
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="sideinfo alley_only">' +
            '<h4 class="sideinfoTitle">상권 안정화 지수</h4>'+
            '<ul id="areatabs" class="tabs">'+
            '<li class="tab_1 current" onclick="areatab1()" data-tab="tab-1">분기별 비교</li>'+
            '<li class="tab_2" onclick="areatab2()" data-tab="tab-2">연도별 비교</li>'+
            '</ul>'+
            '<div id="areatab_1" class="areatab-content current">'+
            '<select name="chartYear" id="chartYear" onChange="updateChartType()">'+
            '<option value="2021">2021년</option>'+
            '<option value="2020">2020년</option>'+
            '<option value="2019">2019년</option>'+
            '<option value="2018">2018년</option>'+
            '<option value="2017">2017년</option>'+
            '</select>'+
            '<div class="side_graph stabilization_quarter short">' +
            '<canvas id="stabilization_quarter"></canvas>'+
            '</div>'+
            '</div>' +
            '<div id="areatab_2" class="areatab-content">'+
            '<div class="side_graph stabilization_yearly short">' +
            '<canvas id="stabilization_yearly"></canvas>'+
            '</div>'+
            '</div>' +
            '</div>' +
            '<div class="sideinfo">' +
            '<button class="analysisBtn" onclick="location.href=`/trading-area/regional?lat=' + position.Ma +'&lng='+ position.La +'`">해당 상권의 지역 정보 확인하기</button>' +
            '</div>' +
            '<div class="toggle_side" onclick="sideNoneVisible()" title="사이드바 숨기기"></div></div>' +
            '<div class="toggle_side side_visible" onclick="sideVisible()" title="사이드바 보이기"></div>';

        if(area.area_title=='골목상권'){
            $('.alley_only').css('display','block')
        }else {
            $('.alley_only').css('display','none')
        }
        if (window.innerWidth < 767) {
            $('#sidebody').addClass('visible_none');
            $('#sidebar').addClass('on');
        }
        //차트 그래프 실행

        //생활인구- 남녀성비 파이그래프
        genderRatio(detail.m_popul,detail.f_popul)


        //생활인구 바 그래프
        weekdaydata10.push(detail.age_10_d_1,detail.age_10_d_2,detail.age_10_d_3,detail.age_10_d_4,detail.age_10_d_5,detail.age_10_d_6)
        weekenddata10.push(detail.age_10_w_1,detail.age_10_w_2,detail.age_10_w_3,detail.age_10_w_4,detail.age_10_w_5,detail.age_10_w_6)
        weekdaydata20.push(detail.age_20_d_1,detail.age_20_d_2,detail.age_20_d_3,detail.age_20_d_4,detail.age_20_d_5,detail.age_20_d_6)
        weekenddata20.push(detail.age_20_w_1,detail.age_20_w_2,detail.age_20_w_3,detail.age_20_w_4,detail.age_20_w_5,detail.age_20_w_6)
        weekdaydata30.push(detail.age_30_d_1,detail.age_30_d_2,detail.age_30_d_3,detail.age_30_d_4,detail.age_30_d_5,detail.age_30_d_6)
        weekenddata30.push(detail.age_30_w_1,detail.age_30_w_2,detail.age_30_w_3,detail.age_30_w_4,detail.age_30_w_5,detail.age_30_w_6)
        weekdaydata40.push(detail.age_40_d_1,detail.age_40_d_2,detail.age_40_d_3,detail.age_40_d_4,detail.age_40_d_5,detail.age_40_d_6)
        weekenddata40.push(detail.age_40_w_1,detail.age_40_w_2,detail.age_40_w_3,detail.age_40_w_4,detail.age_40_w_5,detail.age_40_w_6)
        weekdaydata50.push(detail.age_50_d_1,detail.age_50_d_2,detail.age_50_d_3,detail.age_50_d_4,detail.age_50_d_5,detail.age_50_d_6)
        weekenddata50.push(detail.age_50_w_1,detail.age_50_w_2,detail.age_50_w_3,detail.age_50_w_4,detail.age_50_w_5,detail.age_50_w_6)
        weekdaydata60.push(detail.age_60_d_1,detail.age_60_d_2,detail.age_60_d_3,detail.age_60_d_4,detail.age_60_d_5,detail.age_60_d_6)
        weekenddata60.push(detail.age_60_w_1,detail.age_60_w_2,detail.age_60_w_3,detail.age_60_w_4,detail.age_60_w_5,detail.age_60_w_6)
        //생활인구-주중인구 일단 10대
        weekday(weekdaydata10);
        //생활인구-주말인구 일단 10대
        weekend(weekenddata10);

        //소비유형- 파이그래프
        consumptionRatio(detail.sum_clt_ex, detail.sum_cul_ex, detail.sum_edu_ex, detail.sum_ent_ex, detail.sum_food_ex, detail.sum_lei_ex, detail.sum_med_ex, detail.sum_nec_ex, detail.sum_trp_ex)

        //상권안정화 분기별-라인그래프
        var graph= detail.graph

        for (var i = 0; i < graph.length; i++) {
            var year = graph[i].year;
            if (year == 2021) {
                quarter2021.push(graph[i])
                quarter2021 = quarter2021.sort((a, b) => a.qrt - b.qrt);
            }else if(year==2020){
                quarter2020.push(graph[i])
                quarter2020 = quarter2020.sort((a, b) => a.qrt - b.qrt);
            }else if(year==2019){
                quarter2019.push(graph[i])
                quarter2019 = quarter2019.sort((a, b) => a.qrt - b.qrt);
            }else if(year==2018){
                quarter2018.push(graph[i])
                quarter2018 = quarter2018.sort((a, b) => a.qrt - b.qrt);
            }else if(year==2017){
                quarter2017.push(graph[i])
                quarter2017 = quarter2017.sort((a, b) => a.qrt - b.qrt);
            }
        }
        updateChartType()

        //상권안정화 연도별-라인그래프
        var year2017 = 0;
        var year2018 = 0;
        var year2019 = 0;
        var year2020 = 0;
        var year2021 = 0;

        for (var i = 0; i < graph.length; i++) {
            if(graph[i].year==2021){
                year2021 += graph[i].idx_stb_area;
            }else if(graph[i].year==2020){
                year2020 += graph[i].idx_stb_area;
            }else if(graph[i].year==2019){
                year2019 += graph[i].idx_stb_area;
            }else if(graph[i].year==2018){
                year2018 += graph[i].idx_stb_area;
            }else if(graph[i].year==2017){
                year2017 += graph[i].idx_stb_area;
            }
        }
        var yearly = [year2017,year2018,year2019,year2020,year2021]
        chartYearly(yearly)

    }
}
var quarter2021 =[];
var quarter2020 =[];
var quarter2019 =[];
var quarter2018 =[];
var quarter2017 =[];

var weekdaydata10 = [];
var weekenddata10 = [];
var weekdaydata20 = [];
var weekenddata20 = [];
var weekdaydata30 = [];
var weekenddata30 = [];
var weekdaydata40 = [];
var weekenddata40 = [];
var weekdaydata50 = [];
var weekenddata50 = [];
var weekdaydata60 = [];
var weekenddata60 = [];

function updateChartType(){
    $('#stabilization_quarter').remove();//있던 차트 지우고
    $('.stabilization_quarter').append('<canvas id="stabilization_quarter"><canvas>');//차트id추가

    var year = $('select[name="chartYear"]').val()
    var data=[]
    if (year == 2021) {
        for (var i = 0; i < quarter2021.length; i++) {
            data.push(quarter2021[i].idx_stb_area)
        }
    } else if (year == 2020) {
        for (var i = 0; i < quarter2020.length; i++) {
            data.push(quarter2020[i].idx_stb_area)
        }
    } else if (year == 2019) {
        for (var i = 0; i < quarter2019.length; i++) {
            data.push(quarter2019[i].idx_stb_area)
        }
    } else if (year == 2018) {
        for (var i = 0; i < quarter2018.length; i++) {
            data.push(quarter2018[i].idx_stb_area)
        }
    } else if (year == 2017) {
        for (var i = 0; i < quarter2017.length; i++) {
            data.push(quarter2017[i].idx_stb_area)
        }
    }
    chartQuarter(data)
}

function agetab() {
    $('#livingweekday').remove();//있던 차트 지우고
    $('#livingweekend').remove();//있던 차트 지우고
    $('.living_wd').append('<canvas id="livingweekday"><canvas>');//차트id추가
    $('.living_we').append('<canvas id="livingweekend"><canvas>');//차트id추가
    var value = $('input[name="agetab"]:checked').val();
    //생활인구
    if (value == "10") {
        weekday(weekdaydata10);
        weekend(weekenddata10);
    }else if(value == "20"){
        weekday(weekdaydata20);
        weekend(weekenddata20);
    }else if(value == "30"){
        weekday(weekdaydata30);
        weekend(weekenddata30);
    }else if(value == "40"){
        weekday(weekdaydata40);
        weekend(weekenddata40);
    }else if(value == "50"){
        weekday(weekdaydata50);
        weekend(weekenddata50);
    }else if(value == "60"){
        weekday(weekdaydata60);
        weekend(weekenddata60);
    }
}


//클릭 1차그래프 오버레이닫음
function closeOverlay() {
    weekdaydata10 = [];
    weekenddata10 = [];
    weekdaydata20 = [];
    weekenddata20 = [];
    weekdaydata30 = [];
    weekenddata30 = [];
    weekdaydata40 = [];
    weekenddata40 = [];
    weekdaydata50 = [];
    weekenddata50 = [];
    weekdaydata60 = [];
    weekenddata60 = [];

    quarter2021 =[];
    quarter2020 =[];
    quarter2019 =[];
    quarter2018 =[];
    quarter2017 =[];

    for (var i = 0; i < clickmarkers.length; i++) {
        clickmarkers[i].setMap(null);
    }
    $('#sidebar').removeClass('visible');
    $('#sidebody').remove();//사이드 바디 지우고 다시


}

//클릭 2차그래프 오버레이닫음
function closeOverlaygraph() {
    $('#myChart1').remove();//있던 차트 지우고
    $('.placegraph').removeClass("on")//클래스 지우고
    $('.placegraph').find('#title').removeAttr('class')//"대분류" 업종 순위 -> 타이틀 "색상" 삭제
    $('.placegraph').find('.ranking_list *').remove()
}

//사이드바안에 탭적용 아파트 상권탭
function apttab1(){
    $('ul#apttabs li').removeClass('current');
    $('.tab-content').removeClass('current');
    $('ul#apttabs li.tab_1').addClass('current');
    $("#tab_1").addClass('current');
}
//사이드바안에 탭적용 아파트 배후지탭
function apttab2(){
    $('ul#apttabs li').removeClass('current');
    $('.tab-content').removeClass('current');
    $('ul#apttabs li.tab_2').addClass('current');
    $("#tab_2").addClass('current');
}
//사이드바안에 탭적용 상권안정화 분기별탭
function areatab1(){
    $('ul#areatabs li').removeClass('current');
    $('.areatab-content').removeClass('current');
    $('ul#areatabs li.tab_1').addClass('current');
    $("#areatab_1").addClass('current');
}
//사이드바안에 탭적용 상권안정화 연도별탭
function areatab2(){
    $('ul#areatabs li').removeClass('current');
    $('.areatab-content').removeClass('current');
    $('ul#areatabs li.tab_2').addClass('current');
    $("#areatab_2").addClass('current');
}
//사이드바안에 탭적용


function contentFunc(area) {
    //요상한 그래프 인포윈도우입니다.
    var infos = area.info
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

    if (maincate == "all") {//전체 업종 선택이면 전체내리고 희안한 그래프 뜨는거고
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
            sum_all += parseInt(el.value);
        });
        document.getElementById("resultsum").value = sum_all;
        var sum_all_comma = sum_all.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        var areaTab = $('input[name=areaTab]:checked').val();
        var info2 = area.info2
        var mainpart = '';
        var ranking = '';
        infosForMidpart = infos;
        if (areaTab === "open") {//개업수
            info2 = info2.sort((a, b) => b.open - a.open);
            for (var i = 0; i < info2.length; i++) {
                if (info2[i].open > 0) { //합계가 0이상이면 1개라도 있다는거니깐 표시
                    var sectorname = codeSectorname(info2[i].code)//코드 ->대분류이름 반환
                    mainpart += `<li class="graphlist` + (i + 1) + ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].open + `개<div class="width_chart"></div></span></li>`
                    ranking += `<span class="` + info2[i].code + `">` + sectorname + '<div class="right"> ' + info2[i].open + '개 ' + (i + 1) + `위</div></span>`
                }
            }
        } else if (areaTab === "close") {//폐업수
            info2 = info2.sort((a, b) => b.close - a.close);
            for (var i = 0; i < info2.length; i++) {
                if (info2[i].close > 0) {
                    var sectorname = codeSectorname(info2[i].code)//코드 ->대분류이름 반환
                    mainpart += `<li class="graphlist` + (i + 1) + ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].close + `개<div class="width_chart"></div></span></li>`
                    ranking += `<span class="` + info2[i].code + `">` + sectorname + '<div class="right"> ' + info2[i].close + '개 ' + (i + 1) + `위</div></span>`
                }
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
                if (info2[i].sales > 0) {
                    var sectorname = codeSectorname(info2[i].code)//코드 ->대분류이름 반환

                    var sales_comma = info2[i].sales.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    mainpart += `<li class="graphlist` + (i + 1) + ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + sales_comma + `원<div class="width_chart"></div></span></li>`
                    ranking += `<span class="` + info2[i].code + `">` + sectorname + '<div class="right"> ' + sales_comma + '원 ' + (i + 1) + `위</div></span>`
                }
            }
        } else {//상점수 탭일때
            info2 = info2.sort((a, b) => b.stores - a.stores);
            for (var i = 0; i < info2.length; i++) {
                if (info2[i].stores > 0) {
                    var sectorname = codeSectorname(info2[i].code)//코드 ->대분류이름 반환
                    mainpart += `<li class="graphlist` + (i + 1) + ` ` + info2[i].code + `" onclick="showMidPart('` + info2[i].code + `')"><span>` + info2[i].stores + `개<div class="width_chart"></div></span></li>`
                    ranking += `<span class="` + info2[i].code + `">` + sectorname + '<div class="right"> ' + info2[i].stores + '개 ' + (i + 1) + `위</div></span>`
                }
            }
        }
        var placeranking =
            '<div class="placeinfo2 placeranking">' +
            '<div id="title" >' +
            '전체업종 순위'+
            "</div>" +
            '<div class="close" onclick="closeOverlay()" title="닫기"></div>'+
            '<div class="ranking_list" >' +
            ranking+
            "</div>" +
            '<div class="after"></div>'+
            "</div>" +
            '</div>';
        if (areaTab === "open") {
            if(open==0){
                placeranking ="";
            }
        }else if(areaTab === "close"){
            if(close==0){
                placeranking ="";
            }
        }else if(areaTab === "sales"){
            if(sales==0){
                placeranking ="";
            }
        }else if(areaTab === "stores"){
            if(stores==0){
                placeranking ="";
            }
        }

        stores = stores.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        open = open.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        close = close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
            placeranking+
            '<div class="placeinfo2 placegraph">' +
            '<div id="title">' +
            "</div>" +
            '<div class="close" onclick="closeOverlaygraph()" title="닫기"></div>'+
            '<div class="ranking_list">' +
            "</div>" +
            '<div class="after"></div>'+
            "</div>";
    } else {// 여기는 단일마커임
        if (midcate.includes('all')) {
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
        stores = stores.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        open = open.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        close = close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        document.getElementById("SUM_00_06").value = sum_00_06;
        document.getElementById("SUM_06_11").value = sum_06_11;
        document.getElementById("SUM_11_14").value = sum_11_14;
        document.getElementById("SUM_14_17").value = sum_14_17;
        document.getElementById("SUM_17_21").value = sum_17_21;
        document.getElementById("SUM_21_24").value = sum_21_24;
        const query = 'input[name="timecate"]:checked';
        const selectedEls = document.querySelectorAll(query);
        selectedEls.forEach((el) => {
            sum_all += parseInt(el.value);
        });
        document.getElementById("resultsum").value = sum_all;
        var sum_all_comma = sum_all.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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

//코드 ->대분류이름 반환
function codeSectorname(code){
    if(code=="I"){
        var sectorname = "숙박·음식";
    }else if(code=="S"){
        var sectorname = "수리·개인서비스";
    }else if(code=="G"){
        var sectorname = "도·소매";
    }else if(code=="R"){
        var sectorname = "예술·스포츠·여가";
    }else if(code=="N"){
        var sectorname = "시설관리·임대";
    }else if(code=="M"){
        var sectorname = "과학·기술";
    }else if(code=="L"){
        var sectorname = "부동산";
    }else if(code=="P"){
        var sectorname = "교육";
    }
    return sectorname
}


function areaInClick(area) {
    for (var i = 0; i < clickmarkers.length; i++) {
        clickmarkers[i].setMap(null);
    }//동그란마커 지우고 다시그려
    var content = contentFunc(area)//중심좌표 포지션
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

function areaInhoverFunc(area) {//호버시
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
    if (maincate == "all") {//전체 업종 선택이면 전체내리고
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

    stores = stores.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    open = open.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    close = close.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    document.getElementById("SUM_00_06").value = sum_00_06;
    document.getElementById("SUM_06_11").value = sum_06_11;
    document.getElementById("SUM_11_14").value = sum_11_14;
    document.getElementById("SUM_14_17").value = sum_14_17;
    document.getElementById("SUM_17_21").value = sum_17_21;
    document.getElementById("SUM_21_24").value = sum_21_24;

    const query = 'input[name="timecate"]:checked';
    const selectedEls = document.querySelectorAll(query);
    selectedEls.forEach((el) => {
        sum_all += parseInt(el.value);
    });
    document.getElementById("resultsum").value = sum_all;

    var sum_all_comma = sum_all.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    var position = centroid(area.path);
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
    });
// 생성된 마커를 배열에 추가합니다
    areanameMarkers.push(customOverlay);
// 마커가 지도 위에 표시되도록 설정합니다
    customOverlay.setMap(map);
    changeAreaTab()
}


// 지도중심 이동 시, 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
// kakao.maps.event.addListener(map, 'tilesloaded', changeMap)
var runTimer;

kakao.maps.event.addListener(map, 'idle', function() {
    clearTimeout(runTimer);
    zoom = map.getLevel();
    if (zoom >= 6 && zoom <= 14) {//zoom 6 ~ 14
        changeMap();
    } else if (zoom >= 4 && zoom < 6) {
        // zoom 4,5 일때 보일것:
        // 상권패스  + 커스텀마커( 상권명 + 상점수 )
        //          + 클릭 시 마커위에 그래프 ★★★
        $('#storelist').css('display', 'none'); // 상점 카테고리 삭제
        $('.areaTap').css('display', 'block'); // 상점수,개폐업수,추정매출 탭 보이기
        $('#filter').css('display', 'block'); // 필터 보이기
        $('.area_map').removeClass('on') // 모바일 맵 사이즈 조정

        if(countmarkers.length>0){ //시군구 마커 비우고
            for (var i = 0; i < countmarkers.length; i++) {
                countmarkers[i].setMap(null);
            }
        }
        if(markers.length>0){
            setMarkers(null)//상점삭제
        }
        // do something
        runTimer = setTimeout(function() {
            changeMap();
        }, 1000);
    } else { //level < 4, zoom 3,2,1 일때
        $('#storelist').css('display', 'block');        // 상점 카테고리
        // do something
        runTimer = setTimeout(function() {
            changeMap();
        }, 1000);
    }
});

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

    if (zoom >= 6 && zoom <= 14) {//zoom 6 ~ 14
        //시도,시군구 단위 자체 마커
        removePolygons(map)// 상권 삭제
        $('#sidebar').removeClass('visible');
        for (var i = 0; i < clickmarkers.length; i++) {
            clickmarkers[i].setMap(null);
        }
        for (var i = 0; i < areanameMarkers.length; i++) {
            areanameMarkers[i].setMap(null);//상권이름 마커 비우고
        }
        $('.areaTap').css('display', 'none');
        $('#filter').css('display', 'none');
        $('.area_map').addClass('on')
        for (var i = 0; i < countmarkers.length; i++) {
            countmarkers[i].setMap(null);//시군구, 시도마커 비우고
        }
        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            resultSpread(result)//다시그려
        });
    } else if (zoom >= 4 && zoom < 6) {


        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            //console.log("이게 상권데이터 갖고오는거임", result)
            removePolygons(map)//areajson에 쓰던 상권 삭제하고
            for (var i = 0; i < areanameMarkers.length; i++) {
                areanameMarkers[i].setMap(null);//상권이름 마커 비우고
            }
            areaJson = result;
            areaSpread(areaJson);//상권 패스 다시 그려줌
            for (var i = 0, len = areaJson.length; i < len; i++) {
                areanameSpread(areaJson[i]);// 상권이름그려줌
            }
            changeAreaTab()//탭변경
        });

    } else { //level < 4, zoom 3,2,1 일때

        setMarkers(null)
        ajaxPostSyn('/trading-area/analysis/shop', datalat, function (result) {
            //console.log("상점 데이터 뿌려주기", result)
            storeSpread(result)//상점 찍기
        });

        ajaxPostSyn('/trading-area/analysis/area', datalat, function (result) {
            //console.log("이게 상권데이터 갖고오는거임", result)
            removePolygons(map)//areajson에 쓰던 상권 삭제하고
            for (var i = 0; i < areanameMarkers.length; i++) {
                areanameMarkers[i].setMap(null);//상권이름 마커 비우고
            }
            areaJson = result;
            if(result.length>0) {
                areaSpread(areaJson);//상권 패스 다시 그려줌
                for (var i = 0, len = areaJson.length; i < len; i++) {
                    areanameSpread(areaJson[i]);// 상권이름 그려줌
                }
                changeAreaTab()//탭변경
            }
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



//필터 대분류 중분류 체크
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

//탭바뀌면 사이드바+그래프마커윈도우 닫음
$('input[name="areaTab"], input[name="cate2"]').click(function () {
    closeOverlay()
})
//필터바뀌면 걍다 닫기
$('input[name="timecate"], input[name="area_maincate"], input[name="area_midcate"]').click(function () {
    closeOverlay()//사이드바 + 그래프마커 일단지워
    for (var i = 0; i < areanameMarkers.length; i++) {
        areanameMarkers[i].setMap(null);//상권이름 마커 비우고
    }
    for (var i = 0, len = areaJson.length; i < len; i++) {
        areanameSpread(areaJson[i]);//상권이름 다시 그림
    }
    changeAreaTab()
})

function showMidPart(code) {
    var code = code;
    var ranking2="";
    var tempArr = new Array();
    for (var i = 0; i < infosForMidpart.length; i++) {
        if (infosForMidpart[i].code === code) {
            tempArr.push(infosForMidpart[i]);
        }
    }
    var areaTab = $('input[name=areaTab]:checked').val();
    if (areaTab === "open") {//개업수
        tempArr = tempArr.sort((a, b) => b.ct_open - a.ct_open);

        var opencolor = [];
        for (var i = 0; i < tempArr.length; i++) {
            ranking2 += `<span class="` + tempArr[i].code + `">` + tempArr[i].com_nm +'<div class="right"> '+ tempArr[i].ct_open +'개 '+ (i+1)+`위</div></span>`
            opencolor.push(tempArr[i].ct_open);
        }
        var barColors = opencolor.map((value) =>
            value > 20 ? 'rgba(255, 255, 255, 0.1)' :
                value > 10 ? 'rgba(255, 255, 255, 0.15)' :
                    value > 6 ? 'rgba(255, 255, 255, 0.2)' :
                        value > 5 ? 'rgba(255, 255, 255, 0.25)' :
                            value > 4 ? 'rgba(255, 255, 255, 0.3)' :
                                value > 3 ? 'rgba(255, 255, 255, 0.4)' :
                                    value > 2 ? 'rgba(255, 255, 255, 0.5)' :
                                        value > 1 ? 'rgba(255, 255, 255, 0.6)' :
                                            'rgba(255, 255, 255, 0.7)');
        //1)원래 차트있던거ㅡ지우고
        closeOverlaygraph()
        //2)2차그래프-1.차트그리기
        $('.graphmenu>li.'+ code +'>span>div').append('<canvas id="myChart1"><canvas>');//차트id추가
        chartjs(opencolor,barColors)//개업수 2차그래프 차트그리기
        //2)2차그래프-2.인포윈도 위에 그리기
        drawSecondGraph(code,ranking2)//2차 그래프 인포 그리기

    } else if (areaTab === "close") {//폐업수
        tempArr = tempArr.sort((a, b) => b.ct_close - a.ct_close);

        var closecolor = [];
        for (var i = 0; i < tempArr.length; i++) {
            ranking2 += `<span class="` + tempArr[i].code + `">` + tempArr[i].com_nm +'<div class="right"> '+ tempArr[i].ct_close +'개 '+ (i+1)+`위</div></span>`
            closecolor.push(tempArr[i].ct_close);
        }
        var barColors = closecolor.map((value) =>
            value > 30 ? 'rgba(255, 255, 255, 0.1)' :
                value > 10 ? 'rgba(255, 255, 255, 0.15)' :
                    value > 6 ? 'rgba(255, 255, 255, 0.2)' :
                        value > 5 ? 'rgba(255, 255, 255, 0.25)' :
                            value > 4 ? 'rgba(255, 255, 255, 0.3)' :
                                value > 3 ? 'rgba(255, 255, 255, 0.4)' :
                                    value > 2 ? 'rgba(255, 255, 255, 0.5)' :
                                        value > 1 ? 'rgba(255, 255, 255, 0.6)' :
                                            'rgba(255, 255, 255, 0.7)');
        //1)원래 차트있던거ㅡ지우고
        closeOverlaygraph()
        //2)2차그래프-1.차트그리기
        $('.graphmenu>li.'+ code +'>span>div').append('<canvas id="myChart1"><canvas>');//차트id추가
        chartjs(closecolor,barColors)//폐업수 2차그래프 차트그리기
        //2)2차그래프-2.인포윈도 위에 그리기
        drawSecondGraph(code,ranking2)//2차 그래프 인포 그리기

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

        var salescolor = [];
        for (var i = 0; i < tempArr.length; i++) {
            var sales_comma = tempArr[i].sales.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            ranking2 += `<span class="` + tempArr[i].code + `">` + tempArr[i].com_nm +'<div class="right"> '+ sales_comma +'원 '+ (i+1)+`위</div></span>`
            salescolor.push(tempArr[i].sales);
        }
        var barColors = salescolor.map((value) =>
            value > 21474836470000 ? 'rgba(255, 255, 255, 0.1)' :
                value > 2147483647000 ? 'rgba(255, 255, 255, 0.15)' :
                    value > 214748364700 ? 'rgba(255, 255, 255, 0.2)' :
                        value > 21474836470 ? 'rgba(255, 255, 255, 0.25)' :
                            value > 2147483647 ? 'rgba(255, 255, 255, 0.3)' :
                                value > 514281240 ? 'rgba(255, 255, 255, 0.4)' :
                                    value > 51428120 ? 'rgba(255, 255, 255, 0.5)' :
                                        value > 1592617 ? 'rgba(255, 255, 255, 0.6)' :
                                            'rgba(255, 255, 255, 0.7)');
        //1)원래 차트있던거ㅡ지우고
        closeOverlaygraph()
        //2)2차그래프-1.차트그리기
        $('.graphmenu>li.'+ code +'>span>div').append('<canvas id="myChart1"><canvas>');//차트id추가
        chartjs(salescolor,barColors)//추정매출 2차그래프 차트그리기
        //2)2차그래프-2.인포윈도 위에 그리기
        drawSecondGraph(code,ranking2)//2차 그래프 인포 그리기

    } else {//상점수 탭일때
        tempArr = tempArr.sort((a, b) => b.ct_shop - a.ct_shop);

        var shopcolor = [];
        for (var i = 0; i < tempArr.length; i++) {
            ranking2 += `<span class="` + tempArr[i].code + `">` + tempArr[i].com_nm +'<div class="right"> '+ tempArr[i].ct_shop +'개 '+ (i+1)+`위</div></span>`
            shopcolor.push(tempArr[i].ct_shop);
        }
        var barColors = shopcolor.map((value) =>
            value > 1000 ? 'rgba(255, 255, 255, 0.1)' :
                value > 100 ? 'rgba(255, 255, 255, 0.15)' :
                    value > 50 ? 'rgba(255, 255, 255, 0.2)' :
                        value > 20 ? 'rgba(255, 255, 255, 0.25)' :
                            value > 10 ? 'rgba(255, 255, 255, 0.3)' :
                                value > 5 ? 'rgba(255, 255, 255, 0.4)' :
                                    value > 3 ? 'rgba(255, 255, 255, 0.5)' :
                                        value > 1 ? 'rgba(255, 255, 255, 0.6)' :
                                            'rgba(255, 255, 255, 0.7)');
        //1)원래 차트있던거ㅡ지우고
        closeOverlaygraph()
        //2)2차그래프-1.차트그리기
        $('.graphmenu>li.'+ code +'>span>div').append('<canvas id="myChart1"><canvas>');//차트id추가
        chartjs(shopcolor,barColors)//상점수 2차그래프 차트그리기
        //2)2차그래프-2.인포윈도 위에 그리기
        drawSecondGraph(code,ranking2)//2차 그래프 인포 그리기
    }

}
function drawSecondGraph(code,ranking2){
    //2차그래프 2.인포윈도 위에 그리기
    $('.placegraph').addClass("on")
    $('.placegraph').find('#title').addClass(code)//"대분류" 업종 순위 -> 타이틀 "색상" 추가
    var sectorname = codeSectorname(code)//코드 -> 대분류이름 반환
    $('.placegraph').find('#title').html(sectorname+' 순위')//"대분류" 업종 순위 ->타이틀 "제목" 추가
    $('.placegraph').find('.ranking_list').append(ranking2)//랭킹리스트에 리스트업
}

//2차그래프 차트js그리기
function chartjs(color, barColors){
    new Chart("myChart1", {
        type: "doughnut",
        data: {
            //labels: datashop.com_nm,
            datasets: [{
                backgroundColor: barColors,
                borderWidth: 0.4,
                data: color,
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            cutoutPercentage: 50,
            parsing: {
                xAxisKey: 'color'
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return precentage + "%";
                    }
                }
            }
        }
    });
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

//사이드바 4.생활인구- 남녀성비 파이그래프
function genderRatio(m_popul, f_popul){
    var dataset = {
        label: "생활인구: 남녀비율",
        backgroundColor: ['#28c3d7', '#FF6384'],//라벨별 컬러설정
        borderColor: '#fff',
        data: [m_popul,f_popul]
    }
    var labels=['남자','여자'];
    var datasets={ datasets:[dataset], labels:labels }
    var config = {
        type: 'pie',
        data: datasets, //데이터 셋
        options: {
            responsive: true,
            maintainAspectRatio: false, //true 하게 되면 캔버스 width,height에 따라 리사이징된다.
            legend: {
                display: false
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
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label +" "+ precentage + "% "+ currentValue_comma + "명" ;
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
    var canvas=document.getElementById('genderChart');
    var genderChart = new Chart(canvas,config);
}

//사이드바 소비유형 - 파이그래프
function consumptionRatio(n1,n2,n3,n4,n5,n6,n7,n8,n9){
    var dataset = {
        label: "소비유형",
        backgroundColor: ['#70C14A','#33CC94','#31C3D9','#4983C4','#A25AA1','#DD4C79','#EE5545','#F28728','#E6B211'],//라벨별 컬러설정
        borderColor: '#fff',
        data: [n1,n2,n3,n4,n5,n6,n7,n8,n9]
    }
    var labels=['의류','문화','교육','유흥','식료품','여가','의료비','생활용품','교통'];
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
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return label +" "+ precentage + "% "+ currentValue_comma + "원" ;
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
    var canvas=document.getElementById('consumption');
    var consumption = new Chart(canvas,config);
}

function resetWeekChart(){
    $('#livingweekday').remove();//있던 차트 지우고
    $('#livingweekend').remove();//있던 차트 지우고
}

function config(data){
    var config={
        type: 'bar',
        data: {
            labels: ["00:00~00:06", "06:00~11:00", "11:00~14:00", "14:00~17:00", "17:00~21:00", "21:00~24:00"],
            datasets: [
                {
                    backgroundColor: "#709BFF",
                    data: data
                }
            ]
        },
        options: {
            legend: { display: false },
        }
    }
    return config
}

function weekday(data){
    new Chart(document.getElementById("livingweekday"), {
        type: 'bar',
        data: {
            labels: ["00:00~00:06", "06:00~11:00", "11:00~14:00", "14:00~17:00", "17:00~21:00", "21:00~24:00"],
            datasets: [
                {
                    backgroundColor: "#709BFF",
                    data: data
                }
            ]
        },
        options: {
            legend: { display: false },
            maintainAspectRatio: false,
        }
    });
}

function weekend(data){
    new Chart(document.getElementById("livingweekend"), {
        type: 'bar',
        data: {
            labels: ["00:00~00:06", "06:00~11:00", "11:00~14:00", "14:00~17:00", "17:00~21:00", "21:00~24:00"],
            datasets: [
                {
                    backgroundColor: "#709BFF",
                    data: data
                }
            ]
        },
        options: {
            legend: { display: false },
            maintainAspectRatio: false,
        }
    });
}

//상권안정화 분기별-라인그래프
function chartQuarter(data){
    new Chart(document.getElementById("stabilization_quarter"), {
        type: 'line',
        data: {
            labels: ["1분기", "2분기", "3분기", "4분기"],
            datasets: [
                {
                    borderColor:"#1540BF",
                    fill: false,
                    data: data
                }
            ]
        },
        options: {
            legend: { display: false },
        }
    });
}
//상권안정화 연도별-라인그래프
function chartYearly(data){
    new Chart(document.getElementById("stabilization_yearly"), {
        type: 'line',
        data: {
            labels: ["2017", "2018", "2019", "2020", "2021"],
            datasets: [
                {
                    borderColor:"#1540BF",
                    fill: false,
                    data: data
                }
            ]
        },
        options: {
            legend: { display: false },
        }
    });
}