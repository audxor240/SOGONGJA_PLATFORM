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
                $("[name=project_check]").prop("checked",true);
            }else{
                $("[name=project_check]").prop("checked",false);
            }
        });

        $("#fileExcel").on('change',function(event){
            $(this).next('.custom-file-label').html(event.target.files[0].name);
        });
    });
})();


function validationForm(){


    if($("#fileExcel").val() == ""){
        alert("파일을 선택해주세요");
        return false;
    }
    return true;

}