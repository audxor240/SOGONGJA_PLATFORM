(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

    });
})();

function detailView(board_setting_seq, board_seq, reg_user_seq, boardName,secret_use){

    let session_seq = $("#session_seq").val();

    if(secret_use == 'Y'){
        if(session_seq != reg_user_seq) {
            alert("비공개글 입니다.");
            return false;
        }
    }

    window.location.href = "/board/"+board_setting_seq+"/"+board_seq+"?name="+boardName;

}