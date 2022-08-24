(function() {
    'use strict'
    $(document).ready(function() {
        if(ordby == 0){
        	$("#ordby").val("");
        }
        /*첨부파일 미리보기 다운로드 여부*/
        if($("#bannerSeq").val() == 0){
        	isDownImage = false;
        }
        
        //attachFiles
       	$("#attachFiles").on('change', function(e){
        	chgAddFile($(this),e);
        });
        
        $('#addfileView').on('click', function() {
        	if(isDownImage){
	        	window.location.href = "/setting/banner/downloadPcFile/"+$("#bannerSeq").val();
        	}
        });
        
        $('.btn-delete-file').on('click', function() {
            var fileSeq = $(this).data('file-seq');
            var _$this = $(this);
            
            if (confirm('파일을 삭제하시겠습니까?')) {
                var data = {
                    file_seq: fileSeq
                }

                ajaxPost('/file/delete', data, function(result) {
                    if (result.result_code == 200) {
                        showAlert('3');
                        _$this.closest('div.attach-file').remove();
                        // window.location.reload();
                    }
                });
            }
        });

        $(document).on('click', '.btn-delete-upload', function() {
        	deleteFile($(this));
        });
    });

})();

function addFileRow() {
    var strHTML = '';
    strHTML += '<div class="pt-2 attach-file">';
    strHTML += '  <input type="file" id="attachFiles" name="attachFiles" class="file-upload-default" accept="image/gif,image/jpeg,image/png">';
    strHTML += '  <div class="input-group col-xs-12">';
    strHTML += '    <input type="text" id="uploadFile" class="form-control file-upload-title" disabled="disabled" placeholder="">';
    strHTML += '    <span class="input-group-append">';
    strHTML += '      <button type="button" class="file-upload-browse btn btn-primary">파일선택</button>';
    strHTML += '      <button type="button" class="btn btn-danger btn-delete-upload ml-3">삭제</button>';
    strHTML += '    </span>';
    strHTML += '  </div>';
    strHTML += '</div>';
    $('div.attach-file-group:last').append(strHTML);
    //attachFiles
    $("#attachFiles").on('change', function(e){
    	chgAddFile($(this),e);
    });
}

function deleteFile(obj){
	isDownImage = false;
	$("#addfileView").css("cursor","default");
	obj.closest('div.attach-file').remove();
     if ($('.attach-file-group .attach-file').length === 0) {
   		$("#pcFilePath").val("");
   		$("#pcFileName").val("");
   		$("#addfileView").attr("src", "");
   		$("#addfileView").hide(); 
   		$("#preViewImgRow").hide(); 
        addFileRow();
    }
}

function chgAddFile(obj, e){
	var fileValue = obj.val().split("\\");
	var fileName = fileValue[fileValue.length-1]; // 파일명
	var ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
	ext = ext.toLowerCase();
	if( ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'jpeg'){
		$("#addfileView").show(); 
		$("#preViewImgRow").show(); 
	 	//alert(e.target.result);
	 	var bannerFiles = e.target.files;
	 	console.log("bannerFiles",bannerFiles);
	 	//이미지 미리보기
	 	var reader = new FileReader();
	 	reader.onload = function(e){
 	  		$("#addfileView").attr("src", e.target.result);
	 	}
	 	reader.readAsDataURL(bannerFiles[0]);
	 	$("#pcFileName").val(fileName);
	}else{
		alert("확장자가 jpg, png, gif인 이미지 파일만 첨부가능합니다.");
		deleteFile(obj);
		return;
	}
}

function validationForm() {
	if($("#linkUrl").val().indexOf("http") < 0){
		alert("배너 링크에 http 또는 https까지 모두 들어간 URL을 입력하시기 바랍니다.");
		$("#linkUrl").focus();
		return false;
	}
	if($("#pcFileName").val() == '' ){
		alert("배너 이미지를 첨부하시기 바랍니다.");
		return false;
	}
    return true;
}