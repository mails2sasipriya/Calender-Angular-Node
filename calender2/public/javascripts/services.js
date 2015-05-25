angular.module('myapp.services', []).factory('CalendarService', function ($http) {

    return {

        appts: {},
        create : function(data) {

            data.key = makeKey(data.startTime, data.endTime);
            console.log('I got this data: ', data);


          return $http.post('/calendar', data).
                success(function(data, status) {
                    // this callback will be called asynchronously
                    console.log('from service ', data);

                }).
                error(function(data, status) {
                    console.log('Not able to save to Mongo', data);

                });

            /*   if(data.startTime.toJSON() in this.appts){
             this.appts[data.startTime.toJSON()] = data;
             }
             else {
             this.appts[data.startTime.toJSON()] = data;}
             */
//            this.appts[data.startTime.toJSON()] = data;
        },

        get : function(key, callback) {
           // console.log("Service key", key);
            return $http.get('/calendar/' + key).
                success(function(data, status){

                    console.log('Appt get ', data);
                    callback(data);
                }).
                error(function(data, status){
                    console.log('Not able to GET data From Mongo', data);
                });

        },

        getAll : function( callback) {
                // console.log("Service key", key);
                return $http.get('/calendar').
                    success(function(data, status){

                        console.log('Appt get ', data);
                        callback(data);
                    }).
                    error(function(data, status){
                        console.log('Not able to GET data From Mongo', data);
                    });

        }

    }

});