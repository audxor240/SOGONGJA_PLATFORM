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

        $("#fileUse").change(function(){
            if($("#fileUse").is(":checked")){
                $("#file_dir").show();
            }else{
                $("#file_dir").hide();
            }
        });

    });

})();

function validationForm() {
    let name = $("#name").val();
    let desc = editor.getMarkdown();
    let fileDirectoryName = $("#fileDirectoryName").val();


    if(name == ""){
        alert("게시판 이름을 입력해주세요.");
        return false;
    }
    if (desc.trim() === '') {
        alert('설명을 입력해주세요.');
        return false;
    }
    $('#description').val(desc);

    if($("#fileUse").is(":checked")){
        if(fileDirectoryName == ""){
            alert("첨부파일 저장 디렉토리명을 입력해주세요.");
            return false;
        }
    }

    return true;
}