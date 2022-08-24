(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당  배너을 삭제하시겠습니까?')) {
                var bannerSeq = $(this).data('bannerSeq');
                var form = document.forms.deleteForm;
                //alert(bannerSeq);
                form.bannerSeq.value = bannerSeq;
                form.submit();
            }
        });
    });
})();