(function() {
    'use strict'
    $(document).ready(function() {

        // 그룹 코드 삭제
        $('.btn-delete-master').on('click', function() {
            if (confirm('해당 그룹 코드를 삭제하시겠습니까?\n그룹 코드 삭제시 상세 코드도 같이 삭제됩니다.')) {
                deleteCode('M', $(this).data('group-code'));
            }
        });

        // 상세 코드 삭제
        $('.btn-delete-detail').on('click', function() {
            if (confirm('해당 코드를 삭제하시겠습니까?')) {
                deleteCode('D', $(this).data('group-code'), $(this).data('code'));
            }
        });

        // 그룹 코드 등록
        $('.btn-add-master').on('click', function() {
            $('#grp_code').val('');
            $('#grp_code_name').val('');
            $('#modal-group').modal('show');
        });

        // 상세 코드 등록
        $('.btn-add-detail').on('click', function() {
            openCodeDeailModal();
        });

        // 그룹 코드 조회
        $('.btn-modify-master').on('click', function() {
            getCodeInfo('M', $(this).data('group-code'));
        });

        // 상세 코드 조회
        $('.btn-modify-detail').on('click', function() {
            var grp_code = $(this).data('group-code');
            var code = $(this).data('code');
            openCodeDeailModal(grp_code, code);
        });

        $('.btn-register-master').on('click', function() {
            saveCodeMaster();
        });

        $('.btn-register-detail').on('click', function() {
            saveCodeDetail();
        });

        function openCodeDeailModal(grp_code, code) {

            ajaxPost('/setting/code/master', {}, function(result) {
                $('#group_code').empty();
                $.each(result.data, function(index, item) {
                    $('#group_code').append($('<option value="' + item.grp_code + '">' + item.grp_code_name + '</option>'))
                });
                if (grp_code) {
                    // 수정인 경우
                    getCodeInfo('D', grp_code, code);
                } else {
                    // 등록
                    var group_code = $('.code-master').find('.table-info').data('group-code');
                    if (group_code) {
                        $('#group_code').val(group_code);
                    }
                    $('#code').val('');
                    $('#code_name').val('');
                    $('#ordby').val('');
                    $('#use_flag').prop('checked', true).change();
                    $('#modal-detail').modal('show');
                }
            });
        }

        function getCodeInfo(type, grp_code, code) {
            var data = {
                type: type,
                grp_code: grp_code,
                code: code
            };

            ajaxPost('/setting/code/load', data, function(result) {
                if (type === 'M') {
                    $('#grp_code').val(result.data.grp_code);
                    $('#grp_code_name').val(result.data.grp_code_name);
                    $('#modal-group').modal('show');
                } else {
                    $('#group_code').val(result.data.grp_code);
                    $('#code').val(result.data.code);
                    $('#code_name').val(result.data.code_name);
                    $('#ordby').val(result.data.ordby);
                    $('#use_flag').prop('checked', result.data.use_flag).change();
                    $('#modal-detail').modal('show');
                }
            });
        }

        function saveCodeMaster() {
            var grp_code = $('#grp_code').val().trim();
            var grp_code_name = $('#grp_code_name').val().trim();

            if (grp_code === '') {
                alert('그룹 코드를 입력하세요.');
                return;
            }

            if (grp_code_name === '') {
                alert('그룹 코드명을 입력하세요.');
                return;
            }

            var data = {
                grp_code: grp_code,
                grp_code_name: grp_code_name
            };

            ajaxPost('/setting/code/register/master', data, function(result) {
                if (result.result_code === 200) {
                    showAlert('4');
                    window.location.reload();
                }
            });
        }

        function saveCodeDetail() {
            var grp_code = $('#group_code').val();
            var code = $('#code').val();
            var code_name = $('#code_name').val();
            var ordby = $('#ordby').val();
            var use_flag = $('#use_flag').is(':checked') ? 1 : 0;

            if (grp_code === '') {
                alert('그룹 코드를 선택하세요.');
                return false;
            }

            if (code === '') {
                alert('코드를 입력하세요.');
                return false;
            }

            if (code_name === '') {
                alert('코드명을 입력하세요.');
                return false;
            }

            var data = {
                grp_code: grp_code,
                code: code,
                code_name: code_name,
                ordby: ordby ? ordby : null,
                use_flag: use_flag
            };

            ajaxPost('/setting/code/register/detail', data, function(result) {
                if (result.result_code === 200) {
                    showAlert('4');
                    window.location.reload();
                }
            });
        }

        function deleteCode(type, grp_code, code) {
            var data = {
                type: type,
                grp_code: grp_code,
                code: code
            };

            ajaxPost('/setting/code/delete', data, function(result) {
                if (result.result_code === 200) {
                    showAlert('3');
                    window.location.reload();
                }
            });
        }
    });
})();