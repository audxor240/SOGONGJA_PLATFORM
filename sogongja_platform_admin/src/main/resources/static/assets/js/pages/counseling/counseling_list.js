(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 사례를 삭제하시겠습니까?')) {
                var couSeq = $(this).data('couSeq');
                var form = document.forms.deleteForm;
                form.conSeq.value = couSeq;
                form.submit();
            }
        });
    });
})();