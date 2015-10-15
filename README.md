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

### Demo
http://www.bulgaria-web-developers.com/projects/javascript/calendar/

### Version
1.5

### License
CalendarJS is licensed under the **MIT** license.
