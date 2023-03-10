$(document).ready(function () {


    // 순위 선택 체크박스
    /*$('body').on('click',  ".test1", function(){
        alert("11");
        var $this = $(this);
        countChecked($this);
    });*/

    // 순위 선택 체크박스
    $('body').on('click',  ".rank_check", function(){
        var $this = $(this);
        countChecked2($this);
    });

    function countChecked2( $this ) {

        var totalCount = $this.parents(".survey_question").find("[name=totalCount]").val();
        var maxCount = $this.parents(".survey_question").find("[name=view_maximumNum]").val();
        var answerStr = $this.parents(".survey_question").find("[name=answerStr]").val();
        var selectArray = [];

        var $thisChk = $this ;
        var $ipCheck = $thisChk.find('input[type=checkbox]');
        var $countTextbox = $thisChk.find('.select_num');
        var $countText = parseInt($thisChk.find('.select_num').text());
        var answerSeq = $ipCheck.val();

        var rankStr = $this.parents(".survey_question").find("[name=rankStr]").val();

        if( $ipCheck.hasClass('checked') ){     //체크 해제
            $ipCheck.removeClass('checked');
            $thisChk.removeClass('on');
            $ipCheck.prop("checked", false);
            totalCount --;
            $this.parents(".survey_question").find("[name=totalCount]").val(totalCount);

            if(totalCount < 0 ){
                totalCount = 0;
            }
            $countTextbox.text('');

            var j;
            var g =0;

            $this.parents(".survey_question").find(".rank_check").each(function (index, item) {

                if ($(this).find("#chk_fb"+index).is(":checked")) {
                    j = g +1;
                    $(this).find("#select_num_"+index).text(j);
                    g++;
                }
            });

            //선택한 답변seq를 빼고 answerStr재 정의해준다.
            answerArr = answerStr.slice(0,-1).split(",");
            for(var i =0; i < answerArr.length; i++){
                if(answerSeq == answerArr[i]){  //삭제할 seq를 찾아서 제거
                    answerArr.splice(i, 1);
                    break;
                }
            }
            answerStr = answerArr.join(",")+",";
            $this.parents(".survey_question").find("[name=answerStr]").val(answerStr);    //답변 seq 저장

            //rankStr재정의 (마지막에서 순번을 빼준다)
            rankStr = rankStr.slice(0,-2);
            $this.parents(".survey_question").find("[name=rankStr]").val(rankStr);        // 답변 순번을 저장

        }else{      //체크 선택
            if (totalCount >= maxCount) {
                alert ("최대 "+maxCount+"개 까지만 가능합니다.");
                $thisChk.removeClass('on');
                $ipCheck.prop("checked", false);
                totalCount = maxCount;
                return;
            }
            totalCount ++;
            answerStr += answerSeq+",";


            rankStr += totalCount+",";  //선택한 순번

            $this.parents(".survey_question").find("[name=totalCount]").val(totalCount);

            $ipCheck.addClass('checked');
            $thisChk.addClass('on');
            $ipCheck.prop("checked", true);
            $countTextbox.text(totalCount);

            $this.parents(".survey_question").find("[name=answerStr]").val(answerStr);    //선택한 답변 seq를 저장
            $this.parents(".survey_question").find("[name=rankStr]").val(rankStr);        //선택한 답변 순번을 저장

            selectArray.push( $thisChk );
        }
    }

    //주소 추가 버튼
    $('.adress_add_btn').click(function(){


        var questionSettingSeq = $(this).val();

        let view_rankChangeUse = $(this).parent("#survey_question_"+questionSettingSeq).find("[name=view_rankChangeUse]").val();
        let view_multipleUse = $(this).parent("#survey_question_"+questionSettingSeq).find("[name=view_multipleUse]").val();
        let maximumNum = $(this).parent("#survey_question_"+questionSettingSeq).find("[name=view_maximumNum]").val();
        let view_cnt = $(this).parent("#survey_question_"+questionSettingSeq).find("[name=view_cnt]").val();

        if(view_multipleUse == "N"){
            if(maximumNum < view_cnt){
                alert("1개 이상 추가 할 수 없습니다");
                return;
            }
        }else{
            if(maximumNum <= view_cnt){
                alert(maximumNum+"개 이상 추가 할 수 없습니다");
                return;
            }
        }


        let data = {
            "questionSettingSeq": questionSettingSeq
        };

        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");

        $.ajax({
            type: "POST",
            url: "/survey/addressAdd",
            async: false,
            data: JSON.stringify(data),
            //contentType:"application/json; charset=utf-8",
            //dataType:"json",
            //data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            error: function (res) {

                let fragment = res.responseText
                $(".adress_pop").replaceWith(fragment);
                $('.adress_pop').show();
                //alert(res.responseJSON.message);
                return false;
            }
        }).done(function (fragment) {
            //여기로 안들어옴.....
            //$("#dtsch_modal").replaceWith(fragment);
            //$("#dtsch_modal").show();
            //$(".loading_box").hide();

        });


    });

});

