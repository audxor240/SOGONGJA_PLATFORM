(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_consulting').on('click', function() {
            if (confirm('해당 컨설팅을 삭제하시겠습니까?')) {
                var conStr = "";
                $("input[name=con_check]:checked").each(function(){
                    conStr += $(this).val()+",";
                })
                conStr = conStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.conStr.value = conStr;

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