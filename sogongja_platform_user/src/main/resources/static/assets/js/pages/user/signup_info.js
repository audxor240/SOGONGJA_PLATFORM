(function() {
    'use strict'
    $(document).ready(function() {

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
                } else {
                    alert('사용 중인 아이디입니다.');
                }
            });

        });

        //모달
        $('.close').on('click', function() {
            $('.modal').hide();
        });

        $('#type01_01').change(function(){
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
        });

        $('#type01_02').change(function(){
            $("#sub01").hide();
            $("#sub02").show();
            $("#sub03").hide();
        });

        $('#type01_03').change(function(){
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
        });

        $('#type01_04').change(function(){
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").hide();
        });

    });
})();



function validationForm() {

    var type = $("#type").val();
    let cnt = $('[name=categoryList]:checked').length;
    if(type == '') {
        if ($('#checkedId').val() !== $('#id').val()) {
            alert('아이디 중복확인을 하세요');
            return false;
        }

        if ($('#password').val() !== $('#passwordConfirm').val()) {
            alert('비밀번호와 비밀번호 확인이 다릅니다');
            return false;
        }
    }

    if(cnt == 0){
        alert("관심 서비스 유형을 체크해주세요");
        return false;
    }

    return true;
}