$(document).on('click', '.tag_adress', function(){
    $(this).toggleClass('on');
});

//drag();
function drag() {
    var choice_done_wrap = document.querySelectorAll('.card');
    var draggingClass = 'dragging';
    var dragSource;
    
    Array.prototype.forEach.call(choice_done_wrap, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false)
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });

    // 순위 자바스크립트

    function handleDragStart (evt) {
        dragSource = this;
        evt.target.classList.add(draggingClass);
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver (evt) {
        evt.dataTransfer.dropEffect = 'move';
        evt.preventDefault();
    }

    function handleDragEnter (evt) {
        this.classList.add('over');
    }

    function handleDragLeave (evt) {
        this.classList.remove('over');
    }

    function handleDrop (evt) {
        evt.stopPropagation();

        if (dragSource !== this) {
            dragSource.innerHTML = this.innerHTML;

            const sourceClass = dragSource.className;
            const destinationClass = this.className;

            dragSource.className = destinationClass;
            this.className = sourceClass;

            this.innerHTML = evt.dataTransfer.getData('text/html');
        }

        evt.preventDefault();
    }

    function handleDragEnd (evt) {
        Array.prototype.forEach.call(choice_done_wrap, function (col) {
            ['over', 'dragging'].forEach(function (className) {
                col.classList.remove(className);
            });
        });
    }
}

//추가형 분류 추가 버튼(복수X)
$('[name=plus_btn1]').click(function(){

    let multipleUse = $(this).parents(".survey_question").find("[name=view1_multipleUse]").val();
    let rankChangeUse = $(this).parents(".survey_question").find("[name=view1_rankChangeUse]").val();
    let maximumNum = $(this).parents(".survey_question").find("[name=view1_maximumNum]").val();
    let view1_cnt = $(this).parents(".survey_question").find("[name=view1_cnt]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val();   //추가한 카테고리3 이름
    var category3_str = $(this).parents(".survey_question").find("[name='categoryStr']").val();   //추가한 카테고리3 시퀀스 정보


    if(multipleUse == "N"){ //복수 추가X
        if(view1_cnt > 0){
            alert("하나이상 추가 할 수 없습니다");
            return;
        }
    }else{                 //복수 추가O
        if(maximumNum <= view1_cnt){
            alert(maximumNum+"개 이상 추가 할 수 없습니다");
            return;
        }
    }

    var category1 = $(this).parents(".survey_question").find("#t1_n_01 option:selected").text();
    var category2 = $(this).parents(".survey_question").find("#t1_n_02 option:selected").text();
    var category3 = $(this).parents(".survey_question").find("#t1_n_03 option:selected").text();
    var c1_val1 = $(this).parents(".survey_question").find("#t1_n_01 option:selected").val();
    var c1_val2 = $(this).parents(".survey_question").find("#t1_n_02 option:selected").val();
    var c1_val3 = $(this).parents(".survey_question").find("#t1_n_03 option:selected").val();



    if(c1_val1 == 0){
        alert("대분류를 선택해주세요");
        return;
    }

    if(c1_val2 == 0){
        alert("중분류를 선택해주세요");
        return;

    }
    if(c1_val3 == 0){
        alert("소분류를 선택해주세요");
        return;
    }

    $("#choice_done_wrap1").find("p").remove();

    var categoryStr2 = categoryStr.slice(0, -1);
    var categoryArr = categoryStr2.split(",");

    var c1_val3_arr = c1_val3.split("_");

    if(categoryArr.length != 0){
        for(var i =0; i < categoryArr.length; i++){
            let category_str = categoryArr[i];   //저장되어 있는 카테고리
            if(category_str == category3){
                alert("동일한 정보가 있습니다");
                return;
            }
        }
    }

    categoryStr += category3+",";
    category3_str += c1_val3_arr[1]+",";

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);
    $(this).parents(".survey_question").find("[name=categoryStr]").val(category3_str);

    var addHtml="";
    addHtml='<div class="aJob_Wrap">\n' +
        '            <div class="aJob_text">\n' +
        '                <input type="hidden" name="category3_val" value="'+c1_val3_arr[1]+'">\n' +
        '                <span>\n' +
        //'                    <span>'+category1+'</span>,' +
        //'                    <span>'+category2+'</span>,' +
        '                    <span id="cate3">'+category3+'</span>' +
        '                </span>\n' +
        '                <span class="aJob_del" id="aJob_del1" style="cursor: pointer"></span>\n' +
        '            </div>\n' +
        '        </div>';


    //$('#choice_done_wrap1').append(addHtml);
    $(this).parents(".survey_question").find(".choice_done_wrap").append(addHtml);

    view1_cnt++;
    $(this).parents(".survey_question").find("[name=view1_cnt]").val(view1_cnt);

});

