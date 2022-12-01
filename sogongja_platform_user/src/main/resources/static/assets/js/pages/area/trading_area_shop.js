/*동동이 관련*/
/*동동이 관련*/
/*동동이 관련*/

// 지도에 표시된 마커 객체를 가지고 있을 배열입니다
var markers = [];

//첫접속시 3초뒤에 상점ajax로드함
resultSpread(researchShop)//그리고 다시찍어

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
            document.getElementById("sidebar").style.display = "none";
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

//마커 다시 그림
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//상점마커 점 그리기
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
        displayPlaces(marker, thing, i)//호버,클릭,사이드바 함수 등록
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
    // var datatrans = { shopSeq : place[i].shopSeq }
    // console.log("trans데이터", datatrans)
    // 마커와 검색결과 항목을 클릭 했을 때
    // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
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
    document.getElementById("sidebar").style.display = "block";
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
            if (resultsubway.buslng > 0) {//빈값아니면 거리 계산
                var buspos = buspolyline.getLength().toFixed(2);
                var subpos = subwaypolyline.getLength().toFixed(2)
                console.log("버스길이" + buspos);
                console.log("지하철길이" + subpos);
                document.getElementById("sidebar").innerHTML =
                    '<div id="sidebody">' +
                    '<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
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
                    "</div>" +
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
            } else {
                document.getElementById("sidebar").innerHTML =
                    '<div id="sidebody">' +
                    '<div class="sideCloseBtn" onclick="closeOverlay()" title="닫기"></div>' +
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
                    "</div>" +
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
        })
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

$('.m_scroll_btn').click(function () {
    $('.community_pop_wrap').removeClass('on');
});
$('.community_main').click(function () {
    let communitySeq = $(this).find("#communitySeq").val();
    var data = {
        communitySeq: communitySeq
    }

    /*ajaxPost('/api/reply', data, function(result) {

        $.each(result.data, function(index, itcategory2_seq + '">' + item.name + '</option>';
        });em) {
            strHTML += '<option value="' + item.
        $('#category2').html(strHTML);
        $('#category3').html(strEmpty);


    });*/


    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/trading-area/reply",
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
            $(".reply_list").replaceWith(fragment);
            $(".reply_list").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".reply_list").replaceWith(fragment);
        $(".reply_list").show();
        //$(".loading_box").hide();

    });

    $(this).next('.detail_community').addClass('on');


});

$('.backbtn').click(function () {
    $('.detail_community').removeClass('on');
});

$('.addresswidth').click(function () {
    $('.searchInput').toggleClass('on');
})

$('#reply_btn').click(function () {

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
        //dataType:"json",
        //data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        error: function (res) {

            let fragment = res.responseText
            $(".reply_list").replaceWith(fragment);
            $(".reply_list").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        console.log("fragment >>> "+fragment);
        $(".reply_list").replaceWith(fragment);
        $(".reply_list").show();
        //$(".loading_box").hide();

    });

});
