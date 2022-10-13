(function() {
    'use strict'
    $(document).ready(function() {

        var viewer = new toastui.Editor({
            el: document.querySelector('#viewer'),
            initialValue: tui_content,
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });

        $('.moreBtn').click(function(){
            $(this).siblings('.morePop').toggleClass('on');
        });
        /* 외부영역 클릭시 팝업 닫기 */
        $(document).mouseup(function (e){
            if($(".morePop").has(e.target).length === 0){
                $(".morePop").removeClass('on');
            }
        });
        /* ESC 키 누를시 팝업 닫기 */
        $(document).keydown(function(e){
            //keyCode 구 브라우저, which 현재 브라우저
            var code = e.keyCode || e.which;
            if (code == 27) { // 27은 ESC 키번호
                $(".morePop").removeClass('on');
            }
        });

        // 삭제하기 여부 팝업 보이기
        $('.delBtn').click(function(){
            $('.del_pop').show();
        });

        // 삭제하기 여부 팝업 닫기
        $('.pop_btn .backBtn').click(function(){
            $('.del_pop').hide();
        });

        $('#board_del').on('click', function() {
                //var boardSeq = $(this).data('boardSeq');
                var form = document.forms.deleteForm;
                //form.boardSeq.value = boardSeq;
                //alert("form.boardSeq.value :: "+form.boardSeq.value);
                form.submit();
        });

    });
})();

