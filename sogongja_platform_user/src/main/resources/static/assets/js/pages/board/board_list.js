(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

    });
})();

function detailView(board_seq, reg_user_seq,secret_use){


    if(secret_use == 'Y'){
        alert("비공개글 입니다.");
        return false;
    }

    window.location.href = "/board/qna/"+board_seq+"?reg_user_seq="+reg_user_seq;    //작성자가 가닌 사람이 볼때

}