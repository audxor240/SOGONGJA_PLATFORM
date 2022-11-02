(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        // 즐겨찾기
        $('.favorite').on('click', function(e) {
            $(this).toggleClass('on');
        });

        // 수강신청 팝업
        $('.edu_more_box').on('click', function(e) {
            $(this).toggleClass('active');
            $(this).next().toggleClass('on');
        });

        $('.solution_edu_recommend .edu_more a').on('click', function() {
            $('.solution_edu_recommend').toggleClass('more');
            if ($('.solution_edu_recommend').hasClass('more')) {
                $(this).html('<a href="#n">접기 <span>접기</span></a>');
            } else {
                $(this).html('<a href="#n">더보기 <span>접기</span></a>');
            }
        });

    });

    //추천교육 > 이미수강한 교육 감추기
    $('#edu_watching_hide1').on('click', function(e) {
        var form = document.forms.searchForm1;
        if($(this).is(":checked") == true){
            form.eduWatchingView1.value = true;
        }else{
            form.eduWatchingView1.value = false;
        }

        if($("#edu_watching_hide2").is(":checked")){
            form.eduWatchingView2.value = true;
        }else{
            form.eduWatchingView2.value = false;
        }
        form.submit();
    });

    //다른 사용자가 자주 찾는교육 > 이미수강한 교육 감추기
    $('#edu_watching_hide2').on('click', function(e) {
        var form = document.forms.searchForm2;
        if($(this).is(":checked") == true){
            form.eduWatchingView2.value = true;
        }else{
            form.eduWatchingView2.value = false;
        }
        if($("#edu_watching_hide1").is(":checked")){
            form.eduWatchingView1.value = true;
        }else{
            form.eduWatchingView1.value = false;
        }
        form.submit();
    });


})();

function favorite(seq){
    let data = {
        seq: seq,
        type: "edu"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/api/favorite",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                $(".favorite").css({'background': 'url(../images/icon-faborite.png)'});
                alert("로그인이 필요합니다.");
                return;
            }else if(res.message == "add"){
                alert("관심교육 등록되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("관심교육 해제되었습니다.");
                return;
            }
        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });

}

function detailEducation(seq){

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    let data = {
        "seq": seq
    }

    $.ajax({
        type: "POST",
        url: "/api/detailEducation",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                alert("로그인이 필요합니다.");
                return;
            }else{
                window.open(res.edu_url, '_blank');
            }

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });
}