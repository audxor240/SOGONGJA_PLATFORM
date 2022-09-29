(function() {
    'use strict'
    $(document).ready(function () {

        $('#pc_banner_del').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);

            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        window.location.reload();
                        showAlert('3');
                        //_$this.closest('div.attach-file').remove();

                    }
                });
            }
        });

        $('#mobile_banner_del').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);

            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        window.location.reload();
                        showAlert('3');
                        //_$this.closest('div.attach-file').remove();
                    }
                });
            }
        });

    });
})();