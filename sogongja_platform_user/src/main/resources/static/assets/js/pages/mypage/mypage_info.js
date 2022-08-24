(function() {
    'use strict'
    $(document).ready(function() {

        $.datepicker.setDefaults({
            dateFormat: 'yy-mm-dd',
            prevText: '이전 달',
            nextText: '다음 달',
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true
        });

        $('#birthDay').datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '-70:+0'
        });

        $('input[name="userType"]').on('change', function() {
            var value = $(this).val();
            $('#company').empty();
            $.each(companyList, function(index, item) {
                if (item.ref_value === '' || item.ref_value === value) {
                    $('#company').append('<option value="' + item.code + '">' + item.code_name + '</option>');
                }
            });

            if (value === 'O') {
                $('.company_dept').show();
            } else {
                $('.company_dept').hide();
            }
        });

        $('#email3').on('change', function() {
            var value = $(this).val();
            if (value === 'etc') {
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

            $('#checkedIdFlag').val(0);

            var data = {
                id: id
            }

            ajaxPost('/signup/checked/id', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    $('#checkedIdFlag').val(1);
                    alert('사용할 수 있는 아이디입니다.');
                } else if (result.result_code === -101) {
                    alert('사용할수 없는 아이디입니다.');
                } else {
                    alert('사용 중인 아이디입니다.');
                }
            });

        });
        
    });
})();

function validationForm() {

    if ($('#checkedIdFlag').val() === '0') {
        alert('아이디 중복확인을 하세요');
        return false;
    }

    if ($('#birthDay').val() === '') {
        alert('생년월일을 입력하세요');
        return false;
    }

    var gender = $('input:radio[name="gender"]:checked').val();

    if (gender === undefined || gender === '') {
        alert('성별을 선택하세요');
        return false;
    }

    if ($('input:radio[name="userType"]:checked').val() === 'O') {
        if ($('#companyName').val() === '') {
            alert('소속명을 입력하세요');
            return false;
        }

        if ($('#dept').val() === '') {
            alert('부서를 입력하세요');
            return false;
        }
    }

    return true;
}