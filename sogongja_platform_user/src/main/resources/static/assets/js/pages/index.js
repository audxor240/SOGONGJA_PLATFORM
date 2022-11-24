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
});


// 이벤트 팝업 설정
$( document ).ready(function() {
	cookiedata = document.cookie;
	if ( cookiedata.indexOf("ncookie=done") < 0 ){
		if(eventSeq != "") {
			document.getElementById('event_pop').style.display = "block";    //  팝업창 아이디
		}
	} else {
		document.getElementById('event_pop').style.display = "none";    // 팝업창 아이디
	}
});

function setCookie( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function closeWin() {
	document.getElementById('event_pop').style.display = "none";    // 팝업창 아이디
}

function todaycloseWin() {
	setCookie( "ncookie", "done" , 7 );     // 저장될 쿠키명 , 쿠키 value값 , 기간( ex. 1은 하루, 7은 일주일)
	document.getElementById('event_pop').style.display = "none";    // 팝업창 아이디

}
