var zoom, mapDefaultLevel = 5;
var clientLatitude = 37.49068266308499;
var clientLongitude = 127.05611940441852;

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(clientLatitude, clientLongitude), // 지도의 중심좌표
        level: mapDefaultLevel // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

var mapWidth =  mapContainer.style.width;
var mapHeight =  mapContainer.style.height;
console.log("width : "  + mapWidth + ", height : " + mapHeight)
console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng()+ " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())

var shops = [];
for (var i = 0; i < shopList.length; i++) {
    var position = new kakao.maps.LatLng(shopList[i].latitude, shopList[i].longitude);
    var imageSize = new kakao.maps.Size(5, 5); // 마커 이미지의 크기
    var markerImage = new kakao.maps.MarkerImage("/images/new/area/marker01.png", imageSize);
    var marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
    });
    shops.push(marker);
    marker.setMap(map);
}

const reportConfirmModal = document.getElementById('report_confirm_wrap')

var circles = [];
var customOverlays = [];
var meter = 300;
var clicked = false;

kakao.maps.event.addListener(map, 'mousemove', function(mouseEvent) {
    if (!clicked) {
        for (var i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }

        var circle = new kakao.maps.Circle({
            center : mouseEvent.latLng,  // 원의 중심좌표 입니다
            radius: meter, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: '#75B8FA', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#CFE7FF', // 채우기 색깔입니다
            fillOpacity: 0.7  // 채우기 불투명도 입니다
        });

        circles.push(circle);
        circle.setMap(map);

    }
});

var ractangles = [];
var grids = [];

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    if (clicked) {
        clicked = false;
        map.setZoomable(true);

        for (var i = 0; i < customOverlays.length; i++) {
            customOverlays[i].setMap(null);
        }

        for (var i = 0; i < ractangles.length; i++) {
            ractangles[i].setMap(null);
        }

        for (var i = 0; i < grids.length; i++) {
            grids[i].setMap(null);
        }

        map.setCenter(mouseEvent.latLng);
        map.setLevel(zoom);
    } else {
        reportConfirmModal.style.display = "block"

        map.setZoomable(false);
        zoom = map.getLevel();
        console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng()+ " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())
        clicked = true;

        map.setCenter(mouseEvent.latLng);
        map.setLevel(4);

        // x1 = map.getBounds().getSouthWest().getLat();
        // x2 = map.getBounds().getNorthEast().getLat();
        // y1 = map.getBounds().getSouthWest().getLng();
        // y2 = map.getBounds().getNorthEast().getLng();
        var lat = map.getCenter().getLat();
        var lng = map.getCenter().getLng();

        $("input:checkbox[name='depth1']:checked").each(function(){

            if($(this).val() === 'report') {
                // 보고서 모달 창

            } else if ($(this).val() === 'density') {
                var density_scope = [];

                // $("input:checkbox[name='depth2_density']:checked").each(function(){
                //     density_scope.push("'" + $(this).val() + "'")
                // })
                // var scope = density_scope.join();

                var scope = "'F'";

                var data = {
                    lat, lng, meter, scope
                };

                ajaxPostSyn('/commerce/area-heatmap', data, function (result) {

                    console.log(result)

                    var content = '<div><img src="data:image/png;base64,' + result.blob + '" alt="heatMap"></div>';

                    var customOverlay = new kakao.maps.CustomOverlay({
                        position: new kakao.maps.LatLng(result.x2 - 0.00023, result.y1),
                        content: content
                    });
                    customOverlays.push(customOverlay)
                    customOverlay.setMap(map);


                    var sw = new kakao.maps.LatLng(result.x1, result.y2), // 사각형 영역의 남서쪽 좌표
                        ne = new kakao.maps.LatLng(result.x2, result.y1); // 사각형 영역의 북동쪽 좌표
                    var rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);
                    var rectangle = new kakao.maps.Rectangle({
                        bounds: rectangleBounds, // 그려질 사각형의 영역정보입니다
                        strokeWeight: 4, // 선의 두께입니다
                        strokeColor: '#FF3DE5', // 선의 색깔입니다
                        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                        strokeStyle: 'shortdashdot', // 선의 스타일입니다
                        fillColor: '#FF8AEF', // 채우기 색깔입니다
                        fillOpacity: 0 // 채우기 불투명도 입니다
                    });
                    ractangles.push(rectangle)
                    rectangle.setMap(map);
                });
            } else if ($(this).val() === 'land') {

                var latInterval = 0.000909 * (meter/100);
                var lngInterval = 0.001125 * (meter/100);
                var x1 = lat - latInterval;
                var x2 = lat + latInterval;
                var y1 = lng - lngInterval;
                var y2 = lng + lngInterval;

                var data = {
                    lat, lng, meter, x1, x2, y1, y2
                };

                $("input:checkbox[name='depth2_land']:checked").each(function(){
                    if ($(this).val() === 'gradient') {

                        ajaxPostSyn('/commerce/area-gradient', data, function (result) {
                            for (var i = 0; i < result.grid.length; i++) {
                                var check = false;

                                for (var j = 0; j < result.grid[i].path.length; j++) {

                                    var line = new kakao.maps.Polyline();

                                    var path = [ new kakao.maps.LatLng(result.grid[i].path[j].latitude, result.grid[i].path[j].longitude), new kakao.maps.LatLng(lat, lng) ];
                                    line.setPath(path);

                                    // 마커와 원의 중심 사이의 거리
                                    var dist = line.getLength();

                                    // 이 거리가 원의 반지름보다 작거나 같다면
                                    if (dist <= meter) {
                                        check = true;
                                        break;
                                    }
                                }

                                if (check) {
                                    var points = [];
                                    $.each(result.grid[i].path, function (index, item) {
                                        points.push(new kakao.maps.LatLng(item.latitude, item.longitude));
                                    })

                                    var grid = new kakao.maps.Polygon({
                                        path: points, // 그려질 다각형의 좌표 배열입니다
                                        strokeWeight: 3, // 선의 두께입니다
                                        strokeColor: '#39DE2A', // 선의 색깔입니다
                                        strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                                        strokeStyle: 'longdash', // 선의 스타일입니다
                                        fillColor: '#A2FF99', // 채우기 색깔입니다
                                        fillOpacity: 0.7 // 채우기 불투명도 입니다
                                    });

                                    grid.setMap(map);
                                    grids.push(grid)

                                }

                            }

                        })
                    }
                })

            }

        })

    }
});


$("input:radio[name=meter]").click(function(){
    if($("input:radio[name=meter]:checked").val() ==='300'){
        meter = 300;
    }else{
        meter = 500;
    }
});

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


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 지오코딩

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

//시간딜레이 함수
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