var cnt =1;
//추가형 분류 추가 버튼(복수O)
$('#plus_btn2').click(function(){

    let maximumNum = $(this).parents(".survey_question").find("[name=view2_maximumNum]").val();
    let view2_cnt = $(this).parents(".survey_question").find("[name=view2_cnt]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val();
    var category3_str = $(this).parents(".survey_question").find("[name='categoryStr']").val();   //추가한 카테고리3 시퀀스 정보
    var rank_str = $(this).parents(".survey_question").find("[name='rankStr']").val();

    var category1 = $(this).parents(".survey_question").find("#t1_y_01 option:selected").text();
    var category2 = $(this).parents(".survey_question").find("#t1_y_02 option:selected").text();
    var category3 = $(this).parents(".survey_question").find("#t1_y_03 option:selected").text();
    var c1_val1 = $(this).parents(".survey_question").find("#t1_y_01 option:selected").val();
    var c1_val2 = $(this).parents(".survey_question").find("#t1_y_02 option:selected").val();
    var c1_val3 = $(this).parents(".survey_question").find("#t1_y_03 option:selected").val();

    if(maximumNum < view2_cnt){
        alert(maximumNum+"개 이상 추가 할 수 없습니다");
        return;
    }

    if(c1_val1 == 0){
        alert("대분류를 선택해주세요");
        return;
    }

    if(c1_val2 == 0){
        alert("중분류를 선택해주세요");
        return;

    }
    if(c1_val3 == 0){
        alert("소분류를 선택해주세요");
        return;
    }

    $("#choice_done_wrap2").find("p").remove();


    var categoryStr2 = categoryStr.slice(0, -1);
    var categoryArr = categoryStr2.split(",");

    var c1_val3_arr = c1_val3.split("_");

    if(categoryArr.length != 0){
        for(var i =0; i < categoryArr.length; i++){
            let category_str = categoryArr[i];   //저장되어 있는 카테고리
            if(category_str == category3){
                alert("동일한 정보가 있습니다");
                return;
            }
        }
    }

    categoryStr += category3+",";

    category3_str += c1_val3_arr[1]+",";
    rank_str += view2_cnt+",";

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);
    $(this).parents(".survey_question").find("[name=categoryStr]").val(category3_str);
    $(this).parents(".survey_question").find("[name=rankStr]").val(rank_str);

    var addHtml="";

    addHtml='<div class="dragContainer">\n' +
        '            <div class="num_drag">\n' +
        '                <span name="rank">'+view2_cnt+'</span>순위\n' +
        '            </div>\n' +
        '            <div class="aJob_Wrap02 draggable card"  draggable="true">\n' +
        '                <span class="handle_drag"></span>\n' +
        '                <div class="aJob_text_wrap">\n' +
        '                    <div class="aJob_text">\n' +
        '                        <input type="hidden" name="category3_val" value="'+c1_val3_arr[1]+'">\n' +
        '                        <span>\n' +
        //'                            <span>'+category1+'</span>,' +
        //'                            <span>'+category2+'</span>,' +
        '                            <span id="cate3">'+category3+'</span>' +
        '                        </span>\n' +
        '                        <span class="aJob_del" id="aJob_del2" style="cursor: pointer"></span>\n' +
        '                    </input>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>';

    cnt++;

    $('#choice_done_wrap2').append(addHtml);

    view2_cnt++;
    $(this).parents(".survey_question").find("[name=view2_cnt]").val(view2_cnt);

    drag();
});

