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
            document.querySelector(".check").addEventListener("click", function() {
                modal[m].style.display = "none";
            });
        }
    }
    //모달 비밀번호 찾기
    if ($("#find_password").length > 0) {
        document.getElementById("find_password").addEventListener("click", function() {
            document.querySelector(".modal").style.display = "block"
        });
        document.getElementById("open_pas2").addEventListener("click", function() {
            document.querySelector(".modal2").style.display = "block"
            document.querySelector(".modal_pas").style.display = "none"
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