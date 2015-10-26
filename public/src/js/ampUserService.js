app.service('UserService', ['$rootScope', '$http', '$localStorage', 'angularPlayer', 'userLoginUrl', 'userLogoutUrl', 'userSingupUrl', 'userPlaylistUrl', function ($rootScope, $http, $localStorage, angularPlayer, userLoginUrl, userLogoutUrl, userSingupUrl, userPlaylistUrl) {
    var self = this;

    self.initPlaylist = function(user){
        if (user !== null && typeof(user.defaultPlaylist) !== 'undefined'){
            user.defaultPlaylist.forEach(function (item, index) {
                angularPlayer.addTrack(item);
            });
        }
        else if(typeof($localStorage.playlist) !== 'undefined' ) {
            $localStorage.playlist.forEach(function (item, index) {
                angularPlayer.addTrack(item);
            });
        }
    }

    self.login = function(email, password){
        $http.post(userLoginUrl, {
            'email': email,
            'password': password
        }).success(function (response) {
            if (response.code == '200' && response.user) {
                console.log(response);
                self.initPlaylist(response.user);
                self.syncPlaylist(response.user, $localStorage.playlist);
                $localStorage.playlist = [];
                $rootScope.$broadcast('userUpdated',response.user);
            }
            else{
                $rootScope.$broadcast('userUpdated',[]);
            }
        });
    }

    self.logout = function(user){
        $http.get(userLogoutUrl)
        .success(function (response) {
            if (response.code == '200') {
                console.log(response);
                angularPlayer.clearPlaylist(function(success) {
                    if(success){
                        $rootScope.$broadcast('userUpdated', []);
                    }
                });
            }
            else{
                $rootScope.$broadcast('userUpdated', user);
            }
        });
    }

    self.syncPlaylist = function(user, data){
        if(typeof(user._id) !== "undefined") {
            $.extend(user, {'defaultPlaylist': data});
            $http.put(userPlaylistUrl + user._id, user)
                .success(function (response) {
                    console.log(response);
                })
                .error(function(response){
                    console.log(response);
                });
        }
        else{
            $localStorage.playlist = data;
        }
    }

    self.update = function(user) {
        $http.put(userPlaylistUrl + user._id, user)
            .success(function (response) {
                console.log(response);
            });
    }
}]);