//추가형 분류 삭제(복수X)
$(document).on('click', '#aJob_del1', function(){
    let cate3 = $(this).parent().find("#cate3").text(); //삭제한 카테고리이름
    let cate3_val = $(this).parent().find("[name=category3_val]").val(); //삭제한 카테고리 시퀀스
    let cnt1 = $(this).parents(".survey_question").find("[name=view1_cnt]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val(); //저장되어 있는 카테고리3 이름
    let category3_str = $(this).parents(".survey_question").find("[name='categoryStr']").val(); //저장되어 있는 카테고리3 시퀀스

    cnt1--;
    categoryStr = categoryStr.replace(cate3+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제
    category3_str = category3_str.replace(cate3_val+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=categoryStr]").val(category3_str);    //다시 저장
    $(this).parents(".survey_question").find("[name=view1_cnt]").val(cnt1);
    $(this).parent().parent().remove();
});

//추가형 분류 삭제(복수O)
$(document).on('click', '#aJob_del2', function(){
    let cate3 = $(this).parent().find("#cate3").text(); //삭제한 카테고리이름
    let cate3_val = $(this).parent().find("[name=category3_val]").val(); //삭제한 카테고리 시퀀스
    let cnt2 = $(this).parents(".survey_question").find("[name=view2_cnt]").val();
    let questionSettingSeq = $(this).parents(".survey_question").find("[name=questionSettingSeq]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val(); //저장되어 있는 카테고리
    let category3_str = $(this).parents(".survey_question").find("[name='categoryStr']").val(); //저장되어 있는 카테고리3 시퀀스
    let rankStr = $(this).parents(".survey_question").find("[name=rankStr]").val();

    cnt2--;
    categoryStr = categoryStr.replace(cate3+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제
    category3_str = category3_str.replace(cate3_val+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제
    rankStr = rankStr.slice(0,-2);

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=categoryStr]").val(category3_str);    //다시 저장
    $(this).parents(".survey_question").find("[name=view2_cnt]").val(cnt2);
    $(this).parents(".survey_question").find("[name=rankStr]").val(rankStr);                      //순위 저장
    $(this).parent().parent().parent().parent().remove();


    //삭제후 순위를 다시 재정의 해준다
    $("#survey_question_"+questionSettingSeq).find(".dragContainer").each(function (index, item) {
        $(this).find("[name=rank]").text(index+1) //순위 변경
    });

});

//대분류 선택
//$('select[id=t1_n_01]').bind('change', function() {
$('[name=category1]').bind('change', function() {
    var sel_val = $(this).val();

    $(this).parent().parent().find(".mCategory").find("select option").hide();  // 중분류 옵션 전체 숨김
    $(this).parent().parent().find(".mCategory").find("select option[value=0]").show(); //중분류 출력
    $(this).parent().parent().find(".mCategory").find("select option[value=0]").prop("selected",true); //중분류 출력
    $(this).parent().parent().find(".mCategory").find("select option[value*="+sel_val+"_]").show(); //대분류에 해당하는 중분류 출력

    $(this).parent().parent().find(".sCategory").find("select option").hide();  // 소분류 옵션 전체 숨김
    $(this).parent().parent().find(".sCategory").find("select option[value=0]").show(); //소분류 출력
    $(this).parent().parent().find(".sCategory").find("select option[value=0]").prop("selected",true); //소분류 출력

});

//중분류 선택
//$('select[id=t1_n_02]').bind('change', function() {
$('[name=category2]').bind('change', function() {
    var sel2_name = $(this).find("option:selected").attr("name");

    $(this).parent().parent().find(".sCategory").find("select option").hide();  // 소분류 옵션 전체 숨김
    $(this).parent().parent().find(".sCategory").find("select option[value=0]").show(); //소분류 출력
    $(this).parent().parent().find(".sCategory").find("select option[value=0]").prop("selected",true); //중분류 출력
    $(this).parent().parent().find(".sCategory").find("select option[name="+sel2_name+"]").show(); //중분류에 해당하는 소분류 출력
});

// 단일 선택 체크 박스
function count_ck(obj){
    let chkbox = document.getElementsByName("check_surveyType_one");
    let chkCnt = 0;
    for(let i=0;i<chkbox.length; i++){
        if(chkbox[i].checked){
            chkCnt++;
        }
    }
    if(chkCnt > 1){
        alert("1개만 체크 가능합니다");
        obj.checked = false;
        return false;
    }
}


// 복수 선택 체크 박스(2개 선택 가능)
function count_ck2(obj2){
    let chkbox2 = document.getElementsByName("check_surveyType_two");
    let chkCnt2 = 0;
    for(let i=0;i<chkbox2.length; i++){
        if(chkbox2[i].checked){
            chkCnt2++;
        }
    }
    if(chkCnt2>2){
        alert("2개만 체크 가능합니다");
        obj2.checked = false;
        return false;
    }
}

//Daum(다음) 우편 API
function execPostCode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 도로명 조합형 주소 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }
            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
            if(fullRoadAddr !== ''){
                fullRoadAddr += extraRoadAddr;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            //console.log(data.zonecode);
            //console.log(fullRoadAddr);


            $("[name=addr1]").val(data.zonecode);   //우편번호
            $("[name=addr2]").val(fullRoadAddr);    //주소

            /* document.getElementById('signUpUserPostNo').value = data.zonecode; //5자리 새우편번호 사용
            document.getElementById('signUpUserCompanyAddress').value = fullRoadAddr;
            document.getElementById('signUpUserCompanyAddressDetail').value = data.jibunAddress; */
        }
    }).open();
}

