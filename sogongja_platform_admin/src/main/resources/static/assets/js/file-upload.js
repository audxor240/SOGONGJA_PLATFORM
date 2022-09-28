(function() {
    'use strict'

    $(document).ready(function() {
        $(document).on('click', '.file-upload-browse', function(e) {
            var file = $(this).closest('div.attach-file').find('input.file-upload-default');
            file.trigger('click');
        });

        $(document).on('change', '.file-upload-default', function(e) {
            $(this).parent().find('input.file-upload-title').val($(this).val().replace(/C:\\fakepath\\/i, ''));
        });

    });
})();

// PC
function readURLPC(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImgPc').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('previewImgPc').src = "https://dummyimage.com/500x500/ffffff/000000.png&text=preview+image";
    }
}


// 모바일
function readURLM(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImgM').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('previewImgM').src = "https://dummyimage.com/500x500/ffffff/000000.png&text=preview+image";
    }
}