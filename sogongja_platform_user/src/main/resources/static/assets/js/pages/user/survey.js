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




// 순위 자바스크립트

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





