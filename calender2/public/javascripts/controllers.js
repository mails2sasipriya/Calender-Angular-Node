angular.module('myapp.controllers', ['myapp.services']).controller('MonthController', function($scope, $location){


    var months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    //$scope.days = getDaysAndDate('Apr');
 //   $scope.mymonth = 'May';
  //  $scope.myyear = 2014;

    // current date
    $scope.mydate = new Date();

   getMonth();



    // for next and prev years
    document.querySelector('#prev_year').addEventListener('click', function(){
        console.log("click for prev year");
        $scope.mydate = new Date($scope.mydate.getFullYear() - 1, $scope.mydate.getMonth());
        $scope.$apply(getMonth());

    });
    document.querySelector('#next_year').addEventListener('click', function(){
        console.log("click for next year");
        $scope.mydate = new Date($scope.mydate.getFullYear() + 1, $scope.mydate.getMonth());
        $scope.$apply(getMonth());

    });

    // for prev month
    document.querySelector('#prev_month').addEventListener('click', function(){
        console.log("click for prev month");
        $scope.mydate = new Date($scope.mydate.getFullYear(), $scope.mydate.getMonth() - 1);
        $scope.$apply(getMonth());

    });

    // for next month
    document.querySelector('#next_month').addEventListener('click', function(){
        console.log("click for next month");
        $scope.mydate = new Date($scope.mydate.getFullYear(), $scope.mydate.getMonth() + 1);
        $scope.$apply(getMonth());

    });


    function getMonth() {
        $scope.myyear = $scope.mydate.getFullYear();
        $scope.mymonth = months[$scope.mydate.getMonth()];

        firstSet = [];
        secondSet = getDaysAndDate($scope.myyear, $scope.mymonth);
        thirdSet = [];

        for (var i = 0; i < secondSet[0].weekday; i++) {
            firstSet.push({day: ''});
        }
        // empty spaces at the end of the month
        for (var i = 0; i < 6 - secondSet[secondSet.length - 1].weekday; i++) {
            thirdSet.push({day: ''});
        }
        $scope.firstSet = firstSet;
        $scope.secondSet = secondSet;
        $scope.thirdSet = thirdSet;

    }


    function getDaysAndDate(year, month) {

        var index = months.indexOf(month);

        $scope.firstdate = new Date(year, index, 1);
        console.log($scope.firstdate);
        $scope.lastdate = new Date(year, index + 1, 0);
        console.log($scope.lastdate);

        var obj = [];
        for(var i = 0; i < ( $scope.lastdate.getDate() - $scope.firstdate.getDate() + 1); i++) {
            var fullDate = new Date(year, index, i+1);
            obj.push({
                day: i + 1,
                weekday: fullDate.getDay()

            });

        }
        console.log(obj);
        return obj;

    }

    $scope.selectDay = function(day) {
        $location.path('/day/'+$scope.myyear +'/' + $scope.mymonth + '/' + day);
    }

}).controller('DayController', function($scope, CalendarService, $route){
    var months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];



    $scope.year = $route.current.params.year;
    $scope.month = $route.current.params.month;
    $scope.day = $route.current.params.day;
    $scope.timeSlots = getTimeSlots($scope.year,$scope.month,$scope.day);

    $scope.apptTitle = "";
    $scope.boxShow = false;
    $scope.activeMouse = false;


    CalendarService.getAll(function (data){
        if (data)
        {
            // For each appt
            for(var i=0; i< data.length; i++) {
                // Scan through slots to find matching start slot
                for (var j = 0; j < $scope.timeSlots.length; j++) {

                    // mongodb gives date as string, we convert it into data ibj using new Date()
                    // .getTime returns number of milliseconds since 1970/01/01
                    if ($scope.timeSlots[j].startTime.getTime() == (new Date(data[i].startTime).getTime())) {

                        startTimeSlot = $scope.timeSlots[j];
                        // Now match the ending time

                        for (var k=j; k<$scope.timeSlots.length; k++) {
                            if ($scope.timeSlots[k].endTime.getTime() == (new Date(data[i].endTime).getTime())) {
                                endTimeSlot = $scope.timeSlots[k];

                                //console.log("Bottom value is", $scope.timeSlots[k].rect.top + $scope.timeSlots[k].rect.height);
                                displayAppt(startTimeSlot,endTimeSlot,data[i]);
                                break;
                            }
                        }
                        break;
                    }
                }

            }

        }
    });


    console.log('FROM CONTROLLER : ', $scope);


    function getTimeSlots(year, month, day) {

        var timeSlotsList = [];
        intmonth = months.indexOf(month);
        for (var i = 0; i < 48; i++) {
            var slot = {};
            slot.startTime = (new Date(year, intmonth, day, i/2, ( i % 2) ? 30 : 0));
            slot.endTime = (new Date(year, intmonth, day, i/2, (( i % 2) ? 30 : 0) + 30));
            timeSlotsList.push(slot);

        }

        // get existing appts for this slot from mongod


        //  console.log(timeSlotsList);
        return timeSlotsList;
    }

    $scope.mouseDown = function(slot, event) {
        $scope.activeMouse = true;
        $scope.startSlot = slot;
        slot.class = "highlight";
        //  $scope.event =

    }

    $scope.mouseMove = function(slot, event) {
        if ($scope.activeMouse)
            slot.class = "highlight";
    }

    $scope.mouseUp = function(slot, event) {
        if ($scope.activeMouse)
        {
            $scope.endSlot = slot;
            slot.class = "highlight";
            $scope.activeMouse = false;
            $scope.reserveSlot(event);

        }
    }

    $scope.reserveSlot = function(event){
        console.log("test");

        $scope.boxShow = true;

        var apptBox = document.querySelector('#id_appt_box');
        apptBox.style.position = 'absolute';
        apptBox.style.left = event.currentTarget.offsetLeft + 130 + 'px';
        apptBox.style.top = event.currentTarget.offsetTop + 'px';
        $scope.currentSlot = event.currentTarget;
        // sets the times in appt box
        document.querySelector('#appt_time').textContent = weekdays[$scope.startSlot.startTime.getDay()] + ', '
        +  months[$scope.startSlot.startTime.getMonth()] + ' '
        +  $scope.startSlot.startTime.getDate() + ', '
        +  (($scope.startSlot.startTime.getHours() % 12 == 0) ? "12" : ($scope.startSlot.startTime.getHours() % 12))
        + ($scope.startSlot.startTime.getMinutes() == 0 ? "" : (':' + $scope.startSlot.startTime.getMinutes()))
        + ($scope.startSlot.startTime.getHours() > 11 ? 'pm' : 'am') + ' - '
        +  (($scope.endSlot.endTime.getHours() % 12 == 0) ? "12" : ($scope.endSlot.endTime.getHours() % 12))
        + ($scope.endSlot.endTime.getMinutes() == 0 ? "" : (':' + $scope.endSlot.endTime.getMinutes()))
        + ($scope.endSlot.endTime.getHours() > 11 ? 'pm' : 'am');

    };

    $scope.saveAppt = function() {

        var data = {};
        // we need to save the original date. new Date creates a copy
        data.startTime = new Date($scope.startSlot.startTime);
        data.endTime = new Date($scope.endSlot.endTime);

        console.log('start time without converting: ' , $scope.startSlot.startTime);
        // setMinutes is prop of Date obj
        //data.endTime.setMinutes(data.endTime.getMinutes() + 30);
        console.log('start time: ', data.startTime);
        console.log(data.endTime);
        data.title = $scope.apptTitle;

        CalendarService.create(data);
        $scope.boxShow = false;
        //$scope.currentSlot.querySelector(".appt-title").textContent = data.title;
        $scope.apptTitle = '';

        // once you save the appt, create a new box and display with the title and time

       displayAppt($scope.startSlot, $scope.endSlot,data);

    };

}).directive('onSlotCreate',[function() {
   /* return {
        link: function(scope,elem,attrs) {
            scope.slot["elem"] = elem[0];
        }
    }; */
    return {

        compile : function(elem, attr){
            return {
                pre: function(scope, elem, attr) {

                },
                post: function(scope, elem, attr) {
                    scope.slot["elem"] = elem[0];
                }
            }
        }
    }
}]);

