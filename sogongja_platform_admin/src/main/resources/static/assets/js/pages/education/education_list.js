(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 교육을 삭제하시겠습니까?')) {
                var eduSeq = $(this).data('eduSeq');
                var form = document.forms.deleteForm;
                form.eduSeq.value = eduSeq;
                form.submit();
            }
        });
    });
})();