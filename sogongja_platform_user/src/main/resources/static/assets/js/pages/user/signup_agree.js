console.clear();

// 최상단 체크박스 클릭 시 하단 체크박스 활성, 비활성화 (동기화안됨)

// $(document).ready(function(){
//     //최상단 체크박스 클릭
//     $("#checkbox1").click(function(){
//         //클릭되었으면
//         if($("#checkbox1").prop("checked")){
//             //input태그의 name이 chk인 태그들을 찾아서 checked옵션을 true로 정의
//             $("input[name=checkOne]").prop("checked",true);
//             //클릭이 안되있으면
//         }else{
//             //input태그의 name이 chk인 태그들을 찾아서 checked옵션을 false로 정의
//             $("input[name=checkOne]").prop("checked",false);
//         }
//     })
// })



// 모두 => 동기화
function allCheckFunc( obj ) {
    $("[name=checkOne]").prop("checked", $(obj).prop("checked") );
}

// 체크박스 체크시 전체선택 체크 여부
function oneCheckFunc( obj )
{
    var allObj = $("[name=checkAll]");
    var objName = $(obj).attr("name");

    if( $(obj).prop("checked") )
    {
        checkBoxLength = $("[name="+ objName +"]").length;
        checkedLength = $("[name="+ objName +"]:checked").length;

        // console.log("checkBoxLength : " + checkBoxLength + ", checkedLength : " + checkedLength);
        // 확인용

        if( checkBoxLength == checkedLength ) {
            allObj.prop("checked", true);
        } else {
            allObj.prop("checked", false);
        }
    }
    else
    {
        allObj.prop("checked", false);
    }
}

$(function(){
    $("[name=checkAll]").change(function(){
        allCheckFunc( this );
    });

    $("[name=checkOne]").change(function(){
        oneCheckFunc($(this));
    });
});