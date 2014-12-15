// -------- DON'T FORGET TO CHANGE CALENDAR OUTPUT HTML!!!!! ----------

/**
  *  Create Calendar
  */
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
    this.generateHTML = function() {

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
        html += '<a href="javascript:void(0)" class="change-month" month="' + (parseInt(this.month) === 0 ? 11 : (parseInt(this.month) - 1)) + '" year="' + (parseInt(this.month) === 0 ? (parseInt(this.year) - 1) : this.year) + '"><<</a>';
        html +=  monthName + "&nbsp;" + this.year;
        html += '<a href="javascript:void(0)" class="change-month" month="' + (this.month == 11 ? 0 : (parseInt(this.month) + 1)) + '" year="' + (this.month == 11 ? (parseInt(this.year) + 1) : this.year) + '">>></a>';
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
                html += '<td';
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    html += ' date="' + this.year + '-' + (parseInt(this.month)+1) + '-' + day + '" class="calendar-day">';
                    html += day;
                    day++;
                } else {
                    html += '>';
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

// End of step Create Calendar

/**
  * Create Schedule Object
  */

function Schedule() {

    this.validateScheduleData = function() {
        var scheduleData = document.getElementsByClassName( 'timeValidate' );
        var validated = true;
        for ( var i = 0; i < scheduleData.length; i++ ) {
            var _this = scheduleData[i];
            if ( _this.value == '' ) {
                continue;
            }
            
            if ( !this.validateTime( _this.value ) ) {
                _this.setAttribute( 'class', 'red' );
                validated = false;
            }
        }
        return validated;
    };

    this.validateTime = function( value ) {
        var regex = /\d{1,2}\:\d{2}\ (am|pm)/;
        var pattern = new RegExp( regex );
        return pattern.test( value );
    }

};


/**
  * Create Employee Object
  */

function Employee() {

    // Creates or updates employee
    this.updateEmployee = function() {
        var schedule = new Schedule();
        if ( schedule.validateScheduleData() ) {

            this.saveEmployee();

        } else {

            alert( "There were errors with your time format. Please format 12:00 pm");

        }

    };
    
    // Gets attendance data from employee
    this.getEmployeeAttendance = function() {
        var attendanceApp = Employee.getAttendanceData();
        if ( this.employeeObj.name in attendanceApp ) {
            if ( 'attendance' in attendanceApp[this.employeeObj.name] ) {
                this.employeeObj.attendance = attendanceApp[this.employeeObj.name].attendance;
            }
        }
    };

    // Gathers all data for employee object
    this.getEmployeeObj = function() {

        var employeeObj = {};
        this.getEmployeeData();

        for ( var i in this.employeeData ) {

            employeeObj[i] = this.employeeData[i];

        }

        employeeObj[ 'schedule' ] = this.schedule;

        this.employeeObj = employeeObj;

    };

    // Pulls employee data excluding schedule from employee form
    this.getEmployeeData = function() {

        var employeeData = document.getElementsByClassName( 'employeeData' );
        var employee = {};

        for ( var i = 0; i < employeeData.length; i++ ) {

            employee[ employeeData[i].getAttribute( 'name' ) ] = employeeData[i].value;

        }

        this.getSchedule();
        this.employeeData = employee;

    };

    // Pulls schedule data from employee form
    this.getSchedule = function() {

        var scheduleData = document.getElementsByClassName( 'scheduleData' );
        var schedule = [];
        var tmpObj = {};

        for ( var i = 0; i < scheduleData.length; i += 2 ) {

            tmpObj = {
                inTime: scheduleData[i].value,
                outTime: scheduleData[ i + 1 ].value
            };

            schedule.push( tmpObj );

        }

        this.schedule = schedule;

    };

    // Store object in local storage
    this.saveEmployee = function() {

        var attendanceAppObj = Employee.getAttendanceData();

        this.getEmployeeObj();
        this.getEmployeeAttendance();
        attendanceAppObj[ this.employeeObj.name ] = this.employeeObj;

        localStorage.setItem( 'attendanceApp', JSON.stringify( attendanceAppObj ) );

    };

}

Employee.getAttendanceData = function() {
    return JSON.parse( localStorage.getItem( 'attendanceApp' ) );
};

Employee.fillEmployeeBasic = function( name, val ) {
    document.getElementsByName( name )[0].value = val;
};

Employee.fillEmployeeSchedule = function( data ) {
    var scheduleData = document.getElementsByClassName( 'scheduleData' );
    for ( var i = 0; i < data.length; i++ ) {
        scheduleData[ i * 2 ].value = data[ i ].inTime;
        scheduleData[ (i * 2) + 1 ].value = data[ i ].outTime;
    }
};


Employee.fillEmployeeForm = function() {

    var employee = document.getElementById('employees').value;
    var attendanceAppObj = Employee.getAttendanceData();
    var employeeData = attendanceAppObj[ employee ];

    for ( var i in employeeData ) {

        if ( i == 'schedule' ) {
            Employee.fillEmployeeSchedule( employeeData[ i ] );
        } else if ( i == 'attendance' ) {
            continue;
        } else {
            Employee.fillEmployeeBasic( i, employeeData[ i ] );
        }

    }

};



// End of Create Employee Objects


/**
  *  Add new attendance data
  */

function Attendance( employee ) {
    
    this.employee = employee;
    this.attendanceData = Employee.getAttendanceData();
    this.employeeData = this.attendanceData[ employee ];
    
    // Pull attendance record from user data
    if ( this.employeeData.hasOwnProperty('attendance') ) {
        this.attendance = this.employeeData['attendance'];
    } else {
        this.attendance = {};
    }
    
    // Check if date exists in dataset and return data if it does and return false if not
    this.getDateAttendance = function( date ) {
        if ( date in this.attendance ) {
            return this.attendance[date];
        } else {
            return false;
        }
    };
    
    // Update localStorage
    this.updateTimeData = function() {
        localStorage.setItem( 'attendanceApp', JSON.stringify( this.attendanceData ) );
    };
    
    // Create attendance form html and put it in the attendanceInputs div
    this.fillAttendanceForm = function( date ) {
        var attendance = this.getDateAttendance( date );
        var html = '';
        if ( attendance ) {
            dayTimes = attendance[ 'times' ];
            for( var i = 0; i < dayTimes.length; i++ ) {
                html += '<p><input type="text" class="attendanceTimes timeValidate" value="' + dayTimes[i].inTime + '" />';
                html += '<input type="text" class="attendanceTimes timeValidate" value="' + dayTimes[i].outTime + '" /><button class="deleteTime"> - </button></p>';
            }
        } else {
            html += '<p><input type="text" placeholder="9:00 am" class="attendanceTimes timeValidate" />';
            html += '<input type="text" placeholder="5:00 pm" class="attendanceTimes timeValidate" /><button class="deleteTime"> - </button></p>';
        }
        document.getElementById('attendanceInputs').innerHTML = html;
        deleteTimeListener();
    };
    
    // Create array of attendance data in form
    this.getAttendanceFormData = function() {
        var attendanceTimes = document.getElementsByClassName('attendanceTimes');
        var attendance = [];
        var tmpObj = {};
        for ( var i = 0; i < attendanceTimes.length; i += 2 ) {

            tmpObj = {
                inTime: attendanceTimes[i].value,
                outTime: attendanceTimes[ i + 1 ].value
            };
            
            attendance.push( tmpObj );

        }
        return attendance;
    };
    
    // Create time object from in and out times
    this.getTimeObject = function(inoutTimes) {
        var timeObj = {
            ampm: {},
            hours: {},
            minutes: {}            
        };
        var split = '';
        
        for ( var i in inoutTimes ) {            
            split = inoutTimes[i].split(' ');
            timeObj.ampm[i] = split[1];
            timeObj.hours[i] = split[1] == 'pm' ? parseInt(split[0].split(':')[0]) + 12 : parseInt(split[0].split(':')[0]);
            timeObj.minutes[i] = parseInt(split[0].split(':')[1]);
        }
        return timeObj;
    };
    
    // Compare times to schedule
    this.compareSchedule = function( day, compareTime ) {
        var daySchedule = this.employeeData.schedule[day];
        var scheduleTime = this.getTimeObject(daySchedule);
        var scheduleMinutes = {
            inTime: ( scheduleTime.hours.inTime * 60 + scheduleTime.minutes.inTime ) + 15,
            outTime: ( scheduleTime.hours.outTime * 60 + scheduleTime.minutes.outTime ) - 15
        };
        var compareMinutes = {
            inTime: ( compareTime.hours.inTime * 60 + compareTime.minutes.inTime ) + 15,
            outTime: ( compareTime.hours.outTime * 60 + compareTime.minutes.outTime ) - 15
        };
        var status = 'Present';
        if ( scheduleMinutes.inTime < compareMinutes.inTime ) {
            status = 'Late';
        } else if ( scheduleMinutes.outTime > compareMinutes.outTime ) {
            status = 'Early Leave';
        }
        return status;
    };
    
    // Determine the day's status
    this.getAttendanceStatus = function( date, record ) {
        var day = new Date( date ).getDay();
        var inTime = record[0].inTime;
        var outTime = '';
        if ( record[0].inTime == '') {
            return '';
        }
        if (record.length > 1) {
            outTime = record[record.length - 1].outTime;
        } else {
            outTime = record[0].outTime;
        }
        var timeObj = this.getTimeObject( {inTime: inTime, outTime: outTime} );
        return this.compareSchedule( day, timeObj );
    };
    
    // If times are formatted correctly returns form data array
    this.getFormAttendance = function() {
        var validated = new Schedule().validateScheduleData();
        if ( validated ) {
            return this.getAttendanceFormData();
        } else {
            return false;
        }
    };
    
    // Updates attendance data if it is validated
    this.updateAttendanceRecord = function( date ) {
        var newRecord = this.getFormAttendance();
        var excused = document.getElementById('excused').checked;
        var overwrite = document.getElementById('overwrite').checked;
        var requestOff = document.getElementById('requestOff').checked;
        var status = '';
        if (overwrite) {
            status = document.getElementById('overwriteStatus').value;
        } else {
            status = this.getAttendanceStatus( date, newRecord );
        }
        if ( newRecord ) {
            if ('attendance' in this.attendanceData[ this.employee ]) {
                if ( date in this.attendanceData[ this.employee ].attendance) {
                    this.attendanceData[ this.employee ].attendance[ date ].times = [];
                    for ( var i = 0; i < newRecord.length; i++) {
                        this.attendanceData[ this.employee ].attendance[ date ].times.push(newRecord[i]);
                    }
                    this.attendanceData[ this.employee ].attendance[ date ].excused = excused;
                    this.attendanceData[ this.employee ].attendance[ date ].overwrite = overwrite;
                    this.attendanceData[ this.employee ].attendance[ date ].status = status;
                    this.attendanceData[ this.employee ].attendance[ date ].requestOff = requestOff;
                } else {
                    this.attendanceData[ this.employee ].attendance[ date ] = {};
                    this.attendanceData[ this.employee ].attendance[ date ].times = newRecord;
                    this.attendanceData[ this.employee ].attendance[ date ].excused = excused;
                    this.attendanceData[ this.employee ].attendance[ date ].overwrite = overwrite;
                    this.attendanceData[ this.employee ].attendance[ date ].status = status;
                    this.attendanceData[ this.employee ].attendance[ date ].requestOff = requestOff;
                }
            } else {
                var tmpObj = {};
                tmpObj[date] = {
                    times: newRecord, 
                    status: status,
                    excused: excused,
                    overwrite: overwrite,
                    requestOff: requestOff
                };
                this.attendanceData[ this.employee ].attendance = tmpObj;
            }
            
            this.updateTimeData();
                
        } else {
            alert( "There were errors with your time format. Please format 12:00 pm");
        }
    };
    
    

// Check if date exists already
    // IF it exists Append attendance data
    // Else it doesn't exist, create new attendance date key
        // create times array
        // append the time in and time out data

// Update time data
    // Get attendance data and display in form
    // On submit it replaces the data

/**
  *  Binding attendance data to calendar
  */
    
    // Determine type of requestOff data, and set that information in the pop-up window
    this.parseRequestTime = function( data ) {
        var html = '';
        switch ( typeof( data ) ) {
            case 'boolean':
                if ( data ) {
                    html = '<div><p>This day was requested off.</p></div>';
                } else {
                    html = '<div><p>No requested time off.</p></div>';
                }
            break;
            case 'object':
                html = '<div><p>Time was requested of from: ' + data.timeStart + '-' + data.timeEnd + '.</p></div>';
            break;
            case 'string':
                html = '<div><p>' + data + 'was requested off.</p></div>';
            break;
        }
        document.getElementById('dayTimeOff').innerHTML = html;
    };
    
    // Puts all data from a day into pop-up window
    this.viewDay = function( date ) {
        var attendance = this.getDateAttendance( date );
        document.getElementById('currentDay').innerHTML = date;
        if ( attendance ) {
            for ( var i in attendance ) {
                switch ( i ) {
                    case 'times':
                        this.fillAttendanceForm( date );
                    break;
                    case 'requestOff':
                        this.parseRequestTime( attendance['requestOff'] );
                        document.getElementById(i).checked = attendance[i];
                    break;
                    case 'status':
                        document.getElementById(i).innerHTML = 'Attendance Status: ' + attendance[i];
                    break;
                    default:
                        document.getElementById(i).checked = attendance[i];
                    break;
                }
            }
        } else {
            document.getElementById('requestOff').checked = false;
            document.getElementById('excused').checked = false;
            document.getElementById('overwrite').checked = false;
            document.getElementById('attendanceInputs').innerHTML = '<p><input type="text" placeholder="9:00 am" class="attendanceTimes timeValidate" /><input type="text" placeholder="5:00 pm" class="attendanceTimes timeValidate" /></p>';
        }
    };
    
    // Binds calendar days to a click function and sets status class
    this.bindCalendarClick = function() {
        var calendarDays = document.getElementsByClassName('calendar-day');
        for ( var i = 0; i < calendarDays.length; i++ ) {
            /*var status = this.getDateAttendance( calendarDays[i].getAttribute('date') )['status'];
            addClass( calendarDays[i], status );*/ 
            var _this = this;
            calendarDays[i].addEventListener('click', function() {
                var cDay = document.getElementById('calendarDay');
                var date = this.getAttribute('date');
                clearDayView();
                removeClass( cDay, 'hide' );
                _this.viewDay( date );
            });
        }
    };

// Iterate through all elements with the class calendar-day
    // Insert attributes and values that correspond with that day
    // Add status class to elements to change CSS styles
    // Add click event listener

// On click pull up data
    // Pull all attributes and values from element
    // Create temp object to store this data
    // Create output html
    // Insert html into overlay

// On edit day submit
    // Pull all data from form
    // Already exists!
    /*this.saveDay = function( date ) {
        var attendanceTimes = document.getElementsByClassName('attendanceTimes');
        var attendance = [];
        var tmpObj = {};
        
        for(var i = 0; i < attendanceTimes.length; i += 2) {
            tmpObj = {
                timeIn: attendanceTimes[i],
                timeOut: attendanceTimes[i + 1]
            };
            attendance.push(tmpObj);
        }
        
        
    };
    */
    // Update employee attendance record
    // Remove temp object
}

// Adds an attendance field in day view form
Attendance.newAttendanceField = function() {
    var attendanceInputs = document.getElementById('attendanceInputs');
    var attendanceTimes = document.getElementsByClassName('attendanceTimes');
    var inputValues = getValues(attendanceTimes);
    var html = attendanceInputs.innerHTML;
    html += '<p><input type="text" placeholder="9:00 am" class="attendanceTimes timeValidate" />';
    html += '<input type="text" placeholder="5:00 pm" class="attendanceTimes timeValidate" /><button class="deleteTime"> - </button></p>';
    attendanceInputs.innerHTML = html;
    updateValues(attendanceTimes,inputValues);
    deleteTimeListener();
};

function calendarClasses( employee ) {
    this.employeeData = Employee.getAttendanceData()[employee];
    this.employeeSchedule = this.employeeData.schedule;
    if ( 'attendance' in this.employeeData ) {
        this.employeeAttendance = this.employeeData.attendance;
    } else {
        this.employeeAttendance = false;
    }    
    
    this.hasAttendanceData = function( date ) {
        // Determine if there is any data for given date
        if ( this.employeeAttendance ) {
            if ( date in this.employeeAttendance ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    
    this.isScheduledDay = function( date ) {
        // determines if they are scheduled
        var day = new Date( date + ' 00:00:00' ).getDay();
        if ( this.employeeSchedule[day].inTime != '' ) {
            return true;
        } else {
            return false;
        }
    };
    
    this.beforeStartDay = function( date ) {
        // determine if today is after date
        var dateArr = date.split('-');
        var startDate = new Date( this.employeeData.startDate + ' 00:00:00' );
        var year = parseInt( dateArr[0] );
        var month = parseInt( dateArr[1] );
        var day = parseInt( dateArr[2] );
        
        if ( year < parseInt( startDate.getFullYear() ) ) {
            return true;
        } else if ( month < parseInt( startDate.getMonth() ) + 1 
                   && year <= parseInt( startDate.getFullYear() ) ) {
            return true;
        } else if ( day < parseInt( startDate.getDate() ) 
                   && month <= parseInt( startDate.getMonth() ) + 1 
                   && year <= parseInt( startDate.getFullYear() ) ) {
            return true;
        } else {
            return false;
        }
    };
    
    this.isAfterDay = function( date ) {
        // determine if today is after date
        var dateArr = date.split('-');
        var currentDate = new Date();
        var year = parseInt( dateArr[0] );
        var month = parseInt( dateArr[1] );
        var day = parseInt( dateArr[2] );
        if ( year < parseInt( currentDate.getFullYear() ) ) {
            return true;
        } else if ( month < parseInt( currentDate.getMonth() ) + 1 
                   && year <= parseInt( currentDate.getFullYear() ) ) {
            return true;
        } else if ( day < parseInt( currentDate.getDate() ) 
                   && month <= parseInt( currentDate.getMonth() ) + 1 
                   && year <= parseInt( currentDate.getFullYear() ) ) {
            return true;
        } else {
            return false;
        }
    };
    
    this.getStatus = function( date ) {
        // collects all classes for this day.
        var classes = '';
        var today = new Date();
        var dateString = today.getFullYear() + '-' + parseInt( today.getMonth() ) + 1 + '-' + today.getDate();
        var statusClasses = {
            Present: 'present',
            Late: 'late',
            'Early Leave': 'earlyLeave',
            Absent: 'absent'
        };
        
        if ( !this.beforeStartDay( date ) ) {
            if ( this.isScheduledDay( date ) ) {
                if ( this.hasAttendanceData( date ) ) {
                    if ( this.employeeAttendance[date].requestOff ) {
                        return this.isAfterDay( date ) ? 'absent excused' : 'requestOff';
                    } else {
                        classes += statusClasses[this.employeeAttendance[date].status] + ' ';
                        classes += this.employeeAttendance[date].excused ? 'excused' : '';
                    }
                } else {
                    if ( this.isAfterDay( date ) == false ) {
                        return '';
                    } else {
                        return 'absent';
                    }
                }
            } else {
                return 'dayOff';
            }
        } else {
            return 'beforeStart';
        }
        
        return classes.trim();
    };
    
    this.updateCalendar = function() {
        var calendarDays = document.getElementsByClassName('calendar-day');
        for ( var  i = 0; i < calendarDays.length; i ++ ) {
            var classes = this.getStatus( calendarDays[i].getAttribute('date') );
            var elementClasses = calendarDays[i].setAttribute('class', 'calendar-day');
            addClass(calendarDays[i], classes);
        }
    };
}

/**
  *  Calculate and display stats
  */

// Calculate stats
    // Calculate status precentages based on total number of days in month
        // Days of perfect attendance
        // Days Late
        // Days Leave early
        // Days Absent
        // Days Requested Off
// Display Stats
    // Take all data and create output html in right sidebar area

// Framework? chart.js

// Extra Crap for now **********************************************************************

function deleteTimeListener() {
    var deleteTime = document.getElementsByClassName('deleteTime');
    for (var i = 0; i < deleteTime.length; i++) {
        deleteTime[i].addEventListener('click', function() {
            // Delete Time Data
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
    }
}

// Grab values from elements of specific class
function getValues(elements) {
    var values = [];
    for ( var i = 0; i < elements.length; i++ ) {
        values.push(elements[i].value);
    }
    return values;
}

function updateValues(elements, values) {
    for ( var i = 0; i < values.length; i++ ) {
        elements[i].value = values[i];
    }
}

// Hides
function hide(selector) {
    document.getElementById(selector).setAttribute('class', 'hide');
}

// returns list of employees
function getEmployees() {
    var attendanceData = Employee.getAttendanceData();
    var employees = [];
    for ( var i in attendanceData ) {
        employees.push(i);
    }
    return employees;
}

// Creates employee options html and sets them to select employee dropdown
function employeeSelectOptions() {
    var select = document.getElementById('employees');
    var name = select.value;
    var employees = getEmployees();
    var selectHTML = '<option value="">--Select Employee--</option>';
    for ( var i = 0; i < employees.length; i++ ) {
        selectHTML += '<option>' + employees[i] + '</option>';
    }
    select.innerHTML = selectHTML;
    select.value = name;
}

// Sets fields empty on array of elements
function clearFields(elements) {
    for( var i = 0; i < elements.length; i++ ) {
        elements[i].value = '';
    }
}

//Clears Day View
function clearDayView() {
    document.getElementById('currentDay').innerHTML = '';
    document.getElementById('status').innerHTML = '';
    document.getElementById('excused').innerHTML = '';
    document.getElementById('dayTimeOff').innerHTML = '';
    var attendanceTimes = document.getElementsByClassName('attendanceTimes');
    clearFields(attendanceTimes);
}

// Clears emeployee form
function clearEmployeeForm() {
    var basic = document.getElementsByClassName('employeeData');
    var schedule = document.getElementsByClassName('scheduleData');
    clearFields(basic);
    clearFields(schedule);
}

// Safely adds a class to an element
function addClass( element, className ) {
    var classAttr = element.getAttribute('class');
    if ( classAttr == '' || classAttr == 'undefined' ) {
        element.setAttribute( 'class', className );
    } else {
        element.setAttribute( 'class', className + ' ' + classAttr );
    }
}

// Safely removes class from an element.
function removeClass( element, className ) {
    var classAttr = element.getAttribute('class');
    var attrArr = classAttr.split(' ');
    var index = attrArr.indexOf( className );
    if ( index > -1 ){
      attrArr.splice(index, 1);
    }
    element.setAttribute( 'class', attrArr.join(' ') );
}

//Window onload
window.onload = function() {

    if ( typeof( Storage ) !== "undefined" ) {
        if ( localStorage.getItem( "attendanceApp" ) === null ) {
            localStorage.setItem( "attendanceApp", JSON.stringify( {} ) );
        }
    } else {
        alert( "Your browser doesn't support localStorage." );
        return false;
    }

    employeeSelectOptions();

    var cal = new Calendar();
    cal.generateHTML();
    document.getElementById('calendar').innerHTML = cal.getHTML();


    function newMonth() {
        var month = this.getAttribute('month');
        var year = this.getAttribute('year');
        var cal = new Calendar(month, year);
        var name = document.getElementById('employees').value;
        cal.generateHTML();
        document.getElementById('calendar').innerHTML = cal.getHTML();
        var changeMonth = document.getElementsByClassName('change-month');
        for ( var i = 0; i < changeMonth.length; i++) {
            changeMonth[i].addEventListener('click', newMonth);
        }
        var attendance = new Attendance( name );
        new calendarClasses( name ).updateCalendar();
    }// End of newMonth function

    var changeMonth = document.getElementsByClassName('change-month');
    for ( var i = 0; i < changeMonth.length; i++) {
        changeMonth[i].addEventListener('click', newMonth);
    }// End of changeMonth function

    document.getElementById('editEmployee').addEventListener('click', function() {
        document.getElementById('employeeLegend').innerHTML = 'Edit Employee';
        document.getElementById('newEmployeeForm').setAttribute('class', '');
        Employee.fillEmployeeForm();
    });

    document.getElementById('addEmployee').addEventListener('click', function() {
        document.getElementById('employeeLegend').innerHTML = 'Add New Employee';
        document.getElementById('newEmployeeForm').setAttribute('class', '');
        clearEmployeeForm();
    });

    document.getElementById('newEmployeeSubmit').addEventListener('click', function() {
        var employee = new Employee();
        employee.updateEmployee();
        hide('newEmployeeForm');
        employeeSelectOptions();
        clearEmployeeForm();
    });
    
    document.getElementById('employees').addEventListener('change', function() {
        var calendarDays = document.getElementsByClassName('calendar-day');
        var name = document.getElementById('employees').value;
        var editEmployee = document.getElementById('editEmployee');
        if ( name != '' ) {
            if ( editEmployee.hasAttribute('class') ) {
                editEmployee.removeAttribute('class');
            }
            var cal = new Calendar();
            cal.generateHTML();
            document.getElementById('calendar').innerHTML = cal.getHTML();
            var changeMonth = document.getElementsByClassName('change-month');
            for ( var i = 0; i < changeMonth.length; i++) {
                changeMonth[i].addEventListener('click', newMonth);
            }// End of changeMonth function
            var attendance = new Attendance( name );
            new calendarClasses( name ).updateCalendar();
            attendance.bindCalendarClick();
        } else {
            editEmployee.setAttribute('class', 'hide');
        }
    });
    
    document.getElementById('saveDay').addEventListener('click', function() {
        var employee = document.getElementById('employees').value;
        var date = document.getElementById('currentDay').textContent;
        attendance = new Attendance(employee);
        attendance.updateAttendanceRecord( date );
        attendance.viewDay( date );
        new calendarClasses( employee ).updateCalendar();
    });
    
    var close = document.getElementsByClassName('close');
    for (var i = 0; i < close.length; i++) {
        close[i].addEventListener( 'click', function() {
            hide(this.getAttribute('container'));
        });
    }
    
    document.getElementById('overwrite').addEventListener('change', function() {
        if ( this.checked ) {
            removeClass(document.getElementById('overwriteStatus'),'hide');
        } else {
            addClass(document.getElementById('overwriteStatus'),'hide');
        }
    });
    
    document.getElementById('addAttendanceInputs').addEventListener('click', function() {
        Attendance.newAttendanceField();
    });


}; // End of window.onload
