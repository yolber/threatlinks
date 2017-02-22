import State from '../state/state';
import config from '../config';

class PhaseController {
  constructor($scope) {
    this.phase = $scope.name;
    this.id = $scope.phaseId;
    this.state = new State(this.phase);
    $scope.height = 580;
    this.metadataHeight = $scope.height * config.metadata.height - 40;
    this.class = `phase-${this.id}`;
    this.height = $scope.height * (config.timeline.height + config.timeline.title + config.metadata.height);
    $scope.$emit('state', this.state);
  }
}

PhaseController.$inject = ['$scope'];

function phase() {
  return {
    restrict: 'E',
    scope: {
      name: "=name",
      phaseId: "=phaseId",
      events: "=events",
      color: "=color",
      width: "=width",
      height: "=height"
    },
    templateUrl: 'app/dashboard/timeline/phase.html',
    controller: PhaseController,
    controllerAs: 'phase'
  };
}

export default phase;
