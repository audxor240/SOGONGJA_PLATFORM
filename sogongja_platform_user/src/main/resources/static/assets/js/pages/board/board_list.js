(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

    });
})();

function detailView(board_seq, reg_user_seq){



console.log("session_seq : "+ $("#session_seq").val());
console.log("board :: "+board_seq);
console.log("reg_user_seq :: "+reg_user_seq);
    return;
    window.location.href = "/board/${boardType}/"+board_seq;
}