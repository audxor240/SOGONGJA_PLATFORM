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

        //추천 컨설팅 > 이미 받은 컨설팅 감추기
        $('#con_watching_hide1').on('click', function(e) {
            var form = document.forms.searchForm1;
            if($(this).is(":checked") == true){
                form.conWatchingView1.value = true;
            }else{
                form.conWatchingView1.value = false;
            }

            if($("#con_watching_hide2").is(":checked")){
                form.conWatchingView2.value = true;
            }else{
                form.conWatchingView2.value = false;
            }
            form.submit();
        });

        //다른 사용자가 자주 찾는 컨설팅 > 이미 받은 컨설팅 감추기
        $('#con_watching_hide2').on('click', function(e) {
            var form = document.forms.searchForm2;
            if($(this).is(":checked") == true){
                form.conWatchingView2.value = true;
            }else{
                form.conWatchingView2.value = false;
            }
            if($("#con_watching_hide1").is(":checked")){
                form.conWatchingView1.value = true;
            }else{
                form.conWatchingView1.value = false;
            }
            form.submit();
        });

    });

})();

function favorite(seq){
    let data = {
        seq: seq,
        type: "con"
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
                alert("관심 컨설팅 등록되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("관심 컨설팅 해제되었습니다.");
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