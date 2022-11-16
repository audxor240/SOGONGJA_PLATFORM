(function() {
    'use strict'
    $(document).ready(function() {

        getLikeEduList(1);
        getRecommendEduList(1);
        getLikeConList(1);
        getRecommendConList(1);

        // 즐겨찾기
        $('.favorite').on('click', function(e) {
            $(this).toggleClass('on');
        });
    });

})();

function getLikeEduList(page){
    let data = {
        "page": page
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/user/like_edu",
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
            $(".like_edu").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".like_edu").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

    });
}

function getRecommendEduList(page){
    let data = {
        "page": page
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/user/recommend_edu",
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
            $(".recommend_edu").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".recommend_edu").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

    });
}

function getLikeConList(page){
    let data = {
        "page": page
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/user/like_con",
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
            $(".like_con").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".like_con").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

    });
}

function getRecommendConList(page){
    let data = {
        "page": page
    };
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/user/recommend_con",
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
            $(".recommend_con").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //alert(res.responseJSON.message);
            return false;
        }
    }).done(function (fragment) {
        //여기로 안들어옴.....
        $(".recommend_con").replaceWith(fragment);
        //$("#dtsch_modal").show();
        //$(".loading_box").hide();

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
                window.location.href="/login";
                return;
            }else{
                getLikeEduList(1);
                getRecommendEduList(1);
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

function favorite(seq, f_type){
    let data = {
        seq: seq,
        type: f_type
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    var add_message = "";
    var del_message = "";
    if(f_type == "edu"){
        add_message = "관심교육 등록 되었습니다.";
        del_message = "관심교육 해제 되었습니다.";
    }else if(f_type == "con"){
        add_message = "관심컨설팅 등록 되었습니다.";
        del_message = "관심컨설팅 해제 되었습니다.";
    }

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
                alert(add_message);
            }else if(res.message == "delete"){
                alert(del_message);
            }

            if(f_type == "edu"){
                getLikeEduList(1);
                getRecommendEduList(1);
            }else if(f_type == "con"){
                getLikeConList(1);
                getRecommendConList(1);
            }

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });

}