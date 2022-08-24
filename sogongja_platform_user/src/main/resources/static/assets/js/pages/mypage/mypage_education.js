(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-attend').on('click', function() {

            var data = {
                planUserSeq: $(this).data('plan-user-seq')
            };

            ajaxPost('/mypage/education/attend', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    alert('출석이 완료되었습니다.');
                    location.reload();
                }
            });
        });

        $('.btn-receipt').on('click', function() {

            var planUserSeq = $(this).data('plan-user-seq');
            var w = 1000;
            var h = 850;
            var xPos = (document.body.offsetWidth / 2) - (w / 2); // 가운데 정렬
            xPos += window.screenLeft; // 듀얼 모니터일 때
            var yPos = (document.body.offsetHeight / 2) - (h / 2);
            var url = '/mypage/education/print/receipt/' + planUserSeq;
            var name = 'popup_receipt';
            var option = 'width=' + w + ',height=' + h + ',left=' + xPos + ',top=80,location=no,resizable=yes,scrollbars=yes';
            window.open(url, name, option);

        });

        $('.btn-certificate').on('click', function() {

            var planUserSeq = $(this).data('plan-user-seq');
            var w = 1000;
            var h = 850;
            var xPos = (document.body.offsetWidth / 2) - (w / 2);
            xPos += window.screenLeft;
            var yPos = (document.body.offsetHeight / 2) - (h / 2);
            var url = '/mypage/education/print/certificate/' + planUserSeq;
            var name = 'popup_certificate';
            var option = 'width=' + w + ',height=' + h + ',left=' + xPos + ',top=80,location=no,resizable=yes,scrollbars=yes';
            window.open(url, name, option);
        });

        $('input[name="status"]').on('change', function() {
            document.forms.searchForm.submit();
        });

        $('.btn-cancel-plan').on('click', function() {
            if (confirm('해당 교육을 취소하시겠습니까?')) {
                var data = {
                    planSeq: $(this).data('plan-seq'),
                    planUserSeq: $(this).data('plan-user-seq')
                };

                ajaxPost('/mypage/education/cancel', data, function(result) {
                    // console.log('result : ', result);
                    if (result.result_code === 200) {
                        alert('교육 신청 취소되었습니다.');
                        location.reload();
                    }
                });
            }
        });

        $('.btn-survey').on('click', function() {

            $('div.paper-item-list').empty();

            var educSeq = $(this).data('educ-seq');
            var planSeq = $(this).data('plan-seq');
            var surveySeq = $(this).data('survey-seq');

            var data = {
                survey_seq: surveySeq,
            }

            ajaxPost('/mypage/education/paper/survey', data, function(result) {
                if (result.result_code === 200) {

                    var forms = document.forms.paperForm;
                    forms.educSeq.value = educSeq;
                    forms.planSeq.value = planSeq;
                    forms.paperSeq.value = surveySeq;

                    var strHTML = '';

                    $.each(result.data, function(index, item) {

                        strHTML = '<div class="question_items">';
                        strHTML += '    <h4 data-item-no="' + item.itemNo + '">' + item.itemNo + '. ' + item.itemName + '</h4>';
                        strHTML += '    <input type="hidden" name="paperItemAnswer[' + index + '].itemSeq" value="' + item.itemSeq + '">';
                        strHTML += '    <ul class="paper-items">';

                        if (item.itemType === 'M') {
                            // 객관식
                            if (item.question1) {
                                strHTML += '    <li>';
                                strHTML += '        <input type="radio" id="paperItemAnswer' + index + '.itemAnswer1" name="paperItemAnswer[' + index + '].itemAnswer" class="radio_style2" value="1">';
                                strHTML += '        <label for="paperItemAnswer' + index + '.itemAnswer1">① ' + item.question1 + '</label>';
                                strHTML += '    </li>';
                            }
                            if (item.question2) {
                                strHTML += '    <li>';
                                strHTML += '        <input type="radio" id="paperItemAnswer' + index + '.itemAnswer2" name="paperItemAnswer[' + index + '].itemAnswer" class="radio_style2" value="2">';
                                strHTML += '        <label for="paperItemAnswer' + index + '.itemAnswer2">② ' + item.question2 + '</label>';
                                strHTML += '    </li>';
                            }
                            if (item.question3) {
                                strHTML += '    <li>';
                                strHTML += '        <input type="radio" id="paperItemAnswer' + index + '.itemAnswer3" name="paperItemAnswer[' + index + '].itemAnswer" class="radio_style2" value="3">';
                                strHTML += '        <label for="paperItemAnswer' + index + '.itemAnswer3">③ ' + item.question3 + '</label>';
                                strHTML += '    </li>';
                            }
                            if (item.question4) {
                                strHTML += '    <li>';
                                strHTML += '        <input type="radio" id="paperItemAnswer' + index + '.itemAnswer4" name="paperItemAnswer[' + index + '].itemAnswer" class="radio_style2" value="4">';
                                strHTML += '        <label for="paperItemAnswer' + index + '.itemAnswer4">④ ' + item.question4 + '</label>';
                                strHTML += '    </li>';
                            }
                            if (item.question5) {
                                strHTML += '    <li>';
                                strHTML += '        <input type="radio" id="paperItemAnswer' + index + '.itemAnswer5" name="paperItemAnswer[' + index + '].itemAnswer" class="radio_style2" value="5">';
                                strHTML += '        <label for="paperItemAnswer' + index + '.itemAnswer5">⑤ ' + item.question5 + '</label>';
                                strHTML += '    </li>';
                            }
                        } else {
                            // 주관식
                            strHTML += '    <li>';
                            strHTML += '            <input type="text" id="paperItemAnswer' + index + '.itemAnswer1" name="paperItemAnswer[' + index + '].itemAnswer" class="defalut_input">';
                            strHTML += '    </li>';
                        }

                        strHTML += '    </ul>';
                        strHTML += '</div>';

                        $('div.paper-item-list').append(strHTML);
                    });

                    $('body').css('overflow', 'hidden');
                    $('.pop_up2').show();

                }
            });

        });

        if (result_code === '1') {
            alert('제출되었습니다.');
        }

        $('.btn-survey-close').on('click', function() {
            $('body').css('overflow', '');
        });

    });

})();

function isValidationForm() {

    var radioNames = [];
    var textNames = [];

    var tmpName = '';
    $('.paper-items').each(function() {
        $(this).find('input[type=radio]').each(function() {
            var itemName = $(this).attr('name');
            if (itemName !== tmpName) {
                radioNames.push(itemName);
            }
            tmpName = itemName;
        });

        $(this).find('input[type=text]').each(function() {
            textNames.push($(this).attr('name'));
        });
    });

    var isValid = false;
    var itemNo = '';

    // 라디오 체크값 확인
    $.each(radioNames, function(index, item) {
        var val = $('input[name="' + item + '"]:checked').val();
        if (val === undefined || val === null || val === '') {
            isValid = true;
            itemNo = $('input[name="' + item + '"]').first().parents('div.question_items').find('h4').data('item-no');
            return false;
        }
    });

    if (isValid) {
        alert(itemNo + '번 문항을 체크하세요.');
        return false;
    }

    // 텍스트값 확인
    $.each(textNames, function(index, item) {
        var val = $('input[name="' + item + '"]').val();
        if (val === undefined || val === null || val.trim() === '') {
            isValid = true;
            itemNo = $('input[name="' + item + '"]').first().parents('div.question_items').find('h4').data('item-no');
            return false;
        }
    });

    if (isValid) {
        alert(itemNo + '번 문항을 입력하세요.');
        return false;
    }

    return confirm('제출하시겠습니까?');
}