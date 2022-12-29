
// jquery
$(document).ready(function (){
    $('.midSecBox').hide()


    $('input.sub_options').change(function (){
        if($(this).is(':checked')){
            $('ul.options').removeClass('on')
            // 업종 밀집도 옵션창 open
            if($(this).val()==='density') $('ul.density_options').addClass('on')
            //토지 특성 옵션창 open
            if($(this).val()==='land') $('ul.land_options').addClass('on')

            // 외 checkbox check false
            $('input.sub_options').prop("checked",false)
            $(this).prop("checked",true)
        }else{
            $('ul.options').removeClass('on')
        }
    })

    $('input[name=depth2_land]').click(function (){
        $('ul.land_options').removeClass('on')
    })

    // 첫번째 모달 check box
    $('.fileter_sub_title.mid_title').css('display', 'none');
    $('input[name="area_maincate"]').click(function () {
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
    // $('.report').click(function (){
    //     if($(this).children('label input').is(':checked')){
    //         $("input:checkbox[id='report']").prop("checked", false);
    //     }else{
    //         // 처음 보고서 버튼 클릭 시 모달 노출
    //         // $('#report_confirm_wrap').show()
    //         $("input:checkbox[id='report']").prop("checked", false);
    //     }
    // })
    console.log($("#report"))
    console.log($("#report").is(':checked'))
    $('input#report.depth1').change(function(){
    });

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
        $('#report_with_map_wrap').hide()
        $('.report_block').removeClass('active')
        $('.report_block').show()
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
        const limit = 2;

        $(this).parent().addClass('active')
        setTimeout(()=> {
                $(this).parent().hide()
            }
        ,400)
        if($(".report_block.active").length === limit){
            $('#report_with_map_wrap').removeClass('active')
            setTimeout(()=> {
                    $('#report_with_map_wrap').hide()
                    $('.report_block').removeClass('active')
                    $('.report_block').show()
                }
                ,400)
        }
    })

})