$(function() {

    $(document).ready(function() {
        document.getElementById('agree_all').addEventListener('click', function() {
            document.getElementById('agree1').checked = this.checked;
            document.getElementById('agree2').checked = this.checked;
        });
    });

});


function validationForm() {

    if (!document.getElementById('agree1').checked) {
        alert('이용약관에 동의해 주십시오.');
        return false;
    }

    if (!document.getElementById('agree2').checked) {
        alert('개인정보 수집 및 이용에 동의해 주십시오.');
        return false;
    }

    return true;
}