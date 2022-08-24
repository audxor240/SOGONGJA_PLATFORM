(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 게시물을 삭제하시겠습니까?')) {
                var projectSeq = $(this).data('projectSeq');
                var form = document.forms.deleteForm;
                form.projectSeq.value = projectSeq;
                form.submit();
            }
        });
    });
})();