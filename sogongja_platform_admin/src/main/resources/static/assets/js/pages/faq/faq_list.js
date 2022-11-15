(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_faq').on('click', function() {
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
    });
})();

