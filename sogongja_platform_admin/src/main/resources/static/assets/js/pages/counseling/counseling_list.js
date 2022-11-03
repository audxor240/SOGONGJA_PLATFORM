(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_counseling').on('click', function() {
            if (confirm('해당 사례를 삭제하시겠습니까?')) {
                var couStr = "";
                $("input[name=cou_check]:checked").each(function(){
                    couStr += $(this).val()+",";
                })
                couStr = couStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.couStr.value = couStr;
                
                form.submit();
            }
        });
    });
})();