(function() {
    'use strict'
    $(document).ready(function() {

        checkedPaper();

        $('#btn_cancel').on('click', function() {
            if (confirm("미 제출 시 강의 시청을 할 수 없습니다.\n닫으시겠습니까?")) {
                window.location.href = "/mypage/education";
            }
        });

        var player = videojs('video-js');

        $('.btn-learning').on('click', function() {

            $('body').css('overflow', 'hidden');
            $('#video-container').show();

            $('#video-subject').text($(this).data('subject'));

            var thumbImagePath = $(this).data('thumb-image');

            if (thumbImagePath) {
                player.poster(thumbImagePath);
            }

            // var src = '/streaming/' + $(this).data('file-path').replace('/curriculum/', '');
            var src = streamingServer + '/vod/' + $(this).data('file-path').replace('/curriculum/', '') + '/master.m3u8';

            player.src({
                src: src,
                type: 'application/x-mpegURL'
            });

            player.load();

            player.ready(function() {
                player.play();
            });
        });

        $('#video-close').on('click', function() {
            $('#video-container').hide();
            player.pause();
            $('body').css('overflow', '');
        });

        function checkedPaper() {
            if (planPaper.pre_test_flag && planPaper.pre_test_date === null) {
                // console.log('planPaper : ', planPaper);
                $('body').css('overflow', 'hidden');
                $('.pop_up2').show();
            }
        }

        if (result_code === '1') {
            alert('제출되었습니다.');
        }

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
        var elem = $('input[name="' + item + '"]:checked');
        var val = elem.val();
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
        var val = $('input[name="' + textNames + '"]').val();
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