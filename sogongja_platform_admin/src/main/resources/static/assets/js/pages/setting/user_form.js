'use strict'
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    };
}, true);
$(document).ready(function () {

    // 기존
    $('.pop_pw_btn').on('click', function () {
        $('.pop_pw_wrap').addClass('on');
    });
    $('.pop_pw_close').on('click', function () {
        $('.pop_pw_wrap').removeClass('on');
    });
    $('#pw_modify').on('click', function () {

        const pw_pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;

        if ($('#password').length) {
            var password = $("#password").val();
            if ($.trim(password.length) < 1) {
                alert('비밀번호를 입력하세요');
                $("#password").focus();
                return false;
            }
            if (!pw_pattern.test(password)) {
                alert(" 비밀번호는 영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
                $("#password").focus();
                return false;
            }
        }

        if ($('#passwordConfirm').length) {
            var passwordConfirm = $("#passwordConfirm").val();
            if ($.trim(passwordConfirm.length) < 1) {
                alert('비밀번호 확인을 입력하세요,');
                $("#passwordConfirm").focus();
                return false;
            }
            if($("#password").val() != $("#passwordConfirm").val()) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                $("#passwordConfirm").focus();
                return false;
            }
        }

        $("#pw_check").attr("value", "true");
        $('.pop_pw_wrap').removeClass('on');
    });

    $('#useCategory01').change(function () {
        $("#sub01").show();
        $("#sub02").hide();
        $("#sub03").hide();
        $("#useCategory01_01").prop("checked", true);
    });

    $('#useCategory02').change(function () {
        $("#sub01").hide();
        $("#sub02").show();
        $("#useCategory02_01").prop("checked", true);
        $("#sub03").hide();
    });

    $('#useCategory03').change(function () {
        $("#sub01").hide();
        $("#sub02").hide();
        $("#sub03").show();
        $("#useCategory03_01").prop("checked", true);
    });

    $('#useCategory04').change(function () {
        $("#sub01").hide();
        $("#sub02").hide();
        $("#sub03").hide();
    });

    $('#id').change(function () {
        $("#id_check").attr("value", "false");
    });


    $('#email3').on('change', function() {
        var value = $(this).val();
        if (value === '') {
            $('#email2').attr('readOnly', false);
            $('#email2').val('');
        } else {
            $('#email2').attr('readOnly', true);
            $('#email2').val(value);
        }
    });

    $('.btn.btn-primary.mb-3').click(function () {

        if ($('#id').length) {
            var id = $("#id").val();
            if ($.trim(id.length) < 1) {
                alert('아이디을 입력하세요');
                $("#id").focus();
                return false;
            }

            if ($.trim(id.length) < 5) {
                alert('아이디를 5자 이상 입력하세요');
                $("#id").focus();
                return false;
            }

            var data = {
                id: id
            }

            ajaxPost('/setting/user/checked/id', data, function(result) {
                // console.log('result : ', result);
                if (result.result_code === 200) {
                    $('#checkedId').val(id);
                    alert('사용할 수 있는 아이디입니다.');
                    $("#id_check").attr("value", "true");
                } else if (result.result_code === -101) {
                    alert('사용할수 없는 아이디입니다.');
                    $("#id_check").attr("value", "false");
                    $("#id").val("");
                    $("#id").focus();
                } else {
                    alert('사용 중인 아이디입니다.');
                    $("#id_check").attr("value", "false");
                    $("#id").val("");
                    $("#id").focus();
                }
            });
        }

    });

    $('#new_submit').click(function () {
        const pw_pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;
        const email_pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;


        if ($('#nickName').length) {
            var nickName = $("#nickName").val();
            if ($.trim(nickName.length) < 1) {
                alert('닉네임을 입력하세요');
                $("#nickName").focus();
                return false;
            }

            if ($.trim(nickName.length) < 5) {
                alert('닉네임을 5자 이상 입력하세요');
                $("#nickName").focus();
                return false;
            }

        }

        if ($('#id').length) {
            var id = $("#id").val();
            if ($.trim(id.length) < 1) {
                alert('아이디을 입력하세요');
                $("#id").focus();
                return false;
            }

            if ($.trim(id.length) < 5) {
                alert('아이디를 5자 이상 입력하세요');
                $("#id").focus();
                return false;
            }

            if ($('#id_check').val() === 'false') {
                alert('아이디 중복확인을 해주세요.');
                return false;
            }
        }

        if ($('#username').length) {
            var username = $("#username").val();
            if ($.trim(username.length) < 1) {
                alert('이름을 입력하세요');
                $("#username").focus();
                return false;
            }
        }
        if ($('#password').length) {
            var password = $("#password").val();
            if ($.trim(password.length) < 1) {
                alert('비밀번호를 입력하세요');
                $("#password").focus();
                return false;
            }
            if (!pw_pattern.test(password)) {
                alert(" 비밀번호는 영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
                $("#password").focus();
                return false;
            }
        }

        if ($('#passwordConfirm').length) {
            var passwordConfirm = $("#passwordConfirm").val();
            if ($.trim(passwordConfirm.length) < 1) {
                alert('비밀번호 확인을 입력하세요,');
                $("#passwordConfirm").focus();
                return false;
            }
            if($("#password").val() != $("#passwordConfirm").val()) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                $("#passwordConfirm").focus();
                return false;
            }
        }

        if ($('#email1').length) {
            var email1 = $("#email1").val();
            var email2 = $("#email2").val();
            if ($.trim(email1.length) < 1) {
                alert('이메일을 입력하세요.');
                $("#email1").focus();
                return false;
            }
            if ($.trim(email2.length) < 1) {
                alert('이메일을 입력하세요.');
                $("#email2").focus();
                return false;
            }
        }

        if ($('#hp1').length) {
            var hp1 = $("#hp1").val();
            var hp2 = $("#hp2").val();
            var hp3 = $("#hp3").val();
            if ($.trim(hp1.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp1").focus();
                return false;
            }
            if ($.trim(hp2.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp2").focus();
                return false;
            }
            if ($.trim(hp3.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp3").focus();
                return false;
            }

        }

        if ($('#auth').length) {
            var auth = $("#auth").val();
            if ($.trim(auth.length) < 1) {
                alert('권한을 선택하세요.');
                $("#auth").focus();
                return false;
            }
        }


        var nickName = $("#nickName").val();
        var userSeq = $("#userSeq").val();
        var data = {
            userSeq : userSeq,
            nickName: nickName
        }

        ajaxPostSyn('/setting/user/checked/nickName', data, function (result) {
            // console.log('result : ', result);
            if (result.result_code === 200) {
                $('#checkedNickName').val(nickName);
                // alert('사용할 수 있는 닉네임입니다.');
                $("#user_form").submit();
            } else if (result.result_code === -101) {
                $("#nickName").val("");
                alert('사용할수 없는 닉네임입니다.');
                $("#nickName").focus();
                return false;
            } else {
                alert('사용 중인 닉네임입니다.');
                $("#nickName").val("");
                $("#nickName").focus();
                return false;
            }
        });
        return false;
    });

    $('#mod_submit').click(function () {

        const pw_pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;


        if ($('#nickName').length) {
            var nickName = $("#nickName").val();
            if ($.trim(nickName.length) < 1) {
                alert('닉네임을 입력하세요');
                $("#nickName").focus();
                return false;
            }

            if ($.trim(nickName.length) < 5) {
                alert('닉네임을 5자 이상 입력하세요');
                $("#nickName").focus();
                return false;
            }

        }

        if ($('#username').length) {
            var username = $("#username").val();
            if ($.trim(username.length) < 1) {
                alert('이름을 입력하세요');
                $("#username").focus();
                return false;
            }
        }

        var pw_check = $('#pw_check').val();

        if (pw_check === 'true') {
            if($("#password").val() != $("#passwordConfirm").val()) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                $("#passwordConfirm").focus();
                return false;
            }
        }


        if ($('#email1').length) {
            var email1 = $("#email1").val();
            var email2 = $("#email2").val();
            if ($.trim(email1.length) < 1) {
                alert('이메일을 입력하세요.');
                $("#email1").focus();
                return false;
            }
            if ($.trim(email2.length) < 1) {
                alert('이메일을 입력하세요.');
                $("#email2").focus();
                return false;
            }
        }

        if ($('#hp1').length) {
            var hp1 = $("#hp1").val();
            var hp2 = $("#hp2").val();
            var hp3 = $("#hp3").val();
            if ($.trim(hp1.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp1").focus();
                return false;
            }
            if ($.trim(hp2.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp2").focus();
                return false;
            }
            if ($.trim(hp3.length) < 1) {
                alert('전화번호를 입력하세요.');
                $("#hp3").focus();
                return false;
            }

        }

        var nickName = $("#nickName").val();
        var userSeq = $("#userSeq").val();
        var data = {
            userSeq : userSeq,
            nickName: nickName
        }

        ajaxPostSyn('/setting/user/checked/nickName', data, function (result) {
            // console.log('result : ', result);
            if (result.result_code === 200) {
                $('#checkedNickName').val(nickName);
                // alert('사용할 수 있는 닉네임입니다.');
                $("#user_form").submit();
            } else if (result.result_code === -101) {
                $("#nickName").val("");
                alert('사용할수 없는 닉네임입니다.');
                $("#nickName").focus();
                return false;
            } else {
                alert('사용 중인 닉네임입니다.');
                $("#nickName").focus();
                return false;
            }
        });
        return false;

    });

});


// function validationForm() {
//
//     const pw_pattern = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,}$/;
//     const email_pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
//
//
//     if ($('#nickName').length) {
//         var nickName = $("#nickName").val();
//         if ($.trim(nickName.length) < 1) {
//             alert('닉네임을 입력하세요');
//             $("#nickName").focus();
//             return false;
//         }
//
//         if ($.trim(nickName.length) < 5) {
//             alert('닉네임을 5자 이상 입력하세요');
//             $("#nickName").focus();
//             return false;
//         }
//
//     }
//
//     if ($('#id').length) {
//         var id = $("#id").val();
//         if ($.trim(id.length) < 1) {
//             alert('아이디을 입력하세요');
//             $("#id").focus();
//             return false;
//         }
//
//         if ($.trim(id.length) < 5) {
//             alert('아이디를 5자 이상 입력하세요');
//             $("#id").focus();
//             return false;
//         }
//
//         if ($('#id_check').val() === 'false') {
//             alert('아이디 중복확인을 해주세요.');
//             return false;
//         }
//     }
//
//     if ($('#username').length) {
//         var username = $("#username").val();
//         if ($.trim(username.length) < 1) {
//             alert('이름을 입력하세요');
//             $("#username").focus();
//             return false;
//         }
//     }
//     if ($('#password').length) {
//         var password = $("#password").val();
//         if ($.trim(password.length) < 1) {
//             alert('비밀번호를 입력하세요');
//             $("#password").focus();
//             return false;
//         }
//         if (!pw_pattern.test(password)) {
//             alert(" 비밀번호는 영문, 특수문자, 숫자 포함 8자리 이상 입력해주세요.");
//             $("#password").focus();
//             return false;
//         }
//     }
//
//     if ($('#passwordConfirm').length) {
//         var passwordConfirm = $("#passwordConfirm").val();
//         if ($.trim(passwordConfirm.length) < 1) {
//             alert('비밀번호 확인을 입력하세요,');
//             $("#passwordConfirm").focus();
//             return false;
//         }
//         if($("#password").val() != $("#passwordConfirm").val()) {
//             alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
//             $("#passwordConfirm").focus();
//             return false;
//         }
//     }
//
//     if ($('#email1').length) {
//         var email1 = $("#email1").val();
//         var email2 = $("#email2").val();
//         if ($.trim(email1.length) < 1) {
//             alert('이메일을 입력하세요.');
//             $("#email1").focus();
//             return false;
//         }
//         if ($.trim(email2.length) < 1) {
//             alert('이메일을 입력하세요.');
//             $("#email2").focus();
//             return false;
//         }
//     }
//
//     if ($('#hp1').length) {
//         var hp1 = $("#hp1").val();
//         var hp2 = $("#hp2").val();
//         var hp3 = $("#hp3").val();
//         if ($.trim(hp1.length) < 1) {
//             alert('전화번호를 입력하세요.');
//             $("#hp1").focus();
//             return false;
//         }
//         if ($.trim(hp2.length) < 1) {
//             alert('전화번호를 입력하세요.');
//             $("#hp2").focus();
//             return false;
//         }
//         if ($.trim(hp3.length) < 1) {
//             alert('전화번호를 입력하세요.');
//             $("#hp3").focus();
//             return false;
//         }
//
//     }
//
//     if ($('#auth').length) {
//         var auth = $("#auth").val();
//         if ($.trim(auth.length) < 1) {
//             alert('권한을 선택하세요.');
//             $("#auth").focus();
//             return false;
//         }
//     }
//
//
//     var nickName = $("#nickName").val();
//     var data = {
//         nickName: nickName
//     }
//
//     ajaxPostSyn('/setting/user/checked/nickName', data, function (result) {
//         // console.log('result : ', result);
//         if (result.result_code === 200) {
//             $('#checkedNickName').val(nickName);
//             // alert('사용할 수 있는 닉네임입니다.');
//             return true;
//         } else if (result.result_code === -101) {
//             $("#nickName").val("");
//             alert('사용할수 없는 닉네임입니다.');
//             $("#nickName").focus();
//             return false;
//         } else {
//             alert('사용 중인 닉네임입니다.');
//             $("#nickName").val("");
//             $("#nickName").focus();
//             return false;
//         }
//     });
//
// }
