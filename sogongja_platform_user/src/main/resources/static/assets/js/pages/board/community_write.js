(function() {

    $(".main_type").change(function(){
        $(".sub_type option").attr("selected",false);
        $(".sub_type").children('option:not(:first)').hide();    //첫번째 옵션 제외하고 숨김처리
        $(".sub_type option[value*="+$(this).val()+"]").show();
    });

    //상세보기이면
    if(detail){
        $('.main_type option:contains('+ categoryName1 +')').attr('selected', true);    //대분류 선택
        var code = $('.main_type option:contains('+ categoryName1 +')').val();
        $(".sub_type option[value*="+code+"]").show();
        $('.sub_type option:contains('+ categoryName2 +')').attr('selected', true);     //중분류 선택
    }

})();


function hiddenFile(o){
    let file = '';
    file += '<input type="file" name="file" id="'+o.id+'"/>';
    return file;
}

function file(o){
    let type = '';
    if(o.ext === 'pptx' || o.ext === 'ppt'){
        type = 'powerpoint';
    }else if(o.ext === 'png' || o.ext === 'jpg'){
        type = 'image';
    }else if(o.ext === 'xlsx'){
        type = 'excel';
    }else if(o.ext === 'pdf'){
        type = 'pdf';
    }else {
        type = 'alt';
    }

    let fileThumbnail = '';
    fileThumbnail += '<div class="thumbnail">';
    fileThumbnail += '  <i class="far fa-file-'+type+'"></i>';
    fileThumbnail += '  <p class="name">'+o.name+'</p>';
    fileThumbnail += '  <a href="#'+o.id+'" class="delete"><i class="far fa-minus-square"></i></a>';
    fileThumbnail += '</div>';
    return fileThumbnail;
}

function addFile(o){
    $('.file-hidden-list').append(hiddenFile(o));
    $('#' + o.id).click();
    $('#' + o.id).on('change', function(e){
        const arr1 = e.target.value.split('\\');
        const name = arr1[arr1.length-1];
        o.name = name;

        const arr2 = e.target.value.split('.');
        const ext = arr2[arr2.length-1];
        o.ext = ext;

        $('.file-list').append(file(o));
    });
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

$(document).on('click', '#addFile', function(){
    addFile({id:makeid(10)});
});
$(document).on('click', '.delete', function(){
    const id = $(this).attr('href');
    $(id).remove();
    $(this).parent().remove();
});

$('.btn-delete-file').on('click', function() {
    var fileSeq = $(this).data('file-seq');
    var _$this = $(this);
    var id = _$this.parent().attr('id');

    if (confirm('파일을 삭제하시겠습니까?')) {

        var data = {
            file_seq: fileSeq
        }

        ajaxPost('/file/delete', data, function(result) {
            if (result.result_code == 200) {
                alert("삭제되었습니다.");
                $("#"+id).remove(); //해당 파일 삭제
            }
        });
    }else{
        return false;
    }
});

$('#board_del').on('click', function() {
    if (confirm('해당 게시물을 삭제하시겠습니까?')) {

        //var boardSeq = $(this).data('boardSeq');
        var form = document.forms.deleteForm;
        //form.boardSeq.value = boardSeq;
        //alert("form.boardSeq.value :: "+form.boardSeq.value);
        form.submit();
    }
});

var filesArr = new Array();

function addFile2(obj){
    for (const file of obj.files) {
        // 파일 배열에 담기
        var reader = new FileReader();
        reader.onload = function () {
            filesArr.push(file);
        };
        reader.readAsDataURL(file);

        const preview = document.querySelector('#preview');
        preview.innerHTML += `
                        <p id="${file.lastModified}">
                            <span class="file_icon"></span>
                            <span class="file_name">${file.name}</span>
                            <button type='button' data-index='${file.lastModified}' class='file-remove'>삭제</button>
                        </p>`;

    }

}

function validationForm() {

    var form = document.querySelector("form");
    var formData = new FormData(form);
    var regionName1 = $(".sidoBox option:selected").text();
    var regionName2 = $(".sigunguBox option:selected").text();
    var regionName3 = $(".dongBox option:selected").text();
    var categoryName1 = $(".main_type option:selected").text();
    var categoryName2 = $(".sub_type option:selected").text();

    for (var i = 0; i < filesArr.length; i++) {
        // 삭제되지 않은 파일만 폼데이터에 담기
        //if (!filesArr[i].is_delete) {
        //formData.append("fields", filesArr[i]);
        console.log("filesArr[i].name :: "+filesArr[i].name);
        //$("[name=attachFiles]").append(filesArr[i]);
        formData.append("attachFiles", filesArr[i]);
        //}
    }
    if ($(".sidoBox option:selected").val() == "") {
        alert("지역(시)을 선택해주세요");
        return false;
    } else {
        $("#regionName1").val(regionName1);
    }

    if ($(".sigunguBox option:selected").val() == "") {
        alert("지역(구)을 선택해주세요");
        return false;
    } else {
        $("#regionName2").val(regionName2);
    }

    if(community_type == "shop") {
        if ($(".main_type option:selected").val() == "") {
            alert("대분류를 선택해주세요");
            return false;
        } else {
            $("#categoryName1").val(categoryName1);
        }

        if ($(".sub_type option:selected").val() == "") {
            alert("중분류를 선택해주세요");
            return false;
        } else {
            $("#categoryName2").val(categoryName2);
        }
    }else{
        if ($(".dongBox option:selected").val() == "") {
            alert("지역(동)을 선택해주세요");
            return false;
        } else {
            $("#regionName3").val(regionName3);
        }

    }

    var content = editor.getMarkdown();
    if($("#subject").val() == ""){
        alert("제목을 입력해주세요.");
        return false;
    }

    if (content.trim() === '') {
        alert('내용을 입력해주세요.');
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
        console.log("code :: "+code);
        await changeSido(code);
    }
}
renderSido();

async function changeSido(obj){
    var code = "";
    if(detail) {
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
            }else{
                select = "";
            }
            htmlSegment = `<option id="${sido.name}" value="${sido.code}" ${select}>${sido.dong}</option>`;
        }
        html += htmlSegment;
    });
    $(".sigunguBox").append(html);

}

async function changeSigungu(obj){
    var code = obj.value.slice(0,4);

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
    name.forEach((sido) => {

        let htmlSegment = `<option id="${sido.name}" value="${sido.code}">
                            ${sido.dong}
                        </option>`;
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