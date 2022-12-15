(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_faq').on('click', function() {

            if($("[name=faq_check]:checked").length == 0){
                alert("선택된 항목이 없습니다.");
                return false;
            }

            if (confirm('해당 FAQ을 삭제하시겠습니까?')) {
                var faqStr = "";
                $("input[name=faq_check]:checked").each(function(){
                    faqStr += $(this).val()+",";
                })
                faqStr = faqStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.faqStr.value = faqStr;
                form.submit();
            }
        });

        $('#all_check').on('click', function() {
            if($(this).is(":checked")){
                $("[name=faq_check]").prop("checked",true);
            }else{
                $("[name=faq_check]").prop("checked",false);
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