$(function() {
    //소공자과외방 하트
    var favorite = document.querySelectorAll(".favorite");
    for (var f = 0; f < favorite.length; f++) {
        favorite[f].addEventListener("click", function(event) {
            event.target.classList.toggle("on");
        });
    }

    //상권 i버튼
    $(".info_btn").mouseover(function() {
        $(this).parent().siblings(".tooltip").css("display", "block");
    });
    $(".info_btn").mouseout(function() {
        $(this).parent().siblings(".tooltip").css("display", "none");
    });

    //에듀케이션
    $(".ques_info_btn").mouseover(function() {
        $(this).siblings(".ques_tooltip").css("display", "block");
    });
    $(".ques_info_btn").mouseout(function() {
        $(this).siblings(".ques_tooltip").css("display", "none");
    });
    var more_box = document.querySelectorAll(".edu_more_box");
    for (var m = 0; m < more_box.length; m++) {
        more_box[m].addEventListener("click", function(event) {
            event.target.classList.toggle("active");
            event.target.nextElementSibling.classList.toggle("on")
        });
    }

    //컨설팅 서비스 매칭
    if ($("#w5").length > 0) {
        document.getElementById("w5").addEventListener("click", function() {
            if (document.getElementById("w5").checked == true) {
                document.getElementById("other_input").disabled = false;
            }
        });
    }

    //회원가입 동의
    if ($("#agree_all").length > 0) {
        document.getElementById("agree_all").addEventListener("click", function() {
            if (document.getElementById("agree_all").checked == true) {
                document.getElementById("agree1").checked = true;
                document.getElementById("agree2").checked = true;
            } else {
                document.getElementById("agree1").checked = false;
                document.getElementById("agree2").checked = false;
            }
        });
    }

    //모달
    $("#join_complete").click(function() {
        $(".modal").show();
    });

    if ($(".modal").length > 0) {
        var close = document.querySelectorAll(".close");
        var modal = document.querySelectorAll(".modal");
        for (var c = 0; c < close.length; c++) {
            close[c].addEventListener("click", function() {
                for (var m = 0; m < modal.length; m++) {
                    modal[m].style.display = "none";
                }
            });
            /*
            document.querySelector(".check").addEventListener("click", function() {
                modal[m].style.display = "none";
            });
            */

        }
    }
    //모달 비밀번호 찾기
    if ($("#find_password").length > 0) {
        document.getElementById("find_password").addEventListener("click", function() {
            $("#userId").val("");
            $("#email").val("");
            $("#code").val("");
            document.querySelector(".modal").style.display = "block"
            document.querySelector("#code").style.display = "none"

        });

    }

    //파일
    $(".btn-file-upload").click(function() {
        var file = $(this).parent().find('input.upload-hidden');
        file.trigger('click');
    });
    $(".file_list li button").click(function() {
        $(this).parent("li").css("display", "none");
    });

});

var code = "";
function sendCode(){

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    var id = $("#userId").val();
    var email = $("#email").val();

    if(id == ""){
        alert("아이디를 입력해주세요.");
        return;
    }

    if(email == ""){
        alert("이메일을 입력해주세요.");
        return;
    }

    var data = {
        "id": id,
        "email": email
    }

    $.ajax({
        type: "POST",
        url: "/mail/sendCode",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "success"){
                alert("인증번호 발송 되었습니다.");
                $("#code").show();
                code = res.code;
                console.log("code >>> "+code);

            }else{
                alert("아이디와 이메일이 일치하지 않습니다.");
                $(".warning").show();
            }
            /*
            if(res.message == "login_check"){
                alert("로그인이 필요합니다.");
                return;
            }else{
                window.open(res.edu_url, '_blank');
            }
            */

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            return;

        }
    });

}

function findPw(){

    let token = $("meta[name='_csrf']").attr("content");
    let header = $("meta[name='_csrf_header']").attr("content");
    let id = $("#userId").val();
    let email = $("#email").val();

    let conCode = $("#code").val();

    if(id == ""){
        alert("아이디를 입력해주세요.");
        return;
    }

    if(email == ""){
        alert("이메일을 입력해주세요.");
        return;
    }

    if(conCode == ""){
        alert("인증코드를 입력해주세요.");
        return;
    }

    if(conCode != code){
        alert("인증번호가 일치하지 않습니다.");
        return;
    }

    let data = {
        "id": id,
        "email": email
    }

    $.ajax({
        type: "POST",
        url: "/api/findPw",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            $("#user_id").text(res.userId);
            $("#pw").text(res.password);
            document.querySelector(".modal2").style.display = "block";
            document.querySelector(".modal_pas").style.display = "none";

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            return;

        }
    });
}