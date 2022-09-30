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
    });
})();