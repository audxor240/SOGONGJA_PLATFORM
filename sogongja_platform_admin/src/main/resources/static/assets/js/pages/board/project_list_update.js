(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#all_check').on('click', function() {
            if($(this).is(":checked")){
                $("[name=project_chk]").attr("checked",true);
            }else{
                $("[name=project_chk]").attr("checked",false);
            }
        });
    });
})();


function validationForm(){


    var json_sub = new Object();
    var projectList = new Array();

    if($('input:checkbox[name="project_chk"]:checked').length == 0){
        alert("선택 된 것이 없습니다.");
        return false;
    }

    $('input:checkbox[name="project_chk"]:checked').each(function(item,index) {
        var json = new Object();
        json.type = $(this).parent().parent().find("#type").text();     //분류
        json.title = $(this).parent().parent().find("#title").text();   //제목
        json.year = $(this).parent().parent().find("#year").text();     //년도
        json.areaNm = $(this).parent().parent().find("#areaNm").text(); //지역
        json.url = $(this).parent().parent().find("#url").val(); //URL
        projectList.push(json);
    });
    var data = {
        "projectList":projectList
    };

    $("[name=projectList]").val(JSON.stringify(data));
    return true;
}