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

    console.log("multipleUse :: "+multipleUse);
    console.log("rankChangeUse :: "+rankChangeUse);
    console.log("maximumNum :: "+maximumNum);
    console.log("view1_cnt :: "+view1_cnt);
    console.log("최상위 부모 >> "+$(this).parents(".survey_question").html());



    if(multipleUse == "N"){ //복수 추가X
        if(view1_cnt > 0){
            alert("하나이상 추가 할 수 없습니다");
            return false;
        }
        view1_cnt++;
        $(this).parents(".survey_question").find("[name=view1_cnt]").val(view1_cnt);
    }else{                 //복수 추가O
        if(maximumNum <= view1_cnt){
            alert(maximumNum+"개 이상 추가 할 수 없습니다");
            return false;
        }
        view1_cnt++;
        $(this).parents(".survey_question").find("[name=view1_cnt]").val(view1_cnt);
    }

    /*if(cnt1 > 0){
        alert("하나만 추가 할 수 있습니다");
        return false;
    }*/

    var category1 = $("#t1_n_01 option:selected").text();
    var category2 = $("#t1_n_02 option:selected").text();
    var category3 = $("#t1_n_03 option:selected").text();
    var c1_val1 = $("#t1_n_01 option:selected").val();
    var c1_val2 = $("#t1_n_02 option:selected").val();
    var c1_val3 = $("#t1_n_03 option:selected").val();

    if(c1_val1 == 0){
        alert("대분류를 선택해주세요");
        return false;
    }

    if(c1_val2 == 0){
        alert("중분류를 선택해주세요");
        return false;

    }
    if(c1_val3 == 0){
        alert("소분류를 선택해주세요");
        return false;
    }

    $("#choice_done_wrap1").find("p").remove();

    var addHtml="";
    addHtml='<div class="aJob_Wrap">\n' +
        '            <div class="aJob_text">\n' +
        '                <span>\n' +
        '                    <span>'+category1+'</span>/\n' +
        '                    <span>'+category2+'</span>/\n' +
        '                    <span>'+category3+'</span>\n' +
        '                </span>\n' +
        '                <span class="aJob_del" id="aJob_del1" style="cursor: pointer"></span>\n' +
        '            </div>\n' +
        '        </div>';


    //$('#choice_done_wrap1').append(addHtml);
    $(this).parents(".survey_question").find(".choice_done_wrap").append(addHtml);

});

var cnt =1;
//추가형 분류 추가 버튼(복수O)
$('#plus_btn2').click(function(){

    var category1 = $("#t1_y_01 option:selected").text();
    var category2 = $("#t1_y_02 option:selected").text();
    var category3 = $("#t1_y_03 option:selected").text();
    var c1_val1 = $("#t1_y_01 option:selected").val();
    var c1_val2 = $("#t1_y_02 option:selected").val();
    var c1_val3 = $("#t1_y_03 option:selected").val();

    if(c1_val1 === 0){
        alert("대분류를 선택해주세요");
        return false;
    }

    if(c1_val2 === 0){
        alert("중분류를 선택해주세요");
        return false;

    }
    if(c1_val3 === 0){
        alert("소분류를 선택해주세요");
        return false;
    }

    //$("#choice_done_wrap2").find("p").remove();

    var addHtml="";

    addHtml='<div class="dragContainer">\n' +
        '            <div class="num_drag">\n' +
        '                '+cnt+'순위\n' +
        '            </div>\n' +
        '            <div class="aJob_Wrap02 draggable card"  draggable="true">\n' +
        '                <span class="handle_drag"></span>\n' +
        '                <div class="aJob_text_wrap">\n' +
        '                    <div class="aJob_text">\n' +
        '                        <p>\n' +
        '                            <span>'+category1+'</span>/\n' +
        '                            <span>'+category2+'</span>/\n' +
        '                            <span>'+category3+'</span>\n' +
        '                        </p>\n' +
        '                        <span class="aJob_del" id="aJob_del2" style="cursor: pointer"></span>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>';

    cnt++;

    $('#choice_done_wrap2').append(addHtml);

    drag();
});

//추가형 분류 삭제(복수X)
//$('[name=plus_btn1]').click(function(){
$(document).on('click', '#aJob_del1', function(){
    $(this).parent().parent().remove();
    console.log("aaaa ?? :: "+$(this).parents(".survey_question").html());
    console.log("aaaa 22 ?? :: "+$(this).parents("#choice_done_wrap1").parents(".survey_question").html());
    console.log("aaaa 33 ?? :: "+$(this).parents("#choice_done_wrap1").html());
    let cnt1 = $(this).parents(".survey_question").find("[name=view1_cnt]").val();
    console.log("cnt1 >> "+cnt1);
    cnt1--;
    $(this).parents(".survey_question").find("[name=view1_cnt]").val(cnt1);

});

//추가형 분류 삭제(복수O)
$(document).on('click', '#aJob_del2', function(){
    $(this).parent().parent().parent().parent().remove();

});

//대분류 선택
//$('select[id=t1_n_01]').bind('change', function() {
$('[name=category1]').bind('change', function() {
    var sel_val = $(this).val();

    $(this).parent().parent().find(".mCategory").find("select option").hide();  // 옵션 전체 숨김
    $(this).parent().parent().find(".mCategory").find("select option[value*="+sel_val+"_]").show(); //대분류에 해당하는 중분류 출력

});

//중분류 선택
//$('select[id=t1_n_02]').bind('change', function() {
$('[name=category2]').bind('change', function() {
    var sel2_name = $(this).find("option:selected").attr("name");

    $(this).parent().parent().find(".sCategory").find("select option").hide();  // 옵션 전체 숨김
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







