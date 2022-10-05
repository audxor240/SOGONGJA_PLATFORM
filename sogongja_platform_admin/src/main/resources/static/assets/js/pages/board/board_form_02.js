(function() {
    'use strict'
    $(document).ready(function() {

        editor = new toastui.Editor({
            el: document.querySelector('#editor'),
            initialEditType: 'wysiwyg',
            hideModeSwitch: true,
            height: '500px',
            previewStyle: 'vertical',
            plugins: [toastui.Editor.plugin.colorSyntax],
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });
        editor.setMarkdown(tui_content);

        editor2 = new toastui.Editor({
            el: document.querySelector('#editor2'),
            initialEditType: 'wysiwyg',
            hideModeSwitch: true,
            height: '500px',
            previewStyle: 'vertical',
            plugins: [toastui.Editor.plugin.colorSyntax],
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });

        editor2.setMarkdown(tui_content2);


        $('.btn-delete-file').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);

            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        showAlert('3');
                        _$this.closest('div.attach-file').remove();
                        // window.location.reload();
                    }
                });
            }
        });

        $('input:radio[name="category"]').on('click', function() {
            if ($(this).val() === 'VIDEO') {
                $('#thumbnailImageFile').show();
            } else {
                $('#thumbnailImageFile').hide();
            }
        });

        $('input:radio[name="popupFlag"]').on('click', function() {
            if ($(this).val() === '0') {
                $('#fromDt').val('');
                $('#toDt').val('');
                $('.popup-date').hide();
            } else {
                $('.popup-date').show();
            }
        });

        $('#btn-add-file').on('click', function() {
            if ($('.attach-file').length > 4) {
                alert('최대 5개까지 가능합니다.');
                return;
            }
            addFileRow();
        });

        $(document).on('click', '.btn-delete-upload', function() {
            $(this).closest('div.attach-file').remove();
            if ($('.attach-file-group .attach-file').length === 0) {
                addFileRow();
            }
        });

        function addFileRow() {
            var strHTML = '';
            strHTML += '<div class="pt-2 attach-file">';
            strHTML += '  <input type="file" name="attachFiles" class="file-upload-default">';
            strHTML += '  <div class="input-group col-xs-12">';
            strHTML += '    <input type="text" class="form-control file-upload-title" disabled="disabled" placeholder="">';
            strHTML += '    <span class="input-group-append">';
            strHTML += '      <button type="button" class="file-upload-browse btn btn-primary">파일선택</button>';
            strHTML += '      <button type="button" class="btn btn-danger btn-delete-upload ml-3">삭제</button>';
            strHTML += '    </span>';
            strHTML += '  </div>';
            strHTML += '</div>';

            $('div.attach-file-group:last').append(strHTML);
        }
    });

})();

function validationForm() {
    var content = editor.getMarkdown();
    var content2 = editor2.getMarkdown();

    if (content.trim() === '') {
        alert('내용을 입력하세요.');
        return false;
    }

    if ($('input:radio[name="popupFlag"]:checked').val() === '1') {
        if ($('#fromDt').val() === '' || $('#toDt').val() === '') {
            alert('팝업 기간을 입력하세요.');
            return false;
        }
    }

    $('#content').val(content);

    return true;
}