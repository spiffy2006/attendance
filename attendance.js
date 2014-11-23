// these are labels for the days of the week
cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date();

function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html = '';
  this.generateHTML = function(){

    // get first day of month
    var firstDay = new Date(this.year, this.month, 1);
    var startingDay = firstDay.getDay();

    // find number of days in month
    var monthLength = cal_days_in_month[this.month];

    // compensate for leap year
    if (this.month == 1) { // February only!
      if((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0){
        monthLength = 29;
      }
    }

    // do the header
    var monthName = cal_months_labels[this.month];
    var html = '<table class="calendar-table">';
    html += '<tr><th colspan="7">';
    html += '<a href="javascript::void(0);" class="change-month" month="' + (parseInt(this.month) === 0 ? 11 : (parseInt(this.month) - 1)) + '" year="' + (parseInt(this.month) === 0 ? (parseInt(this.year) - 1) : this.year) + '"><<</a>';
    html +=  monthName + "&nbsp;" + this.year;
    html += '<a href="javascript::void(0);" class="change-month" month="' + (this.month == 11 ? 0 : (parseInt(this.month) + 1)) + '" year="' + (this.month == 11 ? (parseInt(this.year) + 1) : this.year) + '">>></a>';
    html += '</th></tr>';
    html += '<tr class="calendar-header">';
    for(var i = 0; i <= 6; i++ ){
      html += '<td class="calendar-header-day">';
      html += cal_days_labels[i];
      html += '</td>';
    }
    html += '</tr><tr>';

    // fill in the days
    var day = 1;
    // this loop is for is weeks (rows)
    for (i = 0; i < 9; i++) {
    // this loop is for weekdays (cells)
      for (var j = 0; j <= 6; j++) {
        html += '<td class="calendar-day">';
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          html += day;
          day++;
        }
        html += '</td>';
      }
      // stop making rows if we've run out of days
      if (day > monthLength) {
        break;
      } else {
        html += '</tr><tr>';
      }
    }
    html += '</tr></table>';

    this.html = html;
  };

  this.getHTML = function() {
    return this.html;
  };
}
var cal = new Calendar();
cal.generateHTML();
document.getElementById('calendar').innerHTML = cal.getHTML();

function newMonth() {
  var month = this.getAttribute('month');
  var year = this.getAttribute('year');
  var cal = new Calendar(month, year);
  cal.generateHTML();
  document.getElementById('calendar').innerHTML = cal.getHTML();
  var changeMonth = document.getElementsByClassName('change-month');
  for ( var i = 0; i < changeMonth.length; i++) {
    changeMonth[i].addEventListener('click', newMonth);
  }
}

var changeMonth = document.getElementsByClassName('change-month');
for ( var i = 0; i < changeMonth.length; i++) {
  changeMonth[i].addEventListener('click', newMonth);
}
