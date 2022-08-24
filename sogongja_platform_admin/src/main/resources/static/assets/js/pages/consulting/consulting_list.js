(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 컨설팅을 삭제하시겠습니까?')) {
                var conSeq = $(this).data('conSeq');
                var form = document.forms.deleteForm;
                form.conSeq.value = conSeq;
                form.submit();
            }
        });
    });
})();