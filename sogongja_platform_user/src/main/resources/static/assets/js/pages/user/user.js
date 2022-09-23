$(document).ready(function() {
    localStorage.setItem("password", "0");
    localStorage.setItem("pschk", "0");
    const pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;

    $("#password").on("change input", function () {

        let password = $("#password").val();

        if (!pattern.test(password)) {
            localStorage.setItem("password", "0");
            $('#wrongpw1').text("*영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
            return false;
        }
        $('#wrongpw1').text("");
        localStorage.setItem("password", "1");
    });

    $("#passwordConfirm").on("change input", function () {
        if($("#password").val() == $("#passwordConfirm").val()){
            localStorage.setItem("pschk", "1");
            $('#wrongpw2').text("");
        } else {
            localStorage.setItem("pschk", "0");
            $('#wrongpw2').text("*비밀번호가 일치하지 않습니다.");
        }
    });

});


function new_password_update(){
    let password = $("#password").val();
    let passwordConfirm = $("#passwordConfirm").val();
    let email = $("#email").val();
    let emailToken = $("#token").val();

    if(localStorage.getItem("password") != "1"){
        alert("영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호와 비밀번호 확인이 다릅니다');
        return;
    }

    let data = {
        "email": email,
        "emailToken": emailToken,
        "password": password
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/api/newPassword",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {
            alert(res.message);
            location.replace("/login");

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });
}