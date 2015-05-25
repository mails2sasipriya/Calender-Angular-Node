angular.module('myapp.controllers', ['myapp.services']).controller('yearController', function ($scope, $location){
    $scope.year = '2015';
    $scope.months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    $scope.selectMonth = function (month){
        $location.path('/search/'+ $scope.year + '/' +  month);
        console.log(month);
        console.log($location.path);
    };

}) .controller('MyController', function ($scope, $location,$routeParams) {
    var months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.specificMonth = $routeParams.month;
    $scope.year = $routeParams.year;
    function getDaysAndDate(month) {
        var index = months.indexOf(month);
        var firstdate = new Date(2015, index, 1);
        var lastdate = new Date(2015, index + 1, 0);
        var obj = [];
        for(var i = 0 ; i < (lastdate.getDate() - firstdate.getDate() + 1); i ++){
            var whole = new Date(2015, index, i+1);
            obj.push({
                day:i + 1,
                weekDay:whole.getDay(),
                whole:new Date(2015,index,i+1)
            });
        }
        return obj;
    }
    $scope.days2 = getDaysAndDate($scope.specificMonth);
    $scope.days1 = [];
    for(var i= 0; i < $scope.days2[0].weekDay  - 0; i++){
        $scope.days1.push({day:'10'});
    }
    $scope.days3 = [];
    for(var i =0 ; i < 6 - $scope.days2[$scope.days2.length-1].weekDay; i++){
        $scope.days3.push({day:'10'})
    }
    $scope.weekdays =  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    $scope.selectDay = function (day){
        $location.path('/users/'+ $scope.year + '/' +  $scope.specificMonth  +  '/' + day);
        console.log($location.path);
    };

    var pre;
    if(months.indexOf($scope.specificMonth) === 0){
        pre = 11;
    }else{
        pre = months.indexOf($scope.specificMonth) - 1;
    }

    var next;
    if(months.indexOf($scope.specificMonth) === 11){
        next = 0;
    }else{
        next = months.indexOf($scope.specificMonth) + 1;
    }
    $scope.selectPre = function (){
        $location.path('/search/'+ $scope.year + '/' + months[pre]);
        console.log($location.path);
    };

    $scope.selectNext = function (){
        $location.path('/search/'+ $scope.year + '/' + months[next]);
        console.log($location.path);
    };
}).controller('MyController2', function ($scope,Calendar,$routeParams) {
    $scope.year = $routeParams.year;
    $scope.month = $routeParams.month;
    $scope.months = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.day = $routeParams.day;
    $scope.hours = ['0:00','0:30','1:00','1:30','2:00','2:30','3:00','3:30','4:00','4:30','5:00','5:30','6:00'];
    $scope.content = '';
    $scope.hour1 ='';
    $scope.hour2 ='';

    var arrays1 = [];
    var arrays2 = [];

    Calendar.getDay(+new Date($scope.year,$scope.months.indexOf($scope.month), $scope.day)).success(function(data){

        var timeslots = document.querySelectorAll('.oneHour');

        for(var i = 0 ; i <data.length ;i ++ ){
            arrays1 = data[i].startTime.split(':');
            arrays2 = data[i].endTime.split(':');

            if(arrays1[1] === '00'){
                arrays1[1] = 0;
            }else{
                arrays1[1] = 1;
            }


            if(arrays2[1] === '00'){
                arrays2[1] = 0;
            }else{
                arrays2[1] = 1;
            }


            var begin = arrays1[0] *2 + arrays1[1] ;
            var end = arrays2[0] *2 + arrays2[1]  + 1;



            for(var j = begin ; j < end; j ++){
                createElement('div',timeslots[j],data[i].content,'appointments');

                    timeslots[j].style.background = '#CE7CFF';

            }

        }
    });



    $scope.create = function(data){
        var resultDiv = document.querySelector('.result');
        resultDiv.style.display = 'block';
        $scope.content = data;
        createElement('div',resultDiv,'Today: ' + $scope.month + ' | ' + $scope.day + ' | ' + $scope.hour1 + '-' + $scope.hour2,'dateInfo');
        createElement('div',resultDiv,'The Appointment of Today is: ' + $scope.content,'');

        var backs= document.querySelectorAll('.purple');
        console.log(backs);
        for(var i = 0; i < backs.length; i++){
            backs[i].style.background = '#fff';
            backs[i].style.color = '#000';
            backs[i].className = 'oneHour';
        }

        var arrays3 = $scope.hour1.split(':');

        var appts = {};


        appts.startTime = $scope.hour1;
        appts.endTime = $scope.hour2;
        appts.startDate = +new Date($scope.year,$scope.months.indexOf($scope.month), $scope.day,arrays3[0],arrays3[1]);
        appts.date = +new Date($scope.year,$scope.months.indexOf($scope.month), $scope.day);
        appts.content = $scope.content;
        console.log(appts);
        Calendar.save(appts,appts.startDate);


        var timeslots = document.querySelectorAll('.oneHour');

            arrays1 = $scope.hour1.split(':');
            arrays2 = $scope.hour2.split(':');

            if(arrays1[1] === '00'){
                arrays1[1] = 0;
            }else{
                arrays1[1] = 1;
            }


            if(arrays2[1] === '00'){
                arrays2[1] = 0;
            }else{
                arrays2[1] = 1;
            }


            var begin = arrays1[0] *2 + arrays1[1] ;
            var end = arrays2[0] *2 + arrays2[1]  + 1;

            for(var i = begin; i < end; i ++){
                createElement('div',timeslots[i],$scope.content,'appointments');
            }



        };

    function createElement(type, parent, innerHTML, className) {
        var element = document.createElement(type);
        if (innerHTML) element.innerHTML = innerHTML;
        if (className) element.className = className;
        if (parent) parent.appendChild(element);
        return element;
    };
}).directive('nop',function(){
    return {
        compile: function (element, attrs) {
            return {
                pre: function (scope, iElement, attrs) {
                },
                post: function (scope, iElement, attrs) {
                    console.log(iElement[0]);
                    iElement[0].addEventListener('mousedown', function (e) {
                        function mousemove(event){
                            var dates = event.target;
                            dates.style.background = 'mediumpurple';
                            dates.style.color = '#fff';
                            dates.className = 'purple';

                        }
                        iElement[0].addEventListener('mousemove',mousemove) ;
                        iElement[0].addEventListener('mouseup',function(evt) {
                            console.log('THis is from the mouseup' );

                            var contentDiv = document.querySelector('.addContent');
                            contentDiv.style.display = 'block';
                            scope.$apply(function() {
                                scope.hour1 = e.target.innerHTML.trim().split(' ')[0].trim();
                                scope.hour2 = evt.target.innerHTML.trim().split(' ')[0].trim();
                            });
                            iElement[0].removeEventListener('mousemove',mousemove);
                        })

                    })
                }
            };
        }
    }
});