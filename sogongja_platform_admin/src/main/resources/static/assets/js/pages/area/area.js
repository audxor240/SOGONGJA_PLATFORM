(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_reSearchShop').on('click', function() {
            if (confirm('해당 상점을 삭제하시겠습니까?')) {

                var reSearchShopStr = "";
                $("input[name=shop_check]:checked").each(function(){
                    reSearchShopStr += $(this).val()+",";
                })
                reSearchShopStr = reSearchShopStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.reSearchShopStr.value = reSearchShopStr;

                form.submit();
            }
        });

        $("#all_check").click(function() {
            if($("#all_check").is(":checked")) $("input[name=chk_shop]").prop("checked", true);
            else $("input[name=chk_shop]").prop("checked", false);
        });

        $("input[name=chk_shop]").click(function() {
        var total = $("input[name=chk_shop]").length;
        var checked = $("input[name=chk_shop]:checked").length;

        if(total != checked) $("#all_check").prop("checked", false);
        else $("#all_check").prop("checked", true);
        });
    });


})();

function selSubmit() {
    document.searchForm.submit();
}
