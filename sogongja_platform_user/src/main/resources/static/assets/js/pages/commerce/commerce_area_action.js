
// jquery
$(document).ready(function (){
    $('.midSecBox').hide()

    // 업종 밀집도 옵션창 open, close
    $('input#density').change(function (){
        if($(this).is(':checked')){
            $('ul.density_options').addClass('on')
        }else{
            $('ul.density_options').removeClass('on')
        }
    })

    // 첫번째 모달 check box
    $('.fileter_sub_title.mid_title').css('display', 'none');
    $('input[name="area_maincate"]').click(function () {
        console.log("ZZz")
        if ($('input[name="area_maincate"]:checked').val() == "all") {
            // ** 전체 클릭 시  이벤트 */
            $('.midSectors').removeClass("on")
            $('.midSecBox').css('display', 'none');
            $('.fileter_sub_title.mid_title').css('display', 'none');
            $('#filter_wrap').hide()
        } else {
            $('.midSecBox').css('display', 'block');
            $('.fileter_sub_title.mid_title').css('display', 'block');
            var val = $('input[name="area_maincate"]:checked').val();
            $('.midSectors').removeClass("on")
            $('.all-'+ val +'-sector').addClass("on")
            // if ($('input[name="area_maincate"]:checked').val() == "I") {
            //     //1숙박·음식
            //     $('.midSectors').removeClass("on")
            //     $('.all-I-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "S") {
            //     //2수리·개인서비스
            //     $('.midSectors').removeClass("on")
            //     $('.all-S-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "G") {
            //     //3도·소매
            //     $('.midSectors').removeClass("on")
            //     $('.all-G-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "R") {
            //     //4예술·스포츠·여가
            //     $('.midSectors').removeClass("on")
            //     $('.all-R-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "N") {
            //     //5시설관리·임대
            //     $('.midSectors').removeClass("on")
            //     $('.all-N-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "M") {
            //     //6과학·기술
            //     $('.midSectors').removeClass("on")
            //     $('.all-M-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "L") {
            //     //7부동산
            //     $('.midSectors').removeClass("on")
            //     $('.all-L-sector').addClass("on")
            // } else if ($('input[name="area_maincate"]:checked').val() == "P") {
            //     //8교육
            //     $('.midSectors').removeClass("on")
            //     $('.all-P-sector').addClass("on")
            // }
        }
    })
    $('input[name="area_maincate"]').click(function () {
        var temp = 'all-' + $(this).val() + '-sector';
        $("input:radio[id=" + temp + "]").prop("checked", true);
    })

    $('input[name="depth2_density"]').click(function () {

        $('ul.density_options').removeClass('on')
        if ($(this).val() === 'all') {
            console.log("열지")
        } else {
            console.log($(this).val())
            $('#filter_wrap').show()

            $('.midSecBox').css('display', 'block');
            $('.midSectors').removeClass("on")

            $("input:radio[name='area_maincate']:radio[value='"+$(this).val()+"']").prop('checked', true);
            $('.all-'+ $(this).val() +'-sector').addClass("on")
            $("checkbox[name='area_midcate']").prop('checked', false); // 전체해제하기
        }
    })


    //** 첫번째 모달 중분류 선택, checked가 true 이면 모달 close
    $('.midSectors>li>input').change(function (){
        $('#filter_wrap').hide()
    })

    //** 보고서 버튼 클릭 시 확인 모달 handler
    $('.report').click(function (){
        if($(this).children('label input').is(':checked')){
            $("input:checkbox[id='report']").prop("checked", false);
        }else{
            // 처음 보고서 버튼 클릭 시 모달 노출
            $('#report_confirm_wrap').show()
            $("input:checkbox[id='report']").prop("checked", false);
        }
    })

    //** 보고서 확인 버튼 클릭
    $('#report_confirm_wrap .button.confirmed').click(function (){
        $('#report_confirm_wrap').hide()
        $("input:checkbox[id='report']").prop("checked", true);
        $('#report_wrap').show()
    })
    //** 보고서 취소 버튼 클릭
    $('#report_confirm_wrap .button.cancel').click(function (){
        $('#report_confirm_wrap').hide()
        $("input:checkbox[id='report']").prop("checked", false);
    })

    //** report 닫기
    $('.close_report_modal_btn').click(function(){
        $('#report_wrap').hide()
    })

    //** 지도와 보기 클릭 시
    $('#with_map_btn').click(function (){
        $('#report_wrap').hide()
        $('#report_with_map_wrap').show()
        setTimeout(()=>
        $('#report_with_map_wrap').addClass('active')
        , 100)
    })

    //**toggle_btn
    $('#report_with_map_wrap .toggle_btn').click(function (){
        $('#report_with_map_wrap').toggleClass('active')
    })

    //보고서 요약본(지도랑 보기) single close
    $('.close_report_block_btn').click(function (){
        $(this).parent().css('transform', 'translateX(100%)')
        setTimeout(()=> {
                $(this).parent().css('display', 'none');
                $(this).parent().css('transform', 'translateX(0)');
            }
        ,400)

    })

})