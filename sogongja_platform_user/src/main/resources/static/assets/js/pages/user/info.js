(function() {
    'use strict'
    $(document).ready(function() {

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

        $('#type01_01').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
            $("#type02_01_01").prop("checked",true);
        });

        $('#type01_02').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").show();
            $("#type02_02_01").prop("checked",true);
            $("#sub03").hide();
        });

        $('#type01_03').change(function(){
            $("input:radio[name='subType']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
            $("#type02_03_01").prop("checked",true);
        });

        $('#type01_04').change(function(){
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").hide();
        });

        let type = $("#type").val();
        let subType = $("#subType").val();

        if(type == "1"){
            $("#type01_01").prop("checked",true);
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
            if(subType == "1"){
                $("#type02_01_01").prop("checked",true);
            }else if(subType == "2"){
                $("#type02_01_02").prop("checked",true);
            }

        }else if(type == "2"){
            $("#type01_02").prop("checked",true);
            $("#sub01").hide();
            $("#sub02").show();
            $("#sub03").hide();
            if(subType == "3"){
                $("#type02_02_01").prop("checked",true);
            }
        }else if(type == "3"){
            $("#type01_03").prop("checked",true);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
            if(subType == "4"){
                $("#type02_03_01").prop("checked",true);
            }else if(subType == "5"){
                $("#type02_03_02").prop("checked",true);
            }else if(subType == "6"){
                $("#type02_03_03").prop("checked",true);
            }
        }else if(type == "4"){
            $("#type01_04").prop("checked",true);
        }

    });

})();

function validationForm() {

    return true;
}