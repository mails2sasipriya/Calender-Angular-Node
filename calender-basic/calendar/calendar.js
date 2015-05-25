angular.module('calendarApp.calendar', ['calendar.directives', 'calendarApp.scheduler']).filter('convertToMonth', function () {
    return function (num) {
        var _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return _months[num];
    }
});