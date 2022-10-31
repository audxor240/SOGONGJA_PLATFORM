(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_education').on('click', function() {
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
    });
})();

function selSubmit() {
    document.searchForm.submit();
}