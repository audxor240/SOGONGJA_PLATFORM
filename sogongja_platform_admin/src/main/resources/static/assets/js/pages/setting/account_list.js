(function() {
    'use strict'
    $(document).ready(function() {

        commonSearchPaging();

        $('.btn-add-account').on('click', function() {
            openMenuModal();
        });

        $('.btn-modify').on('click', function() {
            var account_seq = $(this).data('account-seq');
            openMenuModal(account_seq);
        });

        $('.btn-delete').on('click', function() {
            if (confirm('해당 입금계좌를 삭제하시겠습니까?')) {
                var data = {
                    account_seq: $(this).data('account-seq')
                };

                ajaxPost('/setting/account/delete', data, function(result) {
                    if (result.result_code === 200) {
                        showAlert('3');
                        $('.btn-search').click();
                    }
                });
            }
        });

        function openMenuModal(accountSeq) {
            if (accountSeq) {
                getAccount(accountSeq);
            } else {
                $('#account_seq').val('');
                $('#bank').val('');
                $('#account_no').val('');
                $('#account_user_name').val('');
                $('#description').val('');
                $('#modal-account').modal('show');
            }
        }

        function getAccount(accountSeq) {
            var data = {
                account_seq: accountSeq
            };

            ajaxPost('/setting/account/load', data, function(result) {
                $('#account_seq').val(result.data.account_seq);
                $('#bank').val(result.data.bank);
                $('#account_no').val(result.data.account_no);
                $('#account_user_name').val(result.data.account_user_name);
                $('#description').val(result.data.description);
                $('#modal-account').modal('show');
            });
        }

        $('.btn-register').on('click', function() {
            var account_seq = $('#account_seq').val();
            var bank = $('#bank').val();
            var account_no = $('#account_no').val().trim();
            var account_user_name = $('#account_user_name').val();
            var description = $('#description').val().trim();

            if (bank === '') {
                alert('입금은행을 선택하세요.');
                return false;
            }

            if (account_no === '') {
                alert('입금계좌번호를 입력하세요.');
                return false;
            }

            if (account_user_name === '') {
                alert('예금주를 입력하세요.');
                return false;
            }

            var data = {
                accountSeq: account_seq,
                bank: bank,
                accountNo: account_no,
                accountUserName: account_user_name,
                description: description
            };

            ajaxPost('/setting/account/register', data, function(result) {
                if (result.result_code === 200) {
                    showAlert('4');
                    $('.btn-search').click();
                } else if (result.result_code === -1001) {
                    alert('이미 등록된 계좌번호입니다.');
                }
            });
        });
    });
})();