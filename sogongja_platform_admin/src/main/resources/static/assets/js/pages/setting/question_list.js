(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('#allChk').on('click', function() {
            if($(this).is(':checked')){
                $('input:checkbox[name="questionChk"]').prop('checked',true);
            }else{
                $('input:checkbox[name="questionChk"]').prop('checked',false);
            }
        });

        $('.btn-danger').on('click', function() {
            if($('input:checkbox[name=questionChk]:checked').length == 0){
                alert("삭제할 질문을 선택해주세요");
                return false;
            }

            var delArr = Array();
            $('input:checkbox[name=questionChk]:checked').each(function (){
                delArr.push($(this).val());
            });

            if (confirm('질문을 삭제하시겠습니까?')) {
                var questionSettingSeq = $(this).data('questionSettingSeq');
                var form = document.forms.deleteForm;
                //form.questionSettingSeq.value = questionSettingSeq;
                form.delSeqList.value = delArr;
                form.submit();
            }


        });
    });

})();

function selSubmit() {
    document.searchForm.submit();
}