$(function() {
    'use strict'

    var calendarEvents1 = {
        id: 1,
        backgroundColor: 'rgba(241,0,117,.25)',
        borderColor: '#f10075',
        events: eventData1
    };

    // initialize the calendar
    $('#fullcalendar').fullCalendar({
        locale: 'ko-kr',
        header: {
            left: 'prev,today,next',
            center: 'title',
            right: 'month,listMonth'
        },
        editable: false,
        droppable: false, // this allows things to be dropped onto the calendar
        dragRevertDuration: 0,
        defaultView: 'month',
        eventLimit: true, // allow "more" link when too many events
        eventSources: [calendarEvents1]
    });

    $('button.fc-prev-button, button.fc-next-button, button.fc-today-button').on('click', function() {
        var date = $('#fullcalendar').fullCalendar('getDate');
    });
});