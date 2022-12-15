(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_education').on('click', function() {

            if($("[name=edu_check]:checked").length == 0){
                alert("선택된 항목이 없습니다.");
                return false;
            }

            if (confirm('해당 교육을 삭제하시겠습니까?')) {

                var eduStr = "";
                $("input[name=edu_check]:checked").each(function(){
                    eduStr += $(this).val()+",";
                })
                eduStr = eduStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.eduStr.value = eduStr;

                form.submit();
            }
        });

        $("#fileExcel").on('change',function(event){
            $(this).next('.custom-file-label').html(event.target.files[0].name);
        });
    });
})();

function selSubmit() {
    document.searchForm.submit();
}

function validationForm(){

    if($("#fileExcel").val() == ""){
        alert("파일을 선택해주세요");
        return false;
    }
    return true;

}