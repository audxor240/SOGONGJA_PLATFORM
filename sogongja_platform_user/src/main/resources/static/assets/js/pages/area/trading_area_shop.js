$(function() {
    'use strict'
    $(document).ready(function() {

        charts.forEach(function(item, index) {
            new Chart(document.getElementById(item.id), {
                type: item.option[0].type,
                data: item.option[0].data,
                options: item.option[0].options,
            });
        });

        $('.tab > li').click(function() {
            var count = $(this).index() + 1;

            $('.tab > li').removeClass('active');
            $(this).addClass('active');

            $('.tab_a').hide();
            $('.tab_a' + count).show();
        });

        $('.accordion li a').click(function() {
            $(this).parent('li').toggleClass('active').siblings('li').removeClass('active');
            $(this).siblings('.accordion_cont').slideToggle().parent('li').siblings().children('.accordion_cont').slideUp();
        });

        //상권 i버튼
        $('.info_btn').mouseover(function() {
            $(this).parent().siblings('.tooltip').css('display', 'block');
        });
        $('.info_btn').mouseout(function() {
            $(this).parent().siblings('.tooltip').css('display', 'none');
        });

        $('.map_menu').click(function() {
            $('.right_hd').toggleClass('open');
        });


        // $('.map_tab_list > li').click(function(){
        // 	var count = $(this).index()+1;

        // 	$('.map_tab_list > li').removeClass('active');
        // 	$(this).addClass('active');

        // 	$('.tab_a').hide();
        // 	$('.tab_a'+count).show();
        // });
        //
        $('.tab_style1 > .tab2 > li').click(function() {
            var count = $(this).index() + 1;

            $(this).addClass('active').siblings().removeClass('active');

            $(this).parent('.tab2').siblings('.tab_b').hide();
            $(this).parent('.tab2').siblings('.tab_b' + count).show();
        });


        // 맵 기본 레벨
        var mapDefaultLevel = 4;

        // 기본 위치는 서울시청
        var clientLatitude = 37.5668260055;
        var clientLongitude = 126.9786567859;
        var mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(clientLatitude, clientLongitude),
                level: mapDefaultLevel
            };

        var map = new kakao.maps.Map(mapContainer, mapOption),
            infowindow = new kakao.maps.InfoWindow({
                removable: false
            });

        if (navigator.geolocation) {
            // 현재 접속 사용자 위치 정보
            navigator.geolocation.getCurrentPosition(function(pos) {
                clientLatitude = pos.coords.latitude;
                clientLongitude = pos.coords.longitude;

                var moveLatLon = new kakao.maps.LatLng(clientLatitude, clientLongitude);
                map.setCenter(moveLatLon);
            });
        }

        // console.log('areaJson : ', areaJson);
        //
        // var coords = new daum.maps.Coords(307506.045518573, 549572.690761664);
        // var latlng = coords.toLatLng(); // daum.maps.LatLng 객체 반환
        // console.log('latlng.toString()  : ', latlng.toString());

        // 다각형을 생성하고 지도에 표시합니다
        for (var i = 0, len = areaJson.length; i < len; i++) {
            displayArea(areaJson[i]);
        }

        function priceToString(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        // 다각형을 생상하고 이벤트를 등록하는 함수입니다
        function displayArea(area) {

            var points = [];
            var path = [];
            $.each(area.path, function(index, item) {
                path.push(new kakao.maps.LatLng(item.latitude, item.longitude));
                points.push([item.latitude, item.longitude]);
            });

            var hole = [];
            $.each(area.hole, function(index, item) {
                hole.push(new kakao.maps.LatLng(item.latitude, item.longitude));
            });

            // 다각형을 생성합니다
            var polygon = new kakao.maps.Polygon({
                map: map, // 다각형을 표시할 지도 객체
                path: (area.hole == null || area.hole.length == 0 ? path : [path, hole]),
                strokeWeight: area.stroke_weight,
                strokeColor: area.stroke_color,
                strokeOpacity: area.stroke_opacity,
                strokeStyle: area.stroke_style,
                fillColor: area.fill_color,
                fillOpacity: area.fill_opacity
            });

            // 상권명을 커스텀오버레이로 표시 (임시 주석)
            // var customOverlay = new kakao.maps.CustomOverlay({
            //     content: '<div class="area_title" style="color: #1540bf;">' + area.area_title + '</div>',
            //     position: centroid(points),
            //     xAnchor: 0.5,
            //     yAnchor: 0.5
            // });

            // customOverlay.setMap(map);


            // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
            // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
            kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
                polygon.setOptions({
                    fillColor: area.over_fill_color,
                    fillOpacity: area.over_fill_opacity
                });
            });

            // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
            // kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
            //     // customOverlay.setPosition(mouseEvent.latLng);
            // });

            // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
            // 커스텀 오버레이를 지도에서 제거합니다
            kakao.maps.event.addListener(polygon, 'mouseout', function() {
                polygon.setOptions({
                    fillColor: area.fill_color,
                    fillOpacity: area.fill_opacity
                });
                // customOverlay.setMap(null);
            });

            // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
            kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
                var content = '';
                content += '<div class="customoverlay map_tooltip">';
                content += '  <h3>' + area.area_title + '</h3>';
                content += '  <div class="close customoverlay_close" title="닫기"></div>';
                content += '  <div>';
                content += '    <ul>';
                content += '      <li><span>영역명</span><p>' + area.area_name + '</p></li>';
                content += '      <li><span>상권유형</span><p>' + area.area_type_name + '</p></li>';
                content += '      <li><span>면적(m²)</span><p>' + priceToString(Math.floor(polygon.getArea())) + '</p></li>';
                content += '    </ul>';
                content += '  </div>';
                content += '</div>';

                infowindow.setContent(content);
                infowindow.setPosition(mouseEvent.latLng);
                infowindow.setMap(map);
            });

        }

        //centroid 알고리즘 (폴리곤 중심좌표 구하기 위함)
        function centroid(point) {
            var i, j, len, p1, p2, f, area, x, y;
            var area = x = y = 0;
            for (i = 0, len = point.length, j = len - 1; i < len; j = i++) {
                p1 = point[i];
                p2 = point[j];
                f = p1[1] * p2[0] - p2[1] * p1[0];
                x += (p1[0] + p2[0]) * f;
                y += (p1[1] + p2[1]) * f;
                area += f * 3;
            }

            return new kakao.maps.LatLng(x / area, y / area);
        }

        // 인포윈도우 닫기 이벤트
        $(document).on('click', '.customoverlay_close', function() {
            infowindow.setMap(null);
        });

        // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
            // 지도의 현재 레벨을 얻어옵니다
            var level = map.getLevel();
            $('.area_title').css('font-size', (mapDefaultLevel / level) + 'rem');
        });

    });

});