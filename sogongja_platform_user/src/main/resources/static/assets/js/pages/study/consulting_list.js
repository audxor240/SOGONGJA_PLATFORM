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

        $('input:radio[name="category1"]').on('change', function() {
            if ($(this).val()) {
                var data = {
                    category1Seq: $(this).val()
                }
                ajaxPost('/api/category2', data, function(result) {
                    $('#rdoCategory2').html(makeCategory(result.data, 'category2'));
                    $('#rdoCategory3').html(getEmptyString('category3'));
                });
            } else {
                $('#rdoCategory2').html(getEmptyString('category2'));
                $('#rdoCategory3').html(getEmptyString('category3'));
            }
        });

        $(document).on('change', 'input:radio[name="category2"]', function() {
            if ($(this).val()) {
                var data = {
                    category2Seq: $(this).val()
                }
                ajaxPost('/api/category3', data, function(result) {
                    $('#rdoCategory3').html(makeCategory(result.data, 'category3'));
                });
            } else {
                $('#rdoCategory3').html(getEmptyString('category3'));
            }

        });

        function makeCategory(list, name) {
            var strHTML = getEmptyString(name);
            $.each(list, function(index, item) {
                var category_seq = "";
                if(name == "category2"){
                    category_seq = item.category2_seq;
                }else{
                    category_seq = item.category3_seq;
                }
                strHTML += '<li>';
                strHTML += ' <input type="radio" name="' + name + '" id="' + name + (index + 2) + '"  class="checkbox_style" value="' + category_seq + '">';
                strHTML += ' <label for="' + name + (index + 2) + '">' + item.name + '</label>';
                strHTML += '</li>';
            });
            return strHTML;
        }

        function getEmptyString(name) {
            var strEmpty = '';
            strEmpty += '<li>';
            strEmpty += '  <input type="radio" name="' + name + '" id="' + name + '1"  class="checkbox_style" value="" checked>';
            strEmpty += '  <label for="' + name + '1">전체</label>';
            strEmpty += '</li>';
            return strEmpty;
        }


    });

})();

$('[name=watchingSucess]').on('click', function(e) {

    var conSeq = $(this).data('con-seq');

    let data = {
        seq: conSeq,
        type: "con"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    var w_check = true;

    $.ajax({
        type: "POST",
        url: "/api/watching",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                //$(".favorite").css({'background': 'url(../images/icon-faborite.png)'});
                w_check = false;
                alert("로그인이 필요합니다.");
                return;
            }else if(res.message == "add"){
                alert("컨설팅 수강완료 되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("컨설팅 수강해제 되었습니다.");
                return;
            }
        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });

    if(w_check) {
        if ($(this).hasClass("edu_done") == true) {
            $(this).attr('class', 'edu_none');
        } else {
            $(this).attr('class', 'edu_done');
        }
    }

});

function favorite(seq){
    let data = {
        seq: seq,
        type: "con"
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/api/favorite",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                $(".favorite").css({'background': 'url(../images/icon-faborite.png)'});
                alert("로그인이 필요합니다.");
                return;
            }else if(res.message == "add"){
                alert("관심 컨설팅 등록되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("관심 컨설팅 해제되었습니다.");
                return;
            }
        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });

}