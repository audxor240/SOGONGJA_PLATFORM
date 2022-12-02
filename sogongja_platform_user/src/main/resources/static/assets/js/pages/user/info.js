(function() {
    'use strict'
    $(document).ready(function() {

        localStorage.setItem("password", "0");
        localStorage.setItem("pschk", "0");
        const pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;

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

        let type = $("#type").val();
        let subType = $("#subType").val();

        if(type == "1"){
            $("#type01_01").prop("checked",true);
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
            if(subType == "1"){
                $("#type02_01_01").prop("checked",true);
            }else if(subType == "2"){
                $("#type02_01_02").prop("checked",true);
            }

        }else if(type == "2"){
            $("#type01_02").prop("checked",true);
            $("#sub01").hide();
            $("#sub02").show();
            $("#sub03").hide();
            if(subType == "3"){
                $("#type02_02_01").prop("checked",true);
            }
        }else if(type == "3"){
            $("#type01_03").prop("checked",true);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
            if(subType == "4"){
                $("#type02_03_01").prop("checked",true);
            }else if(subType == "5"){
                $("#type02_03_02").prop("checked",true);
            }else if(subType == "6"){
                $("#type02_03_03").prop("checked",true);
            }
        }else if(type == "4"){
            $("#type01_04").prop("checked",true);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").hide();
        }

        //이용자 유형 업데이트 됐을 경우
        if($("#typeCheck").val() == "update"){
            //모달창 open
            $("#survey_pop").show();
        }

        //다음에하기 클릭
        $('#to_do_next').on('click', function() {
            $('#survey_pop').hide();
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
                    //$("#nickName").val("");
                }
            });

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

})();

function validationForm() {

    let cnt = $('[name=categoryList]:checked').length;
    let subTypeCnt = $('[name=subType]:checked').length;
    let type = $("#type").val();
    let subType = $("#subType").val();
    let checked_type = $('[name=type]:checked').val();
    let checked_subType = $('[name=subType]:checked').val();
    let origin_nickName = $('#origin_nickName').val();
    let nickName = $('#nickName').val().trim();
    let checkedNickName = $('#checkedNickName').val();
    let password = $("#password").val();
    let passwordConfirm = $("#passwordConfirm").val();

    if(!social) {
        if (password != "") {

            if (localStorage.getItem("password") != "1") {
                alert("영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
                return false;
            }

            if (passwordConfirm == "") {
                alert("비밀번호 확인을 입력해주세요.");
                return false;
            }

            if (password != passwordConfirm) {
                alert('비밀번호와 비밀번호 확인이 다릅니다');
                return false;
            }
        }
    }

    //닉네임을 변경했을때 중복확인했는지 체크
    if(origin_nickName != nickName){
        if(checkedNickName == ""){
            alert("닉네임 중복 확인해주세요");
            return false;
        }
    }

    if(subTypeCnt == 0){
        alert("이용자 유형을 선택해주세요");
        return false;
    }

    if(cnt == 0){
        alert("관심 서비스 유형을 체크해주세요");
        return false;
    }

    if(type != checked_type || subType != checked_subType){
        if(!confirm("이용자 유형을 바꾸면 작성되었던 설문은 초기화 됩니다.설문을 수정하시겠습니까?")){
            return false;
        }
    }

    return;
}