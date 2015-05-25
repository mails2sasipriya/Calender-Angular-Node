angular.module('myapp.services', []).factory('Calendar', function ($http) {
    var appts = [];
    return{
        save : function(data,id) {
            return $http.post('/'+ id, data).success(function (data) {
            });
        },
        getDay:function(id){
            return $http.get('/' + id);
        }
    }
});