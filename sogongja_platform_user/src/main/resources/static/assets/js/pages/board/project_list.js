(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $(document).on('change', '.checked_all', function() {
            var elemName = $(this).attr('name');
            $('input[name="' + elemName + '"]:checkbox').prop('checked', $(this).is(':checked'));
        });

    });

})();