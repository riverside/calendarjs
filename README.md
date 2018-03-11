# CalendarJS

### Introduction

A simple but yet powerful calendar and datepicker component written in javascript with full featured API.

### Example
```
<script type="text/javascript" src="https://github.com/riverside/calendarjs/blob/master/calendar-1.5.min.js"></script>
<link type="text/css" rel="stylesheet" href="https://github.com/riverside/calendarjs/blob/master/themes/sky-blue/calendar.css" />

<span id="inlineCalendar"></span>

<script type="text/javascript">
var cal_1 = new Calendar({
    element: 'inlineCalendar',
    inline: true,
    months: 3,
    dateFormat: 'm/d/Y',
    onSelect: function (element, selectedDate, date, cell) {
        //do something
    }
});
</script>
```
### Options

Option                | Type       | Default
-------               | ------     |-----------------------------
**year**              | *Number*   | new Date().getFullYear()
**month**             | *Number*   | new Date().getMonth()
**dayNames**          | *Array*    | ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
**dayNamesFull**      | *Array*    | ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
**monthNames**        | *Array*    | ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
**monthNamesFull**    | *Array*    | ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
**startDay**          | *Number*   | 0
**weekNumbers**       | *Boolean*  | false
**selectOtherMonths** | *Boolean*  | false
**showOtherMonths**   | *Boolean*  | true
**showNavigation**    | *Boolean*  | true
**months**            | *Numeric*  | 1
**inline**            | *Boolean*  | false
**disablePast**       | *Boolean*  | false
**dateFormat**        | *String*   | 'Y-m-d'
**position**          | *String*   | 'bottom'
**minDate**           | *Date*     | null
**onBeforeOpen**      | *Function* | function () {}
**onBeforeClose**     | *Function* | function () {}
**onOpen**            | *Function* | function () {}
**onClose**           | *Function* | function () {}
**onSelect**          | *Function* | function () {}
**onBeforeShowDay**   | *Function* | function () { return [true, '']; }

### Demo
https://projects.zinoui.com/calendar/

### Version
1.5

### License
Licensed under the **MIT** license.
