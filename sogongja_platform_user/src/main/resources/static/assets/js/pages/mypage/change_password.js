(function() {
    'use strict'
    $(document).ready(function() {

    });

})();

function validationForm() {

    if ($('#password').val() === $('#newPassword').val()) {
        alert('현재 비밀번호와 새로운 비밀번호가 동일합니다');
        return false;
    }

    if ($('#newPassword').val() !== $('#passwordConfirm').val()) {
        alert('새로운 비밀번호와 새로운 비밀번호 확인이 다릅니다');
        return false;
    }

    return true;
}