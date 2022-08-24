(function() {
    'use strict'
    $(document).ready(function() {

        var viewer = new toastui.Editor({
            el: document.querySelector('#viewer'),
            initialValue: tui_content,
            linkAttribute: {
                target: '_blank',
                contenteditable: 'false',
                rel: 'noopener noreferrer'
            }
        });
    });
})();