app.service('UserService', ['$http', '$localStorage', 'updateUserUrl', function ($http, $localStorage, updateUserUrl) {

    var user = [];

    this.login = function(){

    }

    this.logout = function(){

    }

    this.get = function(){
        return user;
    }

    //this.syncPlaylist = function(){
    //    if(typeof(user._id) !== "undefined") {
    //        $.extend(user, {'defaultPlaylist': $localStorage.playlist});
    //        $http.put(updateUserUrl + user._id, user)
    //            .success(function (response) {
    //                console.log(response);
    //            });
    //    }
    //}

    this.syncPlaylist = function(){
        $.extend(window.user, { 'defaultPlaylist': $localStorage.playlist});
        $http.put(updateUserUrl+window.user._id, window.user)
            .success(function (response) {
                console.log(response);
            });
    }
}]);