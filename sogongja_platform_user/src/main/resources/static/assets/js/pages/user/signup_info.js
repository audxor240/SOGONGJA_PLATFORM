(function() {
    'use strict'
    $(document).ready(function() {

        localStorage.setItem("password", "0");
        localStorage.setItem("pschk", "0");
        const pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;

        var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        $('#email3').on('change', function() {
            var value = $(this).val();
            if (value === '') {
                $('#email2').attr('readOnly', false);
                $('#email2').val('');
            } else {
                $('#email2').attr('readOnly', true);
                $('#email2').val(value);
            }
        });

        $('#btn-checked-id').on('click', function() {
            var id = $('#id').val().trim();

            if (id === '') {
                alert('아이디를 입력하세요');
                return false;
            }

            if (id.length < 5) {
                alert('아이디를 5자 이상 입력하세요');
                return false;
            }

            var data = {
                id: id
            }

            ajaxPost('/signup/checked/id', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    $('#checkedId').val(id);
                    alert('사용할 수 있는 아이디입니다.');
                } else if (result.result_code === -101) {
                    alert('사용할수 없는 아이디입니다.');
                    $("#id").val("");
                } else {
                    alert('사용 중인 아이디입니다.');
                    $("#id").val("");
                }
            });

        });

        $('#btn-checked-nickName').on('click', function() {
            var nickName = $('#nickName').val().trim();

            if (nickName === '') {
                alert('닉네임을 입력하세요');
                return false;
            }

            if (nickName.length < 5) {
                alert('닉네임을 5자 이상 입력하세요');
                return false;
            }

            var data = {
                nickName: nickName
            }

            ajaxPost('/signup/checked/nickName', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    $('#checkedNickName').val(nickName);
                    alert('사용할 수 있는 닉네임입니다.');
                } else if (result.result_code === -101) {
                    $("#nickName").val("");
                    alert('사용할수 없는 닉네임입니다.');
                } else {
                    alert('사용 중인 닉네임입니다.');
                    $("#nickName").val("");
                }
            });

        });

        $('#btn-checked-email').on('click', function() {
            /*var nickName = $('#nickName').val().trim();


            if (nickName === '') {
                alert('닉네임을 입력하세요');
                return false;
            }

            if (nickName.length < 5) {
                alert('닉네임을 5자 이상 입력하세요');
                return false;
            }

            var data = {
                nickName: nickName
            }*/
            var email1 = $("#email1").val().trim();
            var email2 = $("#email2").val().trim();
            var email = email1+"@"+email2;

            if(email1 === '' || email2 === ''){
                alert("이메일을 입력해주세요");
                return false;
            }

            if(!regex.test(email)){
                alert("이메일 형식이 올바르지 않습니다.");
                return false;
            }

            var data = {
                email1: email1,
                email2: email2
            }

            ajaxPost('/signup/checked/email', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    $('#checkedEmail').val(email);
                    alert('사용할 수 있는 이메일입니다.');
                } else {
                    alert('사용 중인 이메일입니다.');
                    $("#email1").val("");
                    $("#email2").val("");
                }
            });

        });

        //모달
        $('.close').on('click', function() {
            $('.modal').hide();
        });

        $('#type01_01').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
            $("#type02_01_01").prop("checked",true);
        });

        $('#type01_02').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").show();
            $("#type02_02_01").prop("checked",true);
            $("#sub03").hide();
        });

        $('#type01_03').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
            $("#type02_03_01").prop("checked",true);
        });

        $('#type01_04').change(function(){
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").hide();
        });

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
})(window.jQuery);



function validationForm() {

    var type = $("#type").val();
    let cnt = $('[name=categoryList]:checked').length;
    let subTypeCnt = $('[name=subType]:checked').length;
    var email = $("#email1").val()+"@"+$("#email2").val();

    if(type == "none") {
        if ($('#checkedId').val() !== $('#id').val()) {
            alert('아이디 중복확인을 해주세요');
            return false;
        }

        if(localStorage.getItem("password") != "1"){
            alert("영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
            return false;
        }

        if ($('#password').val() !== $('#passwordConfirm').val()) {
            alert('비밀번호와 비밀번호 확인이 다릅니다');
            return false;
        }


    }
    if ($('#checkedNickName').val() !== $('#nickName').val()) {
        alert('닉네임 중복확인을 해주세요');
        return false;
    }

    if ($('#checkedEmail').val() !== email) {
        alert('이메일 중복확인을 해주세요');
        return false;
    }

    if(subTypeCnt == 0){
        alert("이용자 유형을 선택해주세요");
        return false;
    }

    if(cnt == 0){
        alert("관심 서비스 유형을 체크해주세요");
        return false;
    }

    return true;
}

