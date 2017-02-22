import State from '../state/state';
import {filterChart} from '../state/actions';

class TimeseriesController {
  constructor($scope) {
    this.state = new State($scope.phases, true);
    $scope.$emit('state', this.state);
    this.globalDispatch = $scope.$parent.$parent.dashboard.globalDispatch.bind($scope.$parent.$parent.dashboard);
  }

  filterBy(groupType, selection) {
    this.globalDispatch(filterChart(groupType, selection));
  }
}

TimeseriesController.$inject = ['$scope'];

function timeseries() {
  return {
    restrict: 'E',
    scope: {
      events: "=",
      width: "="
    },
    templateUrl: 'app/dashboard/timeline/timeseries.html',
    controller: TimeseriesController,
    controllerAs: 'timeseries'
  };
}

export default timeseries;