function addressPopClose(){
    $(".adress_pop").hide();
}

//주소 추가 완료 버튼
function addressAdd(questionSettingSeq){

    var address = $("#address").val();
    var kewywordArr = new Array();
    var rankChangeUse = $("#survey_question_"+questionSettingSeq).find("[name=view_rankChangeUse]").val();
    let view_cnt = $("#survey_question_"+questionSettingSeq).find("[name=view_cnt]").val();
    let addressStr = $("#survey_question_"+questionSettingSeq).find("[name='addressArr[]']").val();
    let keywordStr = $("#survey_question_"+questionSettingSeq).find("[name=keywordStr]").val();

    view_cnt = parseInt(view_cnt);

    if(address == ""){
        alert("주소를 선택해주세요");
        return;
    }

    $("[name=tag_adress_keyword]").each(function (index, item) {
        //$(this).find("[name=rank]").text(index+1) //순위 변경
        if($(this).hasClass("on") === true){
            keywordStr += $(this).attr("value")+",";
            kewywordArr.push($(this).text());
        }
    });

    if(kewywordArr.length == 0){
        alert("태그를 하나 이상 선택해주세요");
        return;
    }

    var addressStr2 = addressStr.slice(0, -1);
    var addressArr = addressStr2.split(",");


    if(addressArr.length != 0){
        for(var i =0; i < addressArr.length; i++){
            let address_str = addressArr[i];   //저장되어 있는 카테고리
            if(address_str == address){
                alert("동일한 정보가 있습니다");
                return;
            }
        }
    }

    addressStr += address+",";

    $("#survey_question_"+questionSettingSeq).find("[name='addressArr[]']").val(addressStr);

    //순위 사용하지 않으면
    if(rankChangeUse != "Y") {
        var addressHtml = '<div class="aAdress_Wrap">\n' +
            '                   <input type="hidden" name="add_keyword" value="'+keywordStr+'">\n' +    // 선택한 키워드 저장
            '                   <div class="aAdress_text">\n' +
            '                       <p id="addr3">' + address + '</p>\n' +
            '                       <span class="aAdress_del" id="aJob_del3" style="cursor: pointer"></span>\n' +
            '                   </div>\n' +
            '                   <div class="tag_adress_choice none_border">\n';
        for (var i = 0; i < kewywordArr.length; i++) {
            addressHtml += '    <div class="tag_adress on">' + kewywordArr[i] + '</div>\n';
        }
        addressHtml += '    </div>\n' +
                        '</div>';
    }else{
        var addressHtml = '<div class="dragContainer">\n' +
            '                   <input type="hidden" name="add_keyword" value="'+keywordStr+'">\n' +    // 선택한 키워드 저장
            '                   <div class="num_drag">\n' +
            '                       <span name="rank">'+(view_cnt+1)+'</span>순위\n' +
            '                   </div>\n' +
            '                   <div class="aAdress_Wrap02 draggable card" draggable="true">\n' +
            '                       <span class="handle_drag"></span>\n' +
            '                       <div class="aAdress_text_wrap">\n' +
            '                           <div class="aAdress_text">\n' +
            '                               <p id="addr4">' + address + '</p>\n' +
            '                               <span class="aAdress_del" id="aJob_del4" style="cursor: pointer"></span>\n' +
            '                           </div>\n' +
            '                           <div class="tag_adress_choice none_border">\n';
            for (var i = 0; i < kewywordArr.length; i++) {
                addressHtml += '    <div class="tag_adress on" value="">' + kewywordArr[i] + '</div>\n';
            }
            //'                                            <div class="tag_adress on">#역세권</div>\n' +
            //'                                            <div class="tag_adress on">#골목상권</div>\n' +
            //'                                            <div class="tag_adress on">#아파트단지</div>\n' +
            addressHtml += '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>';

    }
    $("#survey_question_"+questionSettingSeq).find(".choice_done_wrap").append(addressHtml);

    let cnt = $("#survey_question_"+questionSettingSeq).find("[name=view_cnt]").val();

    cnt++;

    $("#survey_question_"+questionSettingSeq).find("[name=view_cnt]").val(cnt);
    $(".adress_pop").hide();

    if(rankChangeUse == "Y"){
        drag();
    }

}

