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


        $('#tags').tagsinput({
            trimValue: true,
            confirmKeys: [32, 13]
        });

        $('.bootstrap-tagsinput input').keydown(function(event) {
            if (event.which == 13) {
                $(this).blur();
                $(this).focus();
                return false;
            }
        });

        $(document).on('keydown', ':input:not(textarea, .bootstrap-tagsinput input)', function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });

        var strEmpty = '<option value="">선택하세요</option>';

        $('#category1').on('change', function() {
            var strHTML = strEmpty;
            if ($(this).val()) {
                var data = {
                    groupCode: 'CATEGORY_2',
                    refCode: $(this).val()
                }
                ajaxPost('/api/code/ref', data, function(result) {
                    $.each(result.data, function(index, item) {
                        strHTML += '<option value="' + item.code + '">' + item.code_name + '</option>';
                    });
                    $('#category2').html(strHTML);
                    $('#category3').html(strEmpty);
                });
            } else {
                $('#category2').html(strHTML);
                $('#category3').html(strEmpty);
            }

        });

        $('#category2').on('change', function() {
            var strHTML = strEmpty;
            if ($(this).val()) {
                var data = {
                    groupCode: 'CATEGORY_3',
                    refCode: $(this).val()
                }
                ajaxPost('/api/code/ref', data, function(result) {
                    $.each(result.data, function(index, item) {
                        strHTML += '<option value="' + item.code + '">' + item.code_name + '</option>';
                    });
                    $('#category3').html(strHTML);
                });
            } else {
                $('#category3').html(strHTML);
            }
        });

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

        $('#btn-add-file').on('click', function() {
            if ($('.attach-file-count').length > 4) {
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
            strHTML += '<div class="pt-2 attach-file attach-file-count">';
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


    return true;
}