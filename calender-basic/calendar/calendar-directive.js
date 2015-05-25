
angular.module('calendar.directives', []).directive('calendar', function () {

    function createMonthArray(curr_date) {
        // create the month array according to the dates
        var month = [];
        // get the current date
        // var curr_date = new Date();
        // get the first day of this month
        var first_day = (new Date(curr_date.getFullYear(), curr_date.getMonth(), 1)).getDay();

        // get the last date
        var curr_last_date = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
        // get the last day
        var curr_last_day = curr_last_date.getDay();

        print('curr_date', 'first_day', 'curr_last_date', 'curr_last_day');

        // get the remaining dates of the last month
        var prev_last_date = (new Date(curr_date.getFullYear(), curr_date.getMonth(), 0)).getDate();
        for (var i = 0, len = first_day; i < len; i++) {
            month.unshift(new CustomDate(prev_last_date - i, 0));
        }
        //console.log(month);

        // add dates for the current month
        for (i = 1, len = curr_last_date.getDate(); i <= len; i++) {
            month.push(new CustomDate(i, 1));
        }
        //console.log(month);

        // get the remaining dates of the next month
        for (i = 0, len = 6 - curr_last_day; i < len; i++) {
            month.push(new CustomDate(i + 1, 2));
        }
        //console.log(month);

        // return the month
        return month;

        function print() {
             Array.prototype.slice.call(arguments).forEach(function (arg) {
             console.log(arg + ':' + eval(arg));
             });
         }

    }
    function CustomDate(date, monthType) {
        this.date = date;
        this.month_type = monthType; // 0 --> prev, 1--> curr, 2 --> next
    }


    return {
        templateUrl: 'calendar/_calendar.html',
        scope: {
            month: '='
        },
        compile: function (element, attrs) {
            return {
                pre: function () {},
                post: function (scope, element, attrs) {
                    var curr_date = new Date();
                    if (typeof scope.month === 'undefined') {
                        scope.month = curr_date.getMonth();// TODO: remove this as it will put a month property on whatever scope is in effect
                    }
                    if (typeof scope.year === 'undefined') {
                        scope.year = curr_date.getFullYear();// TODO: remove this as it will put a month property on whatever scope is in effect
                    }

                    var month_array = createMonthArray(new Date(scope.year, scope.month, 1));
                    scope.dates = month_array;
                    //console.log(scope.dates);
                    scope.$watch('month', function (newValue, oldValue) {
                        var month_array = createMonthArray(new Date(scope.year, scope.month, 1));
                        scope.dates = month_array;
                    });

                    element[0].firstElementChild.firstElementChild.firstElementChild.addEventListener('click', function (event) {
                        event.preventDefault();
                        var curr_month = scope.month - 1;
                        scope.$apply(function () {
                            if (curr_month < 0) {
                                scope.month = 11;
                                scope.year = scope.year - 1;
                            } else {
                                scope.month = curr_month;
                            }
                        });

                    });
                    element[0].firstElementChild.firstElementChild.lastElementChild.addEventListener('click', function (event) {
                        event.preventDefault();
                        var curr_month = scope.month + 1;
                        scope.$apply(function () {
                            if (curr_month > 11) {
                                scope.month = 0;
                                scope.year = scope.year + 1;
                            } else {
                                scope.month = curr_month;
                            }
                        });

                    });



                }
            }
        }
    }
});


