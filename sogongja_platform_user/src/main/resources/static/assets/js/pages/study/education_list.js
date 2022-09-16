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
                    groupCode: 'CATEGORY_2',
                    refCode: $(this).val()
                }
                ajaxPost('/api/code/ref', data, function(result) {
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
                    groupCode: 'CATEGORY_3',
                    refCode: $(this).val()
                }
                ajaxPost('/api/code/ref', data, function(result) {
                    $('#rdoCategory3').html(makeCategory(result.data, 'category3'));
                });
            } else {
                $('#rdoCategory3').html(getEmptyString('category3'));
            }

        });

        function makeCategory(list, name) {
            var strHTML = getEmptyString(name);
            $.each(list, function(index, item) {
                strHTML += '<li>';
                strHTML += ' <input type="radio" name="' + name + '" id="' + name + (index + 2) + '"  class="checkbox_style" value="' + item.code + '">';
                strHTML += ' <label for="' + name + (index + 2) + '">' + item.code_name + '</label>';
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
            //alert("res :: "+JSON.stringify(res));

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });


}