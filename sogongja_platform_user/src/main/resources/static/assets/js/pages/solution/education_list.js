(function() {
    'use strict'
    $(document).ready(function() {

        //commonSearchPaging();
        getRecommendEducation(1);
        getFrequentlyRecommendEducation(1);

        // 즐겨찾기
        $('.favorite').on('click', function(e) {
            $(this).toggleClass('on');
        });

        // 수강신청 팝업
        $('.edu_more_box').on('click', function(e) {
            $(this).toggleClass('active');
            $(this).next().toggleClass('on');
        });

        /*$('.solution_edu_recommend .edu_more a').on('click', function() {
            $('.solution_edu_recommend').toggleClass('more');
            if ($('.solution_edu_recommend').hasClass('more')) {
                $(this).html('<a href="#n">접기 <span>접기</span></a>');
            } else {
                $(this).html('<a href="#n">더보기 <span>접기</span></a>');
            }
        });*/

    });

    //추천교육 > 이미수강한 교육 감추기
    /*$('#edu_watching_hide1').on('click', function(e) {
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
    });*/

    //다른 사용자가 자주 찾는교육 > 이미수강한 교육 감추기
    /*$('#edu_watching_hide2').on('click', function(e) {
        var form = document.forms.searchForm;
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
    });*/


})();

$('[name=watchingSucess]').on('click', function(e) {

    var eduSeq = $(this).data('edu-seq');

    let data = {
        seq: eduSeq,
        type: "edu"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    var w_check = true;

    $.ajax({
        type: "POST",
        url: "/api/watching",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                //$(".favorite").css({'background': 'url(../images/icon-faborite.png)'});
                w_check = false;
                alert("로그인이 필요합니다.");
                return;
            }else if(res.message == "add"){
                alert("교육 수강완료 되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("교육 수강해제 되었습니다.");
                return;
            }
        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });

    if(w_check) {
        if ($(this).hasClass("edu_done") == true) {
            $(this).attr('class', 'edu_none');
        } else {
            $(this).attr('class', 'edu_done');
        }
    }

});

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
                //window.open(res.edu_url, '_blank');
                if(res.edu_url_type == "youtube"){
                    window.location.href="/study/education/"+res.edu_seq;
                }else{
                    window.open(res.edu_url, '_blank');
                }
            }

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });
}

function getRecommendEducation(page){
    var form = document.forms.searchForm1;
    var eduWatchingView1 = "N";

    if(form.eduWatchingView1.value == "true"){
        eduWatchingView1 = "Y";
    }

    let data = {
        "page": page,
        "eduWatchingView1": eduWatchingView1
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/solution/recommend_edu",
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
            $(".solution_edu").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".solution_edu").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

    });
}

function getFrequentlyRecommendEducation(page){
    var form = document.forms.searchForm;
    var eduWatchingView2 = "N";

    if(form.eduWatchingView2.value == "true"){
        eduWatchingView2 = "Y";
    }

    let data = {
        "page": page,
        "eduWatchingView2": eduWatchingView2
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/solution/frequently_recommend_edu",
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
            $(".edu_list_wrap").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".edu_list_wrap").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

    });
}

function edu_watching_hide(){

    var form = document.forms.searchForm1;
    if($("#edu_watching_hide1").is(":checked")){
        form.eduWatchingView1.value = true;
    }else{
        form.eduWatchingView1.value = false;
    }

    getRecommendEducation(1);
}

function edu_watching_hide2(){

    var form = document.forms.searchForm;
    if($("#edu_watching_hide2").is(":checked")){
        form.eduWatchingView2.value = true;
    }else{
        form.eduWatchingView2.value = false;
    }

    getFrequentlyRecommendEducation(1);
}

function edu_more(obj){
    $('.solution_edu_recommend').toggleClass('more');
    if ($('.solution_edu_recommend').hasClass('more')) {
        $(obj).html('<a href="#n">접기 <span>접기</span></a>');
    } else {
        $(obj).html('<a href="#n">더보기 <span>접기</span></a>');
    }
}