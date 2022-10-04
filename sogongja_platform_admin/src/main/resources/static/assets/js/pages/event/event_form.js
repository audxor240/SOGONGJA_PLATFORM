(function() {
    'use strict'
    $(document).ready(function () {

        $('#pc_event_del').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);

            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        window.location.reload();
                        showAlert('3');
                        //_$this.closest('div.attach-file').remove();

                    }
                });
            }
        });

    });
})();

function validationForm(){
    let title = $("#title").val();
    let url = $("#url").val();
    let imageFile = $("[name=imageFile]").val();
    let file_text = $("[name=file_text]").val();
    let eventStart = $("#eventStart").val();
    let eventEnd = $("#eventEnd").val();
    let eventSeq = $("#eventSeq").val();            //현재 팝업의 SEQ
    let eventUsedSeq = $("#eventUsedSeq").val();    //사용중인 팝업의 SEQ

    if(title == ""){
        alert("제목을 입력해 주세요.");
        return false;
    }
    if(url == ""){
        alert("URL을 입력해 주세요.");
        return false;
    }

    if(file_text == ""){
        alert("팝업 이미지를 선택해 주세요.");
        return false;
    }

    if(eventStart == ""){
        alert("시작 기간을 선택해 주세요.");
        return false;
    }
    if(eventEnd == ""){
        alert("종료 기간을 선택해 주세요.");
        return false;
    }

    if($('[name=used]').is(':checked')){
        if(eventUsedSeq != "" && eventSeq != eventUsedSeq){
            if(!confirm("사용중인 이벤트 팝업이 있습니다. 변경하시겠습니까?")){
                return false;
            }
        }
    }


    return true;
}