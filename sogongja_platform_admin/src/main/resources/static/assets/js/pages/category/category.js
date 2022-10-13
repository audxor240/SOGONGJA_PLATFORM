
// 지원기관 부분 태그 추가
function createList(){
    let obj = document.getElementById("otherCategory");
    let other_input = document.getElementById('otherCategory_input').value;

    let newList = document.createElement("li");
    newList.classList.add('list-group-item', 'list-group-item-action');

    newList.innerHTML += '<p>'+other_input+'</p>'
    newList.innerHTML += '<span class="del_btn">x</span>'

    console.log(newList);
    obj.appendChild(newList);
}

$(document).on('click', '.del_btn', function(){
    if (!confirm("해당 키워드를 삭제하시겠습니까?")) {
        return false
    } else {
        $(this).parent().remove();
    }

});