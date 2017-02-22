import {
  updateEvents
} from './state/actions';

class dashboardController {
  constructor($scope, phaseService, $animate) {
    this.states = [];
    this.events = [];
    this.$scope = $scope;

    $scope.menuSelected = 'dashboard';
    this.phaseService = phaseService;
    this.update = false;

    $scope.$on('height', (e, data) => {
      this.height = data;
    });
    $scope.$on('state', (e, data) => {
      this.states.push(data);
      this.updateEvents();
    });
    $scope.$watch('$parent.startDate', startDate => {
      this.startDate = startDate;
      this.updateEvents();
    });
    $scope.$watch('$parent.endDate', endDate => {
      if ($scope.$parent.endDate.getHours() === 0) {
        $scope.$parent.endDate.setHours(23, 59, 59);
      }
      this.endDate = endDate;
      this.updateEvents();
    });
    $animate.enabled(false, document.querySelector('dashboard'));
    this.updateEvents();
  }

  globalDispatch(action) {
    this.states.forEach(state => {
      state.dispatch(action);
    });
  }

  updateEvents() {
    if (!this.update && this.startDate && this.endDate) {
      this.update = true;
      const globalDispatch = this.globalDispatch.bind(this);
      const $scope = this.$scope;
      this.phaseService.getEvents({
        start: $scope.$parent.startDate.getTime(),
        end: $scope.$parent.endDate.getTime()
      }, (err, events) => {
        this.update = false;
        if (err) {
          console.error('', err);
        } else {
          this.events = events;
          globalDispatch(updateEvents($scope.$parent.startDate, $scope.$parent.endDate, events));
        }
      });
    }
  }

}

export const dashboard = {
  templateUrl: 'app/dashboard/dashboard.html',
  controller: dashboardController,
  controllerAs: 'dashboard'
};

dashboardController.$inject = ['$scope', 'phaseService', '$animate'];
