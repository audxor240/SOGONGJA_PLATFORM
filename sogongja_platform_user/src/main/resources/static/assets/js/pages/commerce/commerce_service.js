'use strict'
$(document).ready(function() {
    $('.toggle_info').hide()

    $('.arr_down').click(function (){
        $(this).children().toggleClass('active')
        if($(this).children().hasClass('active')){
            $(this).parent().children('.toggle_info').slideDown()
        }else{
            $(this).parent().children('.toggle_info').slideUp()
        }
        $(this).parent().siblings().children('.arr_down').children().removeClass('active')
        $(this).parent().siblings().children('.toggle_info').slideUp()
    })
})