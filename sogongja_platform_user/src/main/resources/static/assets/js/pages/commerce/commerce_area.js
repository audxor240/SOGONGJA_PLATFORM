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

var mapWidth = mapContainer.style.width;
var mapHeight = mapContainer.style.height;

console.log("lat : " + map.getCenter().getLat() + " lng : " + map.getCenter().getLng() + " x1 : " + map.getBounds().getSouthWest().getLat() + " x2 : " + map.getBounds().getNorthEast().getLat() + " y1 : " + map.getBounds().getSouthWest().getLng() + " y2 : " + map.getBounds().getNorthEast().getLng())

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

kakao.maps.event.addListener(map, 'mousemove', function (mouseEvent) {

    if (!clicked && window.innerWidth > 767) {
        console.log(window.innerWidth);
        for (var i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }

        var circle = new kakao.maps.Circle({
            center: mouseEvent.latLng,  // 원의 중심좌표 입니다
            radius: meter, // 미터 단위의 원의 반지름입니다
            strokeWeight: 2, // 선의 두께입니다
            strokeColor: '#1540bf', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'inline', // 선의 스타일 입니다
            fillColor: '#000000', // 채우기 색깔입니다
            fillOpacity: 0.3  // 채우기 불투명도 입니다
        });

        circles.push(circle);
        circle.setMap(map);

    }
});

var ractangles = [];
var grids = [];


// mapContainer.addEventListener('touchstart', function (e) {
//     if (window.innerWidth < 767) {
//
//     }
//     console.log('touchstart');
//     console.log(e.touches[0].screenX + " , " + e.touches[0].screenY)
//
//     var mapProjection = map.getProjection(),
//         point = new kakao.maps.Point(e.touches[0].screenX, e.touches[0].screenY);
//     console.log(mapProjection.coordsFromContainerPoint(point));
//     var point_temp = mapProjection.coordsFromContainerPoint(point);
//
//     var circle = new kakao.maps.Circle({
//         center : new kakao.maps.LatLng(point_temp.Ma, point_temp.La),  // 원의 중심좌표 입니다
//         radius: meter, // 미터 단위의 원의 반지름입니다
//         strokeWeight: 5, // 선의 두께입니다
//         strokeColor: '#75B8FA', // 선의 색깔입니다
//         strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
//         strokeStyle: 'dashed', // 선의 스타일 입니다
//         fillColor: '#CFE7FF', // 채우기 색깔입니다
//         fillOpacity: 0.7  // 채우기 불투명도 입니다
//     });
//
//     circles.push(circle);
//     circle.setMap(map);
// });


kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

    if (clicked) {
        clicked = false;
        map.setZoomable(true);
        map.setDraggable(true);

        for (var i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }

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


        if (window.innerWidth > 767) {
            map.setZoomable(false);
            map.setDraggable(false);
            zoom = map.getLevel();
            clicked = true;


            map.setCenter(mouseEvent.latLng);
            map.setLevel(4);


            var lat = map.getCenter().getLat();
            var lng = map.getCenter().getLng();


            $("input:checkbox[name='depth1']:checked").each(function () {

                if ($(this).val() === 'report') {
                    // 보고서 모달 창

                } else if ($(this).val() === 'density') {
                    var density_scope = [];

                    // $("input:checkbox[name='depth2_density']:checked").each(function(){
                    //     density_scope.push("'" + $(this).val() + "'")
                    // })
                    // var scope = density_scope.join();

                    var scope = "'F'";

                    var x1 = map.getBounds().getSouthWest().getLat() + 0.000272;
                    var x2 = map.getBounds().getNorthEast().getLat() - 0.000272;
                    var y1 = map.getBounds().getSouthWest().getLng() + 0.000281;
                    var y2 = map.getBounds().getNorthEast().getLng() - 0.000281;
                    var mode = "web";

                    var data = {
                        lat, lng, meter, scope, x1, x2, y1, y2, mode
                    };

                    ajaxPostSyn('/commerce/area-heatmap', data, function (result) {

                        console.log(result)

                        var content = '<div><img src="data:image/png;base64,' + result.blob + '" alt="heatMap"></div>';

                        var customOverlay = new kakao.maps.CustomOverlay({
                            position: new kakao.maps.LatLng(x2, y1),
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

                    var latInterval = 0.000909 * (meter / 100);
                    var lngInterval = 0.001125 * (meter / 100);
                    var x1 = lat - latInterval;
                    var x2 = lat + latInterval;
                    var y1 = lng - lngInterval;
                    var y2 = lng + lngInterval;

                    var data = {
                        lat, lng, meter, x1, x2, y1, y2
                    };

                    $("input:checkbox[name='depth2_land']:checked").each(function () {
                        if ($(this).val() === 'gradient') {
                            console.log(":::");
                            ajaxPostSyn('/commerce/area-gradient', data, function (result) {
                                for (var i = 0; i < result.grid.length; i++) {
                                    var check = false;

                                    for (var j = 0; j < result.grid[i].path.length; j++) {

                                        var line = new kakao.maps.Polyline();

                                        var path = [new kakao.maps.LatLng(result.grid[i].path[j].latitude, result.grid[i].path[j].longitude), new kakao.maps.LatLng(lat, lng)];
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
        } else {
            map.setZoomable(false);
            map.setDraggable(false);
            zoom = map.getLevel();
            clicked = true;

            map.setCenter(mouseEvent.latLng);
            if (meter == 500) {
                map.setLevel(5);
            } else {
                map.setLevel(4);
            }

            var lat = map.getCenter().getLat();
            var lng = map.getCenter().getLng();

            $("input:checkbox[name='depth1']:checked").each(function () {

                if ($(this).val() === 'report') {
                    // 보고서 모달 창
                    var circle = new kakao.maps.Circle({
                        center: new kakao.maps.LatLng(lat, lng),  // 원의 중심좌표 입니다
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
                } else if ($(this).val() === 'density') {
                    var density_scope = [];

                    // $("input:checkbox[name='depth2_density']:checked").each(function(){
                    //     density_scope.push("'" + $(this).val() + "'")
                    // })
                    // var scope = density_scope.join();

                    var scope = "'F'";

                    var x1 = map.getBounds().getSouthWest().getLat() + 0.000272;
                    var x2 = map.getBounds().getNorthEast().getLat() - 0.000272;
                    var y1 = map.getBounds().getSouthWest().getLng() + 0.000281;
                    var y2 = map.getBounds().getNorthEast().getLng() - 0.000281;
                    var mode = "app";

                    var data = {
                        lat, lng, meter, scope, x1, x2, y1, y2, mode
                    };

                    ajaxPostSyn('/commerce/area-heatmap', data, function (result) {

                        console.log(result)
                        var content = '<div><img src="data:image/png;base64,' + result.blob + '" alt="heatMap"></div>';


                        var customOverlay = new kakao.maps.CustomOverlay({
                            position: new kakao.maps.LatLng(x2, y1),
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

                    var latInterval = 0.000909 * (meter / 100);
                    var lngInterval = 0.001125 * (meter / 100);
                    var x1 = lat - latInterval;
                    var x2 = lat + latInterval;
                    var y1 = lng - lngInterval;
                    var y2 = lng + lngInterval;

                    var data = {
                        lat, lng, meter, x1, x2, y1, y2
                    };

                    $("input:checkbox[name='depth2_land']:checked").each(function () {
                        if ($(this).val() === 'gradient') {

                            ajaxPostSyn('/commerce/area-gradient', data, function (result) {
                                for (var i = 0; i < result.grid.length; i++) {
                                    var check = false;

                                    for (var j = 0; j < result.grid[i].path.length; j++) {

                                        var line = new kakao.maps.Polyline();

                                        var path = [new kakao.maps.LatLng(result.grid[i].path[j].latitude, result.grid[i].path[j].longitude), new kakao.maps.LatLng(lat, lng)];
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

    }


});


$("input:radio[name=meter]").click(function () {
    if ($("input:radio[name=meter]:checked").val() === '300') {
        meter = 300;
    } else {
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

$('.dif').click(function () {
    $('.msearch_pop').addClass('on')
})
$('.search_pop_del').click(function () {
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

        if (guArr.length > 1) {
            gu = guArr[0];
        }
    }
}

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
        if (sido.dong != undefined) {
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
    if ($('.addrlist>ul').hasClass("menu_selected") == true) {
        sidoBox.className = '';
        sigunguBox.className = '';
        dongBox.className = '';
    } else {
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


//map 컨트롤러
// 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
function setMapType(maptype) {
    var roadmapControl = document.getElementById('btnRoadmap');
    var skyviewControl = document.getElementById('btnSkyview');
    if (maptype === 'roadmap') {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
    } else {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
    }
}

//로드맵
var overlayOn = false, // 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
    container = document.getElementById('container')

var mapCenter = new kakao.maps.LatLng(33.45042 , 126.57091), // 지도의 중심좌표
    mapOption = {
        center: mapCenter, // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
var rvWrapper = document.getElementById('rvWrapper')
var rvContainer = document.getElementById('roadview')

// 로드뷰 객체를 생성합니다
var rv = new kakao.maps.Roadview(rvContainer);

// 좌표로부터 로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체를 생성합니다
var rvClient = new kakao.maps.RoadviewClient();

// 로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트를 등록합니다
kakao.maps.event.addListener(rv, 'position_changed', function() {

    // 현재 로드뷰의 위치 좌표를 얻어옵니다
    var rvPosition = rv.getPosition();

    // 지도의 중심을 현재 로드뷰의 위치로 설정합니다
    map.setCenter(rvPosition);

    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태이면
    if(overlayOn) {
        // 마커의 위치를 현재 로드뷰의 위치로 설정합니다
        marker2.setPosition(rvPosition);
    }
});

// 마커 이미지를 생성합니다
var markImage2 = new kakao.maps.MarkerImage(
    'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
    new kakao.maps.Size(26, 46),
    {
        // 스프라이트 이미지를 사용합니다.
        // 스프라이트 이미지 전체의 크기를 지정하고
        spriteSize: new kakao.maps.Size(1666, 168),
        // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
        // background-position으로 지정하는 값이며 부호는 반대입니다.
        spriteOrigin: new kakao.maps.Point(705, 114),
        offset: new kakao.maps.Point(13, 46)
    }
);

// 드래그가 가능한 마커를 생성합니다
var marker2 = new kakao.maps.Marker({
    image : markImage2,
    position: mapCenter,
    draggable: true
});

var iwContent = '<div onclick="openRoadView()" style="width: 148px;font-size: 13px; padding: 5px; text-align: center; cursor: pointer;font-weight: 500; color: #606060">로드뷰 보기</div>',
    iwPosition = new kakao.maps.LatLng(33.45042 , 126.57091); //인포윈도우 표시 위치입니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    position : iwPosition,
    content : iwContent
});

// 로드뷰 열기
function openRoadView(){
    var position = marker2.getPosition();

    // 마커가 놓인 위치를 기준으로 로드뷰를 설정합니다
    toggleRoadview(position);
}

kakao.maps.event.addListener(marker2, 'dragstart', function(mouseEvent) {
    infowindow.close()
})
// 마커에 dragend 이벤트를 등록합니다
kakao.maps.event.addListener(marker2, 'dragend', function(mouseEvent) {
    // 현재 마커가 놓인 자리의 좌표입니다
    var position = marker2.getPosition();

    //창 위치 변경
    infowindow.open(map, marker2);
    infowindow.setPosition(position)

    // // 마커가 놓인 위치를 기준으로 로드뷰를 설정합니다
    // toggleRoadview(position);
});

//지도에 클릭 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent){

    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태가 아니면 클릭이벤트를 무시합니다
    if(!overlayOn) {
        return;
    }

    // 클릭한 위치의 좌표입니다
    var position = mouseEvent.latLng;

    // 마커를 클릭한 위치로 옮깁니다
    marker2.setPosition(position);
    infowindow.setPosition(position)


    // // 클락한 위치를 기준으로 로드뷰를 설정합니다
    // toggleRoadview(position);
});

// 전달받은 좌표(position)에 가까운 로드뷰의 파노라마 ID를 추출하여
// 로드뷰를 설정하는 함수입니다
function toggleRoadview(position){
    rvClient.getNearestPanoId(position, 50, function(panoId) {
        // 파노라마 ID가 null 이면 로드뷰를 숨깁니다
        console.log(`panoId ${panoId}`)
        if (panoId === null) {
            toggleMapWrapper(true, position);
        } else {
            toggleMapWrapper(false, position);

            // panoId로 로드뷰를 설정합니다
            rv.setPanoId(panoId, position);
        }
    });
}

// 지도를 감싸고 있는 div의 크기를 조정하는 함수입니다
function toggleMapWrapper(active, position) {
    console.log(`active ${active}`)
    if (active) {
        rvWrapper.style.display = 'none'

        // 지도를 감싸고 있는 div의 너비가 100%가 되도록 class를 변경합니다
        container.className = '';

        // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출합니다
        map.relayout();

        // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정합니다
        map.setCenter(position);
    } else {

        // 지도만 보여지고 있는 상태이면 지도의 너비가 50%가 되도록 class를 변경하여
        // 로드뷰가 함께 표시되게 합니다
        if (container.className.indexOf('view_roadview') === -1) {
            container.className = 'view_roadview';
            rvWrapper.style.display = 'block'

            // 지도의 크기가 변경되었기 때문에 relayout 함수를 호출합니다
            map.relayout();

            // 지도의 너비가 변경될 때 지도중심을 입력받은 위치(position)로 설정합니다
            map.setCenter(position);
        }
    }
}

// 지도 위의 로드뷰 도로 오버레이를 추가,제거하는 함수입니다
function toggleOverlay(active) {
    if (active) {
        overlayOn = true;

        // 지도 위에 로드뷰 도로 오버레이를 추가합니다
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위에 마커를 표시합니다
        marker2.setMap(map);


        // 마커의 위치를 지도 중심으로 설정합니다
        marker2.setPosition(map.getCenter());

        // 창생성
        infowindow.open(map, marker2);
        infowindow.setPosition(map.getCenter())

        // // 로드뷰의 위치를 지도 중심으로 설정합니다
        // toggleRoadview(map.getCenter());
    } else {
        overlayOn = false;

        // 지도 위의 로드뷰 도로 오버레이를 제거합니다
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위의 마커를 제거합니다
        marker2.setMap(null);

        //창 제거
        infowindow.close()
    }
}

// 지도 위의 로드뷰 버튼을 눌렀을 때 호출되는 함수입니다
function setRoadviewRoad() {
    var control = document.getElementById('roadviewControl');

    // 버튼이 눌린 상태가 아니면
    if (control.className.indexOf('active') === -1) {
        control.className = 'active';

        // 로드뷰 도로 오버레이가 보이게 합니다
        toggleOverlay(true);
    } else {
        control.className = '';

        // 로드뷰 도로 오버레이를 제거합니다
        toggleOverlay(false);
    }
}

// 로드뷰에서 X버튼을 눌렀을 때 로드뷰를 지도 뒤로 숨기는 함수입니다
function closeRoadview() {
    var position = marker2.getPosition();
    toggleMapWrapper(true, position);
    infowindow.setPosition(position)
}

// 지도 타입 정보를 가지고 있을 객체입니다
// map.addOverlayMapTypeId 함수로 추가된 지도 타입은
// 가장 나중에 추가된 지도 타입이 가장 앞에 표시됩니다
// 이 예제에서는 지도 타입을 추가할 때 지적편집도, 지형정보, 교통정보, 자전거도로 정보 순으로 추가하므로
// 자전거 도로 정보가 가장 앞에 표시됩니다
var mapTypes = {
    terrain : kakao.maps.MapTypeId.TERRAIN,
    traffic :  kakao.maps.MapTypeId.TRAFFIC,
    bicycle : kakao.maps.MapTypeId.BICYCLE,
    useDistrict : kakao.maps.MapTypeId.USE_DISTRICT
};

// 체크 박스를 선택하면 호출되는 함수입니다
function setOverlayMapTypeId() {
    var chkTerrain = document.getElementById('chkTerrain'),
        chkTraffic = document.getElementById('chkTraffic'),
        chkBicycle = document.getElementById('chkBicycle'),
        chkUseDistrict = document.getElementById('chkUseDistrict');

    // 지도 타입을 제거합니다
    for (var type in mapTypes) {
        map.removeOverlayMapTypeId(mapTypes[type]);
    }

    // 지적편집도정보 체크박스가 체크되어있으면 지도에 지적편집도정보 지도타입을 추가합니다
    if (chkUseDistrict.checked) {
        map.addOverlayMapTypeId(mapTypes.useDistrict);
    }

    // 지형정보 체크박스가 체크되어있으면 지도에 지형정보 지도타입을 추가합니다
    if (chkTerrain.checked) {
        map.addOverlayMapTypeId(mapTypes.terrain);
    }

    // 교통정보 체크박스가 체크되어있으면 지도에 교통정보 지도타입을 추가합니다
    if (chkTraffic.checked) {
        map.addOverlayMapTypeId(mapTypes.traffic);
    }

    // 자전거도로정보 체크박스가 체크되어있으면 지도에 자전거도로정보 지도타입을 추가합니다
    if (chkBicycle.checked) {
        map.addOverlayMapTypeId(mapTypes.bicycle);
    }
}

const overlayviewControls = document.getElementById('overlayviewControls')
const overlayviewControlsWin = document.querySelector('.overlayviewControls_win')
const kakaoCheckboxs = document.querySelectorAll('input.kakao_menu')

overlayviewControls.addEventListener('click',()=>{
    let checkArr = []
    overlayviewControls.classList.add('active')
    overlayviewControlsWin.classList.toggle('active')
    kakaoCheckboxs.forEach((el, idx)=>{
        if(el.checked){
            checkArr.push(el)
        }else{
            checkArr.filter((el)=> !el)
        }
    })

    if(checkArr.length > 0){
        overlayviewControls.classList.add('active')
    }else{
        if(overlayviewControlsWin.classList.contains('active')) return
        overlayviewControls.classList.remove('active')
    }
    console.log(checkArr)
 }
)
