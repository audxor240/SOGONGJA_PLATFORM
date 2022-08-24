$(function(){
	$(".tab > li").click(function(){
		var count = $(this).index()+1;

		$(".tab > li").removeClass("active");
		$(this).addClass("active");

		$(".tab_a").hide();
		$(".tab_a"+count).show();
	});

	$(".accordion li a").click(function(){
		$(this).parent("li").toggleClass("active").siblings("li").removeClass("active");
		$(this).siblings(".accordion_cont").slideToggle().parent("li").siblings().children(".accordion_cont").slideUp();
	});

});