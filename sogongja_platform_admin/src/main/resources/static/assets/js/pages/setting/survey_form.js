
$(document).ready(function () {

	// 항목추가형, 항목 선택형
	$('.item_wrap02').hide();
	$('select[name=item_choice]').bind('change', function() {
		var val = $(this).val();
		if (val === 'item_add') {
			$('.item_wrap01').show();
			$('.item_wrap02').hide();
		} else {
			$('.item_wrap02').show();
			$('.item_wrap01').hide();
		}
	});


	// 답변항목 옵션 비/활성화 여부
	$("input:radio[name=bothChoice]").click(function(){
		if($("input:radio[name=bothChoice]:checked").val()=='yes'){
			$("#rankUse").attr("disabled", false);  //순위
			$("#numUse").attr("disabled", false);  // 최대수 체크

			// 최대수 체크 되어있을 때 (클릭 이벤트 먹지 않는것 방지)
			if($("#numUse").is(":checked")){
				$(".checkNum").attr("disabled", false);  // 최대수 변경 가능
			}else{
				$(".checkNum").attr("disabled", true);  // 최대수 변경 불가능
			}
		} else if($("input:radio[name=bothChoice]:checked").val()=='no') {
			$("#rankUse").attr("disabled",true);
			$("#numUse").attr("disabled", true);
			$(".checkNum").attr("disabled",true);
		}
	});

	// 최대 수의 숫자 input 비/활성화 여부
	$("#numUse").click(function(){
		if (this.checked) {
			$(".checkNum").prop("disabled",false);
		}
		else{
			$(".checkNum").prop("disabled",true);
		}
	});


	// 항목추가형 업종, 주소 선택 항목에 따라 보여주기
	$('.div2').hide();
	$('select[name=selectBox]').bind('change', function() {
		var val = $(this).val();
		if (val === 'option1') {
			$('.div1').show();
			$('.div2').hide();
		} else {
			$('.div2').show();
			$('.div1').hide();
		}
	});




	// 항목 선택형 태그삭제
	$('.del_tag').click(function(){
		$(this).parent().remove();
	});

	// 항목 선택형 리스트 삭제
	$('.del_item_button').click(function(){
		$(this).parent().remove();
	});



});

// 항목 선택형 중분류 태그 추가 버튼

// const showValue = () => {
// 	var target = document.getElementById("mach_02");
// 	if(target.options[target.selectedIndex].value === 0){
// 		alert('옵션값이 선택되지 않았습니다.');
// 	} else{
// 		alert('선택된 옵션 text 값=' + target.options[target.selectedIndex].text);
// 		alert('선택된 옵션 value 값=' + target.options[target.selectedIndex].value);
// 	}
// }
//
// let tagCount = 1;
// function create_tag(){
// 	let tagArea = document.getElementsByClassName('tag_wrap');
// 	let new_tag = document.createElement('span');
//
// 	new_tag.setAttribute('class', 'tag');
// 	new_tag.innerHTML = "<span class=\"tag_name\">" + '중분류' +
// 		"</span>" +
// 		"<span class=\"del_tag\" onclick='tagDel()'>" +
// 		"x" +
// 		"</span>";
//
//
// 	tagArea[0].appendChild(new_tag);
// 	//안전하게 DOM 요소를 불러와야 에러가 안난다 해당영역에 [0]을 붙여줄것
// 	tagCount++;
// }

// function tagDel(){
// 	let new_tag = document.createElement('span');
// 	new_tag.remove();
// }

var tags=[];
var tagCnt=0;
var tagNo=0;

$('#mach_02').change(function(){
	var tagName=$('#mach_02 option:selected').text();
	var tagCode=$('#mach_02 option:selected').val();
	var addtagDiv="";
	console.log(tagName);
	console.log(tagCode);

	if(tagCnt>=3){
		alert('태그는 3개까지만 가능합니다.');
		return false;
	}else if(tags.includes(tagCode)){
		alert('이미 선택한 태그입니다.');
		return false;
	}else if(tagCode === 0){
		alert('태그가 선택되지 않았습니다.');
		return false;
	}else{
		tags.push("positionAdd-deltagBtn"+tagCode);
		console.log(tags);

		addtagDiv='<div class="positionAdd-selectedtagBound">';
		addtagDiv+='<label class="positionAdd-selectedtag">';
		addtagDiv+=tagName+"</label>";
		addtagDiv+='<button type="button" id="positionAdd-deltagBtn'+tagCode+'" class="positionAdd-deltagBtn">';
		addtagDiv+='x</button></div>';

		console.log(addtagDiv);

		$('.tag_wrap').append(addtagDiv);
		tagCnt++;
		tagNo++;
	}
});


$(document).on('click', '.positionAdd-deltagBtn', function(){
	//배열에서 빼주고
	var tag=$(this).attr('id'); //형제의 텍스트값
	console.log(tag);
	console.log("인덱스: "+tags.indexOf(tag));
	tags.splice(tags.indexOf($(this)), 1); //배열에서 원소 제거
	//리무브 해주고
	$(this).parent().remove();
	tagCnt--;
});


var items=[];
var itemCnt= 0;
var itemNo= 0;
function getInputValue(){
	var textValue = $('#text_list_input').val();
	var tagList = $('.positionAdd-selectedtag').text();

	if( textValue === '' || tagList === ''){
		alert('입력값이 비어있습니다.');
	}else{
		console.log(textValue);
		console.log(tagList);
	}
}






// 항목 선택형 대분류 중분류 관련 짓기
var mach = false;
function update_selected() {
	$("#mach_02").val(0);
	$("#mach_02").find("option[value!=0]").detach();

	// 중분류 클래스 = (.mach + 대분류 value 값)
	$("#mach_02").append(mach.filter(".mach" + $(this).val()));
}
$(function() {
	mach = $("#mach_02").find("option[value!=0]");
	mach.detach();

	$("#mach_01").change(update_selected);
	$("#mach_01").trigger("change");
});