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

    });

})();

function validationForm() {
    var subject = $("#subject").val();
    var content = editor.getMarkdown();

    if(subject == ""){
        alert("질문을 입력해주세요");
        return false;
    }

    if (content.trim() === '') {
        alert('답변을 입력해주세요');
        return false;
    }

    $('#content').val(content);
    return true;
}