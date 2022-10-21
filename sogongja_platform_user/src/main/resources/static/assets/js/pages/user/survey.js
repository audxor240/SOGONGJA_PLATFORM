$(document).ready(function () {


    // 순위 선택 체크박스
    $('body').on('click',  ".check_wrap", function(){
        var $this = $(this);
        countChecked($this);
    });

    var totalCount = 0;
    var maxCount = 3;
    var selectArray = [];

    function countChecked( $this ) {
        var $thisChk = $this ;
        var $ipCheck = $thisChk.find('input[type=checkbox]');
        var thisChecked = $ipCheck.prop("checked");
        var $countTextbox = $thisChk.find('.select_num');
        var $countText = parseInt($thisChk.find('.select_num').text());


        if( $ipCheck.hasClass('checked') ){
            $ipCheck.removeClass('checked');
            $thisChk.removeClass('on');
            $ipCheck.prop("checked", false);
            totalCount --;

            if(totalCount < 0 ){
                totalCount = 0;
            }
            $countTextbox.text('');
            selectArray.splice($countText - 1,1);
            var i;
            var j;
            for( i=0; i<totalCount; i++ ){
                j = i +1;
                selectArray[i].find('.select_num').text(j);
            }

        }else{
            totalCount ++;
            if (totalCount > maxCount) {
                alert ("최대 3개 까지만 가능합니다.");
                $thisChk.removeClass('on');
                $ipCheck.prop("checked", false);
                totalCount = maxCount;
                return;
            }
            $ipCheck.addClass('checked');
            $thisChk.addClass('on');
            $ipCheck.prop("checked", true);
            $countTextbox.text(totalCount);
            selectArray.push( $thisChk );
        }
    }

    $('.adress_add_btn').click(function(){
        $('.adress_pop').show();
    });
    $('.adress_pop_close').click(function(){
        $('.adress_pop').hide();
    });


    $('.tag_adress').click(function(){
        $(this).toggleClass('on');
    });

});


drag();
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
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val();

    console.log("multipleUse :: "+multipleUse);
    console.log("rankChangeUse :: "+rankChangeUse);
    console.log("maximumNum :: "+maximumNum);
    console.log("view1_cnt :: "+view1_cnt);

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


    if(categoryArr.length != 0){
        console.log("aaa");
        for(var i =0; i < categoryArr.length; i++){
            let category_str = categoryArr[i];   //저장되어 있는 카테고리
            if(category_str == category3){
                alert("동일한 정보가 있습니다");
                return;
            }
        }
    }

    categoryStr += category3+",";

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);

    var addHtml="";
    addHtml='<div class="aJob_Wrap">\n' +
        '            <div class="aJob_text">\n' +
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

    if(c1_val1 === 0){
        alert("대분류를 선택해주세요");
        return;
    }

    if(c1_val2 === 0){
        alert("중분류를 선택해주세요");
        return;

    }
    if(c1_val3 === 0){
        alert("소분류를 선택해주세요");
        return;
    }

    $("#choice_done_wrap2").find("p").remove();


    var categoryStr2 = categoryStr.slice(0, -1);
    var categoryArr = categoryStr2.split(",");


    if(categoryArr.length != 0){
        console.log("aaa");
        for(var i =0; i < categoryArr.length; i++){
            let category_str = categoryArr[i];   //저장되어 있는 카테고리
            if(category_str == category3){
                alert("동일한 정보가 있습니다");
                return;
            }
        }
    }

    categoryStr += category3+",";

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);

    var addHtml="";

    addHtml='<div class="dragContainer">\n' +
        '            <div class="num_drag">\n' +
        '                <span name="rank">'+view2_cnt+'</span>순위\n' +
        '            </div>\n' +
        '            <div class="aJob_Wrap02 draggable card"  draggable="true">\n' +
        '                <span class="handle_drag"></span>\n' +
        '                <div class="aJob_text_wrap">\n' +
        '                    <div class="aJob_text">\n' +
        '                        <span>\n' +
        //'                            <span>'+category1+'</span>,' +
        //'                            <span>'+category2+'</span>,' +
        '                            <span id="cate3">'+category3+'</span>' +
        '                        </span>\n' +
        '                        <span class="aJob_del" id="aJob_del2" style="cursor: pointer"></span>\n' +
        '                    </div>\n' +
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
    let cnt1 = $(this).parents(".survey_question").find("[name=view1_cnt]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val(); //저장되어 있는 카테고리
    console.log("categoryStr >> "+categoryStr);
    console.log("cate3 :: "+cate3);
    cnt1--;
    categoryStr = categoryStr.replace(cate3+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=view1_cnt]").val(cnt1);
    $(this).parent().parent().remove();
});

//추가형 분류 삭제(복수O)
$(document).on('click', '#aJob_del2', function(){
    let cate3 = $(this).parent().find("#cate3").text(); //삭제한 카테고리이름
    let cnt2 = $(this).parents(".survey_question").find("[name=view2_cnt]").val();
    let questionSettingSeq = $(this).parents(".survey_question").find("[name=questionSettingSeq]").val();
    let categoryStr = $(this).parents(".survey_question").find("[name='categoryArr[]']").val(); //저장되어 있는 카테고리
    cnt2--;
    categoryStr = categoryStr.replace(cate3+",", '');   //저장되어 있는 정보에 해당 카테고리 삭제

    $(this).parents(".survey_question").find("[name='categoryArr[]']").val(categoryStr);    //다시 저장
    $(this).parents(".survey_question").find("[name=view2_cnt]").val(cnt2);
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





