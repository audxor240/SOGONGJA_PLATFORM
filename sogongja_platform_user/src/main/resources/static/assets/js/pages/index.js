$(function(){
	var tab_cont = document.querySelectorAll(".tab_cont_a");
	for(var t = 0; t < tab_cont.length; t++){
		var tab_cont_list = tab_cont[t]
		var tab_id = tab_cont_list.getAttribute("id");
		var tab_click = document.querySelectorAll(".main_tab_li");
		for(var c=0; c < tab_click.length; c++){
			var tab_click_list = tab_click[c]
			var tab_click_data = tab_click[c].getAttribute("data-tab");
			tab_click[c].addEventListener("click",function(event){
				var tab_number = this.getAttribute("data-tab")
				var cont_id = document.querySelector("#"+tab_number);
				if(tab_number == cont_id.getAttribute("id")){
					this.classList.add("active");
					cont_id.classList.add("active");
					$(cont_id).siblings().removeClass("active");
					$(this).siblings().removeClass("active");
				}
			});
		}
	}
	$(".main_support .container ul li h4, .main_support .container ul li p").mouseover(function(){
		$(this).parent("li").addClass("over");
	});
	$(".main_support .container ul li h4, .main_support .container ul li p").mouseout(function(){
		$(this).parent("li").removeClass("over");
	});

	// 모바일 header
	$(window).on('scroll',function(){
		if($(window).scrollTop()){
			$('.m_header').addClass('on');
		}else{
			$('.m_header').removeClass('on');
		}
	});
	$(".h_btn").click(function(){
		$(".h_menu_wrap").toggleClass("side");
	});

	if($(".h_menu_wrap").hasClass("on") === true) {
		$('.m_header').addClass('on');
	} else {
		$('.m_header').removeClass('on');
	}
});


