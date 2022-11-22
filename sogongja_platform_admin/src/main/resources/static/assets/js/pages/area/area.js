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

function validationForm(){
    var reSearchShopStr = "";
    $("input[name=shop_check]:checked").each(function(){
        reSearchShopStr += $(this).val()+",";
    })
    reSearchShopStr = reSearchShopStr.slice(0,-1);
    var form = document.forms.excelDown;
    form.seqStr.value = reSearchShopStr;
}

$('#excelDownLoad').on('click', function(e) {

    var reSearchShopStr = "";
    $("input[name=shop_check]:checked").each(function(){
        reSearchShopStr += $(this).val()+",";
    })
    reSearchShopStr = reSearchShopStr.slice(0,-1);

    $("#loding").show();
    var form = document.forms.excelDown;
    form.seqStr.value = reSearchShopStr;
    form.submit();

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    var num =0;
    // 1 초마다 다운로드 완료됐는지 확인
    FILEDOWNLOAD_INTERVAL = setInterval(function() {

        $.ajax({
            type: "POST",
            url: "/api/excel/downloadCheck",
            async: false,
            //data: JSON.stringify(data),
            dataType:"json",
            //data: $("[name=excelDown]").serialize(),
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            success: function (result) {
                if(result.code == "200"){
                    $("#loding").hide();
                    clearInterval(FILEDOWNLOAD_INTERVAL);
                }

            },
            error: function (request,status,error) {
                alert("Error");
                //alert(res.responseJSON.code);
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return;

            }
        });

    }, 1000);   //1초에 한번씩 실행


});