// 추가형[주소] 복수X 삭제 버튼
$(document).on('click', '#aJob_del3', function(){
    let addr3 = $(this).parent().find("#addr3").text(); //삭제한 카테고리이름
    let cnt2 = $(this).parents(".survey_question").find("[name=view_cnt]").val();
    let questionSettingSeq = $(this).parents(".survey_question").find("[name=questionSettingSeq]").val();
    let addressStr = $(this).parents(".survey_question").find("[name='addressArr[]']").val(); //저장되어 있는 카테고리

    cnt2--;
    addressStr = addressStr.replace(addr3+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제

    $(this).parents(".survey_question").find("[name='addressArr[]']").val(addressStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=view_cnt]").val(cnt2);
    $(this).parent().parent().remove();


    //삭제후 순위를 다시 재정의 해준다
    $("#survey_question_"+questionSettingSeq).find(".dragContainer").each(function (index, item) {
        $(this).find("[name=rank]").text(index+1) //순위 변경
    });

});

// 추가형[주소] 복수O, 순위O 삭제 버튼
$(document).on('click', '#aJob_del4', function(){
    let addr4 = $(this).parent().find("#addr4").text(); //삭제한 카테고리이름
    let cnt2 = $(this).parents(".survey_question").find("[name=view_cnt]").val();
    let questionSettingSeq = $(this).parents(".survey_question").find("[name=questionSettingSeq]").val();
    let addressStr = $(this).parents(".survey_question").find("[name='addressArr[]']").val(); //저장되어 있는 카테고리

    cnt2--;
    addressStr = addressStr.replace(addr4+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제

    $(this).parents(".survey_question").find("[name='addressArr[]']").val(addressStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=view_cnt]").val(cnt2);
    $(this).parent().parent().parent().parent().remove();


    //삭제후 순위를 다시 재정의 해준다
    $("#survey_question_"+questionSettingSeq).find(".dragContainer").each(function (index, item) {
        $(this).find("[name=rank]").text(index+1) //순위 변경
    });

});

$("[name=check_surveyType_tree]").change(function(){
    let questionSettingSeq = $(this).parents(".survey_question").find("[name=questionSettingSeq]").val();
    let checked_cnt = $(this).parents(".survey_question").find("[name=checked_cnt]").val();

    let multipleUse = $(this).parents(".survey_question").find("[name=view_multipleUse]").val();
    let rankChangeUse = $(this).parents(".survey_question").find("[name=view_rankChangeUse]").val();
    let maximumNum = $(this).parents(".survey_question").find("[name=view_maximumNum]").val();
    let answerStr = $(this).parents(".survey_question").find("[name=answerStr]").val();

    let answerSeq = $(this).val();

    if($(this).is(":checked")){
        if(multipleUse == "N"){ //복수 추가X
            if(checked_cnt > 0){
                alert("하나이상 추가 할 수 없습니다");
                $(this).prop("checked",false);
                return;
            }
        }else{                 //복수 추가O
            if(maximumNum <= checked_cnt){
                alert(maximumNum+"개 이상 추가 할 수 없습니다");
                $(this).prop("checked",false);
                return;
            }
        }
        answerStr += answerSeq+","; //답변 seq를 추가
        checked_cnt++;
    }else{  //체크해제
        answerArr = answerStr.slice(0,-1).split(",");
        for(var i =0; i < answerArr.length; i++){
            if(answerSeq == answerArr[i]){  //삭제할 seq를 찾아서 제거
                answerArr.splice(i, 1);
                break;
            }
        }
        answerStr = answerArr.join(",")+",";
        checked_cnt--;
    }


    $(this).parents(".survey_question").find("[name=checked_cnt]").val(checked_cnt);
    $(this).parents(".survey_question").find("[name=answerStr]").val(answerStr);
});

//설문 저장
function surveySave(){

    var surveyList = new Array();
    var validation_check = true;
    var userEmail = $("#userEmail").val();
    var surveySettingSeq = $("#surveySettingSeq").val();
    var userSurveySeq = $("#userSurveySeq").val();

    //질문 수 만큼 루프
    $(".survey_question").each(function (index, item) {
        var json = new Object();
        var questionSettingSeq = $(this).children("[name=questionSettingSeq]").val();
        var categoryStr = $(this).find("[name=categoryStr]").val();
        //var addressStr = $(this).find("[name='addressArr[]']").val();
        //var rankStr = $(this).find("[name='rankStr']").val();
        //var answerStr = $(this).find("[name='answerStr']").val();
        var view1_cnt = $(this).find("[name='view1_cnt']").val();     //추가형[업종] 순위지정X 추가된 개수
        var view2_cnt = $(this).find("[name='view2_cnt']").val();     //추가형[업종] 순위지정O  추가된 개수
        //var view_cnt = $(this).find("[name='view_cnt']").val();     //추가된 개수

        var rank_arr = [];
        var address_arr = [];
        var keyword_arr = [];
        var keyword_seq_arr = [];
        var categor3_arr = [];
        var categor2_arr = [];
        var ans_arr = [];



        //추가형[업종] 순위지정X
        if(viewList[index] == "1") {
            if (view1_cnt != "0") {
                categoryStr = categoryStr.slice(0, -1);
                var category3Arr = categoryStr.split(",");
                json.category3Arr = category3Arr;          //선택한 카테고리3 SEQ 배열
                json.rankArr = null;             //순위 추가
                json.questionType = "1";
                validation_check = true;
            } else {
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }
        }

        //추사형[업종] 순위지정O
        if(viewList[index] == "2") {
            if (view2_cnt != "1"){
                $(this).children(".choice_done_wrap").find(".dragContainer").each(function (index, item) {  //순위 루프
                    var rank = $(this).find("[name=rank]").text();  //순위
                    var categor3_seq = $(this).find("[name=category3_val]").val();  //카테고리3 seq

                    rank_arr.push(rank);
                    categor3_arr.push(categor3_seq);
                });
                json.rankArr = rank_arr;             //순위 추가
                json.category3Arr = categor3_arr;    //카테고리3 추가
                json.questionType = "1";
                validation_check = true;
            } else {
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }
        }



        //추가형[주소] 주소,키워드 정보 셋팅
        if(viewList[index] == "3") {
            if ($(this).children(".choice_done_wrap").find(".aAdress_Wrap").length > 0) {
                $(this).children(".choice_done_wrap").find(".aAdress_Wrap").each(function (index, item) {
                    var k_arr = [];
                    var k_s_arr = [];
                    var address = $(this).find("#addr3").text();  //주소
                    var k_s_str = $(this).find("[name=add_keyword]").val();  //키워드 시퀀스
                    k_s_str = k_s_str.slice(0,-1);
                    var k_s_Arr = k_s_str.split(",");

                    $(this).find(".tag_adress").each(function (index, item) {   //키워드 루프
                        k_arr.push($(this).text());
                        k_s_arr.push(k_s_Arr[index]);
                    });
                    keyword_arr.push(k_arr);
                    keyword_seq_arr.push(k_s_arr);
                    address_arr.push(address);

                });
                json.rankArr = null;        //순위 추가
                json.keywordArr = keyword_arr;  //키워드 추가
                json.keywordSeqArr = keyword_seq_arr;  //키워드 시퀀스 추가
                json.addressArr = address_arr;  //주소 추가
                json.questionType = "2";
                validation_check = true;
            } else {
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }
        }

        //추가형[주소] 순위, 주소, 키워드 셋팅
        if(viewList[index] == "4") {
            if ($(this).children(".choice_done_wrap").find(".dragContainer").length > 0) {

                $(this).children(".choice_done_wrap").find(".dragContainer").each(function (index, item) {  //순위 루프
                    var k_arr = [];
                    var k_s_arr = [];
                    var rank = $(this).find("[name=rank]").text();  //순위
                    var address = $(this).find("#addr4").text();  //주소
                    var k_s_str = $(this).find("[name=add_keyword]").val();  //키워드 시퀀스
                    k_s_str = k_s_str.slice(0,-1);
                    var k_s_Arr = k_s_str.split(",");

                    $(this).find(".tag_adress").each(function (index, item) {   //키워드 루프
                        k_arr.push($(this).text());
                        k_s_arr.push(k_s_Arr[index]);
                    });
                    keyword_arr.push(k_arr);
                    keyword_seq_arr.push(k_s_arr);
                    rank_arr.push(rank);
                    address_arr.push(address);

                });
                json.rankArr = rank_arr;        //순위 추가
                json.keywordArr = keyword_arr;  //키워드 추가
                json.keywordSeqArr = keyword_seq_arr;  //키워드 시퀀스 추가
                json.addressArr = address_arr;  //주소 추가
                json.questionType = "2";
                validation_check = true;
            } else {
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }
        }

        if(viewList[index] == "5") {
            var answer_arr = [];
            if ($(this).find("[name=checked_cnt]").val() > 0) {
                $(this).find("[name=check_surveyType_tree]").each(function (index, item) {

                    if($(this).is(":checked")){
                        var cate2_arr = [];
                        var answer_seq_arr = [];
                        answer_arr.push($(this).val());   //답변
                        var category2 = $(this).parent("li").find("[name=category2]").val();   //카테고리2
                        var answerSeq = $(this).parent("li").find("[name=answerSeq]").val();   //카테고리2
                        var category2_arr = category2.split(",");
                        var answerSeq_arr = answerSeq.split(",");
                        var c2_arr = [];
                        var a_arr = [];
                        for(var f =0; f < category2_arr.length;f++){
                            c2_arr.push(category2_arr[f]);
                            a_arr.push(answerSeq_arr[f]);
                        }
                        categor2_arr.push(c2_arr);
                        ans_arr.push(a_arr);
                    }
                });
                json.rankArr = null;        //순위 추가
                json.answerArr = answer_arr;    //답변 추가
                json.category2Arr = categor2_arr;    //카테고리2 추가
                json.answerSeqArr = ans_arr;    //답변 seq 추가
                json.questionType = "3";
                validation_check = true;
            }else{
                json.answerArr = null;
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }

        }

        //선택형 순위, 답변 셋팅
        if(viewList[index] == "6") {
            var answer_arr = [];
            if ($(this).find("[name=totalCount]").val() > 0) {
                $(this).find(".rank_check").each(function (index, item) {

                    if ($(this).hasClass("on")) {
                        var cate2_arr = [];
                        var answer_seq_arr = [];
                        rank_arr.push($(this).find(".select_num").text());          //순번
                        answer_arr.push($(this).find("[name=faceSelect]").val());   //답변
                        var category2 = $(this).find("[name=category2]").val();   //카테고리2
                        var answerSeq = $(this).find("[name=answerSeq]").val();   //카테고리2
                        var category2_arr = category2.split(",");
                        var answerSeq_arr = answerSeq.split(",");
                        var c2_arr = [];
                        var a_arr = [];
                        for(var f =0; f < category2_arr.length;f++){
                            c2_arr.push(category2_arr[f]);
                            a_arr.push(answerSeq_arr[f]);
                        }
                        categor2_arr.push(c2_arr);
                        ans_arr.push(a_arr);
                    }
                });
                json.rankArr = rank_arr;        //순위 추가
                json.answerArr = answer_arr;    //답변 추가
                json.category2Arr = categor2_arr;    //카테고리2 추가
                json.answerSeqArr = ans_arr;    //답변 seq 추가
                json.questionType = "3";
                validation_check = true;
            } else {
                alert((index + 1) + "번째 질문을 선택해주세요");
                validation_check = false;
                return false;
            }
        }

        json.questionSettingSeq = questionSettingSeq;   //질문 관리 SEQ
        json.userEmail = userEmail;
        json.surveySettingSeq = surveySettingSeq;
        json.userSurveySeq = userSurveySeq;

        surveyList.push(json);

    });
    //console.log("surveyList : "+surveyList);
    //console.log("surveyList JSON : "+JSON.stringify(surveyList));
    if(!validation_check){
        return;
    }

    //기존에 작성한 설문지가 있으면
    if(userSurveySeq != "0") {
        if (!confirm("기존에 작성한 설문지는 삭제 됩니다. 변경하시겠습니까??")) {
            // 취소(아니오) 버튼 클릭 시 이벤트
            return;
        }
    }

    let data = {
        data: surveyList
    };

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    $.ajax({
        type: "POST",
        url: "/survey/form",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {
            console.log("res : "+res);
            alert("설문 작성 완료 되었습니다");
            window.location.href = "/";

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            //console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            alert("설문 작성 완료 되었습니다");
            window.location.href = "/";

            return;

        }
    });

}