// utility function
function displayAppt(startSlot, endSlot, appt){

  //  console.log('I am called with ' ,  startSlot, endSlot, appt);
   var weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var mytitle = weekdays[appt.startTime.getDay()] + ', ' + months[appt.startTime.getMonth()] + ' '+  appt.startTime.getDay() + ', ' +
        ((appt.startTime.getHours() % 12 == 0) ? "12" : (appt.startTime.getHours() % 12)) +
        ((appt.startTime.getMinutes() == 0 ? "" : (':' + appt.startTime.getMinutes()))) +
        (appt.startTime.getHours() > 11 ? 'pm' : 'am') +  ' to ' +
        ((appt.endTime.getHours() % 12 == 0) ? "12" : (appt.endTime.getHours() % 12)) +
        ((appt.endTime.getMinutes() == 0 ? "" : (':' + appt.endTime.getMinutes()))) +
        (appt.endTime.getHours() > 11 ? 'pm' : 'am') + '<br/>' + appt.title;



    var elem = createElement('div', document.getElementById("dayview"), mytitle, 'eventbox', '');
    elem.style.top = startSlot.elem.offsetTop + "px";
    elem.style.height = (endSlot.elem.getBoundingClientRect().bottom - startSlot.elem.getBoundingClientRect().top) + "px";


}

function createElement(type, parent, innerHTML, className, attrs) {
    var element = document.createElement(type);
    if (typeof parent !== 'undefined') parent.appendChild(element);
    if (typeof innerHTML !== 'undefined') element.innerHTML = innerHTML;
    if (typeof className !== 'undefined') element.className = className;
    if (typeof attrs !== 'undefined') {
        for (var prop in attrs) {
            element.setAttribute(prop, attrs[prop]);
        }
    }
    return element;
}

// make key
function makeKey(startTime, endTime){
    var key =  JSON.stringify(startTime.toJSON());
    //+ JSON.stringify(endTime.toJSON());
  //  console.log("Key ", key);
    return key;
}
