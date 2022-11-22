//여러번 쓸것같은 공통 함수들 js 첫번으로 로드
//여러번 쓸것같은 공통 함수들 js 첫번으로 로드
//여러번 쓸것같은 공통 함수들 js 첫번으로 로드

//시간딜레이 함수
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

//ajax 요청하는 함수
function ajaxPostSyn(url, data, callback, showLoading) {
    // IE 기본값세팅
    showLoading = typeof showLoading !== 'undefined' ? showLoading : true;
    $.ajax({
        //async:true,
        url: contextPath + url,
        data: JSON.stringify(data),
        method: "POST",
        success: function (result) {
            //console.log('result : ', result);
            if (callback) {
                callback(result);
            }
        },
        beforeSend: function () {
            if (showLoading) {
                $('.wrap-loading').removeClass('display-none');
            }
        },
        complete: function () {
            if (showLoading) {
                $('.wrap-loading').addClass('display-none');
            }
        },
        error: function (xhr, status, error) {
            console.error('error : ', error);
        }
    });
}