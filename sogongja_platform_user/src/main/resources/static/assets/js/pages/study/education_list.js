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

function favorite(seq){
    let data = {
        seq: seq
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
                alert("관심교육 등록되었습니다.");
                return;
            }else if(res.message == "delete"){
                alert("관심교육 해제되었습니다.");
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

function detailEducation(seq){

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    let data = {
        "seq": seq
    }

    $.ajax({
        type: "POST",
        url: "/api/detailEducation",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            if(res.message == "login_check"){
                alert("로그인이 필요합니다.");
                return;
            }else{
                window.open(res.edu_url, '_blank');
            }

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });
}