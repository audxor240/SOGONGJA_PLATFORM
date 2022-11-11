(function() {
    'use strict'
    $(document).ready(function() {

        editor = new toastui.Editor({
            el: document.querySelector('#editor'),
            initialEditType: 'wysiwyg',
            hideModeSwitch: true,
            height: '500px',
            previewStyle: 'vertical',
            plugins: [toastui.Editor.plugin.colorSyntax],
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });
        editor.setMarkdown(tui_content);


        /*
        // qna 수정할때 사용함 , 주석풀어야함
        editor2 = new toastui.Editor({
            el: document.querySelector('#editor2'),
            initialEditType: 'wysiwyg',
            hideModeSwitch: true,
            height: '500px',
            previewStyle: 'vertical',
            plugins: [toastui.Editor.plugin.colorSyntax],
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });

        editor2.setMarkdown(tui_content2);
        */

        $('.btn-delete-file').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);

            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        showAlert('3');
                        _$this.closest('div.attach-file').remove();
                        // window.location.reload();
                    }
                });
            }
        });

        $('input:radio[name="category"]').on('click', function() {
            if ($(this).val() === 'VIDEO') {
                $('#thumbnailImageFile').show();
            } else {
                $('#thumbnailImageFile').hide();
            }
        });

        $('input:radio[name="popupFlag"]').on('click', function() {
            if ($(this).val() === '0') {
                $('#fromDt').val('');
                $('#toDt').val('');
                $('.popup-date').hide();
            } else {
                $('.popup-date').show();
            }
        });

        $('#btn-add-file').on('click', function() {
            if ($('.attach-file').length > 4) {
                alert('최대 5개까지 가능합니다.');
                return;
            }
            addFileRow();
        });

        $(document).on('click', '.btn-delete-upload', function() {
            $(this).closest('div.attach-file').remove();
            if ($('.attach-file-group .attach-file').length === 0) {
                addFileRow();
            }
        });

        function addFileRow() {
            var strHTML = '';
            strHTML += '<div class="pt-2 attach-file">';
            strHTML += '  <input type="file" name="attachFiles" class="file-upload-default">';
            strHTML += '  <div class="input-group col-xs-12">';
            strHTML += '    <input type="text" class="form-control file-upload-title" disabled="disabled" placeholder="">';
            strHTML += '    <span class="input-group-append">';
            strHTML += '      <button type="button" class="file-upload-browse btn btn-primary">파일선택</button>';
            strHTML += '      <button type="button" class="btn btn-danger btn-delete-upload ml-3">삭제</button>';
            strHTML += '    </span>';
            strHTML += '  </div>';
            strHTML += '</div>';

            $('div.attach-file-group:last').append(strHTML);
        }

        //상세보기이면
        if(detail){
            $('.main_type option:contains('+ categoryName1 +')').attr('selected', true);    //대분류 선택
            var code = $('.main_type option:contains('+ categoryName1 +')').val();
            $(".sub_type option[value*="+code+"]").show();
            $('.sub_type option:contains('+ categoryName2 +')').attr('selected', true);     //중분류 선택
        }
    });

    $(".main_type").change(function(){
        console.log("대분류 변경");
        $(".sub_type").children('option:not(:first)').hide();    //첫번째 옵션 제외하고 숨김처리
        $(".sub_type option[value*="+$(this).val()+"]").show();

    });

    //댓글 등록
    $("#reply_w").click(function(){

        if($("#comment1").val() == ""){
            alert("댓글 내용을 입력해주세요");
            return false;
        }else{
            $("#comment_w").val($("#comment1").val());
        }
        document.forms.replyWrite.submit();
    });

    //댓글 삭제
    $(".delBtn").click(function(){
        if (confirm('댓글을 삭제하시겠습니까?')) {
            $("[name=replySeq]").val($(this).val());
            document.forms.replyDelete.submit();
        }
    });

    //커뮤니티 삭제
    $(".communityDel-Btn").click(function(){
        if (confirm('삭제하시겠습니까?')) {
            document.forms.deleteForm.submit();
        }
    });

})();

