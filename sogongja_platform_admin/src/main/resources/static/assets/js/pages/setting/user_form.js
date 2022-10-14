(function() {
    'use strict'
    $(document).ready(function() {

        $('.pop_pw_btn').on('click', function() {
            $('.pop_pw_wrap').addClass('on');
        });
        $('.pop_pw_close').on('click', function() {
            $('.pop_pw_wrap').removeClass('on');
        });
    });
})();