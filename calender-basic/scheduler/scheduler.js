angular.module('calendarApp.scheduler', []).directive('scheduler', function () {
    return {
        templateUrl: 'scheduler/_scheduler.html',
        replace: true,
        scope: {
            blocks: '='
        },
        compile: function (element) {

            var time_blocks = [];
            for (var i = 0; i < 48; i++) {
                time_blocks.push(i * 0.5);
            }
            return {
                pre: function () {},
                post: function (scope, element, attrs) {
                    if (typeof scope.blocks === 'undefined')  {
                        scope.blocks = time_blocks;
                        console.log(scope.blocks);
                    }

                    scope.isSelecting = false;

                    scope.checkSelect = function (block) {
                        if (scope.isSelecting) {
                            var index = scope.blocks.indexOf(block);
                            element[0].lastElementChild.children[index].classList.add('active');
                        }
                    };

                    element[0].addEventListener('mousedown', function (event) {
                        scope.isSelecting = true;
                        if (event.target.classList.contains('schedules-block')) {
                            event.target.classList.add('active');
                        }
                    });

                    element[0].addEventListener('mouseup', function (event) {
                        console.log('mouseup');
                        scope.isSelecting = false;
                    });


                }
            }
        }
    };
}).filter('decimalTimeToHours', function () {
    return function (dt) {
        var time =/(\d+)[.]?(\d+)?/.exec(dt);
        var hours = time[1].length < 2 ? '0' + time[1] : time[1];
        var minutes = typeof time[2] === 'undefined' ? '00' : (+time[2] * 6).toString();

        minutes = minutes.length < 2 ? '0' + minutes : minutes;
        return hours + ':' + minutes;
    }
});