function validationForm() {
    var content = editor.getMarkdown();
    var regionName1 = $(".sidoBox option:selected").text();
    var regionName2 = $(".sigunguBox option:selected").text();
    var regionName3 = $(".dongBox option:selected").text();
    var regionCode1 = $(".sidoBox option:selected").val();
    var regionCode2 = $(".sigunguBox option:selected").val();
    var regionCode3 = $(".dongBox option:selected").val();
    var categoryName1 = $(".main_type option:selected").text();
    var categoryName2 = $(".sub_type option:selected").text();
    var categoryCode1 = $(".main_type option:selected").val();
    var categoryCode2 = $(".sub_type option:selected").val();
    //var content2 = editor2.getMarkdown();

    if ($(".sidoBox option:selected").val() == "") {
        alert("지역(시)을 선택해주세요");
        return false;
    } else {
        $("#regionName1").val(regionName1);
        $("#regionCode1").val(regionCode1);
    }

    if ($(".sigunguBox option:selected").val() == "") {
        alert("지역(구)을 선택해주세요");
        return false;
    } else {
        $("#regionName2").val(regionName2);
        $("#regionCode2").val(regionCode2);
    }

    if(community_type == "shop") {
        if ($(".main_type option:selected").val() == "") {
            alert("대분류를 선택해주세요");
            return false;
        } else {
            $("#categoryName1").val(categoryName1);
            $("#categoryCode1").val(categoryCode1);
        }

        if ($(".sub_type option:selected").val() == "") {
            alert("중분류를 선택해주세요");
            return false;
        } else {
            $("#categoryName2").val(categoryName2);
            $("#categoryCode2").val(categoryCode2);
        }
    }else{
        if ($(".dongBox option:selected").val() == "") {
            alert("지역(동)을 선택해주세요");
            return false;
        } else {
            $("#regionName3").val(regionName3);
            $("#regionCode3").val(regionCode3);
        }

    }

    if (content.trim() === '') {
        alert('내용을 입력하세요.');
        return false;
    }

    $('#content').val(content);
    $("#communityType").val(community_type);

    return true;
}


var mainurl = `https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=`
async function fetchSido() {
    let response = await fetch(mainurl + `*00000000`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}
//fetchSido();

async function renderSido() {
    let sidos = await fetchSido();
    var sidoList = sidos.regcodes;
    let html = '';
    let select = "";
    let htmlSegment = "";
    let code = "";
    sidoList.forEach((sido) => {

        //상세보기이면 선택해준다
        if(detail) {
            if(regionName1 === sido.name) {
                select = "selected";
                code = sido.code;
            }else{
                select = "";
            }
            htmlSegment = `<option id="${sido.name}" value="${sido.code}" ${select}>${sido.name}</option>`;

        }else{
            htmlSegment = `<option id="${sido.name}" value="${sido.code}">${sido.name}</option>`;
        }
        html += htmlSegment;
    });
    $(".sidoBox").append(html);
    if(detail) {
        await changeSido(code,"start");
    }
}
renderSido();

async function changeSido(obj,type){
    var code = "";

    if(type != "") {
        code = obj.slice(0, 2);
    }else{
        code = obj.value.slice(0, 2);
    }

    let sidos = await fetchSigungu(code);
    var sidoList = await sidos.regcodes;
    var name = [];

    let fiddong = sidoList.map((el, index, arr) => ({
        ...el, dong: el.name.split(" ", 2)[1]
    }));

    name = [...fiddong]
    $(".sigunguBox").children('option:not(:first)').remove();    //첫번째 옵션 제외하고 삭제
    $(".dongBox").children('option:not(:first)').remove();    //첫번째 옵션 제외하고 삭제

    let html = '';
    let htmlSegment = "";
    let select = "";

    name.forEach((sido) => {
        if(detail) {
            if(regionName2 === sido.dong) {
                select = "selected";
                code = sido.code;
            }else{
                select = "";
            }
        }
        htmlSegment = `<option id="${sido.name}" value="${sido.code}" ${select}>${sido.dong}</option>`;
        html += htmlSegment;
    });
    $(".sigunguBox").append(html);
    if(detail && type != "") {
        await changeSigungu(code,"start");
    }
}

async function changeSigungu(obj,type){
    var code = "";

    if(type != "") {
        code = obj.slice(0, 4);
    }else{
        code = obj.value.slice(0, 4);
    }

    let dongs = await fetchDong(code);
    var dongList = await dongs.regcodes;
    var name = [];

    let fiddong = dongList.map((el, index, arr) => ({
        ...el,
        dong: el.name.split(" ")[3] != undefined?el.name.split(" ")[2]+" "+el.name.split(" ")[3]:el.name.split(" ")[2]
    }));

    name = [...fiddong]

    $(".dongBox").children('option:not(:first)').remove();    //첫번째 옵션 제외하고 삭제

    let html = '';
    let htmlSegment = "";
    let select = "";
    name.forEach((sido) => {
        if(detail) {
            if(regionName3 === sido.dong) {
                select = "selected";
            }else{
                select = "";
            }
        }
        htmlSegment = `<option id="${sido.name}" value="${sido.code}" ${select}>${sido.dong}</option>`;
        html += htmlSegment;
    });
    $(".dongBox").append(html);

}

async function fetchSigungu(code) {

    let response = await fetch(mainurl + `${code}` + `*000000` + `&is_ignore_zero=true`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}

async function fetchDong(code) {

    let response = await fetch(mainurl + `${code}` + `*` + `&is_ignore_zero=true`);
    if (response.status === 200) {
        let data = await response.json();
        return data;
    } else {
        throw Error(data);
    }
}

function validationForm2() {

    var comment = $("#comment1").val();

    if(comment == ""){
        alert("댓글 내용을 입력해주세요");
        return false;
    }

    return true;
}