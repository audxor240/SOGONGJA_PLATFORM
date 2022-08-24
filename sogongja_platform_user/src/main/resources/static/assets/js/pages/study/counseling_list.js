(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        // 즐겨찾기
        $('.favorite').on('click', function(e) {
            $(this).toggleClass('on');
        });

        // 전체선택
        $(document).on('change', '.checked_all', function() {
            var elemName = $(this).attr('name');
            $('input[name="' + elemName + '"]:checkbox').prop('checked', $(this).is(':checked'));
        });

    });

})();