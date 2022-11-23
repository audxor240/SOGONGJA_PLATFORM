(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        excelColumnSetting();

        $('#del_reSearch').on('click', function() {
            if (confirm('해당 데이터를 삭제하시겠습니까?')) {

                var seqStr = "";
                $("input[name=research_check]:checked").each(function(){
                    seqStr += $(this).val()+",";
                })
                seqStr = seqStr.slice(0,-1);
                var form = document.forms.deleteForm;
                form.seqStr.value = seqStr;

                form.submit();
            }
        });

        $("#all_check").click(function() {
            if($("#all_check").is(":checked")) $("input[name=research_check]").prop("checked", true);
            else $("input[name=research_check]").prop("checked", false);
        });

        $("input[name=research_check]").click(function() {
        var total = $("input[name=research_check]").length;
        var checked = $("input[name=research_check]:checked").length;

        if(total != checked) $("#all_check").prop("checked", false);
        else $("#all_check").prop("checked", true);
        });
    });

    $("#fileExcel").on('change',function(event){
        $(this).next('.custom-file-label').html(event.target.files[0].name);
    });


})();

function selSubmit() {
    document.searchForm.submit();
}

$('#excelDownLoad').on('click', function(e) {

    var seqStr = "";
    $("input[name=research_check]:checked").each(function(){
        seqStr += $(this).val()+",";
    })
    seqStr = seqStr.slice(0,-1);

    $("#loding").show();
    var form = document.forms.excelDown;
    form.seqStr.value = seqStr;
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
                console.log("Error");
                //alert(res.responseJSON.code);
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                return;

            }
        });
    }, 1000);   //1초에 한번씩 실행

});


//$("input:radio[name=analysis_options]").on('click', function() {
$("input[name='analysis_options']").change(function(){

    var typeNum = "";
    var subTypeNum = "";
    switch ($(this).val()){
        case "analysis0":
            if(type == "1"){
                typeNum = "1"; subTypeNum = "0"; break;
            }else{
                typeNum = "2"; subTypeNum = "0"; break;
            }
        case "analysis1": typeNum = "1"; subTypeNum = "1"; break;
        case "analysis2": typeNum = "1"; subTypeNum = "2"; break;
        case "analysis3": typeNum = "1"; subTypeNum = "3"; break;
        case "analysis4": typeNum = "1"; subTypeNum = "4"; break;
        case "analysis5": typeNum = "1"; subTypeNum = "5"; break;
        case "analysis6": typeNum = "2"; subTypeNum = "6"; break;
        case "analysis7": typeNum = "2"; subTypeNum = "7"; break;
        case "analysis8": typeNum = "2"; subTypeNum = "8"; break;
    }
    //location.href="/areaSetting/analysis";

    window.location.href="/areaSetting/analysis?type="+typeNum+"&subType="+subTypeNum;
});

$("input[name='region_options']").change(function(){

    window.location.href="/areaSetting/regional?type="+$(this).val();
});

//엑셀 다운로드 받을 컬럼 지정
function excelColumnSetting(){

    var tr = $('#list_table thead tr');
    var td = tr.children();
    var colHeaderArr = [];
    var colHeaderNameArr = [];
    td.each(function(index, item) {
        if($(this).attr('id') != undefined){
            colHeaderArr.push($(this).attr('id'));
            colHeaderNameArr.push($(this).text());
        }
    });
    $("[name=colHeader]").val(colHeaderArr);
    $("[name=colHeaderName]").val(colHeaderNameArr);
    if(type != ""){
        switch (type){
            case "1": $("[name=excelType]").val("analysis1"); break;
            case "2": $("[name=excelType]").val("analysis2"); break;
        }

    }

}

function validationForm(){

    if($("#fileExcel").val() == ""){
        alert("파일을 선택해주세요");
        return false;
    }
    return true;

}

