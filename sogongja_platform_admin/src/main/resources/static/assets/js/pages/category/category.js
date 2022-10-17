
// 지원기관 부분 태그 추가
function createList(){
    let obj = document.getElementById("otherCategory");
    let other_input = document.getElementById('otherCategory_input').value;
    let newList = document.createElement("label");

    newList.classList.add('list-group-item', 'list-group-item-action');

    newList.innerHTML += '<p>'+other_input+'</p>'
    newList.innerHTML += '<span class="del_btn">x</span>'

    obj.appendChild(newList);
}


$(document).on('click', '.del_btn', function(){

    var type = $(this).parent().find('[name=category_type]').val();  //삭제할 카테고리 타입
    var categorySeq = $(this).parent().find('input:radio').val();  //삭제할 카테고리 seq

    if (!confirm("해당 카테고리를 삭제하시겠습니까?")) {
        return false;
    } else {
        var form = document.forms.deleteForm;
        form.type.value = type;
        form.categorySeq.value = categorySeq;
        form.submit();
        $(this).parent().remove();
    }
});
$(document).ready(function() {

    var sel_seq1 = $("#list-group1").find(".active").find('input:radio').val(); // 선택된 대분류 seq
    if(sel_seq1 == undefined){
        sel_seq1 = 0;
    }
    $("[name=category1Seq]").val(sel_seq1);                               // 대분류 seq 저장
    $("[name=label_c2_"+sel_seq1+"]").show();                             // 대분류에 속하는 중분류를 보여준다
    $("[name=label_c2_"+sel_seq1+"]").first().addClass("active");         // 하위 카테고리 첫번째 active 추가


    var sel_seq2 = $("#list-group2").find(".active").find('input:radio').val(); //선택된 중분류 seq
    if(sel_seq2 == undefined){
        sel_seq2 = 0;
    }

    $("[name=category2Seq]").val(sel_seq2);
    $("[name=label_c3_"+sel_seq2+"]").show();
    $("[name=label_c3_"+sel_seq2+"]").first().addClass("active");

    var sel_seq3 = $("#list-group3").find(".active").find('input:radio').val(); //선택된 소분류 seq
    if(sel_seq3 == undefined){
        sel_seq3 = 0;
    }
    $("[name=category3Seq]").val(sel_seq3);

    //대분류 선택
    $('[name=lCategory]').on('click', function () {
        $("#list-group1").children().removeClass("active");
        $(this).parent().addClass("active");
        $("[name=category1Seq]").val($(this).val());    //선택된 대분류 seq저장

        //중분류 출력
        $("#list-group2").find('label').hide();                             // 중분류 전체 숨김
        $("[name=label_c2_"+$(this).val()+"]").show();                      // 대분류에 해당하는 중분류 출력
        $("[name=label_c2_"+$(this).val()+"]").first().addClass("active");  // 첫번째 중분류 active
        var m_seq = $("[name=label_c2_"+$(this).val()+"]").first().find('input:radio').val() //중분류 seq
        if(m_seq == undefined){
            m_seq = 0;
        }

        $("[name=category2Seq]").val(m_seq);                                //선택된 중분류 seq저장

        //소분류 출력
        $("#list-group3").find('label').hide();
        $("[name=label_c3_"+m_seq+"]").show();
        $("[name=label_c3_"+m_seq+"]").first().addClass("active");
    });

    //중분류 선택
    $('[name=mCategory]').on('click', function () {
        $("#list-group2").children().removeClass("active");
        $(this).parent().addClass("active");

        $("[name=category2Seq]").val($(this).val());
        $("#list-group3").find('label').hide();
        $("[name=label_c3_"+$(this).val()+"]").show();
        $("[name=label_c3_"+$(this).val()+"]").first().addClass("active");
    });

    //소분류 선택
    $('[name=sCategory]').on('click', function () {
        $("#list-group3").children().removeClass("active");
        $(this).parent().addClass("active");

        $("[name=category3Seq]").val($(this).val());
    });
});

function validationForm1() {
    var name = $("#name").val();

    if (name.trim() === '') {
        alert('카테고리명 입력하세요.');
        return false;
    }

    var grouNameArr = groupName1.split(",");
    for(var i =0; i < grouNameArr.length;i++){
        var g_name = grouNameArr[i];
        if(g_name == name){
            alert("이미 등록된 카테고리명 입니다.");
            return false;
        }
    }

    return true;
}

function validationForm2() {
    var name = $("#name2").val();

    if (name.trim() === '') {
        alert('카테고리명 입력하세요.');
        return false;
    }

    var grouNameArr = groupName2.split(",");
    for(var i =0; i < grouNameArr.length;i++){
        var g_name = grouNameArr[i];
        if(g_name == name){
            alert("이미 등록된 카테고리명 입니다.");
            return false;
        }
    }

    return true;
}

function validationForm3() {
    var name = $("#name3").val();

    if (name.trim() === '') {
        alert('카테고리명 입력하세요.');
        return false;
    }

    var grouNameArr = groupName3.split(",");
    for(var i =0; i < grouNameArr.length;i++){
        var g_name = grouNameArr[i];
        if(g_name == name){
            alert("이미 등록된 카테고리명 입니다.");
            return false;
        }
    }

    return true;
}