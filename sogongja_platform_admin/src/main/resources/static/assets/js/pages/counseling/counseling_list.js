(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#del_counseling').on('click', function() {

            if($("[name=cou_check]:checked").length == 0){
                alert("선택된 항목이 없습니다.");
                return false;
            }

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