(function() {
  var app = angular.module('app', []);
  app.controller('MainController', function($scope) {
    $scope.devices = JSON.parse(localStorage.getItem("devices"));
    $scope.users = JSON.parse(localStorage.getItem("testers"));
    $scope.countries = JSON.parse(localStorage.getItem("countries"));
    $scope.possibleDevices = ["0"];
    $scope.possibleCountries = ['all'];
  });
  app.filter("testerFilter", function() {
    return function(users, devices, countries) {
      var filtered = [];

      if (countries.indexOf("all") === -1) {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          if (countries.indexOf(user.country) !== -1) {
            filtered.push(user);
          }
        }
      } else {
        filtered = users;
      }
      var userSort = null;
      if (devices.indexOf("0") !== -1 || devices.indexOf(0) !== -1) {
        userSort = function(a, b) {
          return b.bugs.length - a.bugs.length;
        }
        filtered.sort(userSort);
      } else {
        var deviceFilter = [];
        for (var i = 0; i < filtered.length; i++) {
          var bugCount = 0;
          var user = filtered[i];
          for (var it = 0; it < devices.length; it++) {
            var dId = devices[it];
            if (user['bugsByDevice'][dId]) {
              bugCount += user['bugsByDevice'][dId].length;
            }
          }
          if (bugCount > 0) {
            user.bugResult = bugCount;
            deviceFilter.push(user)
          }
        }
        filtered = deviceFilter;
        userSort = function(a, b) {
          return b.bugResult - a.bugResult;
        }

      }
      filtered.sort(userSort);

      return filtered;
    };
  });
  app.filter("deviceNames", function() {
    return function(deviceData) {
      var devices = [];
      var storedData = JSON.parse(localStorage.getItem("devices"));
      console.log(storedData);
      console.log(deviceData);
      for(var i = 0; i < deviceData.length; i++){
        var dId = deviceData[i].deviceId;
        devices.push(storedData[dId]);
      }
      return devices.join(", ");
    }
  })
})()
