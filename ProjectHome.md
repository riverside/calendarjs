# Introduction #
CalendarJS is a simple but yet powerful calendar and datepicker component written in javascript with full featured API.



<img src='http://www.bulgaria-web-developers.com/blog/wp-content/uploads/2012/07/calendar.png' alt='CalendarJS' />

# Usage #
Include (or [download](http://code.google.com/p/calendarjs/downloads/list)) the following files in your page:
```
<script type="text/javascript" src="http://calendarjs.googlecode.com/svn/tags/1.5/calendar-1.5.min.js"></script>
<link type="text/css" rel="stylesheet" href="http://calendarjs.googlecode.com/svn/tags/1.5/themes/sky-blue/calendar.css" />
```
Put a container on your page (in this example I use **span**, but you could use whatever you want for inline calendars, and **input** for datepickers)
```
<span id="inlineCalendar"></span>
```
Example calendarJS calls:
```
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

# Demo #
[View demo](http://www.bulgaria-web-developers.com/projects/javascript/calendar/)