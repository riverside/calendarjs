/*!
 * CalendarJS v1.0
 *
 * Copyright 2011, Dimitar Ivanov (http://www.bulgaria-web-developers.com/projects/javascript/calendar/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL Version 3 
 * (http://www.opensource.org/licenses/gpl-3.0.html) license.
 * 
 * Date: Sun Jun 19 11:55:07 2011 +0200
 */
(function (window, undefined) {
	var now = new Date(),
		today = [now.getFullYear(), now.getMonth(), now.getDate()].join('-'),
		d = window.document;

	function Calendar(options) {
		this.isOpen = false;
		this.focus = false;
		this.opts = {
			year: new Date().getFullYear(),
			month: new Date().getMonth(),
			dayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			dayNamesFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			startDay: 0,
			weekNumbers: false,
			months: 1,
			inline: false,
			dateFormat: 'Y-m-d',
			onBeforeOpen: function () {},
			onBeforeClose: function () {},
			onOpen: function () {},
			onClose: function () {},
			onSelect: function () {}
		};
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				this.opts[key] = options[key];
			}
		}
		this.init.call(this);
	}
	/* Static functions */
	Calendar.Util = {
		addClass: function (ele, cls) {
			if (!this.hasClass(ele, cls)) {
				ele.className += ele.className.length > 0 ? " " + cls : cls;
			}
		},
		hasClass: function (ele, cls) {
			return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		removeClass: function (ele, cls) {
			if (this.hasClass(ele, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				ele.className = ele.className.replace(reg, ' ');
			}
		},
		addEvent: function (obj, type, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(type, fn, false);
			} else if (obj.attachEvent) {
				obj["e" + type + fn] = fn;
				obj[type + fn] = function () {
					obj["e" + type + fn](window.event);
				};
				obj.attachEvent("on" + type, obj[type + fn]);
			} else {
				obj["on" + type] = obj["e" + type + fn];
			}
		},
		getElementsByClass: function (searchClass, node, tag) {
			var classElements = [];
			if (node === null) {
				node = d;
			}
			if (tag === null) {
				tag = '*';
			}
			var els = node.getElementsByTagName(tag);
			var elsLen = els.length;
			var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
			for (var i = 0, j = 0; i < elsLen; i++) {
				if (pattern.test(els[i].className)) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		},
		getEventTarget: function (e) {
			var targ;
			if (!e) {
				e = window.event;
			}
			if (e.target) {
				targ = e.target;
			} else if (e.srcElement) {
				targ = e.srcElement;
			}
			if (targ.nodeType == 3) {
				targ = targ.parentNode;
			}	
			return targ;
		}
	};
	/* Private functions */
	function emptyRow(weekNumbers) {
		var i, cell, cols = weekNumbers ? 8 : 7,
			row = d.createElement('tr');
    	for (i = 0; i < cols; i++) {
    		cell = d.createElement('td');
    		Calendar.Util.addClass(cell, 'bcal-empty');
    		row.appendChild(cell);
    	}
    	return row;
	}
	/**
	 * @param Object obj
	 * @return Array
	 */
	function findPos(obj) {
		var curleft = 0, curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return [curleft, curtop];
		}
	}
	/**
	 * @param Number i
	 * @param Number month
	 * @return Number
	 */
	function getIndex(i, months) {
		if (i > 0 && i < months - 1) {
			return 0;
		} else if (i > 0 && i === months - 1) {
			return 2;
		} else if (i === 0 && i === months - 1) {
			return 3;
		} else if (i === 0 && i < months - 1) {
			return 1;
		}
	}
	/**
	 * Format date
	 * 
	 * @param String format
	 * @param Number date
	 * @return String
	 */
	function _formatDate(format, date) {
		
		function pad(input) {
			return (input + "").length === 2 ? input : "0" + input;
		}
		
		var i, len, f, 
			output = [], 
			dt = new Date(date);
		for (i = 0, len = format.length; i < len; i++) {
			f = format.charAt(i);
			switch (f) {
			case 'Y':
				output.push(dt.getFullYear());
				break;
			case 'y':
				output.push((dt.getFullYear() + "").slice(-2));
				break;
			case 'm':
				output.push(pad(dt.getMonth() + 1));
				break;
			case 'n':
				output.push(dt.getMonth() + 1);
				break;
			case 'F':
				output.push(this.opts.monthNamesFull[dt.getMonth()]);
				break;
			case 'M':
				output.push(this.opts.monthNames[dt.getMonth()]);
				break;
			case 'd':
				output.push(pad(dt.getDate()));
				break;
			case 'j':
				output.push(dt.getDate());
				break;
			case 'D':
				output.push(this.opts.dayNamesFull[dt.getDay()].slice(0, 3));
				break;
			case 'l':
				output.push(this.opts.dayNamesFull[dt.getDay()]);
				break;
			default:
				output.push(f);
			}
		}
		return output.join("");
	}
	
	Calendar.prototype = {
		/**
		 * @return Instance of calendar
		 */
		init: function () {
			var self = this,
				i = 0, attrname,
				body = d.getElementsByTagName("body")[0],
				div = d.createElement('div'),
				elem;
			self.id = Math.floor(Math.random() * 9999999);
			elem = d.getElementById(self.opts.element);
			if (!elem) {
				return;
			}
			div.setAttribute('id', ['bcal-container', self.id].join('-'));
			Calendar.Util.addClass(div, 'bcal-container');
			if (!self.opts.inline) {
				div.style.display = 'none';
				div.style.position = 'absolute';
				Calendar.Util.addEvent(elem, 'focus', function (e) {
					if (self.isOpen) {
						self.close();
					} else {
						self.open();
					}
				});
				Calendar.Util.addEvent(elem, 'blur', function (e) {
					if (self.isOpen && !self.focus) {
						self.close();
					}
				});
				Calendar.Util.addEvent(elem, 'keydown', function (e) {
					var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
					switch (key) {
						case 9: //Tab
							self.close();
							break;
						case 27: //Escape
							self.close();
							break;
					}
				});
				Calendar.Util.addEvent(document, "mousedown", function (e) {
					var target = Calendar.Util.getEventTarget(e);
					if (target.className == "bcal-container" || 
						target.className == "bcal-table" || 
						target.className == "bcal-date" || 
						target.className == "bcal-today" || 
						target.className == "bcal-empty" || 
						target.className == "bcal-selected" || 
						target.className == "bcal-week" ||
						target.className == "bcal-nav" ||
						target.className == "bcal-navi" || 
						target.className == "bcal-month" || 
						target.className == "bcal-wday" || 
						target.className == "bcal-wnum" ||
						target.parentNode.className == "bcal-container" ||
						target.parentNode.className == "bcal-table") {
						
					} else {
						self.close();
					}
				});
				body.appendChild(div);
			} else {
				elem.appendChild(div);
			}
			var y = self.opts.year, m = self.opts.month;
			for (i = 0; i < self.opts.months; i++) {
				self.draw(y, m + i, getIndex(i, self.opts.months));
			}
			return self;
		},
		/**
		 * @param String key
		 * @param Mixed value
		 * @return void
		 */
		set: function (key, value) {
			this[key] = value;
		},
		/**
		 * @param String format
		 * @param Number date
		 * @return String
		 */
		formatDate: function () {
			return _formatDate.apply(this, arguments);
		},
		/**
		 * @param Number year
		 * @param Number month
		 * @param Number index (0 - without navigation, 1 - prev navigation, 2 - next navigation, 3 - prev and next navigation)
		 * @param Number id
		 */
		draw: function (year, month, index, id) {
			var self = this,
				autoId = typeof id === 'undefined' ? Math.floor(Math.random() * 9999999) : id,
				firstOfMonth = new Date(year, month, 1),
				daysInMonth = new Date(year, month + 1, 0).getDate(),
				startDay = firstOfMonth.getUTCDay(),
				first = firstOfMonth.getDay(),
				i, day, date, rows = 0, cols = self.opts.weekNumbers ? 8 : 7,
				div = d.getElementById(['bcal-container', self.id].join('-')),
				table = d.createElement('table'),
				thead = d.createElement('thead'),
				tbody = d.createElement('tbody'),
				row, cell, text, a, b, jsdate, current,
				s_arr, si, slen;
			
			row = d.createElement('tr');
			cell = d.createElement('th');
			if (index === 1 || index === 3) {
				Calendar.Util.addEvent(cell, 'click', function (e) {
					div.innerHTML = '';
					/*for (i = self.months; i > 0; i--) {
						self.draw(year, month - i, getIndex(i, self.months));
					}*/
					for (i = 0; i < self.opts.months; i++) {
						self.draw(year, month - self.opts.months + i, getIndex(i, self.opts.months));
					}
				});
				cell.style.cursor = 'pointer';
				Calendar.Util.addClass(cell, "bcal-nav");
				text = d.createTextNode('<');
				cell.appendChild(text);
			} else {
				Calendar.Util.addClass(cell, "bcal-navi");
			}
			row.appendChild(cell);
			
			cell = d.createElement('th');
			cell.setAttribute('colspan', cols === 7 ? 5 : 6);
			Calendar.Util.addClass(cell, "bcal-month");
			cell.appendChild(d.createTextNode(self.opts.monthNamesFull[firstOfMonth.getMonth()] + ' ' + firstOfMonth.getFullYear()));
			row.appendChild(cell);
			
			cell = d.createElement('th');
			if (index === 2 || index === 3) {
				cell.style.cursor = 'pointer';
				Calendar.Util.addClass(cell, "bcal-nav");
				text = d.createTextNode('>');
				Calendar.Util.addEvent(cell, 'click', function (e) {
					div.innerHTML = '';
					for (i = 0; i < self.opts.months; i++) {
						self.draw(year, month + i + 1, getIndex(i, self.opts.months));
					}
				});
				cell.appendChild(text);
			} else {
				Calendar.Util.addClass(cell, "bcal-navi");
			}
			row.appendChild(cell);
			thead.appendChild(row);
			
			row = d.createElement('tr');
			if (self.opts.weekNumbers) {
				cell = d.createElement('th');
				cell.appendChild(d.createTextNode('wk'));
				Calendar.Util.addClass(cell, "bcal-wnum");
				row.appendChild(cell);
			}
					
			for (i = 0; i < 7; i++) {
				cell = d.createElement('th');
				text = d.createTextNode(self.opts.dayNames[(self.opts.startDay + i) % 7]);
				Calendar.Util.addClass(cell, "bcal-wday");
				cell.appendChild(text);
				row.appendChild(cell);
			}
			thead.appendChild(row);
			table.appendChild(thead);
			
			day = self.opts.startDay + 1 - first;
			while (day > 1) {
	    	    day -= 7;
	    	}
	    	while (day <= daysInMonth) {
	    		jsdate = new Date(year, month, day + startDay);
	    		//jsdate = new Date(self.opts.year, self.opts.month, day + startDay);
	    	    row = d.createElement('tr');
	    	    if (self.opts.weekNumbers) {
	    	    	cell = d.createElement('td');
	    	    	Calendar.Util.addClass(cell, 'bcal-week');
	    	    	a = new Date(jsdate.getFullYear(), jsdate.getMonth(), jsdate.getDate() - (jsdate.getDay() || 7) + 3);
	    	    	b = new Date(a.getFullYear(), 0, 4);
	    	    	cell.appendChild(d.createTextNode(1 + Math.round((a - b) / 864e5 / 7)));
	    	    	row.appendChild(cell);
	    	    }

	    	    for (i = 0; i < 7; i++) {
	    	    	cell = d.createElement('td');
	    	    	if (day > 0 && day <= daysInMonth) {
	    	    		cell.setAttribute('bcal-date', new Date(year, month, day).getTime());
	    	    		//cell.setAttribute('bcal-date', new Date(self.opts.year, self.opts.month, day).getTime());
	    	    		Calendar.Util.addClass(cell, 'bcal-date');
	    	    		current = new Date(year, month, day);
	    	    		//current = new Date(self.opts.year, self.opts.month, day);
	    	    		if (today === [current.getFullYear(), current.getMonth(), current.getDate()].join('-')) {
	    	    			Calendar.Util.addClass(cell, 'bcal-today');
	    	    		}
	    	    		text = d.createTextNode(day);
	    	    		cell.appendChild(text);
	    	    		Calendar.Util.addEvent(cell, 'click', (function (self, cell) {
	    	    			return function () {
	    	    				s_arr = Calendar.Util.getElementsByClass('bcal-selected', null, 'td');
	    	    				for (si = 0, slen = s_arr.length; si < slen; si++) {
	    	    					Calendar.Util.removeClass(s_arr[si], 'bcal-selected');
	    	    				}
	    	    				Calendar.Util.addClass(cell, 'bcal-selected');
	    	    				var ts = parseInt(cell.getAttributeNode('bcal-date').value, 10);
		    	    			self.opts.onSelect.apply(d.getElementById(self.opts.element), [self.formatDate(self.opts.dateFormat, ts), ts, cell]);
		    	    			if (self.opts.element && !self.opts.inline) {
			    	    			self.close();
			    	    			d.getElementById(self.opts.element).value = self.formatDate(self.opts.dateFormat, ts);
		    	    			}
	    	    			};
	    	    		})(self, cell));
	    	    		
	    	    	} else {
	    	    		Calendar.Util.addClass(cell, 'bcal-empty');
	    	    	}
	    	    	row.appendChild(cell);
	        	    tbody.appendChild(row);
	    	    	day++;
	    	    }
	    	    rows++;
	    	}
	    	if (rows === 5)	{
	    		tbody.appendChild(emptyRow(self.opts.weekNumbers));
	    	} else if (rows === 4) {
	    		tbody.appendChild(emptyRow(self.opts.weekNumbers));
	    		tbody.appendChild(emptyRow(self.opts.weekNumbers));
	    	}
			
			Calendar.Util.addClass(table, 'bcal-table');
			table.setAttribute('id', ['bcal-table', autoId].join('-'));
			table.appendChild(tbody);
			
			Calendar.Util.addEvent(table, 'click', function (e) {
				self.set('focus', true);
			});
			
			var tbl = d.getElementById(['bcal-table', autoId].join('-'));
			if (tbl) {
				div.removeChild(tbl);
			}
			div.appendChild(table);
		},
		/**
		 * @return Instance of calendar
		 */
		open: function () {
			var self = this,
				div = d.getElementById(['bcal-container', self.id].join('-')),
				elem = d.getElementById(self.opts.element),
				pos = findPos(elem);
			self.opts.onBeforeOpen.apply(self, []);
			div.style.top = (pos[1] + elem.offsetHeight) + 'px';
			div.style.left = pos[0] + 'px';			
			div.style.display = '';
			self.opts.onOpen.apply(self, [elem]);
			self.isOpen = true;
			self.set('focus', true);
			return self;
		},
		/**
		 * @return Instance of calendar
		 */
		close: function () {
			var self = this;
			self.opts.onBeforeClose.apply(self, []);
			d.getElementById(['bcal-container', self.id].join('-')).style.display = 'none';
			self.opts.onClose.apply(self, []);
			self.isOpen = false;
			self.set('focus', false);
			return self;
		}
	};
	return (window.Calendar = Calendar);
})(window);