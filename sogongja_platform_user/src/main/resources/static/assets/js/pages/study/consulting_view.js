function watchingAdd(con_seq){

    var con_url = $("#con_url").val();

    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");

    let data = {
        "seq": con_seq
    }

    $.ajax({
        type: "POST",
        url: "/api/watchingAdd",
        async: false,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (res) {

            /*
            if(res.message == "login_check"){
                alert("로그인이 필요합니다.");
                window.location.href="/login";
                return;
            }else{
                window.open(res.edu_url, '_blank');
            }
             */
            window.open(con_url, '_blank');

        },
        error: function (request,status,error) {
            //alert(res.responseJSON.code);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

            return;

        }
    });
}