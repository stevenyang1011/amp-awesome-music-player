app.controller('PlaylistController', ['$scope', 'angularPlayer', '$localStorage', function ($scope, angularPlayer, $localStorage) {
    $scope.volume = 50;
    angularPlayer.adjustVolumeSlider($scope.volume);
    $scope.$watch("volume", function(newValue, oldValue){
        if(newValue !== oldValue) {
            angularPlayer.adjustVolumeSlider(newValue);
        }
    });

    $scope.$on('angularPlayer:ready', function(){
        $localStorage.playlist.forEach(function(item,index){
            angularPlayer.addTrack(item);
        });
    });

    $scope.$on('player:playlist', function(event, data){
            $localStorage.playlist = data;
    });
}]);