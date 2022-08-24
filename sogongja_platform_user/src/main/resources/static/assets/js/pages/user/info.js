(function() {
    'use strict'
    $(document).ready(function() {

        $('#email3').on('change', function() {
            var value = $(this).val();
            if (value === '') {
                $('#email2').attr('readOnly', false);
                $('#email2').val('');
            } else {
                $('#email2').attr('readOnly', true);
                $('#email2').val(value);
            }
        });
    });

})();

function validationForm() {

    return true;
}