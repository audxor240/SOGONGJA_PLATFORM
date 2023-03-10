(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

    });


    $(".main_type").change(function(){
        console.log("대분류 변경");
        $(".sub_type").children('option:not(:first)').hide();    //첫번째 옵션 제외하고 숨김처리
        $(".sub_type option[value*="+$(this).val()+"]").show();

    });

})();

function detailView( community_seq, reg_user_seq){

    let session_seq = $("#session_seq").val();

    window.location.href = "/community/"+board_seq;

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
    sidoList.forEach((sido) => {
        let htmlSegment = `<option id="${sido.name}" value="${sido.code}">${sido.name}</option>`;
        html += htmlSegment;
    });
    $(".sidoBox").append(html);
}
renderSido();

async function changeSido(obj){
    var code = obj.value.slice(0,2);
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
    name.forEach((sido) => {

        let htmlSegment = `<option id="${sido.name}" value="${sido.code}">${sido.dong}</option>`;
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
                            ${sido.dong.trim()}
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