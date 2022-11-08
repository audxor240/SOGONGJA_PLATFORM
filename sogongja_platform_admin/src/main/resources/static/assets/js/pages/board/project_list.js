(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_project').on('click', function() {
            if (confirm('해당 프로젝트를 삭제하시겠습니까?')) {
                var proStr = "";
                $("input[name=project_check]:checked").each(function(){
                    proStr += $(this).val()+",";
                })
                proStr = proStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.projectStr.value = proStr;

                form.submit();
            }
        });

        $('#all_check').on('click', function() {
            if($(this).is(":checked")){
                $("[name=project_check]").attr("checked",true);
            }else{
                $("[name=project_check]").attr("checked",false);
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
        projectList.push(json);
    });
    var data = {
        "projectList":projectList
    };
    $("[name=projectList]").val(JSON.stringify(data));
    return true;
}