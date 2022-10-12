(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 이벤트를 삭제하시겠습니까?')) {
                var eventSeq = $(this).data('eventSeq');

                var form = document.forms.deleteForm;
                form.eventSeq.value = eventSeq;
                form.submit();
            }
        });

        $('.eventUse').on('click', function() {
            var eventSeq = $(this).data('eventSeq');    //선택한 이벤트 SEQ
            var eventUsedSeq = $("#eventUsedSeq").val();  //기존에 사용하고 있던 이벤트 팝업 SEQ(없을수 있음)

            if(eventUsedSeq != "" && eventSeq != eventUsedSeq){
                if(!confirm("사용중인 이벤트 팝업이 있습니다. 변경하시겠습니까?")){
                    return false;
                }
            }

            if($(this).is(':checked')){
                var used = "1";
            }else{
                var used = null;
            }
            var form = document.forms.eventUse;

            form.eventSeq.value = eventSeq;
            form.use.value = used;
            form.submit();
        });
    });
})();