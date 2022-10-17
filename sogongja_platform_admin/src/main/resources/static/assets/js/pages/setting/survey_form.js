
$(document).ready(function () {

	if($("select[name=questionType] option:selected").val() != "add"){
		$('.item_wrap01').hide();
		$('.item_wrap02').show();
	}else{
		$('.item_wrap01').show();
		$('.item_wrap02').hide();
	}

	// 항목추가형, 항목 선택형
	//$('.item_wrap02').hide();
	$('select[name=questionType]').bind('change', function() {
		var val = $(this).val();
		if (val === 'add') {
			$('.item_wrap01').show();
			$('.item_wrap02').hide();
		} else {
			$('.item_wrap02').show();
			$('.item_wrap01').hide();
		}
	});

	// 답변항목 옵션 비/활성화 여부
	$("input:radio[name=multipleUse]").click(function(){
		if($("input:radio[name=multipleUse]:checked").val()=='Y'){
			$("#rankChangeUse").attr("disabled", false);  //순위
			$("#maximumUse").attr("disabled", false);  // 최대수 체크

			// 최대수 체크 되어있을 때 (클릭 이벤트 먹지 않는것 방지)
			if($("#maximumUse").is(":checked")){
				$(".checkNum").attr("disabled", false);  // 최대수 변경 가능
			}else{
				$(".checkNum").attr("disabled", true);  // 최대수 변경 불가능
			}
		} else if($("input:radio[name=multipleUse]:checked").val()=='N') {
			$("#rankChangeUse").attr("disabled",true);
			$("#maximumUse").attr("disabled", true);
			$(".checkNum").attr("disabled",true);
		}
	});

	// 최대 수의 숫자 input 비/활성화 여부
	$("#maximumUse").click(function(){
		if (this.checked) {
			$(".checkNum").prop("disabled",false);
		}
		else{
			$(".checkNum").prop("disabled",true);
		}
	});

	// 항목추가형 업종, 주소 선택 항목에 따라 보여주기
	//$('.div2').hide();
	/*$('select[name=selectBox]').bind('change', function() {
		var val = $(this).val();
		if (val === 'option1') {
			$('.div1').show();
			$('.div2').hide();
		} else {
			$('.div2').show();
			$('.div1').hide();
		}
	});*/


	// 항목 선택형 태그삭제
	$('.del_tag').click(function(){
		$(this).parent().remove();
	});

	// 항목 선택형 리스트 삭제
	/*$('.del_item_button').click(function(){
		console.log("$(this).parent().html() :: "+$(this).parent().html());
		$(this).parent().remove();
	});*/

	$('select[id=mach_01]').bind('change', function() {
		var sel_val = $(this).val();

		$('#mach_02 option').hide();
		$('#mach_02 option[value*='+ sel_val +'_]').show();
		//$('#mach_02 option[value!='+ sel_val +']').not("[option[value=0]").hide();
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
var tags_arr=[];
var tagCnt=0;
var tagNo=0;
var answerArr=[];

$('#mach_02').change(function(){
	var tagName=$('#mach_02 option:selected').text();
	var tagCode=$('#mach_02 option:selected').val();
	var answer_array =  tagCode.split("_");
	var addtagDiv="";

	if(tagCnt>=3){
		alert('태그는 3개까지만 가능합니다.');
		return false;
	}else if(tags_arr.includes(tagName)){
		alert('이미 선택한 태그입니다.');
		return false;
	}else if(tagCode === 0){
		alert('태그가 선택되지 않았습니다.');
		return false;
	}else{
		tags.push("positionAdd-deltagBtn"+tagCode);
		tags_arr.push(tagName);
		answerArr.push(answer_array[1]);	//답변 시퀀스

		addtagDiv='<div class="positionAdd-selectedtagBound">';
		addtagDiv+='<label class="positionAdd-selectedtag">';
		addtagDiv+=tagName+"</label>";
		addtagDiv+='<button type="button" id="positionAdd-deltagBtn'+tagCode+'" class="positionAdd-deltagBtn">';
		addtagDiv+='x</button></div>';

		$('.tag_wrap').append(addtagDiv);
		tagCnt++;
		tagNo++;
	}
});

$(document).on('click', '.positionAdd-deltagBtn', function(){

	tags.splice(tags.indexOf($(this)), 1); //배열에서 원소 제거
	tags_arr.splice(tags_arr.indexOf($(this)), 1); //배열에서 원소 제거
	answerArr.splice(answerArr.indexOf($(this)), 1);
	//리무브 해주고
	$(this).parent().remove();
	tagCnt--;
});

$(document).on('click', '.del_item_button', function(){
	$(this).parent().remove();
	answerCnt --;
});

var items=[];
var itemCnt= 0;
var itemNo= 0;
var answerCnt= 0;
function getInputValue(){
	var textValue = $('#text_list_input').val();
	//var tagList = $('.positionAdd-selectedtag').text();
	var mach_01 = $("#mach_01").val();
	var mach_02 = $("#mach_02").val();

	//수정 폼 일 경우 답변의 갯수를 지정해준다.
	if($("[name=answerArr]").length != 0){
		answerCnt = $("[name=answerArr]").length;
	}

	if( textValue === ''){
		alert('입력값이 비어있습니다.');
		return;
	}

	if(mach_01 == "0"){
		alert("대분류를 선택해주세요.");
		return;
	}

	if(mach_02 == "0"){
		alert("중분류를 선택해주세요.");
		return;
	}

	if(answerCnt >= 5){
		alert("답변은 5개까지 설정 할 수 있습니다.");
		return;
	}

	var add_str = "<div class=\"flex_box item_list_wrap\" name='answerArr'>"+
				  "<div class=\"del_item_button\">\n" +
				  "	<button type=\"button\" class=\"btn\">-</button>\n" +
				  "</div>\n" +
				  "<div id=\"answer_"+answerCnt+"\" class=\"item_list\">\n" +
				  " <div>\n" +
				  " 	<p>"+textValue+"</p>\n" +
				  " </div>\n" +
				  " <div class=\"item_tag_wrap\">\n";
		for(var i = 0; i < tagCnt; i++){
			add_str += " 	<span name=\"matching_"+answerCnt+"\" class=\"item_tag\">"+tags_arr[i]+"<input type='hidden' id='answerSeq' value='"+answerArr[i]+"'></span>\n" ;
		}

	add_str += 	  " </div>\n";
	add_str += " </div>";
	add_str += "</div>";
	$("#answer_wrap").append(add_str);
	answerCnt++;

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
	//mach = $("#mach_02").find("option[value!=0]");
	//mach.detach();

	//$("#mach_01").change(update_selected);
	//$("#mach_01").trigger("change");
});

var answerObj = {};
var answerTitleList = Array();
var answerTagList = Array();
function validationForm(){
	let title = $("#title").val();
	let questionType = $("#questionType").val();

	if(title == ""){
		alert("질문 제목을 입력해주세요.");
		return false;
	}

	if(questionType == "choice") {
		if ($('[name=answerArr]').length == 0) {
			alert("답변 항목을 추가해주세요.");
			return false;
		}

		var cnt = 0;
		$('[name=answerArr]').each(function(){
			var tag = "";
			answerTitleList.push($(this).children("#answer_"+cnt).find('p').text());
			$("[name=matching_"+cnt+"]").find('input').each(function(){
				tag += $(this).val()+"|";

			});
			tag = tag.slice(0,-1);

			answerTagList.push(tag);
			cnt++;
		});

		$("[name=answerTitleList]").val(answerTitleList);
		$("[name=answerTagList]").val(answerTagList);
	}

}
