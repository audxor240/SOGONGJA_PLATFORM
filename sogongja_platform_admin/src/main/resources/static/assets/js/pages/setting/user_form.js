(function() {
    'use strict'
    $(document).ready(function() {

        $('.pop_pw_btn').on('click', function() {
            $('.pop_pw_wrap').addClass('on');
        });
        $('.pop_pw_close').on('click', function() {
            $('.pop_pw_wrap').removeClass('on');
        });

        $('#useCategory01').change(function(){
            $("input:radio[name='useCategory']").prop("chcecked",false);
            $("#sub01").show();
            $("#sub02").hide();
            $("#sub03").hide();
            $("#useCategory01_01").prop("checked",true);
        });

        $('#useCategory02').change(function(){
            $("input:radio[name='useCategory']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").show();
            $("#useCategory02_01").prop("checked",true);
            $("#sub03").hide();
        });

        $('#useCategory03').change(function(){
            $("input:radio[name='useCategory']").prop("chcecked",false);
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").show();
            $("#useCategory03_01").prop("checked",true);
        });

        $('#useCategory04').change(function(){
            $("#sub01").hide();
            $("#sub02").hide();
            $("#sub03").hide();
        });



    });
})();