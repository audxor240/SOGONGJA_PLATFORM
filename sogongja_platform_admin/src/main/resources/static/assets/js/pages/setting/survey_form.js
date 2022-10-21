let qNum = 1;
let qCount = 0;
let qList = [];
let qNumList = [];
let qSeqList = [];  //선택한 질문의 seq를 저장

if(qArr != ''){
	qSeqList = qArr.map(String);	//질문 추가할때 String 으로 저장되므로 형변환 해준다.
}
function changeQ() {

	let qName=$('#q_list option:selected').text();
	let qCode=$('#q_list option:selected').val();
	let qAdd = "";

	if(qCount>=20){
		alert('질문 최대 5개까지만 선택 가능합니다.');
		return false;
	}else if(qSeqList.includes(qCode)){
		alert('이미 선택한 질문입니다.');
		return false;
	} else {

		if(qCode != 0) {
			qNumList.push(qNum);
			qSeqList.push(qCode);
			let qWarp = qList.push(qCode);

			qAdd = '<div class="survey_list">';
			qAdd += '<label class="survey_text col-sm-10">';
			qAdd += qName + "</label>";
			qAdd += '<button type="button" value="'+qCode+'" id="qDelBtn' + qWarp + '" class="qDelBtn btn-danger btn col-sm-1">';
			qAdd += '-</button></div>';


			$('#survey_list_wrap').append(qAdd);
			qCount++;
			qNum++;

			console.log("qSeqList +++ "+qSeqList);
			$("#qSeqList").val(qSeqList);
		}
	}
}

$(document).on('click', '.qDelBtn', function(){
	//배열에서 빼주고
	let q=$(this).attr('id'); //형제의 텍스트값
	// console.log(q);
	// console.log("인덱스: " + qList.indexOf(q));

	qList.splice(qList.indexOf($(this)), 1); //배열에서 원소 제거
	qNumList.splice(qNumList.indexOf($(this)), 1); //배열에서 원소 제거

	//배열의 요소 타입이 number라 형변환 필요
	qSeqList.splice(qSeqList.indexOf($(this).val()), 1); //배열에서 원소 제거

	//리무브 해주고
	$(this).parent().remove();
	qCount--;
	qNum--;
	console.log("qSeqList --- "+qSeqList);
	$("#qSeqList").val(qSeqList);
});

<!--미리보기-->
$(document).ready(function() {
	var modal = document.getElementById('dtsch_modal');
	var btn = document.getElementById("view_rescan");
	var close = document.getElementsByClassName("modal_close")[0];

	//미리보기 버튼클릭시 모달창 block
	btn.onclick = function() {

		if($(".survey_list").length == 0){
			alert("질문을 하나 이상 추가해 주세요");
			return false;
		}
		//let qSeqStr = qSeqList.toString();
		let qSeqArr = qSeqList;
		let data = {
			"qSeqArr": qSeqArr
		};

		var token = $("meta[name='_csrf']").attr("content");
		var header = $("meta[name='_csrf_header']").attr("content");

		$.ajax({
			type: "POST",
			url: "/survey/preview",
			async: false,
			data: JSON.stringify(data),
			//contentType:"application/json; charset=utf-8",
			//dataType:"json",
			//data: data,
			beforeSend: function (xhr) {
				xhr.setRequestHeader(header, token);
			},
			error: function (res) {

				let fragment = res.responseText
				$("#dtsch_modal").replaceWith(fragment);
				$("#dtsch_modal").show();
				//alert(res.responseJSON.message);
				return false;
			}
		}).done(function (fragment) {
			//여기로 안들어옴.....
			$("#dtsch_modal").replaceWith(fragment);
			$("#dtsch_modal").show();
			//$(".loading_box").hide();

		});
		//modal.style.display = "block";
	}
	// close_btn클릭시 모달창none
	close.onclick = function() {
		modal.style.display = "none";
	}
	// 모달창외 클릭시 모달 닫힘
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
});

function preview_close(){
	$("#dtsch_modal").hide();
}

function validationForm(){

	if(qSeqList.length == 0){
		alert("질문을 하나 이상 추가해 주세요");
		return false;
	}

	$("#qSeqList").val(qSeqList);

}
