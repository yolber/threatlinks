import config from '../config';

class NetflowController {
  constructor($scope, entityService) {
    this.entityId = $scope.entity.entityId;
    this.entityService = entityService;
    this.startDate = $scope.entity.startDate;
    this.endDate = $scope.entity.endDate;
    this.alerts = [];
    this.data = [];
    this.max = 1;
    this.update = false;
    this.getNetflowData();
    $scope.$watch('entity.events', events => {
      this.processEventData(events);
    });
    $scope.$watch('entity.startDate', date => {
      this.startDate = date;
      this.getNetflowData();
    });
    $scope.$watch('entity.endDate', date => {
      this.endDate = date;
      this.getNetflowData();
    });
  }

  getNetflowData() {
    if (!this.update && this.startDate && this.endDate) {
      this.update = true;
      this.entityService.getNetflow(this.startDate.getTime(), this.endDate.getTime(), this.entityId, config.netflow.interval, (err, data) => {
        if (err) {
          console.error('🔥', err);
        } else {
          let max = -Infinity;
          data.forEach(e => {
            // e.timestamp *= 1000;
            e.timestamp = (new Date(e.timestamp)).getTime();
            max = e.number > max ? e.number : max;
          });
          this.max = max;
          this.data = data;
          this.update = false;
        }
      });
    }
  }

  processEventData(events) {
    const alerts = {};
    events.forEach(e => {
      if (!alerts[e.timestamp]) {
        alerts[e.timestamp] = [];
      }
      alerts[e.timestamp].push(e);
    });
    this.alerts = Object.keys(alerts).map(e => alerts[e]);
  }
}

NetflowController.$inject = ['$scope', 'entityService'];

function netflow() {
  return {
    restrict: 'E',
    templateUrl: 'app/entity/directives/netflow.html',
    controller: NetflowController,
    controllerAs: 'netflow'
  };
}

export default netflow;
