$(function(){
	/*$(".tab > li").click(function(){
		var count = $(this).index()+1;
		$(".tab > li").removeClass("active");
		$(this).addClass("active");

		$(".tab_a").hide();
		$("#list_"+count).show();
		$("#type").val($(this).attr("id"));
	});*/

	$(".accordion li a").click(function(){
		$(this).parent("li").toggleClass("active").siblings("li").removeClass("active");
		$(this).siblings(".accordion_cont").slideToggle().parent("li").siblings().children(".accordion_cont").slideUp();
	});

	if(type == "GUIDE"){
		$(".tab > li").removeClass("active");
		$(".tab").find("li:eq(4)").addClass("active");

		$(".tab_a").hide();
		$("#list_1").show();
	}else{
		$(".tab > li").removeClass("active");
		$(".tab_a").hide();

		/*if(type === null){
			$("#list_1").show();
			$(".tab").find("#ALL").addClass("active");
		}else {
			switch (type) {
				case "ALL": $("#list_1").show(); break;
				case "CON": $("#list_1").show(); break;
				case "EDU": $("#list_1").show(); break;
				case "USER": $("#list_1").show(); break;
				case "GUIDE": $("#list_1").show(); break;
			}
			$(".tab").find("#"+type).addClass("active");
		}*/
		$("#list_1").show();
		$(".tab").find("#"+type).addClass("active");
	}

});