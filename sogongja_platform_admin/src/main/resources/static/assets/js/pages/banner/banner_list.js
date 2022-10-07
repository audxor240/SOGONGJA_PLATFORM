(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('해당 배너를 삭제하시겠습니까?')) {
                var bannerSeq = $(this).data('bannerSeq');

                var form = document.forms.deleteForm;
                form.bannerSeq.value = bannerSeq;
                form.submit();
            }
        });

        $('.pcOrder').on('click', function(e) {
            var bannerSeq = $(this).data('bannerSeq');
            var form = document.forms.orderUpdate;
            form.bannerSeq.value = bannerSeq;
            form.type.value = "PC";
            form.num.value = $(this).parent().find('input').val();
            form.submit();
        });

        $('.mobileOrder').on('click', function() {
            var bannerSeq = $(this).data('bannerSeq');
            var form = document.forms.orderUpdate;
            form.bannerSeq.value = bannerSeq;
            form.type.value = "MOBILE";
            form.num.value = $(this).parent().find('input').val();
            form.submit();
        });

        $('.bannerUse').on('click', function() {
            var bannerSeq = $(this).data('bannerSeq');
            if($(this).is(':checked')){
                var used = "1";
            }else{
                var used = null;
            }
            var form = document.forms.bannerUse;
            form.bannerSeq.value = bannerSeq;
            form.use.value = used;

            form.submit();
        });

    });
})();