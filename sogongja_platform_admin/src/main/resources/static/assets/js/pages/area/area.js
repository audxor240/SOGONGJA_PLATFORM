(function() {
    'use strict'
        $(document).ready(function() {
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
