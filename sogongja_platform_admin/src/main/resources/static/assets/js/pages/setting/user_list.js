(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-delete').on('click', function() {
            if (confirm('복원할수 없습니다. 정말 삭제하시겠습니까?')) {
                let user_seq = $(this).attr('value');
                console.log(user_seq)

                var data = {
                    user_seq : user_seq
                }

                ajaxPostSyn('/setting/delete/user', data, function (result) {
                    // console.log('result : ', result);
                    if (result.result_code === 200) {
                        location.reload();
                    } else if (result.result_code === -101) {
                        alert('사용자를 확인해 주세요.');
                        return false;
                    } else {
                        alert('다시 시도해주세요.');
                        return false;
                    }
                });
            }
        });



        $('.btn.col-sm-1.btn-danger.mr-1').on('click', function() {
            let count = $('.delete_chk:checked').length;
            console.log(count)

            if (count > 0) {
                if (confirm('복원할수 없습니다. 체크한 사용자를 모두 삭제하시겠습니까?')) {

                    $('.delete_chk:checked').each(function () {
                        let user_seq = $(this).attr('value');
                        var data = {
                            user_seq : user_seq
                        };

                        ajaxPostSyn('/setting/delete/user', data, function (result) {
                            // console.log('result : ', result);
                            if (result.result_code === 200) {
                            } else {
                                alert('다시 시도해주세요.');
                                return false;
                            }
                        });
                    });
                }
                location.reload();
            } else {
                alert('삭제할 사용자를 선택해주세요.');
                return false;
            }
        });
    });
})();