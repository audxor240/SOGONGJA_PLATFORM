(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

    });
})();

function detailView(board_seq, reg_user_seq,secret_use){

    let session_seq = $("#session_seq").val();

    if(secret_use == 'Y'){
        if(session_seq != reg_user_seq) {
            alert("비공개글 입니다.");
            return false;
        }
    }

    window.location.href = "/board/qna/"+board_seq+"?reg_user_seq="+reg_user_seq;

}