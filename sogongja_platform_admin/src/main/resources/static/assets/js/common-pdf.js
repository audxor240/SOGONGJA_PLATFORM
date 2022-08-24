$(function() {
    'use strict'

    $('#btn-pdf').on('click', function() {
        var title = $(this).data('title').replace(/-/gi, '') + '.pdf';
        savePDF(title);
    });

    $('#btn-print').on('click', function() {
        var html = document.querySelector('html');
        var printContents = document.getElementById('printArea').innerHTML;
        var printDiv = document.createElement('DIV');
        printDiv.className = 'print-div';

        html.appendChild(printDiv);
        printDiv.innerHTML = printContents;
        document.body.style.display = 'none';
        window.print();
        document.body.style.display = 'block';
        printDiv.style.display = 'none';
    });

    $('.btn-close').on('click', function() {
        window.close();
    });
});

function savePDF(title) {

    html2canvas($('#printArea')[0], {
        scale: 3
    }).then(function(canvas) {
        var doc = new jsPDF('p', 'mm');
        var pageWidth = 210 // 캔버스 너비 mm
        var pageHeight = 295 // 캔버스 높이 mm
        var imgHeight = pageWidth * canvas.height / canvas.width;
        var position = 10;
        var imgData = canvas.toDataURL('image/jpeg', 1.0);
        // 첫 페이지 출력
        doc.addImage(imgData, 'JPG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
        var heightLeft = imgHeight;
        heightLeft -= pageHeight;

        // 한 페이지 이상일 경우 루프 돌면서 출력
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'JPG', 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        // 파일 저장
        doc.save(title);
    });
}