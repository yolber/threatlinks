class InfoController {
  constructor($scope) {
    this.events = [];
    $scope.$watch('entity.events', events => {
      this.events = events;
    });
  }
}

InfoController.$inject = ['$scope'];

function info() {
  return {
    restrict: 'E',
    templateUrl: 'app/entity/directives/info.html',
    controller: InfoController,
    controllerAs: 'info'
  };
}

export default info;
