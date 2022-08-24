(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        // 즐겨찾기
        $('.favorite').on('click', function(e) {
            $(this).toggleClass('on');
        });

        // 수강신청 팝업
        $('.edu_more_box').on('click', function(e) {
            $(this).toggleClass('active');
            $(this).next().toggleClass('on');
        });

        $('.solution_edu_recommend .edu_more a').on('click', function() {
            $('.solution_edu_recommend').toggleClass('more');
            if ($('.solution_edu_recommend').hasClass('more')) {
                $(this).html('<a href="#n">접기 <span>접기</span></a>');
            } else {
                $(this).html('<a href="#n">더보기 <span>접기</span></a>');
            }
        });

    });

})();